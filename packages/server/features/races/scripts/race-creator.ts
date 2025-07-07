import { createScript } from '@kernel/script';
import { raceMaps, racePoints, raceStartPoints } from '@repo/db/schema';
import type { RaceMapDto, SharedRaceCreatorData } from '@repo/shared';
import { eq } from 'drizzle-orm';

export default createScript({
    name: 'race-creator',
    fn: ({ db, raceService, iplService, iplOptions, noClip, messenger, streamedMetaStore }) => {
        const playerLastPositions = new WeakMap<PlayerMp, Vector3>();
        const playerNoClipStates = new WeakMap<PlayerMp, { position: Vector3; heading: number }>();

        const onCreateMapAsync = async (player: PlayerMp, mapName: string, iplName: string) => {
            const ipl = iplOptions.entries.find((a) => a.name === iplName);
            if (ipl) {
                if (await iplService.loadAsync([player], iplName)) {
                    // Failed to load IPL, but we might still proceed without teleporting
                }
                playerLastPositions.set(player, player.position);
                player.position = new Vector3(ipl.position);
            }
            messenger.publish(player, 'race-menu-creator:createMap', { mapName, iplName });
        };

        const handleStop = (player: PlayerMp) => {
            player.alpha = 255;
            player.freezePosition(false);
            player.setInvincible(false);
            streamedMetaStore.delete(player, 'collision');
            noClip.stop(player);
            playerNoClipStates.delete(player);
            const position = playerLastPositions.get(player);
            if (position) {
                player.position = position;
                playerLastPositions.delete(player);
            }
            messenger.publish(player, 'race:creator:stop');
        };

        const handleChangeMode = (player: PlayerMp, mode: string) => {
            console.log('handleChangeMode', mode);
            if (mode === 'free') {
                if (noClip.isStarted(player)) return;
                player.alpha = 0;
                player.freezePosition(true);
                player.setInvincible(true);
                streamedMetaStore.set(player, 'collision', { toggle: false, keepPhysics: false });
                playerNoClipStates.set(player, { position: player.position, heading: player.heading });
                noClip.start(player);
            } else if (mode === 'normal') {
                tryStopNoClip(player);
            }
        };

        const handleSubmitAsync = async (player: PlayerMp, data: SharedRaceCreatorData) => {
            if (data.id === 0) {
                const newMap = await db
                    .insert(raceMaps)
                    .values({ name: data.name, iplName: data.iplName })
                    .returning({ id: raceMaps.id });

                const mapId = newMap[0].id;

                if (data.startPoints.length > 0) {
                    await db.insert(raceStartPoints).values(
                        data.startPoints.map((p, i) => ({
                            mapId,
                            index: i,
                            position: p.position,
                            rotation: p.rotation,
                        })),
                    );
                }
                if (data.racePoints.length > 0) {
                    await db.insert(racePoints).values(
                        data.racePoints.map((p, i) => ({
                            mapId,
                            index: i,
                            position: p.position,
                            radius: p.radius,
                        })),
                    );
                }
            } else {
                await db.update(raceMaps).set({ name: data.name }).where(eq(raceMaps.id, data.id));
                if (data.startPoints.length > 0) {
                    await db.delete(raceStartPoints).where(eq(raceStartPoints.mapId, data.id));
                    await db.insert(raceStartPoints).values(
                        data.startPoints.map((p, i) => ({
                            mapId: data.id,
                            index: i,
                            position: p.position,
                            rotation: p.rotation,
                        })),
                    );
                }
                if (data.racePoints.length > 0) {
                    await db.delete(racePoints).where(eq(racePoints.mapId, data.id));
                    await db.insert(racePoints).values(
                        data.racePoints.map((p, i) => ({
                            mapId: data.id,
                            index: i,
                            position: p.position,
                            radius: p.radius,
                        })),
                    );
                }
            }
            messenger.publish(player, 'race:creator:stop');
            tryStopNoClip(player);
        };

        const tryStopNoClip = (player: PlayerMp) => {
            if (!noClip.isStarted(player)) return;
            player.alpha = 255;
            player.freezePosition(false);
            player.setInvincible(false);
            streamedMetaStore.delete(player, 'collision');
            const state = playerNoClipStates.get(player);
            if (state) {
                player.position = state.position;
                player.heading = state.heading;
                playerNoClipStates.delete(player);
            }
            noClip.stop(player);
        };

        const handleDataAsync = async () => {
            const maps = await db.query.raceMaps.findMany({ columns: { id: true, name: true } });
            const ipls = iplOptions.entries.map((a) => a.name);
            return { maps, ipls };
        };

        const handleEditMapAsync = async (player: PlayerMp, id: number, type: string): Promise<RaceMapDto | null> => {
            if (raceService.races.some((r) => r.mapId === id) || raceService.tryGetRaceByParticipant(player)) {
                return null;
            }

            const map = await db.query.raceMaps.findFirst({
                where: eq(raceMaps.id, id),
                with: {
                    startPoints: type === 'start' ? { columns: { position: true, rotation: true } } : undefined,
                    racePoints: type === 'race' ? { columns: { position: true, radius: true } } : undefined,
                },
            });

            if (!map) return null;

            return {
                id: map.id,
                name: map.name,
                iplName: map.iplName ?? '',
                startPoints: map.startPoints ?? [],
                racePoints: map.racePoints ?? [],
            };
        };

        const handleDeleteMapAsync = async (player: PlayerMp, id: number) => {
            const result = await db.delete(raceMaps).where(eq(raceMaps.id, id));
            if (result.count > 0) {
                messenger.publish(player, 'race-menu-creator:deleteMap', id);
            }
        };

        // Register events
        messenger.on('playerQuit', (player) => {
            tryStopNoClip(player);
            playerLastPositions.delete(player);
        });
        messenger.on('race-menu-creator:createMap', onCreateMapAsync);
        messenger.on('race:creator:stop', handleStop);
        messenger.on('race:creator:changeMode', handleChangeMode);
        messenger.on('race:creator:submit', handleSubmitAsync);
        messenger.on('race-menu-creator:data', handleDataAsync);
        messenger.on('race-menu-creator:editMap', handleEditMapAsync);
        messenger.on('race-menu-creator:deleteMap', handleDeleteMapAsync);
    },
});

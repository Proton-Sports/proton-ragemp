import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';
import { userRaceRestorations, userRacePointRestorations } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import type { RacePrepareDto, RacePointDto, RaceHitDto, RaceStartDto } from '@repo/shared';
import { RaceStatus } from '@repo/shared';

export default createScript({
    name: 'race-restore',
    fn: ({ db, raceService, raceMapCache, racePointResolvers, iplService, messenger }) => {
        const onPlayerDisconnect = async (player: PlayerMp) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participant = race.participants.find((p) => p.player === player);
            if (!participant) return;

            raceService.removeParticipant(participant);

            if (race.status === RaceStatus.Preparing || race.status === RaceStatus.Started) {
                await save(race, participant);
            }
        };

        const save = async (race: Race, participant: RaceParticipant) => {
            const { position, heading } = participant.player;
            await db.insert(userRaceRestorations).values({
                userId: participant.player.protonId!,
                raceId: race.guid,
                lap: participant.lap,
                accumulatedDistance: participant.accumulatedDistance,
                partialDistance: participant.partialDistance,
                nextRacePointIndex: participant.nextRacePointIndex,
                finishTime: new Date(participant.finishTime),
                x: position.x,
                y: position.y,
                z: position.z,
                heading,
                vehicleModel: participant.vehicleModel,
            });

            if (participant.pointLogs.length > 0) {
                await db.insert(userRacePointRestorations).values(
                    participant.pointLogs.map((p) => ({
                        userId: participant.player.protonId!,
                        index: p.index,
                        lap: p.lap,
                        time: new Date(p.time),
                    })),
                );
            }
        };

        const onSignIn = async (player: PlayerMp) => {
            const restoration = await db.query.userRaceRestorations.findFirst({
                where: eq(userRaceRestorations.userId, player.id),
                with: {
                    points: true,
                },
            });

            if (!restoration) return;

            await db.delete(userRaceRestorations).where(eq(userRaceRestorations.userId, player.id));
            const race = raceService.races.find((r) => r.guid === restoration.raceId);
            if (!race) return;

            switch (race.status) {
                case RaceStatus.Preparing:
                    await restoreRacePreparing(player, race, restoration);
                    break;
                case RaceStatus.Started:
                    await restoreRaceStarted(player, race, restoration);
                    break;
            }
        };

        const restoreRaceStarted = async (player: PlayerMp, race: Race, restoration: any) => {
            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) return;
            const map = getMap.data;

            const resolver = racePointResolvers.find((r) => r.supportedRaceType === race.type);
            if (!resolver) return;

            const position = new mp.Vector3(restoration.x, restoration.y, restoration.z);
            player.position = position;
            player.heading = restoration.heading;
            player.dimension = race.id;

            const vehicle = mp.vehicles.new(restoration.vehicleModel, position, {
                heading: restoration.heading,
            });
            vehicle.dimension = race.id;
            player.putIntoVehicle(vehicle, 0);

            const participant: RaceParticipant = {
                player,
                vehicle,
                lap: restoration.lap,
                accumulatedDistance: restoration.accumulatedDistance,
                partialDistance: restoration.partialDistance,
                nextRacePointIndex: restoration.nextRacePointIndex,
                pointLogs: restoration.points.map((p: any) => ({
                    index: p.index,
                    lap: p.lap,
                    time: p.time,
                })),
                finishTime: restoration.finishTime,
                vehicleModel: restoration.vehicleModel,
                playerVehicleId: 0,
                ready: true,
                prizePercent: 0,
            };
            raceService.addParticipant(race.id, participant);

            if (participant.finishTime !== 0) return;

            if (map.iplName) {
                await iplService.loadAsync([player], map.iplName);
            }

            const prepareDto: RacePrepareDto = {
                endTime: race.startTime,
                raceType: race.type,
                dimension: race.id,
                racePoints: map.racePoints.map((p) => ({ position: p.position, radius: p.radius } as RacePointDto)),
                iplName: map.iplName,
                disableLoadingCheckpoint: true,
            };
            messenger.publish(player, 'race-prepare:mount', prepareDto);

            const output = resolver.resolve({
                index: participant.pointLogs[participant.pointLogs.length - 1]?.index ?? 0,
                lap: participant.lap,
                totalLaps: race.laps ?? 1,
                totalPoints: map.racePoints.length,
            });

            const hitDto: RaceHitDto = {
                lap: output.lap,
                index: output.index,
                nextIndex: output.nextIndex,
                finished: false,
            };
            messenger.publish(player, 'race:hit', hitDto);

            const startDto: RaceStartDto = {
                laps: race.laps ?? 1,
                ghosting: race.ghosting,
            };
            messenger.publish(player, 'race-start:start', startDto);
            messenger.publish(player, 'race-hud:mount');
        };

        const restoreRacePreparing = async (player: PlayerMp, race: Race, restoration: any) => {
            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) return;
            const map = getMap.data;

            const participant: RaceParticipant = {
                player,
                vehicle: undefined,
                lap: restoration.lap,
                vehicleModel: restoration.vehicleModel,
                playerVehicleId: 0,
                ready: true,
                finishTime: 0,
                nextRacePointIndex: 0,
                accumulatedDistance: 0,
                pointLogs: [],
                partialDistance: 0,
                prizePercent: 0,
            };

            const index = race.participants.length;
            const point = map.startPoints[index];
            if (!point) return;

            if (map.iplName) {
                await iplService.loadAsync([player], map.iplName);
            }

            const vehicle = mp.vehicles.new(participant.vehicleModel, new mp.Vector3(point.position), {
                heading: point.rotation.z,
            });
            participant.vehicle = vehicle;
            vehicle.dimension = race.id;
            player.dimension = race.id;
            player.position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
            const [h, m] = race.time.split(':').map(Number);
            messenger.publish(player, 'players.setCustomTime', h, m, 0);
            messenger.publish(player, 'players.setCustomWeather', race.weather);
            player.putIntoVehicle(vehicle, 0);

            raceService.addParticipant(race.id, participant);

            const prepareDto: RacePrepareDto = {
                endTime: race.startTime,
                raceType: race.type,
                dimension: race.id,
                racePoints: map.racePoints.map((p) => ({ position: p.position, radius: p.radius } as RacePointDto)),
                iplName: map.iplName,
            };
            messenger.publish(player, 'race-prepare:mount', prepareDto);
        };

        mp.events.add('playerDisconnect', onPlayerDisconnect);
        mp.events.add('auth:firstSignIn', onSignIn);
    },
});

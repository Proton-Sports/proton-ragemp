import { createScript } from '@kernel/script';
import { RaceStatus } from '@repo/shared';

export default createScript({
    name: 'race-menu-races-tab',
    fn: ({ raceService, raceMapCache, messenger }) => {
        const handleData = async (player: PlayerMp) => {
            const races = await Promise.all(
                raceService.races
                    .filter((r) => r.status === RaceStatus.Open)
                    .map(async (r) => {
                        const getMap = await raceMapCache.get(r.mapId);
                        return {
                            id: r.id,
                            mapName: getMap.failed ? 'Unknown Map' : getMap.data.name,
                            hostName: r.host.name,
                            racers: r.participants.length,
                            maxRacers: r.maxParticipants,
                        };
                    }),
            );
            messenger.publish(player, 'race-menu-races:data', races);
        };

        const handleJoin = (player: PlayerMp, raceId: number) => {
            const race = raceService.races.find((r) => r.id === raceId);
            if (!race || race.status !== RaceStatus.Open) {
                // TODO: Send error notification
                return;
            }

            if (race.participants.some((p) => p.player === player)) {
                // TODO: Send error notification
                return;
            }

            raceService.addParticipant(race.id, {
                player,
                vehicleModel: race.vehicleModels[0],
                playerVehicleId: 0,
                ready: false,
                lap: 0,
                finishTime: 0,
                nextRacePointIndex: 0,
                accumulatedDistance: 0,
                pointLogs: [],
                partialDistance: 0,
                prizePercent: 0,
            });
        };

        mp.events.add('race-menu-races:data', handleData);
        mp.events.add('race-menu-races:join', handleJoin);
    },
});

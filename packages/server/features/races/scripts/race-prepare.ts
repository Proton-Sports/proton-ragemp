import { createScript } from '@kernel/script';
import { RaceStatus, type RacePointDto, type RacePrepareDto } from '@repo/shared';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-prepare',
    fn: ({ raceService, raceMapCache, iplService, garageService, messenger }) => {
        const startTimers = new Map<number, NodeJS.Timeout>();

        const handleRacePrepared = async (race: Race) => {
            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) {
                raceService.destroyRace(race);
                return;
            }
            const map = getMap.data;

            const participants = race.participants;
            const players = participants.map((a) => a.player);

            if (map.iplName) {
                const ok = await iplService.loadAsync(players, map.iplName);
                if (!ok) {
                    console.warn(`Could not load ipl ${map.iplName}`);
                }
            }

            for (const [i, participant] of participants.entries()) {
                const point = map.startPoints[i];
                messenger.publish(participant.player, 'race-prepare:enterTransition', point.position);
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));

            const vehiclePromises = await Promise.all(
                participants.map(async (participant, i) => {
                    const point = map.startPoints[i];
                    const position = new mp.Vector3(point.position);
                    if (participant.playerVehicleId) {
                        const spawn = await garageService.spawn(
                            participant.playerVehicleId,
                            position,
                            point.rotation.z,
                        );
                        if (spawn.ok) {
                            return spawn.data;
                        }
                    }
                    return mp.vehicles.new(participant.vehicleModel, position, {
                        heading: point.rotation.z,
                    });
                }),
            );

            const vehicles = await Promise.all(vehiclePromises);
            const time = race.time.split(':').map(Number);

            for (const [i, participant] of participants.entries()) {
                const point = map.startPoints[i];
                const player = participant.player;
                player.position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
                player.dimension = race.id;
            }

            messenger.publish(players, 'players.setCustomTime', time[0], time[1], 0);
            messenger.publish(players, 'players.setCustomWeather', race.weather);

            for (const [i, participant] of participants.entries()) {
                const vehicle = vehicles[i];
                if (!vehicle) continue;

                participant.vehicle = vehicle;
                if (!participant.playerVehicleId) {
                    vehicle.setColor(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
                }
                vehicle.dimension = race.id;
                participant.player.putIntoVehicle(vehicle, 0);
            }

            messenger.publish(players, 'race-prepare:exitTransition');

            await new Promise((resolve) => setTimeout(resolve, 5000));

            race.status = RaceStatus.Preparing;
            raceService.countdown(race, 3000);

            const startDuration = 8000;
            race.startTime = Date.now() + startDuration;
            const timer = setTimeout(() => startRace(race), startDuration);
            startTimers.set(race.id, timer);

            map.iplName;
            const dto: RacePrepareDto = {
                endTime: race.startTime,
                raceType: race.type,
                dimension: race.id,
                racePoints: map.racePoints.map((a) => ({ position: a.position, radius: a.radius } as RacePointDto)),
                iplName: map.iplName,
            };
            messenger.publish(players, 'race-prepare:mount', dto);
        };

        const startRace = (race: Race) => {
            const timer = startTimers.get(race.id);
            if (timer) {
                clearTimeout(timer);
                startTimers.delete(race.id);
                raceService.start(race);
            }
        };

        raceService.on('racePrepared', handleRacePrepared);
    },
});

import { createScript } from '@kernel/script';
import { raceMaps } from '@repo/db/schema';
import type { RaceHostSubmitDto } from '@repo/shared';
import { RaceStatus, RaceType } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { v4 } from 'uuid';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-host',
    fn: ({ raceService, db, messenger }) => {
        let counter = 0;

        const handleSubmit = (player: PlayerMp, dto: RaceHostSubmitDto) => {
            if (raceService.races.some((r) => r.host === player)) {
                // TODO: Error handling
                return;
            }

            const models = dto.vehicleName
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => mp.joaat(s));

            if (models.length === 0) {
                // TODO: Error handling
                return;
            }

            const race: Race = {
                id: ++counter,
                guid: v4(),
                host: player,
                vehicleModels: models,
                mapId: dto.mapId,
                maxParticipants: dto.racers,
                duration: dto.duration,
                countdownSeconds: dto.countdown,
                description: dto.description,
                ghosting: dto.ghosting,
                type: dto.type === 'byLaps' ? RaceType.Laps : RaceType.PointToPoint,
                laps: dto.laps,
                time: parseTime(dto.time, dto.exactTime),
                weather: dto.weather,
                createdTime: Date.now(),
                status: RaceStatus.Open,
                participants: [],
                startTime: 0,
                lobbyCountingDown: false,
                prizePool: 0,
            };

            raceService.addRace(race);
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
            messenger.publish(player, 'race-host:submit');
        };

        const handleAvailableMaps = async (player: PlayerMp) => {
            const maps = await db.query.raceMaps.findMany({ columns: { id: true, name: true } });
            messenger.publish(player, 'race-host:availableMaps', maps);
        };

        const handleGetMaxRacers = async (player: PlayerMp, mapId: number) => {
            const map = await db.query.raceMaps.findFirst({
                where: eq(raceMaps.id, mapId),
                with: {
                    startPoints: { columns: { index: true } },
                },
            });
            const racers = map?.startPoints.length ?? 1;
            messenger.publish(player, 'race-host:getMaxRacers', Math.max(racers, 1));
        };

        const parseTime = (time: string, exactTime?: string) => {
            switch (time) {
                case 'earlyMorning':
                    return '5:00';
                case 'midday':
                    return '12:00';
                case 'night':
                    return '19:00';
                case 'exactTime':
                    return exactTime ?? '5:00';
                default:
                    return '5:00';
            }
        };

        mp.events.add('race-host:submit', handleSubmit);
        mp.events.add('race-host:availableMaps', handleAvailableMaps);
        mp.events.add('race-host:getMaxRacers', handleGetMaxRacers);
    },
});

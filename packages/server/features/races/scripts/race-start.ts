import { createScript } from '@kernel/script';
import type { RaceStartDto } from '@repo/shared';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-start',
    fn: ({ raceService, messenger }) => {
        const handleRaceStarted = (race: Race) => {
            const players = race.participants.map((p) => p.player);
            const dto: RaceStartDto = {
                laps: race.laps ?? 1,
                ghosting: race.ghosting,
            };
            messenger.publish(players, 'race-start:start', dto);

            for (const participant of race.participants) {
                participant.nextRacePointIndex = 0;
                participant.lap = 0;
                if (participant.vehicle) {
                    participant.vehicle.engine = true;
                }
            }
        };

        raceService.on('raceStarted', handleRaceStarted);
    },
});

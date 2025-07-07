import { createScript } from '@kernel/script';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-destroy',
    fn: ({ raceService, messenger }) => {
        const timers = new Map<Race, NodeJS.Timeout>();

        const handleParticipantLeft = (race: Race) => {
            if (race.participants.length === 0) {
                raceService.destroyRace(race);
            }
        };

        const onRaceFinished = (race: Race) => {
            const timer = setTimeout(() => {
                destroyRace(race);
            }, 10000);
            timers.set(race, timer);
        };

        const destroyRace = (race: Race) => {
            const timer = timers.get(race);
            if (timer) {
                clearTimeout(timer);
                timers.delete(race);
            }

            const players = race.participants.map((p) => p.player);
            messenger.publish(players, 'race-destroy:enterTransition');

            setTimeout(() => {
                const returnPosition = new mp.Vector3(551.916, 5562.336, -96.042);
                messenger.publish(players, 'race:destroy');
                for (const player of players) {
                    player.position = returnPosition;
                    player.dimension = 0;
                }
                raceService.destroyRace(race);
            }, 1000);
        };

        raceService.on('participantLeft', handleParticipantLeft);
        raceService.on('raceFinished', onRaceFinished);
    },
});

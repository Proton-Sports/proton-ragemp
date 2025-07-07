import { createScript } from '@kernel/script';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-start-countdown',
    fn: ({ raceService, messenger }) => {
        const onRaceCountdown = async (race: Race, countDelay: number) => {
            const players = race.participants.map((p) => p.player);
            messenger.publish(players, 'race-start-countdown:mount');
            await new Promise((resolve) => setTimeout(resolve, countDelay));
            messenger.publish(players, 'race-start-countdown:start');
        };

        raceService.on('raceCountdown', onRaceCountdown);
    },
});

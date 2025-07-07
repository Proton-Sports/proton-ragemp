import { createScript } from '@kernel/script';

export default createScript({
    name: 'custom-time',
    fn: ({ messenger }) => {
        messenger.on('players.setCustomTime', (hour: number, minute: number, second: number) => {
            mp.game.clock.pauseClock(true);
            mp.game.clock.setClockTime(hour, minute, second);
        });
        messenger.on('players.unsetCustomTime', () => {
            mp.game.clock.pauseClock(false);
        });
    },
});

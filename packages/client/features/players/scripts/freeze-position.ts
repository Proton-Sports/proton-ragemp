import { createScript } from '@kernel/script';

export default createScript({
    name: 'freeze-player-position',
    fn: () => {
        mp.events.addDataHandler('isPositionFrozen', (player: PlayerMp, value: boolean) => {
            if (player.type !== 'player') {
                return;
            }

            player.freezePosition(value);
        });
    },
});

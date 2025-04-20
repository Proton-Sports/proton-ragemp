import { createScript } from '@kernel/script';

export default createScript({
    name: 'set-player-invincible',
    fn: () => {
        mp.events.addDataHandler('isInvincible', (player: PlayerMp, value: boolean) => {
            if (player.type !== 'player') {
                return;
            }

            player.setInvincible(value);
        });
    },
});

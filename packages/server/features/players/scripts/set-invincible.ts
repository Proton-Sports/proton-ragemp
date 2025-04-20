import { createScript } from '@kernel/script';

declare global {
    interface PlayerMp {
        setInvincible(state: boolean): void;
    }
}

mp.Player.prototype.setInvincible = function (this: PlayerMp, state: boolean) {
    if (state) {
        this.setVariable('isInvincible', true);
    } else {
        this.setVariable('isInvincible', false);
    }
};

export default createScript({
    name: 'set-player-invicible',
    fn: () => {},
});

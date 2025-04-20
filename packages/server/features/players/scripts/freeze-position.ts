import { createScript } from '@kernel/script';

declare global {
    interface PlayerMp {
        freezePosition(state: boolean): void;
    }
}

mp.Player.prototype.freezePosition = function (this: PlayerMp, state: boolean) {
    if (state) {
        this.setVariable('isPositionFrozen', true);
    } else {
        this.setVariable('isPositionFrozen', false);
    }
};

export default createScript({
    name: 'freeze-player-position',
    fn: () => {},
});

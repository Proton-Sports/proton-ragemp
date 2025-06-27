import { createScript } from '@kernel/script';

export default createScript({
    name: 'reset-player',
    fn: () => {
        mp.game.player.setRunSprintMultiplierFor(1.0); // gotta reset to default somehow
    },
});

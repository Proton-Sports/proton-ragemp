import { KeyCode } from '@duydang2311/ragemp-utils-shared';
import { createScript } from '@kernel/script';

export default createScript({
    name: 'toggle-cursor-key',
    fn: ({ game, ui }) => {
        let toggle = false;
        game.keys.bind(KeyCode.Alt, () => {
            toggle = !toggle;
            game.cursor.show(toggle);
            ui.focus(toggle);
        });
    },
});

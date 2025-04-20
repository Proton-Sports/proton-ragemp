import { createScript } from '@kernel/script';

export default createScript({
    name: 'toggle-cursor-key',
    fn: ({ game }) => {
        let toggle = false;

        // Handle keyup event for Alt key (menu key)
        game.keys.bind(0x12, () => {
            // 0x12 is Alt key
            toggle = !toggle;
            game.cursor.show(toggle);
        });
    },
});

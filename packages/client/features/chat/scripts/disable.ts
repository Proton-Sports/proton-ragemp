import { createScript } from '@kernel/script';

export default createScript({
    name: 'disable-rage-chat',
    fn: () => {
        mp.gui.chat.show(false);
        mp.gui.chat.activate(false);
    },
});

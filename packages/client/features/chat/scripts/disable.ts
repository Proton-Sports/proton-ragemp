import { createScript } from '../../../kernel/script';

export default createScript({
    name: 'disable-rage-chat',
    fn: ({ ui }) => {
        mp.gui.chat.show(false);
        ui.active = true;
        ui.markAsChat();
    },
});

import { combineCleanup, createToggle, tryPromise } from '@repo/shared/utils';
import { createScript } from '@kernel/script';

export default createScript({
    name: 'login',
    fn: ({ game, ui, messenger, logger }) => {
        ui.router.onMount('login', () => {
            const toggle = createToggle((toggle) => {
                ui.focus(toggle);
                game.cursor.show(toggle);
                game.freezeControls(toggle);
            });

            toggle(true);
            return combineCleanup(
                ui.on('login.discord', async () => {
                    const tryRequest = await tryPromise(() => mp.discord.requestOAuth2('1348557171092357142'))(
                        logger.error,
                    );
                    if (tryRequest.ok) {
                        messenger.publish('login.discord', tryRequest.data);
                    }
                }),
                messenger.on('login.discord.success', () => {
                    ui.router.unmount('login');
                }),
                messenger.on('login.discord.error', (code: string) => {
                    ui.publish('login.discord.error', code);
                }),
                () => toggle(false),
            );
        });
        ui.router.mount('login');
    },
});

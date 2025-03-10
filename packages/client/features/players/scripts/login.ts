import { createScript } from '@kernel/script';

export default createScript({
    name: 'login',
    fn: ({ game, ui, logger }) => {
        ui.on('router.mount', (route: string) => {
            if (route === 'login') {
                ui.focus(true);
                game.cursor.show(true);
                game.freezeControls(true);
                ui.on('login.discord', async () => {
                    try {
                        const token = await mp.discord.requestOAuth2('1348557171092357142');
                        game.cursor.show(false);
                        game.freezeControls(false);
                        ui.focus(false);
                        logger.info('success', token);
                    } catch (e) {
                        logger.error(e);
                    }
                });
            }
        });
        ui.publish('router.mount', 'login');
    },
});

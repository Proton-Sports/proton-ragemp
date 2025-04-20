import { createScript } from '@kernel/script';
import { combineCleanup, createToggle, tryPromise } from '@repo/shared/utils';
import { attempt } from '@repo/shared';

export default createScript({
    name: 'authenticate-player',
    fn: ({ game, ui, messenger, logger }) => {
        messenger.on('authentication.mount', () => {
            ui.router.mount('auth');
        });

        ui.router.onMount('auth', () => {
            const toggle = createToggle((toggle) => {
                ui.focus(toggle);
                game.cursor.show(toggle);
                game.freezeControls(toggle);
            });

            toggle(true);
            messenger.publish('authentication.requestOAuth2');

            return combineCleanup(
                messenger.on('authentication.requestOAuth2', async (clientId: string) => {
                    const requestAttempt = await attempt.promise(() => mp.discord.requestOAuth2(clientId))(logger.error);

                    logger.info('requestAttempt', requestAttempt);
                    if (requestAttempt.ok) {
                        messenger.publish('authentication.code', requestAttempt.data);
                    } else {
                        logger.error('Failed to request Discord OAuth2');
                    }
                }),
                messenger.on('authentication.profile', (avatarUrl: string, name: string) => {
                    ui.publish('authentication.profile', avatarUrl, name);
                }),
                ui.on('authentication.login', () => {
                    messenger.publish('authentication.login');
                }),
                messenger.on('authentication.error', (errorMessage: string) => {
                    logger.error(errorMessage);
                }),
                messenger.on('authentication.login', () => {
                    ui.router.unmount('auth');
                }),
                () => toggle(false),
            );
        });
    },
});

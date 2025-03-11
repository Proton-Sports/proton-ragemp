import { createScript } from '@kernel/script';
import { tryPromise } from '@repo/shared';

export default createScript({
    name: 'player-login',
    fn: ({ messenger, fetch, env }) => {
        messenger.on('login.discord', async (player, code: string) => {
            const searchParams = new URLSearchParams();
            searchParams.set('grant_type', 'authorization_code');
            searchParams.set('code', code);
            searchParams.set('redirect_uri', 'https://example.com');
            searchParams.set('client_id', env.DISCORD_OAUTH2_CLIENT_ID);
            searchParams.set('client_secret', env.DISCORD_OAUTH2_CLIENT_SECRET);

            const tryFetch = await tryPromise(() =>
                fetch('https://discord.com/api/v10/oauth2/token', {
                    method: 'post',
                    body: searchParams.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }),
            )((e) => (e instanceof Error ? e.name : 'unknown'));

            if (tryFetch.ok) {
                if (tryFetch.data.ok) {
                    messenger.publish(player, 'login.discord.success');
                } else {
                    messenger.publish(player, 'login.discord.error', tryFetch.data.status + '');
                }
            } else {
                messenger.publish(player, 'login.discord.error', tryFetch.error);
            }
        });
    },
});

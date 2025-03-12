import type { Runtime } from '@kernel/runtime';
import { createScript } from '@kernel/script';
import { tryPromise } from '@repo/shared';
import { type DiscordOAuth2Token } from '@repo/shared/discord';

const playerDiscordTokens = new Map<PlayerMp, DiscordOAuth2Token>();

export default createScript({
    name: 'player-login',
    fn: ({ messenger, fetch, env }) => {
        messenger.on('login.discord', async (player, code: string) => {
            const tryExchangeCode = await tryPromise(() => exchangeCode({ fetch, env })(code))((e) =>
                e instanceof Error ? e.name : 'unknown',
            );
            if (!tryExchangeCode.ok) {
                messenger.publish(player, 'login.discord.error', tryExchangeCode.error);
                return;
            }

            if (tryExchangeCode.data.ok) {
                const token = (await tryExchangeCode.data.json()) as DiscordOAuth2Token;
                messenger.publish(player, 'login.discord.token', token);
                playerDiscordTokens.set(player, token);
            } else {
                messenger.publish(player, 'login.discord.error', tryExchangeCode.data.status + '');
            }
        });
        messenger.on('login.discord.confirm', (player) => {
            if (!playerDiscordTokens.delete(player)) {
                return;
            }
            messenger.publish(player, 'login.discord.confirm');
        });
    },
});

const exchangeCode =
    ({ fetch, env }: Pick<Runtime, 'fetch' | 'env'>) =>
    async (code: string) => {
        const searchParams = new URLSearchParams();
        searchParams.set('grant_type', 'authorization_code');
        searchParams.set('code', code);
        searchParams.set('redirect_uri', 'https://example.com');
        searchParams.set('client_id', env.DISCORD_OAUTH2_CLIENT_ID);
        searchParams.set('client_secret', env.DISCORD_OAUTH2_CLIENT_SECRET);

        return await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'post',
            body: searchParams.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    };

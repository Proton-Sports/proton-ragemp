<script lang="ts">
    import { useRuntime } from '$lib/services/runtime';
    import { type DiscordOAuth2Token, type DiscordUser, tryPromise } from '@repo/shared';

    const { messenger } = useRuntime();
    let errorCode = $state.raw<string>();
    let discordUser = $state.raw<DiscordUser>();
    let confirmTimeout = 0;

    messenger.on('login.discord.token', async (token: DiscordOAuth2Token) => {
        const tryGetUser = await tryPromise(() => getUser(token.access_token))((e) =>
            e instanceof Error ? e.name : 'unknown',
        );
        if (!tryGetUser.ok) {
            errorCode = tryGetUser.error;
            return;
        }

        if (tryGetUser.data.ok) {
            discordUser = (await tryGetUser.data.json()) as DiscordUser;
            if (confirmTimeout !== 0) {
                clearTimeout(confirmTimeout);
            }
            confirmTimeout = setTimeout(() => {
                messenger.publish('login.discord.confirm');
            }, 3000);
        } else {
            errorCode = tryGetUser.data.status + '';
        }
    });

    messenger.on('login.discord.error', (code: string) => {
        errorCode = code;
    });

    const getUser = (accessToken: string) =>
        fetch('https://discord.com/api/users/@me', {
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
</script>

<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <button
        type="button"
        onclick={() => {
            if (errorCode) {
                errorCode = undefined;
            }
            messenger.publish('login.discord');
        }}
        class="font-bold bg-blue-5"
    >
        Sign in with Discord
    </button>
    {#if discordUser}
        <img
            src="https://cdn.discordapp.com/avatars/{discordUser.id}/{discordUser.avatar}.webp?size=512"
            alt={discordUser.username}
            class="size-32 rounded-full"
        />
        <p>{discordUser.username} ({discordUser.global_name})</p>
        Automatically sign in in 3 seconds...
    {/if}
    {#if errorCode}
        <p class="text-red-5">Error: {errorCode}</p>
    {/if}
</div>

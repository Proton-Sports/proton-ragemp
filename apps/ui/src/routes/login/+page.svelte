<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Spinner from '$lib/components/Spinner.svelte';
    import { useRuntime } from '$lib/services/runtime';
    import { type DiscordOAuth2Token, type DiscordUser, tryPromise } from '@repo/shared';

    const { messenger } = useRuntime();
    let errorCode = $state.raw<string>();
    let discordUser = $state.raw<DiscordUser>();
    let status = $state.raw<'loading'>();

    messenger.on('login.discord.token', async (token: DiscordOAuth2Token) => {
        const tryGetUser = await tryPromise(() => getUser(token.access_token))((e) =>
            e instanceof Error ? e.name : 'unknown',
        );
        if (!tryGetUser.ok) {
            errorCode = tryGetUser.error;
            status = undefined;
            return;
        }

        if (tryGetUser.data.ok) {
            discordUser = (await tryGetUser.data.json()) as DiscordUser;
        } else {
            errorCode = tryGetUser.data.status + '';
        }
        status = undefined;
    });

    messenger.on('login.discord.error', (code: string) => {
        status = undefined;
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

<div class="bg-base-bg-3/90 fixed inset-0">
    <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {#if discordUser == null}
            <Button
                variant="primary"
                type="button"
                onclick={() => {
                    status = 'loading';
                    if (errorCode) {
                        errorCode = undefined;
                    }
                    messenger.publish('login.discord');
                }}
                disabled={status === 'loading'}
                data-loading={status === 'loading' ? true : undefined}
                class="flex items-center gap-4"
            >
                Sign in with Discord
                {#if status === 'loading'}
                    <Spinner class="size-4" />
                {/if}
            </Button>
        {:else}
            <img
                src="https://cdn.discordapp.com/avatars/{discordUser.id}/{discordUser.avatar}.webp?size=512"
                alt={discordUser.username}
                class="mx-auto size-32 rounded-full"
            />
            <Button
                variant="primary"
                type="button"
                class="font-display mt-2 text-center"
                onclick={() => {
                    messenger.publish('login.discord.confirm');
                }}
            >
                Sign in as <span class="font-bold">{discordUser.username}</span>
            </Button>
        {/if}
        {#if errorCode}
            <p class="text-red-5">Error: {errorCode}</p>
        {/if}
    </div>
</div>

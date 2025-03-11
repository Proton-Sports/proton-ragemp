<script lang="ts">
    import { useRuntime } from '$lib/services/runtime';

    const { messenger } = useRuntime();
    let errorCode = $state.raw<string>();

    messenger.on('login.discord.error', (code: string) => {
        errorCode = code;
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
    {#if errorCode}
        <p class="text-red-5">Error: {errorCode}</p>
    {/if}
</div>

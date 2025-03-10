<script lang="ts">
    import { useRuntime } from '$lib/services/runtime';

    const { messenger } = useRuntime();
</script>

<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <button
        type="button"
        onclick={() => {
            messenger.publish('login.discord');
        }}
        class="font-bold bg-blue-5"
    >
        Sign in with Discord
    </button>
</div>

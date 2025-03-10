<script lang="ts">
    import { onMount, type Snippet, type SvelteComponent } from 'svelte';
    import { useRuntime } from '$lib/services/runtime';

    const {
        route,
        children,
    }: {
        route: string;
        children: Snippet;
    } = $props();

    const { messenger } = useRuntime();

    onMount(() => {
        messenger.publish('router.mount', route);
        return () => {
            messenger.publish('router.unmount', route);
        };
    });
</script>

{@render children()}

<script lang="ts">
    import type { Snippet, SvelteComponent } from 'svelte';
    import { useRuntime } from '../services/runtime';
    import { SvelteSet } from 'svelte/reactivity';

    const {
        children,
    }: {
        children: Snippet<[Record<string, () => Promise<{ default: typeof SvelteComponent }>>]>;
    } = $props();
    const { messenger, router } = useRuntime();
    const prefixLength = '../../routes/'.length;
    let globs = Object.fromEntries(
        Object.entries(import.meta.glob('../../routes/*/+page.svelte')).map(([k, v]) => [
            k.substring(prefixLength, k.indexOf('/', prefixLength)),
            v as () => Promise<{ default: typeof SvelteComponent }>,
        ]),
    );

    messenger.on('router.mount', router.mount);
    messenger.on('router.unmount', router.unmount);
</script>

{@render children(Object.fromEntries(Array.from(router.routes.values()).map((a) => [a, globs[a]])))}

<script lang="ts">
    import { setRuntime, type Runtime } from '$lib/services/runtime';
    import { type Snippet } from 'svelte';

    const { children, ...runtime }: Runtime & { children: Snippet } = $props();

    setRuntime(runtime);
</script>

{@render children()}

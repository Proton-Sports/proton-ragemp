<script lang="ts">
    import Route from '$lib/components/Route.svelte';
    import Router from '$lib/components/Router.svelte';
    import Runtime from '$lib/components/Runtime.svelte';
    import { createMessenger } from '$lib/services/messenger';
    import { createRouter } from '$lib/services/router';
</script>

{#if mp.isBrowser}
    <div class="fixed inset-0 bg-green-5"></div>
{/if}
<Runtime messenger={createMessenger()} router={createRouter()}>
    <Router>
        {#snippet children(routes)}
            {#each Object.entries(routes) as [route, importModule] (route)}
                {#await importModule().then((a) => a.default) then Component}
                    <Route {route}>
                        <Component />
                    </Route>
                {/await}
            {/each}
        {/snippet}
    </Router>
</Runtime>

import { SvelteSet } from 'svelte/reactivity';

export interface Router {
    readonly routes: SvelteSet<string>;

    mount: (name: string) => void;
    unmount: (name: string) => void;
}

export const createRouter = (): Router => {
    const routes = new SvelteSet<string>();
    return {
        mount: (route) => {
            console.log('mount', route);
            routes.add(route);
        },
        unmount: (route) => {
            routes.delete(route);
        },
        routes,
    };
};

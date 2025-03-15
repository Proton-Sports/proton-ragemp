import { SvelteSet } from 'svelte/reactivity';

export interface Router {
    readonly routes: SvelteSet<string>;

    mount: (name: string) => void;
    unmount: (name: string) => void;
}

export const createRouter = (defaultRoutes?: string[]): Router => {
    const routes = new SvelteSet<string>(defaultRoutes);
    return {
        mount: (route) => {
            routes.add(route);
        },
        unmount: (route) => {
            routes.delete(route);
        },
        routes,
    };
};

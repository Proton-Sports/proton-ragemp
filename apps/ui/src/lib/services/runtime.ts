import { getContext, setContext } from 'svelte';
import type { Messenger } from './messenger';
import type { Router } from './router';

export interface Runtime {
    readonly messenger: Messenger;
    readonly router: Router;
}

const symbol = Symbol('@ui/Runtime');

export const setRuntime = (runtime: Runtime) => {
    return setContext<Runtime>(symbol, runtime);
};

export const useRuntime = () => {
    return getContext<Runtime>(symbol);
};

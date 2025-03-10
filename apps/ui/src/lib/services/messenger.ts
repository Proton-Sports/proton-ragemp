import { onMount } from 'svelte';

export interface Messenger {
    publish(name: string, ...args: unknown[]): void;
    on(name: string, callback: (...args: any[]) => void): void;
}

export const createMessenger = (): Messenger => {
    return {
        publish: (name, ...args) => {
            mp.trigger(name, ...args);
        },
        on(name, callback) {
            onMount(() => {
                mp.events.add(name, callback);
                return () => {
                    mp.events.remove(name);
                };
            });
        },
    };
};

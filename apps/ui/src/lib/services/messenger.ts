import { tryParseJSON } from '$lib/utils';
import { hashUiEventName } from '@repo/shared';
import { onMount } from 'svelte';

export interface Messenger {
    publish(name: string, ...args: unknown[]): void;
    on(name: string, callback: (...args: any[]) => void): void;
}

export const createMessenger = (): Messenger => {
    return {
        publish: (name, ...args) => {
            mp.trigger(hashUiEventName(name), ...args);
        },
        on(name, callback) {
            onMount(() => {
                const hashed = hashUiEventName(name);
                const wrapped = (...args: any[]) => {
                    callback(
                        ...args.map((a) => {
                            const tryParse = tryParseJSON(a);
                            return tryParse.ok ? tryParse.data : a;
                        }),
                    );
                };
                mp.events.add(hashed, wrapped);
                return () => {
                    mp.events.remove(hashed);
                };
            });
        },
    };
};

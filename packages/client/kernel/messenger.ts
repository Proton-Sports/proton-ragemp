import { hashServerEventName } from '@repo/shared/utils';

export interface Messenger {
    on(name: string, handler: (...args: any[]) => void): () => void;
    publish(name: string, ...args: unknown[]): void;
}

export const createRemoteMessenger = (): Messenger => {
    return {
        on: (name, handler) => {
            const hashed = hashServerEventName(name);
            mp.events.add(hashed, handler);

            return () => {
                mp.events.remove(hashed, handler);
            };
        },
        publish: (name, ...args) => {
            mp.events.callRemote(hashServerEventName(name), ...args);
        },
    };
};

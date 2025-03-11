export interface Messenger {
    on(name: string, handler: (...args: any[]) => void): () => void;
    publish(name: string, ...args: unknown[]): void;
}

export const createRemoteMessenger = (): Messenger => {
    return {
        on: (name, handler) => {
            mp.events.add(name, handler);

            return () => {
                mp.events.remove(name, handler);
            };
        },
        publish: (name, ...args) => {
            mp.events.callRemote(name, ...args);
        },
    };
};

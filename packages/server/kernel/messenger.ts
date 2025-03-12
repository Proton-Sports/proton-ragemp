import { hashServerEventName } from '@repo/shared';

export interface Messenger {
    on(name: string, handler: (player: PlayerMp, ...args: any[]) => void): () => void;
    publish(player: PlayerMp, name: string, ...args: unknown[]): void;
    publish(players: PlayerMp[], name: string, ...args: unknown[]): void;
    publishAll(name: string, ...args: unknown[]): void;
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
        publish: (playerOrPlayers, name, ...args) => {
            const hashed = hashServerEventName(name);
            if (!Array.isArray(playerOrPlayers)) {
                playerOrPlayers.call(hashed, args);
            } else {
                mp.players.call(playerOrPlayers, hashed, args);
            }
        },
        publishAll: (name, ...args) => {
            mp.players.call(hashServerEventName(name), args);
        },
    };
};

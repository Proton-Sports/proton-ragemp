export interface Messenger {
    on(name: string, handler: (player: PlayerMp, ...args: any[]) => void): () => void;
    publish(player: PlayerMp, name: string, ...args: unknown[]): void;
    publish(players: PlayerMp[], name: string, ...args: unknown[]): void;
    publishAll(name: string, ...args: unknown[]): void;
}

export const createRemoteMessenger = (): Messenger => {
    return {
        on: (name, handler) => {
            mp.events.add(name, handler);

            return () => {
                mp.events.remove(name, handler);
            };
        },
        publish: (playerOrPlayers, name, ...args) => {
            if (!Array.isArray(playerOrPlayers)) {
                playerOrPlayers.call(name, args);
            } else {
                mp.players.call(playerOrPlayers, name, args);
            }
        },
        publishAll: (name, ...args) => {
            mp.players.call(name, args);
        },
    };
};

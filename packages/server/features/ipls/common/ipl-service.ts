import type { Messenger } from '@kernel/messenger';
import { attempt, type Attempt } from '@repo/shared';
import { TimeoutError } from '@repo/shared/models/error';

export interface IplService {
    load(player: PlayerMp, name: string): void;
    loadAsync(players: PlayerMp[], name: string): Promise<Attempt<void, TimeoutError>>;
    unload(player: PlayerMp, name: string): boolean;
    unloadBatch(player: PlayerMp, names: string[]): boolean;
}

interface LoadAsyncState {
    resolve: () => void;
    count: number;
    timeoutId: number;
}

class RageMpIplService implements IplService {
    readonly #messenger: Messenger;
    readonly #loadAsyncStates = new Map<number, LoadAsyncState>();
    #counter = 0;

    constructor(messenger: Messenger) {
        this.#messenger = messenger;
        this.#init();
    }

    #init() {
        this.#messenger.on('ipls.load.async.complete', (player, id: number) => {
            const state = this.#loadAsyncStates.get(id);
            if (!state) {
                return;
            }

            if (--state.count === 0) {
                clearTimeout(state.timeoutId);
                this.#loadAsyncStates.delete(id);
                state.resolve();
            }
        });
    }

    load(player: PlayerMp, name: string) {
        this.#messenger.publish(player, 'ipls.load', name);
        return true;
    }

    async loadAsync(players: PlayerMp[], name: string) {
        if (players.length === 0) {
            return attempt.ok<void>(undefined);
        }

        const id = ++this.#counter;
        return await attempt.promise(
            () =>
                new Promise<void>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        if (this.#loadAsyncStates.has(id)) {
                            this.#loadAsyncStates.delete(id);
                            reject(new TimeoutError());
                        }
                    }, 5000);

                    this.#loadAsyncStates.set(id, {
                        resolve,
                        count: players.length,
                        timeoutId: timeoutId as unknown as number,
                    });

                    this.#messenger.publish(players, 'ipls.load.async', id, name);
                }),
        )((e) => {
            if (e instanceof TimeoutError) {
                return e;
            }
            throw e;
        });
    }

    unload(player: PlayerMp, name: string) {
        this.#messenger.publish(player, 'ipls.unload', name);
        return true;
    }

    unloadBatch(player: PlayerMp, names: string[]) {
        this.#messenger.publish(player, 'ipls.unload.batch', names);
        return true;
    }
}

export const createIplService = (messenger: Messenger) => {
    return new RageMpIplService(messenger);
};

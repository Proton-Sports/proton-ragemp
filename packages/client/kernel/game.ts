import { createLock, createUniqueLock } from '@repo/shared/lock';

export interface Game {
    readonly cursor: Cursor;
    readonly keys: Keys;

    freezeControls(toggle: boolean): void;
}

export interface Cursor {
    show(toggle: boolean): void;
}

export interface Keys {
    bind(keyCode: number, handler: () => void, keydown?: boolean): () => void;
}

export const createRageMpGame = () => {
    return new RageMpGame();
};

const createCursor = (): Cursor => {
    let enforceInterval = 0;
    const showLock = createLock();

    const enforce = () => {
        if (showLock.flags > 0 && !mp.gui.cursor.visible) {
            mp.gui.cursor.show(false, true);
        }
    };

    return {
        show: (toggle) => {
            if (toggle) {
                showLock.acquire(() => {
                    mp.gui.cursor.show(false, true);
                    if (enforceInterval === 0) {
                        mp.keys.bind(0x7a, false, enforce);
                        enforceInterval = setInterval(enforce, 1000) as unknown as number;
                    }
                });
            } else {
                showLock.release(() => {
                    mp.gui.cursor.show(false, false);
                    if (enforceInterval !== 0) {
                        mp.keys.unbind(0x7a, false, enforce);
                        clearInterval(enforceInterval);
                        enforceInterval = 0;
                    }
                });
            }
        },
    };
};

class RageMpGame implements Game {
    #cursor: Cursor;
    #keys: Keys;
    #freezeLock = createUniqueLock();

    constructor() {
        this.#cursor = createCursor();
        this.#keys = new RageMpKeys();
    }

    get cursor() {
        return this.#cursor;
    }

    get keys() {
        return this.#keys;
    }

    freezeControls(toggle: boolean): void {
        if (toggle) {
            this.#freezeLock.acquire(() => {
                mp.events.add('render', RageMpGame.#freeze);
            });
        } else {
            this.#freezeLock.release(() => {
                mp.events.remove('render', RageMpGame.#freeze);
            });
        }
    }

    static #freeze() {
        mp.game.controls.disableAllControlActions(0);
    }
}

class RageMpKeys implements Keys {
    bind(keyCode: number, handler: () => void, keydown = false): () => void {
        mp.keys.bind(keyCode, keydown, handler);
        return () => {
            mp.keys.unbind(keyCode, keydown, handler);
        };
    }
}

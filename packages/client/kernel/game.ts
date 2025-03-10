import { createLock, createUniqueLock } from '@repo/shared/lock';

export interface Game {
    readonly cursor: Cursor;

    freezeControls(toggle: boolean): void;
}

export interface Cursor {
    show(toggle: boolean): void;
}

export const createGame = (): Game => {
    const freezeLock = createUniqueLock();

    const freeze = () => {
        mp.game.controls.disableAllControlActions(0);
    };

    return {
        cursor: createCursor(),
        freezeControls: (toggle) => {
            if (toggle) {
                freezeLock.acquire(() => {
                    mp.events.add('render', freeze);
                });
            } else {
                freezeLock.release(() => {
                    mp.events.remove('render', freeze);
                });
            }
        },
    };
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
                        enforceInterval = setInterval(enforce, 1000);
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

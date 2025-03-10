export interface Lock {
    get flags(): number;
    acquire(callback: () => void): void;
    release(callback: () => void): void;
}

export const createLock = (): Lock => {
    let flags = 0;
    return {
        get flags() {
            return flags;
        },
        acquire: (callback: () => void) => {
            if (++flags > 0) {
                callback();
            }
        },
        release: (callback: () => void) => {
            if (--flags <= 0) {
                callback();
            }
        },
    };
};

export const createUniqueLock = (): Lock => {
    let flags = 0;
    let locked = false;
    return {
        get flags() {
            return flags;
        },
        acquire: (callback: () => void) => {
            if (!locked && ++flags > 0) {
                callback();
                locked = true;
            }
        },
        release: (callback: () => void) => {
            if (locked && --flags <= 0) {
                callback();
                locked = false;
            }
        },
    };
};

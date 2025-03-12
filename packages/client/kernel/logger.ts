export interface Logger {
    info(...messages: unknown[]): void;
    warning(...message: unknown[]): void;
    error(...message: unknown[]): void;
    fatal(...message: unknown[]): void;
    clear(): void;
    reset(): void;
}

interface LogOptions {
    save?: boolean;
}

export const createMpLogger = ({ save = false }: LogOptions = { save: false }): Logger => {
    return {
        info: (...messages) => {
            mp.console.logInfo(messages.map((a) => JSON.stringify(a)).join(' '), save, save);
        },
        warning: (...messages) => {
            mp.console.logWarning(messages.map((a) => JSON.stringify(a)).join(' '), save, save);
        },
        error: (...messages) => {
            mp.console.logError(messages.map((a) => JSON.stringify(a)).join(' '), save, save);
        },
        fatal: (...messages) => {
            mp.console.logFatal(messages.map((a) => JSON.stringify(a)).join(' '), save, save);
        },
        clear: () => {
            mp.console.clear();
        },
        reset: () => {
            mp.console.reset();
        },
    };
};

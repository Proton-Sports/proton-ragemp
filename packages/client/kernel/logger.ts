export interface Logger {
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
    clear(): void;
    reset(): void;
}

interface LogOptions {
    save?: boolean;
}

export const createMpLogger = ({ save = false }: LogOptions = { save: false }): Logger => {
    return {
        info: (message, options?: LogOptions) => {
            mp.console.logInfo(message, options?.save ?? save, options?.save ?? save);
        },
        warning: (message, options?: LogOptions) => {
            mp.console.logWarning(message, options?.save ?? save, options?.save ?? save);
        },
        error: (message, options?: LogOptions) => {
            mp.console.logError(message, options?.save ?? save, options?.save ?? save);
        },
        fatal: (message, options?: LogOptions) => {
            mp.console.logFatal(message, options?.save ?? save, options?.save ?? save);
        },
        clear: () => {
            mp.console.clear();
        },
        reset: () => {
            mp.console.reset();
        },
    };
};

export type Try<TData, TError> =
    | {
          ok: true;
          data: TData;
      }
    | {
          ok: false;
          error: TError;
      };

export const combineCleanup = (...cleanups: (() => void)[]): (() => void) => {
    return () => {
        for (const cleanup of cleanups) {
            cleanup();
        }
    };
};

export const createToggle = (callback: (toggle: boolean) => void) => {
    return (toggle: boolean) => {
        callback(toggle);
    };
};

export const tryDo = <TData>(fn: () => TData) => {
    return <TError>(mapException?: (e: unknown) => TError): Try<TData, TError> => {
        try {
            return {
                ok: true,
                data: fn(),
            };
        } catch (e) {
            return {
                ok: false,
                error: mapException ? mapException(e) : (e as TError),
            };
        }
    };
};

export const tryPromise = <TData>(fn: () => Promise<TData>) => {
    return async <TError>(mapException?: (e: unknown) => TError): Promise<Try<TData, TError>> => {
        try {
            return {
                ok: true,
                data: await fn(),
            };
        } catch (e) {
            return {
                ok: false,
                error: mapException ? mapException(e) : (e as TError),
            };
        }
    };
};

export const hashUiEventName = (name: string) => `ui.${name}`;

export const hashServerEventName = (name: string) => `sv.${name}`;

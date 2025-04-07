export type Attempt<TData, TError> =
    | {
          ok: true;
          data: TData;
      }
    | {
          ok: false;
          error: TError;
      };

const attemptSync = <TData>(fn: () => TData) => {
    return <TError>(mapException?: (e: unknown) => TError): Attempt<TData, TError> => {
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

const attemptAsync = <TData>(fn: () => Promise<TData>) => {
    return async <TError>(mapException?: (e: unknown) => TError): Promise<Attempt<TData, TError>> => {
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

export const attempt = Object.assign(attemptSync, {
    promise: attemptAsync,
    ok: <T>(data: T): Attempt<T, never> => ({
        ok: true,
        data,
    }),
    fail: <T>(error: T): Attempt<never, T> => ({
        ok: false,
        error,
    }),
});

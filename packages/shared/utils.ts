import { attempt } from './attempt';
import { TimeoutError } from './models/error';

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
    return callback;
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

export const when = async (condition: () => boolean, timeout: number = 5000) => {
    return await attempt.promise(
        () =>
            new Promise<never>((resolve, reject) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (condition()) {
                        clearInterval(interval);
                        resolve(undefined as never);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new TimeoutError());
                    }
                }, 30);
            }),
    )((e) => {
        if (e instanceof TimeoutError) {
            return e;
        }
        throw e;
    });
};

export const getDistanceSquared = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) => {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
};

export const getDistance = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) => {
    return Math.sqrt(getDistanceSquared(a, b));
};

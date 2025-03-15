import { tryDo, type Try } from '@repo/shared';

const jsonRegex = /^\{[\s\S]*\}$|^\[[\s\S]*\]$/;

export const tryParseJSON = (value: unknown): Try<unknown, unknown> => {
    if (typeof value !== 'string') {
        return {
            ok: false,
            error: 'string',
        };
    }
    if (!jsonRegex.test(value)) {
        return {
            ok: false,
            error: 'regex',
        };
    }

    return tryDo(() => JSON.parse(value))();
};

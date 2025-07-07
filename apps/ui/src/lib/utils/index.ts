import { attempt, type Attempt } from '@repo/shared';

const jsonRegex = /^\{[\s\S]*\}$|^\[[\s\S]*\]$/;

export const tryParseJSON = (value: unknown): Attempt<unknown, unknown> => {
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

  return attempt(() => JSON.parse(value))();
};

export const combine = (...fns: (() => void)[]) => {
  return () => {
    for (const fn of fns) {
      fn();
    }
  };
};

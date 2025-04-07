import { tryParseJSON } from '$lib/utils';
import { hashUiEventName } from '@repo/shared';
import { useCallback, useEffect, useMemo } from 'react';

export interface Messenger {
  publish(name: string, ...args: unknown[]): void;
  on(name: string, callback: (...args: any[]) => void): void;
}

export const createMessenger = (): Messenger => {
  const publish = useCallback<Messenger['publish']>((name, ...args) => {
    mp.trigger(hashUiEventName(name), ...args);
  }, []);
  const on = useCallback<Messenger['on']>((name, callback) => {
    useEffect(() => {
      const hashed = hashUiEventName(name);
      const wrapped = (...args: any[]) => {
        callback(
          ...args.map((a) => {
            const tryParse = tryParseJSON(a);
            return tryParse.ok ? tryParse.data : a;
          })
        );
      };
      mp.events.add(hashed, wrapped);
      return () => {
        mp.events.remove(hashed);
      };
    }, []);
  }, []);
  return useMemo(() => ({ publish, on }), [publish, on]);
};

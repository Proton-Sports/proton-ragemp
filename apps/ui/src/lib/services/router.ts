import { useCallback, useMemo, useState } from 'react';

export interface Router {
  readonly routes: Map<string, Record<string, unknown> | undefined>;

  mount: (name: string, props?: Record<string, unknown>) => void;
  unmount: (name: string) => void;
}

export function createRouter(): Router {
  const [routes, setRoutes] = useState(new Map<string, Record<string, unknown> | undefined>());

  const mount = useCallback((route: string, props?: Record<string, unknown>) => {
    setRoutes((a) => new Map(a.set(route, props)));
  }, []);

  const unmount = useCallback((route: string) => {
    setRoutes((a) => {
      const clone = new Map(a);
      clone.delete(route);
      return clone;
    });
  }, []);

  return useMemo(
    () => ({
      routes,
      mount,
      unmount,
    }),
    [routes, mount, unmount]
  );
}

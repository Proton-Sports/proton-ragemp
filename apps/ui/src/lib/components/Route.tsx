import { useRuntime } from '$lib/contexts/runtime-context';
import { useEffect, type ReactNode } from 'react';

export const Route = ({ name, children }: { name: string; children: ReactNode }) => {
  const { messenger } = useRuntime();
  //   const ref = useRef(false);

  useEffect(() => {
    // if (ref.current) return;
    // ref.current = true;
    console.log('ui.router.mount', name);
    messenger.publish('ui.router.mount', name);
    return () => {
      console.log('ui.router.unmount', name);
      messenger.publish('ui.router.unmount', name);
    };
  }, []);

  return <>{children}</>;
};

import { RuntimeContext } from '$lib/contexts/runtime-context';
import { createMessenger } from '$lib/services/messenger';
import { createRouter } from '$lib/services/router';
import { type ReactNode } from 'react';

export default function RageMpRuntimeProvider({ children }: { children: ReactNode }) {
  const router = createRouter();
  const messenger = createMessenger();

  messenger.on('ui.router.mount', (path: string, props?: Record<string, unknown>) => {
    router.mount(path, props);
  });

  messenger.on('ui.router.unmount', (path: string) => {
    router.unmount(path);
  });

  return <RuntimeContext.Provider value={{ router, messenger }}>{children}</RuntimeContext.Provider>;
}

import { Route } from '$lib/components/Route';
import { useRuntime } from '$lib/contexts/runtime-context';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

export default function App() {
  const { router } = useRuntime();

  return (
    <AnimatePresence initial={true}>
      {mp.isBrowser && <div className="fixed inset-0 bg-green-500"></div>}
      {Array.from(router.routes.entries()).map(([key, props]) => {
        const Component = lazy(() => import(`./routes/${key}/Index.tsx`));
        return (
          <Suspense key={key}>
            <Route name={key}>
              <div className="fixed">
                <Component {...(props ?? {})} />
              </div>
            </Route>
          </Suspense>
        );
      })}
    </AnimatePresence>
  );
}

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'mutative';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Arrow from '../../lib/assets/images/arrow_button.png';
import RightBackground from '../../lib/assets/images/race-main-menu-bg.webp';
import LeftBackground from '../../lib/assets/images/racing_menu_list_bg.png';
import Button from '../../lib/components/Button';

type Page = (typeof pages)[number]['id'];

interface Props {
  initialTokens?: number;
  initialActivePage?: Page;
  initialDisabledPages?: Page[];
}

const pages = [
  { id: 'races', label: 'Races', node: lazy(() => import('./Races')) },
  { id: 'collection', label: 'Collection', node: lazy(() => import('./Collection')) },
  { id: 'host', label: 'Host', node: lazy(() => import('./Host')) },
  { id: 'creator-mode', label: 'Creator', node: lazy(() => import('./Creator')) },
  { id: 'settings', label: 'Settings', node: lazy(() => import('./Settings')) },
] as const;

export default function Index({ initialTokens = 0, initialActivePage, initialDisabledPages }: Props = {}) {
  const [tokens, setTokens] = useState(initialTokens);
  const [activePage, setActivePage] = useState(initialActivePage ?? null);
  const [disabledPages, setDisabledPages] = useState(new Set<Page>(initialDisabledPages));
  const ActivePage = useMemo(
    () => pages.find((x) => x.id === activePage && !disabledPages.has(x.id))?.node,
    [activePage, disabledPages]
  );

  useEffect(() => {
    const handleNavigate = (page: Page | null) => {
      setActivePage(page);
    };

    const handleTogglePage = (page: Page, toggle: boolean) => {
      if (toggle) {
        setDisabledPages((a) =>
          create(a, (a) => {
            a.delete(page);
          })
        );
      } else {
        setDisabledPages((a) =>
          create(a, (a) => {
            a.add(page);
          })
        );
      }
    };

    const handleGetToken = (tokens: number) => {
      setTokens(tokens);
    };

    alt.on('race-menu-list:navigate', handleNavigate);
    alt.on('race-menu.pages.toggle', handleTogglePage);
    alt.on('race-menu.tokens.get', handleGetToken);
    alt.emit('race-menu.tokens.get');

    return () => {
      alt.off('race-menu-list:navigate', handleNavigate);
      alt.off('race-menu.pages.toggle', handleTogglePage);
      alt.off('race-menu.tokens.set', handleGetToken);
    };
  }, []);

  function handleChangePage(page: Page) {
    setActivePage((activePage) => (activePage === page ? null : page));
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          visible: { translateX: '0%' },
          hidden: { translateX: '-100%' },
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0"
      >
        <motion.div
          className="fixed inset-0"
          animate={activePage ? 'visible' : 'hidden'}
          variants={{
            visible: { translateX: '0%' },
            hidden: { translateX: '-100%' },
          }}
          initial="hidden"
          transition={{ duration: 0.6, ease: 'circInOut' }}
        >
          <img src={RightBackground} className="absolute object-cover w-full h-full blur-sm" />
          <div className="absolute inset-0 bg-bg-1/60" />
          <AnimatePresence>
            {ActivePage && (
              <motion.div
                key={activePage}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Suspense>
                  <ActivePage />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <img src={LeftBackground} className="fixed h-full" />
        <ol className="fixed space-y-4 -translate-y-1/2 left-4 top-1/2">
          <li className="fugaz uppercase" style={{ marginLeft: '0.6rem' }}>
            {tokens} PT
          </li>
          {pages.map(({ id, label }, index) => {
            const active = activePage === id;
            return (
              <li key={id} className="w-full" style={{ marginLeft: `${index * 0.6 + 0.6}rem` }}>
                <Button
                  transparent={!active}
                  variant={active ? 'primary' : 'base'}
                  className={clsx(
                    'flex items-center w-full text-left uppercase duration-100 group fugaz max-w-40 transition',
                    active && 'translate-x-8'
                  )}
                  onClick={() => handleChangePage(id)}
                  disabled={disabledPages.has(id)}
                >
                  {label}
                  {!disabledPages.has(id) && (
                    <img
                      src={Arrow}
                      className={clsx(
                        'transition-opacity ml-auto w-4',
                        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      )}
                    />
                  )}
                </Button>
              </li>
            );
          })}
        </ol>
      </motion.div>
    </>
  );
}

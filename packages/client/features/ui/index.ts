import { createLock } from '@repo/shared/lock';
import { hashUiEventName } from '@repo/shared/utils';

export type Ui = BrowserMp & {
    on(name: string, handler: (...args: any[]) => void): () => void;
    publish(name: string, ...args: unknown[]): void;
    focus(toggle: boolean): void;
    router: UiRouter;
};

export interface UiRouter {
    isMounted(route: string): boolean;
    mount(route: string, props?: Record<PropertyKey, any>): void;
    unmount(route: string): void;
    onMount(route: string, handler: (...args: any[]) => void | (() => void)): void;
    onDestroy(route: string, handler: (...args: any[]) => void | (() => void)): void;
}

export const createUi = (url: string): Ui => {
    const browser = mp.browsers.new(url);
    const focusLock = createLock();

    const ext = {
        on,
        publish: (name: string, ...args: unknown[]) => {
            browser.call(hashUiEventName(name), ...args);
        },
        focus: (toggle: boolean) => {
            if (toggle) {
                focusLock.acquire(() => {
                    browser.inputEnabled = true;
                    browser.mouseInputEnabled = true;
                });
            } else {
                focusLock.release(() => {
                    browser.inputEnabled = false;
                    browser.mouseInputEnabled = false;
                });
            }
        },
        router: createRouter(browser),
    };

    return Object.assign(browser, ext);
};

const createRouter = (browser: BrowserMp): UiRouter => {
    const onMountHandlers = new Map<string, (() => void)[]>();
    const onDestroyHandlers = new Map<string, (() => void)[]>();
    const transientOnDestroyHandlers = new Map<string, (() => void)[]>();
    const mountedRoutes = new Set<string>();

    const addHandler = (map: Map<string, (() => void)[]>, name: string, handler: () => void) => {
        let handlers = map.get(name);
        if (handlers == null) {
            handlers = [handler];
            map.set(name, handlers);
        } else {
            handlers.push(handler);
        }
    };

    const removeHandler = (map: Map<string, (() => void)[]>, name: string, handler: () => void) => {
        let handlers = map.get(name);
        if (handlers == null) {
            return;
        }
        const index = handlers.indexOf(handler);
        if (index === -1) {
            return;
        }
        handlers.splice(index, 1);
    };

    mp.console.logInfo(`mp.events.add ${hashUiEventName('ui.router.mount')}`);
    mp.events.add(hashUiEventName('ui.router.mount'), (route: string) => {
        mountedRoutes.add(route);
        mp.console.logInfo('ui.router.mount ' + route);
        const handlers = onMountHandlers.get(route);
        if (handlers != null) {
            for (const handler of handlers) {
                const ret = handler();
                if (typeof ret === 'function') {
                    addHandler(transientOnDestroyHandlers, route, ret);
                }
            }
        }
    });

    mp.events.add(hashUiEventName('ui.router.unmount'), (route: string) => {
        mountedRoutes.delete(route);
        const transientHandlers = transientOnDestroyHandlers.get(route);
        for (const handler of [...(onDestroyHandlers.get(route) ?? []), ...(transientHandlers ?? [])]) {
            handler();
        }
        if (transientHandlers) {
            transientOnDestroyHandlers.delete(route);
        }
    });

    return {
        isMounted: (route: string) => {
            return mountedRoutes.has(route);
        },
        mount: (route: string) => {
            mountedRoutes.add(route);
            browser.call(hashUiEventName('ui.router.mount'), route);
        },
        unmount: (route: string) => {
            mountedRoutes.delete(route);
            browser.call(hashUiEventName('ui.router.unmount'), route);
        },
        onMount: (route, handler) => {
            addHandler(onMountHandlers, route, handler);
            return () => {
                removeHandler(onMountHandlers, route, handler);
            };
        },
        onDestroy: (route, handler) => {
            addHandler(onDestroyHandlers, route, handler);
            return () => {
                removeHandler(onDestroyHandlers, route, handler);
            };
        },
    };
};

const on: Ui['on'] = (name, handler) => {
    const hashed = hashUiEventName(name);
    mp.events.add(hashed, handler);
    return () => {
        mp.events.remove(hashed, handler);
    };
};

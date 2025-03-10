import { createLock } from '@repo/shared/lock';

export type Ui = BrowserMp & {
    on(name: string, handler: (...args: any[]) => void): void;
    publish(name: string, ...args: unknown[]): void;
    focus(toggle: boolean): void;
    mount(route: string): void;
    unmount(route: string): void;
};

export const createUi = (url: string): Ui => {
    const browser = mp.browsers.new(url);
    let focusLock = createLock();

    const ext = {
        on,
        publish: (name: string, ...args: unknown[]) => {
            browser.call(name, ...args);
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
        mount: (route: string) => {
            ext.publish('router.mount', route);
        },
        unmount: (route: string) => {
            ext.publish('router.unmount', route);
        },
    };

    return Object.assign(browser, ext);
};

const on: Ui['on'] = (name, handler) => {
    mp.events.add(name, handler);
};

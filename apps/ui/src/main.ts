import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

declare global {
    interface Mp {
        readonly isBrowser?: boolean;
    }
}

if (!('mp' in globalThis)) {
    globalThis.mp = {
        isBrowser: true,
        events: {
            callProc<T = any>(procName: string, ...args: any[]) {
                return Promise.resolve<T>(undefined as T);
            },
            add(name, callback?) {},
            remove(name) {},
            call(name) {},
        },
        trigger(name, ...args) {
            console.log('trigger', name, args);
        },
        invoke(name, ...args) {
            console.log('invoke', name, args);
        },
    };
}

const app = mount(App, {
    target: document.getElementById('app')!,
});

export default app;

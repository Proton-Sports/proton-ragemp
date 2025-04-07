import RageMpRuntimeProvider from '$lib/components/RageMpRuntimeProvider.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Mp {
    readonly isBrowser?: boolean;
  }
}

if (!('alt' in globalThis)) {
  globalThis.alt = {
    isBrowser: true,
    emit() {},
    getBranch() {
      return '';
    },
    getEventListeners() {
      return [];
    },
    getLocale() {
      return '';
    },
    getVersion() {
      return '';
    },
    off() {},
    on() {},
    once() {},
    getPermissionState() {
      return false;
    },
  };
}

if (!('mp' in globalThis)) {
  globalThis.mp = {
    isBrowser: true,
    events: {
      callProc<T = any>() {
        return Promise.resolve<T>(undefined as T);
      },
      add() {},
      remove() {},
      call() {},
    },
    trigger(name, ...args) {
      console.log('trigger', name, args);
    },
    invoke(name, ...args) {
      console.log('invoke', name, args);
    },
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RageMpRuntimeProvider>
      <App />
    </RageMpRuntimeProvider>
  </React.StrictMode>
);

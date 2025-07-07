import { tryParseJSON } from '$lib/utils';
import { hashUiEventName } from '@repo/shared';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface Messenger {
  publish: (name: string, ...args: any[]) => void;

  /**
   * Subscribes a callback to a messenger event for the lifetime of the component.
   *
   * This method declaratively subscribes a callback to a named event. It leverages
   * React Hooks (`useEffect`, `useRef`) to automatically manage the subscription
   * lifecycle, adding the listener when the component mounts and removing it upon unmount.
   *
   * The implementation is optimized using `useRef` to prevent re-subscribing on every
   * render, ensuring high performance even when the callback's identity changes due
   * to component state updates. Event arguments that are valid JSON strings will be
   * automatically parsed before being passed to the callback.
   *
   * @warning **IMPORTANT USAGE RULE:** This function internally calls React Hooks.
   * Therefore, it **MUST** be called at the top level of a React function component,
   * just like any other hook (e.g., `useState`, `useEffect`). Calling it from
   * anywhere else (like inside an event handler, a `setTimeout`, a condition, or a loop)
   * will result in an "Invalid hook call" error and crash your application.
   *
   * @param {string} name The name of the event to subscribe to.
   * @param {(...args: any[]) => void} callback The function to execute when the event
   * is published. This callback will always have access to the latest component
   * state and props, avoiding stale closures.
   *
   * @example
   * // --- Correct Usage ---
   * function MyComponent({ messenger }) {
   *   const [count, setCount] = useState(0);
   *
   *   const handleEvent = (payload) => {
   *     console.log('Event received with payload:', payload);
   *     console.log('Current count is:', count); // Always logs the latest count
   *   };
   *
   *   // ✅ CORRECT: Called at the top level of the component.
   *   messenger.on('my-event', handleEvent);
   *
   *   return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
   * }
   *
   * // --- Incorrect Usage ---
   * function BrokenComponent({ messenger }) {
   *   const handleClick = () => {
   *      // ❌ INCORRECT: Do not call from an event handler.
   *      messenger.on('my-event', () => {}); // This will crash the app.
   *   }
   *   return <button onClick={handleClick}>Subscribe</button>;
   * }
   */
  on: (name: string, callback: (...args: any[]) => void) => void;
}

export const createMessenger = (): Messenger => {
  const publish = useCallback<Messenger['publish']>((name, ...args) => {
    mp.trigger(hashUiEventName(name), ...args);
  }, []);
  const on = useCallback<Messenger['on']>((name, callback) => {
    const ref = useRef(callback);
    useEffect(() => {
      ref.current = callback;
    }, [callback]);
    useEffect(() => {
      const hashed = hashUiEventName(name);
      const wrapped = (...args: any[]) => {
        ref.current(
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
    }, [name]);
  }, []);
  return useMemo(() => ({ publish, on }), [publish, on]);
};

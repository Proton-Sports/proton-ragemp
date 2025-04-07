import type { Runtime } from '$lib/services/runtime';
import { createContext, useContext } from 'react';

export const RuntimeContext = createContext<Runtime>(null!);

export const useRuntime = () => {
  return useContext(RuntimeContext);
};

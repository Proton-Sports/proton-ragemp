import type { Logger } from 'pino';

export interface Runtime {
    logger: Logger;
}

export const createRuntime = (runtime: Runtime) => runtime;

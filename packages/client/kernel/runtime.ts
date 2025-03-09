import type { Ui } from '@features/ui';
import type { Logger } from './logger';

export interface Runtime {
    ui: Ui;
    logger: Logger;
}

export const createRuntime = (runtime: Runtime) => runtime;

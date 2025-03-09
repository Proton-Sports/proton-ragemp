import type { Ui } from '../features/ui';

export interface Runtime {
    ui: Ui;
}

export const createRuntime = ({ ui }: Runtime) => ({ ui });

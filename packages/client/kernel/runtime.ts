import type { Ui } from '@features/ui';
import type { Logger } from './logger';
import type { Game } from './game';

export interface Runtime {
    readonly ui: Ui;
    readonly logger: Logger;
    readonly game: Game;
}

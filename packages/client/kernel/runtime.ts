import type { Ui } from '@features/ui';
import type { Game } from './game';
import type { Logger } from './logger';
import type { Messenger } from './messenger';

export interface Runtime {
    readonly ui: Ui;
    readonly logger: Logger;
    readonly game: Game;
    readonly messenger: Messenger;
}

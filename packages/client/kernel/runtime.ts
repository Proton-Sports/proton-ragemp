import type { StreamedMetaStore } from '@duydang2311/ragemp-utils-client';
import type { NotificationService } from '@features/hud/common/notification-service';
import type { IplService } from '@features/ipls/common/ipl-service';
import type { NoClipService } from '@features/noclip/common/noclip-service';
import type { RaceCreator } from '@features/races/common/race-creator';
import type { RaceService } from '@features/races/common/race-service';
import type { Ui } from '@features/ui';
import type { Game } from './game';
import type { Logger } from './logger';
import type { Messenger } from './messenger';

export interface Runtime {
    readonly ui: Ui;
    readonly logger: Logger;
    readonly game: Game;
    readonly messenger: Messenger;
    readonly fetch: typeof globalThis.fetch;
    readonly ipl: IplService;
    readonly notification: NotificationService;
    readonly noclip: NoClipService;
    readonly raceCreator: RaceCreator;
    readonly raceService: RaceService;
    readonly streamedMetaStore: StreamedMetaStore;
}

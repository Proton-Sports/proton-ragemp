import type { StreamedMetaStore } from '@duydang2311/ragemp-utils-server';
import type { Db } from '@repo/db';
import type { Logger } from 'pino';
import type { GarageService } from '~/features/vehicles/common/types';
import type { IplOptions } from '../features/ipls/common/ipl-options';
import type { IplService } from '../features/ipls/common/ipl-service';
import type { NoClip } from '../features/noclip/common/types';
import type { ClosetService } from '../features/players/common/closet-service';
import type { RaceMapCache, RacePointResolver, RaceService } from '../features/races/common/types';
import type { Messenger } from './messenger';

export interface Runtime {
    readonly logger: Logger;
    readonly messenger: Messenger;
    readonly fetch: typeof import('node-fetch')['default'];
    readonly env: {
        readonly DISCORD_OAUTH2_CLIENT_ID: string;
        readonly DISCORD_OAUTH2_CLIENT_SECRET: string;
    };
    readonly db: Db;
    readonly iplService: IplService;
    readonly iplOptions: IplOptions;
    readonly closetService: ClosetService;
    readonly raceService: RaceService;
    readonly noClip: NoClip;
    readonly streamedMetaStore: StreamedMetaStore;
    readonly raceMapCache: RaceMapCache;
    readonly racePointResolvers: RacePointResolver[];
    readonly garageService: GarageService;
}

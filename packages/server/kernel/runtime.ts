import type { Db } from '@repo/db';
import type { Logger } from 'pino';
import type { IplOptions } from '../features/ipls/common/ipl-options';
import type { IplService } from '../features/ipls/common/ipl-service';
import type { ClosetService } from '../features/players/common/closet-service';
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
    readonly ipl: IplService;
    readonly iplOptions: IplOptions;
    readonly closetService: ClosetService;
}

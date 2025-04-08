import type { Logger } from 'pino';
import type { Messenger } from './messenger';
import type { Db } from '@repo/db';

export interface Runtime {
    readonly logger: Logger;
    readonly messenger: Messenger;
    readonly fetch: typeof import('node-fetch')['default'];
    readonly env: {
        readonly DISCORD_OAUTH2_CLIENT_ID: string;
        readonly DISCORD_OAUTH2_CLIENT_SECRET: string;
    };
    readonly db: Db;
}

import { createRemoteMessenger } from '@kernel/messenger';
import { createDb } from '@repo/db';
import config from 'config';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pino from 'pino';
import type { IplOptions } from './features/ipls/common/ipl-options';
import { createIplService } from './features/ipls/common/ipl-service';
import ipls from './features/ipls/scripts';
import { createRageMpClosetService } from './features/players/common/closet-service';
import players from './features/players/scripts';

dotenv.config();

if (!process.env.DISCORD_OAUTH2_CLIENT_ID) {
    throw new Error('Missing environment variable: DISCORD_OAUTH2_CLIENT_ID');
}

if (!process.env.DISCORD_OAUTH2_CLIENT_SECRET) {
    throw new Error('Missing environment variable: DISCORD_OAUTH2_CLIENT_SECRET');
}

if (!process.env.DB_CONNECTION_STRING) {
    throw new Error('Missing environment variable: DB_CONNECTION_STRING');
}

const env = {
    DISCORD_OAUTH2_CLIENT_ID: process.env.DISCORD_OAUTH2_CLIENT_ID,
    DISCORD_OAUTH2_CLIENT_SECRET: process.env.DISCORD_OAUTH2_CLIENT_SECRET,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
};

const messenger = createRemoteMessenger();

const runtime = {
    logger: pino(),
    messenger,
    fetch,
    env,
    db: createDb(env.DB_CONNECTION_STRING),
    ipl: createIplService(messenger),
    iplOptions: config.get<IplOptions>('Ipl'),
    closetService: createRageMpClosetService(),
};

for (const script of [...players, ...ipls]) {
    script.fn({
        ...runtime,
        logger: runtime.logger.child({ instance: `script:${script.name}` }),
    });
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

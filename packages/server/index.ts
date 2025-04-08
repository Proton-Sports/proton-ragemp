import { createRemoteMessenger } from '@kernel/messenger';
import { createDb } from '@repo/db';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pino from 'pino';
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

const runtime = {
    logger: pino(),
    messenger: createRemoteMessenger(),
    fetch,
    env,
    db: createDb(env.DB_CONNECTION_STRING),
};

for (const script of [...players]) {
    script.fn({
        ...runtime,
        logger: runtime.logger.child({ instance: `script:${script.name}` }),
    });
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

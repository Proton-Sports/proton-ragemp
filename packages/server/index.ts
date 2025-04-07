import { createRemoteMessenger } from '@kernel/messenger';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pino from 'pino';
import auth from './features/auth/scripts';

dotenv.config();

if (!process.env.DISCORD_OAUTH2_CLIENT_ID || !process.env.DISCORD_OAUTH2_CLIENT_SECRET) {
    throw new Error('Missing environment variables: DISCORD_OAUTH2_CLIENT_ID, DISCORD_OAUTH2_CLIENT_SECRET');
}

const runtime = {
    logger: pino(),
    messenger: createRemoteMessenger(),
    fetch,
    env: {
        DISCORD_OAUTH2_CLIENT_ID: process.env.DISCORD_OAUTH2_CLIENT_ID,
        DISCORD_OAUTH2_CLIENT_SECRET: process.env.DISCORD_OAUTH2_CLIENT_SECRET,
    },
};

for (const script of [...auth]) {
    script.fn(
        Object.assign(runtime, {
            logger: runtime.logger.child({ instance: `script:${script.name}` }),
        }),
    );
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

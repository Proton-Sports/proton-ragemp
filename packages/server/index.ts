import { createRemoteMessenger } from '@kernel/messenger';
import fetch from 'node-fetch';
import pino from 'pino';
import players from './features/players/scripts';
import dotenv from 'dotenv';

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

for (const script of [...players]) {
    script.fn(
        Object.assign(runtime, {
            logger: runtime.logger.child({ instance: `script:${script.name}` }),
        }),
    );
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

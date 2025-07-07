import { RageMpStreamedMetaStore } from '@duydang2311/ragemp-utils-server';
import { createRemoteMessenger } from '@kernel/messenger';
import type { Runtime } from '@kernel/runtime';
import { createDb } from '@repo/db';
import config from 'config';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pino from 'pino';
import type { IplOptions } from './features/ipls/common/ipl-options';
import { createIplService } from './features/ipls/common/ipl-service';
import ipls from './features/ipls/scripts';
import { RageMpNoClip } from './features/noclip/ragemp-no-clip';
import { createRageMpClosetService } from './features/players/common/closet-service';
import players from './features/players/scripts';
import { createRageMpRaceService } from './features/races/default-race-service';
import { LRURaceMapCache } from './features/races/lru-map-cache';
import { RacePointLapResolver, RacePointRallyResolver } from './features/races/race-point-resolver';
import races from './features/races/scripts';
import { RageMpGarageService } from './features/vehicles/garage-service';

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
const db = createDb(env.DB_CONNECTION_STRING);

const runtime: Runtime = {
    logger: pino(),
    messenger,
    fetch,
    env,
    db,
    iplService: createIplService(messenger),
    iplOptions: config.get<IplOptions>('Ipl'),
    closetService: createRageMpClosetService(),
    raceService: createRageMpRaceService(),
    noClip: new RageMpNoClip(messenger),
    streamedMetaStore: new RageMpStreamedMetaStore({
        debug: true,
        entityTypes: ['player'],
    }),
    raceMapCache: new LRURaceMapCache(db),
    racePointResolvers: [new RacePointLapResolver(), new RacePointRallyResolver()],
    garageService: new RageMpGarageService(db),
};

runtime.streamedMetaStore.init();

for (const script of [...players, ...ipls, ...races]) {
    script.fn({
        ...runtime,
        logger: runtime.logger.child({ instance: `script:${script.name}` }),
    });
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

import { RageMpStreamedMetaStore } from '@duydang2311/ragemp-utils-client';
import chat from '@features/chat/scripts';
import { createRageMpNotificationService } from '@features/hud/common/notification-service';
import hud from '@features/hud/scripts';
import { createRageMpIplService } from '@features/ipls/common/ipl-service';
import ipls from '@features/ipls/scripts';
import { createRageMpNoClipService } from '@features/noclip/common/noclip-service';
import noclip from '@features/noclip/scripts';
import players from '@features/players/scripts';
import { createDefaultRaceService } from '@features/races/default-race-service';
import { createLandRaceCreator } from '@features/races/land-race-creator';
import { createRacePointLapResolver } from '@features/races/race-point-lap-resolver';
import { createRacePointRallyResolver } from '@features/races/race-point-rally-resolver';
import races from '@features/races/scripts';
import { createUi } from '@features/ui';
import ui from '@features/ui/scripts';
import { createRageMpGame } from '@kernel/game';
import { createMpLogger } from '@kernel/logger';
import { createRemoteMessenger } from '@kernel/messenger';
import { type Runtime } from '@kernel/runtime';

const runtime: Runtime = {
    ui: createUi('http://localhost:5173'),
    logger: createMpLogger({ save: true }),
    game: createRageMpGame(),
    messenger: createRemoteMessenger(),
    fetch: globalThis.fetch,
    ipl: createRageMpIplService(),
    notification: createRageMpNotificationService(),
    noclip: createRageMpNoClipService(),
    raceCreator: createLandRaceCreator(),
    raceService: createDefaultRaceService([createRacePointLapResolver(), createRacePointRallyResolver()]),
    streamedMetaStore: new RageMpStreamedMetaStore({
        debug: true,
        entityTypes: ['player'],
    }),
};

runtime.streamedMetaStore.init();

for (const script of [...chat, ...players, ...ipls, ...hud, ...noclip, ...ui, ...races]) {
    script.fn(runtime);
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

import chat from '@features/chat/scripts';
import { createRageMpNotificationService } from '@features/hud/common/notification-service';
import hud from '@features/hud/scripts';
import { createRageMpIplService } from '@features/ipls/common/ipl-service';
import ipls from '@features/ipls/scripts';
import { createRageMpNoClipService } from '@features/noclip/common/noclip-service';
import noclip from '@features/noclip/scripts';
import players from '@features/players/scripts';
import { createUi } from '@features/ui';
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
};

for (const script of [...chat, ...players, ...ipls, ...hud, ...noclip]) {
    script.fn(runtime);
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

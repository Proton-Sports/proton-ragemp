import chat from '@features/chat/scripts';
import { createRageMpNotificationService } from '@features/hud/common/notification-service';
import { createRageMpIplService } from '@features/ipls/common/ipl-service';
import ipls from '@features/ipls/scripts';
import players from '@features/players/scripts';
import hud from '@features/hud/scripts';
import { createUi } from '@features/ui';
import { createGame } from '@kernel/game';
import { createMpLogger } from '@kernel/logger';
import { createRemoteMessenger } from '@kernel/messenger';
import { type Runtime } from '@kernel/runtime';

const runtime: Runtime = {
    ui: createUi('http://localhost:5173'),
    logger: createMpLogger({ save: true }),
    game: createGame(),
    messenger: createRemoteMessenger(),
    fetch: globalThis.fetch,
    ipl: createRageMpIplService(),
    notification: createRageMpNotificationService(),
};

for (const script of [...chat, ...players, ...ipls, ...hud]) {
    script.fn(runtime);
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

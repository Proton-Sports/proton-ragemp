import chat from '@features/chat/scripts';
import players from '@features/players/scripts';
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
};

for (const script of [...chat, ...players]) {
    script.fn(runtime);
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

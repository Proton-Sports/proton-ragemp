import chat from '@features/chat/scripts';
import { createUi } from '@features/ui';
import { createMpLogger } from '@kernel/logger';
import { createRuntime } from '@kernel/runtime';

const runtime = createRuntime({
    ui: createUi('http://localhost:5173'),
    logger: createMpLogger({ save: true }),
});

for (const script of [...chat]) {
    script.fn(runtime);
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

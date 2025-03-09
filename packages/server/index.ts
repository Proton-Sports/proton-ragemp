import pino from 'pino';
import players from './features/players/scripts';
import { createRuntime } from './kernel/runtime';

const runtime = createRuntime({
    logger: pino(),
});

for (const script of [...players]) {
    script.fn({
        logger: runtime.logger.child({ instance: `script:${script.name}` }),
    });
    runtime.logger.info(`Loaded script: ${script.name}.`);
}

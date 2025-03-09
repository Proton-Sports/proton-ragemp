import chat from './features/chat/scripts';
import { createUi } from './features/ui';
import { createRuntime } from './kernel/runtime';

const runtime = createRuntime({
    ui: createUi('http://localhost:5173'),
});

for (const script of [...chat]) {
    script.fn(runtime);
    mp.console.logInfo(`Loaded script: ${script.name}.`);
}

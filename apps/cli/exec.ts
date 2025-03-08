import path from 'path';
import Bun from 'bun';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            RAGEMP_SERVER_EXECUTABLE_PATH: string;
        }
    }
}

const proc = Bun.spawn([path.resolve(process.cwd(), process.env.RAGEMP_SERVER_EXECUTABLE_PATH)], {
    cwd: path.resolve(process.cwd(), path.dirname(process.env.RAGEMP_SERVER_EXECUTABLE_PATH)),
});

for await (const chunk of proc.stdout) {
    console.log(new TextDecoder().decode(chunk));
}

proc.exited.then((code) => {
    console.log(`Process exited with code ${code}.`);
});

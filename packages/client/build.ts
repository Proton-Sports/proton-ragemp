/// <reference types="@types/node" />

import Bun from 'bun';
import path from 'node:path';
import { build } from 'tsup';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUILD_OUTDIR: string;
        }
    }
}

const watch = process.argv.includes('--watch');

Bun.write(path.join(process.env.BUILD_OUTDIR, 'index.js'), "require('./client/index.js');\n");

await build({
    entry: ['index.ts'],
    format: 'esm',
    platform: 'node',
    metafile: true,
    target: 'node14',
    outDir: path.join(process.env.BUILD_OUTDIR, 'client'),
    clean: true,
    minify: !watch,
    watch,
    splitting: true,
});

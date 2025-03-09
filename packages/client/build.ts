/// <reference types="@types/node" />

import { build } from 'tsup';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUILD_OUTDIR: string;
        }
    }
}

await build({
    entry: ['index.ts'],
    format: 'esm',
    target: 'esnext',
    outDir: process.env.BUILD_OUTDIR,
    minify: process.argv.includes('--watch'),
    watch: process.argv.includes('--watch'),
    splitting: true,
    platform: 'neutral'
});

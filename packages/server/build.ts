import { build } from 'tsup';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUILD_OUTDIR: string;
        }
    }
}

const watch = process.argv.includes('--watch');

await build({
    entry: ['index.ts'],
    format: 'cjs',
    platform: 'node',
    metafile: true,
    target: 'node14',
    outDir: process.env.BUILD_OUTDIR,
    clean: true,
    sourcemap: watch,
    minify: !watch,
    watch,
    outExtension: () => ({ js: '.js' }),
});

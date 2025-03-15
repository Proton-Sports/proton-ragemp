/// <reference types="@types/node" />

import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [svelte()],
        build: {
            outDir: env.VITE_BUILD_OUTDIR,
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                $lib: path.resolve('./src/lib'),
            },
        },
    };
});

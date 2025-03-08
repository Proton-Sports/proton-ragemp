import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [svelte()],
        build: {
            outDir: env.VITE_BUILD_OUTDIR,
            emptyOutDir: true,
        },
    };
});

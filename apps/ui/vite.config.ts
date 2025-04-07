import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: './',
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

import { build } from 'tsup';
import fs from 'node:fs/promises';
import path from 'node:path';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUILD_OUTDIR: string;
            SERVER_FILES_DIR: string;
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
    plugins: [
        {
            name: 'copy-config',
            buildEnd: async () => {
                const dirents = await fs.readdir('./config', { withFileTypes: true });
                const outDir = path.join(process.env.SERVER_FILES_DIR, 'config');
                try {
                    await fs.access(outDir, fs.constants.R_OK);
                } catch (e) {
                    await fs.mkdir(outDir);
                }

                for (const dirent of dirents.filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))) {
                    const outFile = path.join(outDir, dirent.name);
                    try {
                        await fs.access(outFile, fs.constants.W_OK);
                        await fs.rm(outFile);
                    } catch (e) {}
                    await fs.copyFile(
                        path.join(__dirname, 'config', dirent.name),
                        path.join(outDir, dirent.name),
                        fs.constants.COPYFILE_FICLONE_FORCE,
                    );
                }
            },
        },
    ],
});

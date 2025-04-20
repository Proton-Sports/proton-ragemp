import { createScript } from '@kernel/script';
import { attempt } from '@repo/shared';

export default createScript({
    name: 'ipls.unload',
    fn: ({ messenger, logger, ipl }) => {
        // Handle direct IPL unloading
        messenger.on('ipls.unload', async (name: string) => {
            logger.info(`Unloading IPL: ${name}`);
            const unloadAttempt = await attempt.promise(() => ipl.unloadAsync(name))();

            if (unloadAttempt.ok) {
                logger.info(`IPL unload success for ${name}`);
            } else {
                logger.error(`IPL unload failed for ${name}`);
            }
        });

        // Handle multiple IPLs unloading
        messenger.on('ipls.unload.batch', async (names: string[]) => {
            logger.info(`Unloading multiple IPLs: ${names.join(', ')}`);
            await Promise.all(
                names.map(async (name) => {
                    const attempt = await ipl.unloadAsync(name);
                    if (attempt.ok) {
                        logger.info(`IPL unload success for ${name}`);
                    } else {
                        logger.error(`IPL unload failed for ${name}`);
                    }
                }),
            );
        });

        // Handle async IPL unloading
        messenger.on('ipls.unload.async', async (id: number, name: string) => {
            logger.info(`Unloading IPL async: ${name} (ID: ${id})`);

            const unloadAttempt = await attempt.promise(() => ipl.unloadAsync(name))();

            if (unloadAttempt.ok) {
                logger.info(`IPL unload success for ${name}`);
            } else {
                logger.error(`IPL unload failed for ${name}`);
            }

            // Notify server about completion regardless of success/failure
            messenger.publish('ipls.unload.async.complete', id);
        });
    },
});

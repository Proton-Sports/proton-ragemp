import { createScript } from '@kernel/script';

export default createScript({
    name: 'load-ipls',
    fn: ({ messenger, logger, ipl }) => {
        messenger.on('ipls.load', async (name: string) => {
            const loadAttempt = await ipl.loadAsync(name);

            if (loadAttempt.ok) {
                logger.info(`IPL load success for ${name}`);
            } else {
                logger.error(`IPL load failed for ${name}`);
            }
        });

        // Handle async IPL loading with callback
        messenger.on('ipls.load.async', async (id: number, name: string) => {
            logger.info(`Loading IPL async: ${name} (ID: ${id})`);

            const loadAttempt = await ipl.loadAsync(name);

            if (loadAttempt.ok) {
                logger.info(`IPL load success for ${name}`);
            } else {
                logger.error(`IPL load failed for ${name}`);
            }

            // Notify server about completion regardless of success/failure
            messenger.publish('ipls.load.async.complete', id);
        });
    },
});

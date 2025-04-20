import { createScript } from '@kernel/script';

export default createScript({
    name: 'noclip',
    fn: ({ messenger, logger, noclip }) => {
        // Listen for server commands to start/stop noclip mode
        messenger.on('noclip.start', () => {
            if (!noclip.isStarted) {
                logger.info('Starting noclip mode');
                noclip.start();
            }
        });

        messenger.on('noclip.stop', () => {
            if (noclip.isStarted) {
                logger.info('Stopping noclip mode');
                noclip.stop();
            }
        });
    },
});

import { createScript } from '@kernel/script';

export default createScript({
    name: 'sync-collision',
    fn: ({ streamedMetaStore, logger }) => {
        streamedMetaStore.on('change', 'collision', (entity, current) => {
            if (current) {
                entity.setCollision(current.toggle, current.keepPhysics);
            } else {
                entity.setCollision(true, true);
            }
        });

        mp.events.add('consoleCommand', (command) => {
            logger.info('consoleCommand', command);
            mp.events.callRemote('sync-collision', command);
        });
    },
});

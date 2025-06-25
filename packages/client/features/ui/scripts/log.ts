import { createScript } from '@kernel/script';

export default createScript({
    name: 'ui-log',
    fn: ({ ui, logger }) => {
        ui.on('logger.info', (...messages: unknown[]) => {
            logger.info(...messages);
        });
        ui.on('logger.warning', (...messages: unknown[]) => {
            logger.warning(...messages);
        });
        ui.on('logger.error', (...messages: unknown[]) => {
            logger.error(...messages);
        });
        ui.on('logger.fatal', (...messages: unknown[]) => {
            logger.fatal(...messages);
        });
        ui.on('logger.clear', () => {
            logger.clear();
        });
        ui.on('logger.reset', () => {
            logger.reset();
        });
    },
});

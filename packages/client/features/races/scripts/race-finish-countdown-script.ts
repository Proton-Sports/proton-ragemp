import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-finish-countdown',
    fn: ({ ui, messenger, logger }) => {
        messenger.on('race-finish-countdown:start', (dto) => {
            onStart(dto).catch((error) => logger.error(error.toString()));
        });

        messenger.on('race:destroy', () => {
            onDestroy();
        });

        async function onStart(dto: any) {
            const mounted = await ui.router.mountAsync('race-finish-countdown');
            if (mounted.failed) {
                return;
            }

            ui.publish('race-finish-countdown:setData', dto);
        }

        function onDestroy() {
            ui.router.unmount('race-finish-countdown');
        }
    },
});

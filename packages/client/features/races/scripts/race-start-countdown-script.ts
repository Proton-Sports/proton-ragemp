import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-start-countdown',
    fn: ({ ui, messenger }) => {
        messenger.on('race-start-countdown:mount', () => {
            onCountdownMount();
        });

        messenger.on('race-start-countdown:start', () => {
            onCountdownStart();
        });

        messenger.on('race:start', (id) => {
            onRaceStart(id);
        });

        function onCountdownMount() {
            ui.router.mount('race-start-countdown');
        }

        function onCountdownStart() {
            ui.publish('race-start-countdown:setStatus', 'running');
        }

        function onRaceStart(id: number) {
            setTimeout(() => {
                ui.router.unmount('race-start-countdown');
            }, 1000);
        }
    },
});

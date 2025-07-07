import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-respawn',
    fn: ({ messenger, logger, raceService }) => {
        let holdingInterval: number | null = null;
        let holdingStartTime: number = 0;

        return {
            start: () => {
                raceService.on('started', onStarted);
                raceService.on('stopped', onStopped);
            },
        };

        function onStarted() {
            mp.keys.bind(0x52, false, onKeyDown); // R key
            mp.keys.bind(0x52, true, onKeyUp); // R key on release
            mp.events.add('render', onTick);
        }

        function onTick() {
            // Disable weapon switch button (typically TAB, control 80)
            mp.game.controls.disableControlAction(0, 80, true);
        }

        function onStopped() {
            mp.keys.unbind(0x52, false, onKeyDown);
            mp.keys.unbind(0x52, true, onKeyUp);
            mp.events.remove('render', onTick);
        }

        function onKeyDown() {
            holdingStartTime = Date.now();
            if (holdingInterval === null) {
                holdingInterval = setInterval(onHoldingR, 50) as unknown as number;
            }
        }

        function onKeyUp() {
            if (holdingStartTime > 0) {
                stopHoldingDetect();
            }
        }

        function onHoldingR() {
            if (Date.now() - holdingStartTime >= 1000) {
                messenger.publish('race-respawn:respawn');
                stopHoldingDetect();
            }
        }

        function stopHoldingDetect() {
            holdingStartTime = 0;
            if (holdingInterval !== null) {
                clearInterval(holdingInterval);
                holdingInterval = null;
            }
        }
    },
});

import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-leave',
    fn: ({ messenger, ipl, raceService }) => {
        let keyHandlerAdded = false;

        messenger.on('race:join', (raceId) => {
            handleServerJoin(raceId);
        });

        messenger.on('race:leave', async (raceId) => {
            await handleServerLeaveAsync(raceId);
        });

        messenger.on('race:prepare', (raceId) => {
            handleServerPrepare(raceId);
        });

        function handleServerJoin(raceId: number) {
            if (!keyHandlerAdded) {
                mp.keys.bind(0x51, false, handleKeyUp); // Q key (keycode 81)
                keyHandlerAdded = true;
            }
        }

        async function handleServerLeaveAsync(raceId: number) {
            if (keyHandlerAdded) {
                mp.keys.unbind(0x51, false, handleKeyUp);
                keyHandlerAdded = false;

                if (raceService.iplName && ipl.isLoaded(raceService.iplName)) {
                    await ipl.unloadAsync(raceService.iplName);
                }
            }
        }

        function handleServerPrepare(raceId: number) {
            if (keyHandlerAdded) {
                mp.keys.unbind(0x51, false, handleKeyUp);
                keyHandlerAdded = false;
            }
        }

        function handleKeyUp() {
            messenger.publish('race-leave:leave');
        }
    },
});

import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-finish',
    fn: ({ ui, messenger }) => {
        messenger.on('race-finish:mountScoreboard', (dto) => {
            onServerMountScoreboard(dto);
        });

        messenger.on('race:destroy', () => {
            onRaceDestroy();
        });

        ui.router.onMount('race-finish-scoreboard', () => {
            onMount();
            return () => {
                onRaceFinishScoreboardUnmount();
            };
        });

        function onServerMountScoreboard(dto: any) {
            ui.router.mount('race-finish-scoreboard', dto);
        }

        function onRaceDestroy() {
            ui.router.unmount('race-finish-scoreboard');
        }

        function onRaceFinishScoreboardUnmount() {
            mp.keys.unbind(0x58, false, onKeyX); // X key
        }

        function onMount() {
            mp.keys.bind(0x58, false, onKeyX); // X key
        }

        function onKeyX() {
            ui.publish('race-finish-scoreboard:toggle');
        }
    },
});

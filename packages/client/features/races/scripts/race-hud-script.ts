import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-hud',
    fn: ({ ui, messenger }) => {
        ui.router.onMount('race-hud', () => {
            onMount();
        });

        messenger.on('race-prepare:exitTransition', () => {
            onServerRacePrepareExitTransition();
        });

        messenger.on('race-hud:startTime', (time) => {
            onServerStartTime(time);
        });

        messenger.on('race-hud:getData', (dto) => {
            onServerGetData(dto);
        });

        messenger.on('race-hud:tick', (dto) => {
            onServerTick(dto);
        });

        messenger.on('race-hud:lapTime', (time) => {
            onServerLapTime(time);
        });

        messenger.on('race:finish', () => {
            onFinish();
        });

        messenger.on('race:destroy', () => {
            onDestroy();
        });

        messenger.on('race-hud:mount', () => {
            onServerMount();
        });

        function onServerRacePrepareExitTransition() {
            ui.router.mount('race-hud');
        }

        function onServerMount() {
            ui.router.mount('race-hud');
        }

        function onServerStartTime(startTime: number) {
            ui.publish('race-hud:startTime', startTime);
        }

        function onMount() {
            messenger.publish('race-hud:getData');
        }

        function onServerGetData(dto: any) {
            dto.localId = mp.players.local.remoteId;
            ui.publish('race-hud:getData', dto);
        }

        function onServerTick(dto: any) {
            ui.publish('race-hud:tick', dto);
        }

        function onServerLapTime(timestamp: number) {
            ui.publish('race-hud:lapTime', timestamp);
        }

        function onFinish() {
            ui.publish('race-hud:status', 'stop');
        }

        function onDestroy() {
            ui.router.unmount('race-hud');
        }
    },
});

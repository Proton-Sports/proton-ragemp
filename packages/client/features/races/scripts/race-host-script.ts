import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-host',
    fn: ({ ui, messenger }) => {
        ui.on('race-host:submit', (dto) => {
            handleWebViewSubmit(dto);
        });

        ui.on('race-host:availableMaps', () => {
            handleWebViewAvailableMaps();
        });

        ui.on('race-host:getMaxRacers', (mapId) => {
            handleWebViewGetMaxRacers(mapId);
        });

        messenger.on('race-host:submit', () => {
            handleServerSubmit();
        });

        messenger.on('race-host:availableMaps', (dtos) => {
            handleServerAvailableMaps(dtos);
        });

        messenger.on('race-host:getMaxRacers', (racers) => {
            handleServerGetMaxRacers(racers);
        });

        function handleWebViewSubmit(dto: any) {
            messenger.publish('race-host:submit', dto);
        }

        function handleWebViewAvailableMaps() {
            messenger.publish('race-host:availableMaps');
        }

        function handleWebViewGetMaxRacers(mapId: number) {
            messenger.publish('race-host:getMaxRacers', mapId);
        }

        function handleServerSubmit() {
            ui.publish('race-menu-list:navigate', 'races');
        }

        function handleServerAvailableMaps(dtos: any) {
            ui.publish('race-host:availableMaps', dtos);
        }

        function handleServerGetMaxRacers(racers: number) {
            ui.publish('race-host:getMaxRacers', racers);
        }
    },
});

import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-menu-races-tab',
    fn: ({ ui, messenger }) => {
        messenger.on('race-menu-races:getRaces', (dtos) => {
            handleServerGetRaces(dtos);
        });

        messenger.on('race-menu-races:getDetails', (dto) => {
            handleServerGetDetails(dto);
        });

        messenger.on('race-menu-races:participantChanged', (raceId, type, dto) => {
            handleServerSetParticipants(raceId, type, dto);
        });

        messenger.on('race-menu-races:raceChanged', (type, dto) => {
            handleServerRaceChanged(type, dto);
        });

        ui.on('race-menu-races:getRaces', () => {
            handleUiGetRaces();
        });

        ui.on('race-menu-races:getDetails', (id) => {
            handleUiGetDetails(id);
        });

        ui.on('race-menu-races:join', (id) => {
            handleUiJoin(id);
        });

        function handleServerGetRaces(dtos: any) {
            ui.publish('race-menu-races:getRaces', dtos);
        }

        function handleServerGetDetails(dto: any) {
            ui.publish('race-menu-races:getDetails', dto);
        }

        function handleServerSetParticipants(raceId: number, type: string, dto: any) {
            if (ui.router.isMounted('race-menu')) {
                ui.publish('race-menu-races:participantChanged', raceId, type, dto);
            }
        }

        function handleUiGetRaces() {
            messenger.publish('race-menu-races:getRaces');
        }

        function handleUiGetDetails(id: number) {
            messenger.publish('race-menu-races:getDetails', id);
        }

        function handleUiJoin(id: number) {
            messenger.publish('race-menu-races:join', id);
        }

        function handleServerRaceChanged(type: string, dto: any) {
            if (ui.router.isMounted('race-menu')) {
                ui.publish('race-menu-races:raceChanged', type, dto);
            }
        }
    },
});

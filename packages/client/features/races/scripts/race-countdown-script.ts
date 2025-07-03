import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-countdown',
    fn: ({ ui, messenger }) => {
        messenger.on('race-countdown.mount', (dto) => {
            handleServerMount(dto);
        });

        messenger.on('race-countdown.unmount', () => {
            handleServerUnmount();
        });

        messenger.on('race-countdown.participants.add', (dto) => {
            onAddParticipant(dto);
        });

        messenger.on('race-countdown.participants.remove', (id) => {
            onRemoveParticipant(id);
        });

        messenger.on('race-countdown.ready.change', (id, ready) => {
            onServerReadyChange(id, ready);
        });

        messenger.on('race-countdown.countdown.set', (seconds) => {
            onServerSetCountdown(seconds);
        });

        messenger.on('race-countdown.vehicle.change', (id, dto) => {
            onServerVehicleChange(id, dto);
        });

        ui.on('race-countdown.ready.change', (ready) => {
            onUiReadyChange(ready);
        });

        ui.on('race-countdown.vehicle.change', (dto) => {
            onUiVehicleChange(dto);
        });

        function handleServerMount(dto: any) {
            ui.router.mount('race-countdown', dto);
        }

        function handleServerUnmount() {
            ui.router.unmount('race-countdown');
        }

        function onAddParticipant(dto: any) {
            ui.publish('race-countdown.participants.add', dto);
        }

        function onRemoveParticipant(id: number) {
            ui.publish('race-countdown.participants.remove', id);
        }

        function onUiReadyChange(ready: boolean) {
            messenger.publish('race-countdown.ready.change', ready);
        }

        function onServerReadyChange(id: number, ready: boolean) {
            ui.publish('race-countdown.ready.change', id, ready);
        }

        function onServerSetCountdown(seconds: number) {
            ui.publish('race-countdown.countdown.set', seconds);
        }

        function onUiVehicleChange(dto: any) {
            messenger.publish('race-countdown.vehicle.change', dto);
        }

        function onServerVehicleChange(id: number, dto: any) {
            ui.publish('race-countdown.vehicle.change', id, dto);
        }
    },
});

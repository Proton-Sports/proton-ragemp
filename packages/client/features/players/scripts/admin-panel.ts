import { createScript } from '@kernel/script';
import { combineCleanup, createToggle } from '@repo/shared/utils';

interface AdminPanelMountDto {
    tab: number;
    players: AdminPanelPlayerDto[];
}

interface AdminPanelPlayerDto {
    id: number;
    name: string;
}

interface AdminPanelVehicleDto {
    id: number;
    name: string;
}

interface AdminPanelBanPlayerDto {
    id: string;
    name: string;
}

export default createScript({
    name: 'admin-panel',
    fn: ({ ui, game, messenger, logger }) => {
        // Handle key presses for opening admin panel
        game.keys.bind(0x73, () => {
            // F4 key
            messenger.publish('admin-panel.mount');
        });

        messenger.on('admin-panel.mount', (dto: AdminPanelMountDto) => {
            ui.router.mount('admin-panel', dto);
        });

        // Handle UI mounting/unmounting
        ui.router.onMount('admin-panel', () => {
            const toggle = createToggle((toggle) => {
                game.cursor.show(toggle);
                game.freezeControls(toggle);
                ui.focus(toggle);
            });

            toggle(true);

            // Setup UI event handlers
            return combineCleanup(
                messenger.on('admin-panel.players.get', (players: AdminPanelPlayerDto[]) => {
                    ui.publish('admin-panel.players.get', players);
                }),
                messenger.on('admin-panel.vehicles.get', (vehicles: AdminPanelVehicleDto[]) => {
                    ui.publish('admin-panel.vehicles.get', vehicles);
                }),
                messenger.on('admin-panel.vehicles.create', (vehicle: AdminPanelVehicleDto) => {
                    ui.publish('admin-panel.vehicles.create', vehicle);
                }),
                messenger.on('admin-panel.vehicles.destroy', (id: number) => {
                    ui.publish('admin-panel.vehicles.destroy', id);
                }),
                messenger.on('admin-panel.ban.getPlayers', (players: AdminPanelBanPlayerDto[]) => {
                    ui.publish('admin-panel.ban.getPlayers', players);
                }),
                messenger.on('admin-panel.ban.removePlayer', (id: string) => {
                    ui.publish('admin-panel.ban.removePlayer', id);
                }),
                ui.on('admin-panel.players.get', () => {
                    messenger.publish('admin-panel.players.get');
                }),
                ui.on('admin-panel.vehicles.get', () => {
                    messenger.publish('admin-panel.vehicles.get');
                }),
                ui.on('admin-panel.players.action', (id: number, action: string) => {
                    const validActions = ['kick', 'ban', 'tp', 'bring'];
                    if (!validActions.includes(action)) {
                        return;
                    }
                    messenger.publish('admin-panel.players.action', id, action);
                }),
                ui.on('admin-panel.vehicles.create', (name: string) => {
                    if (!name) {
                        return;
                    }
                    messenger.publish('admin-panel.vehicles.create', name);
                }),
                ui.on('admin-panel.vehicles.destroy', (id: number) => {
                    messenger.publish('admin-panel.vehicles.destroy', id);
                }),
                ui.on('admin-panel.ban.getPlayers', () => {
                    messenger.publish('admin-panel.ban.getPlayers');
                }),
                ui.on('admin-panel.ban.action', (id: string, action: string) => {
                    if (action !== 'unban') {
                        return;
                    }
                    messenger.publish('admin-panel.ban.action', id, action);
                }),
                game.keys.bind(0x1b, () => {
                    ui.router.unmount('admin-panel');
                }),
                () => {
                    toggle(false);
                },
            );
        });
    },
});

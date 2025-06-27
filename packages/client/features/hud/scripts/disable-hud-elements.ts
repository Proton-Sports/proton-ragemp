import { createScript } from '@kernel/script';

export default createScript({
    name: 'disable-hud-elements',
    fn: () => {
        // Add render event handler
        mp.events.add('render', () => {
            // Suppress weapon wheel
            mp.game.ui.hideHudComponentThisFrame(19); // Weapon wheel
            mp.game.ui.hideHudComponentThisFrame(20); // Weapon wheel stats

            // Hide specific HUD components (equivalent to the original 6,7,8,9)
            mp.game.ui.hideHudComponentThisFrame(6); // Vehicle name
            mp.game.ui.hideHudComponentThisFrame(7); // Area name
            mp.game.ui.hideHudComponentThisFrame(8); // Vehicle class
            mp.game.ui.hideHudComponentThisFrame(9); // Street name

            // Disable weapon selection (37 is Tab/weapon wheel control)
            mp.game.controls.disableControlAction(2, 37, true);

            // Disable firing and other weapon actions
            mp.game.controls.disableControlAction(0, 24, true); // Disable attack
            mp.game.controls.disableControlAction(0, 106, true); // Vehicle mouse aim
            mp.game.controls.disableControlAction(0, 140, true); // Melee attack light

            // Handle vehicle radio for the player
            const playerVehicle = mp.players.local.vehicle;
            if (playerVehicle) {
                // Disable radio
                mp.game.audio.setUserRadioControlEnabled(false);
                mp.game.audio.setVehicleRadioEnabled(playerVehicle.handle, false);

                // Check vehicle class and disable specific controls for bikes and cycles
                const vehicleClass = mp.game.vehicle.getVehicleClass(playerVehicle.handle);
                if (vehicleClass === 13 || vehicleClass === 8) {
                    // 13 = cycles, 8 = motorcycles
                    mp.game.controls.disableControlAction(2, 345, true); // Vehicle radio/horn
                }
            }
        });
    },
});

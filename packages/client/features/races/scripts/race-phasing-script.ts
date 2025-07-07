import { createScript } from '@kernel/script';
import { getDistanceSquared } from '@repo/shared/utils';

export default createScript({
    name: 'race-phasing',
    fn: ({ raceService }) => {
        raceService.on('started', handleStarted);
        raceService.on('stopped', handleStopped);

        function handleStarted() {
            if (raceService.ghosting) {
                mp.events.add('render', handleTick);
            }
        }

        function handleStopped() {
            if (raceService.ghosting) {
                mp.events.remove('render', handleTick);
            }
        }

        function handleTick() {
            const DISTANCE_SQUARED = 20 * 20; // 20 units squared
            const vehicle = mp.players.local.vehicle;
            const position = vehicle ? vehicle.position : mp.players.local.position;

            // Get nearby vehicles within the distance
            const vehicles: VehicleMp[] = [];
            mp.vehicles.forEachInStreamRange((otherVehicle) => {
                if (
                    otherVehicle !== vehicle &&
                    otherVehicle.handle !== 0 &&
                    getDistanceSquared(position, otherVehicle.position) <= DISTANCE_SQUARED
                ) {
                    vehicles.push(otherVehicle);
                }
            });

            // Find closest vehicle
            let closestVehicle: VehicleMp | null = null;
            let closestDistance = DISTANCE_SQUARED;

            for (const otherVehicle of vehicles) {
                const dist = getDistanceSquared(position, otherVehicle.position);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestVehicle = otherVehicle;
                }
            }

            if (closestVehicle) {
                // In RAGE:MP, we can disable collisions between entities
                mp.game.invoke('0xE037BF068223C38D', closestVehicle.handle); // SET_ENTITY_COLLISION
            }

            if (vehicle) {
                vehicles.push(vehicle);
            }

            // Disable collisions between all vehicles
            for (let i = 0; i < vehicles.length - 1; i++) {
                for (let j = i + 1; j < vehicles.length; j++) {
                    mp.game.invoke('0x5310B8E6CE96C887', vehicles[i].handle); // SET_ENTITY_NO_COLLISION_ENTITY
                    mp.game.invoke('0x5310B8E6CE96C887', vehicles[j].handle); // SET_ENTITY_NO_COLLISION_ENTITY
                }
            }
        }
    },
});

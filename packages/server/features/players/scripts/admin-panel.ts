import { createScript } from '@kernel/script';
import { banRecords } from '@repo/db/schema';
import { eq } from 'drizzle-orm';

interface AdminPanelPlayerDto {
    id: number;
    name: string;
}

export default createScript({
    name: 'admin-panel',
    fn: ({ messenger, logger, db }) => {
        // Handle client events
        messenger.on('admin-panel.mount', async (player) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            // Send admin panel data to the client
            messenger.publish(player, 'admin-panel.mount', {
                tab: 0,
                players: getPlayerDtos(),
            });
        });

        messenger.on('admin-panel.players.get', (player) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            messenger.publish(player, 'admin-panel.players.get', getPlayerDtos());
        });

        messenger.on('admin-panel.vehicles.get', (player) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            const unknown = 'Unknown';
            const vehicles = mp.vehicles
                .toArray()
                .filter((vehicle) => vehicle.getVariable('adminPanelFlag') === true)
                .map((vehicle) => ({
                    id: vehicle.id,
                    name: getVehicleModelName(vehicle.model) || unknown,
                }));

            messenger.publish(player, 'admin-panel.vehicles.get', vehicles);
        });

        messenger.on('admin-panel.players.action', (player, targetId, action) => {
            const target = mp.players.at(targetId);
            if (!target) {
                return;
            }

            switch (action) {
                case 'kick':
                    if (!isModOrAdmin(player)) return;
                    target.kick('Kicked by a moderator/admin');
                    break;

                case 'ban':
                    if (player.role !== 'administrator') return;
                    banPlayer(target).catch((err) => logger.error('Error banning player:', err));
                    break;

                case 'tp':
                    if (!isModOrAdmin(player)) return;
                    player.position = target.position;
                    break;

                case 'bring':
                    if (!isModOrAdmin(player)) return;
                    target.position = player.position;
                    break;
            }
        });

        messenger.on('admin-panel.vehicles.create', (player, name) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            // Try to create vehicle
            const vehicleModel = mp.joaat(name);
            if (vehicleModel === 0) {
                logger.error(`Invalid vehicle model name: ${name}`);
                return;
            }

            const vehicle = mp.vehicles.new(vehicleModel, player.position, {
                dimension: player.dimension,
            });

            // Mark the vehicle as created via admin panel
            vehicle.setVariable('adminPanelFlag', true);

            // Notify client
            messenger.publish(player, 'admin-panel.vehicles.create', {
                id: vehicle.id,
                name: name,
            });
        });

        messenger.on('admin-panel.vehicles.destroy', (player, id) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            const vehicle = mp.vehicles.at(id);
            if (!vehicle || vehicle.getVariable('adminPanelFlag') !== true) {
                return;
            }

            vehicle.destroy();
            messenger.publish(player, 'admin-panel.vehicles.destroy', id);
        });

        messenger.on('admin-panel.ban.getPlayers', async (player) => {
            if (!isModOrAdmin(player)) {
                return;
            }

            try {
                const bannedPlayers = await db
                    .select({
                        id: banRecords.identifier,
                        name: banRecords.name,
                    })
                    .from(banRecords);

                messenger.publish(player, 'admin-panel.ban.getPlayers', bannedPlayers);
            } catch (err) {
                logger.error('Error fetching banned players:', err);
            }
        });

        messenger.on('admin-panel.ban.action', async (player, id, action) => {
            if (!isModOrAdmin(player) || action !== 'unban') {
                return;
            }

            try {
                const result = await db
                    .delete(banRecords)
                    .where(eq(banRecords.identifier, id))
                    .returning({ id: banRecords.identifier });

                if (result.length > 0) {
                    messenger.publish(player, 'admin-panel.ban.removePlayer', id);
                }
            } catch (err) {
                logger.error('Error unbanning player:', err);
            }
        });

        // Helper functions
        function isModOrAdmin(player: PlayerMp): boolean {
            const role = player.role;
            return role === 'moderator' || role === 'administrator';
        }

        function getPlayerDtos(): AdminPanelPlayerDto[] {
            return mp.players.toArray().map((player) => ({
                id: player.id,
                name: player.name,
            }));
        }

        function getVehicleModelName(modelHash: number): string {
            // This would need a complete mapping of vehicle hashes to names
            // For now we just return the hash as a string
            return modelHash.toString();
        }

        async function banPlayer(player: PlayerMp): Promise<void> {
            const protonId = player.getVariable('protonId');
            if (typeof protonId !== 'number' || protonId === -1) {
                return;
            }

            try {
                // Get user's Discord ID
                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.id, protonId),
                    columns: {
                        discordId: true,
                        username: true,
                    },
                });

                if (!user) {
                    return;
                }

                player.kick('Banned by an admin');

                // Add ban record
                await db.insert(banRecords).values({
                    kind: 'discord',
                    identifier: user.discordId,
                    name: user.username,
                });
            } catch (err) {
                logger.error('Error banning player:', err);
            }
        }
    },
});

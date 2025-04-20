import { createScript } from '@kernel/script';
import { PedComponent } from '@repo/shared/models/game';

export default createScript({
    name: 'clothes-menu',
    fn: ({ messenger, logger, db, closetService }) => {
        // Handle client events
        messenger.on('clothes-menu.option.change', async (player, closetId: number, value: string) => {
            switch (value) {
                case 'equip':
                    await equipClothing(player, closetId);
                    break;
                case 'unequip':
                    unequipClothing(player, closetId);
                    break;
            }
        });

        async function equipClothing(player: PlayerMp, closetId: number): Promise<void> {
            try {
                // Query clothes item from database
                const closet = await db.query.closets.findFirst({
                    where: (closets, { eq }) => eq(closets.id, closetId),
                    columns: {},
                    with: {
                        clothItem: {
                            columns: {
                                component: true,
                                drawable: true,
                                texture: true,
                                palette: true,
                                dlcName: true,
                            },
                        },
                    },
                });

                if (!closet) {
                    logger.error(`Closet item not found: ${closetId}`);
                    return;
                }

                const component = closet.clothItem.component as PedComponent;

                // Check if player already has this component equipped
                const currentClothing = closetService.tryGetEquippedClothes(player, component);
                if (currentClothing) {
                    // If same item, do nothing
                    if (currentClothing.id === closetId) {
                        return;
                    }

                    // Unequip current component
                    closetService.unsetEquipped(player, component);
                    messenger.publish(player, 'clothes-menu.option.change', currentClothing.id, 'unequip');
                }

                // Calculate DLC hash if needed
                const dlcHash = closet.clothItem.dlcName ? mp.joaat(closet.clothItem.dlcName) : 0;

                // Set clothes on player
                if (dlcHash !== 0) {
                    // Set DLC clothes if available
                    player.setClothes(
                        closet.clothItem.component,
                        closet.clothItem.drawable,
                        closet.clothItem.texture,
                        closet.clothItem.palette,
                    );
                } else {
                    // Set regular clothes
                    player.setClothes(
                        closet.clothItem.component,
                        closet.clothItem.drawable,
                        closet.clothItem.texture,
                        closet.clothItem.palette,
                    );
                }

                // Store equipped clothes using the closetService
                closetService.setEquipped(player, component, {
                    id: closetId,
                    drawable: closet.clothItem.drawable,
                    texture: closet.clothItem.texture,
                    palette: closet.clothItem.palette,
                    dlc: dlcHash,
                });

                // Notify client that item was equipped
                messenger.publish(player, 'clothes-menu.option.change', closetId, 'equip');
            } catch (error) {
                logger.error('Error equipping clothing:', error);
            }
        }

        function unequipClothing(player: PlayerMp, closetId: number): void {
            // Get all components for this player
            const components = closetService.tryGetAllEquippedComponents(player);
            if (!components) {
                return;
            }

            // Find component by closet ID
            let componentToRemove: PedComponent | null = null;

            for (const [component, clothes] of components.entries()) {
                if (clothes.id === closetId) {
                    componentToRemove = component;
                    break;
                }
            }

            if (componentToRemove === null) {
                return;
            }

            // Remove the component using the closet service
            closetService.unsetEquipped(player, componentToRemove);

            // Set default clothes based on model
            const isMale = player.model === mp.joaat('mp_m_freemode_01');
            const defaultClothes = isMale
                ? getMaleDefaultClothes(componentToRemove)
                : getFemaleDefaultClothes(componentToRemove);

            // Apply default clothes
            player.setClothes(componentToRemove, defaultClothes.drawable, defaultClothes.texture, 0);

            // Notify client
            messenger.publish(player, 'clothes-menu.option.change', closetId, 'unequip');
        }

        function getMaleDefaultClothes(component: PedComponent): { drawable: number; texture: number } {
            switch (component) {
                case PedComponent.Torso:
                    return { drawable: 165, texture: 16 };
                case PedComponent.Leg:
                    return { drawable: 66, texture: 3 };
                case PedComponent.Shoes:
                    return { drawable: 46, texture: 3 };
                case PedComponent.Undershirt:
                    return { drawable: 15, texture: 0 };
                case PedComponent.Top:
                    return { drawable: 147, texture: 3 };
                default:
                    return { drawable: 0, texture: 0 };
            }
        }

        function getFemaleDefaultClothes(component: PedComponent): { drawable: number; texture: number } {
            switch (component) {
                case PedComponent.Torso:
                    return { drawable: 17, texture: 0 };
                case PedComponent.Leg:
                    return { drawable: 68, texture: 3 };
                case PedComponent.Shoes:
                    return { drawable: 47, texture: 3 };
                case PedComponent.Undershirt:
                    return { drawable: 34, texture: 0 };
                case PedComponent.Top:
                    return { drawable: 144, texture: 3 };
                default:
                    return { drawable: 0, texture: 0 };
            }
        }
    },
});

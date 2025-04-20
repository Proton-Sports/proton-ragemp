import { createScript } from '@kernel/script';
import { combineCleanup, createToggle } from '@repo/shared/utils';

// Types for clothes menu DTOs
interface ClothesMenuMountDto {
    // Add properties as needed
}

export default createScript({
    name: 'clothes-menu',
    fn: ({ ui, game, messenger, logger }) => {
        // Handle server events
        messenger.on('clothes-menu.mount', (dto: ClothesMenuMountDto) => {
            ui.router.mount('clothes-menu', dto);
        });

        // Handle UI mounting/unmounting
        ui.router.onMount('clothes-menu', () => {
            const toggle = createToggle((toggle) => {
                game.cursor.show(toggle);
                game.freezeControls(toggle);
                ui.focus(toggle);
            });

            toggle(true);

            // Setup UI event handlers
            return combineCleanup(
                messenger.on('clothes-menu.option.change', (closetId: number, value: string) => {
                    ui.publish('clothes-menu.option.change', closetId, value);
                }),
                ui.on('clothes-menu.option.change', (closetId: number, value: string) => {
                    if (value !== 'equip' && value !== 'unequip') {
                        return;
                    }
                    messenger.publish('clothes-menu.option.change', closetId, value);
                }),
                // Handle escape key to close the menu
                game.keys.bind(27, () => {
                    ui.router.unmount('clothes-menu');
                }),
                // Cleanup function
                () => {
                    toggle(false);

                    // Mount race menu after closing clothes menu (as in original code)
                    ui.router.mount('race-menu', { initialActivePage: 'collection' });
                },
            );
        });
    },
});

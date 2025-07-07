import { createScript } from '@kernel/script';
import { RaceStatus } from '../common/race-status';
import { KeyCode } from '@duydang2311/ragemp-utils-shared';

export default createScript({
    name: 'race-menu',
    fn: ({ ui, messenger, game, raceService, logger }) => {
        const raceMenuRoute = 'racing_menu_list';
        game.keys.bind(KeyCode.Tab, handleKeyTab);
        game.keys.bind(KeyCode.Escape, handleKeyEscape);

        messenger.on('race:prepare', (id) => {
            handleServerPrepare(id);
        });

        ui.router.onMount(raceMenuRoute, () => {
            handleOnMount();
            return () => {
                handleOnUnmount();
            };
        });

        messenger.on('race-start:start', () => {
            toggleCollectionPageConditionally(false);
        });

        messenger.on('race-prepare:enterTransition', () => {
            toggleCollectionPageConditionally(false);
        });

        messenger.on('race:destroy', () => {
            toggleCollectionPageConditionally(true);
        });

        ui.on('race-menu.tokens.get', () => {
            onUiGetToken();
        });

        messenger.on('race-menu.tokens.get', (tokens) => {
            onServerGetToken(tokens);
        });

        function handleKeyTab() {
            logger.info('key tab', 'race-menu is mounted?', ui.router.isMounted(raceMenuRoute));
            if (ui.router.isMounted(raceMenuRoute)) {
                return;
            }

            ui.router.mount(raceMenuRoute, {
                initialDisabledPages: raceService.status === RaceStatus.None ? null : ['collection'],
            });
        }

        function handleKeyEscape() {
            logger.info('key escape', 'race-menu is mounted?', ui.router.isMounted(raceMenuRoute));
            if (!ui.router.isMounted(raceMenuRoute)) {
                return;
            }

            ui.router.unmount(raceMenuRoute);
        }

        function handleServerPrepare(id: number) {
            if (ui.router.isMounted(raceMenuRoute)) {
                ui.router.unmount(raceMenuRoute);
            }
        }

        function handleOnMount() {
            mp.game.controls.disableControlAction(0, 1, true); // Disable controls
            game.cursor.show(true);
            ui.focus(true);
        }

        function handleOnUnmount() {
            mp.game.controls.enableControlAction(0, 1, true); // Enable controls
            game.cursor.show(false);
            ui.focus(false);
        }

        function toggleCollectionPageConditionally(toggle: boolean) {
            if (!ui.router.isMounted(raceMenuRoute)) {
                return;
            }

            ui.publish('race-menu.pages.toggle', 'collection', toggle);
        }

        function onUiGetToken() {
            messenger.publish('race-menu.tokens.get');
        }

        function onServerGetToken(tokens: number) {
            ui.publish('race-menu.tokens.get', tokens);
        }
    },
});

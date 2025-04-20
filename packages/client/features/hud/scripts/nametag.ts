import { createScript } from '@kernel/script';
import { attempt, getDistanceSquared } from '@repo/shared';

// Define interface for nametag text label management
interface PlayerNametag {
    textLabel: TextLabelMp;
    visible: boolean;
}

export default createScript({
    name: 'nametag',
    fn: ({ ui, messenger, logger }) => {
        // State variables
        const nametagElements = new Map<number, PlayerNametag>();
        let areNametagsShown = false;
        let clientSettingValue = true;
        let renderEventId: number | null = null;

        // Get local storage setting
        const getLocalStorageValue = (): boolean => {
            const showNametags = mp.storage.data['showNametags'];
            if (showNametags === null) {
                mp.storage.data['showNametags'] = true;
                mp.storage.flush();
                return true;
            }

            return showNametags;
        };

        // Initial setup
        clientSettingValue = getLocalStorageValue();

        // UI event handlers
        ui.on('nametagsClient:getSetting', () => {
            const value = getLocalStorageValue();
            ui.publish('settings-nametags:setValue', value);
        });

        ui.on('nametagsClient:setSetting', (toggleValue: boolean, serverRequest: boolean = false) => {
            showNametags(toggleValue, serverRequest);
        });

        // Server event handlers
        messenger.on('clientNametags:showNametags', (toggleValue: boolean) => {
            showNametags(toggleValue, true);
        });

        // Entity handlers for managing nametags
        mp.events.add('entityStreamIn', (entity) => {
            if (entity.type !== 'player' || entity === mp.players.local) return;

            const player = entity as PlayerMp;

            // Get player name from entity data
            const playerName = (player.getVariable('playerName') as string) || 'Unknown';

            // Create text label
            const textLabel = mp.labels.new(
                playerName,
                new mp.Vector3(player.position.x, player.position.y, player.position.z + 1.0),
                {
                    los: false,
                    font: 4,
                    drawDistance: 50,
                    dimension: player.dimension,
                },
            );

            // Store in our collection
            nametagElements.set(player.remoteId, {
                textLabel,
                visible: false,
            });

            // Initially hide the label
            textLabel.setVisible(false, false);
        });

        mp.events.add('entityStreamOut', (entity) => {
            if (entity.type !== 'player') return;

            const nametag = nametagElements.get(entity.remoteId);
            if (nametag) {
                nametag.textLabel.destroy();
                nametagElements.delete(entity.remoteId);
            }
        });

        // Handle variable changes (for player names)
        mp.events.add('entityDataChange', (entity, key, value) => {
            if (entity.type !== 'player' || key !== 'playerName') return;

            const nametag = nametagElements.get(entity.remoteId);
            if (nametag) {
                nametag.textLabel.text = value as string;
            }
        });

        // Function to toggle nametags
        const showNametags = (toggleValue: boolean, serverRequest: boolean = false) => {
            if (serverRequest) {
                areNametagsShown = toggleValue;
            } else {
                mp.storage.data['showNametags'] = toggleValue;
                clientSettingValue = toggleValue;
            }

            if (toggleValue) {
                if (renderEventId !== null) return;

                // Start rendering nametags
                renderEventId = mp.events.add('render', drawNametags) as unknown as number;
            } else {
                stopDrawingNametags();
            }
        };

        // Function to stop drawing nametags
        const stopDrawingNametags = () => {
            if (renderEventId === null) return;

            const stopAttempt = attempt(() => {
                mp.events.remove('render', drawNametags);
                renderEventId = null;

                // Hide all nametags
                for (const nametag of nametagElements.values()) {
                    nametag.textLabel.setVisible(false, false);
                    nametag.visible = false;
                }
            })();

            if (!stopAttempt.ok) {
                logger.error('Failed to stop drawing nametags', stopAttempt.error);
            }
        };

        // Function to draw nametags on render
        const drawNametags = () => {
            for (const [entityId, nametag] of nametagElements.entries()) {
                // Check if nametags are globally enabled
                if (!areNametagsShown || !clientSettingValue) {
                    if (nametag.visible) {
                        nametag.textLabel.setVisible(false, false);
                        nametag.visible = false;
                    }
                    continue;
                }

                const player = mp.players.atRemoteId(entityId);
                if (!player) {
                    nametag.textLabel.setVisible(false, false);
                    nametag.visible = false;
                    continue;
                }

                // Check distance
                const distanceSquared = getDistanceSquared(mp.players.local.position, player.position);
                if (distanceSquared > 15 * 15) {
                    nametag.textLabel.setVisible(false, false);
                    nametag.visible = false;
                    continue;
                }

                // Check if on screen
                const isPointOnScreen = mp.game.graphics.getScreenCoordFromWorldCoord(
                    player.position.x,
                    player.position.y,
                    player.position.z,
                );

                if (!isPointOnScreen) {
                    nametag.textLabel.setVisible(false, false);
                    nametag.visible = false;
                    continue;
                }

                // Update position and make visible
                nametag.textLabel.position = new mp.Vector3(
                    player.position.x,
                    player.position.y,
                    player.position.z + 1,
                );

                nametag.textLabel.dimension = player.dimension;

                // Calculate alpha based on distance
                const normalizedDistance = Math.min(1, distanceSquared / 15);
                const alphaValue = Math.floor(255 * (1 - normalizedDistance));

                // Update color with distance-based alpha
                nametag.textLabel.color = [255, 255, 255];
                nametag.textLabel.alpha = alphaValue;

                nametag.textLabel.setVisible(true, false);
                nametag.visible = true;
            }
        };
    },
});

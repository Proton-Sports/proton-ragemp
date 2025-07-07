import { createScript } from '@kernel/script';
import { RacePointData } from '../common/race-point-data';
import { RaceStatus } from '../common/race-status';
import { StartPositionData } from '../common/start-position-data';

export default createScript({
    name: 'race-creator',
    fn: ({ ui, messenger, ipl, raceCreator, raceService }) => {
        let focusing = false;
        let canSwitch = true;
        let pointType = PointType.Start;
        let id = 0;
        let name = '';
        let iplName: string | null = null;
        let movingRaceCheckpoint: CheckpointMp | null = null;

        messenger.on('race:creator:stop', () => {
            handleServerStop();
        });

        messenger.on('race-menu-creator:data', (dto) => {
            handleServerData(dto);
        });

        messenger.on('race-menu-creator:editMap', async (map) => {
            await handleServerEditMapAsync(map);
        });

        messenger.on('race-menu-creator:deleteMap', (id) => {
            handleServerDeleteMap(id);
        });

        messenger.on('race-menu-creator:createMap', (dto) => {
            onServerCreateMap(dto);
        });

        ui.on('race-menu-creator:data', () => {
            handleData();
        });

        ui.on('race:creator:changeMode', (mode) => {
            mp.console.logInfo('race:creator:changeMode, ' + mode);
            handleChangeMode(mode);
        });

        ui.on('race-menu-creator:createMap', (mapName, iplName) => {
            handleCreateMap(mapName, iplName);
        });

        ui.on('race-menu-creator:deleteMap', (mapId) => {
            handleDeleteMap(mapId);
        });

        ui.on('race-menu-creator:editMap', (mapId, type) => {
            handleEditMap(mapId, type);
        });

        ui.on('race:creator:submit', () => {
            handleSubmit();
        });

        ui.on('race:creator:stop', () => {
            handleStop();
        });

        function handleCreateMap(mapName: string, mapIplName: string) {
            if (raceService.status !== RaceStatus.None) {
                return;
            }
            messenger.publish('race-menu-creator:createMap', mapName, mapIplName);
        }

        function onServerCreateMap(dto: any) {
            if (ui.router.isMounted('race-menu')) {
                ui.router.unmount('race-menu');
            }
            name = dto.mapName;
            iplName = dto.iplName;
            raceCreator.clearStartPoints();
            raceCreator.clearRacePoints();
            ui.router.mount('race-creator');
            mp.keys.bind(0x26, false, handleKeyUp); // Up arrow
            mp.keys.bind(0x28, false, handleKeyDown); // Down arrow
            mp.keys.bind(0x25, false, handleKeyLeft); // Left arrow
            mp.keys.bind(0x27, false, handleKeyRight); // Right arrow
            mp.keys.bind(0x5a, false, handleKeyZ); // Z key
            mp.keys.bind(0x58, false, handleKeyX); // X key
            mp.keys.bind(0x31, false, handleKey1); // 1 key
            mp.keys.bind(0x32, false, handleKey2); // 2 key
            mp.keys.bind(0x55, false, handleKeyU); // U key
            mp.keys.bind(0x4e, false, handleKeyN); // N key
            mp.keys.bind(0x4d, false, handleKeyM); // M key
            mp.keys.bind(0x21, false, handleKeyPageUp); // Page Up
            mp.keys.bind(0x22, false, handleKeyPageDown); // Page Down
            mp.game.controls.enableControlAction(0, 1, true); // Enable controls
        }

        function handleDeleteMap(mapId: number) {
            messenger.publish('race-menu-creator:deleteMap', mapId);
        }

        function handleServerDeleteMap(mapId: number) {
            ui.publish('race-menu-creator:deleteMap', mapId);
        }

        function handleEditMap(mapId: number, type: string) {
            pointType = type === 'start' ? PointType.Start : PointType.Race;
            messenger.publish('race-menu-creator:editMap', mapId, type);
        }

        function handleSubmit() {
            messenger.publish('race:creator:submit', {
                id,
                name,
                iplName,
                startPoints: raceCreator.startPoints,
                racePoints: raceCreator.racePoints,
            });
        }

        function handleStop() {
            messenger.publish('race:creator:stop');
        }

        async function handleServerStop() {
            if (focusing) {
                unfocus();
            }
            canSwitch = true;
            id = 0;
            name = '';
            ui.router.unmount('race-creator');
            raceCreator.clearStartPoints();
            raceCreator.clearRacePoints();
            pointType = PointType.Start;

            mp.keys.unbind(0x26, false, handleKeyUp);
            mp.keys.unbind(0x28, false, handleKeyDown);
            mp.keys.unbind(0x25, false, handleKeyLeft);
            mp.keys.unbind(0x27, false, handleKeyRight);
            mp.keys.unbind(0x5a, false, handleKeyZ);
            mp.keys.unbind(0x58, false, handleKeyX);
            mp.keys.unbind(0x31, false, handleKey1);
            mp.keys.unbind(0x32, false, handleKey2);
            mp.keys.unbind(0x55, false, handleKeyU);
            mp.keys.unbind(0x4e, false, handleKeyN);
            mp.keys.unbind(0x4d, false, handleKeyM);
            mp.keys.unbind(0x21, false, handleKeyPageUp);
            mp.keys.unbind(0x22, false, handleKeyPageDown);

            if (iplName) {
                await ipl.unloadAsync(iplName);
                iplName = null;
            }
        }

        function handleKeyUp() {
            if (mp.gui.cursor.visible || focusing) {
                return;
            }

            // Handle no-clip camera here if needed
        }

        function handleKeyDown() {
            if (mp.gui.cursor.visible || focusing) {
                return;
            }

            // Handle no-clip camera here if needed
        }

        function handleKeyLeft() {
            if (mp.gui.cursor.visible || focusing) {
                return;
            }

            // Handle no-clip camera here if needed
        }

        function handleKeyRight() {
            if (mp.gui.cursor.visible || focusing) {
                return;
            }

            // Handle no-clip camera here if needed
        }

        function handleKeyZ() {
            if (mp.gui.cursor.visible) {
                return;
            }

            const player = mp.players.local;
            const position = player.position;

            // Get ground Z coordinate
            const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
            if (!groundZ) {
                return;
            }

            const groundPosition = new mp.Vector3(position.x, position.y, groundZ);

            switch (pointType) {
                case PointType.Start:
                    raceCreator.addStartPoint(groundPosition, player.getRotation(0));
                    break;
                case PointType.Race:
                    raceCreator.addRacePoint(groundPosition, 4.0);
                    break;
            }
        }

        function handleKeyX() {
            if (mp.gui.cursor.visible) {
                return;
            }

            const position = mp.players.local.position;

            switch (pointType) {
                case PointType.Start:
                    {
                        const removed = { value: null as StartPositionData | null };
                        raceCreator.tryRemoveStartPoint(position, removed);
                    }
                    break;
                case PointType.Race:
                    {
                        const removed = { value: null as RacePointData | null };
                        if (
                            raceCreator.tryRemoveRacePoint(position, removed) &&
                            removed.value &&
                            removed.value.checkpoint === movingRaceCheckpoint
                        ) {
                            movingRaceCheckpoint = null;
                        }
                    }
                    break;
            }
        }

        function handleKey1() {
            if (!canSwitch || pointType === PointType.Start) {
                return;
            }

            pointType = PointType.Start;
        }

        function handleKey2() {
            if (!canSwitch || pointType === PointType.Race) {
                return;
            }

            pointType = PointType.Race;
        }

        function handleKeyU() {
            const position = mp.players.local.position;

            // Get ground Z coordinate
            const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
            if (!groundZ) {
                return;
            }

            const groundPosition = new mp.Vector3(position.x, position.y, groundZ);

            const checkpoint = { value: null as CheckpointMp | null };
            if (raceCreator.tryGetClosestRaceCheckpointTo(groundPosition, checkpoint) && checkpoint.value) {
                // TODO: Increase radius by 0.5 units
                // checkpoint.value.scale += 0.5;
            }
        }

        function handleKeyN() {
            const position = mp.players.local.position;

            // Get ground Z coordinate
            const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
            if (!groundZ) {
                return;
            }

            const groundPosition = new mp.Vector3(position.x, position.y, groundZ);

            const checkpoint = { value: null as CheckpointMp | null };
            if (raceCreator.tryGetClosestRaceCheckpointTo(groundPosition, checkpoint) && checkpoint.value) {
                // TODO: Decrease radius by 0.5 units, minimum 1.0
                // checkpoint.value.scale = Math.max(1.0, checkpoint.value.scale - 0.5);
            }
        }

        function handleKeyM() {
            const position = mp.players.local.position;

            // Get ground Z coordinate
            const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
            if (!groundZ) {
                return;
            }

            const groundPosition = new mp.Vector3(position.x, position.y, groundZ);

            const checkpoint = { value: null as CheckpointMp | null };
            if (raceCreator.tryGetClosestRaceCheckpointTo(groundPosition, checkpoint) && checkpoint.value) {
                if (movingRaceCheckpoint) {
                    // TODO: Reset color of previous moving checkpoint
                    // movingRaceCheckpoint.color = [255, 255, 255, 255];
                }

                movingRaceCheckpoint = checkpoint.value;
                // movingRaceCheckpoint.color = [0, 255, 0, 255];
            } else if (movingRaceCheckpoint) {
                raceCreator.updateRacePointPosition(movingRaceCheckpoint, groundPosition);
                // movingRaceCheckpoint.color = [255, 255, 255, 255];
                movingRaceCheckpoint = null;
            }
        }

        function handleKeyPageUp() {
            if (focusing) {
                unfocus();
            }
        }

        function handleKeyPageDown() {
            focus();
        }

        function unfocus() {
            focusing = false;
            ui.focus(false);
            mp.gui.cursor.visible = false;
            mp.game.controls.enableControlAction(0, 1, true);
        }

        function focus() {
            focusing = true;
            ui.focus(true);
            mp.gui.cursor.visible = true;
            mp.game.controls.disableControlAction(0, 1, true);
        }

        function handleData() {
            messenger.publish('race-menu-creator:data');
        }

        function handleChangeMode(mode: string) {
            messenger.publish('race:creator:changeMode', mode);
        }

        function handleServerData(dto: any) {
            ui.publish('race-menu-creator:data', dto);
        }

        async function handleServerEditMapAsync(map: any) {
            canSwitch = false;
            id = map.id;
            name = map.name;
            iplName = map.iplName;

            if (iplName) {
                await ipl.loadAsync(iplName);
            }

            raceCreator.importStartPoints(map.startPoints);
            raceCreator.importRacePoints(map.racePoints);

            if (ui.router.isMounted('race-menu')) {
                ui.router.unmount('race-menu');
            }

            ui.router.mount('race-creator');
            mp.keys.bind(0x26, false, handleKeyUp); // Up arrow
            mp.keys.bind(0x28, false, handleKeyDown); // Down arrow
            mp.keys.bind(0x25, false, handleKeyLeft); // Left arrow
            mp.keys.bind(0x27, false, handleKeyRight); // Right arrow
            mp.keys.bind(0x5a, false, handleKeyZ); // Z key
            mp.keys.bind(0x58, false, handleKeyX); // X key
            mp.keys.bind(0x31, false, handleKey1); // 1 key
            mp.keys.bind(0x32, false, handleKey2); // 2 key
            mp.keys.bind(0x55, false, handleKeyU); // U key
            mp.keys.bind(0x4e, false, handleKeyN); // N key
            mp.keys.bind(0x4d, false, handleKeyM); // M key
            mp.keys.bind(0x21, false, handleKeyPageUp); // Page Up
            mp.keys.bind(0x22, false, handleKeyPageDown); // Page Down
            mp.game.controls.enableControlAction(0, 1, true);
        }
    },
});

enum PointType {
    Start,
    Race,
}

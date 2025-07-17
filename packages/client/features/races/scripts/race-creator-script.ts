import type { ScriptCamera } from '@features/camera/common/types';
import { createScript } from '@kernel/script';
import { RaceStatus } from '../common/race-status';

enum PointType {
    Start,
    Race,
}

export default createScript({
    name: 'race-creator-migrated',
    fn: ({ ui, messenger, ipl, raceCreator, raceService, raycastService, noclip }) => {
        let focusing = false;
        let canSwitch = true;
        let pointType = PointType.Start;
        let id = 0;
        let name = '';
        let iplName: string | null = null;
        let movingRaceCheckpoint: CheckpointMp | null = null;

        // Server event handlers
        messenger.on('race:creator:stop', () => {
            handleServerStop();
        });

        messenger.on('race-menu-creator:data', (dto: any) => {
            handleServerData(dto);
        });

        messenger.on('race-menu-creator:editMap', async (map: any) => {
            await handleServerEditMapAsync(map);
        });

        messenger.on('race-menu-creator:deleteMap', (mapId: number) => {
            handleServerDeleteMap(mapId);
        });

        messenger.on('race-menu-creator:createMap', (dto: any) => {
            onServerCreateMap(dto);
        });

        // UI event handlers
        ui.on('race-menu-creator:data', () => {
            handleData();
        });

        ui.on('race:creator:changeMode', (mode: string) => {
            handleChangeMode(mode);
        });

        ui.on('race-menu-creator:createMap', (mapName: string, mapIplName: string) => {
            handleCreateMap(mapName, mapIplName);
        });

        ui.on('race-menu-creator:deleteMap', (mapId: number) => {
            handleDeleteMap(mapId);
        });

        ui.on('race-menu-creator:editMap', (mapId: number, type: string) => {
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
            bindKeys();
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
            unbindKeys();

            if (iplName) {
                await ipl.unloadAsync(iplName);
                iplName = null;
            }
        }

        function bindKeys() {
            mp.keys.bind(0x01, false, handleLeftClick); // Left mouse button
            mp.keys.bind(0x02, false, handleRightClick); // Right mouse button
            mp.keys.bind(0x5a, false, handleKeyZ); // Z key
            mp.keys.bind(0x58, false, handleKeyX); // X key
            mp.keys.bind(0x31, false, handleKey1); // 1 key
            mp.keys.bind(0x32, false, handleKey2); // 2 key
            mp.keys.bind(0x55, false, handleKeyU); // U key
            mp.keys.bind(0x4e, false, handleKeyN); // N key
            mp.keys.bind(0x4d, false, handleKeyM); // M key
        }

        function unbindKeys() {
            mp.keys.unbind(0x01, false, handleLeftClick);
            mp.keys.unbind(0x02, false, handleRightClick);
            mp.keys.unbind(0x5a, false, handleKeyZ);
            mp.keys.unbind(0x58, false, handleKeyX);
            mp.keys.unbind(0x31, false, handleKey1);
            mp.keys.unbind(0x32, false, handleKey2);
            mp.keys.unbind(0x55, false, handleKeyU);
            mp.keys.unbind(0x4e, false, handleKeyN);
            mp.keys.unbind(0x4d, false, handleKeyM);
        }

        async function handleLeftClick() {
            if (!noclip.isStarted || focusing) {
                return;
            }

            const camera = noclip.camera;
            if (!camera) return;

            const raycasted = await raycast(camera);
            if (raycasted.failed) {
                return;
            }

            if (raycasted.data.isHit) {
                const rotation = camera.rotation;
                const rotZ = (rotation.z * Math.PI) / 180;

                switch (pointType) {
                    case PointType.Start:
                        raceCreator.addStartPoint(raycasted.data.endPosition, new mp.Vector3(0, 0, rotZ));
                        break;
                    case PointType.Race:
                        raceCreator.addRacePoint(raycasted.data.endPosition, 4.0);
                        break;
                }
            }
        }

        async function handleRightClick() {
            if (!noclip.isStarted || focusing) {
                return;
            }

            const camera = noclip.camera;
            if (!camera) return;

            const raycasted = await raycast(camera);
            if (raycasted.failed) {
                return;
            }

            switch (pointType) {
                case PointType.Start:
                    raceCreator.removeStartPoint(raycasted.data.endPosition);
                    break;
                case PointType.Race:
                    const removed = raceCreator.removeRacePoint(raycasted.data.endPosition);
                    if (removed.ok && removed.data.checkpoint === movingRaceCheckpoint) {
                        movingRaceCheckpoint = null;
                    }
                    break;
            }
        }

        function handleKeyZ() {
            if (noclip.isStarted) {
                return;
            }

            const player = mp.players.local;
            let position = player.position;

            // Get ground Z coordinate
            const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
            if (groundZ !== undefined) {
                position = new mp.Vector3(position.x, position.y, groundZ);
            } else {
                return;
            }

            switch (pointType) {
                case PointType.Start:
                    raceCreator.addStartPoint(position, player.getRotation(0));
                    break;
                case PointType.Race:
                    raceCreator.addRacePoint(position, 4.0);
                    break;
            }
        }

        function handleKeyX() {
            if (noclip.isStarted) {
                return;
            }

            const position = mp.players.local.position;

            switch (pointType) {
                case PointType.Start:
                    raceCreator.removeStartPoint(position);
                    break;
                case PointType.Race:
                    const removed = raceCreator.removeRacePoint(position);
                    if (removed.ok && removed.data.checkpoint === movingRaceCheckpoint) {
                        movingRaceCheckpoint = null;
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

        async function handleKeyU() {
            const position = await getValidPosition();
            if (!position) return;

            const checkpoint = raceCreator.getClosestRaceCheckpointTo(position);
            if (checkpoint) {
                // TODO: Increase radius by 0.5 units
                // checkpoint.radius = (checkpointRef.value.radius || 4.0) + 0.5;
            }
        }

        async function handleKeyN() {
            const position = await getValidPosition();
            if (!position) return;

            const checkpoint = raceCreator.getClosestRaceCheckpointTo(position);
            if (checkpoint) {
                // TODO: Decrease radius by 0.5 units, minimum 1.0
                // checkpointRef.value.radius = Math.max(1.0, (checkpointRef.value.radius || 4.0) - 0.5);
            }
        }

        async function handleKeyM() {
            const position = await getValidPosition();
            if (!position) return;

            const checkpoint = raceCreator.getClosestRaceCheckpointTo(position);
            if (checkpoint) {
                if (movingRaceCheckpoint) {
                    // TODO: Reset color of previous moving checkpoint
                    // movingRaceCheckpoint.color = { r: 255, g: 255, b: 255, a: 255 };
                }
                movingRaceCheckpoint = checkpoint;
                // TODO: Set color of moving checkpoint to green
                // movingRaceCheckpoint.color = { r: 0, g: 255, b: 0, a: 255 };
            } else if (movingRaceCheckpoint) {
                raceCreator.updateRacePointPosition(movingRaceCheckpoint, position);
                // TODO: Set color of moving checkpoint to green
                // movingRaceCheckpoint.color = { r: 255, g: 255, b: 255, a: 255 };
                movingRaceCheckpoint = null;
            }
        }

        async function getValidPosition() {
            let position = mp.players.local.position;

            if (!noclip.isStarted) {
                // Get ground Z coordinate
                const groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
                if (groundZ !== undefined) {
                    position = new mp.Vector3(position.x, position.y, groundZ);
                } else {
                    return null;
                }
            } else {
                const camera = noclip.camera;
                if (!camera) return;

                const raycasted = await raycast(camera);
                if (raycasted.failed || !raycasted.data.isHit) {
                    return;
                }
                position = raycasted.data.endPosition;
            }

            return position;
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
            bindKeys();
            mp.game.controls.enableControlAction(0, 1, true);
        }

        async function raycast(camera: ScriptCamera) {
            const position = camera.position;
            const forwardVector = camera.forwardVector;
            const endPosition = new mp.Vector3(
                position.x + forwardVector.x * 1000,
                position.y + forwardVector.y * 1000,
                position.z + forwardVector.z * 1000,
            );

            return await raycastService.raycast(position, endPosition);
        }
    },
});

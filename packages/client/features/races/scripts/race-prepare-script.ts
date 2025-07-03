import { createScript } from '@kernel/script';
import { RaceStatus } from '../common/race-status';

export default createScript({
    name: 'race-prepare',
    fn: ({ ui, messenger, logger, ipl, raceService }) => {
        let preloadCamera: any = null;
        
        messenger.on('race-prepare:mount', (dto) => {
            handleServerMountAsync(dto).catch(error => logger.error(error.toString()));
        });
        
        messenger.on('race:start', (id) => {
            handleOnStarted();
        });
        
        messenger.on('race-prepare:enterTransition', (position) => {
            onEnterTransition(position);
        });
        
        messenger.on('race-prepare:exitTransition', () => {
            onExitTransition();
        });
        
        messenger.on('race:finish', () => {
            onRaceFinished();
        });
        
        function onEnterTransition(position: Vector3) {
            raceService.status = RaceStatus.Preparing;
            ui.router.mount('race-prepare-transition');
            mp.events.add('render', disableVehicleActions);
            mp.events.add('render', disableLeavingVehicle);
            mp.game.ui.displayRadar(false);
            mp.game.graphics.triggerScreenblurFadeIn(1000);
            setTimeout(() => {
                // RAGE:MP doesn't have exact equivalent to AltV.FocusData
                // We can use camera or teleport to focus on the position
                mp.players.local.position = position;
            }, 500);
        }
        
        function onExitTransition() {
            ui.router.unmount('race-prepare-transition');
            mp.game.graphics.triggerScreenblurFadeOut(1000);
            mp.game.ui.displayRadar(true);
            setTimeout(() => {
                // Reset any focus/camera if needed
            }, 500);
        }
        
        async function handleServerMountAsync(dto: any) {
            if (preloadCamera) {
                preloadCamera = null;
            }
            
            let loadIplTask: Promise<unknown> | null = null;
            
            if (dto.iplName) {
                loadIplTask = ipl.loadAsync(dto.iplName);
            }
            
            raceService.iplName = dto.iplName;
            raceService.raceType = dto.raceType;
            raceService.dimension = dto.dimension;
            raceService.ensureRacePointsCapacity(dto.racePoints.length);
            raceService.addRacePoints(dto.racePoints);
            
            if (!dto.disableLoadingCheckpoint) {
                let index = 0;
                while (index + 1 < Math.min(dto.racePoints.length, 2)) {
                    const nextIndex = index + 1;
                    raceService.loadRacePoint(
                        6, // CylinderDoubleArrow
                        index,
                        nextIndex < dto.racePoints.length ? nextIndex : null
                    );
                    ++index;
                }
            }
            
            if (loadIplTask) {
                await loadIplTask;
            }
        }
        
        function handleOnStarted() {
            mp.events.remove('render', disableVehicleActions);
        }
        
        function disableVehicleActions() {
            // Disable forward/backward controls (gas/brake)
            mp.game.controls.disableControlAction(0, 71, true); // INPUT_VEH_ACCELERATE
            mp.game.controls.disableControlAction(0, 72, true); // INPUT_VEH_BRAKE
            // Disable horn
            mp.game.controls.disableControlAction(0, 86, true); // INPUT_VEH_HORN
        }
        
        function disableLeavingVehicle() {
            // Disable vehicle exit
            mp.game.controls.disableControlAction(0, 75, true); // INPUT_VEH_EXIT
        }
        
        function onRaceFinished() {
            mp.events.remove('render', disableLeavingVehicle);
        }
    }
});
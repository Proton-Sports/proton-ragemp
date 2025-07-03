import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-start',
    fn: ({ ui, messenger, raceService }) => {
        messenger.on('race-start:start', (dto) => {
            handleServerStart(dto);
        });
        
        function handleServerStart(dto: any) {
            mp.game.controls.enableControlAction(0, 1, true); // Enable game controls
            raceService.ghosting = dto.ghosting;
            raceService.start();
            ui.router.unmount('race-prepare');
        }
    }
});
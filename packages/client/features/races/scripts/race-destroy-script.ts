import { createScript } from '@kernel/script';
import type { RaceService } from '../common/race-service';
import { RaceStatus } from '../common/race-status';

export default createScript({
    name: 'race-destroy',
    fn: ({ ui, messenger, logger, ipl, raceService }) => {
        messenger.on('race:destroy', () => {
            onDestroyAsync().catch((exception) => logger.error(exception.toString()));
        });

        messenger.on('race-destroy:enterTransition', () => {
            onEnterTransition();
        });

        function onEnterTransition() {
            ui.router.mount('race-end-transition');
            mp.game.graphics.triggerScreenblurFadeIn(1000);

            setTimeout(() => {
                ui.router.unmount('race-end-transition');
                mp.game.graphics.triggerScreenblurFadeOut(1000);
            }, 3000);
        }

        async function onDestroyAsync() {
            if (raceService.status === RaceStatus.Started) {
                raceService.stop();
            }

            raceService.clearRacePoints();

            // Disable ghosting
            mp.game.player.setInvincible(false);

            if (raceService.iplName && (await ipl.isLoaded(raceService.iplName))) {
                await ipl.unloadAsync(raceService.iplName);
            }
        }
    },
});

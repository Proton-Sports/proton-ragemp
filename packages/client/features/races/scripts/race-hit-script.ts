import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-hit',
    fn: ({ messenger, raceService }) => {
        // Handle race start event from server
        messenger.on('race-start:start', (dto) => {
            handleServerStart(dto);
        });

        // Handle race hit event from server
        messenger.on('race:hit', (dto) => {
            onServerHit(dto);
        });

        // Handle race destroy event from server
        messenger.on('race:destroy', () => {
            removeRacePointHit();
        });

        // Handle race leave event from server
        messenger.on('race:leave', () => {
            removeRacePointHit();
        });

        // Handle race finish event from server
        messenger.on('race:finish', () => {
            removeRacePointHit();
        });

        function handleServerStart(dto: any) {
            raceService.on('racePointHit', handleRacePointHit);
        }

        function handleRacePointHit(index: number) {
            messenger.publish('race:hit', index);
        }

        function onServerHit(dto: any) {
            if (dto.finished) {
                raceService.stop();
                return;
            }

            raceService.loadRacePoint(
                dto.nextIndex === null ? 4 : 6, // 4 = CylinderCheckerboard, 6 = CylinderDoubleArrow
                dto.index,
                dto.nextIndex,
            );
        }

        function removeRacePointHit() {
            raceService.unloadRacePoint();
        }
    },
});

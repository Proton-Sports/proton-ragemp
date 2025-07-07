import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-leave',
    fn: ({ raceService }) => {
        const handleParticipantLeft = (_race: unknown, player: PlayerMp) => {
            player.dimension = 0;
        };

        const handleClientLeave = (player: PlayerMp) => {
            raceService.removeParticipantByPlayer(player);
        };

        raceService.on('participantLeft', handleParticipantLeft);
        mp.events.add('race-leave:leave', handleClientLeave);
    },
});

import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';

export default createScript({
    name: 'race-prize-pool',
    fn: ({ raceService }) => {
        const onParticipantJoined = (race: Race, _participant: RaceParticipant) => {
            race.prizePool += 200;
        };

        const onParticipantLeft = (race: Race) => {
            race.prizePool = Math.max(race.prizePool - 200, 0);
        };

        raceService.on('participantJoined', onParticipantJoined);
        raceService.on('participantLeft', onParticipantLeft);
    },
});

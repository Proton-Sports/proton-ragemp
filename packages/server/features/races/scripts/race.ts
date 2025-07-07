import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';

export default createScript({
    name: 'race-script',
    fn: ({ raceService, messenger }) => {
        const handleParticipantJoined = (race: Race, participant: RaceParticipant) => {
            messenger.publish(participant.player, 'race:join', race.id);
        };

        const handleParticipantLeft = (race: Race, player: PlayerMp) => {
            messenger.publish(player, 'race:leave', race.id);
        };

        const handleRacePrepared = (race: Race) => {
            messenger.publish(
                race.participants.map((p) => p.player),
                'race:prepare',
                race.id,
            );
        };

        const handleRaceStarted = (race: Race) => {
            messenger.publish(
                race.participants.map((p) => p.player),
                'race:start',
                race.id,
            );
        };

        raceService.on('participantJoined', handleParticipantJoined);
        raceService.on('participantLeft', handleParticipantLeft);
        raceService.on('racePrepared', handleRacePrepared);
        raceService.on('raceStarted', handleRaceStarted);
    },
});

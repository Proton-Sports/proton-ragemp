import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';

export default createScript({
    name: 'race-finish-countdown',
    fn: ({ raceService, messenger }) => {
        const timers = new Map<Race, NodeJS.Timeout>();

        const onParticipantFinished = (participant: RaceParticipant) => {
            const race = raceService.tryGetRaceByParticipant(participant.player);
            if (!race) return;

            const finishedCount = race.participants.filter((p) => p.finishTime !== 0).length;
            if (finishedCount === 1 && race.participants.length > 1) {
                const endTime = Date.now() + race.duration * 1000;
                messenger.publish(
                    race.participants.map((p) => p.player),
                    'race-finish-countdown:start',
                    { endTime },
                );

                if (!timers.has(race)) {
                    const timer = setTimeout(() => {
                        finishRace(race);
                    }, race.duration * 1000);
                    timers.set(race, timer);
                }
            }
        };

        const finishRace = (race: Race) => {
            const timer = timers.get(race);
            if (timer) {
                clearTimeout(timer);
                timers.delete(race);
                raceService.finish(race);
            }
        };

        const onRaceFinished = (race: Race) => {
            const timer = timers.get(race);
            if (timer) {
                clearTimeout(timer);
                timers.delete(race);
            }
        };

        raceService.on('participantFinished', onParticipantFinished);
        raceService.on('raceFinished', onRaceFinished);
    },
});

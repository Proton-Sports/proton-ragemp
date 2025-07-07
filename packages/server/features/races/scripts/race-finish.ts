import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';
import type { MountScoreboardDto, ScoreboardParticipantDto } from '@repo/shared';

export default createScript({
    name: 'race-finish',
    fn: ({ raceService, raceMapCache, messenger }) => {
        const onParticipantFinished = (participant: RaceParticipant) => {
            const race = raceService.tryGetRaceByParticipant(participant.player);
            if (!race) return;

            const finishedCount = race.participants.filter((p) => p.finishTime !== 0).length;
            if (finishedCount === race.participants.length) {
                raceService.finish(race);
            }
        };

        const onRaceFinished = async (race: Race) => {
            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) return;

            const participants = race.participants
                .map(
                    (p) =>
                        ({
                            name: p.player.name,
                            team: 'Proton Sports',
                            timeMs: p.finishTime === 0 ? 0 : p.finishTime - race.startTime,
                        } as ScoreboardParticipantDto),
                )
                .toSorted((a, b) => {
                    if (a.timeMs === 0) return 1;
                    if (b.timeMs === 0) return -1;
                    return a.timeMs - b.timeMs;
                });

            const dto: MountScoreboardDto = {
                name: getMap.data.name,
                participants,
            };

            messenger.publish(
                race.participants.map((p) => p.player),
                'race-finish:mountScoreboard',
                dto,
            );
        };

        raceService.on('participantFinished', onParticipantFinished);
        raceService.on('raceFinished', onRaceFinished);
    },
});

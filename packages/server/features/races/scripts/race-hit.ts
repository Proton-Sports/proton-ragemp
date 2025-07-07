import { getDistance } from '@duydang2311/ragemp-utils-shared';
import { createScript } from '@kernel/script';
import type { RacePointResolverInput } from '../common/types';

export default createScript({
    name: 'race-hit',
    fn: ({ raceService, raceMapCache, racePointResolvers, messenger }) => {
        const onHit = async (player: PlayerMp, index: number) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const resolver = racePointResolvers.find((a) => a.supportedRaceType === race.type);
            if (!resolver) return;

            const participantIndex = race.participants.findIndex((p) => p.player === player);
            if (participantIndex === -1) return;

            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) return;

            const participant = race.participants[participantIndex];
            const lap = participant.lap;
            const now = Date.now();

            const input: RacePointResolverInput = {
                index,
                lap,
                totalLaps: race.laps ?? 1,
                totalPoints: getMap.data.racePoints.length,
            };
            const output = resolver.resolve(input);

            participant.lap = output.lap;

            if (output.finished) {
                participant.nextRacePointIndex = undefined;
                participant.finishTime = now;
                raceService.finish(participant);
                messenger.publish(player, 'race:finish');
            } else {
                participant.nextRacePointIndex = output.index;
                messenger.publish(player, 'race:hit', {
                    lap,
                    index: output.index,
                    nextIndex: output.nextIndex,
                    finished: output.finished,
                });
            }

            const currentPoint = getMap.data.racePoints[index];
            const previousPoint =
                lap === 0 && index === 0
                    ? getMap.data.startPoints[participantIndex]
                    : index === 0
                    ? getMap.data.racePoints[getMap.data.racePoints.length - 1]
                    : getMap.data.racePoints[index - 1];

            participant.accumulatedDistance += getDistance(currentPoint.position, previousPoint.position);

            participant.pointLogs.push({
                lap,
                index,
                time: now,
            });
        };

        mp.events.add('race:hit', onHit);
    },
});

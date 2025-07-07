import { createScript } from '@kernel/script';
import {
    RaceStatus,
    type RaceHudDto,
    type RaceHudParticipantDto,
    type RaceHudParticipantTickDto,
    type RaceHudTickDto,
} from '@repo/shared';
import type { Race } from '../common/types';

export default createScript({
    name: 'race-hud',
    fn: ({ raceService, raceMapCache, messenger }) => {
        const onGetData = (player: PlayerMp) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participants: RaceHudParticipantDto[] = race.participants.map((p) => ({
                id: p.player.id,
                lap: p.lap,
                name: p.player.name,
                distance: p.accumulatedDistance,
                partialDistance: p.partialDistance,
                speedPerHour: p.player.vehicle ? p.player.vehicle.velocity.length() : 0,
            }));

            const hudData: RaceHudDto = {
                startTime: race.startTime,
                maxLaps: race.laps ?? 1,
                participants,
            };

            messenger.publish(player, 'race-hud:getData', hudData);
        };

        const onRaceStarted = (race: Race) => {
            race.participants.forEach((p) => (p.nextRacePointIndex = 0));
            messenger.publish(
                race.participants.map((p) => p.player),
                'race-hud:startTime',
                race.startTime,
            );
        };

        const onHit = (player: PlayerMp, index: number) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participant = race.participants.find((p) => p.player === player);
            if (!participant) return;

            if (index === 0 && participant.pointLogs.length > 0) {
                messenger.publish(player, 'race-hud:lapTime', Date.now());
            }
        };

        const onTick = async () => {
            for (const race of raceService.races.filter((r) => r.status === RaceStatus.Started)) {
                const getMap = await raceMapCache.get(race.mapId);
                if (getMap.failed) continue;

                const map = getMap.data;

                const tickDto: RaceHudTickDto = {
                    participants: race.participants
                        .map((p, i) => {
                            let partialDistance = 0;
                            const lastIndex = p.pointLogs[p.pointLogs.length - 1]?.index;
                            const nextIndex = p.nextRacePointIndex;

                            if (nextIndex != null) {
                                const lastPosition =
                                    lastIndex === undefined
                                        ? map.startPoints[i].position
                                        : map.racePoints[lastIndex].position;
                                const nextPosition = map.racePoints[nextIndex].position;
                                const line = new mp.Vector3(
                                    nextPosition.x - lastPosition.x,
                                    nextPosition.y - lastPosition.y,
                                    nextPosition.z - lastPosition.z,
                                );
                                const currentPosition = p.player.vehicle
                                    ? p.player.vehicle.position
                                    : p.player.position;
                                const currentLine = new mp.Vector3(
                                    currentPosition.x - lastPosition.x,
                                    currentPosition.y - lastPosition.y,
                                    currentPosition.z - lastPosition.z,
                                );
                                partialDistance = line.dot(currentLine);
                            }

                            return {
                                id: p.player.id,
                                lap: p.lap,
                                distance: p.accumulatedDistance,
                                partialDistance,
                                speedPerHour: p.player.vehicle ? p.player.vehicle.velocity.length : 0,
                            } as RaceHudParticipantTickDto;
                        })
                        .sort((a, b) => b.distance - a.distance),
                };

                messenger.publish(
                    race.participants.map((p) => p.player),
                    'race-hud:tick',
                    tickDto,
                );
            }
        };

        raceService.on('raceStarted', onRaceStarted);
        mp.events.add('race-hud:getData', onGetData);
        mp.events.add('race:hit', onHit);
        setInterval(onTick, 128);
    },
});

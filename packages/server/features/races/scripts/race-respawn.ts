import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-respawn',
    fn: ({ raceService, raceMapCache }) => {
        const onRespawn = async (player: PlayerMp) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participantIndex = race.participants.findIndex((p) => p.player === player);
            if (participantIndex === -1) return;

            const getMap = await raceMapCache.get(race.mapId);
            if (getMap.failed) return;
            const map = getMap.data;

            const participant = race.participants[participantIndex];
            const entity = participant.vehicle ?? player.vehicle ?? player;

            const lastPoint = participant.pointLogs[participant.pointLogs.length - 1];
            if (lastPoint) {
                entity.position = new mp.Vector3(
                    map.racePoints[lastPoint.index].position.x,
                    map.racePoints[lastPoint.index].position.y,
                    map.racePoints[lastPoint.index].position.z,
                );
            } else {
                const startPoint = map.startPoints[participantIndex];
                entity.position = new mp.Vector3(
                    startPoint.position.x,
                    startPoint.position.y,
                    startPoint.position.z,
                );
            }
        };

        mp.events.add('race-respawn:respawn', onRespawn);
    },
});

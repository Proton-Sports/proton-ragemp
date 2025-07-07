import { createScript } from '@kernel/script';
import type { RaceCollectionDto } from '@repo/shared';

export default createScript({
    name: 'race-menu-collection-tab',
    fn: ({ raceService, raceMapCache, messenger }) => {
        const handleData = async (player: PlayerMp) => {
            const races = await Promise.all(
                raceService.races.map(async (race) => {
                    const getMap = await raceMapCache.get(race.mapId);
                    const dto: RaceCollectionDto = {
                        id: race.id,
                        mapName: getMap.failed ? 'Unknown Map' : getMap.data.name,
                        hostName: race.host.name,
                        racers: race.participants.length,
                        maxRacers: race.maxParticipants,
                        laps: race.laps ?? 1,
                        ghosting: race.ghosting,
                        type: race.type,
                        status: race.status,
                    };
                    return dto;
                }),
            );
            messenger.publish(player, 'race-menu-collection:data', races);
        };

        mp.events.add('race-menu-collection:data', handleData);
    },
});

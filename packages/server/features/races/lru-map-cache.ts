import { attempt } from '@duydang2311/attempt';
import type { Db } from '@repo/db';
import { raceMaps } from '@repo/db/schema';
import { NotFoundError } from '@repo/shared/models/error';
import { eq } from 'drizzle-orm';
import { LRUCache } from 'lru-cache';
import { type CachedRaceMap, type RaceMapCache } from './common/types';

export class LRURaceMapCache implements RaceMapCache {
    #cache: LRUCache<string, CachedRaceMap>;
    #db: Db;

    constructor(db: Db) {
        this.#db = db;
        this.#cache = new LRUCache<string, CachedRaceMap>({
            max: 100,
            ttl: 10 * 60 * 1000,
            fetch: (key: string) => {
                return this.#db.query.raceMaps.findFirst({
                    where: eq(raceMaps.id, Number(key)),
                    with: {
                        racePoints: {
                            orderBy: (racePoints, { asc }) => [asc(racePoints.index)],
                        },
                        startPoints: {
                            orderBy: (raceStartPoints, { asc }) => [asc(raceStartPoints.index)],
                        },
                    },
                });
            },
        });
    }

    public async get(id: number) {
        const cacheKey = `RaceMap:${id}`;
        let map = this.#cache.get(cacheKey);
        if (map) {
            return attempt.ok(map);
        }

        map = await this.#cache.fetch(id.toString());
        if (!map) {
            return attempt.fail(new NotFoundError());
        }
        return attempt.ok(map);
    }
}

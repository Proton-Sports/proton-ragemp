import type { Attempt } from '@duydang2311/attempt';
import type { RacePointDto, RaceType } from '@repo/shared/race';
import { RaceStatus } from '../common/race-status';
import type { IRacePointResolver } from './race-point-resolver';

export interface RaceService {
    on(eventName: 'racePointHit', handler: (index: number) => void): () => void;
    on(eventName: 'started', handler: () => void): () => void;
    on(eventName: 'stopped', handler: () => void): () => void;

    ghosting: boolean;
    raceType: RaceType;
    dimension: number;
    readonly racePoints: ReadonlyArray<RacePointDto>;
    iplName: string | null;
    status: RaceStatus;

    clearRacePoints(): void;
    ensureRacePointsCapacity(capacity: number): number;
    addRacePoint(point: RacePointDto): void;
    addRacePoints(points: RacePointDto[]): void;
    loadRacePoint(checkpointType: number, index: number, nextIndex: number | null): CheckpointMp;
    unloadRacePoint(): void;
    getPointResolver(): Attempt<IRacePointResolver, 'NOT_FOUND'>;
    start(): void;
    stop(): void;
}

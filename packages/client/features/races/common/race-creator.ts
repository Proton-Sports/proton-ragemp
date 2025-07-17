import type { Attempt } from '@duydang2311/attempt';
import { RacePointData } from './race-point-data';
import { StartPositionData } from './start-position-data';
import type { NotFoundError } from '@repo/shared/models/error';

export interface RaceCreator {
    readonly racePoints: Array<{ position: Vector3; radius: number }>;
    readonly startPoints: Array<{ position: Vector3; rotation: Vector3 }>;
    name: string;

    clearStartPoints(): void;
    importStartPoints(points: Array<{ position: Vector3; rotation: Vector3 }>): void;
    addStartPoint(position: Vector3, rotation: Vector3): void;
    removeStartPoint(position: Vector3): Attempt<StartPositionData, NotFoundError>;

    clearRacePoints(): void;
    importRacePoints(points: Array<{ position: Vector3; radius: number }>): void;
    addRacePoint(position: Vector3, radius: number): void;
    removeRacePoint(position: Vector3): Attempt<RacePointData, NotFoundError>;

    getClosestRaceCheckpointTo(position: Vector3): CheckpointMp | null;
    updateRacePointPosition(checkpoint: CheckpointMp, position: Vector3): boolean;
}

import { RacePointData } from './race-point-data';
import { StartPositionData } from './start-position-data';

export interface IRaceCreator {
    readonly racePoints: Array<{ position: Vector3; radius: number }>;
    readonly startPoints: Array<{ position: Vector3; rotation: Vector3 }>;
    name: string;

    clearStartPoints(): void;
    importStartPoints(points: Array<{ position: Vector3; rotation: Vector3 }>): void;
    addStartPoint(position: Vector3, rotation: Vector3): void;
    tryRemoveStartPoint(position: Vector3, removed: { value: StartPositionData | null }): boolean;

    clearRacePoints(): void;
    importRacePoints(points: Array<{ position: Vector3; radius: number }>): void;
    addRacePoint(position: Vector3, radius: number): void;
    tryRemoveRacePoint(position: Vector3, removed: { value: RacePointData | null }): boolean;

    tryGetClosestRaceCheckpointTo(position: Vector3, checkpoint: { value: CheckpointMp | null }): boolean;
    updateRacePointPosition(checkpoint: CheckpointMp, position: Vector3): boolean;
}

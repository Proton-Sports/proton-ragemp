import type { Attempt } from '@duydang2311/attempt';
import type { ShapeTestInvalidError } from './errors';

export interface RaycastData {
    readonly isHit: boolean;
    readonly hitEntity: number;
    readonly endPosition: Vector3;
    readonly surfaceNormal: Vector3;
}

export interface RaycastService {
    raycast(startPosition: Vector3, endPosition: Vector3): Promise<Attempt<RaycastData, ShapeTestInvalidError>>;
}

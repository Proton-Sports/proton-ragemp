import { attempt, type Attempt } from '@duydang2311/attempt';
import { renderPromise } from '@duydang2311/ragemp-utils-client';
import { ShapeTestInvalidError } from './common/errors';
import type { RaycastData, RaycastService } from './common/types';

export class RageMpRaycastService implements RaycastService {
    public raycast(startPosition: Vector3, endPosition: Vector3) {
        const handle = mp.game.shapetest.startShapeTestLosProbe(
            startPosition.x,
            startPosition.y,
            startPosition.z,
            endPosition.x,
            endPosition.y,
            endPosition.z,
            1,
            0,
            4,
        );

        return renderPromise<Attempt<RaycastData, ShapeTestInvalidError>>((resolve) => {
            const result = mp.game.shapetest.getShapeTestResult(handle);
            if (result.result === 1) {
                return;
            }

            if (result.result === 0) {
                resolve(attempt.fail(new ShapeTestInvalidError()));
                return;
            }

            resolve(
                attempt.ok({
                    isHit: result.hit,
                    endPosition: result.endCoords,
                    surfaceNormal: result.surfaceNormal,
                    hitEntity: result.entityHit,
                }),
            );
        });
    }
}

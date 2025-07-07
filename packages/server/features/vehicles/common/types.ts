import type { Attempt } from '@duydang2311/attempt';
import type { NotFoundError } from '@repo/shared/models/error';

export interface GarageService {
    spawnedVehicles: Map<PlayerMp, VehicleMp[]>;
    spawn(playerVehicleId: number, position: Vector3, heading: number): Promise<Attempt<VehicleMp, NotFoundError>>;
}

import { attempt, type Attempt } from '@duydang2311/attempt';
import type { Db } from '@repo/db';
import { NotFoundError } from '@repo/shared/models/error';
import type { GarageService } from './common/types';

export class RageMpGarageService implements GarageService {
    readonly #db: Db;
    readonly #spawnedVehicles = new Map<PlayerMp, VehicleMp[]>();

    constructor(db: Db) {
        this.#db = db;
    }

    get spawnedVehicles() {
        return this.#spawnedVehicles;
    }

    async spawn(
        playerVehicleId: number,
        position: Vector3,
        heading: number,
    ): Promise<Attempt<VehicleMp, NotFoundError>> {
        const playerVehicle = await this.#db.query.playerVehicles.findFirst({
            where: (pv, { eq }) => eq(pv.id, playerVehicleId),
            columns: {
                id: true,
                model: true,
                primaryColor: true,
                secondaryColor: true,
            },
            with: {
                activeMods: {
                    with: {
                        playerVehicleMod: {
                            with: {
                                mod: true,
                            },
                        },
                    },
                    columns: {},
                },
                activeWheelVariations: {
                    with: {
                        playerVehicleWheelVariation: {
                            with: {
                                wheelVariation: true,
                            },
                        },
                    },
                    columns: {},
                },
            },
        });

        if (!playerVehicle) {
            return attempt.fail(new NotFoundError());
        }

        const vehicle = mp.vehicles.new(playerVehicle.model, position, {
            heading,
        });

        vehicle.garageId = playerVehicle.id;

        const wheel = playerVehicle.activeWheelVariations[0]?.playerVehicleWheelVariation.wheelVariation;
        if (wheel) {
            vehicle.wheelType = wheel.type;
            vehicle.setMod(23, wheel.value);
        }

        for (const mod of playerVehicle.activeMods.map((a) => a.playerVehicleMod.mod)) {
            vehicle.setMod(mod.category, mod.value);
        }

        vehicle.setColorRGB(
            playerVehicle.primaryColor.r,
            playerVehicle.primaryColor.g,
            playerVehicle.primaryColor.b,
            playerVehicle.secondaryColor.r,
            playerVehicle.secondaryColor.g,
            playerVehicle.secondaryColor.b,
        );

        return attempt.ok(vehicle);
    }
}

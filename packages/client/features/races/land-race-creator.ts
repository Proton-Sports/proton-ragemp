import { getDistanceSquared } from '@repo/shared/utils';
import type { IRaceCreator } from './common/race-creator';
import { RacePointData } from './common/race-point-data';
import { StartPositionData } from './common/start-position-data';

export class LandRaceCreator implements IRaceCreator {
    private static readonly BLIP_SPRITE_RADAR_RACE_LAND = 315;
    private static readonly BLIP_SPRITE_RADAR_PLACEHOLDER6 = 373;
    private static readonly RADAR_RACE_OPEN_WHEEL = 726;
    private static readonly BLIP_COLOR_PRIMARY = 1;
    private static readonly BLIP_COLOR_SECONDARY = 4;

    private readonly racePointDataList: RacePointData[] = [];
    private readonly startPointDataList: StartPositionData[] = [];

    public name: string = '';

    public get racePoints(): Array<{ position: Vector3; radius: number }> {
        return this.racePointDataList.map((x) => ({
            position: x.position,
            radius: x.checkpoint.data.radius,
        }));
    }

    public get startPoints(): Array<{ position: Vector3; rotation: Vector3 }> {
        return this.startPointDataList.map((x) => ({
            position: x.position,
            rotation: x.rotation,
        }));
    }

    public clearRacePoints(): void {
        for (const data of this.racePointDataList) {
            data.destroy();
        }
        this.racePointDataList.length = 0;
    }

    public clearStartPoints(): void {
        for (const data of this.startPointDataList) {
            data.destroy();
        }
        this.startPointDataList.length = 0;
    }

    public addRacePoint(position: Vector3, radius: number): void {
        const lastData =
            this.racePointDataList.length > 0 ? this.racePointDataList[this.racePointDataList.length - 1] : null;

        if (!lastData) {
            this.racePointDataList.push(
                this.createRacePositionData(
                    4, // CylinderCheckerboard type
                    LandRaceCreator.BLIP_SPRITE_RADAR_RACE_LAND,
                    position,
                    position,
                    radius,
                ),
            );
            return;
        }

        // Update last checkpoint to point to this new one
        lastData.checkpoint.destroy();
        const newLastCheckpoint = mp.checkpoints.new(
            6, // CylinderDoubleArrow type
            lastData.position,
            lastData.checkpoint.data.radius,
            {
                direction: position,
                color: [255, 255, 255, 255],
                visible: true,
                dimension: mp.players.local.dimension,
            },
        );

        lastData.checkpoint = newLastCheckpoint;
        // lastData.blip.sprite = LandRaceCreator.BLIP_SPRITE_RADAR_PLACEHOLDER6;
        // RAGE:MP doesn't support directly changing blip color, recreate it
        const newBlip = mp.blips.new(LandRaceCreator.BLIP_SPRITE_RADAR_PLACEHOLDER6, lastData.position, {
            color: LandRaceCreator.BLIP_COLOR_SECONDARY,
            dimension: mp.players.local.dimension,
        });
        lastData.blip.destroy();
        lastData.blip = newBlip;

        this.racePointDataList.push(
            this.createRacePositionData(
                4, // CylinderCheckerboard type
                LandRaceCreator.BLIP_SPRITE_RADAR_RACE_LAND,
                position,
                position,
                radius,
            ),
        );
    }

    public tryRemoveRacePoint(position: Vector3, removed: { value: RacePointData | null }): boolean {
        let closestDistance = Number.MAX_VALUE;
        let closestIdx = -1;

        for (let i = 0; i < this.racePointDataList.length; i++) {
            const node = this.racePointDataList[i];
            const dist = getDistanceSquared(position, node.position);
            const radiusSquared = node.checkpoint.data.radius * node.checkpoint.data.radius;

            if (dist <= radiusSquared && dist < closestDistance) {
                closestDistance = dist;
                closestIdx = i;
            }
        }

        if (closestIdx === -1) {
            removed.value = null;
            return false;
        }

        const closestNode = this.racePointDataList[closestIdx];
        closestNode.destroy();

        if (closestIdx > 0) {
            const prevNode = this.racePointDataList[closestIdx - 1];

            if (closestIdx < this.racePointDataList.length - 1) {
                const nextNode = this.racePointDataList[closestIdx + 1];

                // Update previous node to point to the node after the one being removed
                prevNode.checkpoint.destroy();
                const newPrevCheckpoint = mp.checkpoints.new(
                    6, // CylinderDoubleArrow type
                    prevNode.position,
                    prevNode.checkpoint.data.radius,
                    {
                        direction: nextNode.position,
                        color: [255, 255, 255, 255],
                        visible: true,
                        dimension: mp.players.local.dimension,
                    },
                );
                prevNode.checkpoint = newPrevCheckpoint;
            } else {
                // This was the last node, update previous node to be an end node
                prevNode.checkpoint.destroy();
                const newPrevCheckpoint = mp.checkpoints.new(
                    4, // CylinderCheckerboard type
                    prevNode.position,
                    prevNode.checkpoint.data.radius,
                    {
                        direction: new mp.Vector3(0, 0, 0),
                        color: [255, 255, 255, 255],
                        visible: true,
                        dimension: mp.players.local.dimension,
                    },
                );
                prevNode.checkpoint = newPrevCheckpoint;

                // Update blip
                prevNode.blip.destroy();
                prevNode.blip = mp.blips.new(LandRaceCreator.BLIP_SPRITE_RADAR_RACE_LAND, prevNode.position, {
                    color: LandRaceCreator.BLIP_COLOR_PRIMARY,
                    dimension: mp.players.local.dimension,
                });
            }
        }

        this.racePointDataList.splice(closestIdx, 1);
        removed.value = closestNode;
        return true;
    }

    public tryGetClosestRaceCheckpointTo(position: Vector3, checkpoint: { value: CheckpointMp | null }): boolean {
        const precision = 0.5;
        checkpoint.value = null;

        let maxSquared = Number.MAX_VALUE;
        let closestCheckpoint: CheckpointMp | null = null;

        for (const data of this.racePointDataList) {
            const checkpointPos = data.checkpoint.position;
            const dx = position.x - checkpointPos.x;
            const dy = position.y - checkpointPos.y;
            const dz = position.z - checkpointPos.z;

            const distanceSquared = dx * dx + dy * dy + dz * dz - precision;

            if (
                distanceSquared < data.checkpoint.data.radius * data.checkpoint.data.radius &&
                distanceSquared < maxSquared
            ) {
                closestCheckpoint = data.checkpoint;
                maxSquared = distanceSquared;
            }
        }

        if (closestCheckpoint) {
            checkpoint.value = closestCheckpoint;
            return true;
        }

        return false;
    }

    public updateRacePointPosition(checkpoint: CheckpointMp, position: Vector3): boolean {
        for (let i = 0; i < this.racePointDataList.length; i++) {
            const current = this.racePointDataList[i];
            if (current.checkpoint !== checkpoint) continue;

            // In RAGE:MP we need to recreate the checkpoint
            const data = current.checkpoint.data;
            const scale = data.radius;
            const destination = data.destination || new mp.Vector3(0, 0, 0);
            const dimension = current.checkpoint.dimension;

            current.checkpoint.destroy();
            current.checkpoint = mp.checkpoints.new(data.type, position, scale, {
                direction: destination,
                color: [255, 255, 255, 255],
                visible: true,
                dimension: dimension,
            });

            current.position = position;
            current.blip.position = position;

            // Update previous checkpoint's direction if this isn't the first point
            if (i > 0) {
                const prevNode = this.racePointDataList[i - 1];
                const prevData = prevNode.checkpoint.data;
                const prevDimension = prevNode.checkpoint.dimension;
                prevNode.checkpoint.destroy();
                prevNode.checkpoint = mp.checkpoints.new(prevData.type, prevNode.position, prevData.radius, {
                    direction: position,
                    color: [255, 255, 255, 255],
                    visible: true,
                    dimension: prevDimension,
                });
            }

            return true;
        }

        return false;
    }

    public addStartPoint(position: Vector3, rotation: Vector3): void {
        this.startPointDataList.push(this.createStartPositionData(this.startPointDataList.length, position, rotation));
    }

    public tryRemoveStartPoint(position: Vector3, removed: { value: StartPositionData | null }): boolean {
        let closestDistance = Number.MAX_VALUE;
        let closestIdx = -1;

        for (let i = 0; i < this.startPointDataList.length; i++) {
            const node = this.startPointDataList[i];
            const dist = getDistanceSquared(position, node.position);

            if (dist < 4.0 && dist < closestDistance) {
                closestDistance = dist;
                closestIdx = i;
            }
        }

        if (closestIdx === -1) {
            removed.value = null;
            return false;
        }

        const closestNode = this.startPointDataList[closestIdx];
        let previousMarkerType = closestNode.numberMarker.data.type;

        // Update the marker types for the remaining start points
        for (let i = closestIdx + 1; i < this.startPointDataList.length; i++) {
            const node = this.startPointDataList[i];
            const currentType = node.numberMarker.data.type;

            // Recreate the marker with updated type
            node.numberMarker.destroy();
            node.numberMarker = mp.markers.new(previousMarkerType, node.numberMarker.position, 1.0, {
                color: [255, 0, 0, 255],
                visible: true,
                dimension: mp.players.local.dimension,
            });
            node.numberMarker.data = {
                type: previousMarkerType,
            };
            previousMarkerType = currentType;
        }

        closestNode.destroy();
        this.startPointDataList.splice(closestIdx, 1);
        removed.value = closestNode;
        return true;
    }

    public importStartPoints(points: Array<{ position: Vector3; rotation: Vector3 }>): void {
        for (const point of points) {
            this.addStartPoint(point.position, point.rotation);
        }
    }

    public importRacePoints(points: Array<{ position: Vector3; radius: number }>): void {
        for (const point of points) {
            this.addRacePoint(point.position, point.radius);
        }
    }

    private createRacePositionData(
        checkpointType: number,
        blipSprite: number,
        position: Vector3,
        nextPosition: Vector3,
        radius: number,
    ): RacePointData {
        const blip = mp.blips.new(blipSprite, position, {
            color: LandRaceCreator.BLIP_COLOR_PRIMARY,
            dimension: mp.players.local.dimension,
        });

        mp.console.logInfo('CreateRacePositionData ' + JSON.stringify(position));

        const checkpoint = mp.checkpoints.new(checkpointType, position, radius, {
            direction: nextPosition,
            color: [255, 255, 255, 255],
            visible: true,
            dimension: mp.players.local.dimension,
        });
        checkpoint.data = { type: checkpointType, radius, destination: nextPosition };

        return new RacePointData(position, checkpoint, blip);
    }

    private createStartPositionData(ordinal: number, position: Vector3, rotation: Vector3): StartPositionData {
        const blip = mp.blips.new(LandRaceCreator.RADAR_RACE_OPEN_WHEEL, position, {
            dimension: mp.players.local.dimension,
        });

        // MarkerNum0 + ordinal for number markers (0-9)
        const markerType = 29 + ordinal; // Adjusting for RAGE:MP marker types

        const numberMarker = mp.markers.new(markerType, new mp.Vector3(position.x, position.y, position.z + 2), 1.0, {
            color: [255, 0, 0, 255],
            visible: true,
            dimension: mp.players.local.dimension,
        });
        numberMarker.data = {
            type: markerType,
        };

        const boxMarker = mp.markers.new(
            1, // Box marker type in RAGE:MP
            position,
            3,
            {
                color: [255, 0, 0, 64],
                rotation: rotation,
                visible: true,
                dimension: mp.players.local.dimension,
            },
        );
        boxMarker.data = { type: 1 };

        return new StartPositionData(position, rotation, numberMarker, boxMarker, blip);
    }
}

import { attempt } from '@duydang2311/attempt';
import { getDistanceSquared } from '@repo/shared';
import type { RacePointDto } from '@repo/shared/race';
import { RaceType } from '@repo/shared/race';
import type { IRacePointResolver } from './common/race-point-resolver';
import type { IRaceService } from './common/race-service';
import { RaceStatus } from './common/race-status';

export class DefaultRaceService implements IRaceService {
    private static readonly BLIP_SPRITE_OBJECTIVE = 146;
    private static readonly BLIP_SPRITE_ARROW = 14;

    private readonly racePointArray: RacePointDto[] = [];
    private readonly raceTypeToResolverMap = new Map<RaceType, IRacePointResolver>();
    private readonly eventHandlers = {
        racePointHit: new Set<(index: number) => void>(),
        started: new Set<() => void>(),
        stopped: new Set<() => void>(),
    };

    private hit: boolean = false;
    private index: number = 0;
    private checkpoint: CheckpointMp | null = null;
    private blip: BlipMp | null = null;
    private arrowBlip: BlipMp | null = null;
    private nextMarker: MarkerMp | null = null;
    private nextBlip: BlipMp | null = null;
    private renderHandlerBound = false;

    public ghosting: boolean = false;
    public raceType: RaceType = RaceType.Laps;
    public dimension: number = 0;
    public iplName: string | null = null;
    public status: RaceStatus = RaceStatus.None;

    constructor(resolvers: IRacePointResolver[]) {
        resolvers.forEach((resolver) => {
            this.raceTypeToResolverMap.set(resolver.supportedRaceType, resolver);
        });
    }

    public get racePoints(): ReadonlyArray<RacePointDto> {
        return this.racePointArray;
    }

    public clearRacePoints(): void {
        this.racePointArray.length = 0;
    }

    public ensureRacePointsCapacity(capacity: number): number {
        if (capacity > this.racePointArray.length) {
            const newLength = Math.max(this.racePointArray.length * 2, capacity);
            // In JavaScript/TypeScript, arrays are automatically resized
            return newLength;
        }
        return this.racePointArray.length;
    }

    public addRacePoint(point: RacePointDto): void {
        this.racePointArray.push(point);
    }

    public addRacePoints(points: RacePointDto[]): void {
        this.racePointArray.push(...points);
    }

    public loadRacePoint(checkpointType: number, index: number, nextIndex: number | null): CheckpointMp {
        this.hit = false;
        this.index = index;

        const point = this.racePointArray[index];
        const nextPoint = nextIndex !== null ? this.racePointArray[nextIndex] : null;

        if (!this.checkpoint) {
            this.checkpoint = mp.checkpoints.new(
                checkpointType,
                new mp.Vector3(point.position.x, point.position.y, point.position.z - point.radius / 2),
                point.radius,
                {
                    direction: nextPoint
                        ? new mp.Vector3(
                              nextPoint.position.x,
                              nextPoint.position.y,
                              nextPoint.position.z - nextPoint.radius / 2,
                          )
                        : new mp.Vector3(0, 0, 0),
                    color: [251, 251, 181, 128],
                    visible: true,
                    dimension: this.dimension,
                },
            );
        } else {
            // this.checkpoint.position = new mp.Vector3(
            //     point.position.x,
            //     point.position.y,
            //     point.position.z - point.radius / 2,
            // );
            // this.checkpoint.scale = point.radius;
            // this.checkpoint.dimension = this.dimension;
            // RAGE:MP doesn't have direct setters for checkpoint type and nextPosition, so we recreate it
            this.checkpoint.destroy();
            this.checkpoint = mp.checkpoints.new(
                checkpointType,
                new mp.Vector3(point.position.x, point.position.y, point.position.z - point.radius / 2),
                point.radius,
                {
                    direction: nextPoint
                        ? new mp.Vector3(
                              nextPoint.position.x,
                              nextPoint.position.y,
                              nextPoint.position.z - nextPoint.radius / 2,
                          )
                        : new mp.Vector3(0, 0, 0),
                    color: [251, 251, 181, 128],
                    visible: true,
                    dimension: this.dimension,
                },
            );
        }
        this.checkpoint.data = {
            radius: point.radius,
        };

        if (!nextPoint) {
            if (this.nextMarker) {
                this.nextMarker.destroy();
                this.nextMarker = null;
            }
            if (this.nextBlip) {
                this.nextBlip.destroy();
                this.nextBlip = null;
            }
        } else {
            if (!this.nextMarker) {
                this.nextMarker = mp.markers.new(
                    1, // Cylinder marker
                    new mp.Vector3(nextPoint.position.x, nextPoint.position.y, nextPoint.position.z),
                    nextPoint.radius * 2,
                    {
                        color: [251, 251, 181, 32],
                        dimension: this.dimension,
                    },
                );
            } else {
                this.nextMarker.destroy();
                this.nextMarker = mp.markers.new(
                    1, // Cylinder marker
                    new mp.Vector3(nextPoint.position.x, nextPoint.position.y, nextPoint.position.z),
                    nextPoint.radius * 2,
                    {
                        color: [251, 251, 181, 32],
                        dimension: this.dimension,
                    },
                );
            }

            if (!this.nextBlip) {
                this.nextBlip = mp.blips.new(
                    DefaultRaceService.BLIP_SPRITE_OBJECTIVE,
                    new mp.Vector3(nextPoint.position.x, nextPoint.position.y, nextPoint.position.z),
                    {
                        scale: 0.5,
                        color: 5,
                        dimension: this.dimension,
                    },
                );
            } else {
                this.nextBlip.destroy();
                this.nextBlip = mp.blips.new(
                    DefaultRaceService.BLIP_SPRITE_OBJECTIVE,
                    new mp.Vector3(nextPoint.position.x, nextPoint.position.y, nextPoint.position.z),
                    {
                        scale: 0.5,
                        color: 5,
                        dimension: this.dimension,
                    },
                );
            }
        }

        if (!this.blip) {
            this.blip = mp.blips.new(
                DefaultRaceService.BLIP_SPRITE_OBJECTIVE,
                new mp.Vector3(point.position.x, point.position.y, point.position.z),
                {
                    scale: 1.0,
                    color: 5,
                    dimension: this.dimension,
                },
            );
        } else {
            this.blip.position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
            this.blip.dimension = this.dimension;
        }

        if (!this.arrowBlip) {
            this.arrowBlip = mp.blips.new(
                DefaultRaceService.BLIP_SPRITE_ARROW,
                new mp.Vector3(point.position.x, point.position.y, point.position.z),
                {
                    scale: 1.0,
                    color: 5,
                    dimension: this.dimension,
                },
            );
        } else {
            this.arrowBlip.position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
            this.arrowBlip.dimension = this.dimension;
        }

        return this.checkpoint;
    }

    public unloadRacePoint(): void {
        if (this.checkpoint) {
            this.checkpoint.destroy();
            this.checkpoint = null;
        }
        if (this.blip) {
            this.blip.destroy();
            this.blip = null;
        }
        if (this.arrowBlip) {
            this.arrowBlip.destroy();
            this.arrowBlip = null;
        }
        if (this.nextMarker) {
            this.nextMarker.destroy();
            this.nextMarker = null;
        }
        if (this.nextBlip) {
            this.nextBlip.destroy();
            this.nextBlip = null;
        }
    }

    public start(): void {
        this.status = RaceStatus.Started;
        if (!this.renderHandlerBound) {
            mp.events.add('render', this.handleRender.bind(this));
            this.renderHandlerBound = true;
        }
        this.eventHandlers.started.forEach((handler) => handler());
    }

    public stop(): void {
        this.status = RaceStatus.None;
        if (this.renderHandlerBound) {
            mp.events.remove('render', this.handleRender.bind(this));
            this.renderHandlerBound = false;
        }
        this.eventHandlers.stopped.forEach((handler) => handler());
    }

    public getPointResolver() {
        const foundResolver = this.raceTypeToResolverMap.get(this.raceType);
        if (foundResolver) {
            return attempt.ok(foundResolver);
        }
        return attempt.fail('NOT_FOUND' as const);
    }

    public on(eventName: 'racePointHit', handler: (index: number) => void): () => void;
    public on(eventName: 'started', handler: () => void): () => void;
    public on(eventName: 'stopped', handler: () => void): () => void;
    public on(eventName: string, handler: (...args: any[]) => void): () => void {
        switch (eventName) {
            case 'racePointHit':
                this.eventHandlers.racePointHit.add(handler as (index: number) => void);
                break;
            case 'started':
                this.eventHandlers.started.add(handler as () => void);
                break;
            case 'stopped':
                this.eventHandlers.stopped.add(handler as () => void);
                break;
        }

        return () => {
            switch (eventName) {
                case 'racePointHit':
                    this.eventHandlers.racePointHit.delete(handler as (index: number) => void);
                    break;
                case 'started':
                    this.eventHandlers.started.delete(handler as () => void);
                    break;
                case 'stopped':
                    this.eventHandlers.stopped.delete(handler as () => void);
                    break;
            }
        };
    }

    private handleRender(): void {
        if (this.hit || !this.checkpoint || this.eventHandlers.racePointHit.size === 0) {
            return;
        }

        const vehicle = mp.players.local.vehicle;
        if (!vehicle) {
            return;
        }

        const offset = 32.0;
        const vehiclePosition = vehicle.position;
        const radiusSquared = this.checkpoint.data.radius * this.checkpoint.data.radius;

        const checkpointPosition = this.checkpoint.position;

        // Calculate squared distance
        const distanceSquared = getDistanceSquared(vehiclePosition, checkpointPosition);

        if (distanceSquared <= radiusSquared + offset) {
            this.hit = true;
            this.eventHandlers.racePointHit.forEach((handler) => {
                handler(this.index);
            });
        }
    }
}

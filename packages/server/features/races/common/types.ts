import type { Attempt } from '@duydang2311/attempt';
import type { WeatherType } from '@duydang2311/ragemp-utils-shared';
import type { RaceMap, RacePoint, RaceStartPoint } from '@repo/db/schema';
import type { RaceStatus, RaceType } from '@repo/shared';
import type { NotFoundError } from '@repo/shared/models/error';

export interface RacePointLog {
    lap: number;
    index: number;
    time: number; // timestamp
}

export interface RaceParticipant {
    player: PlayerMp;
    vehicle?: VehicleMp;
    lap: number;
    accumulatedDistance: number;
    partialDistance: number;
    nextRacePointIndex?: number;
    pointLogs: RacePointLog[];
    finishTime: number; // timestamp
    prizePercent: number;
    ready: boolean;
    playerVehicleId?: number;
    vehicleModel: number; // vehicle hash
}

export interface Race {
    id: number;
    guid: string;
    host: PlayerMp;
    mapId: number;
    vehicleModels: number[]; // vehicle hash
    maxParticipants: number;
    duration: number; // in seconds
    countdownSeconds: number;
    description: string;
    ghosting: boolean;
    type: RaceType;
    laps?: number;
    time: string; // e.g., "12:00"
    weather: WeatherType;
    createdTime: number; // timestamp
    status: RaceStatus;
    startTime: number; // timestamp
    participants: RaceParticipant[];
    prizePool: number;
    lobbyCountingDown: boolean;
}

export interface RacePointResolverInput {
    index: number;
    lap: number;
    totalPoints: number;
    totalLaps: number;
}

export interface RacePointResolverOutput {
    index: number;
    lap: number;
    finished: boolean;
    nextIndex?: number;
}

export interface RacePointResolver {
    supportedRaceType: RaceType;
    resolve(input: RacePointResolverInput): RacePointResolverOutput;
}

export interface RaceServiceEvents {
    participantJoined(race: Race, participant: RaceParticipant): void;
    participantLeft(race: Race, player: PlayerMp): void;
    racePrepared(race: Race): void;
    raceStarted(race: Race): void;
    raceCreated(race: Race): void;
    participantFinished(participant: RaceParticipant): void;
    raceFinished(race: Race): void;
    raceDestroyed(race: Race): void;
    raceCountdown(race: Race, countDelay: number): void;
}

export interface RaceService {
    races: Race[];
    on<K extends keyof RaceServiceEvents>(eventName: K, listener: RaceServiceEvents[K]): () => void;

    addRace(race: Race): void;
    removeRace(race: Race): boolean;
    destroyRace(race: Race): boolean;
    tryGetRaceByParticipant(participant: PlayerMp): Race | undefined;
    addParticipant(raceId: number, participant: RaceParticipant): boolean;
    removeParticipant(participant: RaceParticipant): boolean;
    removeParticipantByPlayer(player: PlayerMp): boolean;
    prepare(race: Race): void;
    start(race: Race): void;
    finish(participant: RaceParticipant): void;
    finish(race: Race): void;
    countdown(race: Race, countDelay: number): void;
}

export type CachedRaceMap = RaceMap & {
    racePoints: RacePoint[];
    startPoints: RaceStartPoint[];
};

export interface RaceMapCache {
    get(id: number): Promise<Attempt<CachedRaceMap, NotFoundError>>;
}

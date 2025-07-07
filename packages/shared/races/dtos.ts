import type { RaceStatus, RaceType } from './constants';

export interface RaceDto {
    id: number;
    name: string;
    maxParticipants: number;
    participants: number;
    status: number;
}

export interface RaceDetailsDto {
    id: number;
    mapId: number;
    description: string;
    duration: number;
    ghosting: boolean;
    host: string;
    laps?: number;
    participants: RaceParticipantDto[];
    time: string;
    type: number;
    vehicleModels: string[];
    weather: string;
}

export interface RaceParticipantDto {
    id: number;
    name: string;
}

export interface RaceCountdownVehicleDto {
    id?: number;
    model: string;
}

export interface RaceCountdownOwnedVehicleDto {
    id: number;
    model: string;
}

export interface RaceCountdownParticipantDto {
    id: number;
    name: string;
    isHost: boolean;
    isReady: boolean;
    vehicle: RaceCountdownVehicleDto;
}

export interface RaceCountdownDto {
    id: number;
    mapName: string;
    durationSeconds: number;
    vehicles: string[];
    ownedVehicles: RaceCountdownOwnedVehicleDto[];
    participants: RaceCountdownParticipantDto[];
    maxParticipants: number;
}

export interface RaceCreatorDto {
    maps: RaceCreatorMapDto[];
    ipls: string[];
}

export interface RaceCreatorMapDto {
    id: number;
    name: string;
}

export interface RaceCreatorCreateMapDto {
    mapName: string;
    iplName: string;
}

export interface RaceMapDto {
    id: number;
    name: string;
    iplName: string;
    startPoints: SharedRaceStartPoint[];
    racePoints: SharedRacePoint[];
}

export interface SharedRaceStartPoint {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
}

export interface SharedRacePoint {
    position: { x: number; y: number; z: number };
    radius: number;
}

export interface SharedRaceCreatorData {
    id: number;
    name: string;
    iplName: string;
    startPoints: SharedRaceStartPoint[];
    racePoints: SharedRacePoint[];
}

export interface RaceFinishCountdownDto {
    endTime: number;
}

export interface MountScoreboardDto {
    name: string;
    participants: ScoreboardParticipantDto[];
}

export interface ScoreboardParticipantDto {
    name: string;
    team: string;
    timeMs: number;
}

export interface RaceHitDto {
    lap: number;
    index: number;
    nextIndex?: number;
    finished: boolean;
}

export interface RaceHostSubmitDto {
    mapId: number;
    racers: number;
    duration: number;
    countdown: number;
    description: string;
    ghosting: boolean;
    type: string;
    laps?: number;
    time: string;
    exactTime?: string;
    weather: string;
    vehicleName: string;
}

export interface RaceHudDto {
    startTime: number;
    maxLaps: number;
    participants: RaceHudParticipantDto[];
}

export interface RaceHudParticipantDto {
    id: number;
    lap: number;
    name: string;
    distance: number;
    partialDistance: number;
    speedPerHour: number;
}

export interface RaceHudTickDto {
    participants: RaceHudParticipantTickDto[];
}

export interface RaceHudParticipantTickDto {
    id: number;
    lap: number;
    distance: number;
    partialDistance: number;
    speedPerHour: number;
}

export interface RacePrepareDto {
    endTime: number;
    raceType: number;
    dimension: number;
    racePoints: RacePointDto[];
    iplName?: string | null;
    disableLoadingCheckpoint?: boolean;
}

export interface RacePointDto {
    position: Vector3;
    radius: number;
}

export interface RaceStartDto {
    laps: number;
    ghosting: boolean;
}

export interface RaceCollectionDto {
    id: number;
    mapName: string;
    hostName: string;
    racers: number;
    maxRacers: number;
    laps: number;
    ghosting: boolean;
    type: RaceType;
    status: RaceStatus;
}

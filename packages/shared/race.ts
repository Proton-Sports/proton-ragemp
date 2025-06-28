export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface RacePointDto {
    position: Position;
    radius: number;
}

export enum RaceType {
    Laps,
    PointToPoint,
}

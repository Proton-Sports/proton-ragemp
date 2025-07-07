declare type Array2d = [number, number];
declare type Array3d = [number, number, number];
declare type Array4d = [number, number, number, number];
declare type RGB = Array3d;
declare type RGBA = Array4d;

declare type HashOrNumberOrString<T> = T | number | string;
declare type HashOrString<T> = T | string;

declare type KeyValueCollection = { [key: string]: any };

declare interface IVector3 {
    x: number;
    y: number;
    z: number;
}

declare class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number);
    constructor(arr: Array3d);
    constructor(obj: IVector3);

    add(otherVec: Vector3 | number): Vector3;
    angleTo(otherVec: Vector3): number;
    clone(): Vector3;
    cross(otherVec: Vector3): Vector3;
    divide(otherVec: Vector3 | number): Vector3;
    dot(otherVec: Vector3): number;
    equals(otherVec: Vector3): boolean;
    length(): number;
    max(): number;
    min(): number;
    multiply(otherVec: Vector3 | number): Vector3;
    negative(): Vector3;
    subtract(otherVec: Vector3 | number): Vector3;
    toAngles(): Array2d;
    toArray(): Array3d;
    unit(): Vector3;
}

declare class EntityMp {}
declare class PlayerMp extends EntityMp {}
declare class VehicleMp extends EntityMp {}
declare class PedMp extends EntityMp {}
declare class ObjectMp extends EntityMp {}
declare class BlipMp extends EntityMp {}
declare class CheckpointMp extends EntityMp {}
declare class ColshapeMp extends EntityMp {}
declare class MarkerMp extends EntityMp {}
declare class TextLabelMp extends EntityMp {}

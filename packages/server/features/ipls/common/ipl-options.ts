export interface IplOptions {
    entries: IplEntry[];
}

export interface IplEntry {
    name: string;
    position: { x: number; y: number; z: number };
}

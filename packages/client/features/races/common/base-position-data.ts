export abstract class BasePositionData {
    public position: Vector3;
    public blip: BlipMp;

    constructor(position: Vector3, blip: BlipMp) {
        this.position = position;
        this.blip = blip;
    }

    public destroy(): void {
        this.blip.destroy();
    }
}

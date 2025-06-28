import { BasePositionData } from './base-position-data';

export class StartPositionData extends BasePositionData {
    public numberMarker: MarkerMp;
    public boxMarker: MarkerMp;
    public rotation: Vector3;

    constructor(position: Vector3, rotation: Vector3, numberMarker: MarkerMp, boxMarker: MarkerMp, blip: BlipMp) {
        super(position, blip);
        this.rotation = rotation;
        this.numberMarker = numberMarker;
        this.boxMarker = boxMarker;
    }

    public override destroy(): void {
        mp.console.logInfo('StartPositionData destroy');
        super.destroy();
        this.numberMarker.destroy();
        this.boxMarker.destroy();
    }
}

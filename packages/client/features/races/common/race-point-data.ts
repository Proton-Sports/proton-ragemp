import { BasePositionData } from './base-position-data';

export class RacePointData extends BasePositionData {
    public checkpoint: CheckpointMp;

    constructor(position: Vector3, checkpoint: CheckpointMp, blip: BlipMp) {
        super(position, blip);
        this.checkpoint = checkpoint;
    }

    public override destroy(): void {
        mp.console.logInfo('RacePointData destroy');
        super.destroy();
        this.checkpoint.destroy();
    }
}

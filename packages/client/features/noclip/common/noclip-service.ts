export interface NoClipService {
    readonly isStarted: boolean;
    start(): void;
    stop(): void;
}

export const createRageMpNoClipService = () => {
    return new RageMpNoClipService();
};

class RageMpNoClipService implements NoClipService {
    private _isStarted = false;
    private speed = 1.0;
    private renderEventId: number | null = null;

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public start(): void {
        if (this._isStarted) return;

        this._isStarted = true;
        mp.players.local.freezePosition(true);
        mp.players.local.setInvincible(true);
        mp.players.local.setVisible(false, false);
        mp.game.graphics.transitionToBlurred(100);

        // Add render event to handle noclip movement
        this.renderEventId = mp.events.add('render', this.handleNoClipMovement) as unknown as number;
    }

    public stop(): void {
        if (!this._isStarted) return;

        this._isStarted = false;
        mp.players.local.freezePosition(false);
        mp.players.local.setInvincible(false);
        mp.players.local.setVisible(true, false);
        mp.game.graphics.transitionFromBlurred(100);

        // Remove render event
        if (this.renderEventId !== null) {
            mp.events.remove('render', this.handleNoClipMovement);
            this.renderEventId = null;
        }
    }

    private handleNoClipMovement = () => {
        // Disable all game controls except the ones we need
        mp.game.controls.disableAllControlActions(0);

        // Get camera direction
        const camRot = mp.game.cam.getGameplayCamRot(2);
        const camDir = this.rotationToDirection(camRot);
        const position = mp.players.local.position;

        // Set movement speed
        if (mp.game.controls.isDisabledControlPressed(0, 17)) {
            // Control: W
            this.speed += 0.1;
        } else if (mp.game.controls.isDisabledControlPressed(0, 16)) {
            // Control: S
            this.speed -= 0.1;
        }

        // Clamp speed
        this.speed = Math.max(0.1, Math.min(10.0, this.speed));

        // Calculate new position based on controls
        let newPos = position.clone();

        // Forward/backward
        if (mp.game.controls.isDisabledControlPressed(0, 32)) {
            // Control: W
            newPos = new mp.Vector3(
                position.x + camDir.x * this.speed,
                position.y + camDir.y * this.speed,
                position.z + camDir.z * this.speed,
            );
        } else if (mp.game.controls.isDisabledControlPressed(0, 33)) {
            // Control: S
            newPos = new mp.Vector3(
                position.x - camDir.x * this.speed,
                position.y - camDir.y * this.speed,
                position.z - camDir.z * this.speed,
            );
        }

        // Left/right
        if (mp.game.controls.isDisabledControlPressed(0, 34)) {
            // Control: A
            const rightVector = this.getRightVector(camRot);
            newPos = new mp.Vector3(
                newPos.x - rightVector.x * this.speed,
                newPos.y - rightVector.y * this.speed,
                newPos.z - rightVector.z * this.speed,
            );
        } else if (mp.game.controls.isDisabledControlPressed(0, 35)) {
            // Control: D
            const rightVector = this.getRightVector(camRot);
            newPos = new mp.Vector3(
                newPos.x + rightVector.x * this.speed,
                newPos.y + rightVector.y * this.speed,
                newPos.z + rightVector.z * this.speed,
            );
        }

        // Up/down
        if (mp.game.controls.isDisabledControlPressed(0, 44)) {
            // Control: Q
            newPos = new mp.Vector3(newPos.x, newPos.y, newPos.z - this.speed);
        } else if (mp.game.controls.isDisabledControlPressed(0, 38)) {
            // Control: E
            newPos = new mp.Vector3(newPos.x, newPos.y, newPos.z + this.speed);
        }

        // Set new position
        mp.players.local.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, false, false, false);
    };

    private rotationToDirection(rotation: Vector3): Vector3 {
        const z = rotation.z * (Math.PI / 180.0);
        const x = rotation.x * (Math.PI / 180.0);
        const num = Math.abs(Math.cos(x));

        return new mp.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
    }

    private getRightVector(rotation: Vector3): Vector3 {
        const z = rotation.z * (Math.PI / 180.0) + Math.PI / 2.0;
        const x = rotation.x * (Math.PI / 180.0);
        const num = Math.abs(Math.cos(x));

        return new mp.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
    }
}

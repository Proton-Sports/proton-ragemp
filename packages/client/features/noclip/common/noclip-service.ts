import type { ScriptCamera } from '@features/camera/common/types';
import { RageMpScriptCamera } from '@features/camera/ragemp-script-camera';
import type { RaycastData, RaycastService } from '@features/raycast/common/types';

export interface NoClipService {
    readonly isStarted: boolean;
    readonly camera: ScriptCamera | null;
    start(): void;
    stop(): void;
}

export class RageMpNoClipService implements NoClipService {
    #started = false;
    #scriptCamera: RageMpScriptCamera | null = null;

    readonly #raycastService: RaycastService;
    readonly #ActionForward = 32;
    readonly #ActionBackward = 33;
    readonly #ActionLeft = 34;
    readonly #ActionRight = 35;
    readonly #ActionUp = 22;
    readonly #ActionDown = 36;
    readonly #ActionShift = 21;
    readonly #ActionNextCamera = 0;
    #raycasting = false;
    #lastRaycastData: RaycastData | null = null;

    constructor(raycastService: RaycastService) {
        this.#raycastService = raycastService;
    }

    public get camera() {
        return this.#scriptCamera;
    }

    public get isStarted(): boolean {
        return this.#started;
    }

    public start(): void {
        if (this.#started) return;

        this.#started = true;
        mp.players.local.freezePosition(true);
        mp.players.local.setInvincible(true);
        mp.players.local.setVisible(false, false);

        // Create script camera at player position
        const playerPos = mp.players.local.position;
        const gameplayCamRot = mp.game.cam.getGameplayCamRot(2);

        const camera = mp.cameras.new(
            'DEFAULT_SCRIPTED_CAMERA',
            playerPos,
            gameplayCamRot,
            mp.game.cam.getGameplayFov(),
        );
        this.#scriptCamera = new RageMpScriptCamera(camera);
        this.#scriptCamera.active = true;
        this.#scriptCamera.render();

        mp.events.add('render', this.#handleNoClipMovement) as unknown as number;
    }

    public stop(): void {
        if (!this.#started) return;

        this.#started = false;
        mp.players.local.freezePosition(false);
        mp.players.local.setInvincible(false);
        mp.players.local.setVisible(true, false);

        // Clean up script camera
        if (this.#scriptCamera) {
            this.#scriptCamera.unrender();
            this.#scriptCamera.destroy();
            this.#scriptCamera = null;
        }

        mp.events.remove('render', this.#handleNoClipMovement);
    }

    #handleNoClipMovement = () => {
        if (!this.#scriptCamera) return;

        let speed = 1;

        mp.game.controls.disableControlAction(0, this.#ActionForward, true);
        mp.game.controls.disableControlAction(0, this.#ActionBackward, true);
        mp.game.controls.disableControlAction(0, this.#ActionLeft, true);
        mp.game.controls.disableControlAction(0, this.#ActionRight, true);
        mp.game.controls.disableControlAction(0, this.#ActionUp, true);
        mp.game.controls.disableControlAction(0, this.#ActionDown, true);
        mp.game.controls.disableControlAction(0, this.#ActionShift, true);
        mp.game.controls.disableControlAction(0, this.#ActionNextCamera, true);

        // Get camera direction vectors
        const camRot = this.#scriptCamera.rotation;
        const camForward = this.#scriptCamera.forwardVector;
        const camRight = this.#getRightVector2D(camRot.multiply(Math.PI / 180));
        let position = this.#scriptCamera.position.clone();

        if (!this.#raycasting) {
            this.#raycasting = true;
            this.#raycastService
                .raycast(position, position.add(camForward.multiply(1024)))
                .then((raycasted) => {
                    if (raycasted.failed) {
                        return;
                    }
                    this.#lastRaycastData = raycasted.data;
                })
                .finally(() => {
                    this.#raycasting = false;
                });
        }

        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionShift)) speed *= 5;
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionForward))
            position = position.add(camForward.multiply(speed));
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionBackward))
            position = position.subtract(camForward.multiply(speed));
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionLeft))
            position = position.subtract(camRight.multiply(speed));
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionRight))
            position = position.add(camRight.multiply(speed));
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionUp)) position.z += speed;
        if (mp.game.controls.isDisabledControlPressed(0, this.#ActionDown)) position.z -= speed;

        if (this.#lastRaycastData?.isHit === true) {
            mp.game.graphics.drawSphere(
                this.#lastRaycastData.endPosition.x,
                this.#lastRaycastData.endPosition.y,
                this.#lastRaycastData.endPosition.z,
                2,
                255,
                0,
                0,
                255,
            );
        }

        // Handle mouse look
        const mouseX = mp.game.controls.getDisabledControlNormal(1, 1);
        const mouseY = mp.game.controls.getDisabledControlNormal(1, 2);
        const mouseSens = mp.game.gameplay.getProfileSetting(13);

        const finalRot = new mp.Vector3(camRot.x - mouseY * mouseSens, camRot.y, camRot.z - mouseX * mouseSens);

        // Clamp pitch rotation
        if (finalRot.x >= 89) {
            finalRot.x = 89;
        }
        if (finalRot.x <= -89) {
            finalRot.x = -89;
        }

        // Update camera position and rotation
        this.#scriptCamera.position = position;
        this.#scriptCamera.rotation = finalRot;
        mp.players.local.setRotation(finalRot.x, finalRot.y, finalRot.z, 2, true);

        // Keep player at camera position for collision and other systems
        mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
    };

    #getRightVector2D(rotation: Vector3) {
        return new mp.Vector3(Math.cos(rotation.z), Math.sin(rotation.z), 0);
    }
}

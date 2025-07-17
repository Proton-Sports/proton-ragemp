import type { ScriptCamera } from './common/types';

export class RageMpScriptCamera implements ScriptCamera {
    static readonly #ROTATION_ORDER = 2;

    readonly #camera: CameraMp;

    #destroyed = false;

    constructor(camera: CameraMp) {
        this.#camera = camera;
    }

    public get handle() {
        return this.#camera.handle;
    }

    public get active() {
        return this.#camera.isActive();
    }

    public set active(value: boolean) {
        this.#camera.setActive(value);
    }

    public get isRendering() {
        return this.#camera.isRendering();
    }

    public get position() {
        return new mp.Vector3(this.#camera.getCoord());
    }

    public set position(value: Vector3) {
        this.#camera.setCoord(value.x, value.y, value.z);
    }

    public get rotation() {
        return new mp.Vector3(this.#camera.getRot(RageMpScriptCamera.#ROTATION_ORDER));
    }

    public set rotation(value: Vector3) {
        this.#camera.setRot(value.x, value.y, value.z, RageMpScriptCamera.#ROTATION_ORDER);
    }

    public get forwardVector() {
        const rotationInRadians = this.rotation.multiply(Math.PI / 180);
        return convertRotationToForwardVector(rotationInRadians).unit();
    }

    public get fov() {
        return this.#camera.getFov();
    }

    public set fov(value: number) {
        this.#camera.setFov(value);
    }

    public static from(camera: CameraMp) {
        return new RageMpScriptCamera(camera);
    }

    public setActiveWithInterpolation(duration: number, easeLocation: boolean, easeRotation: boolean): void;
    public setActiveWithInterpolation(
        fromCamera: ScriptCamera,
        duration: number,
        easeLocation: boolean,
        easeRotation: boolean,
    ): void;
    public setActiveWithInterpolation(
        durationOrFromCamera: number | ScriptCamera,
        easeLocationOrDuration?: boolean | number,
        easeRotationOrEaseLocation?: boolean,
        easeRotationParam?: boolean,
    ) {
        if (typeof durationOrFromCamera === 'number') {
            // First overload: duration, easeLocation, easeRotation
            const duration = durationOrFromCamera;
            const easeLocation = easeLocationOrDuration as boolean;
            const easeRotation = easeRotationOrEaseLocation as boolean;

            this.#camera.setActiveWithInterp(mp.game.cam.getRendering(), duration, +easeLocation, +easeRotation);
        } else {
            // Second overload: fromCamera, duration, easeLocation, easeRotation
            const fromCamera = durationOrFromCamera;
            const duration = easeLocationOrDuration as number;
            const easeLocation = easeRotationOrEaseLocation as boolean;
            const easeRotation = easeRotationParam as boolean;

            this.#camera.setActiveWithInterp(fromCamera.handle, duration, +easeLocation, +easeRotation);
        }
    }

    public render(): void;
    public render(easeTime: number): void;
    public render(easeTime?: number) {
        if (easeTime !== undefined) {
            this.renderInternal(true, true, easeTime);
        } else {
            this.renderInternal(true, false, 0);
        }
    }

    public unrender(): void;
    public unrender(easeTime: number): void;
    public unrender(easeTime?: number) {
        if (easeTime !== undefined) {
            this.renderInternal(false, true, easeTime);
        } else {
            this.renderInternal(false, false, 0);
        }
    }

    private renderInternal(render: boolean, ease: boolean, easeTime: number) {
        mp.game.cam.renderScriptCams(render, ease, easeTime, false, false, 0);
    }

    public destroy() {
        if (!this.#destroyed) {
            this.active = false;
            this.#destroyed = true;

            if (this.isRendering) {
                this.unrender();
            }
            this.#camera.destroy(true);
        }
    }
}

const convertRotationToForwardVector = (rotation: Vector3) => {
    const x = rotation.x;
    const z = rotation.z;
    return new mp.Vector3(-Math.sin(z) * Math.cos(x), Math.cos(z) * Math.cos(x), Math.sin(x));
};

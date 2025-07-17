export interface ScriptCamera {
    readonly handle: number;
    active: boolean;
    readonly isRendering: boolean;
    position: Vector3;
    rotation: Vector3;
    readonly forwardVector: Vector3;
    fov: number;

    setActiveWithInterpolation(duration: number, easeLocation: boolean, easeRotation: boolean): void;
    setActiveWithInterpolation(
        fromCamera: ScriptCamera,
        duration: number,
        easeLocation: boolean,
        easeRotation: boolean,
    ): void;
    render(): void;
    render(easeTime: number): void;
    unrender(): void;
    unrender(easeTime: number): void;
    destroy(): void;
}

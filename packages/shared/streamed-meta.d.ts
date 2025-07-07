import '@duydang2311/ragemp-utils-meta';

declare module '@duydang2311/ragemp-utils-meta' {
    interface StreamedMetaSchema {
        collision: { toggle: boolean; keepPhysics: boolean };
        vehicleWheel: { type: number; index: number };
    }
}

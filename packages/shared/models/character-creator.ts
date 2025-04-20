export type FaceFeature = {
    index: number;
    value: number;
};

export type FaceOverlay = {
    index: number;
    value: number;
    opacity: number;
    hasColor: boolean;
    firstColor: number;
};

export type Character = {
    id?: number;
    userId?: number;
    characterGender: number;
    faceFather: number;
    faceMother: number;
    skinFather: number;
    skinMother: number;
    skinMix: number;
    faceMix: number;
    eyeColor: number;
    faceFeatures: FaceFeature[];
    faceOverlays: FaceOverlay[];
    hairDrawable: number;
    firstHairColor: number;
    secondHairColor: number;
    facialHair: number;
    firstFacialHairColor: number;
    secondFacialHairColor: number;
    facialHairOpacity: number;
    eyebrows: number;
    eyebrowsColor: number;
};

import { overlays } from './data';

export interface DNAData {
  gender: 'male' | 'female';
  mother: [number];
  father: [number];
  motherSkin: [number];
  fatherSkin: [number];
  faceMix: [number];
  skinMix: [number];
  eyesColor: [number];
}

export interface FaceData {
  noseWidth: [number];
  noseHeight: [number];
  noseLength: [number];
  noseBridge: [number];
  noseTip: [number];
  noseBridgeShaft: [number];
  browHeight: [number];
  browWidth: [number];
  cheekBoneHeight: [number];
  cheekBoneWidth: [number];
  cheekWidth: [number];
  eyeLids: [number];
  lips: [number];
  jawWidth: [number];
  jawHeight: [number];
  chinLength: [number];
  chinPosition: [number];
  chinWidth: [number];
  chinShape: [number];
  neckWidth: [number];
}

export interface OverlayData {
  blemish: [number];
  blemishOpacity: [number];
  ageing: [number];
  ageingOpacity: [number];
  complexion: [number];
  complexionOpacity: [number];
  sunDamage: [number];
  sunDamageOpacity: [number];
  freckles: [number];
  frecklesOpacity: [number];
  bodyBlemish: [number];
  bodyBlemishOpacity: [number];
  blush: [number];
  blushOpacity: [number];
  lipstick: [number];
  lipstickOpacity: [number];
}

export interface HairData {
  hair: [number];
  hairColor1: [number];
  hairColor2: [number];
  facialHair: [number];
  facialHairColor1: [number];
  facialHairColor2: [number];
  facialHairOpacity: [number];
  eyeBrows: [number];
  eyeBrowsColor: [number];
}

export function roundedFloat(values: number[]) {
  return values.map((x) => Math.round(x * 100) / 100);
}

export function dto(dna: DNAData, face: FaceData, overlay: OverlayData, hair: HairData) {
  return {
    characterGender: dna.gender === 'male' ? 1 : 0,
    faceFather: dna.father[0],
    faceMother: dna.mother[0],
    skinFather: dna.fatherSkin[0],
    skinMother: dna.motherSkin[0],
    skinMix: dna.skinMix[0],
    faceMix: dna.faceMix[0],
    eyeColor: dna.eyesColor[0],
    faceFeatures: [
      { index: 0, value: face.noseWidth[0] },
      { index: 1, value: face.noseHeight[0] },
      { index: 2, value: face.noseLength[0] },
      { index: 3, value: face.noseBridge[0] },
      { index: 4, value: face.noseTip[0] },
      { index: 5, value: face.noseBridgeShaft[0] },
      { index: 6, value: face.browHeight[0] },
      { index: 7, value: face.browWidth[0] },
      { index: 8, value: face.cheekBoneHeight[0] },
      { index: 9, value: face.cheekBoneWidth[0] },
      { index: 10, value: face.cheekWidth[0] },
      { index: 11, value: face.eyeLids[0] },
      { index: 12, value: face.lips[0] },
      { index: 13, value: face.jawWidth[0] },
      { index: 14, value: face.jawHeight[0] },
      { index: 15, value: face.chinLength[0] },
      { index: 16, value: face.chinPosition[0] },
      { index: 17, value: face.chinWidth[0] },
      { index: 18, value: face.chinShape[0] },
      { index: 19, value: face.neckWidth[0] },
    ],
    faceOverlays: [
      {
        ...overlays.blemish,
        opacity: overlay.blemishOpacity[0],
        value: overlay.blemish[0],
      },
      overlays.makeup,
      {
        ...overlays.ageing,
        opacity: overlay.ageingOpacity[0],
        value: overlay.ageing[0],
      },
      {
        ...overlays.complexion,
        opacity: overlay.complexionOpacity[0],
        value: overlay.complexion[0],
      },
      {
        ...overlays.sunDamage,
        opacity: overlay.sunDamageOpacity[0],
        value: overlay.sunDamage[0],
      },
      {
        ...overlays.freckles,
        opacity: overlay.frecklesOpacity[0],
        value: overlay.freckles[0],
      },
      {
        ...overlays.bodyBlemish,
        opacity: overlay.bodyBlemishOpacity[0],
        value: overlay.bodyBlemish[0],
      },
      {
        ...overlays.blush,
        opacity: overlay.blushOpacity[0],
        value: overlay.blush[0],
      },
      {
        ...overlays.lipstick,
        opacity: overlay.lipstickOpacity[0],
        value: overlay.lipstick[0],
      },
    ],
    hairDrawable: hair.hair[0],
    firstHairColor: hair.hairColor1[0],
    secondHairColor: hair.hairColor2[0],
    facialHair: hair.facialHair[0],
    firstFacialHairColor: hair.facialHairColor1[0],
    secondFacialHairColor: hair.facialHairColor2[0],
    facialHairOpacity: hair.facialHairOpacity[0],
    eyebrows: hair.eyeBrows[0],
    eyebrowsColor: hair.eyeBrowsColor[0],
  };
}

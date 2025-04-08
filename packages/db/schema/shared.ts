import { pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const banKindEnum = pgEnum('ban_kind', ['discord']);

export const userRoleEnum = pgEnum('user_role', [
  'user',
  'donor',
  'sponsor',
  'moderator',
  'administrator'
]);

export const wheelTypeEnum = pgEnum('wheel_type', [
  'sport',
  'muscle',
  'lowrider',
  'suv',
  'offroad',
  'tuner',
  'bike',
  'hiend',
  'bennys_original',
  'bennys_bespoke'
]);

// Interfaces for complex types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FaceFeature {
  index: number;
  value: number;
}

export interface FaceOverlay {
  index: number;
  value: number;
  opacity: number;
  hasColor: boolean;
  firstColor: number;
}
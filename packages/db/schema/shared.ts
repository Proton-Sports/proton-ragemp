import { pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const banKindEnum = pgEnum('ban_kind', ['discord']);

export const userRoleEnum = pgEnum('user_role', ['user', 'donor', 'sponsor', 'moderator', 'administrator']);

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

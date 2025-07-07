import type { Vector3 } from '@duydang2311/ragemp-utils-shared';
import { relations } from 'drizzle-orm';
import {
    bigint,
    boolean,
    index,
    integer,
    jsonb,
    pgTable,
    primaryKey,
    real,
    serial,
    timestamp,
    unique,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { banKindEnum, userRoleEnum, type FaceFeature, type FaceOverlay, type Rgba } from './shared';

// User-related tables
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().default(''),
    discordId: varchar('discord_id', { length: 255 }).notNull(),
    money: integer('money').notNull().default(0),
    role: userRoleEnum('role').notNull().default('user'),
});

export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    isActive: boolean('is_active').notNull().default(true),
    timestampLogin: timestamp('timestamp_login', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    timestampLogout: timestamp('timestamp_logout', { withTimezone: true, mode: 'date' }),
    ipv4: varchar('ipv4', { length: 45 }).notNull().default(''),
    ipv6: varchar('ipv6', { length: 128 }).notNull().default(''),
    country: varchar('country', { length: 64 }).notNull().default(''),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
});

export const banRecords = pgTable('ban_records', {
    id: serial('id'),
    kind: banKindEnum('kind').notNull(),
    identifier: varchar('identifier', { length: 1024 }).primaryKey(), // Using identifier as PK per configuration
    name: varchar('name', { length: 64 }).notNull(),
});

// Character customization tables
export const characters = pgTable(
    'characters',
    {
        id: serial('id').primaryKey(),
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        characterGender: integer('character_gender').notNull(),
        faceFather: integer('face_father').notNull(),
        faceMother: integer('face_mother').notNull(),
        skinFather: integer('skin_father').notNull(),
        skinMother: integer('skin_mother').notNull(),
        skinMix: real('skin_mix').notNull(),
        faceMix: real('face_mix').notNull(),
        eyeColor: integer('eye_color').notNull(),
        faceFeatures: jsonb('face_features').$type<FaceFeature[]>().notNull().default([]),
        faceOverlays: jsonb('face_overlays').$type<FaceOverlay[]>().notNull().default([]),
        hairDrawable: integer('hair_drawable').notNull(),
        firstHairColor: integer('first_hair_color').notNull(),
        secondHairColor: integer('second_hair_color').notNull(),
        facialHair: integer('facial_hair').notNull(),
        firstFacialHairColor: integer('first_facial_hair_color').notNull(),
        secondFacialHairColor: integer('second_facial_hair_color').notNull(),
        facialHairOpacity: real('facial_hair_opacity').notNull(),
        eyebrows: integer('eyebrows').notNull(),
        eyebrowsColor: integer('eyebrows_color').notNull(),
    },
    (table) => [unique().on(table.userId)],
);

// Vehicle-related tables
export const mods = pgTable(
    'mods',
    {
        id: serial('id').primaryKey(),
        category: integer('category').notNull(),
        name: varchar('name', { length: 64 }).notNull(),
        model: varchar('model', { length: 255 }),
        value: integer('value').notNull(),
        price: integer('price').notNull(),
    },
    (table) => [index().on(table.category), index().on(table.model)],
);

export const wheelVariations = pgTable(
    'wheel_variations',
    {
        id: serial('id').primaryKey(),
        model: varchar('model', { length: 255 }),
        type: integer('type').notNull(),
        name: varchar('name', { length: 64 }).notNull().default(''),
        value: integer('value').notNull(),
        price: integer('price').notNull(),
    },
    (table) => [index().on(table.type), index().on(table.model)],
);

export const stockVehicles = pgTable('stock_vehicles', {
    id: serial('id').primaryKey(),
    displayName: varchar('display_name', { length: 255 }).notNull().default(''),
    model: varchar('model', { length: 255 }).notNull(),
    price: integer('price').notNull(),
    category: varchar('category', { length: 64 }).notNull().default(''),
});

export const playerVehicles = pgTable('player_vehicles', {
    id: serial('id').primaryKey(),
    playerId: integer('player_id')
        .notNull()
        .references(() => users.id),
    vehicleId: integer('vehicle_id').notNull(),
    model: bigint('model', { mode: 'number' }).notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull().default(''),
    price: integer('price').notNull(),
    altVColor: integer('alt_v_color').notNull(),
    category: varchar('category', { length: 64 }).notNull().default(''),
    purchasedDate: timestamp('purchased_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    primaryColor: jsonb('primary_color').$type<Rgba>().notNull(),
    secondaryColor: jsonb('secondary_color').$type<Rgba>().notNull(),
});

export const playerVehicleMods = pgTable(
    'player_vehicle_mods',
    {
        id: serial('id').primaryKey(),
        modId: integer('mod_id')
            .notNull()
            .references(() => mods.id),
        playerVehicleId: integer('player_vehicle_id')
            .notNull()
            .references(() => playerVehicles.id),
    },
    (table) => [unique().on(table.playerVehicleId, table.modId)],
);

export const playerVehicleActiveMods = pgTable('player_vehicle_active_mods', {
    playerVehicleModId: integer('player_vehicle_mod_id')
        .primaryKey()
        .references(() => playerVehicleMods.id),
});

export const playerVehicleWheelVariations = pgTable(
    'player_vehicle_wheel_variations',
    {
        id: serial('id').primaryKey(),
        wheelVariationId: integer('wheel_variation_id')
            .notNull()
            .references(() => wheelVariations.id),
        playerVehicleId: integer('player_vehicle_id')
            .notNull()
            .references(() => playerVehicles.id),
    },
    (table) => [unique().on(table.playerVehicleId, table.wheelVariationId)],
);

export const playerVehicleActiveWheelVariations = pgTable('player_vehicle_active_wheel_variations', {
    playerVehicleWheelVariationId: integer('player_vehicle_wheel_variation_id')
        .primaryKey()
        .references(() => playerVehicleWheelVariations.id),
});

// Clothing-related tables
export const clothes = pgTable('clothes', {
    id: serial('id').primaryKey(),
    isDlc: boolean('is_dlc').notNull(),
    isProp: boolean('is_prop').notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull().default(''),
    component: integer('component').notNull().default(0),
    drawable: integer('drawable').notNull(),
    texture: integer('texture').notNull(),
    palette: integer('palette').notNull(),
    dlcName: varchar('dlc_name', { length: 255 }).notNull().default(''),
    price: integer('price').notNull(),
    category: varchar('category', { length: 64 }).notNull().default(''),
});

export const closets = pgTable('closets', {
    id: serial('id').primaryKey(),
    ownerId: integer('owner_id')
        .notNull()
        .references(() => users.id),
    clothId: integer('cloth_id')
        .notNull()
        .references(() => clothes.id),
    isEquiped: boolean('is_equiped').notNull().default(false),
    purchaseTimestamp: timestamp('purchase_timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Race-related tables
export const raceMaps = pgTable('race_maps', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 64 }).notNull().default(''),
    iplName: varchar('ipl_name', { length: 64 }),
});

export const racePoints = pgTable(
    'race_points',
    {
        mapId: integer('map_id')
            .notNull()
            .references(() => raceMaps.id),
        index: integer('index').notNull(),
        position: jsonb('position').$type<Vector3>().notNull(),
        radius: real('radius').notNull(),
    },
    (table) => [primaryKey({ columns: [table.mapId, table.index] })],
);

export const raceStartPoints = pgTable(
    'race_start_points',
    {
        mapId: integer('map_id')
            .notNull()
            .references(() => raceMaps.id),
        index: integer('index').notNull(),
        position: jsonb('position').$type<Vector3>().notNull(),
        rotation: jsonb('rotation').$type<Vector3>().notNull(),
    },
    (table) => [primaryKey({ columns: [table.mapId, table.index] })],
);

export const userRaceRestorations = pgTable('user_race_restorations', {
    userId: integer('user_id')
        .primaryKey()
        .references(() => users.id),
    raceId: uuid('race_id').notNull(),
    lap: integer('lap').notNull(),
    accumulatedDistance: real('accumulated_distance').notNull(),
    partialDistance: real('partial_distance').notNull(),
    nextRacePointIndex: integer('next_race_point_index'),
    finishTime: timestamp('finish_time', { withTimezone: true, mode: 'date' }).notNull(),
    x: real('x').notNull(),
    y: real('y').notNull(),
    z: real('z').notNull(),
    heading: real('heading').notNull(),
    vehicleModel: bigint('vehicle_model', { mode: 'number' }).notNull(),
});

export const userRacePointRestorations = pgTable(
    'user_race_point_restorations',
    {
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        lap: integer('lap').notNull(),
        index: integer('index').notNull(),
        time: timestamp('time', { withTimezone: true, mode: 'date' }).notNull(),
    },
    (table) => [primaryKey({ columns: [table.userId, table.lap, table.index] })],
);

export const closetsRelations = relations(closets, ({ one }) => ({
    clothItem: one(clothes, {
        fields: [closets.clothId],
        references: [clothes.id],
    }),
}));

export const raceMapsRelations = relations(raceMaps, ({ many }) => ({
    racePoints: many(racePoints),
    startPoints: many(raceStartPoints),
}));

export const racePointsRelations = relations(racePoints, ({ one }) => ({
    map: one(raceMaps, {
        fields: [racePoints.mapId],
        references: [raceMaps.id],
    }),
}));

export const raceStartPointsRelations = relations(raceStartPoints, ({ one }) => ({
    map: one(raceMaps, {
        fields: [raceStartPoints.mapId],
        references: [raceMaps.id],
    }),
}));

export const playerVehiclesRelations = relations(playerVehicles, ({ many, one }) => ({
    user: one(users, {
        fields: [playerVehicles.playerId],
        references: [users.id],
    }),
    mods: many(playerVehicleMods),
    activeMods: many(playerVehicleActiveMods),
    wheelVariations: many(playerVehicleWheelVariations),
    activeWheelVariations: many(playerVehicleActiveWheelVariations),
}));

export const modsRelations = relations(mods, ({ many }) => ({
    playerVehicleMods: many(playerVehicleMods),
}));

export const wheelVariationsRelations = relations(wheelVariations, ({ many }) => ({
    playerVehicleWheelVariations: many(playerVehicleWheelVariations),
}));

export const playerVehicleActiveModsRelations = relations(playerVehicleActiveMods, ({ one }) => ({
    playerVehicleMod: one(playerVehicleMods, {
        fields: [playerVehicleActiveMods.playerVehicleModId],
        references: [playerVehicleMods.id],
    }),
}));

export const playerVehicleModsRelations = relations(playerVehicleMods, ({ one }) => ({
    mod: one(mods, {
        fields: [playerVehicleMods.modId],
        references: [mods.id],
    }),
    playerVehicle: one(playerVehicles, {
        fields: [playerVehicleMods.playerVehicleId],
        references: [playerVehicles.id],
    }),
}));

export const playerVehicleWheelVariationsRelations = relations(playerVehicleWheelVariations, ({ one }) => ({
    wheelVariation: one(wheelVariations, {
        fields: [playerVehicleWheelVariations.wheelVariationId],
        references: [wheelVariations.id],
    }),
    playerVehicle: one(playerVehicles, {
        fields: [playerVehicleWheelVariations.playerVehicleId],
        references: [playerVehicles.id],
    }),
}));

export const playerVehicleActiveWheelVariationsRelations = relations(playerVehicleActiveWheelVariations, ({ one }) => ({
    playerVehicleWheelVariation: one(playerVehicleWheelVariations, {
        fields: [playerVehicleActiveWheelVariations.playerVehicleWheelVariationId],
        references: [playerVehicleWheelVariations.id],
    }),
}));

export type RaceMap = typeof raceMaps.$inferSelect;
export type RacePoint = typeof racePoints.$inferSelect;
export type RaceStartPoint = typeof raceStartPoints.$inferSelect;

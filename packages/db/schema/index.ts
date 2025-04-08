import {
    pgTable,
    serial,
    text,
    integer,
    bigint,
    boolean,
    timestamp,
    varchar,
    real,
    jsonb,
    primaryKey,
    uuid,
    unique,
    index,
} from 'drizzle-orm/pg-core';
import {
    banKindEnum,
    userRoleEnum,
    wheelTypeEnum,
    type Vector3,
    type Rgba,
    type FaceFeature,
    type FaceOverlay,
} from './shared';

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
    timestampLogin: timestamp('timestamp_login').notNull().defaultNow(),
    timestampLogout: timestamp('timestamp_logout'),
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
        type: wheelTypeEnum('type').notNull(),
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
    model: varchar('model', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull().default(''),
    price: integer('price').notNull(),
    altVColor: integer('alt_v_color').notNull(),
    category: varchar('category', { length: 64 }).notNull().default(''),
    purchasedDate: timestamp('purchased_date').notNull().defaultNow(),
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
    purchaseTimestamp: timestamp('purchase_timestamp').notNull().defaultNow(),
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
    finishTime: bigint('finish_time', { mode: 'bigint' }).notNull(),
    x: real('x').notNull(),
    y: real('y').notNull(),
    z: real('z').notNull(),
    roll: real('roll').notNull(),
    pitch: real('pitch').notNull(),
    yaw: real('yaw').notNull(),
    vehicleModel: varchar('vehicle_model', { length: 255 }).notNull(),
});

export const userRacePointRestorations = pgTable(
    'user_race_point_restorations',
    {
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        lap: integer('lap').notNull(),
        index: integer('index').notNull(),
        time: timestamp('time').notNull(),
    },
    (table) => [primaryKey({ columns: [table.userId, table.lap, table.index] })],
);

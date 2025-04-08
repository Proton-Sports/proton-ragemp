import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';
import * as schema from './schema';

export type Db = PostgresJsDatabase<typeof schema> & {
    $client: Sql;
};

export const createDb = (connectionString: string) => {
    return drizzle({ schema, connection: connectionString, casing: 'snake_case' });
};

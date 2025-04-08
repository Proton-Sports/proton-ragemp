import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

const a = dotenv.config({ path: ['.env', '.env.local'], override: true });

if (!process.env.DB_CONNECTION_STRING) {
    throw new Error('Missing environment variable: DB_CONNECTION_STRING');
}

export default defineConfig({
    dialect: 'postgresql',
    schema: './schema',
    out: './migrations',
    verbose: true,
    strict: true,
    dbCredentials: {
        url: process.env.DB_CONNECTION_STRING,
    },
});

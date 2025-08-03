import {envConfig} from "./src/config/env.config.js";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/db/migrations',
    schema: "./src/db/schema/schema.ts",
    dialect: 'sqlite',
    dbCredentials: {
        url: envConfig.database.url,
    },
    strict: false,
    verbose: false,
})
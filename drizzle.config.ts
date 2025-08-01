import {database} from "./src/config/index.ts";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/db/migrations',
    schema: "./src/db/schema/index.ts",
    dialect: 'sqlite',
    dbCredentials: {
        url: database.url,
    },
    strict: false,
    verbose: false,
})
// //drizzle kit api uses require instead of import so we need to use createRequire
import {createRequire} from "node:module";
const require = createRequire(import.meta.url);
const {pushSQLiteSchema, generateMigration,generateSQLiteDrizzleJson, generateSQLiteMigration } = require("drizzle-kit/api");
import * as schema from '../db/schema/schema.js';
import {db} from "../db/dbSetup.js";
import { migrate } from "drizzle-orm/libsql/migrator";

export async function migrationsManual() {
   try {
       const migrationConfig = {
           migrationsFolder: "./drizzle"
       }
       return await migrate(db, migrationConfig);
   }catch (e) {
       console.log(e)
   }

}
export async function migrationsPush() {
    try {
        const {apply} = await pushSQLiteSchema(schema, db);
        await apply()
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

// export async function generateDrizzleJson() {
//
//     const [previous, current] = await Promise.all(
//         [{}, schema].map((schemaObject) => generateSQLiteDrizzleJson(schemaObject))
//     );
//
//     const statements = await generateSQLiteMigration(previous, current);
//     const migration = statements.join("\n");
//     console.log(migration);
//     return migration
// }
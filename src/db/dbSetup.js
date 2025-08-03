import 'dotenv/config';
import { envConfig } from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import {drizzle} from 'drizzle-orm/libsql';
import {createClient} from "@libsql/client";
import * as schema from "./schema/schema.js";
import { sql } from 'drizzle-orm'
// Connection
const client = createClient({url: envConfig.database.url});
// Create database instance
export const db = drizzle(client, {schema});


export const initDatabase = async ()=> {
  try {
    // Test the connection //db.execute does not work per https://github.com/drizzle-team/drizzle-orm/issues/1364
      //use run, all, get
     await db.run(`select 1`);
    logger.info("Database connection established successfully", {
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};

// Function to gracefully close the database connections
export const closeDatabase = async ()=> {
  try {
    logger.info("Closing database connections...");
      await client.close();
    logger.info("Database connections closed successfully");
  } catch (error) {
    logger.error("Error closing database connections:", error);
    throw error;
  }
};

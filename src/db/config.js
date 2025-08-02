import 'dotenv/config';
import { database } from "../config/index.js";
import { logger } from "../utils/logger.js";
import {drizzle} from 'drizzle-orm/libsql';
import * as process from "node:process";
import {createClient} from "@libsql/client";
import * as schema from "./schema/schema.js";

// Connection
const client = createClient({url: database.url});
// console.log(database.url)
// Create database instance
export const db = drizzle(client, {schema});

export const initDatabase = async ()=> {
  try {
    // Test the connection
    //   const result = await db.execute('select 1');
    // Log connection pool information
    logger.info("Database connection established successfully", {
    });
    
    // Setup periodic health check for the connection pool
    if (process.env.NODE_ENV === 'production') {
      setInterval(async () => {
        try {
            const result = await db.execute('select 1');
          logger.debug('Connection pool health check passed');
        } catch (error) {
          logger.error('Connection pool health check failed:', error);
        }
      }, 60000); // Check every minute
    }
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

import { database } from "@/config";
import { logger } from "@utils/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Connection string
const connectionString =
  database.url ||
  `postgres://${database.user}:${database.password}@${database.host}:${database.port}/${database.name}`;

export const migrationClient = postgres(connectionString, {
  ssl: database.ssl,
  max: 1,
});

// For query execution
export const queryClient = postgres(connectionString, {
  ssl: database.ssl,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create database instance
export const db = drizzle(queryClient);

export const initDatabase = async (): Promise<void> => {
  try {
    // Test the connection
    await queryClient`SELECT 1`;
    logger.info("Database connection established successfully");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};

import { sql } from "drizzle-orm";
import { uuid as pgUUID } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

// Export UUID type from drizzle
export const uuid = (name: string) => pgUUID(name);

// Add extension to UUID column for default random generation
declare module "drizzle-orm/pg-core" {
  interface PgUuidBuilder<TName extends string> {
    defaultRandom(): PgUuidBuilder<TName>;
  }
}

// Extend the UUID type with defaultRandom method
pgUUID.prototype.defaultRandom = function () {
  return this.default(sql`gen_random_uuid()`);
};

// Helper function to generate a new UUID
export function generateUUID(): string {
  return uuidv4();
}

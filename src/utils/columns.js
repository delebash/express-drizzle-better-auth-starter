// columns.helpers.ts
import * as t from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const timestamps = {
    createdAt: t.text('createdAt')
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: t.text('createdAt')
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
}

import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import {timestamps} from "../../utils/columns.ts";

export const todos = table("todos", {
    id: t.integer('id').primaryKey({ autoIncrement: true }),
  title: t.text("title", { length: 255 }).notNull(),
  description: t.text("description").notNull(),

    completed: t.integer("completed", { mode: "boolean" }).default(true),
    ...timestamps,
    // userId: t.int("user_id").references(() => danusers.id),

});

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;
export type UpdateTodo = Partial<InsertTodo>;

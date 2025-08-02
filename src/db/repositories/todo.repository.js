import { db } from "../config.js";
import { todos } from "../schema/todo.schema.js";
import { eq, desc } from "drizzle-orm";

export class TodoRepository {
  /**
   * Create a new todo
   */
  async create(todo) {
    const [createdTodo] = await db.insert(todos).values(todo).returning();
    return createdTodo;
  }

  /**
   * Get all todos for a specific user
   */
  async findAllByUserId(userId) {
    return db.select().from(todos).where(eq(todos.userId, userId)).orderBy(desc(todos.createdAt));
  }

  /**
   * Get a todo by id
   */
  async findById(id) {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    return todo;
  }

  /**
   * Update a todo
   */
  async update(id, data) {
    const [updatedTodo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return updatedTodo;
  }

  /**
   * Delete a todo
   */
  async delete(id) {
    const [deletedTodo] = await db.delete(todos).where(eq(todos.id, id)).returning();
    return !!deletedTodo;
  }

  /**
   * Toggle todo completion status
   */
  async toggleComplete(id) {
    const todo = await this.findById(id);
    if (!todo) return undefined;
    
    return this.update(id, { completed: !todo.completed });
  }
}

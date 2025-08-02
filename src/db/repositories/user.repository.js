import { db } from "../dbSetup.js";
import { stubs } from "../schema/stub.schema.js";
import { eq, desc } from "drizzle-orm";


export class StubRepository {
    /**
     * Create a new todo
     */
    async create(stub) {
        //destructuring the stub object as returning returns an array
        const [createdStubs] = await db.insert(stubs).values(stub).returning();
        return createdStub;
    }

    /**
     * Get all stubs for a specific user
     */
    async findAllByUserId(userId) {
        return db.select().from(stubs).where(eq(stubs.userId, userId)).orderBy(desc(stubs.createdAt));
    }

    /**
     * Get a stub by id
     */
    async findById(id) {
        const [stub] = await db.select().from(stubs).where(eq(stubs.id, id));
        return stub;
    }

    /**
     * Update a stub
     */
    async update(id, data) {
        const [updatedStub] = await db
            .update(stubs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(stubs.id, id))
            .returning();
        return updatedStub;
    }

    /**
     * Delete a stub
     */
    async delete(id) {
        const [deletedStub] = await db.delete(stubs).where(eq(stubs.id, id)).returning();
        return !!deletedStub;
    }

    /**
     * Toggle stub completion status
     */
    async toggleComplete(id) {
        const stub = await this.findById(id);
        if (!stub) return undefined;

        return this.update(id, { completed: !stub.completed });
    }
}

import { stubRepository } from "../db/repositories/index.js";

export const StuvController = {
    /**
     * Get all  for the authenticated user
     */
    async getAllStubs(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stubs = await stubRepository.findAllByUserId(userId);
            return res.status(200).json(stubs);
        } catch (error) {
            console.error("Error fetching stubs:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    /**
     * Get a stub by ID
     */
    async getStubById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stub = await stubRepository.findById(id);

            if (!stub) {
                return res.status(404).json({ message: "Todo not found" });
            }

            if (stub.userId !== userId) {
                return res.status(403).json({ message: "Forbidden" });
            }

            return res.status(200).json(stub);
        } catch (error) {
            console.error("Error fetching stub:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    /**
     * Create a new stub
     */
    async createStub(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Joi has already validated title and description
            const { title, description } = req.body;

            const stubData = {
                title,
                description,
                userId,
            };

            const newStub = await stubRepository.create(stubData);
            return res.status(201).json(newStub);
        } catch (error) {
            console.error("Error creating stub:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    /**
     * Update a stub
     */
    async updateStub(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stub = await stubRepository.findById(id);

            if (!stub) {
                return res.status(404).json({ message: "Stub not found" });
            }

            if (stub.userId !== userId) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const { title, description, completed } = req.body;
            const updateData = {};

            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (completed !== undefined) updateData.completed = completed;

            const updatedStub = await stubRepository.update(id, updateData);
            return res.status(200).json(updatedStub);
        } catch (error) {
            console.error("Error updating stub:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    /**
     * Delete a stub
     */
    async deleteStub(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stub = await stubRepository.findById(id);

            if (!stub) {
                return res.status(404).json({ message: "Stub not found" });
            }

            if (stub.userId !== userId) {
                return res.status(403).json({ message: "Forbidden" });
            }

            await stubRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Error deleting stub:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    /**
     * Toggle stub completion status
     */
    async toggleStubComplete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stub = await stubRepository.findById(id);

            if (!stub) {
                return res.status(404).json({ message: "Stub not found" });
            }

            if (stub.userId !== userId) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const updatedStub = await stubRepository.toggleComplete(id);
            return res.status(200).json(updatedStub);
        } catch (error) {
            console.error("Error toggling stub completion:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
};

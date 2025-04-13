import { Request, Response } from "express";
import { todoRepository } from "@db/repositories";
import { InsertTodo, UpdateTodo } from "@db/schema/todo.schema";
import { AuthenticatedRequest } from "@/middleware/auth";

export const TodoController = {
  /**
   * Get all todos for the authenticated user
   */
  async getAllTodos(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const todos = await todoRepository.findAllByUserId(userId);
      return res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a todo by ID
   */
  async getTodoById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const todo = await todoRepository.findById(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (todo.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new todo
   */
  async createTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }

      const todoData: InsertTodo = {
        title,
        description,
        userId,
      };

      const newTodo = await todoRepository.create(todoData);
      return res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update a todo
   */
  async updateTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const todo = await todoRepository.findById(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (todo.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { title, description, completed } = req.body;
      const updateData: UpdateTodo = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;

      const updatedTodo = await todoRepository.update(id, updateData);
      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete a todo
   */
  async deleteTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const todo = await todoRepository.findById(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (todo.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await todoRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Toggle todo completion status
   */
  async toggleTodoComplete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const todo = await todoRepository.findById(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (todo.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedTodo = await todoRepository.toggleComplete(id);
      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error toggling todo completion:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

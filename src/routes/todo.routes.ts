import { Router } from "express";
import { TodoController } from "@controllers/todo.controller";
import { verifyToken } from "@middleware/auth";

const router = Router();

// Apply authentication middleware to all todo routes
router.use(verifyToken);

// Get all todos for the authenticated user
router.get("/", TodoController.getAllTodos);

// Get a specific todo by ID
router.get("/:id", TodoController.getTodoById);

// Create a new todo
router.post("/", TodoController.createTodo);

// Update a todo
router.put("/:id", TodoController.updateTodo);

// Delete a todo
router.delete("/:id", TodoController.deleteTodo);

// Toggle todo completion status
router.patch("/:id/toggle", TodoController.toggleTodoComplete);

export default router;

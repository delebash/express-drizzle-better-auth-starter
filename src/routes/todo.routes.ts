import { Router } from "express";
import { TodoController } from "../controllers/todo.controller.ts";
import { verifyToken } from "../middleware/auth.ts";
import { validate } from "../middleware/validation.ts";
import { createTodoSchema, updateTodoSchema } from "../validation/todo.schema.ts";

const router = Router();

// Apply authentication middleware to all todo routes
router.use(verifyToken);

// Get all todos for the authenticated user
router.get("/", TodoController.getAllTodos);

// Get a specific todo by ID
router.get("/:id", TodoController.getTodoById);

// Create a new todo - with validation
router.post("/", validate(createTodoSchema), TodoController.createTodo);

// Update a todo - with validation
router.put("/:id", validate(updateTodoSchema), TodoController.updateTodo);

// Delete a todo
router.delete("/:id", TodoController.deleteTodo);

// Toggle todo completion status
router.patch("/:id/toggle", TodoController.toggleTodoComplete);

export default router;

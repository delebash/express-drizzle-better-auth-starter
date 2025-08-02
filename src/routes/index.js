import { requireRole, verifyToken } from "../middleware/auth.js";
import { Router } from "express";
import todoRoutes from "./todo.routes.js";

const router = Router();

router.use("/todo", todoRoutes);

export default router;

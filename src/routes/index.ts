import { requireRole, verifyToken } from "../middleware/auth.ts";
import { Router } from "express";
import todoRoutes from "./todo.routes.ts";

const router = Router();

router.use("/todo", todoRoutes);

export default router;

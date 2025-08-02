import { requireRole, verifyToken } from "../middleware/authenticated.js";
import { Router } from "express";
import todoRoutes from "./todo.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
})

router.get("/api/boom", function (req, res, next) {
    try {
        throw new Error("Oops! matters are chaotic💥", 400);
    } catch (error) {
        next(error);
    }
});

//Api routes
router.use("/todo", todoRoutes);
router.use('/me', authRoutes);
router.use('/users', userRoutes);


export default router;

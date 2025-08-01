import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/authenticated.js';

const router = Router();
const userController = new UserController();

// Apply authentication middleware to all routes
router.use(verifyToken);

//
// router.get('/profile', verifyToken, userController.getProfile);
// router.put('/profile', verifyToken, userController.updateProfile);

export default router;
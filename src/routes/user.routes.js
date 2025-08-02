import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const userController = new UserController();

// Apply authentication middleware to all todo routes
router.use(verifyToken);


router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

export default router;
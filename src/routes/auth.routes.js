import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
// import { validateRegistration, validateLogin } from '../middlewares/validation';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const authController = new AuthController();

// Apply authentication middleware to all todo routes
router.use(verifyToken);

// Additional user session endpoints
router.get('/', authController.me);
router.get('/session', verifyToken, authController.getSession);

export default router;
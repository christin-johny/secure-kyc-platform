import express from 'express';
import { container } from '../container';
import { AuthController } from '../controllers/authController';
import { registerValidation, loginValidation, validateResult } from '../middleware/validator';
import { protect } from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';
import * as ERRORS from '../constants/errors';

const router = express.Router();
const authController = container.resolve(AuthController);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 10, 
  message: { success: false, error: ERRORS.SECURITY.AUTH_RATE_LIMIT }
});

router.post('/register', authLimiter, registerValidation, validateResult, authController.register);
router.post('/login', authLimiter, loginValidation, validateResult, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', protect, authController.getMe);

export default router;

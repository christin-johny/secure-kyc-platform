import express from 'express';
import { container } from '../container';
import { UserController } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const userController = container.resolve(UserController);

router.get('/', protect, userController.getUsers);

export default router;

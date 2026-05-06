import express from 'express';
import multer from 'multer';
import { container } from '../container';
import { KycController } from '../controllers/kycController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const kycController = container.resolve(KycController);

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

router.post(
  '/upload', 
  protect, 
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), 
  kycController.uploadKycArtifacts
);

export default router;

const express = require('express');
const { uploadKycArtifacts } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

router.post(
  '/upload', 
  protect, 
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), 
  uploadKycArtifacts
);

module.exports = router;

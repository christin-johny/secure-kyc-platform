const express = require('express');
const { uploadKycArtifacts } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Configure Multer to intercept multipart/form-data and hold it in RAM!
// Rather than writing the file to disk (which wastes IOPS), we hold it in a memory buffer
// so we can stream it immediately and directly to the AWS bucket natively.
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB hard limit for high quality phone videos
});

// Protect route so only authenticated users can upload artifacts to their own profile
router.post(
  '/upload', 
  protect, 
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), 
  uploadKycArtifacts
);

module.exports = router;

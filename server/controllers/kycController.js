const s3Service = require('../services/s3Service');
const User = require('../models/User');

exports.uploadKycArtifacts = async (req, res) => {
  try {
    // req.files is populated automatically by the Multer middleware
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    if (!imageFile && !videoFile) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const updates = {};

    // Stream the Image buffer to AWS if present
    if (imageFile) {
      const imageKey = await s3Service.uploadFileToS3(
        imageFile.buffer, 
        imageFile.mimetype, 
        imageFile.originalname, 
        'kyc/images'
      );
      updates.kycImageKey = imageKey;
    }

    // Stream the Video buffer to AWS if present
    if (videoFile) {
      const videoKey = await s3Service.uploadFileToS3(
        videoFile.buffer, 
        videoFile.mimetype, 
        videoFile.originalname, 
        'kyc/videos'
      );
      updates.kycVideoKey = videoKey;
    }

    // Only save the S3 Keys into MongoDB tracking fields
    await User.findByIdAndUpdate(req.user.id, updates);

    res.status(200).json({ success: true, message: 'KYC data securely stored in AWS S3 and MongoDB keys updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || 'AWS Upload Error' });
  }
};

const s3Service = require('../services/s3Service');
const User = require('../models/User');

exports.uploadKycArtifacts = async (req, res) => {
  try { 
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    if (!imageFile && !videoFile) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const updates = {};

    if (imageFile) {
      const imageKey = await s3Service.uploadFileToS3(
        imageFile.buffer, 
        imageFile.mimetype, 
        imageFile.originalname, 
        'kyc/images'
      );
      updates.kycImageKey = imageKey;
    }

    if (videoFile) {
      const videoKey = await s3Service.uploadFileToS3(
        videoFile.buffer, 
        videoFile.mimetype, 
        videoFile.originalname, 
        'kyc/videos'
      );
      updates.kycVideoKey = videoKey;
    }

    await User.findByIdAndUpdate(req.user.id, updates);

    res.status(200).json({ success: true, message: 'KYC data securely stored in AWS S3 and MongoDB keys updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || 'AWS Upload Error' });
  }
};

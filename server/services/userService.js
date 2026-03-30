const User = require('../models/User');
const s3Service = require('./s3Service');

// SRP: Only handles querying the database with pagination and search logic
exports.getUsersPaginated = async (page = 1, limit = 5, search = '') => {
  // We use regex for a "LIKE" search on Name OR Email, completely case insensitive ($options: 'i')
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  };

  // Skip calculates how many records to jump over based on the current page
  const startIndex = (page - 1) * limit;
  const total = await User.countDocuments(query);
  
  // Sort descending (-1) so latest items show first
  const users = await User.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(limit).select('-password').lean();

  // MAGIC HAPPENS HERE: Dynamically take the raw S3 Key, ping AWS to digitally sign it secretly, and attach it to the response!
  const usersWithS3Urls = await Promise.all(users.map(async (user) => {
    let imageUrl = null;
    let videoUrl = null;
    
    if (user.kycImageKey) {
       imageUrl = await s3Service.getPresignedUrl(user.kycImageKey);
    }
    if (user.kycVideoKey) {
       videoUrl = await s3Service.getPresignedUrl(user.kycVideoKey);
    }

    return {
      ...user,
      kycImageUrl: imageUrl,
      kycVideoUrl: videoUrl
    };
  }));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    data: usersWithS3Urls
  };
};

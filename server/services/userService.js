const User = require('../models/User');
const s3Service = require('./s3Service');

exports.getUsersPaginated = async (page = 1, limit = 5, search = '') => {
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  };
  const startIndex = (page - 1) * limit;
  const total = await User.countDocuments(query);
  
  const users = await User.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(limit).select('-password').lean();

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

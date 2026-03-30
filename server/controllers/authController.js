const authService = require('../services/authService');

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000   
  });
};
 

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     
    const { accessToken, refreshToken } = await authService.registerUser(name, email, password);
    
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ success: true, accessToken });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }
 
    const { accessToken, refreshToken } = await authService.loginUser(email, password);
    
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try { 
    const accessToken = authService.refreshAccessToken(req.cookies.refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

const User = require('../models/User');
const s3Service = require('../services/s3Service');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    
    let imageUrl = null;
    let videoUrl = null;
    
    if (user.kycImageKey) {
       imageUrl = await s3Service.getPresignedUrl(user.kycImageKey);
    }
    if (user.kycVideoKey) {
       videoUrl = await s3Service.getPresignedUrl(user.kycVideoKey);
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...user,
        kycImageUrl: imageUrl,
        kycVideoUrl: videoUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out' });
};

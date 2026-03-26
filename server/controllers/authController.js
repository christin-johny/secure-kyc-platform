const authService = require('../services/authService');

// Helper to set cookie for isolation
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/* 
  Controllers (Handlers) now STRICTLY handle HTTP Requests & Responses.
  They use the imported Service to execute business logic. 
*/

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Abstracted Logic
    const { accessToken, refreshToken } = await authService.registerUser(email, password);
    
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

    // Abstracted Logic
    const { accessToken, refreshToken } = await authService.loginUser(email, password);
    
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    // Abstracted Logic
    const accessToken = authService.refreshAccessToken(req.cookies.refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(403).json({ success: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out' });
};

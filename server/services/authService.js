const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
  return { accessToken, refreshToken };
};

exports.registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  return generateTokens(user._id);
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid credentials');
  }
  return generateTokens(user._id);
};

exports.refreshAccessToken = (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token provided');
  
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  return jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE
  });
};

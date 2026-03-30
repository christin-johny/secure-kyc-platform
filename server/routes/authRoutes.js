const express = require('express');
const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation, validateResult } = require('../middleware/validator');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 10, 
  message: { success: false, error: 'Maximum security threshold reached. Too many login attempts. Try again in 15 minutes.' }
});

router.post('/register', authLimiter, registerValidation, validateResult, register);
router.post('/login', authLimiter, loginValidation, validateResult, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

module.exports = router;

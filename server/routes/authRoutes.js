const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const { registerValidation, loginValidation, validateResult } = require('../middleware/validator');
const router = express.Router();

router.post('/register', registerValidation, validateResult, register);
router.post('/login', loginValidation, validateResult, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;

const { check, validationResult } = require('express-validator');

// Validation rules for Registration
exports.registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
];

// Validation rules for Login
exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Middleware to catch the validation errors and return them
exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If errors exist, stop the request and return 400 Bad Request
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  // If no errors, let the request proceed to the Controller
  next();
};

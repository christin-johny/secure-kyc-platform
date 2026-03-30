const { check, validationResult } = require('express-validator');

exports.registerValidation = [
  check('name', 'Name must be at least 3 characters, contain only letters/spaces, and start with a letter')
    .matches(/^[A-Za-z][A-Za-z\s]{2,}$/),
  check('email', 'Please include a valid email address').isEmail(),
  check('password', 'Password must be 8+ chars and contain 1 uppercase, 1 lowercase, 1 number, and 1 special symbol')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  check('confirmPassword', 'Passwords do not match')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty()
];

exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

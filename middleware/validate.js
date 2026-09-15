const { body, validationResult } = require('express-validator');

/**
 * Validation rules for Task 2 Complex Form and User Registration
 */
const registrationValidationRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Full Name must be between 2 and 100 characters.'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email Address is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone Number is required.')
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{7,15}$/).withMessage('Please enter a valid phone number (7-15 digits).'),

  body('dob')
    .trim()
    .notEmpty().withMessage('Date of Birth is required.')
    .isISO8601().withMessage('Please enter a valid date of birth (YYYY-MM-DD).')
    .custom(value => {
      const dobDate = new Date(value);
      const today = new Date();
      if (dobDate >= today) {
        throw new Error('Date of Birth must be in the past.');
      }
      return true;
    }),

  body('gender')
    .trim()
    .notEmpty().withMessage('Gender selection is required.')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Please select a valid gender option.'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required.')
    .isLength({ min: 5, max: 250 }).withMessage('Address must be at least 5 characters.'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required.')
    .isLength({ min: 2, max: 100 }).withMessage('City name must be at least 2 characters.'),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character.'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  body('termsAccepted')
    .custom(value => {
      if (value === true || value === 'true' || value === 'on' || value === 1 || value === '1') {
        return true;
      }
      throw new Error('You must accept the Terms & Conditions.');
    })
];

/**
 * Middleware to check validation results and handle errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = {};
  errors.array().forEach(err => {
    if (!extractedErrors[err.path]) {
      extractedErrors[err.path] = err.msg;
    }
  });

  // If client expects JSON API response or AJAX fetch request
  if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api/')) {
    return res.status(400).json({
      success: false,
      message: 'Server validation failed. Please check input fields.',
      errors: extractedErrors
    });
  }

  // Otherwise render EJS error view
  return res.status(400).render('error', {
    errorMessage: Object.values(extractedErrors).join(' | ')
  });
};

module.exports = {
  registrationValidationRules,
  validate
};

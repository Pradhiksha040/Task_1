const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registrationValidationRules, validate } = require('../middleware/validate');
const { authLimiter } = require('../config/rateLimiter');

// POST /api/auth/register (Auth rate limited + validated)
router.post('/register', authLimiter, registrationValidationRules, validate, authController.register);

// POST /api/auth/login
router.post('/login', authLimiter, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();
const tempController = require('../controllers/tempController');
const { registrationValidationRules, validate } = require('../middleware/validate');

// Task 2 temporary submission endpoint with server-side validation
router.post('/temp-submit', registrationValidationRules, validate, tempController.handleTempSubmit);

// Task 2 retrieve stored temporary submissions
router.get('/temp-submissions', tempController.getTempSubmissions);

module.exports = router;

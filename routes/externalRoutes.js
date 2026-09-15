const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');

// Task 7 External Weather Proxy Endpoint: GET /api/external/weather
router.get('/external/weather', externalController.getWeather);

// Task 8 Background Job Status Endpoint: GET /api/jobs/:id
router.get('/jobs/:id', externalController.getJobStatus);

module.exports = router;

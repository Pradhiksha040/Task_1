const { fetchWeather } = require('../services/externalService');
const jobQueue = require('../services/jobQueue');

/**
 * Task 7 External API Proxy & Task 8 Job Status Controller
 */

// GET /api/external/weather
exports.getWeather = async (req, res, next) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 40.7128;
    const lon = req.query.lon ? parseFloat(req.query.lon) : -74.0060;

    const weatherData = await fetchWeather(lat, lon);

    return res.status(200).json({
      success: true,
      message: 'Weather data retrieved from external Open-Meteo API via backend proxy',
      data: weatherData
    });
  } catch (err) {
    console.error('External API Fetch Error:', err.message);
    return res.status(502).json({
      success: false,
      message: 'HTTP 502 Bad Gateway: Failed to fetch data from external weather service.',
      error: err.message
    });
  }
};

// GET /api/jobs/:id (Task 8 Background Job Status Check)
exports.getJobStatus = (req, res) => {
  const { id } = req.params;
  const job = jobQueue.getJobStatus(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: `Job not found with ID ${id}`
    });
  }

  return res.status(200).json({
    success: true,
    data: job
  });
};

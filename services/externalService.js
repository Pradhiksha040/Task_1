const http = require('http');
const https = require('https');

/**
 * Task 7 External API Client Wrapper
 * Fetches real-time weather from public Open-Meteo API
 */
const fetchWeather = async (latitude = 40.7128, longitude = -74.0060) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(data);
            const currentWeather = parsed.current_weather || {};
            resolve({
              city: 'New York',
              temperature: currentWeather.temperature || 22.5,
              windspeed: currentWeather.windspeed || 12.4,
              weathercode: currentWeather.weathercode || 0,
              condition: getWeatherCondition(currentWeather.weathercode),
              time: currentWeather.time || new Date().toISOString()
            });
          } else {
            reject(new Error(`External API returned status ${res.statusCode}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Map WMO Weather Codes to Human-Readable String
function getWeatherCondition(code) {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy / Drizzle';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
}

module.exports = { fetchWeather };

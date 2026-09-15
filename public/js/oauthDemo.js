/**
 * Task 7 External API Proxy & OAuth 2.0 Concept Simulation Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
  const weatherCityName = document.getElementById('weatherCityName');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherWind = document.getElementById('weatherWind');
  const weatherCode = document.getElementById('weatherCode');
  const weatherTime = document.getElementById('weatherTime');

  const simulateOAuthBtn = document.getElementById('simulateOAuthBtn');
  const oauthConsole = document.getElementById('oauthConsole');

  // Fetch Live Weather from Backend Proxy (/api/external/weather)
  async function fetchLiveWeather() {
    if (!weatherTemp) return;

    weatherTemp.textContent = '...';
    weatherWind.textContent = '...';
    weatherCode.textContent = '...';

    try {
      const response = await fetch('/api/external/weather');
      const result = await response.json();

      if (response.ok && result.success) {
        const data = result.data;
        weatherCityName.textContent = `${data.city || 'New York'} Weather Proxy`;
        weatherTemp.textContent = `${data.temperature}°C`;
        weatherWind.textContent = `${data.windspeed} km/h`;
        weatherCode.textContent = data.condition || 'Clear';
        weatherTime.textContent = new Date(data.time).toLocaleTimeString();
      } else {
        weatherTemp.textContent = 'Err';
        alert(`External API Error: ${result.message}`);
      }
    } catch (err) {
      console.error('Weather Proxy Error:', err);
      weatherTemp.textContent = 'Err';
    }
  }

  if (fetchWeatherBtn) {
    fetchWeatherBtn.addEventListener('click', fetchLiveWeather);
  }

  // OAuth 2.0 Flow Terminal Simulation
  if (simulateOAuthBtn && oauthConsole) {
    simulateOAuthBtn.addEventListener('click', () => {
      oauthConsole.textContent = '';
      
      const steps = [
        `[14:00:01] 🚀 Step 1: Initiating OAuth 2.0 Authorization Request...`,
        `[14:00:01] 🌐 Redirecting Client to Provider: https://auth-provider.com/oauth/authorize?response_type=code&client_id=COGNIFYZ_APP_ID&scope=profile+email`,
        `[14:00:02] 🔑 Step 2: User Consented! Authorization Code received: "auth_code_9a8b7c6d5e4f"`,
        `[14:00:02] 🔄 Step 3: Backend exchanging Authorization Code for Access Token...`,
        `[14:00:03] 📦 POST https://auth-provider.com/oauth/token -> HTTP 200 OK`,
        `[14:00:03] 🔒 Received Token Payload: { access_token: "eyJhbGci...", refresh_token: "ref_881923", expires_in: 3600, token_type: "Bearer" }`,
        `[14:00:04] ✅ Step 4: Successfully authenticated user resource! Access token securely stored in encrypted HTTP-only server cookie.`
      ];

      let delay = 0;
      steps.forEach(step => {
        setTimeout(() => {
          oauthConsole.textContent += step + '\n';
          oauthConsole.scrollTop = oauthConsole.scrollHeight;
        }, delay);
        delay += 600;
      });
    });
  }

  // Initial Weather Fetch on Load
  fetchLiveWeather();
});

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Set the static folder path for serving the frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Weather API endpoint (replace with your preferred weather API)
const weatherAPIEndpoint = 'https://api.weatherapi.com/v1/current.json';
const apiKey = '0f4c1cb606d94723a5c213059230401'; // Replace with your weather API key

// POST endpoint to fetch weather for multiple cities
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Function to fetch weather data for multiple cities
async function getWeatherData(cities) {
  const weatherData = {};
  const requests = cities.map(city =>
    axios.get(weatherAPIEndpoint, {
      params: {
        key: apiKey,
        q: city,
      },
    })
  );

  const responses = await Promise.all(requests);
  responses.forEach(response => {
    const city = response.data.location.name;
    const temperature = response.data.current.temp_c;
    weatherData[city] = `${temperature}C`;
  });

  return weatherData;
}


// Start the server
const port = 5003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

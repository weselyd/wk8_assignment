const API_KEY = ''; // Replace with your OpenWeatherMap API key

// Call OpenWeatherMap API to get city coordinates
export const owDirectGeocode = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Location lookup failed');
  const data = await response.json();
  if (!data.length) throw new Error('City not found');
  return data;
};

// Call OpenWeatherMap API to get current weather data using coordinates
export const owGetCurrentWeather = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error('Weather data not found');
  return response.json();
};
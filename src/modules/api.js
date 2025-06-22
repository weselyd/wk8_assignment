// Call Netflify geocode API to get city coordinates
export const owDirectGeocode = async (city) => {
  const response = await fetch(
    `https://csc435-wk8assignment.netlify.app/.netlify/functions/geocode?city=${city}`
  );
  if (!response.ok) throw new Error('Location lookup failed');
  const data = await response.json();
  if (!data.length) throw new Error('City not found');
  return data;
};

// Call Netlify weather API to get current weather data using coordinates
export const owGetCurrentWeather = async (lat, lon) => {
  const response = await fetch(
    `https://csc435-wk8assignment.netlify.app/.netlify/functions/weather?lat=${lat}&lon=${lon}`
  );
  if (!response.ok) throw new Error('Weather data not found');
  return response.json();
};
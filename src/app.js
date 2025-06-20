import { owDirectGeocode, owGetCurrentWeather } from './modules/api.js';
import { displayAiAdvice, showWeather, showError, showSunSpinner, addButtonClickEffect } from './modules/ui.js';
import { aiButton } from './modules/events.js';
import { callOpenAI } from './modules/ai.js';
import { BackgroundColorSlider } from './modules/backgroundSlider.js';


document.addEventListener('DOMContentLoaded', () => {
  addButtonClickEffect('button[type="submit"]');
  addButtonClickEffect('#ask-ai-btn');

  const cityInput = document.getElementById('city-input');
  const form = document.getElementById('search-form');

  

  // Create and style the suggestion box, append to body
  let suggestionBox = document.getElementById('location-suggestions');
  if (!suggestionBox) {
    suggestionBox = document.createElement('ul');
    suggestionBox.id = 'location-suggestions';
    // Remove all inline styles, use Tailwind classes
    suggestionBox.className =
      "absolute bg-white text-gray-900 z-50 list-none p-2 m-0 rounded-lg shadow-xl max-h-52 overflow-y-auto w-full border border-gray-200";
    suggestionBox.style.display = 'none';
    document.body.appendChild(suggestionBox);
  }

  // Helper to position the suggestion box under the input
  function positionSuggestionBox() {
    const rect = cityInput.getBoundingClientRect();
    suggestionBox.style.width = rect.width + 'px';
    suggestionBox.style.left = rect.left + window.scrollX + 'px';
    suggestionBox.style.top = rect.bottom + window.scrollY + 'px';
  }

  // Call this whenever suggestions are shown
  function showSuggestions() {
    positionSuggestionBox();
    suggestionBox.style.display = 'block';
  }

  // Hide suggestions
  function hideSuggestions() {
    suggestionBox.style.display = 'none';
  }

  // Update position on scroll/resize/focus
  window.addEventListener('resize', positionSuggestionBox);
  window.addEventListener('scroll', positionSuggestionBox, true);
  cityInput.addEventListener('focus', positionSuggestionBox);

  let debounceTimeout;
  let selectedLocation = null;

  cityInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimeout);
    if (!query) {
      suggestionBox.innerHTML = '';
      hideSuggestions();
      cityInput.removeAttribute('data-lat');
      cityInput.removeAttribute('data-lon');
      return;
    }
    debounceTimeout = setTimeout(async () => {
      try {
        const locations = await owDirectGeocode(query); // Should return an array
        suggestionBox.innerHTML = '';
        if (Array.isArray(locations) && locations.length > 0) {
          locations.slice(0, 5).forEach(loc => {
            const li = document.createElement('li');
            li.textContent = `${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`;
            // Tailwind classes for suggestion items
            li.className =
              "cursor-pointer px-3 py-2 hover:bg-blue-100 rounded transition-colors";
            // Store lat/lon as data attributes on the <li>
            li.dataset.lat = loc.lat;
            li.dataset.lon = loc.lon;
            li.addEventListener('mousedown', async (event) => {
              event.preventDefault();
              cityInput.value = `${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`;
              cityInput.setAttribute('data-lat', loc.lat);
              cityInput.setAttribute('data-lon', loc.lon);
              suggestionBox.innerHTML = '';
              hideSuggestions();
              // Immediately fetch and display weather
              try {
                const weatherData = await owGetCurrentWeather(loc.lat, loc.lon);
                showWeather(loc, weatherData);
              } catch (err) {
                showError();
              }
              aiButton(async (prompt) => {  // Set up AI button to fetch advice based on weather data
              if (!prompt) return;
              const adviceElem = displayAiAdvice();  // Create section for AI advice if it doesn't exist
              showSunSpinner('ai-weather-advice'); // Show rotating sun while loading AI response

              try {
                const aiReponse = await callOpenAI(prompt);  // Call OpenAI API with the prompt
                adviceElem.textContent = aiReponse.output?.[0]?.content?.[0]?.text?.trim() || "No advice received.";
              } catch (error) {  // Handle any errors from the OpenAI API call, log to console, and display a user-friendly message
                console.error('Error fetching AI advice:', error);
                adviceElem.textContent = "Could not get advice from OpenAI";
              }
      });
            });
            suggestionBox.appendChild(li);
          });
          showSuggestions();
        } else {
          hideSuggestions();
          cityInput.removeAttribute('data-lat');
          cityInput.removeAttribute('data-lon');
        }
      } catch (err) {
        suggestionBox.innerHTML = '';
        hideSuggestions();
        cityInput.removeAttribute('data-lat');
        cityInput.removeAttribute('data-lon');
      }
    }, 600); // debounce wait time in ms
  });

  // Hide suggestions when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (!suggestionBox.contains(e.target) && e.target !== cityInput) {
      suggestionBox.innerHTML = '';
      hideSuggestions();
    }
  });

  // On form submit:
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    suggestionBox.innerHTML = '';
    hideSuggestions();

    const lat = cityInput.getAttribute('data-lat');
    const lon = cityInput.getAttribute('data-lon');
    if (lat && lon) {
      try {
        const weatherData = await owGetCurrentWeather(lat, lon);
        showWeather({ lat, lon, name: cityInput.value }, weatherData);
      } catch (err) {
        showError();
      }
    } else {
      // Fallback: do a geocode lookup as before
      const locations = await owDirectGeocode(cityInput.value.trim());
      if (locations && locations.length > 0) {
        const loc = locations[0];
        const weatherData = await owGetCurrentWeather(loc.lat, loc.lon);
        showWeather(loc, weatherData);
      } else {
        showError();
      }
    }
    selectedLocation = null; // reset after use
  });
})
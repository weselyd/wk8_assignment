// Show rotating sun as spinner
export function showSunSpinner(location = 'weather-output') {
  const weatherOutput = document.getElementById(location);
  weatherOutput.innerHTML = `
    <div class="flex justify-center items-center min-h-[48px]">
      <svg class="w-10 h-10 text-yellow-300 drop-shadow-lg animate-spin [animation-duration:3s]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" fill="currentColor"/>
        <g stroke-linecap="round">
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </g>
      </svg>
    </div>
  `;
}
// Show weather data in a styled output section
export const showWeather = ({ name, state, country }, weatherData) => {
  const weatherOutput = document.getElementById('weather-output');
  const temp = Math.round((weatherData.main.temp * 9) / 5 + 32);
  weatherOutput.innerHTML = `
    <div class="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-8 text-center border border-white/40">
      <h2 class="text-2xl font-bold mb-2 text-blue-900 drop-shadow">${name}${state ? ', ' + state : ''}, ${country}</h2>
      <p class="mb-1 text-lg text-yellow-600">Temperature: <span id="weatherTemp" class="font-extrabold text-3xl">${temp}</span>°F</p>
      <p class="mb-4 text-blue-800">Weather: <span id="weatherDesc" class="capitalize font-semibold">${weatherData.weather[0].description}</span></p>
      <button id="ask-ai-btn" type="button"
        class="relative mt-2 px-4 py-2 rounded-md bg-yellow-200 hover:bg-yellow-300 text-blue-900 font-bold shadow transition overflow-hidden"
      >
        <span class="relative z-10">Ask for Weather Advice</span>
        <span class="pointer-events-none absolute left-0 top-0 w-full h-1/2 bg-white/30 rounded-t-md"></span>
      </button>
    </div>
  `;
};

// Show error message when city is not found or API call fails
export const showError = (message = 'Could not find that city.') => {
  document.getElementById('weather-output').innerHTML = `
    <div class="bg-red-400/80 text-white rounded-md p-4 text-center font-semibold shadow">${message}</div>
  `;
};

// Show AI advice section if it doesn't exist
export function displayAiAdvice() {
  let adviceElem = document.getElementById('ai-weather-advice');
  if (!adviceElem) {
    adviceElem = document.createElement('div');
    adviceElem.id = 'ai-weather-advice';
    adviceElem.className = 'mt-4 bg-blue-100/80 text-blue-900 rounded-md p-4 text-center shadow font-medium';
    const btn = document.getElementById('ask-ai-btn');
    if (btn) btn.parentNode.insertBefore(adviceElem, btn.nextSibling);
  }
  return adviceElem;
}

// GSAP button depress animation
export function addButtonClickEffect(selector) {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(selector);
    if (btn) {
      gsap.fromTo(
        btn,
        { scale: 1, y: 0 },
        { scale: 0.78, y: 2, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
    }
  });
}

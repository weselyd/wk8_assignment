export const citySearch = (handler) => {
  document.querySelector('#search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    handler(city);
  });
};

export const aiButton = (handler) => {
  document.getElementById('ask-ai-btn').addEventListener('click', (event) => {
    event.preventDefault();

    const tempElem = document.getElementById('weatherTemp');
    const descElem = document.getElementById('weatherDesc');
    if (!tempElem || !descElem) return null;
    const temperature = tempElem.textContent.trim();
    const description = descElem.textContent.trim();

    const cleanDescription = description.replace(/["'()]/g, "");  // Remove quotes and parentheses for better prompt formatting
    const prompt = `The current temperature is ${temperature} and the weather is described as ${cleanDescription}. In a single sentence, what should I wear today?`;
    handler(prompt);
  });
}
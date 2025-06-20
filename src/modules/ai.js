const OPENAI_KEY = ''; // Replace with your OpenAI API key


// Call OpenAI API to get AI response based on a prompt
export async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      input: `${prompt}`,
    }),
  });
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return data;
}
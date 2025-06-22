// Call Netlify API to get AI response based on a prompt
export async function callOpenAI(prompt) {
  const response = await fetch('https://csc435-wk8assignment.netlify.app/.netlify/functions/advice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: `${prompt}`,
    }),
  });
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return data;
}
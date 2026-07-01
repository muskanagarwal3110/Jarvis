const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function sendQuery(question: string) {
  const response = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'The bot failed to respond.');
  }

  const data = await response.json();
  return data.answer as string;
}

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export async function sendQuery(question: string): Promise<string> {
//   const response = await fetch(`${BASE_URL}/query`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ question }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || 'The bot failed to respond.');
//   }

//   const data: { answer: string } = await response.json();
//   return data.answer;
// }
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function sendQuery(question: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'The bot failed to respond.');
  }

  const data: { answer: string } = await response.json();
  return data.answer;
}

export async function downloadTravelPlanPdf(content: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/query/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate PDF.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'AI_Trip_Planner.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
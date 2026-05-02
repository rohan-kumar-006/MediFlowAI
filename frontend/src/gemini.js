// In browser we must NOT initialize server-side SDKs or expose API keys.
// This module proxies requests to a backend endpoint which holds the API key.

let conversationHistory = [];
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function run(prompt) {
  conversationHistory.push(`User: ${prompt}`);

  try {
    const res = await fetch(`${BACKEND_URL}/api/run_gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: conversationHistory }),
    });

    const data = await res.json();
    const generatedText = data?.text || 'No response available';

    conversationHistory.push(`Agent: ${generatedText}`);
    return generatedText;
  } catch (err) {
    console.error('Error calling backend Gemini proxy:', err);
    return 'Error: failed to get AI response';
  }
}

export default run;

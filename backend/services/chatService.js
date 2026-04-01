const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3";

async function askAI(message) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(message),
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  const data = await response.json();
  return data.response || "No response";
}

function buildPrompt(message) {
  return `
You are an AI Study Assistant.

Rules:
- Answer clearly
- Be concise
- Explain like a tutor
- No fluff

User question:
${message}
`;
}

module.exports = { askAI };
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11500";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

// MAIN FUNCTION
async function extractTopics(text) {
  try {
    const raw = await callOllama(text);

    console.log("OLLAMA RAW:", raw);

    // Try strict JSON parse
    let json = safeJsonParse(raw);

    // Retry once if failed
    if (!json) {
      const retryRaw = await callOllama(text, true);
      json = safeJsonParse(retryRaw);
    }

    if (json && Array.isArray(json.topics)) {
      return cleanTopics(json.topics);
    }

    // Final fallback
    return cleanTopics(fallbackTopics(text));

  } catch (err) {
    console.error("AI ERROR:", err.message);
    return cleanTopics(fallbackTopics(text));
  }
}

// CALL OLLAMA
async function callOllama(text, retry = false) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: buildPrompt(text, retry),
      stream: false,
      options: {
        temperature: 0,
      },
    }),
  });

  const data = await response.json();
  return data.response || "";
}

// STRICT JSON PARSER
function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {}

  // Extract JSON block
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch {}
  }

  return null;
}

// CLEAN TOPICS
function cleanTopics(topics) {
  return [...new Set(
    topics
      .map(t => String(t).replace(/[^a-zA-Z0-9 ]/g, "").trim())
      .filter(t => t.length > 3)
  )];
}

// FIXED FALLBACK (IMPORTANT)
function fallbackTopics(text) {
  return text
    .split(/[\n,]/) // ONLY newline + comma
    .map(t => t.trim())
    .filter(t => t.length > 3);
}

// BETTER PROMPT
function buildPrompt(text, retry = false) {
  return `
You are a strict JSON API.

Return ONLY valid JSON.
Do NOT add explanation.
Do NOT add markdown.
Do NOT add text outside JSON.

If output is invalid, it will be rejected.

FORMAT:
{"topics":["Topic 1","Topic 2","Topic 3"]}

RULES:
- Max 20 topics
- Short names only
- No sentences
- No duplicates

${retry ? "IMPORTANT: Your last response was invalid. Fix it strictly." : ""}

SYLLABUS:
${text.slice(0, 3000)}
`;
}

module.exports = extractTopics;
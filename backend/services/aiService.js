const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractTopics(text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Extract topics from this syllabus.

Return ONLY JSON:
{
  "topics": ["topic1", "topic2"]
}

Syllabus:
${text}`,
    });

    const raw = response.text;

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) return [];

    const parsed = JSON.parse(raw.substring(start, end + 1));

    return parsed.topics || [];
  } catch (err) {
    console.error("AI ERROR:", err);
    return [];
  }
}

module.exports = extractTopics;
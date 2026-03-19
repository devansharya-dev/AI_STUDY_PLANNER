const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractTopics(syllabusText) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Extract topics from the syllabus below.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No extra text
- No markdown

FORMAT:
{
  "topics": ["topic1", "topic2"]
}

SYLLABUS:
${syllabusText}
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON found:", raw);
      return [];
    }

    const cleaned = raw.substring(jsonStart, jsonEnd + 1);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", cleaned);
      return [];
    }

    return Array.isArray(parsed.topics) ? parsed.topics : [];
  } catch (error) {
    console.error("AI ERROR:", error.message);
    return [];
  }
}

module.exports = extractTopics;
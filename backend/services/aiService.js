const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractTopics = async (syllabusText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Convert the following syllabus into a clean JSON list of topics.

Syllabus:
${syllabusText}

Return ONLY valid JSON in this format:
{
  "topics": ["topic1", "topic2", "topic3"]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response.text()

    // Clean response (remove markdown if any)
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    return parsed.topics || []
  } catch (error) {
    console.error("AI Extraction Error:", error)
    return []
  }
};

module.exports = {
  extractTopics
};
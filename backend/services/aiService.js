const axios = require('axios');
require('dotenv').config();

const extractTopics = async (syllabusText) => {
  try {
    const aiApiKey = process.env.AI_API_KEY;

    if (!aiApiKey) {
      // Fallback: Simple line-based extraction if no API key is set
      const topics = syllabusText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.length < 100);
      return topics.slice(0, 10); // Limit to top 10 for safety
    }

    // Example AI call (e.g., Gemini or OpenAI)
    // const response = await axios.post('AI_ENDPOINT', { prompt: `Extract topics from: ${syllabusText}` });
    // return response.data.topics;
    
    // For now, return the mock list but indicate AI is ready
    return syllabusText.split('\n').filter(t => t.trim().length > 0);
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract topics via AI');
  }
};

module.exports = {
  extractTopics
};

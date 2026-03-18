const supabase = require("../config/supabaseClient.js");
const { extractTopics } = require("../services/aiService.js");

const createSyllabus = async (req, res) => {
  try {
    const { title, content } = req.body
    const user_id = req.user.id   // from auth middleware

    // 1. Save syllabus
    const { data: syllabusData, error: syllabusError } = await supabase
      .from("syllabus")
      .insert([{ user_id, title, content }])
      .select()
      .single()

    if (syllabusError) {
      return res.status(400).json({ error: syllabusError.message })
    }

    // 2. Extract topics using AI
    const topics = await extractTopics(content)

    // 3. Store topics in DB
    const topicsToInsert = topics.map((topic) => ({
      syllabus_id: syllabusData.id,
      topic_name: topic,
    }))

    const { error: topicError } = await supabase
      .from("topics")
      .insert(topicsToInsert)

    if (topicError) {
      return res.status(400).json({ error: topicError.message })
    }

    res.json({
      message: "Syllabus created and topics extracted",
      syllabus: syllabusData,
      topics,
    })
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
}

module.exports = {
  createSyllabus
};
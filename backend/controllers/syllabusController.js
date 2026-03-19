const supabase = require("../config/supabaseClient.js");
const extractTopics = require("../services/aiService.js");
const pdfParse = require("pdf-parse");

const createSyllabus = async (req, res) => {
  try {
    let { title, description } = req.body;
    let content = description;

    // safe user (if auth removed for testing)
    const user_id = req.user?.id || null;

    // 📄 Handle file upload
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        const pdfData = await pdfParse(req.file.buffer);
        content = pdfData.text;
      } else {
        content = req.file.buffer.toString("utf-8");
      }

      if (!title) {
        title = req.file.originalname;
      }
    }

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    // ✅ 1. Save syllabus
    const { data: syllabusData, error: syllabusError } = await supabase
      .from("syllabus")
      .insert([
        {
          user_id,
          title,
          description: content,
        },
      ])
      .select()
      .single();

    if (syllabusError) {
      return res.status(400).json({
        error: syllabusError.message,
      });
    }

    // ✅ 2. Extract topics using AI
    const topics = await extractTopics(content);

    console.log("EXTRACTED TOPICS:", topics);

    // ✅ 3. Store topics
    const topicsToInsert = topics.map((topic) => ({
      syllabus_id: syllabusData.id,
      topic: topic,
    }));

    if (topicsToInsert.length > 0) {
      const { error: topicError } = await supabase
        .from("topics")
        .insert(topicsToInsert);

      if (topicError) {
        return res.status(400).json({
          error: topicError.message,
        });
      }
    }

    // ✅ Final response
    res.json({
      message: "Syllabus created and topics extracted",
      syllabus: syllabusData,
      topics,
    });
  } catch (error) {
    console.error("Syllabus Creation Error:", error);

    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};

module.exports = {
  createSyllabus,
};
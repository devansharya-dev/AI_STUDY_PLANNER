const pdfParse = require("pdf-parse");
const { createSyllabusSchema } = require("../validators");
const { upsertSyllabusService } = require("../services/syllabusService");
const axios = require("axios");

const createSyllabus = async (req, res) => {
  try {
    let { title, description } = req.body;
    let content = description || "";

    const user_id = req.user.id; // Use authenticated user ID

    // file handling
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        const pdf = await pdfParse(req.file.buffer);
        content = pdf.text;
      } else {
        content = req.file.buffer.toString("utf-8");
      }

      if (!title) title = req.file.originalname;
    }

    // Ensure title is a string and trimmed to prevent accidental duplicates
    if (title && typeof title === 'string') {
      title = title.trim();
    }

    // Validate request data using Zod
    const validationResult = createSyllabusSchema.safeParse({ title, content });
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.errors.map(e => e.message).join(", ")
      });
    }

    const validData = validationResult.data;

    // Use the service to handle Supabase UPSERT and AI topics
    const result = await upsertSyllabusService(user_id, validData.title, validData.content);

    // Trigger n8n webhook
    try {
      await axios.post("http://localhost:5678/webhook/syllabus-uploaded", {
        userId: user_id,
        syllabusId: result.syllabus_id,
        topicCount: result.topics ? result.topics.length : 0
      });
    } catch (webhookError) {
      console.error("Webhook trigger failed:", webhookError.message);
    }

    res.json({
      success: true,
      message: "Success",
      syllabus: { id: result.syllabus_id },
      syllabus_id: result.syllabus_id,
      topics: result.topics,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createSyllabus,
};
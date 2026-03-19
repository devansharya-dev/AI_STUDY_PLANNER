const supabase = require("../config/supabaseClient");
const extractTopics = require("../services/aiService"); // 👈 SIMPLE IMPORT
const pdfParse = require("pdf-parse");

const createSyllabus = async (req, res) => {
  try {
    let { title, description } = req.body;
    let content = description;

    const user_id = null; // keep simple for now

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

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content required",
      });
    }

    // 🔥 SAVE SYLLABUS
    const { data, error } = await supabase
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

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 🔥 AI CALL
    console.log("Calling AI...");
    const topics = await extractTopics(content);
    console.log("TOPICS:", topics);

    // 🔥 SAVE TOPICS
    if (topics.length > 0) {
      const topicRows = topics.map((t) => ({
        syllabus_id: data.id,
        topic: t,
      }));

      await supabase.from("topics").insert(topicRows);
    }

    res.json({
      message: "Success",
      topics,
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
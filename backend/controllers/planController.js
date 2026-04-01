const planService = require("../services/planService");

const generatePlan = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Accept both formats (fix frontend/backend mismatch)
    const syllabus_id = req.body.syllabus_id || req.body.syllabusId;
    const days = Number(req.body.days) || 7;

    if (!syllabus_id) {
      return res.status(400).json({ error: "syllabus_id is required" });
    }

    if (days < 1 || days > 365) {
      return res.status(400).json({ error: "Invalid number of days" });
    }

    const result = await planService.generateStudyPlan(
      userId,
      syllabus_id,
      { days }
    );

    return res.status(201).json({
      success: true,
      message: "Study plan generated successfully",
      data: result,
    });

  } catch (error) {
    console.error("PLAN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate study plan",
    });
  }
};

module.exports = {
  generatePlan,
};
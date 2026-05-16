const planService = require("../services/planService");

const createPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { syllabus_id, start_date, duration_days } = req.body;
    
    const result = await planService.createStudyPlan(userId, syllabus_id, start_date, duration_days);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'No topics found for this syllabus') {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createPlan,
};
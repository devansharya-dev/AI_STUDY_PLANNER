const planService = require('../services/planService');

const generatePlan = async (req, res) => {
  try {
    const { syllabus_id, ...planData } = req.body;
    const userId = req.user.id;

    if (!syllabus_id) {
      return res.status(400).json({ error: 'syllabus_id is required' });
    }

    const result = await planService.generateStudyPlan(userId, syllabus_id, planData);
    return res.status(201).json({ message: 'Study plan generated successfully', data: result });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error generating plan' });
  }
};

module.exports = {
  generatePlan
};

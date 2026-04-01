const { rescheduleTasks } = require("../services/rescheduleService");

const reschedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body ;

    const result = await rescheduleTasks(userId, planId);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { reschedule };
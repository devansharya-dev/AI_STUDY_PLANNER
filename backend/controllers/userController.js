const userService = require('../services/userService');
const weeklySummaryService = require('../services/weeklySummaryService');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error fetching users' });
  }
};


const getWeeklySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const summary = await weeklySummaryService.getWeeklySummary(userId);
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error generating weekly summary' });
  }
};

const getAllWeeklySummaries = async (req, res) => {
  try {
    const summaries = await weeklySummaryService.getAllWeeklySummaries();
    return res.status(200).json(summaries);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error generating all weekly summaries' });
  }
};

module.exports = {
  getUsers,
  getWeeklySummary,
  getAllWeeklySummaries
};

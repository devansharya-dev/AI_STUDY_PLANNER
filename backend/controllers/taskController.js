const taskService = require('../services/taskService');

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page, limit } = req.query; // Already validated and coerced by Zod
    const tasks = await taskService.getTasks(userId, { status, page, limit });
    
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await taskService.updateTaskStatus(userId, id, status);
    
    if (!updatedTask) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getTasksForAutomation = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    
    const tasks = await taskService.getTasks(userId, { page: 1, limit: 100 });
    return res.status(200).json({ tasks: tasks || [] });
  } catch (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  updateTaskStatus,
  getTasksForAutomation
};

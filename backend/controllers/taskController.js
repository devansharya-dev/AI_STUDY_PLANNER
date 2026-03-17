const taskService = require('../services/taskService');

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasks(userId);
    return res.status(200).json({ data: tasks });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error fetching tasks' });
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { is_completed } = req.body;

    if (typeof is_completed !== 'boolean') {
      return res.status(400).json({ error: 'is_completed (boolean) is required' });
    }

    const task = await taskService.updateTaskCompletion(userId, id, is_completed);
    return res.status(200).json({ message: 'Task updated successfully', data: task });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error updating task' });
  }
};

module.exports = {
  getTasks,
  updateTask
};

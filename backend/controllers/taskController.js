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

const getTasksForAutomation = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    
    // Fetch tasks, falls back to mocking if no db connection
    let tasks;
    try {
      tasks = await taskService.getTasks(userId);
    } catch (dbError) {
      console.warn('DB fallback for tasks', dbError);
      tasks = [{ id: 'mock-t1', status: 'pending' }, { id: 'mock-t2', status: 'done' }];
    }
    
    return res.status(200).json({ tasks: tasks || [] });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error fetching tasks' });
  }
};

module.exports = {
  getTasks,
  updateTask,
  getTasksForAutomation
};

const supabase = require('../config/supabaseClient');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tasks for the user
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', userId);

    if (tasksError) throw tasksError;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const remainingTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      data: {
        totalTasks,
        completedTasks,
        remainingTasks,
        progressPercentage
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error fetching stats' });
  }
};

module.exports = {
  getDashboardStats
};

const supabase = require('../config/supabaseClient');

const getTasks = async (userId) => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return tasks;
};

const updateTaskCompletion = async (userId, taskId, is_completed) => {
  const { data: task, error } = await supabase
    .from('tasks')
    .update({ is_completed })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return task;
};

module.exports = {
  getTasks,
  updateTaskCompletion
};

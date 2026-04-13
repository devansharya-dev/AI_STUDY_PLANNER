const supabase = require('../config/supabaseClient');

const rescheduleTasks = async (userId, planId) => {

  // 1. Get all incomplete tasks
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .eq('is_completed', false)
    .order('due_date', { ascending: true });

  if (error) throw error;

  if (!tasks.length) return { message: "All tasks completed" };

  const today = new Date();

  const updatedTasks = [];

  let dayOffset = 0;
  let dailyCount = 0;
  const MAX_TASKS_PER_DAY = 4;

  tasks.forEach(task => {

    if (dailyCount >= MAX_TASKS_PER_DAY) {
      dayOffset++;
      dailyCount = 0;
    }

    const newDate = new Date();
    newDate.setDate(today.getDate() + dayOffset);

    updatedTasks.push({
      id: task.id,
      due_date: newDate.toISOString()
    });

    dailyCount++;
  });

  // 2. Update in DB
  for (const t of updatedTasks) {
    await supabase
      .from('tasks')
      .update({ due_date: t.due_date })
      .eq('id', t.id)
      .eq('user_id', userId);
  }

  return {
    message: "Tasks rescheduled",
    count: updatedTasks.length
  };
};

module.exports = {
  rescheduleTasks
};
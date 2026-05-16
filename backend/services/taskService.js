const supabase = require('../config/supabaseClient');

const getTasks = async (userId, { status, page, limit }) => {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 10;

  let query = supabase
    .from('tasks')
    .select(`
      id,
      due_date,
      status,
      topics!inner (
        topic
      )
    `)
    .order('due_date', { ascending: true })
    .range((safePage - 1) * safeLimit, safePage * safeLimit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("SUPABASE ERROR:", error);
    throw error;
  }

  console.log("TASKS RAW:", data);

  // Flatten response to return `topic` clearly
  return (data || []).map(task => ({
    id: task.id,
    due_date: task.due_date,
    status: task.status,
    topic: task.topics?.topic || "Unknown Topic",
  }));
};

const updateTaskStatus = async (userId, id, status) => {
  const completed_at = status === 'completed' ? new Date().toISOString() : null;

  // Perform the update
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      status, 
      completed_at 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("SUPABASE ERROR:", error);
    throw error;
  }
  return data;
};

module.exports = {
  getTasks,
  updateTaskStatus
};

const supabase = require('../config/supabaseClient');

const getTasks = async (userId, { status, page, limit }) => {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 50; // Increased default limit to see more tasks

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

const getPendingUsers = async () => {
  const { data: incompleteTasks, error } = await supabase
    .from('tasks')
    .select('user_id')
    .eq('status', 'pending');

  if (error) {
    console.error("SUPABASE ERROR:", error);
    throw error;
  }

  if (!incompleteTasks || incompleteTasks.length === 0) return [];

  const userCounts = incompleteTasks.reduce((acc, task) => {
    acc[task.user_id] = (acc[task.user_id] || 0) + 1;
    return acc;
  }, {});

  const userIds = Object.keys(userCounts);

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  if (profileError) {
    console.error("SUPABASE ERROR:", profileError);
    throw profileError;
  }

  const profileMap = (profiles || []).reduce((acc, p) => {
    acc[p.id] = p.email;
    return acc;
  }, {});

  return userIds.map(userId => ({
    userId,
    email: profileMap[userId] || 'unknown@example.com',
    pendingCount: userCounts[userId]
  }));
};

module.exports = {
  getTasks,
  updateTaskStatus,
  getPendingUsers
};

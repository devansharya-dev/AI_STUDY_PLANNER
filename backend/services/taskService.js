const supabase = require('../config/supabaseClient');
const axios = require('axios');

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
      ),
      study_plans!inner (
        user_id
      )
    `)
    .eq('study_plans.user_id', userId)
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

  // Handle streak logic if task is completed
  if (status === 'completed' && userId) {
    try {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      let current_streak = 1;
      let longest_streak = 1;
      let total_completed_tasks = 1;
      let last_completed_date = todayStr;

      let milestoneHit = false;

      if (stats) {
        total_completed_tasks = (stats.total_completed_tasks || 0) + 1;
        current_streak = stats.current_streak || 0;
        longest_streak = stats.longest_streak || 0;
        last_completed_date = stats.last_completed_date;

        if (last_completed_date !== todayStr) {
          if (last_completed_date) {
            const d1 = new Date(last_completed_date);
            const d2 = new Date(todayStr);
            const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              current_streak += 1;
              longest_streak = Math.max(longest_streak, current_streak);
            } else if (diffDays > 1) {
              current_streak = 1;
            }
          } else {
            current_streak = 1;
            longest_streak = Math.max(longest_streak, current_streak);
          }
          last_completed_date = todayStr;

          const milestones = [3, 7, 14, 30];
          if (milestones.includes(current_streak)) {
            milestoneHit = true;
          }
        } else {
          // Already completed a task today, streak remains the same
          longest_streak = Math.max(longest_streak, current_streak);
        }
      }

      await supabase.from('user_stats').upsert({
        user_id: userId,
        current_streak,
        longest_streak,
        total_completed_tasks,
        last_completed_date
      });

      if (milestoneHit) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .maybeSingle();

        let name = 'Student';
        if (profile && profile.email) {
          const rawName = profile.email.split('@')[0];
          name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }

        try {
          await axios.post('http://localhost:5678/webhook/streak-achievement', {
            userId,
            name,
            streak: current_streak
          });
        } catch (webhookErr) {
          console.error("Webhook trigger failed:", webhookErr.message);
        }
      }
    } catch (streakError) {
      console.error("Error updating streaks:", streakError);
    }
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
    if (task.user_id) {
      acc[task.user_id] = (acc[task.user_id] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.keys(userCounts).map(userId => ({
    userId,
    pendingCount: userCounts[userId]
  }));
};

module.exports = {
  getTasks,
  updateTaskStatus,
  getPendingUsers
};

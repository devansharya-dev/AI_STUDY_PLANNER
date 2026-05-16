const supabase = require('../config/supabaseClient');

const createStudyPlan = async (userId, syllabus_id, start_date, duration_days) => {
  // 1. Fetch topics
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('id, estimated_time')
    .eq('syllabus_id', syllabus_id)
    .order('priority', { ascending: false });

  if (topicsError) throw topicsError;
  if (!topics || topics.length === 0) {
    throw new Error('No topics found for this syllabus');
  }

  // 2. Create Plan
  const { data: plan, error: planError } = await supabase
    .from('study_plans')
    .insert([{ 
      syllabus_id, 
      user_id: userId, 
      start_date: start_date,
      duration_days: duration_days
    }])
    .select()
    .single();

  if (planError) throw planError;
  
  const plan_id = plan.id;

  // 3. Distribute tasks
  const tasksToInsert = [];
  let currentDate = new Date(start_date);
  let currentDayMins = 0;

  for (const topic of topics) {
    const timeRequired = topic.estimated_time || 30; // fallback if null

    if (currentDayMins + timeRequired > 180) {
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
      currentDayMins = 0;
    }
    
    tasksToInsert.push({
      plan_id,
      topic_id: topic.id,
      due_date: new Date(currentDate).toISOString(),
      status: 'pending'
    });
    
    currentDayMins += timeRequired;
  }

  // 4. Insert Tasks
  const { error: insertError } = await supabase
    .from('tasks')
    .insert(tasksToInsert);

  if (insertError) throw insertError;

  return { plan_id, total_tasks: tasksToInsert.length };
};

module.exports = {
  createStudyPlan
};
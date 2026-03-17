const supabase = require('../config/supabaseClient');

const generateStudyPlan = async (userId, syllabusId, planData) => {
  const { start_date = new Date(), duration_days = 7 } = planData;

  // 1. Fetch topics
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('*')
    .eq('syllabus_id', syllabusId)
    .eq('user_id', userId);

  if (topicsError || !topics.length) {
    throw new Error('No topics found for this syllabus');
  }

  // 2. Create study plan
  const { data: plan, error: planError } = await supabase
    .from('study_plans')
    .insert([{
      syllabus_id: syllabusId,
      user_id: userId,
      start_date,
      duration_days
    }])
    .select()
    .single();

  if (planError) throw planError;

  // 3. Simple distribution logic: Assign topics to days
  const tasks = topics.map((topic, index) => {
    const dayOffset = Math.floor(index * (duration_days / topics.length));
    const dueDate = new Date(start_date);
    dueDate.setDate(dueDate.getDate() + dayOffset);

    return {
      plan_id: plan.id,
      topic_id: topic.id,
      user_id: userId,
      title: topic.name || topic.title,
      due_date: dueDate.toISOString(),
      is_completed: false
    };
  });

  // 4. Store tasks
  const { error: tasksError } = await supabase
    .from('tasks')
    .insert(tasks);

  if (tasksError) throw tasksError;

  return { plan, tasksCount: tasks.length };
};

module.exports = {
  generateStudyPlan
};

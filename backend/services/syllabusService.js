const supabase = require('../config/supabaseClient');
const { parsePDF } = require('../utils/fileParser');
const { extractTopics } = require('./aiService');

const createSyllabus = async (userId, syllabusData) => {
  const { title, description, content, file } = syllabusData;
  let finalContent = content || '';

  // If file is provided, parse it
  if (file) {
    if (file.mimetype === 'application/pdf') {
      finalContent = await parsePDF(file.buffer);
    } else {
      finalContent = file.buffer.toString('utf-8');
    }
  }

  // Insert syllabus
  const { data: syllabus, error: syllabusError } = await supabase
    .from('syllabus')
    .insert([{ title, description, content: finalContent, user_id: userId }])
    .select()
    .single();

  if (syllabusError) throw syllabusError;

  // AI Extraction of topics
  const topics = await extractTopics(finalContent);

  // Insert topics
  if (topics && topics.length > 0) {
    const topicsWithIds = topics.map(topicName => ({
      topic_name: topicName,
      syllabus_id: syllabus.id,
      user_id: userId // If your schema allows user_id here for RLS
    }));

    const { error: topicsError } = await supabase
      .from('topics')
      .insert(topicsWithIds);

    if (topicsError) throw topicsError;
  }

  return { ...syllabus, topics };
};

module.exports = {
  createSyllabus
};

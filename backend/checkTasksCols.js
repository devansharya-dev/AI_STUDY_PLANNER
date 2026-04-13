const axios = require('axios');
const supabase = require('./config/supabaseClient');

async function checkTasksCols() {
  const { data, error } = await supabase.from('tasks').select('*').limit(1);
  console.log("Tasks columns:", data ? Object.keys(data[0] || {}) : error.message);
}
checkTasksCols();

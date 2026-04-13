const supabase = require('./config/supabaseClient');

async function testTasks() {
  const { error } = await supabase.from('tasks').select('*').limit(1);
  console.log("Tasks:", error ? error.message : "Exists!");
}

testTasks();

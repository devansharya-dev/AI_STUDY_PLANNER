const supabase = require('./config/supabaseClient');

async function testSupabase() {
  const { data, error } = await supabase.from('study_plans').select('*').limit(1);
  console.log("Select study_plans:", data, error);
}

testSupabase();

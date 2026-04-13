const supabase = require('./config/supabaseClient');

async function test() {
  console.log("Checking study_plan...");
  const { data, error } = await supabase.from('study_plan').select('*').limit(1);
  console.log("study_plan:", error ? error.message : "Exists!");

  console.log("Checking plans...");
  const { data: d2, error: e2 } = await supabase.from('plans').select('*').limit(1);
  console.log("plans:", e2 ? e2.message : "Exists!");

  console.log("Checking study_plans...");
  const { data: d3, error: e3 } = await supabase.from('study_plans').select('*').limit(1);
  console.log("study_plans:", e3 ? e3.message : "Exists!");
}

test();

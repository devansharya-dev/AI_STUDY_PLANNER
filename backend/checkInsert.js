const supabase = require('./config/supabaseClient');

async function testInsert() {
  console.log("Checking insert into study_plans...");
  const { data, error } = await supabase
    .from('study_plans')
    .insert([{
      syllabus_id: 12,
      user_id: "some-uuid",
      start_date: new Date(),
      duration_days: 7
    }])
    .select()
    .single();
    
  console.log("Result:", error ? error.message : "Success!");
}

testInsert();

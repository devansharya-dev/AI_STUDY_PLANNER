const supabase = require('./config/supabaseClient');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function checkCols() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  
  try {
    const res = await axios.get(`${url}/rest/v1/study_plans?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    console.log("Columns if any rows:", res.data.length > 0 ? Object.keys(res.data[0]) : "No rows");
    
    // Also we can query by intentionally putting a bad column and seeing the hint or just fetching the table definition if we use OpenAPI specs
    const res2 = await axios.get(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}` }});
    const def = res2.data.definitions.study_plans;
    if (def && def.properties) {
        console.log("ACTUAL COLUMNS:", Object.keys(def.properties));
    }
  } catch(e) {
    if (e.response) {
      console.log("Err:", e.response.status, e.response.data);
    } else {
      console.log("Err:", e.message);
    }
  }
}

checkCols();

const axios = require('axios');

async function getTables() {
  const url = process.env.SUPABASE_URL || 'https://kiexbxthardwpgcdwssx.supabase.co';
  const key = process.env.SUPABASE_KEY; // I need to read this from backend/.env

  console.log("Loading env...");
  require('dotenv').config({ path: '.env' });
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
      console.log("No supabase url/key");
      return;
  }
  
  try {
     // PostgREST introspection
     const res = await axios.get(`${supabaseUrl}/rest/v1/`, {
         headers: {
             apikey: supabaseKey,
             Authorization: `Bearer ${supabaseKey}`
         }
     });
     // The root of PostgREST gives OpenAPI spec
     console.log("Tables found:");
     Object.keys(res.data.definitions).forEach(table => console.log(table));
  } catch(e) {
     console.error(e.response ? e.response.statusText : e.message);
  }
}
getTables();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY length:', supabaseKey ? supabaseKey.length : 0);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

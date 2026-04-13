const axios = require('axios');
const supabaseUrl = 'https://kiexbxthardwpgcdwssx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJzdXBhYmFzZSIsInJlZiI6ImtpZXhieHRoYXJkd3BnY2R3c3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExMTExMTF9.xxxx'; // I need their anon key. Wait, I will just read it from .env.

async function checkColTypes() {
  require('dotenv').config({ path: '.env' });
  const axios = require('axios');
  const res = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/tasks?select=*&limit=1`, {
    headers: { apikey: process.env.SUPABASE_KEY }
  });
  console.log(res.headers);
}
checkColTypes();

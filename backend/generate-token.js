
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getToken() {
  const email = 'supertest555@gmail.com';
  const password = 'password123';

  console.log('Attempting to sign in...');
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    console.log('Sign in failed or no session, attempting admin sign up...');
    let signUpResult = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (signUpResult.error) {
      console.error('Admin create failed:', signUpResult.error.message);
    } else {
      console.log('Admin create succeeded. Signing in to get token...');
      let signInAgain = await supabase.auth.signInWithPassword({ email, password });
      data = signInAgain.data;
      error = signInAgain.error;
    }
  }

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (!data?.session?.access_token) {
    console.error('No access token returned. You may need email confirmation turned off in Supabase Email limits settings.');
    return;
  }

  console.log('\n--- TOKEN GENERATED ---');
  console.log(`Bearer ${data.session.access_token}`);
  console.log('-----------------------\n');

  const fs = require('fs');
  fs.writeFileSync('token.txt', `Bearer ${data.session.access_token}`);
}

getToken();

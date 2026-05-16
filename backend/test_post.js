const fetch = require('node-fetch');
const fs = require('fs');

async function run() {
  const token = fs.readFileSync('token.txt', 'utf8').trim();
  const res = await fetch('http://localhost:5000/api/syllabus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({
      title: 'Raw Syllabus',
      description: 'This is a test raw syllabus payload'
    })
  });
  
  const data = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

run();

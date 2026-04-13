const axios = require('axios');
const fs = require('fs');

async function testSequence() {
  try {
    const testEmail = "test" + Date.now() + "@gmail.com";
    
    // 1. Signup
    console.log("Signing up...", testEmail);
    const signupRes = await axios.post("http://localhost:5000/api/auth/signup", {
      email: testEmail,
      password: "password123"
    });

    // 2. Login
    console.log("Logging in...");
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: testEmail,
      password: "password123"
    });
    const token = loginRes.data.token;
    console.log("Token received:", token ? "Yes" : "No");

    // 3. Upload Syllabus
    const content = fs.readFileSync("../sample-syllabus-test.txt", "utf8");
    console.log("Uploading syllabus...");
    const sylRes = await axios.post("http://localhost:5000/api/syllabus", 
      { title: "Raw Syllabus", description: content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Syllabus created:", sylRes.data.message, sylRes.data.syllabus.id);

    // 4. Generate Plan
    const syllabus_id = sylRes.data.syllabus.id;
    console.log("Generating plan for syllabus ID:", syllabus_id);
    const planRes = await axios.post("http://localhost:5000/api/plan/generate", 
      { syllabus_id, days: 7 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Plan generated:", planRes.data.success);

  } catch (err) {
    if (err.response) {
      console.error("AXIOS ERROR RESPONSE:", err.response.status, err.response.data);
    } else {
      console.error("ERROR:", err.message);
    }
  }
}

testSequence();

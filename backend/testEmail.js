require('dotenv').config();
const { sendEmail } = require('./services/emailService');

const test = async () => {
  console.log("Testing email functionality (OAuth2)...");
  
  // We will send the test email to whatever you set as TEST_EMAIL or EMAIL_USER
  const recipient = process.env.TEST_EMAIL || process.env.EMAIL_USER;
  
  if (!recipient) {
    console.error("❌ Error: Aapne .env file mein TEST_EMAIL ya EMAIL_USER define nahi kiya.");
    return;
  }

  console.log(`Sending email to: ${recipient}`);

  // Calling our emailService with the object parameter
  const result = await sendEmail({
    to: recipient,
    subject: 'Test Email Subject',
    text: 'This is a test email sent with Nodemailer using OAuth2.',
    html: '<p>This is a test email sent with <b>Nodemailer</b> using OAuth2.</p>'
  });
  
  if (result && result.success) {
    console.log("✅ Email sent successfully! Check your inbox.");
  } else {
    console.error("❌ Failed to send email.", result?.error || "Check your credentials.");
  }
};

test();

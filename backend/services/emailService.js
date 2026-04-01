const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using Nodemailer
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // If auth is not configured, just log to prevent crashes in dev
    if (!process.env.EMAIL_USER) {
      logger.warn(`Email simulated to ${to}. Set EMAIL_USER to actually send.`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"AI Study Planner" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Error sending email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendEmail,
};

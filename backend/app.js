const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const syllabusRoutes = require('./routes/syllabusRoutes');
const planRoutes = require('./routes/planRoutes');
const taskRoutes = require('./routes/taskRoutes');

const rescheduleRoutes = require("./routes/rescheduleRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiting (Scalability & Security)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 150, // Limit each IP to 150 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Stricter limit for API routes
  message: { error: 'Too many API requests, please try again later' },
});

app.use(globalLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reschedule', rescheduleRoutes);
app.use("/api/chat", chatRoutes);

// Simple notification route for n8n integration
const { sendEmail } = require('./services/emailService');
app.post('/api/notify', async (req, res) => {
  console.log("BODY:", req.body);
  const { userId, message } = req.body;
  
  try {
    await sendEmail({
      to: process.env.EMAIL_USER, // sending to admin/default email since no DB lookup
      subject: 'AI Study Planner Notification',
      text: message || 'No message provided',
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
  }

  res.json({ success: true });
});

// Automation Routes
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes.automationRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;

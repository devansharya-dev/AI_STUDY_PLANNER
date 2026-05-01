const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

// Routes
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reschedule', rescheduleRoutes);
app.use("/api/chat", chatRoutes);

// Automation Routes
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes.automationRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;

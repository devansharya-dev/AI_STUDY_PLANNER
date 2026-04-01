require('dotenv').config();
const app = require('./app');
const schedulerService = require('./services/schedulerService');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;

// Initialize background jobs
schedulerService.init();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

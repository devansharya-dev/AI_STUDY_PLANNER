const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, taskController.getTasks);
router.patch('/:id', authMiddleware, taskController.updateTask);

// V1 Automation router (no auth)
const automationRouter = express.Router();
automationRouter.get('/', taskController.getTasksForAutomation);

// Attach it to the main router to export both
router.automationRouter = automationRouter;

module.exports = router;

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { getTasksSchema, updateTaskStatusSchema } = require('../validators');

router.get('/pending', taskController.getPendingUsers);
router.get('/', authMiddleware, validate(getTasksSchema), taskController.getTasks);
router.patch('/:id', authMiddleware, validate(updateTaskStatusSchema), taskController.updateTaskStatus);

// V1 Automation router (no auth)
const automationRouter = express.Router();
automationRouter.get('/', taskController.getTasksForAutomation);

// Attach it to the main router to export both
router.automationRouter = automationRouter;

module.exports = router;

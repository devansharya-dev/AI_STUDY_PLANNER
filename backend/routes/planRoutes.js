const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { createPlanSchema } = require('../validators');

router.post('/generate', authMiddleware, validate(createPlanSchema), planController.createPlan);

module.exports = router;

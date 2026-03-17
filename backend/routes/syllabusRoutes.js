const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, syllabusController.createSyllabus);

module.exports = router;

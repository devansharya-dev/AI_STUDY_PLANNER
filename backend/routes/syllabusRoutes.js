const express = require('express');
const router = express.Router();
const multer = require('multer');
const syllabusController = require('../controllers/syllabusController');
// const authMiddleware = require('../middleware/authMiddleware'); // Temporarily bypassed for testing
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: '00000000-0000-0000-0000-000000000000' }; // mock user ID for Supabase
  next();
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', mockAuthMiddleware, upload.single('file'), syllabusController.createSyllabus);

module.exports = router;

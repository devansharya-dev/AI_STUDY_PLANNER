const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET / => Returns standard list of users for n8n
router.get('/', userController.getUsers);

module.exports = router;

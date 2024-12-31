const express = require('express');
const { home } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Login route
router.post('/home', authMiddleware, home);

module.exports = router;
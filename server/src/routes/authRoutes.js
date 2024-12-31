const express = require('express');
const { login, updatePassword, forgetpassword, verifyotp,resetpassword, getUserData } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Login route
router.post('/login', login);
router.post('/update-password', authMiddleware, updatePassword);
router.get('/user', authMiddleware, getUserData);
router.post('/forget-password', forgetpassword );
router.post('/verify-otp', verifyotp );
router.post('/reset-password', resetpassword );

module.exports = router;
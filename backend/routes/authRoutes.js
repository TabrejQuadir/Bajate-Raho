const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { protect } = require('../middilware/authMiddleware');
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get user data route
router.get('/user', protect, getUser);

module.exports = router;

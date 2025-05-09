const express = require('express');
const { getCategories, getCategoryById } = require('../controllers/categoryContoller');
const router = express.Router();

router.get('/categories', getCategories); // Existing route
router.get('/categories/:id', getCategoryById); // New route for single category

module.exports = router;

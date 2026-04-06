const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get subjects for a category
router.get('/:id/subjects', categoryController.getSubjects);

// Get topics for a subject (mounted on /api/subjects)
// Note: This is a special case — the route is registered in server.js under /api/subjects
// But we keep it here for the category hierarchy

module.exports = router;
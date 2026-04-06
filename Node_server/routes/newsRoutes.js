const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create news (admin)
router.post('/', protect, adminOnly, newsController.createNews);

// Get all news (public)
router.get('/', newsController.getAllNews);

// Delete news (admin)
router.delete('/:id', protect, adminOnly, newsController.deleteNews);

module.exports = router;
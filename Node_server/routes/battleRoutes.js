const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const { protect } = require('../middleware/authMiddleware');

// Create quiz session (1v1 or solo)
router.post('/create', protect, battleController.createSession);

// Get questions for a session
router.get('/:sessionId/questions', protect, battleController.getSessionQuestions);

// Submit answer
router.post('/:sessionId/answer', protect, battleController.submitAnswer);

// Complete session
router.post('/:sessionId/complete', protect, battleController.completeSession);

module.exports = router;

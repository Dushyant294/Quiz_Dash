const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user routes
router.get('/:id', userController.getUserProfile);
router.get('/dashboard/:id', userController.getDashboardData);
router.get('/stats/:id', userController.getUserStats);

module.exports = router;

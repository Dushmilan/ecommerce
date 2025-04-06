const express = require('express');
const router = express.Router();
const verifyToken = require('../Utility/Middleware/Middleware');
const adminController = require('../Controller/AdminController');

// Admin dashboard statistics
router.get('/stats', verifyToken, adminController.getAdminStats);

module.exports = router;

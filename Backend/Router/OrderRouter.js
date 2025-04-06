const express = require('express');
const router = express.Router();
const verifyToken = require('../Utility/Middleware/Middleware');
const orderController = require('../Controller/OrderController');

// Create new order
router.post('/', verifyToken, orderController.createOrder);

// Get order by ID
router.get('/:id', verifyToken, orderController.getOrder);

// Get user's orders
router.get('/myorders', verifyToken, orderController.getUserOrders);

// Get sellers orders
router.get('/sellersorders', verifyToken, orderController.getSellersOrders);

module.exports = router;

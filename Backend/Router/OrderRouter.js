const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders, updateOrderStatus } = require('../Controller/OrderController');

// Create new order
router.post('/', createOrder);

// Get order by ID
router.get('/:id', getOrder);

// Get user's orders
router.get('/myorders', getUserOrders);

// Update order status
router.put('/:id/pay', updateOrderStatus);

module.exports = router;

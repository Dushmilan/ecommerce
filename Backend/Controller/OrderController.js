const Order = require('../Model/OrderModel');
const Product = require('../Model/ProductModel');

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check if products are still available
    for (const item of orderItems) {
      const product = await Product.getProducts(item.productId);
      if (product.length === 0 || product[0].stock < item.quantity) {
        throw new Error(`Product is out of stock`);
      }
    }

    // Create order
    const order = await Order.createOrder(
      req.user.id,
      shippingAddress,
      paymentMethod,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { isPaid, paidAt, isDelivered, deliveredAt } = req.body;
    const updated = await Order.updateOrderStatus(
      req.params.id,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt
    );

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderStatus
};

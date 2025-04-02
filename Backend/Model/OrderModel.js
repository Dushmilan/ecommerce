const db = require('../Database/Sql/Connection');

class OrderModel {
  static async createOrder(userId, shippingAddress, paymentMethod, orderItems, itemsPrice, shippingPrice, taxPrice, totalPrice) {
    try {
      // Start transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Create order
        const [orderResult] = await connection.query(
          'INSERT INTO orders (user_id, shipping_address, payment_method, items_price, shipping_price, tax_price, total_price, is_paid, is_delivered) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)',
          [userId, JSON.stringify(shippingAddress), paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice]
        );

        const orderId = orderResult.insertId;

        // Create order items
        const orderItemsData = orderItems.map(item => [
          orderId,
          item.productId,
          item.name,
          item.quantity,
          item.price,
          item.image
        ]);

        await connection.query(
          'INSERT INTO order_items (order_id, product_id, name, quantity, price, image) VALUES ?',
          [orderItemsData]
        );

        // Update user's order history
        await connection.query(
          'INSERT INTO user_orders (user_id, order_id) VALUES (?, ?)',
          [userId, orderId]
        );

        await connection.commit();

        // Get the complete order with items
        const [order] = await connection.query(
          'SELECT o.*, oi.* FROM orders o ' +
          'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
          'WHERE o.id = ?',
          [orderId]
        );

        connection.release();
        return order;

      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const [results] = await db.query(
        'SELECT o.*, oi.* FROM orders o ' +
        'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
        'WHERE o.id = ?',
        [orderId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getUserOrders(userId) {
    try {
      const [results] = await db.query(
        'SELECT o.*, oi.* FROM orders o ' +
        'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
        'LEFT JOIN user_orders uo ON o.id = uo.order_id ' +
        'WHERE uo.user_id = ?',
        [userId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(orderId, isPaid, paidAt, isDelivered, deliveredAt) {
    try {
      const [results] = await db.query(
        'UPDATE orders SET is_paid = ?, paid_at = ?, is_delivered = ?, delivered_at = ? WHERE id = ?',
        [isPaid, paidAt, isDelivered, deliveredAt, orderId]
      );
      return results.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderModel;

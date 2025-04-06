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
          'INSERT INTO orders (user_id, shipping_address, payment_method, items_price, shipping_price, tax_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
        ]);

        await connection.query(
          'INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES ?',
          [orderItemsData]
        );

        await connection.commit();
        return orderId;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const [order] = await db.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      if (order.length === 0) {
        return null;
      }

      const [items] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [orderId]
      );

      return {
        ...order[0],
        items
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserOrders(userId) {
    try {
      const [results] = await db.query(
        'SELECT o.*, oi.* FROM orders o ' +
        'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
        'WHERE o.user_id = ?',
        [userId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getSellersOrders(userId) {
    try {
      const [results] = await db.query(
        `SELECT o.*, oi.*
        FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE p.seller_id = ?`,
        [userId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderModel;

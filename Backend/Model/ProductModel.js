const db = require('../Database/Sql/Connection');

class ProductModel {
  static async addProduct(name, price, stock, currency, image, sellerId) {
    try {
      const [results] = await db.query(
        'INSERT INTO products (name, price, stock, currency, image, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, stock, currency, image, sellerId]
      );
      return results.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getProducts(sellerId) {
    try {
      const [results] = await db.query(
        'SELECT * FROM products WHERE seller_id = ?',
        [sellerId]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, sellerId, updates) {
    try {
      const [results] = await db.query(
        'UPDATE products SET ? WHERE id = ? AND seller_id = ?',
        [updates, productId, sellerId]
      );
      return results.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(productId, sellerId) {
    try {
      const [results] = await db.query(
        'DELETE FROM products WHERE id = ? AND seller_id   = ?',
        [productId, sellerId]
      );
      return results.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductModel;
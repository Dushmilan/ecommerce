const db = require('../Database/Sql/Connection');

class ProductModel {
  static async addProduct(name, price, stock, currency, image, category, sellerId) {
    try {
        const [results] = await db.query(
          'INSERT INTO products (name, price, stock, currency, image, category, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, price, stock, currency, image, category, sellerId]
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

  static async getUserProducts() {
    try {
      const [results] = await db.query(
        'SELECT * FROM products'
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, sellerId, updates) {
    try {
      // Get the existing product to check ownership
      const [existingProduct] = await db.query(
        'SELECT * FROM products WHERE id = ? AND seller_id = ?',
        [productId, sellerId]
      );

      if (!existingProduct[0]) {
        return false;
      }

      // Prepare the update query and values
      const updateFields = [];
      const values = [];

      // Only update fields that are provided
      if (updates.name) {
        updateFields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.price) {
        updateFields.push('price = ?');
        values.push(updates.price);
      }
      if (updates.stock) {
        updateFields.push('stock = ?');
        values.push(updates.stock);
      }
      if (updates.category) {
        updateFields.push('category = ?');
        values.push(updates.category);
      }
      if (updates.image) {
        updateFields.push('image = ?');
        values.push(updates.image);
        
      }

      // Add the ID and seller ID to the values array
      values.push(productId, sellerId);

      // Construct the update query
      const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ? AND seller_id = ?`;

      const [results] = await db.query(updateQuery, values);
      return results.affectedRows > 0;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id, sellerId) {
    try {
      const [results] = await db.query(
        'DELETE FROM products WHERE id = ? AND seller_id = ?',
        [id, sellerId]
      );

      if (results.affectedRows === 0) {
        return null; // Product not found or not owned by seller
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

module.exports = ProductModel;
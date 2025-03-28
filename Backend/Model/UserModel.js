const db = require('../Database/Sql/Connection');


class UserModel {




  
    static async createUser(name, email, hashedPassword) {
    try {
      // Check if user already exists
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      if (existingUsers.length > 0) {
        throw new Error('User already exists');
      }

      // Create user 
      const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword] 
      );

      return result[0];
    } catch (error) {
      throw error;
    }
  }
  static async createSeller(name, email, password, shopName) {
    try {
      // Check if user already exists
      const [existingUsers] = await db.query(
        'SELECT * FROM sellers WHERE email = ?',
        [email]
      );
      if (existingUsers.length > 0) {
        throw new Error('User already exists');
      }

      // Create seller
      const [result] = await db.query(
        'INSERT INTO sellers (username, email, password, shopName) VALUES (?, ?, ?, ?)',
        [name, email, password, shopName]
      );

      return result[0];
    } catch (error) {
      throw error;
    }
  }
  









  static async findUserByEmail(email) {
    try {
      // First try to find user in users table
      const [users] = await db.query(
        'SELECT id, username, email, password FROM users WHERE LOWER(email) = ?',
        [email]
      );
  
      if (users.length > 0) {
        
        return {
          id: users[0].id,
          username: users[0].username,
          email: users[0].email,
          password: users[0].password,
          role: 'user'
        };
      }
  
      // Try sellers table
      const [sellers] = await db.query(
        'SELECT seller_id, username, email, password, shopname FROM sellers WHERE LOWER(email) = ?',
        [email]
      );
  
      if (sellers.length === 0) {
        return null;
      }
  
      const seller = sellers[0];
      return {
        id: seller.seller_id, 
        username: seller.username,
        email: seller.email,
        password: seller.password,
        role: 'seller',
        shopName: seller.shopname
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;

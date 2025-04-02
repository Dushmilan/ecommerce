const UserModel = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {


  static async UserSignupController(req, res) {
    try {
      const { name, email, password } = req.body;
  
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
  
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        });
      }
  
      // Validate and sanitize name (allow letters, spaces, and hyphens)
      const nameRegex = /^[A-Za-z\s-]+$/;
      if (!nameRegex.test(name)) {
        return res.status(400).json({ error: 'Name can only contain letters, spaces, and hyphens' });
      }
  
      // Check for existing user
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12); // Increased to 12 salt rounds
  
      // Create user
      const userId = await UserModel.createUser(name, email.toLowerCase(), hashedPassword);
  
      // Validate the result
      if (!userId) {
        throw new Error('Failed to create user');
      }
  
      // Send success response
      res.status(201).json({
        message: 'User created successfully',
        user: { id: userId, name, email: email.toLowerCase(), role: 'user' },
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }






  static async SellerSignupController(req, res) {
    try {
      const { name, email, password, shopName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = await UserModel.createSeller(name, email.toLowerCase(), hashedPassword, shopName);
      res.status(201).json({
        message: 'Seller created successfully',
        user: { id: userId, name, email: email.toLowerCase(), shopName }
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Seller signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  




  
static async LoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await UserModel.findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address' });
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password,);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    // construct Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '24h' }
    );
    // send response
    if (user.role === 'user') {
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.username, 
        email: user.email,
        role: user.role,
        
      }
    });
  } 
  else if (user.role === 'seller') {
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.username, 
        email: user.email,
        role: user.role,
        shopName: user.shopName
      }
    });
  }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
}


module.exports = UserController;
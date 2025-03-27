const UserModel = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {
  static async UserSignupController(req, res) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await UserModel.createUser(name, email, hashedPassword);

      res.status(201).json({
        message: 'User created successfully',
        user: { id: userId, name, email }
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static async SellerSignupController(req, res) {
    try {
      const { name, email, password, shopName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.createSeller(name, email, hashedPassword, shopName);
      res.status(201).json({
        message: 'Seller created successfully',
        user: { id: userId, name, email, shopName }
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log the user object right after retrieval
    console.log('User from DB (raw):', user);

    // Construct payload explicitly
    const payload = {
      userId: user.id,
      email: user.email,
      shopName: user.shopName
    };
    console.log('Token Payload:', payload);

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '24h' }
    );

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
}

module.exports = UserController;
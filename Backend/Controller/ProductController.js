const ProductModel = require('../Model/ProductModel');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, currency } = req.body;
    const image = req.file ? `${process.env.IMAGE_URL}/${req.file.filename}` : '';

    // Get seller ID from JWT token
    const sellerId = req.user.id; 
    
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    if (!name || !price || !stock || !currency) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const productId = await ProductModel.addProduct(name, price, stock, currency, image, sellerId);
    res.status(201).json({ 
      message: 'Product added successfully', 
      productId,
      success: true
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      message: 'Error adding product', 
      error: error.message,
      success: false
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    const products = await ProductModel.getProducts(sellerId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    // Get the seller ID from the token
    const sellerId = req.user.id;
    const productId = req.body.id;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Create updates object from request body
    const updates = {
      name: req.body.name,
      price: req.body.price ? Number(req.body.price) : null,
      stock: req.body.stock ? Number(req.body.stock) : null,
      currency: req.body.currency
    };

    // Handle image upload if present
    if (req.file) {
      updates.image = `${process.env.IMAGE_URL}/${req.file.filename}`;
    }

    // Remove undefined fields to avoid overwriting with null values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const updated = await ProductModel.updateProduct(productId, sellerId, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product updated successfully', product: updates });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.deleteProduct(req.body.id, req.user.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get user products
exports.getuserProducts = async (req, res) => {
  try {
    const products = await ProductModel.getUserProducts();
    res.json(products);
  } catch (error) {
    console.error('Error getting user products:', error);
    res.status(500).json({ 
      message: 'Error getting products', 
      error: error.message
    });
  }
};

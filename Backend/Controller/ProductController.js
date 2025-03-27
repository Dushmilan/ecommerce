const ProductModel = require('../Model/ProductModel');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, currency } = req.body;
    const image = req.file ? `/public/images/${req.file.filename}` : '';

    // Get seller ID from JWT token
    const sellerId = req.user.userId; 
    console.log('Seller ID:', sellerId);
    
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
    const sellerId = req.user.userId;
    console.log('Fetching products for seller:', sellerId);
    
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    const products = await ProductModel.getProducts(sellerId);
    console.log('Found products:', products.length);
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
    const product = await ProductModel.updateProduct(req.params.id, req.user.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.deleteProduct(req.params.id, req.user.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

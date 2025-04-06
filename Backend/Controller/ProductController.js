const ProductModel = require('../Model/ProductModel');
const path = require('path');
const fs = require('fs');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, currency, category } = req.body;
    const image = req.file ? `${process.env.IMAGE_URL}/${req.file.filename}` : '';

    // Get seller ID from JWT token
    const sellerId = req.user.id;
    
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    if (!name || !price || !stock || !currency) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const productId = await ProductModel.addProduct(name, price, stock, currency, image, category, sellerId);
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
    const sellerId = req.user.id;
    const productId = req.body.id;
    
     if (!productId) {
      return res.status(400).json({ message: 'Product ID is required', success: false });
    }

    // Get the existing product to check ownership and previous image
    const [existingProduct] = await ProductModel.getProducts(productId, sellerId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized', success: false });
    }

    // Create updates object from request body
    const updates = {
      name: req.body.name,
      price: req.body.price ? Number(req.body.price) : null,
      stock: req.body.stock ? Number(req.body.stock) : null,
      category: req.body.category
    };

    // Handle image upload if present
    if (req.file) {
      updates.image = `${process.env.IMAGE_URL}/${req.file.filename}`;
      
      // Delete previous image if it exists
      if (existingProduct.image) {
        const prevImageName = existingProduct.image.split('/').pop();
        const prevImagePath = path.join(__dirname, `../../uploads/${prevImageName}`);
        try {
          fs.unlinkSync(prevImagePath);
        } catch (err) {
          console.error('Error deleting previous image file:', err);
        }
      }
    }

    // Remove undefined fields to avoid overwriting with null values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const updated = await ProductModel.updateProduct(productId, sellerId, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found or unauthorized', success: false });
    }

    res.json({ 
      message: 'Product updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      message: 'Error updating product',
      error: error.message,
      success: false
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.body.id;
    const sellerId = req.user.userId;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required',
        error: 'Product ID is required in the request body'
      });
    }

    const product = await ProductModel.deleteProduct(id, sellerId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found',
        error: 'Product not found or you do not have permission to delete it'
      });
    }

    res.json({ 
      success: true, 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product',
      error: error.message
    });
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

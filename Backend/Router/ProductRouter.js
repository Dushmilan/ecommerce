const express = require('express');
const router = express.Router();
const verifyToken = require('../Utility/Middleware/Middleware');
const upload = require('../Utility/ImgController/ImgController');
const ProductController = require('../Controller/ProductController');

// Routes with authentication and file upload middleware
router.post('/addproducts', verifyToken, upload.single('image'), ProductController.addProduct);
router.get('/getproducts', verifyToken, ProductController.getProducts);
router.put('/updateproducts', verifyToken,  ProductController.updateProduct,upload.single('image'));
router.delete('/deleteproduct', verifyToken, ProductController.deleteProduct);

// Public route to get all products
router.get('/getuserproducts', ProductController.getuserProducts);

module.exports = router;
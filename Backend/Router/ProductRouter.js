const express = require('express');
const router = express.Router();
const verifyToken = require('../Utility/Middleware/Middleware');
const upload = require('../Utility/ImgController/ImgController');
const ProductController = require('../Controller/ProductController');

// Routes with authentication and file upload middleware
router.post('/addproducts', verifyToken, upload.single('image'), ProductController.addProduct);
router.get('/getproducts', verifyToken, ProductController.getProducts);
router.put('/update/:id', verifyToken, ProductController.updateProduct);
router.delete('/delete/:id', verifyToken, ProductController.deleteProduct);

module.exports = router;
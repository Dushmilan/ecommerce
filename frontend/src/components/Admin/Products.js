import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add, Delete, Remove, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editProductData, setEditProductData] = useState({
    name: '',
    price: '',
    stock: '',
    category: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
  
      const response = await fetch('http://localhost:5000/api/getproducts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }
  
      const data = await response.json();
      
      const formattedProducts = data.map(product => ({
        ...product,
        id: product.id, 
        image: product.image ? `${product.image}` : '/placeholder.jpg',
        maxStock: 100
      }));
  
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('currency', 'USD');
      formData.append('category', productData.category);
      formData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/addproducts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Product added successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        setError('');
        setOpen(false);
        setProductData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: ''
        });
        setImageFile(null);
        fetchProducts();
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleEditOpen = (product) => {
    setEditProductData({
      ...product
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditProductData({
      name: '',
      price: '',
      stock: '',
      category: ''
    });
    setEditImageFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const formData = new FormData();
      formData.append('name', editProductData.name);
      formData.append('price', editProductData.price);
      formData.append('stock', editProductData.stock);
      formData.append('category', editProductData.category);
      formData.append('id', editProductData.id);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }
      console.log(formData);

      const response = await fetch(`http://localhost:5000/api/updateproducts`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update product');
      }

      const data = await response.json().catch(() => ({}));
      if (data.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        setError('');
        handleEditClose();
        fetchProducts();
      } else {
        setError(data.error || data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log(id);
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:5000/api/deleteproduct', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id : id })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to delete product');
      }

      const data = await response.json().catch(() => ({}));
      if (data.success) {
        setSuccess('Product deleted successfully!');
        setError('');
        fetchProducts();
      } else {
        setError(data.error || data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  // Render
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <><TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mx: 1 }}>{product.stock}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                  <Chip label={product.category} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEditOpen(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
               </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    margin="normal"
                  >
                    Upload Image
                  </Button>
                </label>
                {imageFile && (
                  <Typography variant="body2" color="textSecondary" align="center">
                    {imageFile.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="clothing">Clothing</MenuItem>
                    <MenuItem value="books">Books</MenuItem>
                    <MenuItem value="home">Home & Living</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={editProductData.name}
                  onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={editProductData.price}
                  onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={editProductData.stock}
                  onChange={(e) => setEditProductData({ ...editProductData, stock: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file-edit"
                  type="file"
                  onChange={handleEditImageChange}
                />
                <label htmlFor="raised-button-file-edit">
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    margin="normal"
                  >
                    Upload Image
                  </Button>
                </label>
                {editImageFile && (
                  <Typography variant="body2" color="textSecondary" align="center">
                    {editImageFile.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editProductData.category}
                    onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="clothing">Clothing</MenuItem>
                    <MenuItem value="books">Books</MenuItem>
                    <MenuItem value="home">Home & Living</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleEditClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update Product
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default Products;

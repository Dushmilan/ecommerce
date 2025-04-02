import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successProduct, setSuccessProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getuserproducts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSuccessProduct(product);
    setShowSuccess(true);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessProduct(null);
    }, 3000);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h5">Loading products...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Error loading products: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to E-Shop
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Browse our collection of products
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        {showSuccess && successProduct && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Added {successProduct.name} to cart!
          </Alert>
        )}
        
        <Typography variant="h4" gutterBottom>
          All Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image ? `${product.image}` : '/placeholder.jpg'}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    sx={{ mt: 'auto' }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;

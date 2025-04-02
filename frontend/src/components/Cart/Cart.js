import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  IconButton, 
  Badge, 
  Divider 
} from '@mui/material';
import { 
  ShoppingCart, 
  Remove, 
  Add, 
  Delete, 
  ArrowBack 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  if (!cart.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Badge badgeContent={0} color="primary">
            <ShoppingCart sx={{ fontSize: 60 }} />
          </Badge>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            component={Link}
            to="/"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card key={item._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Add />
                        </IconButton>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                    <Typography variant="h6" color="primary">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Items ({cart.length})</Typography>
                <Typography>${getCartTotal().toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${getCartTotal().toFixed(2)}</Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                component={Link}
                to="/checkout"
                sx={{ mt: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Cart;

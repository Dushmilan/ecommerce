  import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import { CheckCircleOutline, ShoppingCart, LocalShipping, Payment } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order || {
    id: 'ORD123456789',
    orderItems: [],
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: ''
    },
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    createdAt: new Date()
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Order Confirmed!
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        Thank you for your order! Your order has been successfully placed.
      </Alert>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleOutline color="success" sx={{ mr: 1 }} />
            <Typography>Order ID: {order.id}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCart sx={{ mr: 1 }} />
            <Typography>Total Amount: ${order.totalPrice.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalShipping sx={{ mr: 1 }} />
            <Typography>
              Shipping Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Payment sx={{ mr: 1 }} />
            <Typography>Payment Status: Paid</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography>Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        {order.orderItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>{item.name} x {item.quantity}</Typography>
            <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          We'll send you an email confirmation shortly with your order details.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')} // Redirect to home page
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default OrderConfirmation;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CreditCard, 
  LocationOn, 
  ShoppingBag,
  LocalShipping,
  Payment,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const steps = ['Shipping Address', 'Payment Information', 'Review Order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: ''
    },
    payment: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart data from URL state or localStorage
  useEffect(() => {
    const cartData = location.state?.cart || JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cartData);
    calculateTotal(cartData);
  }, [location.state]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(total);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShipping()) return;
    if (activeStep === 1 && !validatePayment()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateShipping = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country', 'phone'];
    const isValid = requiredFields.every(field => formData.shipping[field].trim());
    if (!isValid) {
      setError('Please fill in all required shipping fields');
    }
    return isValid;
  };

  const validatePayment = () => {
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const isValid = requiredFields.every(field => formData.payment[field].trim());
    if (!isValid) {
      setError('Please fill in all required payment fields');
    }
    return isValid;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          shippingAddress: {
            address: formData.shipping.address,
            city: formData.shipping.city,
            postalCode: formData.shipping.zip,
            country: formData.shipping.country,
            phone: formData.shipping.phone
          },
          paymentMethod: 'Credit Card',
          orderItems: cartItems.map(item => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          })),
          itemsPrice: total,
          shippingPrice: 0,
          taxPrice: total * 0.18, // 18% tax
          totalPrice: total * 1.18
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      
      // Clear cart and redirect to order confirmation
      localStorage.removeItem('cart');
      navigate('/order-confirmation', { state: { order: data } });
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="First Name"
                fullWidth
                value={formData.shipping.firstName}
                onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                fullWidth
                value={formData.shipping.lastName}
                onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Address"
                fullWidth
                value={formData.shipping.address}
                onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="City"
                fullWidth
                value={formData.shipping.city}
                onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="State/Province"
                fullWidth
                value={formData.shipping.state}
                onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="ZIP/Postal Code"
                fullWidth
                value={formData.shipping.zip}
                onChange={(e) => handleInputChange('shipping', 'zip', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Country"
                fullWidth
                value={formData.shipping.country}
                onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Phone Number"
                fullWidth
                value={formData.shipping.phone}
                onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="Card Number"
                fullWidth
                value={formData.payment.cardNumber}
                onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Expiry Date (MM/YY)"
                fullWidth
                value={formData.payment.expiryDate}
                onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="CVV"
                fullWidth
                value={formData.payment.cvv}
                onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Name on Card"
                fullWidth
                value={formData.payment.cardName}
                onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  {cartItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>{item.name} x {item.quantity}</Typography>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, borderTop: 1, pt: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {getStepContent(activeStep)}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalShipping sx={{ mr: 1 }} />
              <Typography variant="h6">Shipping Method</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Standard Shipping - Free
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Estimated delivery: 5-7 business days
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Place Order'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Checkout;

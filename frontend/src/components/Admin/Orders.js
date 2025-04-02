import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import { LocalShipping, Edit, Delete, Check, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getorders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updateorder/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders();
      setSuccess('Order status updated successfully');
    } catch (error) {
      setError('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Orders</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    <Typography variant="body1">{order.customerName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customerEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.name} x {item.quantity}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {order.status === 'pending' && (
                        <>
                          <IconButton
                            onClick={() => updateOrderStatus(order._id, 'processing')}
                            color="primary"
                            title="Mark as Processing"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            color="error"
                            title="Cancel Order"
                          >
                            <Close />
                          </IconButton>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <IconButton
                          onClick={() => updateOrderStatus(order._id, 'shipped')}
                          color="primary"
                          title="Mark as Shipped"
                        >
                          <LocalShipping />
                        </IconButton>
                      )}
                      {order.status === 'shipped' && (
                        <IconButton
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          color="success"
                          title="Mark as Delivered"
                        >
                          <Check />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default Orders;

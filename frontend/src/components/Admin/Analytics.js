import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  TrendingUp, 
  ShoppingCart, 
  AttachMoney, 
  Assessment,
  BarChart,
  PieChart
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [productData, setProductData] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sample data - Replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        const sales = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: theme.palette.primary.main,
            tension: 0.1
          }]
        };

        const revenue = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [5000, 7500, 3000, 6000, 4500, 8000],
            backgroundColor: theme.palette.primary.main,
            tension: 0.1
          }]
        };

        const products = {
          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
          datasets: [{
            data: [300, 150, 200, 100],
            backgroundColor: [
              theme.palette.success.main,
              theme.palette.warning.main,
              theme.palette.error.main,
              theme.palette.info.main
            ]
          }]
        };

        const topProductsData = [
          { name: 'Product A', sales: 150, revenue: 7500 },
          { name: 'Product B', sales: 120, revenue: 6000 },
          { name: 'Product C', sales: 90, revenue: 4500 },
          { name: 'Product D', sales: 60, revenue: 3000 }
        ];

        setSalesData(sales);
        setRevenueData(revenue);
        setProductData(products);
        setTopProducts(topProductsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4" gutterBottom>
                1,250
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +25% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <ShoppingCart color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="success" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" gutterBottom>
                850
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +15% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <AttachMoney color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="warning" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" gutterBottom>
                $45,000
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +30% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Assessment color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h6" color="error" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" gutterBottom>
                2,500
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +10% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sales Overview" />
            <CardContent>
              <Box height={300}>
                <Line data={salesData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Revenue Growth" />
            <CardContent>
              <Box height={300}>
                <Line data={revenueData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Product Distribution" />
            <CardContent>
              <Box height={300}>
                <Pie data={productData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Top Performing Products" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.sales}</TableCell>
                        <TableCell align="right">${product.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;

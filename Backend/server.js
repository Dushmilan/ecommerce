const express = require('express');
const cors = require('cors');
require('dotenv').config();
const UserRouter = require('./Router/UserRouter');
const ProductRouter = require('./Router/ProductRouter');
const OrderRouter = require('./Router/OrderRouter');
const AdminRouter = require('./Router/AdminRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static('public'));

// Create uploads directory 
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use('/api', UserRouter);
app.use('/api', ProductRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/admin', AdminRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

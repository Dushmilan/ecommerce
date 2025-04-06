const Order = require('../Model/OrderModel');
const Product = require('../Model/ProductModel');

// Get admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    // Get total number of products
    const [products] = await Product.getProducts();
    const totalProducts = products.length;

    // Get total number of orders
    const [orders] = await Order.getUserOrders();
    const totalOrders = orders.length;

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      total: order.total_price,
      date: order.created_at
    }));

    // Generate sales data for the last 30 days
    const salesData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get total sales for this date
      const dailySales = orders.filter(order => 
        new Date(order.created_at).toISOString().split('T')[0] === dateStr
      ).reduce((sum, order) => sum + order.total_price, 0);

      salesData.push({
        date: dateStr,
        sales: dailySales
      });
    }

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      salesData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Category, ExitToApp, Dashboard, LocalShipping, Settings as SettingsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Products from '../Admin/Products';
import Orders from '../Admin/Orders';
import AdminDashboard from '../Admin/AdminDashboard';
import Settings from '../Admin/Settings';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Products', icon: <Category />, path: '/admin/products' },
  { text: 'Orders', icon: <LocalShipping />, path: '/admin/orders' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

const SellerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('/admin');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (selectedMenu) {
      case '/admin':
        return <AdminDashboard />;
      case '/admin/products':
        return <Products />;
      case '/admin/orders':
        return <Orders />;
      case '/admin/settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={selectedMenu === item.path}
                onClick={() => {
                  setSelectedMenu(item.path);
                  navigate(item.path);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default SellerDashboard;

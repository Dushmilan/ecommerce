import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Paper, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Security, Palette, Person, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    general: {
      shopName: '',
      email: '',
      phone: '',
      address: ''
    },
    security: {
      password: '',
      confirmPassword: '',
      twoFactor: false
    },
    appearance: {
      theme: 'light'
    }
  });
  const [section, setSection] = useState('general');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching settings');
      setLoading(false);
    }
  };

  const updateSettings = async (section) => {
    try {
      const response = await fetch('http://localhost:5000/api/updateSettings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ section, data: settings[section] })
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      fetchSettings();
      setError('');
      setSection('general');
    } catch (error) {
      setError('Error updating settings');
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;

    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      setError('Error logging out');
    }
  };

  const getSectionContent = () => {
    switch (section) {
      case 'general':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Shop Name"
                value={settings.general.shopName}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, shopName: e.target.value } })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={settings.general.email}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, email: e.target.value } })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Shop name"
                multiline
                rows={2}
                value={settings.general.address}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, address: e.target.value } })}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        );

      case 'security':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                type="password"
                value={settings.security.password}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, password: e.target.value } })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm New Password"
                type="password"
                value={settings.security.confirmPassword}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, confirmPassword: e.target.value } })}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        );

      case 'appearance':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.appearance.theme}
                  onChange={(e) => setSettings({ ...settings, appearance: { ...settings.appearance, theme: e.target.value } })}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Settings Navigation */}
          <Paper sx={{ mb: 3 }}>
            <List>
              <ListItem
                button
                selected={section === 'general'}
                onClick={() => setSection('general')}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="General" />
              </ListItem>
              <Divider />
              <ListItem
                button
                selected={section === 'security'}
                onClick={() => setSection('security')}
              >
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
              <Divider />
              <ListItem
                button
                selected={section === 'appearance'}
                onClick={() => setSection('appearance')}
              >
                <ListItemIcon>
                  <Palette />
                </ListItemIcon>
                <ListItemText primary="Appearance" />
              </ListItem>
            </List>
          </Paper>

          {/* Settings Content */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {section === 'general' && 'General Settings'}
                  {section === 'security' && 'Security Settings'}
                  {section === 'appearance' && 'Appearance Settings'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => updateSettings(section)}
                >
                  Save Changes
                </Button>
              </Box>
              {getSectionContent()}
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AdminSettings;

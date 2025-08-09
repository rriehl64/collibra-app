import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useSnackbar } from '../contexts/SnackbarContext';

/**
 * Development-only login page that provides auto-login functionality
 */
const DevLogin: React.FC = () => {
  const { autoLogin, user, loading, error, isDevMode } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Auto-login handler functions
  const handleAdminLogin = async () => {
    try {
      await autoLogin('admin');
      showSnackbar('Logged in as Admin', 'success');
      navigate('/dashboard');
    } catch (err) {
      showSnackbar('Login failed', 'error');
    }
  };

  const handleStewardLogin = async () => {
    try {
      await autoLogin('data-steward');
      showSnackbar('Logged in as Data Steward', 'success');
      navigate('/dashboard');
    } catch (err) {
      showSnackbar('Login failed', 'error');
    }
  };

  const handleUserLogin = async () => {
    try {
      await autoLogin('user');
      showSnackbar('Logged in as Standard User', 'success');
      navigate('/dashboard');
    } catch (err) {
      showSnackbar('Login failed', 'error');
    }
  };

  if (!isDevMode) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Dev login is only available in development mode
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        p: 3 
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#003366' }}>
            Development Auto-Login
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            Select a user type to auto-login without entering credentials.
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress aria-label="Loading..." />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAdminLogin}
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
                aria-label="Login as Administrator"
              >
                Login as Administrator
              </Button>
              
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleStewardLogin}
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
                aria-label="Login as Data Steward"
              >
                Login as Data Steward
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleUserLogin}
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
                aria-label="Login as Standard User"
              >
                Login as Standard User
              </Button>
            </Box>
          )}
          
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          <Typography variant="caption" display="block" align="center" sx={{ mt: 3 }}>
            Note: This login page is for development purposes only.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DevLogin;

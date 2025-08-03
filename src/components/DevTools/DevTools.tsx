import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Stack, Chip, Snackbar, Alert, IconButton } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { AdminPanelSettings, ManageAccounts, Person, Check, Close } from '@mui/icons-material';
import axios from 'axios';

/**
 * DevTools component for development environment only
 * Provides quick access to development utilities like auto-login
 */
const DevTools: React.FC = () => {
  const { isDevMode, autoLogin, user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isVisible, setIsVisible] = useState(() => {
    // Check localStorage for saved visibility preference
    const savedVisibility = localStorage.getItem('devToolsVisible');
    console.log('Initial DevTools visibility state:', savedVisibility);
    return savedVisibility === null || savedVisibility === 'true';
  });
  
  // Reset visibility when in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('DevTools visibility check on component mount');
      // Force visibility in dev login page for easier access
      if (window.location.pathname === '/login') {
        updateVisibility(true);
      }
    }
  }, []);

  // Helper function to update visibility state and localStorage
  const updateVisibility = (visible: boolean) => {
    console.log('Updating DevTools visibility to:', visible);
    setIsVisible(visible);
    try {
      localStorage.setItem('devToolsVisible', visible.toString());
      console.log('Successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Don't render anything in production or when hidden
  if (!isDevMode || !isVisible) {
    return null;
  }

  // Direct API login without going through the React context
  const directApiLogin = async (email: string, password: string) => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';
      const response = await axios.post(`${apiBaseUrl}/auth/login`, { email, password }, {
        withCredentials: true
      });
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Direct API login failed:', error);
      throw error;
    }
  };

  // Handler for auto-login
  const handleAutoLogin = async (userType: 'admin' | 'data-steward' | 'user') => {
    try {
      setSnackbarMessage(`Attempting to login as ${userType}...`);
      setSnackbarOpen(true);
      
      // Get email based on user type
      let email = 'user@example.com';
      if (userType === 'admin') {
        email = 'admin@example.com';
      } else if (userType === 'data-steward') {
        email = 'steward@example.com';
      }
      
      // Try direct API login first
      try {
        // Use correct password for each user type
        let password = 'password123';
        if (userType === 'admin') {
          password = 'admin123!';
        }
        await directApiLogin(email, password);
        console.log('Direct API login successful');
        
        // Then use autoLogin for state management
        await autoLogin(userType);
        
        setSnackbarMessage(`Successfully logged in as ${userType}`);
        setSnackbarOpen(true);
        
        // Hide the dev tools panel after successful login - immediate and with timeout for reliability
        updateVisibility(false);
        setTimeout(() => {
          updateVisibility(false);
          document.getElementById('dev-tools-panel')?.remove();
        }, 500);
        
        // Force a page refresh if needed to update the UI
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
      } catch (apiError) {
        console.error('Direct API login failed, falling back to normal login:', apiError);
        await autoLogin(userType);
      }
    } catch (error) {
      console.error('Auto login error:', error);
      setSnackbarMessage(`Login Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarOpen(true);
    }
  };

  // Function to fill login form fields using the global interface
  const fillLoginForm = (userType: 'admin' | 'data-steward' | 'user') => {
    let email = '';
    let password = 'admin123!'; // Default password for admin that we reset
    
    // Select the appropriate user email based on type
    if (userType === 'admin') {
      email = 'admin@example.com';
    } else if (userType === 'data-steward') {
      email = 'steward@example.com';
    } else {
      email = 'user@example.com';
    }
    
    try {
      setSnackbarMessage(`Filling form with ${userType} credentials...`);
      setSnackbarOpen(true);
      
      // Use the global interface created in the Login component
      if (window._devLogin) {
        // Set credentials using React state setter
        window._devLogin.setCredentials(email, password);
        
        // Show success message
        setSnackbarMessage(`Form filled with ${userType} credentials`);
        setSnackbarOpen(true);
        
        // Auto-submit the form after a short delay
        setTimeout(() => {
          try {
            if (window._devLogin) {
              window._devLogin.submitForm();
              // Hide the dev tools panel after form submission - immediate and with timeout for reliability
              updateVisibility(false);
              setTimeout(() => {
                updateVisibility(false);
                document.getElementById('dev-tools-panel')?.remove();
              }, 500);
            }
          } catch (err) {
            console.error('Error submitting form:', err);
            setSnackbarMessage(`Error submitting form: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setSnackbarOpen(true);
          }
        }, 1000);
      } else {
        console.error('Login interface not available');
        setSnackbarMessage('Login interface not available - are you on the login page?');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error filling form:', error);
      setSnackbarMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarOpen(true);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      id="dev-tools-panel"
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        padding: 2,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: 2,
      }}
      aria-label="Development tools"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom component="div">
          🛠️ Dev Tools
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => updateVisibility(false)} 
          color="inherit" 
          aria-label="Close developer tools panel"
          sx={{ 
            '&:focus': {
              outline: '2px solid #fff',
              outlineOffset: '2px'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      
      {user && (
        <Box mb={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Currently logged in as:
          </Typography>
          <Chip 
            label={`${user.name} (${user.role})`} 
            color="primary" 
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      
      <Typography variant="body2" gutterBottom>
        Quick Login:
      </Typography>
      
      <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
        {/* Show quick login buttons when on login page, auto login otherwise */}
        {window.location.pathname.includes('login') ? (
          <>
            <Typography variant="body2" gutterBottom color="info.main">
              Quick Login (Fills Form):
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AdminPanelSettings />}
              onClick={() => fillLoginForm('admin')}
              aria-label="Fill login form with admin credentials"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Admin
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ManageAccounts />}
              onClick={() => fillLoginForm('data-steward')}
              aria-label="Fill login form with data steward credentials"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Data Steward
            </Button>
            
            <Button
              variant="contained"
              color="info"
              startIcon={<Person />}
              onClick={() => fillLoginForm('user')}
              aria-label="Fill login form with regular user credentials"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Regular User
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" gutterBottom color="info.main">
              Auto Login (Direct):
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AdminPanelSettings />}
              onClick={() => handleAutoLogin('admin')}
              aria-label="Auto-login as admin"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Admin
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ManageAccounts />}
              onClick={() => handleAutoLogin('data-steward')}
              aria-label="Auto-login as data steward"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Data Steward
            </Button>
            
            <Button
              variant="contained"
              color="info"
              startIcon={<Person />}
              onClick={() => handleAutoLogin('user')}
              aria-label="Auto-login as regular user"
              size="small"
              sx={{ justifyContent: 'flex-start' }}
            >
              Login as Regular User
            </Button>
          </>
        )}
      </Stack>
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          icon={<Check fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DevTools;

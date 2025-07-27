import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Alert,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Login Component
 * Provides a form for users to authenticate
 */
// Define global interface to expose login methods to DevTools
declare global {
  interface Window {
    _devLogin?: {
      setCredentials: (email: string, password: string) => void;
      submitForm: () => void;
    };
  }
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  // Create form ref to access form methods
  const formRef = React.useRef<HTMLFormElement>(null);

  // Expose methods for DevTools to set login credentials
  useEffect(() => {
    // Create global interface for DevTools
    window._devLogin = {
      setCredentials: (devEmail: string, devPassword: string) => {
        setEmail(devEmail);
        setPassword(devPassword);
      },
      submitForm: () => {
        if (formRef.current) {
          formRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }
    };
    
    return () => {
      // Clean up global object when component unmounts
      delete window._devLogin;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await login(email, password);
      // Close the login form by navigating to the home page with a redirect
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mt: 8
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" ref={formRef} onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{
              'aria-label': 'Email Address',
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': 'Password',
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

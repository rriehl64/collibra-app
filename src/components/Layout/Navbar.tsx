import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Avatar, 
  Chip, 
  Menu, 
  MenuItem,
  Divider,
  ListItemIcon,
  InputBase,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AccountCircle, 
  Logout, 
  Settings, 
  Search as SearchIcon,
  Language,
  Help,
  Info
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { styled, alpha } from '@mui/material/styles';

// Styled search component matching USCIS style
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  border: '1px solid #bbb',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#003366',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#003366',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      color: '#555',
      opacity: 0.7,
    },
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/');
  };
  
  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate('/profile');
  };
  
  const handleSettingsClick = () => {
    setAnchorEl(null);
    navigate('/settings');
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
    console.log('Search submitted');
  };
  
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* USA Banner - matching USCIS style */}
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ddd',
          py: 0.5,
          px: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          position: 'fixed',
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/images/USFlag-Icon-2x.png" alt="U.S. flag" style={{ height: 16, width: 'auto' }} />
          <Typography variant="body2" sx={{ color: '#333' }}>
            An official website of the United States government
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            size="small"
            sx={{ 
              textTransform: 'none', 
              color: '#003366',
              fontSize: '0.875rem',
              fontWeight: 400,
              p: 0
            }}
            startIcon={<Language fontSize="small" />}
          >
            English
          </Button>
        </Box>
      </Box>
      
      {/* Main AppBar - USCIS OPQ style */}
      <AppBar
        position="fixed"
        sx={{
          top: 28, // Account for USA banner
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          borderBottom: '2px solid #003366', // USCIS blue border
          width: '100%',
          left: 0,
          right: 0,
          height: 90 // Set a fixed height
        }}
      >
        <Container maxWidth={false} sx={{ pl: 0, ml: 0, px: 2, width: '100%' }}>
          <Toolbar sx={{ px: { xs: 0 }, py: 1, minHeight: '90px', justifyContent: 'flex-start' }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                zIndex: 2
              }}
            >
              <img 
                src="/images/eunify.png" 
                alt="E-Unify" 
                style={{ height: 60 }}
              />
            </Box>
            
            {/* Search bar - USCIS style */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', maxWidth: 500, mx: 'auto' }}>
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{ 
                  display: 'flex', 
                  width: '100%',
                  border: '1px solid #bbb',
                  boxShadow: 'none',
                  borderRadius: 1
                }}
              >
                <StyledInputBase
                  placeholder="Search our site"
                  inputProps={{ 
                    'aria-label': 'search the site',
                    'accessKey': 's'
                  }}
                  fullWidth
                />
                <IconButton type="submit" aria-label="search" sx={{ color: '#003366' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            
            {/* Utility Navigation - Section 508 compliant */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center', 
                mr: 2, 
                borderRight: '1px solid #e0e0e0',
                pr: 2 
              }}
              aria-label="Utility navigation"
            >
              <Tooltip title="About E-Unify">
                <Button
                  component={Link}
                  to="/about"
                  size="small"
                  startIcon={<Info />}
                  sx={{
                    color: '#003366',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                  aria-label="About E-Unify"
                >
                  About
                </Button>
              </Tooltip>
              <Tooltip title="Help Center">
                <Button
                  component={Link}
                  to="/help"
                  size="small"
                  startIcon={<Help />}
                  sx={{
                    color: '#003366',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                  aria-label="Help Center"
                >
                  Help
                </Button>
              </Tooltip>
            </Box>
            
            {/* Right side: Sign In/Admin User */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', zIndex: 3 }}>
            {user ? (
              <>
                <Chip
                  avatar={<Avatar alt={user.name} src="/user-avatar.png" />}
                  label={user.name}
                  onClick={handleMenuOpen}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 0.5,
                    backgroundColor: '#f0f5fb',
                    borderColor: '#003366',
                    color: '#003366'
                  }}
                  aria-label="User profile and settings"
                  role="button"
                  color="primary"
                  variant="outlined"
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSettingsClick}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/login"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Login
              </Button>
            )}

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </Box>
  );
};

export default Navbar;

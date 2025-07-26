import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidenav from './Sidenav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidenav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          pt: { xs: 10, sm: 12 }, // Add padding top to account for the navbar
          px: { xs: 2, sm: 3 },   // Add horizontal padding
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

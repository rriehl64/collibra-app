import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidenav from './Sidenav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ display: 'flex', pt: { xs: '118px', sm: '118px' } }}>
        <Sidenav />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            minHeight: 'calc(100vh - 118px)',
            backgroundColor: 'background.default',
            px: { xs: 2, sm: 3 },   // Add horizontal padding
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

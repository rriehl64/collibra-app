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
          id="main-content"
          tabIndex={-1} // Makes it focusable but not in the tab order
          aria-label="Main content"
          sx={{
            flexGrow: 1,
            width: '100%',
            minHeight: 'calc(100vh - 118px)',
            backgroundColor: 'background.default',
            px: { xs: 2, sm: 3 },   // Add horizontal padding
            '&:focus': { // Add focus style that meets 508 compliance
              outline: 'none' // Remove default outline
            },
            scrollBehavior: 'smooth', // Smooth scrolling for better user experience
            scrollMarginTop: '118px' // Account for fixed header when scrolling to anchors
          }}
        >
          {/* Skip link target */}
          <div id="skip-target" style={{ position: 'absolute', top: 0 }}></div>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

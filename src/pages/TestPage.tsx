import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DataAssetDemo from './DataAssetDemo';

/**
 * A standalone test page for showcasing accessible components
 * This page doesn't depend on authentication or the main app layout
 */
const TestPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Accessible Data Asset Components
        </Typography>
        <Typography variant="body1" paragraph>
          This page demonstrates the accessible data asset card components with full keyboard navigation 
          and screen reader support. Try using Tab, Enter, Escape, and other keyboard controls.
        </Typography>
      </Box>
      
      {/* Render the DataAssetDemo component */}
      <DataAssetDemo />
    </Container>
  );
};

export default TestPage;

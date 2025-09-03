/**
 * DataQuality Page
 * 
 * Main page for data quality dashboard and metrics.
 */

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DataQualityDashboard from '../components/Dashboard/DataQualityDashboard';

const DataQuality: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <DataQualityDashboard />
    </Container>
  );
};

export default DataQuality;

/**
 * Scheduled Processes Page
 * 
 * Standalone page for managing automated scheduling and cron expressions.
 * This provides direct access to the scheduling functionality that's also
 * available as a tab within the Automated Processes page.
 */

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ScheduledProcesses from '../components/ScheduledProcesses';

const ScheduledProcessesPage: React.FC = () => {
  return (
    <Container sx={{ py: 4 }} className="scheduled-processes-page">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ color: '#003366', fontWeight: 700 }}
        >
          Scheduled Processes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage automated scheduling and cron expressions for your processes
        </Typography>
      </Box>

      {/* Scheduled Processes Component */}
      <ScheduledProcesses />
    </Container>
  );
};

export default ScheduledProcessesPage;

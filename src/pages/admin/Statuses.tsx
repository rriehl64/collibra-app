import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

const Statuses: React.FC = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
        Status Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage statuses for data assets and workflows.
      </Typography>
      
      <Paper elevation={2} sx={{ mt: 4 }}>
        <TableContainer>
          <Table aria-label="Status management table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Color</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Usage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Active</TableCell>
                <TableCell>
                  <Chip 
                    label="Active" 
                    sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                  />
                </TableCell>
                <TableCell>28 assets</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Draft</TableCell>
                <TableCell>
                  <Chip 
                    label="Draft" 
                    sx={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
                  />
                </TableCell>
                <TableCell>15 assets</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inactive</TableCell>
                <TableCell>
                  <Chip 
                    label="Inactive" 
                    sx={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                  />
                </TableCell>
                <TableCell>7 assets</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Statuses;

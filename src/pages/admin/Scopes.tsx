import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Simple scope type definition
interface Scope {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  owner: string;
  accessLevel: string;
  assetCount: number;
  dateCreated: string;
}

// Sample data
const sampleScopes: Scope[] = [
  {
    id: 'sc-001',
    name: 'Enterprise Data',
    description: 'Core enterprise data assets available company-wide',
    dataSource: 'Data Warehouse',
    owner: 'Enterprise Data Office',
    accessLevel: 'Organization',
    assetCount: 245,
    dateCreated: '2024-02-15'
  },
  {
    id: 'sc-002',
    name: 'Finance Department',
    description: 'Financial data assets restricted to finance department',
    dataSource: 'Finance ERP',
    owner: 'Finance Director',
    accessLevel: 'Department',
    assetCount: 127,
    dateCreated: '2024-03-22'
  },
  {
    id: 'sc-003',
    name: 'Marketing Analytics',
    description: 'Marketing campaign and customer analytics data',
    dataSource: 'Marketing Platform',
    owner: 'Marketing Manager',
    accessLevel: 'Team',
    assetCount: 89,
    dateCreated: '2024-05-10'
  }
];

const Scopes: React.FC = () => {
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScopes(sampleScopes);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Data Scope Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage data scopes that control access and visibility of data assets across the organization.
      </Typography>
      
      {/* Basic search */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search scopes..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              aria-label="Search scopes"
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              aria-label="Add new scope"
            >
              Add Scope
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading scopes" />
        </Box>
      )}
      
      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}
      
      {/* Scopes table */}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Data scopes table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Access Level</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data Source</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Asset Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scopes.map((scope) => (
                <TableRow key={scope.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{scope.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{scope.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={scope.accessLevel} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 
                          scope.accessLevel === 'Organization' ? '#E3F2FD' : 
                          scope.accessLevel === 'Department' ? '#E8F5E9' : 
                          '#FFF3E0',
                        color: 
                          scope.accessLevel === 'Organization' ? '#1976D2' : 
                          scope.accessLevel === 'Department' ? '#2E7D32' : 
                          '#E65100'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{scope.owner}</TableCell>
                  <TableCell>{scope.dataSource}</TableCell>
                  <TableCell>{scope.assetCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Scopes;

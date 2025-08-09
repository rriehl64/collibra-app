/**
 * DataDomains.tsx
 * 
 * A simplified version of the DataDomains component that follows 
 * the same pattern as the BusinessProcesses component
 */

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Box, 
  CircularProgress, 
  Alert,
  Grid, 
  Card, 
  CardContent,
  Chip
} from '@mui/material';
import api from '../services/api';
import { useSnackbar } from '../contexts/SnackbarContext';

// Simplified domain interface
interface DataDomain {
  name: string;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  description?: string;
}

const DataDomains: React.FC = () => {
  // Basic state
  const [domains, setDomains] = useState<DataDomain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Snackbar for notifications
  const { showSnackbar } = useSnackbar();
  
  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      try {
        // API call to fetch domain data
        const response = await api.get('/data-concepts/domains');
        
        if (response.data && Array.isArray(response.data.data)) {
          // Transform domain strings to objects
          const domainObjects = response.data.data.map((domainName: string) => ({
            name: domainName,
            status: 'active' as const,
            description: `Domain for ${domainName} data concepts`
          }));
          
          setDomains(domainObjects);
          showSnackbar('Domains loaded successfully', 'success');
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Failed to fetch domains:', err);
        setError('Failed to load domains. Please try again.');
        showSnackbar('Error loading domains', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDomains();
  }, [showSnackbar]);
  
  // Render component
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Domains
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress aria-label="Loading domains" />
        </Box>
      )}
      
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !error && domains.length === 0 && (
        <Alert severity="info">
          No domains found.
        </Alert>
      )}
      
      {!loading && !error && domains.length > 0 && (
        <Grid container spacing={3}>
          {domains.map((domain) => (
            <Grid item xs={12} md={4} key={domain.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {domain.name}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    {domain.description || 'No description available'}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={domain.status || 'active'} 
                      color={domain.status === 'active' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DataDomains;

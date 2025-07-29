import React, { useState } from 'react';
import { 
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import axios from 'axios';
import elasticSearchService from '../services/elasticSearchService';
import dataAssetService from '../services/dataAssetService';

/**
 * ElasticsearchAdmin component
 * Provides admin functions for Elasticsearch such as syncing data,
 * checking index health, and clearing the index
 */
const ElasticsearchAdmin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Sync data from MongoDB to Elasticsearch
  const handleSyncData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Fetch all data assets
      const { assets } = await dataAssetService.getDataAssets({ limit: 1000 });
      
      // Sync to Elasticsearch
      await elasticSearchService.syncDataToElasticsearch(assets);
      
      setSuccess(`Successfully synced ${assets.length} data assets to Elasticsearch`);
    } catch (err) {
      console.error('Error syncing data:', err);
      setError('Failed to sync data to Elasticsearch. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Check Elasticsearch index health and status
  const handleCheckHealth = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // This would normally call an API endpoint to get cluster health
      // For now, we'll mock this with a direct service call
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      const response = await axios.get(`${API_URL}/elasticsearch/health`);
      
      setStats(response.data);
      setSuccess('Successfully retrieved Elasticsearch health information');
    } catch (err) {
      console.error('Error checking Elasticsearch health:', err);
      setError('Failed to check Elasticsearch health. See console for details.');
      
      // Mock some stats for development
      if (process.env.NODE_ENV === 'development') {
        setStats({
          clusterName: 'data-catalog-cluster',
          status: 'green',
          numberOfNodes: 1,
          numberOfDataNodes: 1,
          activePrimaryShards: 5,
          activeShards: 5,
          relocatingShards: 0,
          initializingShards: 0,
          unassignedShards: 0,
          indices: {
            'data_catalog': {
              health: 'green',
              status: 'open',
              docsCount: 6,
              docsDeleted: 0,
              storeSize: '24.3kb'
            }
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear index (dangerous operation)
  const handleClearIndex = async () => {
    if (!window.confirm('WARNING: This will delete all data in the Elasticsearch index. This operation cannot be undone. Are you sure you want to continue?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // This would normally call an API endpoint to delete the index
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      await axios.delete(`${API_URL}/elasticsearch/index`);
      
      setSuccess('Successfully deleted Elasticsearch index');
    } catch (err) {
      console.error('Error deleting index:', err);
      setError('Failed to delete Elasticsearch index. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Elasticsearch Administration
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Data Synchronization
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sync data from MongoDB to Elasticsearch. This will update the search index with the latest data.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSyncData}
            disabled={loading}
            aria-label="Sync data to Elasticsearch"
          >
            {loading ? <CircularProgress size={24} /> : 'Sync Data'}
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Elasticsearch Health
        </Typography>
        <Typography variant="body1" gutterBottom>
          Check the health and status of your Elasticsearch cluster and indices.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleCheckHealth}
            disabled={loading}
            aria-label="Check Elasticsearch health"
          >
            {loading ? <CircularProgress size={24} /> : 'Check Health'}
          </Button>
        </Box>
        
        {stats && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Cluster: {stats.clusterName}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Status: <span style={{ color: 
                      stats.status === 'green' ? 'green' : 
                      stats.status === 'yellow' ? 'orange' : 'red' 
                    }}>{stats.status}</span>
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2">Nodes: {stats.numberOfNodes}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Data Nodes: {stats.numberOfDataNodes}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Primary Shards: {stats.activePrimaryShards}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Total Shards: {stats.activeShards}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Indices</Typography>
                  {Object.entries(stats.indices || {}).map(([indexName, indexStats]: [string, any]) => (
                    <Box key={indexName} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {indexName} - <span style={{ color: 
                          indexStats.health === 'green' ? 'green' : 
                          indexStats.health === 'yellow' ? 'orange' : 'red' 
                        }}>{indexStats.health}</span>
                      </Typography>
                      <Typography variant="body2">
                        Documents: {indexStats.docsCount} | Size: {indexStats.storeSize}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff4f4' }}>
        <Typography variant="h6" component="h2" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Typography variant="body1" gutterBottom>
          Clear the Elasticsearch index. This will delete all data in the index and cannot be undone.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearIndex}
            disabled={loading}
            aria-label="Clear Elasticsearch index"
          >
            {loading ? <CircularProgress size={24} /> : 'Clear Index'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ElasticsearchAdmin;

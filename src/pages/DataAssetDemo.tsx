/**
 * Data Asset Demo Page
 * 
 * Demonstrates the accessible card interface for data assets with
 * full Section 508 compliance and keyboard navigation support.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DataAssetCard } from '../components/DataCatalog/DataAssetCard';
import { DataAsset } from '../types/DataAsset';
import { CircularProgress, Alert, Box, Button, Typography, Container, Grid } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import dataAssetService from '../services/dataAssetService';

const DataAssetDemo = (): React.ReactElement => {
  // Data state
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // No longer using sample fallback data - always using backend data


  // Fetch data assets from API
  const fetchDataAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the dataAssetService to get data assets with a limit of 15
      const response = await dataAssetService.getDataAssets({ limit: 15 });
      
      if (response.assets && response.assets.length > 0) {
        setDataAssets(response.assets);
        setTotalCount(response.total || response.assets.length);
      } else {
        console.log('No data assets returned from API');
        setDataAssets([]);
        setTotalCount(0);
        setError('No data assets found. Please check your connection or permissions.');
      }
    } catch (err: any) {
      console.error('Failed to fetch data assets:', err);
      
      // Set specific error message based on error type
      const errorMessage = err.message || 'Failed to load data assets. Please try again later.';
      setError(errorMessage);
      
      // Don't use sample fallback data anymore - show empty state
      setDataAssets([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    fetchDataAssets();
  }, [fetchDataAssets]);

  // Handle updating an asset
  // Handle updating an asset
  const updateAsset = async (id: string, updatedData: Partial<DataAsset>) => {
    // Store original data before optimistic update for potential rollback
    const originalAssets = [...dataAssets];
    
    try {
      // Optimistically update the UI
      setDataAssets(prevAssets => 
        prevAssets.map(asset => 
          asset._id === id ? { ...asset, ...updatedData } : asset
        )
      );
      
      // Clear any previous errors
      setError(null);
      
      // Call API to update in backend
      await dataAssetService.updateDataAsset(id, updatedData);
      
      // Show success notification
      setSuccessMessage('Data asset updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to update data asset:', err);
      
      // Roll back optimistic update
      setDataAssets(originalAssets);
      
      // Show specific error message to user
      setError(err.message || 'Failed to update data asset. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Container className="data-asset-demo" sx={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#003366' }} id="data-assets-heading" tabIndex={-1}>Data Asset Management</h1>
        <p aria-live="polite">
          Click anywhere on a card to edit the asset details. Press Tab to navigate between cards and Enter to activate edit mode.
        </p>
      </header>
      
      <div className="accessibility-info" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '4px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px' }}>Accessibility Features</h2>
        <ul>
          <li><strong>Keyboard Navigation:</strong> Tab to focus cards, Enter to edit, Escape to cancel, Ctrl+Enter to save</li>
          <li><strong>Screen Reader Support:</strong> ARIA attributes and instructions for assistive technology</li>
          <li><strong>Focus Management:</strong> Visual indicators and focus trapping in edit mode</li>
          <li><strong>Large Click Targets:</strong> Full card is clickable for users with motor control limitations</li>
        </ul>
      </div>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress aria-label="Loading data assets" />
          <Typography component="span" sx={{ ml: 2 }} role="status">
            Loading data assets...
          </Typography>
        </Box>
      )}
      
      {/* Success message */}
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => fetchDataAssets()}
              startIcon={<RefreshIcon />}
              aria-label="Retry loading data assets"
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      {/* Data display */}
      {!loading && !error && (
        <div className="cards-container" aria-live="polite">
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }} aria-label={`Showing ${dataAssets.length} of ${totalCount} data assets`}>
            Data Assets ({dataAssets.length})
          </h2>
          
          {dataAssets.length === 0 ? (
            <Alert severity="info">No data assets found.</Alert>
          ) : (
            <Grid container spacing={3} role="region" aria-label="Data assets list">
              {dataAssets.map(asset => (
                <Grid item xs={12} sm={6} md={4} key={asset._id}>
                  <DataAssetCard 
                    key={asset._id} 
                    asset={asset}
                    onUpdateAsset={(updatedAsset: DataAsset) => updateAsset(updatedAsset._id as string, updatedAsset)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
    </Container>
  );
};

export default DataAssetDemo;

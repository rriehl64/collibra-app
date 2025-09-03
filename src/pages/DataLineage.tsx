import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountTree as LineageIcon
} from '@mui/icons-material';
import DataLineageVisualization from '../components/DataLineage/DataLineageVisualization';
import api, { getAssetLineage } from '../services/api';

const DataLineage: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lineageData, setLineageData] = useState<any>(null);

  // Fetch real assets from MongoDB
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await api.get('/data-assets?limit=50');
        setAssets(response.data.data || []);
      } catch (err: any) {
        setError('Failed to load data assets');
        console.error('Error fetching assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Fetch lineage when asset is selected
  useEffect(() => {
    const fetchLineage = async () => {
      if (!selectedAsset) {
        setLineageData(null);
        return;
      }

      setLoading(true);
      try {
        const response = await getAssetLineage(selectedAsset);
        setLineageData(response.data.data);
      } catch (err: any) {
        setError('Failed to load lineage data');
        console.error('Error fetching lineage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLineage();
  }, [selectedAsset]);

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample data assets for demonstration (fallback)
  const sampleAssets = [
    { 
      _id: 'customer_data', 
      id: 'customer_data',
      name: 'Customer Data', 
      type: 'Table', 
      domain: 'Marketing',
      owner: 'Marketing Team',
      description: 'Customer information and demographics',
      status: 'Active',
      certification: 'certified' as const,
      tags: ['customer', 'marketing'],
      stewards: ['Marketing Team']
    },
    { 
      _id: 'sales_report', 
      id: 'sales_report',
      name: 'Sales Report', 
      type: 'Report', 
      domain: 'Finance',
      owner: 'Finance Team',
      description: 'Monthly sales performance report',
      status: 'Active',
      certification: 'certified' as const,
      tags: ['sales', 'finance'],
      stewards: ['Finance Team']
    },
    { 
      _id: 'user_analytics', 
      id: 'user_analytics',
      name: 'User Analytics', 
      type: 'Dashboard', 
      domain: 'Operations',
      owner: 'Analytics Team',
      description: 'User behavior and engagement metrics',
      status: 'Active',
      certification: 'pending' as const,
      tags: ['analytics', 'users'],
      stewards: ['Analytics Team']
    },
    { 
      _id: 'inventory_db', 
      id: 'inventory_db',
      name: 'Inventory Database', 
      type: 'Database', 
      domain: 'Supply Chain',
      owner: 'Operations Team',
      description: 'Product inventory and stock levels',
      status: 'Active',
      certification: 'certified' as const,
      tags: ['inventory', 'supply-chain'],
      stewards: ['Operations Team']
    }
  ];

  // Generate sample lineage data
  const generateLineageData = (assetId: string) => {
    const asset = sampleAssets.find(a => a.id === assetId);
    if (!asset) return { nodes: [], links: [] };

    const nodes = [
      {
        id: asset.id,
        name: asset.name,
        type: asset.type,
        level: 0,
        isCenter: true
      },
      {
        id: `${asset.id}_source_1`,
        name: `${asset.domain} Raw Data`,
        type: 'Database',
        level: -1,
        isCenter: false
      },
      {
        id: `${asset.id}_source_2`,
        name: `${asset.domain} API`,
        type: 'API',
        level: -1,
        isCenter: false
      },
      {
        id: `${asset.id}_target_1`,
        name: `${asset.name} Analytics`,
        type: 'Dashboard',
        level: 1,
        isCenter: false
      },
      {
        id: `${asset.id}_target_2`,
        name: `${asset.name} Reports`,
        type: 'Report',
        level: 1,
        isCenter: false
      }
    ];

    const links = [
      {
        source: `${asset.id}_source_1`,
        target: asset.id,
        type: 'data_flow',
        strength: 0.8
      },
      {
        source: `${asset.id}_source_2`,
        target: asset.id,
        type: 'data_flow',
        strength: 0.6
      },
      {
        source: asset.id,
        target: `${asset.id}_target_1`,
        type: 'data_flow',
        strength: 0.9
      },
      {
        source: asset.id,
        target: `${asset.id}_target_2`,
        type: 'data_flow',
        strength: 0.7
      }
    ];

    return { nodes, links };
  };

  // Use real assets if available, otherwise fallback to sample data
  const displayAssets = assets.length > 0 ? filteredAssets : sampleAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Lineage Visualization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore data relationships and dependencies across your data assets
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Asset Selection Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Select Data Asset
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {!loading && displayAssets.map((asset) => (
                <Card 
                  key={asset._id || asset.id} 
                  sx={{ 
                    mb: 1, 
                    cursor: 'pointer',
                    border: selectedAsset === (asset._id || asset.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  onClick={() => setSelectedAsset(asset._id || asset.id)}
                >
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="subtitle2" component="h3">
                      {asset.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {asset.type} • {asset.domain}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<LineageIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAsset(asset._id || asset.id);
                      }}
                    >
                      View Lineage
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Lineage Visualization Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: 600 }}>
            {selectedAsset && lineageData ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Data Lineage: {lineageData.asset?.name}
                </Typography>
                {lineageData.lineage?.nodes?.length > 0 ? (
                  <DataLineageVisualization
                    asset={lineageData.asset}
                    width={700}
                    height={500}
                    onNodeClick={(nodeId) => {
                      console.log('Node clicked:', nodeId);
                      // You can add navigation or detail view here
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: 400,
                    color: 'text.secondary'
                  }}>
                    <LineageIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No Lineage Data Available
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                      This asset doesn't have any lineage relationships defined yet.
                      <br />
                      Contact your data steward to add lineage information.
                    </Typography>
                  </Box>
                )}
              </>
            ) : selectedAsset && loading ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 400 
              }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body1">Loading lineage data...</Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 500,
                  color: 'text.secondary'
                }}
              >
                <LineageIcon sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a Data Asset
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Choose a data asset from the list to view its lineage and relationships
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataLineage;

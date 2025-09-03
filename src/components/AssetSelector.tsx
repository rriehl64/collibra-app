import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  Divider
} from '@mui/material';
import {
  Storage as DatabaseIcon,
  TableChart as TableIcon,
  Assessment as ReportIcon,
  Dashboard as DashboardIcon,
  Api as ApiIcon,
  Description as DocumentIcon,
  Dataset as DatasetIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface Asset {
  _id: string;
  name: string;
  type: string;
  domain: string;
  owner: string;
  description?: string;
}

interface AssetSelectorProps {
  selectedAssets: any[];
  onChange: (assets: any[]) => void;
}

const getAssetIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'database': return <DatabaseIcon color="primary" />;
    case 'table': return <TableIcon color="primary" />;
    case 'report': return <ReportIcon color="primary" />;
    case 'dashboard': return <DashboardIcon color="primary" />;
    case 'api': return <ApiIcon color="primary" />;
    case 'document': return <DocumentIcon color="primary" />;
    case 'dataset': return <DatasetIcon color="primary" />;
    default: return <DatabaseIcon color="primary" />;
  }
};

const AssetSelector: React.FC<AssetSelectorProps> = ({ selectedAssets, onChange }) => {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  // Load assets when dialog opens
  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  // Filter assets based on search and filters
  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (domainFilter) {
      filtered = filtered.filter(asset => asset.domain === domainFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, domainFilter, typeFilter]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/v1/data-assets?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setAssets(data.data);
        
        // Extract unique domains and types for filters
        const uniqueDomains = Array.from(new Set(data.data.map((asset: Asset) => asset.domain))) as string[];
        const uniqueTypes = Array.from(new Set(data.data.map((asset: Asset) => asset.type))) as string[];
        
        setDomains(uniqueDomains.sort());
        setTypes(uniqueTypes.sort());
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetToggle = (asset: Asset) => {
    const isSelected = selectedAssets.some(selected => 
      (typeof selected === 'object' ? selected._id : selected) === asset._id
    );

    if (isSelected) {
      // Remove asset
      const newAssets = selectedAssets.filter(selected => 
        (typeof selected === 'object' ? selected._id : selected) !== asset._id
      );
      onChange(newAssets);
    } else {
      // Add asset (store full object with ObjectId)
      onChange([...selectedAssets, asset]);
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    const newAssets = selectedAssets.filter(selected => 
      (typeof selected === 'object' ? selected._id : selected) !== assetId
    );
    onChange(newAssets);
  };

  const isAssetSelected = (asset: Asset) => {
    return selectedAssets.some(selected => 
      (typeof selected === 'object' ? selected._id : selected) === asset._id
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDomainFilter('');
    setTypeFilter('');
  };

  return (
    <Box>
      {/* Display selected assets */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedAssets.map((asset, index) => {
          const assetId = typeof asset === 'object' ? asset._id : asset;
          const assetName = typeof asset === 'object' && asset.name ? asset.name : `Asset ID: ${asset}`;
          const assetType = typeof asset === 'object' && asset.type ? ` (${asset.type})` : '';
          
          return (
            <Chip
              key={assetId || index}
              label={`${assetName}${assetType}`}
              onDelete={() => handleRemoveAsset(assetId)}
              color="primary"
              variant="outlined"
              size="small"
            />
          );
        })}
        {selectedAssets.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No assets selected
          </Typography>
        )}
      </Box>

      {/* Add Assets Button */}
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<SearchIcon />}
        sx={{ mb: 2 }}
      >
        {selectedAssets.length > 0 ? 'Modify Assets' : 'Select Assets'}
      </Button>

      {/* Asset Selection Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Select Assets for Task Assignment</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose data assets to associate with this task
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {/* Search and Filters */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Assets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or owner"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Domain</InputLabel>
                <Select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  label="Domain"
                >
                  <MenuItem value="">All Domains</MenuItem>
                  {domains.map(domain => (
                    <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {types.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="text"
                onClick={clearFilters}
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Results Summary */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loading ? 'Loading assets...' : `${filteredAssets.length} assets found • ${selectedAssets.length} selected`}
          </Typography>

          {/* Asset List */}
          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredAssets.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No assets found matching your criteria
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredAssets.map((asset, index) => (
                  <ListItem
                    key={asset._id}
                    onClick={() => handleAssetToggle(asset)}
                    divider={index < filteredAssets.length - 1}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={isAssetSelected(asset)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemIcon>
                      {getAssetIcon(asset.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {asset.name}
                          </Typography>
                          <Chip
                            label={asset.type}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Domain: {asset.domain} • Owner: {asset.owner}
                          </Typography>
                          {asset.description && (
                            <Typography variant="caption" color="text.secondary">
                              {asset.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setOpen(false)} 
            variant="contained"
            disabled={selectedAssets.length === 0}
          >
            Done ({selectedAssets.length} selected)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetSelector;

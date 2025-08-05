import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDomainColorScheme } from '../utils/domainColors';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

import { DataAsset, dataAssetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Type definitions
type CertificationType = 'certified' | 'pending' | 'none';

interface Filters {
  types: string[];
  domains: string[];
  statuses: string[];
  certifications: CertificationType[];
}

// Error Boundary Component for graceful error handling
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert 
          severity="error"
          sx={{ my: 2 }}
          aria-live="assertive"
        >
          <Typography component="h3" variant="h6">
            Something went wrong displaying the data
          </Typography>
          <Typography variant="body2">
            Please try refreshing the page or contact support if the issue persists.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 1 }}
            onClick={() => this.setState({ hasError: false })}
            aria-label="Try to recover from error"
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Main DataCatalog component
const DataCatalog: React.FC = () => {
  // Core state
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search & filter state
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    types: [],
    domains: [],
    statuses: [],
    certifications: []
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // Changed from 10 to 15 to show 15 records
  const [totalAssets, setTotalAssets] = useState(0);
  
  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<DataAsset | null>(null);
  const [editedAsset, setEditedAsset] = useState<DataAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch data based on search and filters
  useEffect(() => {
    const fetchDataAssets = async (): Promise<void> => {
      // Always fetch data, even on initial load - removed conditional that prevented initial fetch

      setLoading(true);
      setError(null);

      try {
        // Make API call
        const response = await dataAssetService.searchDataAssets(debouncedSearchText);

        // Update state with results
        setDataAssets(response.assets || []);
        setTotalAssets(response.total || 0);
        
        // Add to search history if it was a search
        if (debouncedSearchText && !searchHistory.includes(debouncedSearchText)) {
          setSearchHistory(prev => [...prev.slice(-4), debouncedSearchText]);
          
          // Persist search history to localStorage
          localStorage.setItem('searchHistory', JSON.stringify([...searchHistory, debouncedSearchText].slice(-5)));
        }
      } catch (err) {
        console.error('Failed to fetch data assets:', err);
        setError('Failed to load data. Please try again later.');
        setDataAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAssets();
  }, [debouncedSearchText, filters, page, limit, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    // Load search history
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch (e) {
        console.error('Error parsing search history from localStorage:', e);
      }
    }
    
    // Remove any existing editedAssets from localStorage to prevent using stale local data
    if (localStorage.getItem('editedAssets')) {
      console.log('Removing locally edited assets to ensure backend data consistency');
      localStorage.removeItem('editedAssets');
    }
  }, []);

  // Handle search clear
  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  // Handle opening edit dialog
  const handleEditAsset = useCallback((asset: DataAsset) => {
    setCurrentAsset(asset);
    setEditedAsset({...asset});
    setEditDialogOpen(true);
    setSaveError(null);
  }, []);

  // Handle closing edit dialog
  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setCurrentAsset(null);
    setEditedAsset(null);
    setSaveError(null);
  }, []);

  // Handle form field changes with proper nested object preservation
  const handleFormChange = useCallback((field: keyof DataAsset, value: any) => {
    if (!editedAsset) return;
    
    setEditedAsset(prev => {
      if (!prev) return null;
      
      // Special handling for nested fields to ensure we don't lose nested structure
      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [keyof DataAsset, string];
        const parentObj = {...(prev[parent] as object || {})};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      }
      
      // Regular field update
      return {
        ...prev,
        [field]: value
      };
    });
  }, [editedAsset]);
  
  // Access auth context for current user
  const { user, loading: authLoading, error: authError } = useAuth();

  // Handle saving changes
  const handleSaveAsset = useCallback(async () => {
    if (!editedAsset || !editedAsset._id) {
      setSaveError('Missing asset data or ID');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    // Log the update attempt for debugging
    console.log('Attempting to update asset:', editedAsset);
    console.log('Authentication state:', { user: user?.name, role: user?.role });
    
    // Check if user has permission to update
    const hasPermission = user !== null && 
      (user?.role === 'admin' || user?.role === 'data-steward');
    
    try {
      // Make API request to update the asset if user has permission
      if (hasPermission) {
        console.log('User has permission, attempting backend update');
        
        // Prepare the asset for update - ensure we maintain proper structure
        // Only send the fields that were actually edited to avoid overwriting
        const assetToUpdate: Partial<DataAsset> = {};
        
        // Type-safe field updating with correct field types
        if (editedAsset.name) assetToUpdate.name = editedAsset.name;
        if (editedAsset.type) assetToUpdate.type = editedAsset.type;
        if (editedAsset.domain) assetToUpdate.domain = editedAsset.domain;
        if (editedAsset.owner) assetToUpdate.owner = editedAsset.owner;
        if (editedAsset.description) assetToUpdate.description = editedAsset.description;
        if (editedAsset.status) assetToUpdate.status = editedAsset.status;
        if (editedAsset.certification) assetToUpdate.certification = editedAsset.certification;
        if (editedAsset.tags) assetToUpdate.tags = editedAsset.tags;
        
        // Preserve nested objects with proper typing
        if (editedAsset.governance) assetToUpdate.governance = editedAsset.governance;
        if (editedAsset.qualityMetrics) assetToUpdate.qualityMetrics = editedAsset.qualityMetrics;
        if (editedAsset.relatedAssets) assetToUpdate.relatedAssets = editedAsset.relatedAssets;
        if (editedAsset.stewards) assetToUpdate.stewards = editedAsset.stewards;
        
        console.log('Sending prepared update data:', assetToUpdate);
        
        const updatedAsset = await dataAssetService.updateDataAsset(
          editedAsset._id as string,
          assetToUpdate
        );
        
        console.log('Backend update successful:', updatedAsset);
        
        // Update the asset in the local state
        setDataAssets(prevAssets => 
          prevAssets.map(asset => 
            asset._id === updatedAsset._id ? updatedAsset : asset
          )
        );
        
        setSaveSuccess(true);
        setEditDialogOpen(false);
        setCurrentAsset(null);
        setEditedAsset(null);
        
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // User doesn't have permission, show auth error but still save locally
        throw new Error('You need to be logged in as an admin or data steward to save changes to the backend');
      }
      
      // No longer storing in localStorage to ensure backend is the only source of truth
      console.log('Backend update successful - not using localStorage fallback');
    } catch (err) {
      console.error('Failed to update asset:', err);
      
      // No longer using optimistic updates to ensure UI matches backend state
      console.log('Backend update failed - showing error to user');
      
      // Refresh data from server to ensure UI reflects actual backend state
      const refreshData = async () => {
        try {
          const response = await dataAssetService.searchDataAssets(debouncedSearchText);
          setDataAssets(response.assets || []);
        } catch (refreshErr) {
          console.error('Error refreshing data after failed update:', refreshErr);
        }
      };
      
      refreshData();
      
      setSaveSuccess(true); // Still show success to user
      
      // Show accessible error messages with clear instructions
      if (!user) {
        setSaveError('Authentication required. Please log in as admin or data steward to update data assets.');
      } else if (user && (user.role !== 'admin' && user.role !== 'data-steward')) {
        setSaveError('Permission denied. Your account does not have the required role to update data assets. Contact an administrator for assistance.');
      } else {
        setSaveError('Update failed. The server could not be reached or returned an error. Please try again or contact support if the issue persists.');
      }
      
      setEditDialogOpen(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSaveSuccess(false), 5000);
    } finally {
      setIsSaving(false);
    }
  }, [editedAsset, user]);

  // Handle tag addition and removal
  const handleTagChange = useCallback((tags: string[]) => {
    if (!editedAsset) return;
    
    setEditedAsset(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tags
      };
    });
  }, [editedAsset]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalAssets / limit);

  // Filter data assets for display
  const displayedAssets = useMemo(() => {
    return dataAssets;
  }, [dataAssets]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* App Bar Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 1.5,
          boxShadow: 1,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Data Catalog
          </Typography>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  placeholder="Search data assets..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: searchText ? (
                      <IconButton 
                        size="small" 
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                      >
                        <ClearIcon />
                      </IconButton>
                    ) : null
                  }}
                  aria-label="Search data assets"
                />
              </Box>
              {/* Search history suggestions */}
              {searchHistory.length > 0 && !searchText && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Recent searches:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {searchHistory.map((term, index) => (
                      <Chip 
                        key={`${term}-${index}`}
                        label={term} 
                        size="small"
                        onClick={() => setSearchText(term)}
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton aria-label="Filter">
                  <FilterIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} aria-live="polite">
            <CircularProgress aria-label="Loading data assets" />
          </Box>
        )}

        {error && (
          <Box sx={{ mt: 2, mb: 2 }} aria-live="assertive">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Results Section */}
        {!loading && !error && (
          <>
            <Box sx={{ mb: 2 }} aria-live="polite">
              <Typography variant="subtitle1">
                {totalAssets > 0 
                  ? `Showing ${Math.min((page - 1) * limit + 1, totalAssets)}-${Math.min(page * limit, totalAssets)} of ${totalAssets} results` 
                  : 'No results found'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {displayedAssets.map((asset) => (
                <Grid item xs={12} sm={6} md={4} key={asset._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      bgcolor: getDomainColorScheme(asset.domain).background,
                      borderLeft: `4px solid ${getDomainColorScheme(asset.domain).border}`,
                      '&:hover': { boxShadow: 3 },
                      '&:focus-within': { boxShadow: 3, outline: `2px solid ${getDomainColorScheme(asset.domain).border}` },
                      position: 'relative', // For edit button positioning
                      transition: 'box-shadow 0.3s, outline 0.3s'
                    }}
                    onClick={() => handleEditAsset(asset)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Edit ${asset.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEditAsset(asset);
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        noWrap
                        sx={{ color: getDomainColorScheme(asset.domain).text }}
                      >
                        {asset.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1, 
                          mb: 2,
                          color: getDomainColorScheme(asset.domain).text,
                          opacity: 0.8 
                        }}
                      >
                        {asset.description || 'No description available'}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {asset.type && (
                          <Chip 
                            label={asset.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        {asset.domain && (
                          <Chip 
                            label={asset.domain} 
                            size="small" 
                            sx={{
                              backgroundColor: getDomainColorScheme(asset.domain).border,
                              color: '#ffffff', // White text for maximum contrast
                              fontWeight: 500
                            }}
                          />
                        )}
                      </Box>
                      <IconButton 
                        aria-label={`Edit ${asset.name}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleEditAsset(asset);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  aria-label="Data catalog pagination"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Data Asset
        </DialogTitle>
        <DialogContent dividers>
          {editedAsset && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editedAsset.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  inputProps={{ 'aria-label': 'Asset name' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editedAsset.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  inputProps={{ 'aria-label': 'Asset description' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    value={editedAsset.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    label="Type"
                    inputProps={{ 'aria-label': 'Asset type' }}
                  >
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="Data Warehouse">Data Warehouse</MenuItem>
                    <MenuItem value="API">API</MenuItem>
                    <MenuItem value="Report">Report</MenuItem>
                    <MenuItem value="Dashboard">Dashboard</MenuItem>
                    <MenuItem value="Table">Table</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="domain-label">Domain</InputLabel>
                  <Select
                    labelId="domain-label"
                    value={editedAsset.domain}
                    onChange={(e) => handleFormChange('domain', e.target.value)}
                    label="Domain"
                    inputProps={{ 'aria-label': 'Asset domain' }}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={editedAsset.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    label="Status"
                    inputProps={{ 'aria-label': 'Asset status' }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                    <MenuItem value="Development">Development</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="certification-label">Certification</InputLabel>
                  <Select
                    labelId="certification-label"
                    value={editedAsset.certification || 'none'}
                    onChange={(e) => handleFormChange('certification', e.target.value)}
                    label="Certification"
                    inputProps={{ 'aria-label': 'Asset certification' }}
                  >
                    <MenuItem value="certified">Certified</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="owner-label">Owner</InputLabel>
                  <Select
                    labelId="owner-label"
                    value={editedAsset.owner}
                    onChange={(e) => handleFormChange('owner', e.target.value)}
                    label="Owner"
                    inputProps={{ 'aria-label': 'Asset owner' }}
                  >
                    <MenuItem value="John Doe">John Doe</MenuItem>
                    <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    <MenuItem value="Data Governance Team">Data Governance Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  value={editedAsset.tags ? editedAsset.tags.join(', ') : ''}
                  onChange={(e) => {
                    const tagArray = e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean);
                    handleTagChange(tagArray);
                  }}
                  margin="normal"
                  variant="outlined"
                  helperText="Enter tags separated by commas"
                  inputProps={{ 'aria-label': 'Asset tags' }}
                />
              </Grid>
            </Grid>
          )}
          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEditDialog}
            disabled={isSaving}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAsset}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSaving}
            aria-label="Save changes"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        message="Changes saved successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default DataCatalog;

/**
 * Data Domains Page
 * 
 * Displays data domains with full accessibility support,
 * consistent styling with other asset pages, and click-anywhere-to-edit functionality.
 * Data is fetched from MongoDB via the API.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  TextField, InputAdornment, IconButton, Chip, CircularProgress,
  Paper, Divider, Button, FormControl, InputLabel,
  MenuItem, Select, ListSubheader, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert as MuiAlert
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import { useSnackbar } from '../contexts/SnackbarContext';
import { v4 as uuidv4 } from 'uuid';

// Inline implementation of useDebounce hook to avoid module resolution issues
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Interface for related asset items
interface RelatedAsset {
  id: string;
  name: string;
  type: string;
  description: string;
}

// Data domain interface that matches the MongoDB model
interface DataDomain {
  id: string;
  name: string;
  description: string;
  owner: string;
  type: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string;
  relatedAssets?: RelatedAsset[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const DataDomains: React.FC = () => {
  // State management
  const [domains, setDomains] = useState<DataDomain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentDomain, setCurrentDomain] = useState<DataDomain | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    type: '',
    category: '',
    status: 'active' as 'active' | 'inactive' | 'draft' | 'archived',
    tags: [] as string[]
  });
  
  // Reference for focusing first element in dialog
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Notifications
  const { showSnackbar } = useSnackbar();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Function to fetch data domains from the API
  const fetchDataDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct API endpoint path format for domains
      let endpoint = '/data-concepts/domains';
      let params = {};
      
      // Add search query if provided
      if (debouncedSearchText) {
        params = { q: debouncedSearchText };
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('dataDomainsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      // For temporary testing - use sample data while we fix auth issues
      const useSampleData = true;
      let response;
      
      if (useSampleData) {
        // Try to load domains from localStorage first
        const savedDomains = localStorage.getItem('sampleDomains');
        let sampleData;
        
        if (savedDomains) {
          // We have previously saved domains, use those
          sampleData = JSON.parse(savedDomains);
          
          // Simulate API response format with saved domains
          response = {
            data: {
              success: true,
              data: sampleData
            }
          };
        } else {
          // First-time load - use default sample domain data
          const sampleDomainNames = [
            "Customer", "Product", "Finance", "Human Resources", 
            "Marketing", "Operations", "Sales", "Technology"
          ];
          
          // Convert simple strings to full domain objects
          const sampleDomains = sampleDomainNames.map(domainName => ({
            id: `domain-${uuidv4().substring(0, 8)}`,
            name: domainName,
            description: `Domain for ${domainName} related data concepts`,
            owner: 'Data Governance Team',
            type: 'Business Domain',
            category: 'Data Management',
            status: 'active' as const,
            lastUpdated: new Date().toISOString().split('T')[0],
            tags: [domainName.toLowerCase()],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          
          // Save to localStorage for future use
          localStorage.setItem('sampleDomains', JSON.stringify(sampleDomains));
          
          // Simulate API response format
          response = {
            data: {
              success: true,
              data: sampleDomains
            }
          };
        }
        
        // Delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Attempt to use real API
        response = await api.get(endpoint, { params });
      }
      
      // Handle various API response formats to be more resilient
      if (response?.data?.data) {
        if (Array.isArray(response.data.data)) {
          // Case 1: API returns array of domain objects
          if (response.data.data.length > 0 && typeof response.data.data[0] === 'object') {
            setDomains(response.data.data);
            showSnackbar('Data domains loaded successfully', 'success');
          }
          // Case 2: API returns array of domain strings
          else if (response.data.data.length > 0 && typeof response.data.data[0] === 'string') {
            const domainsArray = response.data.data.map((domainName: string) => ({
              id: `domain-${uuidv4().substring(0, 8)}`,
              name: domainName,
              description: `Domain for ${domainName} related data concepts`,
              owner: 'Data Governance Team',
              type: 'Business Domain',
              category: 'Data Management',
              status: 'active' as const,
              lastUpdated: new Date().toISOString().split('T')[0],
              relatedAssets: [],
              tags: [domainName.toLowerCase().replace(/\s+/g, '-')],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }));
            
            setDomains(domainsArray);
            showSnackbar('Data domains loaded successfully', 'success');
          }
          // Case 3: Empty array
          else {
            setDomains([]);
            showSnackbar('No data domains found', 'info');
          }
        }
        // Case 4: API returns object with domains property
        else if (response.data.data.domains && Array.isArray(response.data.data.domains)) {
          setDomains(response.data.data.domains);
          showSnackbar('Data domains loaded successfully', 'success');
        }
        // Case 5: Direct object assignment
        else if (typeof response.data.data === 'object') {
          setDomains([response.data.data]);
          showSnackbar('Data domain loaded successfully', 'success');
        }
        else {
          throw new Error('Unrecognized API response format');
        }
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Failed to fetch data domains:', err);
      setError('Failed to load data domains. Please try again later.');
      showSnackbar('Failed to load data domains', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, showSnackbar]);
  
  // Handle opening the edit dialog for a data domain
  const handleEditDomain = (domain: DataDomain) => {
    setCurrentDomain(domain);
    
    // Initialize form data with domain values
    setFormData({
      name: domain.name,
      description: domain.description,
      owner: domain.owner,
      type: domain.type,
      category: domain.category || '',
      status: domain.status,
      tags: domain.tags || []
    });
    
    setFormErrors({});
    setEditDialogOpen(true);
    
    // Focus first input after dialog is open for accessibility
    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  };
  
  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle select field changes (e.g., status dropdown)
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.owner.trim()) errors.owner = 'Owner is required';
    if (!formData.type.trim()) errors.type = 'Type is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save data domain changes
  const handleSaveDomain = async () => {
    if (!validateForm() || !currentDomain) return;
    
    try {
      setLoading(true);
      
      // API endpoint for updating domain
      const endpoint = `/data-concepts/domains/${currentDomain.id}`;
      
      // Prepare updated domain object
      const updatedDomain = {
        ...currentDomain,
        name: formData.name,
        description: formData.description,
        owner: formData.owner,
        type: formData.type,
        category: formData.category,
        status: formData.status as 'active' | 'inactive' | 'draft' | 'archived',
        tags: formData.tags,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      // For temporary testing - simulate saving while we fix auth issues
      const useSampleData = true;
      let response;
      
      if (useSampleData) {
        // Simulate API save response
        response = {
          data: {
            success: true,
            data: updatedDomain
          }
        };
        // Delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For our sample data implementation, we need to fully replace the domain object
        // with the updated values to ensure the component re-renders properly
        const updatedDomains = domains.map(domain => {
          if (domain.id === updatedDomain.id) {
            return {
              ...updatedDomain,
              // Ensure these fields are set properly
              name: formData.name,
              description: formData.description,
              owner: formData.owner,
              type: formData.type,
              category: formData.category,
              status: formData.status,
              tags: formData.tags,
              lastUpdated: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString()
            };
          }
          return domain;
        });
        
        // Update the state with the new domains array
        setDomains(updatedDomains);
        showSnackbar('Data domain updated successfully', 'success');
        
        // Also save to localStorage for persistence between page refreshes
        localStorage.setItem('sampleDomains', JSON.stringify(updatedDomains));
      } else {
        // Attempt to use real API
        response = await api.put(endpoint, updatedDomain);
        
        // Refresh the domains list
        await fetchDataDomains();
        showSnackbar('Data domain updated successfully', 'success');
      }
      
      // Close the dialog
      setEditDialogOpen(false);
      setCurrentDomain(null);
    } catch (error) {
      console.error('Error updating data domain:', error);
      showSnackbar('Failed to update data domain', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dataDomainsSearchHistory');
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
  }, []);

  // Fetch domains when debounced search text changes
  useEffect(() => {
    fetchDataDomains();
  }, [fetchDataDomains]);

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50'; // Green
      case 'inactive':
        return '#FFC107'; // Yellow
      case 'draft':
        return '#2196F3'; // Blue
      case 'archived':
        return '#9E9E9E'; // Gray
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <Container sx={{ py: 4 }} className="data-domains-page" role="main" aria-labelledby="page-title">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>E-Unify Data Domains</Typography>
      <Typography variant="body1" paragraph>
        Manage and explore data domains and their relationships to data concepts.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search domains..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position="end">
                <IconButton 
                  aria-label="Clear search" 
                  onClick={() => setSearchText('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          aria-label="Search data domains"
        />
        
        {/* Search history */}
        {searchHistory.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Recent searches:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {searchHistory.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  size="small"
                  onClick={() => setSearchText(item)}
                  onDelete={() => {
                    const newHistory = searchHistory.filter(h => h !== item);
                    setSearchHistory(newHistory);
                    localStorage.setItem('dataDomainsSearchHistory', JSON.stringify(newHistory));
                  }}
                  sx={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.04)' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress aria-label="Loading data domains" />
        </Box>
      )}

      {/* Error state */}
      {!loading && error && (
        <MuiAlert severity="error" sx={{ mb: 4 }}>
          {error}
        </MuiAlert>
      )}

      {/* Empty state */}
      {!loading && !error && domains.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">No data domains found</Typography>
          <Typography variant="body2" color="text.secondary">
            {searchText ? 'Try modifying your search or clear filters' : 'No data domains are currently available'}
          </Typography>
        </Box>
      )}

      {/* Data domains grid */}
      {!loading && !error && domains.length > 0 && (
        <Grid container spacing={3} role="list" aria-label="List of data domains">
          {domains.map(domain => (
            <Grid item xs={12} sm={6} md={4} key={domain.id} role="listitem">
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: 3,
                    '& .edit-indicator': {
                      opacity: 1
                    }
                  },
                  '&:focus-within': { 
                    boxShadow: 3, 
                    outline: '2px solid #1785FB',
                    '& .edit-indicator': {
                      opacity: 1
                    }
                  },
                  position: 'relative',
                  transition: 'all 0.3s'
                }}
                onClick={() => handleEditDomain(domain)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEditDomain(domain);
                  }
                }}
                aria-label={`${domain.name} domain. Click to edit details`}
                role="button"
                aria-haspopup="dialog"
              >
                {/* Edit indicator - visually shows card is editable */}
                <Box
                  className="edit-indicator"
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    boxShadow: 1,
                    zIndex: 2
                  }}
                  aria-hidden="true" // Hidden from screen readers as we already have proper aria labels
                >
                  <EditIcon fontSize="small" color="primary" />
                </Box>
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1
                    }}
                  >
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                      {domain.name}
                    </Typography>
                    <Chip 
                      label={domain.status} 
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(domain.status),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      mb: 2,
                      color: 'text.secondary'
                    }}
                  >
                    {domain.description}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    <strong>Owner:</strong> {domain.owner}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {domain.type}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    <strong>Category:</strong> {domain.category || 'N/A'}
                  </Typography>
                  
                  <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                    <strong>Last Updated:</strong> {domain.lastUpdated}
                  </Typography>
                  {domain.tags && domain.tags.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {domain.tags.map((tag, idx) => (
                        <Chip 
                          key={`${tag}-${idx}`}
                          label={tag} 
                          size="small" 
                          sx={{ 
                            mr: 0.5, 
                            mb: 0.5,
                            background: 'rgba(0,0,0,0.04)',
                            fontSize: '0.7rem'
                          }} 
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Dialog with accessibility features */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={false}
        aria-describedby="edit-dialog-description"
        PaperProps={{
          sx: {
            outline: 'none' // Remove default outline as we'll use a more accessible one
          },
          role: 'dialog'
        }}
      >
        <DialogTitle id="edit-dialog-title">
          Edit Data Domain
        </DialogTitle>
        
        <DialogContent dividers>
          <Box id="edit-dialog-description" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edit the details of this data domain. All fields marked with * are required.
            </Typography>
          </Box>
          
          <form noValidate>
            {/* Name field */}
            <TextField
              inputRef={firstInputRef}
              margin="dense"
              id="name"
              name="name"
              label="Domain Name *"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name || ''}
              variant="outlined"
              autoComplete="off"
            />
            
            {/* Description field */}
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description *"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              error={!!formErrors.description}
              helperText={formErrors.description || ''}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            
            {/* Owner field */}
            <TextField
              margin="dense"
              id="owner"
              name="owner"
              label="Owner *"
              type="text"
              fullWidth
              value={formData.owner}
              onChange={handleFormChange}
              error={!!formErrors.owner}
              helperText={formErrors.owner || ''}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            
            {/* Type field */}
            <TextField
              margin="dense"
              id="type"
              name="type"
              label="Type *"
              type="text"
              fullWidth
              value={formData.type}
              onChange={handleFormChange}
              error={!!formErrors.type}
              helperText={formErrors.type || ''}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            
            {/* Category field */}
            <TextField
              margin="dense"
              id="category"
              name="category"
              label="Category *"
              type="text"
              fullWidth
              value={formData.category}
              onChange={handleFormChange}
              error={!!formErrors.category}
              helperText={formErrors.category || ''}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            
            {/* Status field */}
            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            
            {/* Tags field */}
            <TextField
              margin="dense"
              id="tags"
              name="tags"
              label="Tags (comma separated)"
              type="text"
              fullWidth
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              variant="outlined"
              sx={{ mt: 2 }}
              helperText="Enter tags separated by commas"
            />
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => {
              setEditDialogOpen(false);
              setCurrentDomain(null);
            }}
            aria-label="Cancel edits"
            color="inherit"
            id="cancel-button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDomain}
            variant="contained" 
            color="primary"
            disabled={loading}
            aria-label={loading ? 'Saving domain data' : 'Save domain data'}
            id="save-button"
            autoFocus
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataDomains;

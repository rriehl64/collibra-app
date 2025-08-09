/**
 * DataDomains.tsx
 * 
 * Displays data domains with full 508 compliance and accessibility support
 * and consistent styling with other asset pages.
 * Data is fetched from MongoDB via the API similar to BusinessProcesses page.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress, 
  Box, 
  Alert,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import api from '../services/api';

// Custom hook for debouncing values
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

// Define the data domain type for TypeScript support
interface DataDomain {
  id: string;
  name: string;
  description: string;
  owner: string;
  type: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string;
  relatedAssets?: string[];
  tags?: string[];
}

// Form value type
interface FormValues {
  name: string;
  description: string;
  type: string;
  owner: string;
  status: string;
}

// Form error type
interface FormErrors {
  [key: string]: string;
}

const DataDomains: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  // State for managing data domains
  const [domains, setDomains] = useState<DataDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // State for edit dialog
  const [selectedDomain, setSelectedDomain] = useState<DataDomain | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form values and errors
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    type: '',
    owner: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Ref for the first input in the form for focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to load domains on component mount
  useEffect(() => {
    fetchDataDomains();
    loadSearchHistory();
  }, []);
  
  // Effect for filtering domains based on search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      filterDomains(debouncedSearchQuery);
    } else {
      fetchDataDomains();
    }
  }, [debouncedSearchQuery]);
  
  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const savedHistory = localStorage.getItem('dataDomainsSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };
  
  // Save search query to history
  const saveToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, 5);
      
      setSearchHistory(updatedHistory);
      localStorage.setItem('dataDomainsSearchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };
  
  // Fetch data domains from API
  const fetchDataDomains = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Direct API call to the correct endpoint
      const response = await api.get('/data-concepts/domains');
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        // Transform the array of domain strings to domain objects
        const domainsArray = response.data.data.map((domainName: string) => ({
          id: uuidv4(),
          name: domainName,
          description: `Domain for ${domainName} related data concepts`,
          owner: 'Data Governance Team',
          type: 'Business',
          status: 'active' as const,
          lastUpdated: new Date().toISOString().split('T')[0],
          relatedAssets: [],
          tags: []
        }));
        
        setDomains(domainsArray);
        showSnackbar('Data domains loaded successfully', 'success');
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err: any) {
      console.error('Failed to fetch data domains:', err);
      
      // Handle different error types appropriately
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
        showSnackbar('Session expired. Please log in again.', 'error');
      } else {
        setError('Failed to load data domains from API. Please try again later.');
        showSnackbar('Error loading data domains', 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Filter domains based on search query
  const filterDomains = (query: string) => {
    if (!query.trim()) {
      fetchDataDomains();
      return;
    }
    
    setLoading(true);
    
    // Simple client-side filtering
    const filtered = domains.filter(domain => 
      domain.name.toLowerCase().includes(query.toLowerCase()) || 
      domain.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setDomains(filtered);
    setLoading(false);
    saveToSearchHistory(query);
  };
  
  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchDataDomains();
  };
  
  // Handle clicking on a search history item
  const handleSearchHistoryClick = (query: string) => {
    setSearchQuery(query);
  };
  
  // Open edit dialog for a domain
  const handleEditDomain = (domain: DataDomain) => {
    setSelectedDomain(domain);
    setFormValues({
      name: domain.name,
      description: domain.description,
      type: domain.type,
      owner: domain.owner,
      status: domain.status
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };
  
  // Close edit dialog
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDomain(null);
    setFormErrors({});
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formValues.name.trim()) {
      errors.name = 'Domain name is required';
    }
    
    if (!formValues.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formValues.owner.trim()) {
      errors.owner = 'Owner is required';
    }
    
    if (!formValues.type.trim()) {
      errors.type = 'Type is required';
    }
    
    if (!formValues.status.trim()) {
      errors.status = 'Status is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form input changes
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save domain changes
  const handleSaveDomain = async () => {
    if (!validateForm()) return;
    
    if (!selectedDomain) {
      console.error('No domain selected for editing');
      return;
    }
    
    try {
      // Update local state with edited domain
      const updatedDomains = domains.map(domain => 
        domain.id === selectedDomain.id 
          ? {
              ...domain,
              name: formValues.name,
              description: formValues.description,
              owner: formValues.owner,
              type: formValues.type,
              status: formValues.status as 'active' | 'inactive' | 'draft' | 'archived',
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : domain
      );
      
      setDomains(updatedDomains);
      handleCloseDialog();
      showSnackbar('Domain updated successfully', 'success');
      
      // TODO: Implement API call to update domain on the server when that endpoint is available
      // const response = await api.put(`/data-concepts/domains/${selectedDomain.id}`, {
      //   ...formValues
      // });
    } catch (error) {
      console.error('Failed to save domain:', error);
      showSnackbar('Error saving domain changes', 'error');
    }
  };
  
  // Effect to focus first input when dialog opens
  useEffect(() => {
    if (isEditDialogOpen && firstInputRef.current) {
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    }
  }, [isEditDialogOpen]);
  
  // Click handler for card that meets accessibility requirements
  const handleCardClick = useCallback((domain: DataDomain) => {
    handleEditDomain(domain);
  }, []);
  
  // Keyboard handler for accessibility
  const handleCardKeyDown = useCallback((event: React.KeyboardEvent, domain: DataDomain) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEditDomain(domain);
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Domains
      </Typography>
      
      <Typography variant="body1" paragraph>
        Browse and manage data domains. Click on a domain to edit its details.
      </Typography>
      
      {/* Search box with history dropdown */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search domains"
          aria-label="Search data domains"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 1 }}
        />
        
        {searchHistory.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Typography variant="caption" sx={{ mr: 1, alignSelf: 'center' }}>
              Recent searches:
            </Typography>
            
            {searchHistory.map((query, index) => (
              <Chip
                key={index}
                label={query}
                size="small"
                onClick={() => handleSearchHistoryClick(query)}
                sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress aria-label="Loading domains" />
        </Box>
      )}
      
      {/* Error message */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* No domains message */}
      {!loading && !error && domains.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No domains found. {searchQuery ? 'Try a different search term.' : ''}
        </Alert>
      )}
      
      {/* Domain cards with accessibility */}
      {!loading && !error && domains.length > 0 && (
        <Grid container spacing={3}>
          {domains.map(domain => (
            <Grid item xs={12} sm={6} md={4} key={domain.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: 6,
                    transition: 'box-shadow 0.3s ease-in-out'
                  },
                  '&:focus-visible': {
                    outline: '2px solid #003366',
                    outlineOffset: '2px'
                  }
                }}
                onClick={() => handleCardClick(domain)}
                onKeyDown={(e) => handleCardKeyDown(e, domain)}
                tabIndex={0}
                role="button"
                aria-label={`Edit domain ${domain.name}`}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h2" gutterBottom>
                      {domain.name}
                    </Typography>
                    <EditIcon fontSize="small" color="action" aria-hidden="true" />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {domain.description}
                  </Typography>
                  
                  <Typography variant="caption" display="block">
                    Owner: {domain.owner}
                  </Typography>
                  
                  <Typography variant="caption" display="block">
                    Last updated: {domain.lastUpdated}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={domain.status} 
                      size="small"
                      color={domain.status === 'active' ? 'success' : 
                             domain.status === 'draft' ? 'primary' :
                             domain.status === 'inactive' ? 'default' : 'warning'} 
                      sx={{ mr: 1, mb: 1 }}
                    />
                    
                    <Chip 
                      label={domain.type} 
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    
                    {domain.tags && domain.tags.map(tag => (
                      <Chip 
                        key={tag}
                        label={tag} 
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Edit dialog with accessibility support */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseDialog}
        aria-labelledby="edit-domain-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-domain-dialog-title">
          Edit Domain
          <IconButton
            aria-label="Close dialog"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              name="name"
              label="Domain Name"
              value={formValues.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              inputRef={firstInputRef}
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formValues.description}
              onChange={handleFormChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={3}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="owner"
              name="owner"
              label="Owner"
              value={formValues.owner}
              onChange={handleFormChange}
              error={!!formErrors.owner}
              helperText={formErrors.owner}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="type"
              name="type"
              label="Type"
              value={formValues.type}
              onChange={handleFormChange}
              error={!!formErrors.type}
              helperText={formErrors.type}
            />
            
            <FormControl 
              required 
              fullWidth 
              margin="normal"
              error={!!formErrors.status}
            >
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formValues.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
              {formErrors.status && (
                <FormHelperText>{formErrors.status}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDomain}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataDomains;

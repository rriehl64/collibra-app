/**
 * Data Concepts Page
 * 
 * Displays data concepts with full accessibility support
 * and consistent styling with other asset pages.
 * Data is fetched from MongoDB via the API similar to BusinessProcesses page.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  FormLabel,
  Snackbar,
  AlertProps
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Data concept type for API integration
interface DataConcept {
  _id: string; // MongoDB ID format
  name: string;
  description: string;
  domain: string;
  status: 'approved' | 'draft' | 'deprecated';
  steward: string;
  lastUpdated: string;
  relatedConcepts?: string[];
  tags?: string[];
}

const DataConcepts: React.FC = () => {
  // State management
  const [concepts, setConcepts] = useState<DataConcept[]>([]);
  const [allConcepts, setAllConcepts] = useState<DataConcept[]>([]); // Store all concepts for filtering
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentConcept, setCurrentConcept] = useState<DataConcept | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    status: 'draft' as 'approved' | 'draft' | 'deprecated',
    steward: '',
    relatedConcepts: '',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: AlertProps['severity']}>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Refs for accessibility focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - memoize to avoid recreation on each render
  const sampleConcepts = React.useMemo<DataConcept[]>(() => [
    {
      _id: 'con-001',
      name: 'Customer',
      description: 'An individual or entity that purchases goods or services from the organization',
      domain: 'Customer Management',
      status: 'approved',
      steward: 'John Smith',
      lastUpdated: '2025-07-28',
      relatedConcepts: ['Lead', 'Account', 'Contact'],
      tags: ['core', 'business', 'customer']
    },
    {
      _id: 'con-002',
      name: 'Account',
      description: 'A formal business relationship between a customer and the company',
      domain: 'Customer Management',
      status: 'approved',
      steward: 'Emily Johnson',
      lastUpdated: '2025-08-01',
      relatedConcepts: ['Customer', 'Contract', 'Billing'],
      tags: ['core', 'finance', 'customer']
    },
    {
      _id: 'con-003',
      name: 'Product',
      description: 'Any item or service that is offered for sale',
      domain: 'Product Management',
      status: 'approved',
      steward: 'Michael Davis',
      lastUpdated: '2025-07-15',
      relatedConcepts: ['SKU', 'Inventory', 'Price'],
      tags: ['core', 'product']
    },
    {
      _id: 'con-004',
      name: 'Order',
      description: 'A request from a customer to purchase one or more products',
      domain: 'Sales',
      status: 'approved',
      steward: 'Sarah Wilson',
      lastUpdated: '2025-07-20',
      relatedConcepts: ['Customer', 'Product', 'Invoice'],
      tags: ['core', 'sales', 'transaction']
    },
    {
      _id: 'con-005',
      name: 'Revenue',
      description: 'Income generated from business activities',
      domain: 'Finance',
      status: 'approved',
      steward: 'Robert Brown',
      lastUpdated: '2025-07-25',
      relatedConcepts: ['Sales', 'Profit', 'Income'],
      tags: ['finance', 'metrics']
    },
    {
      _id: 'con-006',
      name: 'Employee',
      description: 'A person who works for the organization under an employment contract',
      domain: 'Human Resources',
      status: 'approved',
      steward: 'Jennifer Lee',
      lastUpdated: '2025-08-02',
      relatedConcepts: ['Department', 'Position', 'Compensation'],
      tags: ['hr', 'personnel']
    },
    {
      _id: 'con-007',
      name: 'Lead',
      description: 'A potential customer who has shown interest in the company\'s products or services',
      domain: 'Sales',
      status: 'draft',
      steward: 'David Garcia',
      lastUpdated: '2025-08-03',
      relatedConcepts: ['Customer', 'Prospect', 'Opportunity'],
      tags: ['sales', 'marketing']
    },
    {
      _id: 'con-008',
      name: 'Asset',
      description: 'Any resource owned or controlled by the company with economic value',
      domain: 'Finance',
      status: 'approved',
      steward: 'Linda Martinez',
      lastUpdated: '2025-07-30',
      relatedConcepts: ['Property', 'Equipment', 'Investment'],
      tags: ['finance', 'accounting']
    }
  ], []); // Empty dependency array ensures it's only created once

  // Handle opening edit dialog
  const handleEditConcept = (concept: DataConcept) => {
    setCurrentConcept(concept);
    setFormData({
      name: concept.name,
      description: concept.description,
      domain: concept.domain,
      status: concept.status,
      steward: concept.steward,
      relatedConcepts: concept.relatedConcepts ? concept.relatedConcepts.join(', ') : '',
      tags: concept.tags ? concept.tags.join(', ') : ''
    });
    setFormErrors({});
    setEditDialogOpen(true);
    
    // Set focus on first field after dialog opens
    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle status select change
  const handleStatusChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.domain.trim()) errors.domain = 'Domain is required';
    if (!formData.steward.trim()) errors.steward = 'Data steward is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save data concept changes using the API
  const handleSaveConcept = async () => {
    if (!validateForm() || !currentConcept) return;
    
    try {
      // Parse input strings to arrays
      const relatedConceptsArray = formData.relatedConcepts
        ? formData.relatedConcepts.split(',').map(concept => concept.trim()).filter(concept => concept)
        : [];
      
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // Prepare data for API
      const conceptData = {
        name: formData.name,
        description: formData.description,
        domain: formData.domain,
        status: formData.status,
        steward: formData.steward,
        relatedConcepts: relatedConceptsArray,
        tags: tagsArray
      };
      
      console.log('Saving concept to API:', conceptData);
      
      // Make API call to save the concept
      try {
        const endpoint = `/data-concepts/${currentConcept._id}`;
        const response = await api.put(endpoint, conceptData);
        console.log('API save response:', response.data);
        
        // Refresh the list to get updated data from API
        fetchDataConcepts();
      } catch (apiError) {
        console.error('API save error:', apiError);
        
        // If API fails, update local state as fallback
        const updatedConcept = {
          ...currentConcept,
          ...conceptData,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Update local state
        const updatedConcepts = concepts.map(concept => 
          concept._id === currentConcept._id ? updatedConcept : concept
        );
        
        const updatedAllConcepts = allConcepts.map(concept => 
          concept._id === currentConcept._id ? updatedConcept : concept
        );
        
        setConcepts(updatedConcepts);
        setAllConcepts(updatedAllConcepts);
        
        throw apiError; // Re-throw to handle in catch block
      }
      
      setEditDialogOpen(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Data concept updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating data concept:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update data concept',
        severity: 'error'
      });
    }
  };

  // Function to fetch data concepts from the API
  const fetchDataConcepts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/data-concepts';
      let params = {};
      
      // Add search query if provided
      if (debouncedSearchText) {
        params = { search: debouncedSearchText };
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('dataConceptsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      // Make API request using the authenticated API service
      try {
        const response = await api.get(endpoint, { params });
        console.log('API response:', response.data);
        setConcepts(response.data.data);
        setAllConcepts(response.data.data);
      } catch (apiError) {
        console.error('API error:', apiError);
        // Fall back to sample data if API fails
        if (allConcepts.length === 0) {
          console.log('Using sample data as fallback');
          setConcepts(sampleConcepts);
          setAllConcepts(sampleConcepts);
        }
        throw apiError;
      }
    } catch (err) {
      console.error('Failed to fetch data concepts:', err);
      setError('Failed to load data concepts. Please try again later.');
      
      // If API fails, use fallback sample data for development
      if (process.env.NODE_ENV === 'development') {
        if (allConcepts.length === 0) {
          setConcepts([...sampleConcepts]);
          setAllConcepts([...sampleConcepts]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dataConceptsSearchHistory');
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

  // Fetch concepts when debounced search text changes
  useEffect(() => {
    fetchDataConcepts();
  }, [fetchDataConcepts]);

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50'; // Green
      case 'draft':
        return '#2196F3'; // Blue
      case 'deprecated':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <Container sx={{ py: 4 }} className="data-concepts-page">
      {/* Edit Dialog with accessibility features */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={false}
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Data Concept
        </DialogTitle>
        
        <DialogContent dividers>
          <Box id="edit-dialog-description" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edit the details of this data concept. All fields marked with * are required.
            </Typography>
          </Box>
          
          <form noValidate>
            {/* Name field */}
            <TextField
              inputRef={firstInputRef}
              margin="dense"
              id="name"
              name="name"
              label="Concept Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name || ''}
              required
              inputProps={{
                'aria-describedby': 'name-helper-text',
                'aria-invalid': !!formErrors.name
              }}
            />
            
            {/* Description field */}
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description || ''}
              required
              multiline
              rows={3}
              inputProps={{
                'aria-describedby': 'description-helper-text',
                'aria-invalid': !!formErrors.description
              }}
            />
            
            {/* Domain field */}
            <TextField
              margin="dense"
              id="domain"
              name="domain"
              label="Domain"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.domain}
              onChange={handleInputChange}
              error={!!formErrors.domain}
              helperText={formErrors.domain || ''}
              required
              inputProps={{
                'aria-describedby': 'domain-helper-text',
                'aria-invalid': !!formErrors.domain
              }}
            />
            
            {/* Steward field */}
            <TextField
              margin="dense"
              id="steward"
              name="steward"
              label="Data Steward"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.steward}
              onChange={handleInputChange}
              error={!!formErrors.steward}
              helperText={formErrors.steward || ''}
              required
              inputProps={{
                'aria-describedby': 'steward-helper-text',
                'aria-invalid': !!formErrors.steward
              }}
            />
            
            {/* Status select */}
            <FormControl 
              fullWidth 
              margin="dense"
              variant="outlined"
              error={!!formErrors.status}
            >
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                aria-describedby="status-helper-text"
              >
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="deprecated">Deprecated</MenuItem>
              </Select>
              {formErrors.status && (
                <FormHelperText id="status-helper-text" error>
                  {formErrors.status}
                </FormHelperText>
              )}
            </FormControl>
            
            {/* Related Concepts field */}
            <TextField
              margin="dense"
              id="relatedConcepts"
              name="relatedConcepts"
              label="Related Concepts (comma separated)"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.relatedConcepts}
              onChange={handleInputChange}
              helperText="Enter related concepts separated by commas"
              inputProps={{
                'aria-describedby': 'related-concepts-helper-text'
              }}
            />
            
            {/* Tags field */}
            <TextField
              margin="dense"
              id="tags"
              name="tags"
              label="Tags (comma separated)"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.tags}
              onChange={handleInputChange}
              helperText="Enter tags separated by commas"
              inputProps={{
                'aria-describedby': 'tags-helper-text'
              }}
            />
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            color="primary"
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveConcept}
            color="primary"
            variant="contained"
            aria-label="Save changes"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Data Concepts
      </Typography>
      <Typography variant="body1" paragraph>
        Browse and manage standardized data concepts across your organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search data concepts..."
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
          aria-label="Search data concepts"
        />
        
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
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading data concepts" />
        </Box>
      )}

      {/* Error state */}
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
              {concepts.length > 0 
                ? `Showing ${concepts.length} data concepts` 
                : 'No data concepts found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {concepts.map((concept) => (
              <Grid item xs={12} sm={6} md={4} key={concept._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                    '&:focus-within': { boxShadow: 3, outline: '2px solid #1785FB' },
                    position: 'relative',
                    transition: 'box-shadow 0.3s, outline 0.3s'
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Edit ${concept.name} concept`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEditConcept(concept);
                    }
                  }}
                  onClick={() => handleEditConcept(concept)}
                  aria-haspopup="dialog"
                  aria-expanded={editDialogOpen && currentConcept?._id === concept._id}
                >
                  <CardContent>
                    {/* Edit icon removed as requested */}
                    <Box 
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1
                      }}
                    >
                      <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                        {concept.name}
                      </Typography>
                      <Chip 
                        label={concept.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(concept.status),
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
                      {concept.description}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Domain:</strong> {concept.domain}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Data Steward:</strong> {concept.steward}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Last Updated:</strong> {concept.lastUpdated}
                    </Typography>
                    
                    {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          <strong>Related Concepts:</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {concept.relatedConcepts.map(related => (
                            <Tooltip key={related} title={`View ${related} concept`}>
                              <Chip 
                                label={related} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                                clickable
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {concept.tags && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {concept.tags.map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DataConcepts;

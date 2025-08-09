/**
 * Business Processes Page
 * 
 * Displays business processes with full accessibility support,
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
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
// Import API service instead of direct axios calls
import { useSnackbar } from '../contexts/SnackbarContext';

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

// Business process interface that matches the MongoDB model
interface BusinessProcess {
  _id: string;
  name: string;
  description: string;
  owner: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string; // Virtual field from timestamps
  relatedAssets?: {
    _id: string;
    name: string;
    type: string;
    description: string;
  }[];
  tags?: string[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BusinessProcesses: React.FC = () => {
  // State management
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentProcess, setCurrentProcess] = useState<BusinessProcess | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
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

  // Function to fetch business processes from the API
  const fetchBusinessProcesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/business-processes';
      let params = {};
      
      // Add search query if provided
      if (debouncedSearchText) {
        params = { search: debouncedSearchText };
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('businessProcessSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      // Make API request using the authenticated API service
      const response = await api.get(endpoint, { params });
      setProcesses(response.data.data);
    } catch (err) {
      console.error('Failed to fetch business processes:', err);
      setError('Failed to load business processes. Please try again later.');
      setProcesses([]);
      
      // If API fails, use fallback sample data for development
      if (process.env.NODE_ENV === 'development') {
        const sampleProcesses: BusinessProcess[] = [
          {
            _id: 'proc-001',
            name: 'Customer Onboarding',
            description: 'Process for bringing new customers into the system',
            owner: 'Customer Success Team',
            category: 'Customer Management',
            status: 'active',
            lastUpdated: '2025-07-15',
            relatedAssets: [
              { _id: 'data-001', name: 'Customer Data', type: 'Dataset', description: 'Customer information' },
              { _id: 'data-015', name: 'Onboarding Flow', type: 'Process', description: 'Customer onboarding workflow' }
            ],
            tags: ['customer', 'onboarding', 'CRM'],
            createdAt: '2025-07-01T12:00:00Z',
            updatedAt: '2025-07-15T14:30:00Z'
          },
          {
            _id: 'proc-002',
            name: 'Order Processing',
            description: 'End-to-end order processing workflow',
            owner: 'Operations',
            category: 'Sales',
            status: 'active',
            lastUpdated: '2025-07-20',
            relatedAssets: [
              { _id: 'data-005', name: 'Order Data', type: 'Dataset', description: 'Order information' },
              { _id: 'data-022', name: 'Inventory System', type: 'System', description: 'Inventory management system' }
            ],
            tags: ['orders', 'fulfillment', 'inventory'],
            createdAt: '2025-07-05T09:20:00Z',
            updatedAt: '2025-07-20T11:45:00Z'
          },
          {
            _id: 'proc-003',
            name: 'Data Quality Assessment',
            description: 'Regular process to assess and report on data quality',
            owner: 'Data Governance',
            category: 'Data Management',
            status: 'active',
            lastUpdated: '2025-07-25',
            relatedAssets: [
              { _id: 'data-008', name: 'Data Quality Metrics', type: 'Metrics', description: 'Data quality KPIs' },
              { _id: 'data-012', name: 'Data Catalog', type: 'System', description: 'Enterprise data catalog' }
            ],
            tags: ['data quality', 'metrics', 'governance'],
            createdAt: '2025-07-10T08:00:00Z',
            updatedAt: '2025-07-25T16:20:00Z'
          },
          {
            _id: 'proc-004',
            name: 'Financial Reporting',
            description: 'Monthly financial reporting process',
            owner: 'Finance',
            category: 'Reporting',
            status: 'active',
            lastUpdated: '2025-07-28',
            relatedAssets: [
              { _id: 'data-030', name: 'Financial Data', type: 'Dataset', description: 'Financial records' },
              { _id: 'data-031', name: 'Reporting System', type: 'System', description: 'Financial reporting tool' }
            ],
            tags: ['financial', 'reporting', 'compliance'],
            createdAt: '2025-07-15T10:30:00Z',
            updatedAt: '2025-07-28T09:15:00Z'
          },
          {
            _id: 'proc-005',
            name: 'Data Warehouse ETL',
            description: 'Extract, Transform, Load process for the Data Warehouse',
            owner: 'Data Engineering',
            category: 'Data Management',
            status: 'active',
            lastUpdated: '2025-07-30',
            relatedAssets: [
              { _id: 'data-017', name: 'ETL Scripts', type: 'Code', description: 'Data transformation scripts' },
              { _id: 'data-024', name: 'Data Warehouse', type: 'System', description: 'Enterprise data warehouse' }
            ],
            tags: ['ETL', 'data warehouse', 'integration'],
            createdAt: '2025-07-20T14:00:00Z',
            updatedAt: '2025-07-30T17:45:00Z'
          },
          {
            _id: 'proc-006',
            name: 'Compliance Audit',
            description: 'Regular compliance auditing process',
            owner: 'Legal',
            category: 'Compliance',
            status: 'active',
            lastUpdated: '2025-08-01',
            relatedAssets: [
              { _id: 'data-007', name: 'Audit Logs', type: 'Dataset', description: 'Compliance audit records' },
              { _id: 'data-019', name: 'Regulatory Requirements', type: 'Documentation', description: 'Regulatory compliance documentation' }
            ],
            tags: ['audit', 'compliance', 'regulatory'],
            createdAt: '2025-07-25T11:20:00Z',
            updatedAt: '2025-08-01T13:30:00Z'
          }
        ];
        
        setProcesses(sampleProcesses);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);
  
  // Handle opening the edit dialog for a business process
  const handleEditProcess = (process: BusinessProcess) => {
    setCurrentProcess(process);
    
    // Initialize form data with process values
    setFormData({
      name: process.name,
      description: process.description,
      owner: process.owner,
      category: process.category,
      status: process.status,
      tags: process.tags || []
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
  
  // Handle status select change
  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as 'active' | 'inactive' | 'draft' | 'archived';
    setFormData(prev => ({
      ...prev,
      status: value
    }));
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
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save business process changes
  const handleSaveProcess = async () => {
    if (!validateForm() || !currentProcess) return;
    
    try {
      const endpoint = `/business-processes/${currentProcess._id}`;
      await api.put(endpoint, formData);
      
      showSnackbar('Business process updated successfully', 'success');
      setEditDialogOpen(false);
      fetchBusinessProcesses(); // Refresh the list
    } catch (error) {
      console.error('Error updating business process:', error);
      showSnackbar('Failed to update business process', 'error');
    }
  };

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('businessProcessSearchHistory');
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

  // Fetch processes when debounced search text changes
  useEffect(() => {
    fetchBusinessProcesses();
  }, [fetchBusinessProcesses]);

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
    <Container sx={{ py: 4 }} className="business-processes-page">
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
          Edit Business Process
        </DialogTitle>
        
        <DialogContent dividers>
          <Box id="edit-dialog-description" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edit the details of this business process. All fields marked with * are required.
            </Typography>
          </Box>
          
          <form noValidate>
            {/* Name field */}
            <TextField
              inputRef={firstInputRef}
              margin="dense"
              id="name"
              name="name"
              label="Name *"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              autoFocus
              aria-required="true"
              sx={{ mb: 2 }}
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
              variant="outlined"
              value={formData.description}
              onChange={handleFormChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              required
              aria-required="true"
              sx={{ mb: 2 }}
            />
            
            {/* Owner field */}
            <TextField
              margin="dense"
              id="owner"
              name="owner"
              label="Owner *"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.owner}
              onChange={handleFormChange}
              error={!!formErrors.owner}
              helperText={formErrors.owner}
              required
              aria-required="true"
              sx={{ mb: 2 }}
            />
            
            {/* Category field */}
            <TextField
              margin="dense"
              id="category"
              name="category"
              label="Category *"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={handleFormChange}
              error={!!formErrors.category}
              helperText={formErrors.category}
              required
              aria-required="true"
              sx={{ mb: 2 }}
            />
            
            {/* Status field */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="status-label">Status *</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                // @ts-ignore - needed for MUI typing
                onChange={handleStatusChange}
                label="Status *"
                required
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
              variant="outlined"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              helperText="Enter tags separated by commas"
              sx={{ mb: 2 }}
            />
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            color="inherit"
            aria-label="Cancel and close dialog"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProcess}
            variant="contained" 
            color="primary"
            aria-label="Save changes to business process"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Business Processes
      </Typography>
      <Typography variant="body1" paragraph>
        Manage and explore business processes and their relationships to data assets.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search business processes..."
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
          aria-label="Search business processes"
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
          <CircularProgress aria-label="Loading business processes" />
        </Box>
      )}

      {/* No results */}
      {!loading && processes.length === 0 && !error && (
        <Box sx={{ mt: 2, textAlign: 'center' }} aria-live="polite">
          <MuiAlert severity="info">
            No business processes found. Try adjusting your search criteria.
          </MuiAlert>
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Box sx={{ mt: 2, mb: 2 }} aria-live="assertive">
          <MuiAlert severity="error">{error}</MuiAlert>
        </Box>
      )}

      {/* Results Section */}
      {!loading && !error && (
        <>
          <Box sx={{ mb: 2 }} aria-live="polite">
            <Typography variant="subtitle1">
              {processes.length > 0 
                ? `Showing ${processes.length} business processes` 
                : 'No business processes found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {processes.map((process) => (
              <Grid item xs={12} sm={6} md={4} key={process._id}>
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
                  tabIndex={0}
                  role="button"
                  aria-label={`Edit ${process.name} business process`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEditProcess(process);
                    }
                  }}
                  onClick={() => handleEditProcess(process)}
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
                        {process.name}
                      </Typography>
                      <Chip 
                        label={process.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(process.status),
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
                      {process.description}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Owner:</strong> {process.owner}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Category:</strong> {process.category}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Last Updated:</strong> {process.lastUpdated}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {process.tags?.map(tag => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BusinessProcesses;

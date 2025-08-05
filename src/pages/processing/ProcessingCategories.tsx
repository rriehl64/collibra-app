import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  ContentCopy as CopyIcon,
  BallotOutlined as CategoryIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface ProcessingCategory {
  id: string;
  name: string;
  description: string;
  type: string;
  priority: string;
  steps: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  status: 'active' | 'draft' | 'archived';
  associatedAssets: number;
}

const ProcessingCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProcessingCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProcessingCategory[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProcessingCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Sample data for processing categories
  const sampleCategories: ProcessingCategory[] = [
    {
      id: '1',
      name: 'Customer Data Processing',
      description: 'Categories for processing customer data including PII.',
      type: 'Data Integration',
      priority: 'High',
      steps: 7,
      createdAt: '2025-03-10T14:30:00Z',
      updatedAt: '2025-07-25T09:15:00Z',
      owner: 'Sarah Johnson',
      status: 'active',
      associatedAssets: 24
    },
    {
      id: '2',
      name: 'Financial Data Workflows',
      description: 'Processing categories for financial and accounting data.',
      type: 'Financial',
      priority: 'High',
      steps: 9,
      createdAt: '2025-02-15T10:20:00Z',
      updatedAt: '2025-08-01T11:45:00Z',
      owner: 'Michael Chen',
      status: 'active',
      associatedAssets: 32
    },
    {
      id: '3',
      name: 'Marketing Analytics',
      description: 'Processing categories for marketing campaign data and analytics.',
      type: 'Analytics',
      priority: 'Medium',
      steps: 5,
      createdAt: '2025-04-22T09:10:00Z',
      updatedAt: '2025-07-18T14:30:00Z',
      owner: 'Alicia Torres',
      status: 'active',
      associatedAssets: 18
    },
    {
      id: '4',
      name: 'Regulatory Compliance',
      description: 'Processing workflows for regulatory compliance data.',
      type: 'Compliance',
      priority: 'High',
      steps: 12,
      createdAt: '2025-01-05T08:45:00Z',
      updatedAt: '2025-06-30T16:20:00Z',
      owner: 'Robert Williams',
      status: 'active',
      associatedAssets: 41
    },
    {
      id: '5',
      name: 'HR Data Processing',
      description: 'Categories for HR and employee data processing.',
      type: 'Administrative',
      priority: 'Medium',
      steps: 6,
      createdAt: '2025-05-12T13:25:00Z',
      updatedAt: '2025-07-15T10:50:00Z',
      owner: 'Emma Rodriguez',
      status: 'draft',
      associatedAssets: 15
    },
    {
      id: '6',
      name: 'Supply Chain Analytics',
      description: 'Processing workflows for supply chain and logistics data.',
      type: 'Analytics',
      priority: 'Medium',
      steps: 8,
      createdAt: '2025-03-28T15:40:00Z',
      updatedAt: '2025-08-02T09:30:00Z',
      owner: 'David Smith',
      status: 'active',
      associatedAssets: 29
    },
    {
      id: '7',
      name: 'Product Development',
      description: 'Data processing categories for product development and innovation.',
      type: 'Development',
      priority: 'High',
      steps: 10,
      createdAt: '2025-02-20T11:15:00Z',
      updatedAt: '2025-07-10T13:45:00Z',
      owner: 'Jennifer Lee',
      status: 'active',
      associatedAssets: 22
    },
    {
      id: '8',
      name: 'Legacy System Integration',
      description: 'Categories for processing and migrating data from legacy systems.',
      type: 'Data Integration',
      priority: 'Low',
      steps: 14,
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-06-25T14:20:00Z',
      owner: 'Thomas Brown',
      status: 'archived',
      associatedAssets: 8
    },
    {
      id: '9',
      name: 'Customer Support Data',
      description: 'Processing workflows for customer support and service data.',
      type: 'Service',
      priority: 'Medium',
      steps: 7,
      createdAt: '2025-04-05T09:50:00Z',
      updatedAt: '2025-07-28T11:35:00Z',
      owner: 'Lisa Garcia',
      status: 'active',
      associatedAssets: 26
    },
    {
      id: '10',
      name: 'IoT Data Pipeline',
      description: 'Categories for processing IoT device data and telemetry.',
      type: 'Data Integration',
      priority: 'High',
      steps: 11,
      createdAt: '2025-03-01T12:10:00Z',
      updatedAt: '2025-07-20T15:25:00Z',
      owner: 'Kevin Johnson',
      status: 'draft',
      associatedAssets: 37
    }
  ];

  // Debounce search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setDebouncedSearchText(searchValue);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchText('');
    setDebouncedSearchText('');
  };

  // Filter categories based on search text and filters
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await axios.get('/api/processing-categories');
      // const data = response.data;
      
      // For now, use our sample data
      const data = [...sampleCategories];
      setCategories(data);
      
      // Apply filters
      let filtered = [...data];
      
      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        filtered = filtered.filter(category => category.status === statusFilter);
      }
      
      // Filter by type if not 'all'
      if (typeFilter !== 'all') {
        filtered = filtered.filter(category => category.type === typeFilter);
      }
      
      // Filter by search text
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(category => 
          category.name.toLowerCase().includes(searchLower) ||
          category.description.toLowerCase().includes(searchLower) ||
          category.owner.toLowerCase().includes(searchLower) ||
          category.type.toLowerCase().includes(searchLower)
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('processingCategoriesSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setFilteredCategories(filtered);
    } catch (err) {
      console.error('Failed to fetch processing categories:', err);
      setError('Failed to load processing categories. Please try again later.');
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, statusFilter, typeFilter]);

  // Load categories when component mounts or search/filters change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('processingCategoriesSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }
  }, []);

  // Handle opening the delete confirmation dialog
  const handleDeleteDialogOpen = (category: ProcessingCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Handle closing the delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handle category deletion
  const handleDeleteCategory = () => {
    if (selectedCategory) {
      // In a real app, this would be an API call
      // await axios.delete(`/api/processing-categories/${selectedCategory.id}`);
      
      // For now, just filter out the deleted category
      const updatedCategories = categories.filter(
        category => category.id !== selectedCategory.id
      );
      setCategories(updatedCategories);
      fetchCategories();
      
      setSnackbarMessage(`Processing category "${selectedCategory.name}" was deleted.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  // Handle opening the edit dialog
  const handleEditDialogOpen = (category: ProcessingCategory) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCategory(null);
  };

  // Handle opening the create dialog
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  // Handle closing the create dialog
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get priority chip color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
          Processing Categories
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
          sx={{
            backgroundColor: '#003366',
            '&:hover': {
              backgroundColor: '#00264d'
            }
          }}
        >
          New Category
        </Button>
      </Box>
      
      <Typography variant="body1" paragraph>
        Manage data processing categories and workflows for organizing your data pipeline and transformation processes.
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchText}
              onChange={handleSearchChange}
              aria-label="Search processing categories"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleClearSearch}
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {/* Search history */}
            {searchText && searchHistory.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Recent searches:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {searchHistory.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      onClick={() => {
                        setSearchText(item);
                        setDebouncedSearchText(item);
                      }}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Data Integration">Data Integration</MenuItem>
                <MenuItem value="Analytics">Analytics</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="Compliance">Compliance</MenuItem>
                <MenuItem value="Administrative">Administrative</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {loading ? 'Loading...' : `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'} found`}
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* No results */}
      {!loading && filteredCategories.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CategoryIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No processing categories found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {debouncedSearchText
              ? `No results match "${debouncedSearchText}"`
              : 'Try adjusting your filters or create a new processing category.'}
          </Typography>
          {debouncedSearchText && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleClearSearch}
              sx={{ mr: 1 }}
            >
              Clear Search
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
            size="small"
          >
            Create New Category
          </Button>
        </Paper>
      )}
      
      {/* Categories Grid */}
      {!loading && filteredCategories.length > 0 && (
        <Grid container spacing={3}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6
                  },
                  position: 'relative',
                  transition: 'box-shadow 0.3s ease-in-out'
                }}
              >
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                  <Chip
                    label={category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    color={getStatusColor(category.status) as any}
                    size="small"
                  />
                </Box>
                
                <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: '#003366' }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      label={category.type} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`${category.priority} Priority`}
                      size="small"
                      color={getPriorityColor(category.priority) as any}
                    />
                    <Chip 
                      label={`${category.steps} Steps`}
                      size="small"
                      variant="outlined"
                      icon={<AssignmentIcon />}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Owner
                      </Typography>
                      <Typography variant="body2">{category.owner}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Associated Assets
                      </Typography>
                      <Typography variant="body2">{category.associatedAssets}</Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate(`/processing/categories/${category.id}`)}
                  >
                    Manage
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEditDialogOpen(category)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteDialogOpen(category)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-category-dialog-title"
        aria-describedby="delete-category-dialog-description"
      >
        <DialogTitle id="delete-category-dialog-title">
          Delete Processing Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-category-dialog-description">
            Are you sure you want to delete the processing category "{selectedCategory?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Category Dialog Placeholder */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-category-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-category-dialog-title">
          Edit Processing Category
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dialog would contain a form to edit the processing category.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Form implementation would be added in the next phase)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleEditDialogClose} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Category Dialog Placeholder */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        aria-labelledby="create-category-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="create-category-dialog-title">
          Create New Processing Category
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dialog would contain a form to create a new processing category.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Form implementation would be added in the next phase)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateDialogClose} color="primary">
            Create Category
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProcessingCategories;

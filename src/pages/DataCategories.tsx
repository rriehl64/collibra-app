/**
 * Data Categories Page
 * 
 * Displays data categories with full accessibility support
 * and consistent styling with other asset pages.
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  FormLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

// Data category interface to match backend model
interface DataCategory {
  _id: string;
  name: string;
  description: string;
  owner: string;
  assetCount: number;
  status: 'active' | 'inactive' | 'draft';
  lastUpdated: string;
  tags?: string[];
  relatedAssets?: any[];
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

const DataCategories: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<DataCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<DataCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'draft',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Refs for accessibility focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Add snackbar notifications
  const { showSnackbar } = useSnackbar();
  
  // Handle opening edit dialog
  const handleEditCategory = (category: DataCategory) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      owner: category.owner,
      status: category.status,
      tags: category.tags ? category.tags.join(', ') : ''
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
  
  // Parse comma-separated tags into array
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: tagsValue
    }));
  };

  // Function to fetch data categories from the API
  const fetchDataCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/data-categories';
      let params = {};
      
      // Add search query if provided
      if (debouncedSearchText) {
        params = { search: debouncedSearchText };
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('dataCategorySearchHistory', JSON.stringify(newHistory));
        }
      }
      
      // Make API request using the authenticated API service
      const response = await api.get(endpoint, { params });
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to fetch data categories:', err);
      setError('Failed to load data categories. Please try again later.');
      setCategories([]);
      showSnackbar('Failed to load data categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, showSnackbar]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dataCategorySearchHistory');
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

  // Fetch categories when debounced search text changes
  useEffect(() => {
    fetchDataCategories();
  }, [fetchDataCategories]);

  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.owner.trim()) errors.owner = 'Owner is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save data category changes
  const handleSaveCategory = async () => {
    if (!validateForm() || !currentCategory) return;
    
    try {
      // Parse tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const endpoint = `/data-categories/${currentCategory._id}`;
      await api.put(endpoint, {
        ...formData,
        tags: tagsArray
      });
      
      showSnackbar('Data category updated successfully', 'success');
      setEditDialogOpen(false);
      fetchDataCategories(); // Refresh the list
    } catch (error) {
      console.error('Error updating data category:', error);
      showSnackbar('Failed to update data category', 'error');
    }
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50'; // Green
      case 'inactive':
        return '#FFC107'; // Yellow
      case 'draft':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <Container sx={{ py: 4 }} className="data-categories-page">
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
          Edit Data Category
        </DialogTitle>
        
        <DialogContent dividers>
          <Box id="edit-dialog-description" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edit the details of this data category. All fields marked with * are required.
            </Typography>
          </Box>
          
          <form noValidate>
            {/* Name field */}
            <TextField
              inputRef={firstInputRef}
              margin="dense"
              id="name"
              name="name"
              label="Category Name"
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
            
            {/* Owner field */}
            <TextField
              margin="dense"
              id="owner"
              name="owner"
              label="Owner"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.owner}
              onChange={handleInputChange}
              error={!!formErrors.owner}
              helperText={formErrors.owner || ''}
              required
              inputProps={{
                'aria-describedby': 'owner-helper-text',
                'aria-invalid': !!formErrors.owner
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
              {formErrors.status && (
                <FormHelperText id="status-helper-text" error>
                  {formErrors.status}
                </FormHelperText>
              )}
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
              value={formData.tags}
              onChange={handleTagsChange}
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
            onClick={handleSaveCategory}
            color="primary"
            variant="contained"
            aria-label="Save changes"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Data Categories
      </Typography>
      <Typography variant="body1" paragraph>
        Browse and manage data categories across your organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search data categories..."
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
          aria-label="Search data categories"
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
          <CircularProgress aria-label="Loading data categories" />
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
              {categories.length > 0 
                ? `Showing ${categories.length} data categories` 
                : 'No data categories found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
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
                  aria-label={`Edit ${category.name} category`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEditCategory(category);
                    }
                  }}
                  onClick={() => handleEditCategory(category)}
                  aria-haspopup="dialog"
                  aria-expanded={editDialogOpen && currentCategory?._id === category._id}
                >
                  <CardContent>
                    {/* Edit icon overlay for visual indication */}
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
                        {category.name}
                      </Typography>
                      <Chip 
                        label={category.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(category.status),
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
                      {category.description}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Owner:</strong> {category.owner}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Asset Count:</strong> {category.assetCount}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Last Updated:</strong> {category.lastUpdated}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {category.tags?.map(tag => (
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

export default DataCategories;

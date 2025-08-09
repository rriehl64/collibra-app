/**
 * SubjectCategories.tsx
 * 
 * Displays subject categories with full accessibility support
 * and consistent styling with other asset pages.
 * Data is fetched from MongoDB via the API similar to BusinessProcesses page.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  AlertProps
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Define the subject category type for TypeScript support
interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  owner: string;
  departmentCode: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string;
  relatedAssets?: string[];
  tags?: string[];
}

// Form value type
interface FormValues {
  name: string;
  description: string;
  departmentCode: string;
  owner: string;
  status: string;
}

// Form error type
interface FormErrors {
  [key: string]: string;
}

const SubjectCategories: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [allCategories, setAllCategories] = useState<SubjectCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<SubjectCategory | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    departmentCode: '',
    owner: '',
    status: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: AlertProps['severity']}>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Auth context
  const { user } = useAuth();

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
  
  // Debounce search input
  const debouncedSearchText = useDebounce(searchText, 500);

  // Fetch subject categories
  // Handle opening the edit dialog for click-anywhere-to-edit functionality
  const handleEditCategory = (category: SubjectCategory) => {
    setCurrentCategory(category);
    setFormValues({
      name: category.name,
      description: category.description,
      departmentCode: category.departmentCode,
      owner: category.owner,
      status: category.status
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };
  
  // Handle closing the edit dialog
  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setCurrentCategory(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission with API integration
  const handleSubmit = async () => {
    // Validate form
    const errors: FormErrors = {};
    if (!formValues.name.trim()) errors.name = 'Name is required';
    if (!formValues.description.trim()) errors.description = 'Description is required';
    if (!formValues.departmentCode.trim()) errors.departmentCode = 'Department Code is required';
    if (!formValues.owner.trim()) errors.owner = 'Owner is required';
    if (!formValues.status) errors.status = 'Status is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Prepare data for API
      const categoryData = {
        name: formValues.name,
        description: formValues.description,
        departmentCode: formValues.departmentCode,
        owner: formValues.owner,
        status: formValues.status as 'active' | 'inactive' | 'draft' | 'archived'
      };
      
      console.log('Saving category to API:', categoryData);
      
      try {
        // Make API call to update the category
        const endpoint = `/subject-categories/${currentCategory?.id}`;
        const response = await api.put(endpoint, categoryData);
        console.log('API save response:', response.data);
        
        // Refresh the list to get updated data from API
        fetchSubjectCategories();
      } catch (apiError) {
        console.error('API save error:', apiError);
        
        // If API fails, update local state as fallback
        if (currentCategory) {
          const updatedCategory: SubjectCategory = {
            ...currentCategory,
            name: categoryData.name,
            description: categoryData.description,
            departmentCode: categoryData.departmentCode,
            owner: categoryData.owner,
            status: categoryData.status,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
          
          // Update local state for immediate feedback
          const updatedCategories = categories.map(category => 
            category.id === currentCategory.id ? updatedCategory : category
          );
          setCategories(updatedCategories);
          
          // Also update in allCategories to keep the search functionality working correctly
          setAllCategories(prev => prev.map(category => 
            category.id === currentCategory.id ? updatedCategory : category
          ));
        }
        
        throw apiError; // Re-throw to handle in catch block
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Subject category updated successfully',
        severity: 'success'
      });
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating subject category:', error);
      
      // Show error message
      setSnackbar({
        open: true,
        message: 'Failed to update subject category. Please try again.',
        severity: 'error'
      });
    }
  };

  const fetchSubjectCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '/subject-categories';
      let params = {};
      
      // Add search query if provided
      if (debouncedSearchText) {
        params = { search: debouncedSearchText };
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('subjectCategoriesSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      try {
        // Make API request using the authenticated API service
        const response = await api.get(endpoint, { params });
        console.log('API response:', response.data);
        
        if (response.data && response.data.data) {
          // Set both categories and allCategories for display and persistence
          setCategories(response.data.data);
          setAllCategories(response.data.data);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Fall back to sample data if API fails and we have no data
        if (allCategories.length === 0) {
          // Sample categories as fallback for development
          const sampleCategories: SubjectCategory[] = [
            {
              id: 'sc1',
              name: 'Immigration Applications',
              description: 'Categories related to different types of immigration applications and forms',
              owner: 'Robert Chen',
              departmentCode: 'IMM-100',
              status: 'active',
              lastUpdated: '2023-07-20',
              tags: ['immigration', 'applications', 'forms']
            },
            {
              id: 'sc2',
              name: 'Asylum and Refugee',
              description: 'Categories related to asylum claims and refugee status',
              owner: 'Maria Rodriguez',
              departmentCode: 'ASY-200',
              status: 'active',
              lastUpdated: '2023-07-18',
              tags: ['asylum', 'refugee', 'humanitarian']
            },
            {
              id: 'sc3',
              name: 'Employment Authorization',
              description: 'Categories related to work permits and employment eligibility',
              owner: 'John Smith',
              departmentCode: 'EMP-300',
              status: 'active',
              lastUpdated: '2023-07-15',
              tags: ['employment', 'work', 'authorization']
            }
          ];
          
          console.log('Using sample categories as fallback');
          setCategories(sampleCategories);
          setAllCategories(sampleCategories);
        }
        throw apiError;
      }
    } catch (err) {
      console.error('Error fetching subject categories:', err);
      setError('Failed to load subject categories. Please try again later.');
      
      // If API fails, use fallback sample data for development
      if (process.env.NODE_ENV === 'development') {
        if (allCategories.length === 0) {
          const fallbackData: SubjectCategory[] = [
            {
              id: 'sc1',
              name: 'Immigration Applications',
              description: 'Categories related to different types of immigration applications and forms',
              owner: 'Robert Chen',
              departmentCode: 'IMM-100',
              status: 'active',
              lastUpdated: '2023-07-20',
              tags: ['immigration', 'applications', 'forms']
            }
          ];
          
          console.log('Using emergency fallback data');
          setCategories(fallbackData);
          setAllCategories(fallbackData);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, allCategories.length]);

  // Initial fetch and search history retrieval
  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('subjectCategoriesSearchHistory');
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
    fetchSubjectCategories();
  }, [fetchSubjectCategories]);

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Container sx={{ py: 4 }} className="subject-categories-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Subject Categories
      </Typography>
      <Typography variant="body1" paragraph>
        Browse and manage subject categories across your organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search subject categories..."
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
                  onClick={() => setSearchText('')}
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          aria-label="Search subject categories"
        />
      </Box>

      {/* Search history */}
      {searchHistory.length > 0 && !searchText && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" component="h2" sx={{ mb: 1 }}>
            Recent searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchHistory.map((term, index) => (
              <Chip 
                key={index} 
                label={term} 
                size="small" 
                onClick={() => setSearchText(term)}
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Loading state */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress aria-label="Loading subject categories" />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Results count */}
      {!loading && !error && (
        <Typography variant="subtitle1" component="p" sx={{ mb: 2 }}>
          {categories.length === 0 
            ? 'No subject categories found' 
            : `Showing ${categories.length} subject categor${categories.length !== 1 ? 'ies' : 'y'}`}
        </Typography>
      )}

      {/* Subject Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
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
              aria-label={`Edit ${category.name} subject category`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEditCategory(category);
                }
              }}
              onClick={() => handleEditCategory(category)}
              aria-haspopup="dialog"
              aria-expanded={editDialogOpen && currentCategory?.id === category.id}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }} gutterBottom>
                    {category.name}
                  </Typography>
                  <Chip 
                    label={category.status} 
                    color={getStatusColor(category.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Department Code:</strong> {category.departmentCode}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Owner:</strong> {category.owner}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Last Updated:</strong> {category.lastUpdated}
                </Typography>
                {category.tags && category.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                    {category.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Edit Category Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseDialog}
        aria-labelledby="edit-category-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-category-dialog-title">Edit Subject Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="name"
              label="Category Name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            
            <TextField
              name="description"
              label="Description"
              value={formValues.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
            
            <TextField
              name="departmentCode"
              label="Department Code"
              value={formValues.departmentCode}
              onChange={handleInputChange}
              fullWidth
              error={!!formErrors.departmentCode}
              helperText={formErrors.departmentCode}
            />
            
            <TextField
              name="owner"
              label="Owner"
              value={formValues.owner}
              onChange={handleInputChange}
              fullWidth
              error={!!formErrors.owner}
              helperText={formErrors.owner}
            />
            
            <FormControl fullWidth error={!!formErrors.status}>
              <InputLabel id="category-status-label">Status</InputLabel>
              <Select
                labelId="category-status-label"
                name="status"
                value={formValues.status}
                onChange={(e) => handleSelectChange(e)}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
              {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
      
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

export default SubjectCategories;

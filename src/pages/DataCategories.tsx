/**
 * Data Categories Page
 * 
 * Displays data categories with full accessibility support
 * and consistent styling with other asset pages.
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
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';

// Sample data category type for demonstration
interface DataCategory {
  id: string;
  name: string;
  description: string;
  owner: string;
  assetCount: number;
  status: 'active' | 'inactive' | 'draft';
  lastUpdated: string;
  tags?: string[];
}

const DataCategories: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<DataCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleCategories: DataCategory[] = [
    {
      id: 'cat-001',
      name: 'Customer Data',
      description: 'All data related to customer information and interactions',
      owner: 'Customer Success Team',
      assetCount: 24,
      status: 'active',
      lastUpdated: '2025-08-01',
      tags: ['PII', 'customer', 'gdpr']
    },
    {
      id: 'cat-002',
      name: 'Product Data',
      description: 'All product catalog and inventory information',
      owner: 'Product Team',
      assetCount: 15,
      status: 'active',
      lastUpdated: '2025-08-02',
      tags: ['products', 'inventory', 'specs']
    },
    {
      id: 'cat-003',
      name: 'Financial Data',
      description: 'All financial and accounting information',
      owner: 'Finance Department',
      assetCount: 18,
      status: 'active',
      lastUpdated: '2025-08-01',
      tags: ['financial', 'confidential', 'quarterly']
    },
    {
      id: 'cat-004',
      name: 'Marketing Assets',
      description: 'All marketing campaign and analytics data',
      owner: 'Marketing Team',
      assetCount: 12,
      status: 'active',
      lastUpdated: '2025-07-28',
      tags: ['marketing', 'campaigns', 'analytics']
    },
    {
      id: 'cat-005',
      name: 'HR Records',
      description: 'Employee and HR-related information',
      owner: 'Human Resources',
      assetCount: 8,
      status: 'active',
      lastUpdated: '2025-07-25',
      tags: ['HR', 'employees', 'confidential', 'PII']
    },
    {
      id: 'cat-006',
      name: 'Supply Chain Data',
      description: 'Vendor, logistics, and supply chain information',
      owner: 'Operations',
      assetCount: 14,
      status: 'active',
      lastUpdated: '2025-08-03',
      tags: ['supply chain', 'vendors', 'logistics']
    }
  ];

  // Function to fetch data categories - would use API in production
  const fetchDataCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter categories based on search text if provided
      let filteredCategories = [...sampleCategories];
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredCategories = sampleCategories.filter(category => 
          category.name.toLowerCase().includes(searchLower) ||
          category.description.toLowerCase().includes(searchLower) ||
          category.owner.toLowerCase().includes(searchLower) ||
          (category.tags && category.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('dataCategorySearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setCategories(filteredCategories);
    } catch (err) {
      console.error('Failed to fetch data categories:', err);
      setError('Failed to load data categories. Please try again later.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

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
                  aria-label={`View details for ${category.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // In a real app, this would navigate to category details
                      console.log(`Viewing details for ${category.name}`);
                    }
                  }}
                  onClick={() => {
                    // In a real app, this would navigate to category details
                    console.log(`Viewing details for ${category.name}`);
                  }}
                >
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

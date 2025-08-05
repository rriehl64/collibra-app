/**
 * SubjectCategories.tsx
 * 
 * Displays subject categories with full accessibility support
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
  IconButton,
  CardActionArea
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Sample subject category type for demonstration
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

const SubjectCategories: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
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
  const fetchSubjectCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleCategories: SubjectCategory[] = [
        {
          id: 'sc1',
          name: 'Immigration Applications',
          description: 'Categories related to different types of immigration applications and forms',
          owner: 'Robert Chen',
          departmentCode: 'IMM-100',
          status: 'active',
          lastUpdated: '2025-07-20',
          tags: ['immigration', 'applications', 'forms']
        },
        {
          id: 'sc2',
          name: 'Asylum and Refugee',
          description: 'Categories related to asylum claims and refugee status',
          owner: 'Maria Rodriguez',
          departmentCode: 'ASY-200',
          status: 'active',
          lastUpdated: '2025-07-18',
          tags: ['asylum', 'refugee', 'humanitarian']
        },
        {
          id: 'sc3',
          name: 'Employment Authorization',
          description: 'Categories related to work permits and employment eligibility',
          owner: 'John Smith',
          departmentCode: 'EMP-300',
          status: 'active',
          lastUpdated: '2025-07-15',
          tags: ['employment', 'work', 'authorization']
        },
        {
          id: 'sc4',
          name: 'Family-Based Immigration',
          description: 'Categories related to family sponsorship and relations-based immigration',
          owner: 'Sarah Johnson',
          departmentCode: 'FAM-400',
          status: 'active',
          lastUpdated: '2025-07-12',
          tags: ['family', 'sponsorship', 'relations']
        },
        {
          id: 'sc5',
          name: 'Citizenship and Naturalization',
          description: 'Categories related to becoming a U.S. citizen and naturalization process',
          owner: 'David Lee',
          departmentCode: 'CIT-500',
          status: 'active',
          lastUpdated: '2025-07-10',
          tags: ['citizenship', 'naturalization', 'oath']
        },
        {
          id: 'sc6',
          name: 'International Travel',
          description: 'Categories related to travel documents and international movement',
          owner: 'Emily Wong',
          departmentCode: 'TRV-600',
          status: 'draft',
          lastUpdated: '2025-07-05',
          tags: ['travel', 'passport', 'international']
        }
      ];

      // Filter by search text if provided
      const filtered = debouncedSearchText
        ? sampleCategories.filter(category => 
            category.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            category.description.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            category.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchText.toLowerCase()))
          )
        : sampleCategories;

      setCategories(filtered);
      
      // Update search history
      if (debouncedSearchText && !searchHistory.includes(debouncedSearchText)) {
        const newHistory = [debouncedSearchText, ...searchHistory].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('subjectCategoriesSearchHistory', JSON.stringify(newHistory));
      }
    } catch (err) {
      console.error('Error fetching subject categories:', err);
      setError('Failed to load subject categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

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
              variant="outlined" 
              sx={{ height: '100%' }}
              component="article"
            >
              <CardActionArea 
                sx={{ height: '100%' }}
                onClick={() => console.log(`Clicked on category: ${category.name}`)}
                aria-label={`View details for ${category.name}`}
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
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubjectCategories;

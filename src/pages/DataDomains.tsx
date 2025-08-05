/**
 * DataDomains.tsx
 * 
 * Displays data domains with full accessibility support
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

// Sample data domain type for demonstration
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

const DataDomains: React.FC = () => {
  // State management
  const [domains, setDomains] = useState<DataDomain[]>([]);
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

  // Fetch data domains
  const fetchDataDomains = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleDomains: DataDomain[] = [
        {
          id: 'dom1',
          name: 'Customer Data Domain',
          description: 'Contains all customer-related data elements and definitions',
          owner: 'Jane Smith',
          type: 'Business',
          status: 'active',
          lastUpdated: '2025-07-15',
          tags: ['customer', 'core']
        },
        {
          id: 'dom2',
          name: 'Product Data Domain',
          description: 'Contains all product-related data elements and definitions',
          owner: 'Mike Johnson',
          type: 'Business',
          status: 'active',
          lastUpdated: '2025-07-10',
          tags: ['product', 'core']
        },
        {
          id: 'dom3',
          name: 'Finance Data Domain',
          description: 'Contains all financial data elements and definitions',
          owner: 'Sarah Lee',
          type: 'Business',
          status: 'active',
          lastUpdated: '2025-07-05',
          tags: ['finance', 'core']
        },
        {
          id: 'dom4',
          name: 'Compliance Data Domain',
          description: 'Contains all compliance and regulatory data elements',
          owner: 'Robert Chen',
          type: 'Governance',
          status: 'active',
          lastUpdated: '2025-06-30',
          tags: ['compliance', 'regulatory']
        },
        {
          id: 'dom5',
          name: 'Technical Data Domain',
          description: 'Contains all technical metadata and system-specific data elements',
          owner: 'Alex Taylor',
          type: 'Technical',
          status: 'active',
          lastUpdated: '2025-06-25',
          tags: ['technical', 'metadata']
        }
      ];

      // Filter by search text if provided
      const filtered = debouncedSearchText
        ? sampleDomains.filter(domain => 
            domain.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            domain.description.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            domain.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchText.toLowerCase()))
          )
        : sampleDomains;

      setDomains(filtered);
      
      // Update search history
      if (debouncedSearchText && !searchHistory.includes(debouncedSearchText)) {
        const newHistory = [debouncedSearchText, ...searchHistory].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('dataDomainsSearchHistory', JSON.stringify(newHistory));
      }
    } catch (err) {
      console.error('Error fetching data domains:', err);
      setError('Failed to load data domains. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Initial fetch and search history retrieval
  useEffect(() => {
    // Load search history from localStorage
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
    <Container sx={{ py: 4 }} className="data-domains-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Data Domains
      </Typography>
      <Typography variant="body1" paragraph>
        Browse and manage data domains across your organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search data domains..."
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
          aria-label="Search data domains"
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
          <CircularProgress aria-label="Loading data domains" />
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
          {domains.length === 0 
            ? 'No data domains found' 
            : `Showing ${domains.length} data domain${domains.length !== 1 ? 's' : ''}`}
        </Typography>
      )}

      {/* Data Domains Grid */}
      <Grid container spacing={3}>
        {domains.map((domain) => (
          <Grid item xs={12} sm={6} md={4} key={domain.id}>
            <Card 
              variant="outlined" 
              sx={{ height: '100%' }}
              component="article"
            >
              <CardActionArea 
                sx={{ height: '100%' }}
                onClick={() => console.log(`Clicked on domain: ${domain.name}`)}
                aria-label={`View details for ${domain.name}`}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ color: '#003366' }} gutterBottom>
                      {domain.name}
                    </Typography>
                    <Chip 
                      label={domain.status} 
                      color={getStatusColor(domain.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {domain.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {domain.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Owner:</strong> {domain.owner}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Last Updated:</strong> {domain.lastUpdated}
                  </Typography>
                  {domain.tags && domain.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                      {domain.tags.map((tag, index) => (
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

export default DataDomains;

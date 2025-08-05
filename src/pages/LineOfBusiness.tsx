/**
 * Line of Business Page
 * 
 * Displays business lines with full accessibility support
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
// Import auth context
import { useAuth } from '../contexts/AuthContext';
// Import line of business service and types
import lineOfBusinessService from '../services/lineOfBusinessService';
import { LineOfBusiness } from '../types/LineOfBusiness';

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

// LineOfBusiness type is now imported from '../types/LineOfBusiness'

// Sample data as fallback when API is unavailable
const sampleBusinesses: LineOfBusiness[] = [
  {
    id: 'lob-001',
    name: 'Retail Banking',
    description: 'Consumer banking products and services for individual customers',
    owner: 'Consumer Banking Division',
    sector: 'Financial Services',
    status: 'active',
    lastUpdated: '2025-07-15',
    relatedAssets: ['data-asset-001', 'data-asset-015'],
    tags: ['banking', 'consumer', 'retail'],
    kpis: [
      { name: 'Customer Acquisition', value: '1,500/month' },
      { name: 'Revenue', value: '$25M quarterly' }
    ]
  },
  {
    id: 'lob-002',
    name: 'Commercial Lending',
    description: 'Business loans and credit products for commercial clients',
    owner: 'Corporate Banking',
    sector: 'Financial Services',
    status: 'active',
    lastUpdated: '2025-07-20',
    relatedAssets: ['data-asset-005', 'data-asset-022'],
    tags: ['commercial', 'lending', 'business'],
    kpis: [
      { name: 'Loan Volume', value: '$125M quarterly' },
      { name: 'Default Rate', value: '0.8%' }
    ]
  },
  {
    id: 'lob-003',
    name: 'Investment Management',
    description: 'Portfolio management and investment services for high net worth clients',
    owner: 'Wealth Management Division',
    sector: 'Financial Services',
    status: 'active',
    lastUpdated: '2025-07-25',
    relatedAssets: ['data-asset-008', 'data-asset-012'],
    tags: ['investments', 'portfolio', 'wealth'],
    kpis: [
      { name: 'Assets Under Management', value: '$3.2B' },
      { name: 'Client Retention', value: '94%' }
    ]
  },
  {
    id: 'lob-004',
    name: 'Insurance Products',
    description: 'Life, health, and property insurance offerings',
    owner: 'Insurance Division',
    sector: 'Insurance',
    status: 'active',
    lastUpdated: '2025-07-28',
    relatedAssets: ['data-asset-030', 'data-asset-031'],
    tags: ['insurance', 'risk management', 'coverage'],
    kpis: [
      { name: 'Policy Count', value: '45,000' },
      { name: 'Claims Processing', value: '3.2 days avg.' }
    ]
  },
  {
    id: 'lob-005',
    name: 'Payment Solutions',
    description: 'Digital payment processing and merchant services',
    owner: 'Digital Banking',
    sector: 'Financial Technology',
    status: 'active',
    lastUpdated: '2025-07-30',
    relatedAssets: ['data-asset-017', 'data-asset-024'],
    tags: ['payments', 'digital', 'processing'],
    kpis: [
      { name: 'Transaction Volume', value: '12M monthly' },
      { name: 'Processing Fee Revenue', value: '$8.5M monthly' }
    ]
  },
  {
    id: 'lob-006',
    name: 'Mortgage Services',
    description: 'Residential and commercial mortgage products',
    owner: 'Mortgage Division',
    sector: 'Real Estate Finance',
    status: 'active',
    lastUpdated: '2025-08-01',
    relatedAssets: ['data-asset-007', 'data-asset-019'],
    tags: ['mortgage', 'real estate', 'loans'],
    kpis: [
      { name: 'Mortgage Origination', value: '$85M monthly' },
      { name: 'Approval Rate', value: '68%' }
    ]
  }
];

const LineOfBusinessPage: React.FC = () => {
  // State management
  const [businesses, setBusinesses] = useState<LineOfBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Function to fetch lines of business using service
  const fetchLineOfBusiness = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      
      // Use search if we have search text, otherwise get all
      if (debouncedSearchText) {
        result = await lineOfBusinessService.searchLineOfBusiness(debouncedSearchText);
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('lineOfBusinessSearchHistory', JSON.stringify(newHistory));
        }
      } else {
        result = await lineOfBusinessService.getLinesOfBusiness();
      }
      
      setBusinesses(result.businesses);
    } catch (err) {
      console.error('Failed to fetch lines of business:', err);
      setError('Failed to load lines of business. Please try again later.');
      
      // Fall back to sample data if API fails
      setBusinesses(sampleBusinesses);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('lineOfBusinessSearchHistory');
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

  // Fetch businesses when debounced search text changes
  useEffect(() => {
    fetchLineOfBusiness();
  }, [fetchLineOfBusiness]);

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
    <Container sx={{ py: 4 }} className="line-of-business-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Lines of Business
      </Typography>
      <Typography variant="body1" paragraph>
        Manage and explore business lines and their relationships to data assets.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search lines of business..."
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
          aria-label="Search lines of business"
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
          <CircularProgress aria-label="Loading lines of business" />
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
              {businesses.length > 0 
                ? `Showing ${businesses.length} lines of business` 
                : 'No lines of business found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {businesses.map((business) => (
              <Grid item xs={12} sm={6} md={4} key={business.id}>
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
                  aria-label={`View details for ${business.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // In a real app, this would navigate to business details
                      console.log(`Viewing details for ${business.name}`);
                    }
                  }}
                  onClick={() => {
                    // In a real app, this would navigate to business details
                    console.log(`Viewing details for ${business.name}`);
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
                        {business.name}
                      </Typography>
                      <Chip 
                        label={business.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(business.status),
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
                      {business.description}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Owner:</strong> {business.owner}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Sector:</strong> {business.sector}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Last Updated:</strong> {business.lastUpdated}
                    </Typography>
                    
                    {/* KPIs section */}
                    {business.kpis && business.kpis.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          Key Performance Indicators:
                        </Typography>
                        {business.kpis.map((kpi, index) => (
                          <Typography key={index} variant="caption" display="block" sx={{ ml: 1 }}>
                            {kpi.name}: <strong>{kpi.value}</strong>
                          </Typography>
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {business.tags?.map(tag => (
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

export default LineOfBusinessPage;

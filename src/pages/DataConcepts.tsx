/**
 * Data Concepts Page
 * 
 * Displays data concepts with full accessibility support
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
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';

// Sample data concept type for demonstration
interface DataConcept {
  id: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleConcepts: DataConcept[] = [
    {
      id: 'con-001',
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
      id: 'con-002',
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
      id: 'con-003',
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
      id: 'con-004',
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
      id: 'con-005',
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
      id: 'con-006',
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
      id: 'con-007',
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
      id: 'con-008',
      name: 'Asset',
      description: 'Any resource owned or controlled by the company with economic value',
      domain: 'Finance',
      status: 'approved',
      steward: 'Linda Martinez',
      lastUpdated: '2025-07-30',
      relatedConcepts: ['Property', 'Equipment', 'Investment'],
      tags: ['finance', 'accounting']
    }
  ];

  // Function to fetch data concepts - would use API in production
  const fetchDataConcepts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter concepts based on search text if provided
      let filteredConcepts = [...sampleConcepts];
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredConcepts = sampleConcepts.filter(concept => 
          concept.name.toLowerCase().includes(searchLower) ||
          concept.description.toLowerCase().includes(searchLower) ||
          concept.domain.toLowerCase().includes(searchLower) ||
          (concept.tags && concept.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('dataConceptsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setConcepts(filteredConcepts);
    } catch (err) {
      console.error('Failed to fetch data concepts:', err);
      setError('Failed to load data concepts. Please try again later.');
      setConcepts([]);
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
              <Grid item xs={12} sm={6} md={4} key={concept.id}>
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
                  aria-label={`View details for ${concept.name} concept`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // In a real app, this would navigate to concept details
                      console.log(`Viewing details for ${concept.name}`);
                    }
                  }}
                  onClick={() => {
                    // In a real app, this would navigate to concept details
                    console.log(`Viewing details for ${concept.name}`);
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
    </Container>
  );
};

export default DataConcepts;

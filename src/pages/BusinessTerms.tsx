/**
 * Business Terms Page
 * 
 * Displays business terminology with full accessibility support
 * and consistent styling with other context pages.
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

// Sample business term type for demonstration
interface BusinessTerm {
  id: string;
  name: string;
  definition: string;
  domain: string;
  status: 'approved' | 'proposed' | 'draft' | 'deprecated';
  steward: string;
  lastUpdated: string;
  relatedTerms?: string[];
  tags?: string[];
  examples?: string[];
}

const BusinessTerms: React.FC = () => {
  // State management
  const [terms, setTerms] = useState<BusinessTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleTerms: BusinessTerm[] = [
    {
      id: 'term-001',
      name: 'Customer',
      definition: 'An individual or organization that purchases products or services from our company.',
      domain: 'Customer Relationship Management',
      status: 'approved',
      steward: 'Jane Smith',
      lastUpdated: '2025-06-15',
      relatedTerms: ['Prospect', 'Client', 'Account'],
      tags: ['customer', 'crm', 'sales'],
      examples: ['John Doe purchasing a subscription', 'ACME Corp with enterprise license']
    },
    {
      id: 'term-002',
      name: 'Revenue',
      definition: 'Income generated from business activities, usually from the sale of goods and services.',
      domain: 'Finance',
      status: 'approved',
      steward: 'Michael Johnson',
      lastUpdated: '2025-06-20',
      relatedTerms: ['Income', 'Sales', 'Profit'],
      tags: ['finance', 'accounting', 'sales'],
      examples: ['Monthly subscription payments', 'One-time license fees']
    },
    {
      id: 'term-003',
      name: 'Data Governance',
      definition: 'The overall management of data availability, relevancy, usability, integrity and security in an enterprise.',
      domain: 'Data Management',
      status: 'approved',
      steward: 'Sarah Williams',
      lastUpdated: '2025-07-05',
      relatedTerms: ['Data Quality', 'Data Stewardship', 'Metadata Management'],
      tags: ['governance', 'data management', 'compliance'],
      examples: ['Data quality rules implementation', 'Data ownership assignment']
    },
    {
      id: 'term-004',
      name: 'Customer Lifetime Value',
      definition: 'The total worth of a customer over the entire relationship with the business.',
      domain: 'Marketing',
      status: 'approved',
      steward: 'Robert Davis',
      lastUpdated: '2025-07-12',
      relatedTerms: ['Customer Acquisition Cost', 'Churn Rate', 'Customer Retention'],
      tags: ['marketing', 'analytics', 'customer'],
      examples: ['$5,000 average CLV for premium tier', 'CLV calculation model']
    },
    {
      id: 'term-005',
      name: 'Personally Identifiable Information',
      definition: 'Information that can be used to identify, contact, or locate an individual person.',
      domain: 'Data Privacy',
      status: 'approved',
      steward: 'Emily Anderson',
      lastUpdated: '2025-07-25',
      relatedTerms: ['GDPR', 'Data Protection', 'Privacy Policy'],
      tags: ['privacy', 'compliance', 'security'],
      examples: ['Name, email address, social security number', 'Biometric data']
    },
    {
      id: 'term-006',
      name: 'Net Promoter Score',
      definition: 'A metric for assessing customer loyalty based on likelihood to recommend a company or product.',
      domain: 'Customer Experience',
      status: 'approved',
      steward: 'Thomas Wilson',
      lastUpdated: '2025-08-01',
      relatedTerms: ['Customer Satisfaction', 'Customer Feedback', 'Brand Loyalty'],
      tags: ['customer experience', 'metrics', 'satisfaction'],
      examples: ['Scale from 0-10', 'Promoters (9-10), Passives (7-8), Detractors (0-6)']
    }
  ];

  // Function to fetch business terms - would use API in production
  const fetchBusinessTerms = useCallback(async () => {
    // Only set loading true if we don't already have terms loaded (prevents flashing)
    if (terms.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter the sample data locally without artificial delay
      let filteredTerms = [...sampleTerms];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredTerms = sampleTerms.filter(term => 
          term.name.toLowerCase().includes(searchLower) ||
          term.definition.toLowerCase().includes(searchLower) ||
          term.domain.toLowerCase().includes(searchLower) ||
          term.steward.toLowerCase().includes(searchLower) ||
          (term.tags && term.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          (term.relatedTerms && term.relatedTerms.some(related => related.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('businessTermsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setTerms(filteredTerms);
    } catch (err) {
      console.error('Failed to fetch business terms:', err);
      setError('Failed to load business terms. Please try again later.');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('businessTermsSearchHistory');
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

  // Fetch terms when debounced search text changes
  useEffect(() => {
    fetchBusinessTerms();
  }, [fetchBusinessTerms]);

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50'; // Green
      case 'proposed':
        return '#2196F3'; // Blue
      case 'draft':
        return '#FFC107'; // Yellow
      case 'deprecated':
        return '#9E9E9E'; // Gray
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <Container sx={{ py: 4 }} className="business-terms-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Business Terminology
      </Typography>
      <Typography variant="body1" paragraph>
        Explore and manage standard business terms and definitions used across the organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search business terms..."
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
          aria-label="Search business terms"
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
          <CircularProgress aria-label="Loading business terms" />
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
              {terms.length > 0 
                ? `Showing ${terms.length} business terms` 
                : 'No business terms found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {terms.map((term) => (
              <Grid item xs={12} sm={6} md={4} key={term.id}>
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
                  aria-label={`View details for ${term.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // In a real app, this would navigate to term details
                      console.log(`Viewing details for ${term.name}`);
                    }
                  }}
                  onClick={() => {
                    // In a real app, this would navigate to term details
                    console.log(`Viewing details for ${term.name}`);
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
                        {term.name}
                      </Typography>
                      <Chip 
                        label={term.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(term.status),
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
                      {term.definition}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Domain:</strong> {term.domain}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Steward:</strong> {term.steward}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Last Updated:</strong> {term.lastUpdated}
                    </Typography>

                    {term.examples && term.examples.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          Examples:
                        </Typography>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                          {term.examples.map((example, index) => (
                            <li key={index}>
                              <Typography variant="caption">{example}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                    
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                          Related Terms:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {term.relatedTerms.map(relatedTerm => (
                            <Chip 
                              key={relatedTerm} 
                              label={relatedTerm} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchText(relatedTerm);
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {term.tags?.map(tag => (
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

export default BusinessTerms;

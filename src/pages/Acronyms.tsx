/**
 * Acronyms Page
 * 
 * Displays common data and business acronyms with full accessibility support
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
  IconButton,
  Divider
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

// Acronym type definition
interface Acronym {
  id: string;
  acronym: string;
  fullForm: string;
  description: string;
  domain: string;
  tags?: string[];
  relatedTerms?: string[];
}

const Acronyms: React.FC = () => {
  // State management
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleAcronyms: Acronym[] = [
    {
      id: 'acr-001',
      acronym: 'ETL',
      fullForm: 'Extract, Transform, Load',
      description: 'Process of extracting data from source systems, transforming it to fit operational needs, and loading it into the end target database or data warehouse.',
      domain: 'Data Integration',
      tags: ['data integration', 'data warehouse', 'data processing'],
      relatedTerms: ['Data Pipeline', 'Data Warehouse', 'Data Integration']
    },
    {
      id: 'acr-002',
      acronym: 'BI',
      fullForm: 'Business Intelligence',
      description: 'Strategies and technologies used for data analysis of business information to provide historical, current, and predictive views of business operations.',
      domain: 'Analytics',
      tags: ['analytics', 'reporting', 'dashboards'],
      relatedTerms: ['Reporting', 'Analytics', 'KPI']
    },
    {
      id: 'acr-003',
      acronym: 'CRM',
      fullForm: 'Customer Relationship Management',
      description: 'Strategy for managing all company interactions with current and potential customers using data analysis about customers\' history to improve business relationships.',
      domain: 'Sales & Marketing',
      tags: ['customers', 'sales', 'marketing'],
      relatedTerms: ['Sales', 'Customer', 'Lead']
    },
    {
      id: 'acr-004',
      acronym: 'DQ',
      fullForm: 'Data Quality',
      description: 'Refers to the condition of a set of values of qualitative or quantitative variables, focusing on accuracy, completeness, consistency, and reliability.',
      domain: 'Data Management',
      tags: ['quality', 'governance', 'data management'],
      relatedTerms: ['Data Governance', 'Data Integrity', 'Data Cleansing']
    },
    {
      id: 'acr-005',
      acronym: 'KPI',
      fullForm: 'Key Performance Indicator',
      description: 'A measurable value that demonstrates how effectively a company is achieving key business objectives.',
      domain: 'Business Analysis',
      tags: ['metrics', 'performance', 'measurement'],
      relatedTerms: ['Metrics', 'Performance', 'Objectives']
    },
    {
      id: 'acr-006',
      acronym: 'MDM',
      fullForm: 'Master Data Management',
      description: 'A comprehensive method of enabling an enterprise to link all of its critical data to a common point of reference, providing a trusted source of truth.',
      domain: 'Data Management',
      tags: ['master data', 'single source of truth', 'data integration'],
      relatedTerms: ['Golden Record', 'Data Integration', 'Data Governance']
    },
    {
      id: 'acr-007',
      acronym: 'GDPR',
      fullForm: 'General Data Protection Regulation',
      description: 'A regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area.',
      domain: 'Data Privacy',
      tags: ['privacy', 'compliance', 'regulation'],
      relatedTerms: ['Privacy', 'Compliance', 'Data Subject Rights']
    },
    {
      id: 'acr-008',
      acronym: 'API',
      fullForm: 'Application Programming Interface',
      description: 'A set of routines, protocols, and tools for building software applications that specify how software components should interact.',
      domain: 'Software Development',
      tags: ['integration', 'development', 'interfaces'],
      relatedTerms: ['REST', 'SOAP', 'Microservices']
    },
    {
      id: 'acr-009',
      acronym: 'ML',
      fullForm: 'Machine Learning',
      description: 'The scientific study of algorithms and statistical models that computer systems use to perform a specific task without using explicit instructions.',
      domain: 'Data Science',
      tags: ['artificial intelligence', 'algorithms', 'predictive models'],
      relatedTerms: ['AI', 'Neural Networks', 'Deep Learning']
    },
    {
      id: 'acr-010',
      acronym: 'DW',
      fullForm: 'Data Warehouse',
      description: 'A system used for reporting and data analysis, and is considered a core component of business intelligence.',
      domain: 'Data Storage',
      tags: ['data storage', 'analytics', 'reporting'],
      relatedTerms: ['ETL', 'OLAP', 'Data Mart']
    }
  ];

  // Function to fetch acronyms - would use API in production
  const fetchAcronyms = useCallback(async () => {
    // Only set loading true if we don't already have acronyms loaded (prevents flashing)
    if (acronyms.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter the sample data locally
      let filteredAcronyms = [...sampleAcronyms];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredAcronyms = sampleAcronyms.filter(item => 
          item.acronym.toLowerCase().includes(searchLower) ||
          item.fullForm.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.domain.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          (item.relatedTerms && item.relatedTerms.some(related => related.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('acronymsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setAcronyms(filteredAcronyms);
    } catch (err) {
      console.error('Failed to fetch acronyms:', err);
      setError('Failed to load acronyms. Please try again later.');
      setAcronyms([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('acronymsSearchHistory');
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

  // Fetch acronyms when debounced search text changes
  useEffect(() => {
    fetchAcronyms();
  }, [fetchAcronyms]);

  return (
    <Container sx={{ py: 4 }} className="acronyms-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Acronyms
      </Typography>
      <Typography variant="body1" paragraph>
        Common data and business acronyms used across the organization.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search acronyms..."
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
          aria-label="Search acronyms"
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
          <CircularProgress aria-label="Loading acronyms" />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}

      {/* Search results count */}
      {!loading && !error && (
        <Box sx={{ mb: 2 }} aria-live="polite">
          <Typography variant="body2" color="text.secondary">
            {acronyms.length === 0
              ? 'No acronyms found matching your search.'
              : `Showing ${acronyms.length} acronym${acronyms.length === 1 ? '' : 's'}.`}
          </Typography>
        </Box>
      )}

      {/* Acronyms grid */}
      {!loading && !error && acronyms.length > 0 && (
        <Grid container spacing={3}>
          {acronyms.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                elevation={1}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                  },
                }}
                tabIndex={0}
                aria-label={`Acronym ${item.acronym}: ${item.fullForm}`}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1785FB' }}>
                        {item.acronym}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {item.fullForm}
                      </Typography>
                    </Box>
                    <Chip 
                      label={item.domain} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#E3F2FD', 
                        color: '#0D47A1',
                        fontWeight: 500 
                      }}
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  
                  {/* Related terms */}
                  {item.relatedTerms && item.relatedTerms.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                        Related terms:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {item.relatedTerms.map((term, idx) => (
                          <Chip 
                            key={`${item.id}-related-${idx}`}
                            label={term} 
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                        Tags:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {item.tags.map((tag, idx) => (
                          <Chip 
                            key={`${item.id}-tag-${idx}`}
                            label={tag} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#F3F4F6', 
                              color: '#4B5563',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Acronyms;

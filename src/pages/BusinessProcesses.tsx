/**
 * Business Processes Page
 * 
 * Displays business processes with full accessibility support
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

// Sample business process type for demonstration
interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  owner: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string;
  relatedAssets?: string[];
  tags?: string[];
}

const BusinessProcesses: React.FC = () => {
  // State management
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleProcesses: BusinessProcess[] = [
    {
      id: 'proc-001',
      name: 'Customer Onboarding',
      description: 'Process for bringing new customers into the system',
      owner: 'Customer Success Team',
      category: 'Customer Management',
      status: 'active',
      lastUpdated: '2025-07-15',
      relatedAssets: ['data-asset-001', 'data-asset-015'],
      tags: ['customer', 'onboarding', 'CRM']
    },
    {
      id: 'proc-002',
      name: 'Order Processing',
      description: 'End-to-end order processing workflow',
      owner: 'Operations',
      category: 'Sales',
      status: 'active',
      lastUpdated: '2025-07-20',
      relatedAssets: ['data-asset-005', 'data-asset-022'],
      tags: ['orders', 'fulfillment', 'inventory']
    },
    {
      id: 'proc-003',
      name: 'Data Quality Assessment',
      description: 'Regular process to assess and report on data quality',
      owner: 'Data Governance',
      category: 'Data Management',
      status: 'active',
      lastUpdated: '2025-07-25',
      relatedAssets: ['data-asset-008', 'data-asset-012'],
      tags: ['data quality', 'metrics', 'governance']
    },
    {
      id: 'proc-004',
      name: 'Financial Reporting',
      description: 'Monthly financial reporting process',
      owner: 'Finance',
      category: 'Reporting',
      status: 'active',
      lastUpdated: '2025-07-28',
      relatedAssets: ['data-asset-030', 'data-asset-031'],
      tags: ['financial', 'reporting', 'compliance']
    },
    {
      id: 'proc-005',
      name: 'Data Warehouse ETL',
      description: 'Extract, Transform, Load process for the Data Warehouse',
      owner: 'Data Engineering',
      category: 'Data Management',
      status: 'active',
      lastUpdated: '2025-07-30',
      relatedAssets: ['data-asset-017', 'data-asset-024'],
      tags: ['ETL', 'data warehouse', 'integration']
    },
    {
      id: 'proc-006',
      name: 'Compliance Audit',
      description: 'Regular compliance auditing process',
      owner: 'Legal',
      category: 'Compliance',
      status: 'active',
      lastUpdated: '2025-08-01',
      relatedAssets: ['data-asset-007', 'data-asset-019'],
      tags: ['audit', 'compliance', 'regulatory']
    }
  ];

  // Function to fetch business processes - would use API in production
  const fetchBusinessProcesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter processes based on search text if provided
      let filteredProcesses = [...sampleProcesses];
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredProcesses = sampleProcesses.filter(process => 
          process.name.toLowerCase().includes(searchLower) ||
          process.description.toLowerCase().includes(searchLower) ||
          process.owner.toLowerCase().includes(searchLower) ||
          process.category.toLowerCase().includes(searchLower) ||
          (process.tags && process.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('businessProcessSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setProcesses(filteredProcesses);
    } catch (err) {
      console.error('Failed to fetch business processes:', err);
      setError('Failed to load business processes. Please try again later.');
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('businessProcessSearchHistory');
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

  // Fetch processes when debounced search text changes
  useEffect(() => {
    fetchBusinessProcesses();
  }, [fetchBusinessProcesses]);

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
    <Container sx={{ py: 4 }} className="business-processes-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        E-Unify Business Processes
      </Typography>
      <Typography variant="body1" paragraph>
        Manage and explore business processes and their relationships to data assets.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search business processes..."
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
          aria-label="Search business processes"
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
          <CircularProgress aria-label="Loading business processes" />
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
              {processes.length > 0 
                ? `Showing ${processes.length} business processes` 
                : 'No business processes found'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {processes.map((process) => (
              <Grid item xs={12} sm={6} md={4} key={process.id}>
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
                  aria-label={`View details for ${process.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // In a real app, this would navigate to process details
                      console.log(`Viewing details for ${process.name}`);
                    }
                  }}
                  onClick={() => {
                    // In a real app, this would navigate to process details
                    console.log(`Viewing details for ${process.name}`);
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
                        {process.name}
                      </Typography>
                      <Chip 
                        label={process.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(process.status),
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
                      {process.description}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Owner:</strong> {process.owner}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      <strong>Category:</strong> {process.category}
                    </Typography>
                    
                    <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                      <strong>Last Updated:</strong> {process.lastUpdated}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {process.tags?.map(tag => (
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

export default BusinessProcesses;

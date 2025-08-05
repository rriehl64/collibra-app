/**
 * Reports Page
 * 
 * Displays data reports with full accessibility support
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
  Divider,
  Button,
  CardActions,
  CardMedia,
  CardHeader,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon
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

// Report type definition
interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  createdDate: string;
  updatedDate: string;
  viewCount: number;
  type: 'dashboard' | 'chart' | 'table' | 'document';
  chartType?: 'pie' | 'bar' | 'line' | 'combo';
  thumbnail?: string;
  tags?: string[];
  relatedReports?: string[];
}

const getReportIcon = (type: string, chartType?: string) => {
  switch (type) {
    case 'dashboard':
      return <DashboardIcon />;
    case 'chart':
      switch (chartType) {
        case 'pie':
          return <PieChartIcon />;
        case 'bar':
          return <BarChartIcon />;
        case 'line':
          return <TimelineIcon />;
        default:
          return <BarChartIcon />;
      }
    case 'table':
      return <TableChartIcon />;
    default:
      return <VisibilityIcon />;
  }
};

const Reports: React.FC = () => {
  // State management
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleReports: Report[] = [
    {
      id: 'rep-001',
      title: 'Data Quality Dashboard',
      description: 'Executive overview of data quality metrics across all critical data domains.',
      category: 'Data Quality',
      owner: 'Data Governance Team',
      createdDate: '2025-07-01',
      updatedDate: '2025-08-02',
      viewCount: 142,
      type: 'dashboard',
      thumbnail: 'https://via.placeholder.com/300x160?text=Data+Quality+Dashboard',
      tags: ['data quality', 'dashboard', 'executive'],
      relatedReports: ['Master Data Accuracy Report', 'Data Completeness Trends']
    },
    {
      id: 'rep-002',
      title: 'Customer Data Distribution',
      description: 'Geographical and demographic distribution of customer data.',
      category: 'Customer Analytics',
      owner: 'Marketing Team',
      createdDate: '2025-07-12',
      updatedDate: '2025-07-30',
      viewCount: 89,
      type: 'chart',
      chartType: 'pie',
      thumbnail: 'https://via.placeholder.com/300x160?text=Customer+Distribution',
      tags: ['customer', 'demographics', 'distribution'],
      relatedReports: ['Customer Acquisition Report', 'Demographic Trends']
    },
    {
      id: 'rep-003',
      title: 'Regulatory Compliance Summary',
      description: 'Summary of data assets compliance with regulatory requirements.',
      category: 'Compliance',
      owner: 'Compliance Officer',
      createdDate: '2025-06-15',
      updatedDate: '2025-08-01',
      viewCount: 76,
      type: 'table',
      thumbnail: 'https://via.placeholder.com/300x160?text=Compliance+Summary',
      tags: ['compliance', 'regulatory', 'summary'],
      relatedReports: ['GDPR Compliance Details', 'Data Privacy Audit']
    },
    {
      id: 'rep-004',
      title: 'Data Literacy Assessment',
      description: 'Organizational data literacy levels based on assessment surveys.',
      category: 'Organizational',
      owner: 'Chief Data Officer',
      createdDate: '2025-05-20',
      updatedDate: '2025-07-20',
      viewCount: 53,
      type: 'chart',
      chartType: 'bar',
      thumbnail: 'https://via.placeholder.com/300x160?text=Literacy+Assessment',
      tags: ['literacy', 'assessment', 'skills'],
      relatedReports: ['Training Effectiveness', 'Data Skills Gap Analysis']
    },
    {
      id: 'rep-005',
      title: 'Data Access Requests',
      description: 'Analysis of data access requests and fulfillment times.',
      category: 'Operational',
      owner: 'Data Operations',
      createdDate: '2025-07-05',
      updatedDate: '2025-08-03',
      viewCount: 68,
      type: 'chart',
      chartType: 'line',
      thumbnail: 'https://via.placeholder.com/300x160?text=Access+Requests+Trends',
      tags: ['access', 'operations', 'trends'],
      relatedReports: ['Access Request SLA', 'User Satisfaction']
    },
    {
      id: 'rep-006',
      title: 'Data Integration Performance',
      description: 'Success rates and performance metrics for data integration processes.',
      category: 'Technical',
      owner: 'Data Engineering',
      createdDate: '2025-06-25',
      updatedDate: '2025-07-25',
      viewCount: 42,
      type: 'dashboard',
      thumbnail: 'https://via.placeholder.com/300x160?text=Integration+Performance',
      tags: ['integration', 'performance', 'technical'],
      relatedReports: ['ETL Failure Analysis', 'Data Pipeline Metrics']
    },
    {
      id: 'rep-007',
      title: 'Data Catalog Usage',
      description: 'Analysis of data catalog user engagement and search patterns.',
      category: 'User Engagement',
      owner: 'Data Catalog Team',
      createdDate: '2025-07-10',
      updatedDate: '2025-08-01',
      viewCount: 37,
      type: 'chart',
      chartType: 'combo',
      thumbnail: 'https://via.placeholder.com/300x160?text=Catalog+Usage',
      tags: ['catalog', 'usage', 'engagement'],
      relatedReports: ['Search Trends', 'User Journey Analysis']
    },
    {
      id: 'rep-008',
      title: 'Data Storage Optimization',
      description: 'Analysis of data storage usage and recommendations for optimization.',
      category: 'Technical',
      owner: 'Enterprise Architecture',
      createdDate: '2025-06-05',
      updatedDate: '2025-07-15',
      viewCount: 29,
      type: 'dashboard',
      thumbnail: 'https://via.placeholder.com/300x160?text=Storage+Optimization',
      tags: ['storage', 'optimization', 'technical'],
      relatedReports: ['Redundant Data Analysis', 'Storage Cost Trends']
    },
    {
      id: 'rep-009',
      title: 'Business Glossary Impact',
      description: 'Impact analysis of business glossary usage on data quality and understanding.',
      category: 'Documentation',
      owner: 'Business Analysts',
      createdDate: '2025-07-08',
      updatedDate: '2025-07-28',
      viewCount: 45,
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x160?text=Glossary+Impact',
      tags: ['glossary', 'impact', 'documentation'],
      relatedReports: ['Terminology Adoption', 'Communication Effectiveness']
    },
    {
      id: 'rep-010',
      title: 'Data Policy Effectiveness',
      description: 'Analysis of data policy implementation and effectiveness across the organization.',
      category: 'Governance',
      owner: 'Data Governance Council',
      createdDate: '2025-06-20',
      updatedDate: '2025-07-20',
      viewCount: 51,
      type: 'table',
      thumbnail: 'https://via.placeholder.com/300x160?text=Policy+Effectiveness',
      tags: ['policy', 'governance', 'effectiveness'],
      relatedReports: ['Policy Adherence', 'Implementation Challenges']
    }
  ];

  // Function to fetch reports - would use API in production
  const fetchReports = useCallback(async () => {
    // Only set loading true if we don't already have reports loaded (prevents flashing)
    if (reports.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter the sample data locally
      let filteredReports = [...sampleReports];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredReports = sampleReports.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.owner.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          (item.relatedReports && item.relatedReports.some(related => related.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('reportsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setReports(filteredReports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports. Please try again later.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('reportsSearchHistory');
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

  // Fetch reports when debounced search text changes
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Container sx={{ py: 4 }} className="reports-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Data Reports
      </Typography>
      <Typography variant="body1" paragraph>
        Insights and analytics from across the organization's data landscape.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search reports..."
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
          aria-label="Search reports"
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
          <CircularProgress aria-label="Loading reports" />
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
            {reports.length === 0
              ? 'No reports found matching your search.'
              : `Showing ${reports.length} report${reports.length === 1 ? '' : 's'}.`}
          </Typography>
        </Box>
      )}

      {/* Reports grid */}
      {!loading && !error && reports.length > 0 && (
        <Grid container spacing={3}>
          {reports.map((item) => (
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
                role="button"
                aria-label={`Report: ${item.title} - ${item.description}`}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: '#1785FB' }} aria-label={`Report type: ${item.type}`}>
                      {getReportIcon(item.type, item.chartType)}
                    </Avatar>
                  }
                  title={item.title}
                  titleTypographyProps={{ variant: 'h6', component: 'h3', sx: { fontWeight: 600, color: '#1785FB' } }}
                  subheader={item.category}
                />
                
                {item.thumbnail && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.thumbnail}
                    alt={`${item.title} preview`}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Owner: {item.owner}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon fontSize="small" /> {item.viewCount}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Updated: {formatDate(item.updatedDate)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Related reports */}
                  {item.relatedReports && item.relatedReports.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                        Related reports:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {item.relatedReports.map((report, idx) => (
                          <Chip 
                            key={`${item.id}-related-${idx}`}
                            label={report} 
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
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    sx={{ ml: 1 }}
                    aria-label={`View ${item.title} report`}
                  >
                    View
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<DownloadIcon />}
                    aria-label={`Download ${item.title} report`}
                  >
                    Download
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ShareIcon />}
                    aria-label={`Share ${item.title} report`}
                  >
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Reports;

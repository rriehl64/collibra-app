/**
 * BI Reports Page
 * 
 * Displays Business Intelligence reports and dashboards with full accessibility support
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
  Avatar,
  Link,
  Tooltip
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
  Visibility as VisibilityIcon,
  OpenInNew as OpenInNewIcon,
  DataObject as DataObjectIcon,
  FilterAlt as FilterAltIcon,
  ViewQuilt as ViewQuiltIcon
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

// BIReport type definition
interface BIReport {
  id: string;
  title: string;
  description: string;
  platform: 'PowerBI' | 'Tableau' | 'Looker' | 'Qlik' | 'Other';
  category: string;
  owner: string;
  createdDate: string;
  updatedDate: string;
  viewCount: number;
  reportType: 'dashboard' | 'visualization' | 'interactive' | 'scorecard';
  refreshFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  thumbnail?: string;
  externalUrl?: string;
  tags?: string[];
  relatedReports?: string[];
  metrics?: string[];
  accessLevel: 'public' | 'restricted' | 'confidential';
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'PowerBI':
      return <ViewQuiltIcon />;
    case 'Tableau':
      return <DashboardIcon />;
    case 'Looker':
      return <DataObjectIcon />;
    case 'Qlik':
      return <PieChartIcon />;
    default:
      return <BarChartIcon />;
  }
};

const getReportTypeIcon = (type: string) => {
  switch (type) {
    case 'dashboard':
      return <DashboardIcon />;
    case 'visualization':
      return <PieChartIcon />;
    case 'interactive':
      return <FilterAltIcon />;
    case 'scorecard':
      return <TableChartIcon />;
    default:
      return <VisibilityIcon />;
  }
};

const BIReports: React.FC = () => {
  // State management
  const [biReports, setBIReports] = useState<BIReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleBIReports: BIReport[] = [
    {
      id: 'bi-001',
      title: 'Executive Sales Dashboard',
      description: 'Comprehensive view of sales performance across all regions with drill-down capabilities.',
      platform: 'PowerBI',
      category: 'Sales',
      owner: 'Sales Operations',
      createdDate: '2025-06-15',
      updatedDate: '2025-08-01',
      viewCount: 327,
      reportType: 'dashboard',
      refreshFrequency: 'daily',
      thumbnail: 'https://via.placeholder.com/300x160?text=Sales+Dashboard',
      externalUrl: 'https://powerbi.microsoft.com/example-dashboard',
      tags: ['sales', 'revenue', 'executive', 'performance'],
      relatedReports: ['Regional Sales Analysis', 'Product Revenue Breakdown'],
      metrics: ['Total Revenue', 'Sales Growth', 'Conversion Rate'],
      accessLevel: 'restricted'
    },
    {
      id: 'bi-002',
      title: 'Customer Segmentation Analysis',
      description: 'Interactive visualization of customer segments based on behavior, demographics, and purchase patterns.',
      platform: 'Tableau',
      category: 'Customer Analytics',
      owner: 'Marketing Analytics Team',
      createdDate: '2025-05-22',
      updatedDate: '2025-07-28',
      viewCount: 185,
      reportType: 'interactive',
      refreshFrequency: 'weekly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Customer+Segmentation',
      externalUrl: 'https://tableau.company.com/customer-segmentation',
      tags: ['customers', 'segmentation', 'marketing', 'behavior'],
      relatedReports: ['Customer Lifetime Value', 'Churn Prediction'],
      metrics: ['Segment Size', 'Average Order Value', 'Engagement Score'],
      accessLevel: 'restricted'
    },
    {
      id: 'bi-003',
      title: 'Data Quality Scorecard',
      description: 'Detailed metrics on data quality dimensions across critical data domains with trend analysis.',
      platform: 'PowerBI',
      category: 'Data Management',
      owner: 'Data Governance',
      createdDate: '2025-07-05',
      updatedDate: '2025-08-03',
      viewCount: 142,
      reportType: 'scorecard',
      refreshFrequency: 'weekly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Data+Quality+Scorecard',
      tags: ['data quality', 'governance', 'metrics', 'compliance'],
      relatedReports: ['Data Completeness Report', 'Master Data Accuracy'],
      metrics: ['Completeness Score', 'Accuracy Rate', 'Consistency Index'],
      accessLevel: 'public'
    },
    {
      id: 'bi-004',
      title: 'Operational KPI Dashboard',
      description: 'Real-time operational metrics tracking business-critical processes and system performance.',
      platform: 'Looker',
      category: 'Operations',
      owner: 'Operations Team',
      createdDate: '2025-06-01',
      updatedDate: '2025-07-30',
      viewCount: 298,
      reportType: 'dashboard',
      refreshFrequency: 'realtime',
      thumbnail: 'https://via.placeholder.com/300x160?text=Operational+KPIs',
      externalUrl: 'https://looker.company.com/operations-dashboard',
      tags: ['operations', 'kpis', 'real-time', 'performance'],
      relatedReports: ['Process Efficiency', 'System Uptime Report'],
      metrics: ['Process Cycle Time', 'Error Rate', 'Throughput'],
      accessLevel: 'restricted'
    },
    {
      id: 'bi-005',
      title: 'Data Literacy Assessment Visualization',
      description: 'Interactive visualization of organizational data literacy levels with department breakdown.',
      platform: 'Tableau',
      category: 'Training & Development',
      owner: 'CDO Office',
      createdDate: '2025-04-12',
      updatedDate: '2025-07-15',
      viewCount: 87,
      reportType: 'visualization',
      refreshFrequency: 'monthly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Literacy+Assessment',
      tags: ['literacy', 'training', 'assessment', 'skills'],
      relatedReports: ['Training Completion Rates', 'Skills Gap Analysis'],
      metrics: ['Literacy Score', 'Training Participation', 'Competency Level'],
      accessLevel: 'public'
    },
    {
      id: 'bi-006',
      title: 'Regulatory Compliance Dashboard',
      description: 'Comprehensive view of compliance status across all regulatory requirements with risk indicators.',
      platform: 'PowerBI',
      category: 'Compliance',
      owner: 'Compliance Office',
      createdDate: '2025-05-18',
      updatedDate: '2025-08-01',
      viewCount: 164,
      reportType: 'dashboard',
      refreshFrequency: 'daily',
      thumbnail: 'https://via.placeholder.com/300x160?text=Compliance+Dashboard',
      externalUrl: 'https://powerbi.microsoft.com/compliance-dashboard',
      tags: ['compliance', 'regulatory', 'risk', 'governance'],
      relatedReports: ['GDPR Compliance Status', 'Audit Findings'],
      metrics: ['Compliance Rate', 'Risk Score', 'Remediation Status'],
      accessLevel: 'confidential'
    },
    {
      id: 'bi-007',
      title: 'Data Catalog Usage Analytics',
      description: 'Detailed analysis of data catalog engagement patterns and most-used assets.',
      platform: 'Looker',
      category: 'Data Management',
      owner: 'Data Catalog Team',
      createdDate: '2025-06-20',
      updatedDate: '2025-07-25',
      viewCount: 93,
      reportType: 'interactive',
      refreshFrequency: 'weekly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Catalog+Analytics',
      tags: ['catalog', 'usage', 'analytics', 'engagement'],
      relatedReports: ['Search Patterns', 'User Engagement Metrics'],
      metrics: ['Active Users', 'Search Volume', 'Asset Views'],
      accessLevel: 'restricted'
    },
    {
      id: 'bi-008',
      title: 'Data Integration Performance',
      description: 'Real-time monitoring of ETL processes, data pipelines, and integration metrics.',
      platform: 'Qlik',
      category: 'Data Engineering',
      owner: 'Data Engineering Team',
      createdDate: '2025-07-01',
      updatedDate: '2025-08-02',
      viewCount: 119,
      reportType: 'dashboard',
      refreshFrequency: 'realtime',
      thumbnail: 'https://via.placeholder.com/300x160?text=Integration+Performance',
      externalUrl: 'https://qlik.company.com/data-integration',
      tags: ['etl', 'integration', 'pipelines', 'performance'],
      relatedReports: ['Failed Jobs Report', 'Data Latency Analysis'],
      metrics: ['Success Rate', 'Processing Time', 'Error Count'],
      accessLevel: 'restricted'
    },
    {
      id: 'bi-009',
      title: 'Business Glossary Impact',
      description: 'Analysis of business glossary usage and its correlation with data quality improvements.',
      platform: 'PowerBI',
      category: 'Data Governance',
      owner: 'Data Governance Council',
      createdDate: '2025-05-10',
      updatedDate: '2025-07-15',
      viewCount: 76,
      reportType: 'visualization',
      refreshFrequency: 'monthly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Glossary+Impact',
      tags: ['glossary', 'governance', 'impact', 'quality'],
      relatedReports: ['Terminology Adoption', 'Quality Correlation'],
      metrics: ['Definition Coverage', 'Usage Rate', 'Quality Improvement'],
      accessLevel: 'public'
    },
    {
      id: 'bi-010',
      title: 'Cross-Department Data Sharing Metrics',
      description: 'Visualization of data sharing patterns and collaboration metrics across departments.',
      platform: 'Tableau',
      category: 'Collaboration',
      owner: 'Enterprise Data Team',
      createdDate: '2025-06-25',
      updatedDate: '2025-07-30',
      viewCount: 108,
      reportType: 'interactive',
      refreshFrequency: 'weekly',
      thumbnail: 'https://via.placeholder.com/300x160?text=Data+Sharing+Metrics',
      tags: ['collaboration', 'sharing', 'departments', 'metrics'],
      relatedReports: ['Data Access Patterns', 'Collaboration Effectiveness'],
      metrics: ['Sharing Frequency', 'Cross-functional Use', 'Collaboration Index'],
      accessLevel: 'restricted'
    }
  ];

  // Function to fetch BI reports - would use API in production
  const fetchBIReports = useCallback(async () => {
    // Only set loading true if we don't already have reports loaded (prevents flashing)
    if (biReports.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter the sample data locally
      let filteredReports = [...sampleBIReports];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredReports = sampleBIReports.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.owner.toLowerCase().includes(searchLower) ||
          item.platform.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          (item.relatedReports && item.relatedReports.some(related => related.toLowerCase().includes(searchLower))) ||
          (item.metrics && item.metrics.some(metric => metric.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('biReportsSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setBIReports(filteredReports);
    } catch (err) {
      console.error('Failed to fetch BI reports:', err);
      setError('Failed to load BI reports. Please try again later.');
      setBIReports([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('biReportsSearchHistory');
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

  // Fetch BI reports when debounced search text changes
  useEffect(() => {
    fetchBIReports();
  }, [fetchBIReports]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get access level badge color
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return { bg: '#E8F5E9', text: '#2E7D32' }; // Green
      case 'restricted':
        return { bg: '#FFF3E0', text: '#E65100' }; // Orange
      case 'confidential':
        return { bg: '#FFEBEE', text: '#C62828' }; // Red
      default:
        return { bg: '#E8F5E9', text: '#2E7D32' }; // Default to green
    }
  };

  // Get refresh frequency text
  const getRefreshText = (frequency: string) => {
    switch (frequency) {
      case 'realtime':
        return 'Real-time updates';
      case 'daily':
        return 'Updated daily';
      case 'weekly':
        return 'Updated weekly';
      case 'monthly':
        return 'Updated monthly';
      default:
        return 'Update frequency unknown';
    }
  };

  return (
    <Container sx={{ py: 4 }} className="bi-reports-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Business Intelligence Reports
      </Typography>
      <Typography variant="body1" paragraph>
        Enterprise BI dashboards and reports from various platforms providing business insights.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search BI reports..."
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
          aria-label="Search BI reports"
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
          <CircularProgress aria-label="Loading BI reports" />
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
            {biReports.length === 0
              ? 'No BI reports found matching your search.'
              : `Showing ${biReports.length} BI report${biReports.length === 1 ? '' : 's'}.`}
          </Typography>
        </Box>
      )}

      {/* BI Reports grid */}
      {!loading && !error && biReports.length > 0 && (
        <Grid container spacing={3}>
          {biReports.map((item) => {
            const accessLevelColors = getAccessLevelColor(item.accessLevel);
            
            return (
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
                  aria-label={`BI Report: ${item.title} - ${item.description}`}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: '#1785FB' }} aria-label={`${item.platform} report`}>
                        {getPlatformIcon(item.platform)}
                      </Avatar>
                    }
                    title={item.title}
                    titleTypographyProps={{ variant: 'h6', component: 'h3', sx: { fontWeight: 600, color: '#1785FB' } }}
                    subheader={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption">{item.platform}</Typography>
                        <Chip 
                          label={item.accessLevel} 
                          size="small" 
                          sx={{ 
                            backgroundColor: accessLevelColors.bg, 
                            color: accessLevelColors.text,
                            height: '20px',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    }
                    action={
                      <Tooltip title={getReportTypeIcon(item.reportType)}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#E3F2FD', color: '#1976D2' }}>
                          {getReportTypeIcon(item.reportType)}
                        </Avatar>
                      </Tooltip>
                    }
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
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Category: {item.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" /> {item.viewCount}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Owner: {item.owner}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimelineIcon fontSize="small" /> {getRefreshText(item.refreshFrequency)}
                      </Typography>
                    </Box>
                    
                    {/* Key Metrics */}
                    {item.metrics && item.metrics.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                          Key Metrics:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.metrics.map((metric, idx) => (
                            <Chip 
                              key={`${item.id}-metric-${idx}`}
                              label={metric} 
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderColor: '#1785FB', color: '#1785FB' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
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
                    {item.externalUrl && (
                      <Button 
                        size="small" 
                        startIcon={<OpenInNewIcon />}
                        component={Link}
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${item.title} in ${item.platform}`}
                      >
                        Open in {item.platform}
                      </Button>
                    )}
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
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default BIReports;

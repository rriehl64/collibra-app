/**
 * KPIs Page
 * 
 * Displays key performance indicators with full accessibility support
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
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
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

// KPI type definition
interface KPI {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  frequency: string;
  tags?: string[];
  relatedKPIs?: string[];
}

const KPIs: React.FC = () => {
  // State management
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleKPIs: KPI[] = [
    {
      id: 'kpi-001',
      name: 'Data Quality Score',
      description: 'Overall measure of data quality across all critical data domains based on completeness, accuracy, and consistency metrics.',
      category: 'Data Management',
      owner: 'Data Governance Team',
      currentValue: 87,
      targetValue: 95,
      unit: '%',
      trend: 'up',
      frequency: 'Monthly',
      tags: ['data quality', 'governance', 'metrics'],
      relatedKPIs: ['Data Completeness Rate', 'Master Data Accuracy']
    },
    {
      id: 'kpi-002',
      name: 'Customer Data Completion Rate',
      description: 'Percentage of customer records with all required fields completed across all systems.',
      category: 'Customer Data',
      owner: 'Customer Success',
      currentValue: 78,
      targetValue: 90,
      unit: '%',
      trend: 'up',
      frequency: 'Weekly',
      tags: ['customer data', 'completeness', 'data quality'],
      relatedKPIs: ['Data Quality Score', 'Customer Satisfaction']
    },
    {
      id: 'kpi-003',
      name: 'Regulatory Compliance Rate',
      description: 'Percentage of data assets that meet regulatory compliance requirements.',
      category: 'Compliance',
      owner: 'Compliance Officer',
      currentValue: 95,
      targetValue: 100,
      unit: '%',
      trend: 'flat',
      frequency: 'Quarterly',
      tags: ['compliance', 'regulatory', 'governance'],
      relatedKPIs: ['GDPR Compliance Score', 'Policy Adherence']
    },
    {
      id: 'kpi-004',
      name: 'Data Literacy Index',
      description: 'Measure of organizational data literacy based on surveys, training completion, and competency assessments.',
      category: 'Organizational',
      owner: 'Chief Data Officer',
      currentValue: 64,
      targetValue: 85,
      unit: '%',
      trend: 'up',
      frequency: 'Quarterly',
      tags: ['training', 'skills', 'literacy'],
      relatedKPIs: ['Training Completion Rate', 'Data-Driven Decision Making']
    },
    {
      id: 'kpi-005',
      name: 'Time to Data Access',
      description: 'Average time required for approved users to gain access to requested data assets.',
      category: 'Operational',
      owner: 'Data Operations',
      currentValue: 3.2,
      targetValue: 1,
      unit: 'days',
      trend: 'down',
      frequency: 'Monthly',
      tags: ['operations', 'efficiency', 'access management'],
      relatedKPIs: ['Data Request Volume', 'User Satisfaction']
    },
    {
      id: 'kpi-006',
      name: 'Data Integration Success Rate',
      description: 'Percentage of data integration processes completed successfully without errors or manual intervention.',
      category: 'Technical',
      owner: 'Data Engineering',
      currentValue: 92,
      targetValue: 99,
      unit: '%',
      trend: 'up',
      frequency: 'Weekly',
      tags: ['integration', 'reliability', 'engineering'],
      relatedKPIs: ['ETL Failure Rate', 'Data Pipeline Uptime']
    },
    {
      id: 'kpi-007',
      name: 'Data Catalog Utilization',
      description: 'Number of active users accessing the data catalog on a monthly basis.',
      category: 'User Engagement',
      owner: 'Data Catalog Team',
      currentValue: 420,
      targetValue: 600,
      unit: 'users',
      trend: 'up',
      frequency: 'Monthly',
      tags: ['catalog', 'usage', 'adoption'],
      relatedKPIs: ['Search Volume', 'Asset View Count']
    },
    {
      id: 'kpi-008',
      name: 'Data Redundancy Rate',
      description: 'Percentage of redundant data across systems based on duplicate detection algorithms.',
      category: 'Technical',
      owner: 'Enterprise Architecture',
      currentValue: 12,
      targetValue: 5,
      unit: '%',
      trend: 'down',
      frequency: 'Quarterly',
      tags: ['efficiency', 'storage', 'architecture'],
      relatedKPIs: ['Storage Cost', 'System Performance']
    },
    {
      id: 'kpi-009',
      name: 'Business Glossary Coverage',
      description: 'Percentage of critical data elements with approved business definitions in the business glossary.',
      category: 'Documentation',
      owner: 'Business Analysts',
      currentValue: 73,
      targetValue: 95,
      unit: '%',
      trend: 'up',
      frequency: 'Monthly',
      tags: ['glossary', 'documentation', 'metadata'],
      relatedKPIs: ['Data Literacy Index', 'Data Quality Score']
    },
    {
      id: 'kpi-010',
      name: 'Data Policy Adherence',
      description: 'Percentage of data assets that adhere to defined data policies and standards.',
      category: 'Governance',
      owner: 'Data Governance Council',
      currentValue: 81,
      targetValue: 100,
      unit: '%',
      trend: 'up',
      frequency: 'Monthly',
      tags: ['policy', 'governance', 'compliance'],
      relatedKPIs: ['Regulatory Compliance Rate', 'Data Quality Score']
    }
  ];

  // Function to fetch KPIs - would use API in production
  const fetchKPIs = useCallback(async () => {
    // Only set loading true if we don't already have KPIs loaded (prevents flashing)
    if (kpis.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter the sample data locally
      let filteredKPIs = [...sampleKPIs];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredKPIs = sampleKPIs.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.owner.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          (item.relatedKPIs && item.relatedKPIs.some(related => related.toLowerCase().includes(searchLower)))
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('kpisSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setKPIs(filteredKPIs);
    } catch (err) {
      console.error('Failed to fetch KPIs:', err);
      setError('Failed to load KPIs. Please try again later.');
      setKPIs([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('kpisSearchHistory');
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

  // Fetch KPIs when debounced search text changes
  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  // Get trend icon based on trend value
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: '#4CAF50' }} aria-label="Trending up" />;
      case 'down':
        return <TrendingDownIcon sx={{ color: trend === 'down' && ['Time to Data Access', 'Data Redundancy Rate'].some(name => kpis.find(k => k.name === name)?.trend === 'down') ? '#4CAF50' : '#F44336' }} aria-label="Trending down" />;
      case 'flat':
        return <TrendingFlatIcon sx={{ color: '#FFC107' }} aria-label="Trending flat" />;
      default:
        return null;
    }
  };

  // Calculate progress percentage for KPI target
  const calculateProgress = (current: number, target: number) => {
    // Reverse calculation for KPIs where lower is better
    if (['Time to Data Access', 'Data Redundancy Rate'].some(name => kpis.find(k => k.name === name && k.currentValue === current))) {
      // For metrics where lower is better, invert the progress calculation
      const invertedCurrent = target + (target - current);
      return Math.min(Math.max(0, (invertedCurrent / target) * 100), 100);
    }
    return Math.min(Math.max(0, (current / target) * 100), 100);
  };

  // Get color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 50) return '#F44336'; // Red
    if (progress < 75) return '#FFC107'; // Yellow
    return '#4CAF50'; // Green
  };

  return (
    <Container sx={{ py: 4 }} className="kpis-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Key Performance Indicators
      </Typography>
      <Typography variant="body1" paragraph>
        Critical metrics used to evaluate the success of organizational data initiatives and processes.
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search KPIs..."
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
          aria-label="Search KPIs"
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
          <CircularProgress aria-label="Loading KPIs" />
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
            {kpis.length === 0
              ? 'No KPIs found matching your search.'
              : `Showing ${kpis.length} KPI${kpis.length === 1 ? '' : 's'}.`}
          </Typography>
        </Box>
      )}

      {/* KPIs grid */}
      {!loading && !error && kpis.length > 0 && (
        <Grid container spacing={3}>
          {kpis.map((item) => {
            const progressPercentage = calculateProgress(item.currentValue, item.targetValue);
            const progressColor = getProgressColor(progressPercentage);
            
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
                  aria-label={`KPI ${item.name}: ${item.currentValue} ${item.unit} of ${item.targetValue} ${item.unit} target`}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1785FB', mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#E3F2FD', 
                          color: '#0D47A1',
                          fontWeight: 500 
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Current: {item.currentValue} {item.unit}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          Target: {item.targetValue} {item.unit}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={progressPercentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: progressColor
                              }
                            }}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progressPercentage}
                            aria-label={`Progress toward target: ${Math.round(progressPercentage)}%`}
                          />
                        </Box>
                        {getTrendIcon(item.trend)}
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Owner: {item.owner}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Frequency: {item.frequency}
                      </Typography>
                    </Box>
                    
                    {/* Related KPIs */}
                    {item.relatedKPIs && item.relatedKPIs.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                          Related KPIs:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.relatedKPIs.map((kpi, idx) => (
                            <Chip 
                              key={`${item.id}-related-${idx}`}
                              label={kpi} 
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
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default KPIs;

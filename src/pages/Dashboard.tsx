import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Button,
  useTheme,
  Alert
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Notifications as NotificationsIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  Business as BusinessIcon,
  SmartToy as AIIcon,
  Warning as RiskIcon,
  Timeline as TimelineIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataAssetService } from '../services/api';
import DashboardService from '../services/dashboardService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Portfolio data import (simplified for dashboard use)
const portfolioSummaryData = [
  {
    id: 'portfolio-data-request',
    name: 'Data Request Management',
    aiReadiness: 65,
    totalBudget: '$2.1M',
    programs: 3,
    criticalRisks: 2,
    aiInnovations: 3,
    status: 'Active'
  },
  {
    id: 'portfolio-data-governance',
    name: 'Data Governance',
    aiReadiness: 72,
    totalBudget: '$2.8M',
    programs: 4,
    criticalRisks: 1,
    aiInnovations: 4,
    status: 'Active'
  },
  {
    id: 'portfolio-data-engineering',
    name: 'Data Enterprise',
    aiReadiness: 85,
    totalBudget: '$4.2M',
    programs: 8,
    criticalRisks: 2,
    aiInnovations: 4,
    status: 'Active'
  },
  {
    id: 'portfolio-data-product',
    name: 'Data Product Management',
    aiReadiness: 58,
    totalBudget: '$1.9M',
    programs: 3,
    criticalRisks: 1,
    aiInnovations: 3,
    status: 'Active'
  }
];

// Define interfaces for dashboard data
interface DashboardMetrics {
  dataAssets: {
    total: number;
    newThisMonth: number;
  };
  dataDomains: {
    total: number;
    active: number;
  };
  compliance: {
    percentage: number;
    changeFromLastMonth: number;
  };
  tasks: {
    open: number;
    urgent: number;
  };
  charts: {
    domainDistribution: Array<{
      domain: string;
      count: number;
      percentage: number;
    }>;
    complianceStatus: Array<{
      status: string;
      count: number;
    }>;
  };
}

interface Activity {
  id: number;
  type: string;
  user: string;
  timestamp: Date;
  details: Record<string, any>;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentAssets, setRecentAssets] = useState<any[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Interactive enhancements: Animation and loading states
  const [announcementText, setAnnouncementText] = useState('');
  const [cardLoadingStates, setCardLoadingStates] = useState<{[key: string]: boolean}>({});
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard metrics
        const metrics = await DashboardService.getDashboardMetrics();
        setDashboardMetrics(metrics);
        
        // Fetch recent data assets
        const assets = await dataAssetService.getRecentDataAssets(5);
        setRecentAssets(assets);
        
        // Fetch activities
        const recentActivities = await DashboardService.getRecentActivities();
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds to keep data current
    const refreshInterval = setInterval(fetchDashboardData, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Trigger entrance animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimationTrigger(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Interactive enhancement functions
  const handleCardFocus = (cardName: string, value: string | number | null) => {
    const announcement = `${cardName} card focused. Current value: ${value || 'No data available'}. Press Enter or Space to view details.`;
    setAnnouncementText(announcement);
  };

  const handleCardClick = (cardName: string, onClick: () => void) => {
    setCardLoadingStates(prev => ({ ...prev, [cardName]: true }));
    setAnnouncementText(`Loading ${cardName} details...`);
    
    // Simulate loading state
    setTimeout(() => {
      setCardLoadingStates(prev => ({ ...prev, [cardName]: false }));
      onClick();
    }, 800);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent, onClick: () => void, cardName: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(cardName, onClick);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      (event.target as HTMLElement).blur();
      setAnnouncementText(`${cardName} card unfocused`);
    }
  };

  // Chart configuration - expanded color palette for better distribution
  const COLORS = [
    '#003366', // USCIS Blue
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#8884d8', // Purple
    '#82ca9d', // Light Green
    '#ffc658', // Gold
    '#ff7300', // Dark Orange
    '#8dd1e1', // Light Blue
    '#d084d0', // Pink
    '#87d068'  // Lime
  ];

  // Format domain distribution data for the pie chart
  const getDomainDistributionData = () => {
    if (!dashboardMetrics?.charts.domainDistribution) return [];
    
    return dashboardMetrics.charts.domainDistribution.map(item => ({
      name: item.domain,
      value: item.count,
      percentage: item.percentage
    }));
  };

  // Format compliance status data for the bar chart
  const getComplianceStatusData = () => {
    if (!dashboardMetrics?.charts.complianceStatus) return [];
    
    return dashboardMetrics.charts.complianceStatus.map(item => ({
      name: item.status,
      count: item.count
    }));
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Mock notifications - would come from a real API in production
  const notificationsData = [
    { id: 1, message: 'New data asset "Customer Analytics Dashboard" was added', time: '2 hours ago' },
    { id: 2, message: 'Policy update for GDPR compliance standards', time: 'Yesterday' },
    { id: 3, message: 'Data quality review pending for Finance Database', time: '3 days ago' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ fontWeight: 'bold', color: '#003366' }}>
        E-Unify Dashboard
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your data governance ecosystem
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* CSS Animations */}
          <style>
            {`
              @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
              @keyframes countUp {
                0% { transform: translateY(20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }
            `}
          </style>

          {/* Screen reader announcements */}
          <div 
            aria-live="polite" 
            aria-atomic="true"
            style={{ 
              position: 'absolute', 
              left: '-10000px', 
              width: '1px', 
              height: '1px', 
              overflow: 'hidden' 
            }}
          >
            {announcementText}
          </div>

          {/* Stats Overview */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                role="button"
                tabIndex={0}
                aria-labelledby="data-strategy-label"
                aria-describedby="data-strategy-description"
                onClick={() => handleCardClick('Data Strategy Support', () => navigate('/data-strategy-support'))}
                onFocus={() => handleCardFocus('Data Strategy Support', 'Plan & Execute')}
                onKeyDown={(e) => handleCardKeyDown(e, () => navigate('/data-strategy-support'), 'Data Strategy Support')}
                elevation={0}
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #4caf5008 0%, #4caf5015 100%)',
                  border: '2px solid #4caf50',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
                  transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animationTrigger ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.1s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
                    boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
                    borderColor: '#4caf50',
                    '&::before': {
                      height: '6px'
                    }
                  },
                  '&:focus': {
                    outline: '3px solid #005fcc',
                    outlineOffset: '2px',
                    transform: animationTrigger ? 'translateY(-2px) scale(1.01)' : 'translateY(20px)',
                    boxShadow: '0 8px 24px rgba(0, 51, 102, 0.2)'
                  },
                  '&:active': {
                    transform: animationTrigger ? 'translateY(-1px) scale(0.98)' : 'translateY(20px)',
                    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #4caf50 0%, #4caf5080 100%)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease'
                  },
                  '&::after': cardLoadingStates['Data Strategy Support'] ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  } : {},
                  p: '12px 8px 8px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140
                }}
              >
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Data Strategy Support
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.6rem', mb: 0.5 }}>
                  <MenuBookIcon sx={{ fontSize: '1.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Plan & Execute
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  Access strategy resources
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                role="button"
                tabIndex={0}
                aria-labelledby="data-assets-label"
                aria-describedby="data-assets-value data-assets-description"
                onClick={() => handleCardClick('Data Assets', () => navigate('/data-catalog'))}
                onFocus={() => handleCardFocus('Data Assets', formatNumber(dashboardMetrics?.dataAssets.total || 0))}
                onKeyDown={(e) => handleCardKeyDown(e, () => navigate('/data-catalog'), 'Data Assets')}
                elevation={0}
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1976d208 0%, #1976d215 100%)',
                  border: '2px solid #1976d2',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
                  transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animationTrigger ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
                    boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
                    borderColor: '#1976d2',
                    '&::before': {
                      height: '6px'
                    }
                  },
                  '&:focus': {
                    outline: '3px solid #005fcc',
                    outlineOffset: '2px',
                    transform: animationTrigger ? 'translateY(-2px) scale(1.01)' : 'translateY(20px)',
                    boxShadow: '0 8px 24px rgba(0, 51, 102, 0.2)'
                  },
                  '&:active': {
                    transform: animationTrigger ? 'translateY(-1px) scale(0.98)' : 'translateY(20px)',
                    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #1976d2 0%, #1976d280 100%)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease'
                  },
                  '&::after': cardLoadingStates['Data Assets'] ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  } : {},
                  p: '12px 8px 8px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140
                }}
              >
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Data Assets
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '2.6rem', mb: 0.5 }}>
                  {formatNumber(dashboardMetrics?.dataAssets.total || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  +{formatNumber(dashboardMetrics?.dataAssets.newThisMonth || 0)} this month
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                role="button"
                tabIndex={0}
                aria-labelledby="compliance-label"
                aria-describedby="compliance-value compliance-description"
                onClick={() => handleCardClick('Compliance', () => navigate('/compliance'))}
                onFocus={() => handleCardFocus('Compliance', `${dashboardMetrics?.compliance.percentage || 0}%`)}
                onKeyDown={(e) => handleCardKeyDown(e, () => navigate('/compliance'), 'Compliance')}
                elevation={0}
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ff980008 0%, #ff980015 100%)',
                  border: '2px solid #ff9800',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
                  transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animationTrigger ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.4s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
                    boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
                    borderColor: '#ff9800',
                    '&::before': {
                      height: '6px'
                    }
                  },
                  '&:focus': {
                    outline: '3px solid #005fcc',
                    outlineOffset: '2px',
                    transform: animationTrigger ? 'translateY(-2px) scale(1.01)' : 'translateY(20px)',
                    boxShadow: '0 8px 24px rgba(0, 51, 102, 0.2)'
                  },
                  '&:active': {
                    transform: animationTrigger ? 'translateY(-1px) scale(0.98)' : 'translateY(20px)',
                    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ff9800 0%, #ff980080 100%)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease'
                  },
                  '&::after': cardLoadingStates['Compliance'] ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  } : {},
                  p: '12px 8px 8px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140
                }}
              >
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Compliance
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '2.6rem', mb: 0.5 }}>
                  {dashboardMetrics?.compliance.percentage || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {dashboardMetrics && dashboardMetrics.compliance.changeFromLastMonth > 0 ? '+' : ''}
                  {dashboardMetrics?.compliance.changeFromLastMonth || 0}% from last month
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                role="button"
                tabIndex={0}
                aria-label="View Data Domains"
                onClick={() => navigate('/assets/data-domains')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/assets/data-domains');
                  }
                }}
                elevation={0}
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #fbc02d08 0%, #fbc02d15 100%)',
                  border: '2px solid #fbc02d',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
                  transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animationTrigger ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.4s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
                    boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
                    borderColor: '#fbc02d'
                  },
                  '&:focus': {
                    outline: '3px solid #005fcc',
                    outlineOffset: '2px'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #fbc02d 0%, #fbc02d80 100%)',
                    borderRadius: '3px 3px 0 0'
                  },
                  p: '12px 8px 8px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140
                }}
              >
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Data Domains
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '2.6rem', mb: 0.5 }}>
                  {formatNumber(dashboardMetrics?.dataDomains.total || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {formatNumber(dashboardMetrics?.dataDomains.active || 0)} active
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={0}
                onClick={() => handleCardClick('Open Tasks', () => navigate('/tasks'))}
                onFocus={() => handleCardFocus('Open Tasks', formatNumber(dashboardMetrics?.tasks.open || 0))}
                onKeyDown={(e) => handleCardKeyDown(e, () => navigate('/tasks'), 'Open Tasks')}
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #9c27b008 0%, #9c27b015 100%)',
                  border: '2px solid #9c27b0',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
                  transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animationTrigger ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.5s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
                    boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
                    borderColor: '#9c27b0'
                  },
                  '&:focus': {
                    outline: '3px solid #005fcc',
                    outlineOffset: '2px'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #9c27b0 0%, #9c27b080 100%)',
                    borderRadius: '3px 3px 0 0'
                  },
                  '&::after': cardLoadingStates['Open Tasks'] ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  } : {},
                  p: '12px 8px 8px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140
                }}
                tabIndex={0}
                role="button"
                aria-labelledby="open-tasks-label"
                aria-describedby="open-tasks-value open-tasks-description"
              >
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Open Tasks
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '2.6rem', mb: 0.5 }}>
                  {formatNumber(dashboardMetrics?.tasks.open || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {formatNumber(dashboardMetrics?.tasks.urgent || 0)} urgent
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Domain Distribution */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 300,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Data Asset Distribution by Domain
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getDomainDistributionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => 
                        percentage >= 5 ? `${percentage}%` : ''
                      }
                    >
                      {getDomainDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} assets (${getDomainDistributionData().find(d => d.name === name)?.percentage}%)`,
                        'Count'
                      ]}
                    />
                    <Legend 
                      formatter={(value, entry) => {
                        const data = getDomainDistributionData().find(d => d.name === value);
                        return (
                          <span style={{ color: entry.color }}>
                            {value} ({data?.percentage}%)
                          </span>
                        );
                      }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Asset Compliance */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 300,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Asset Compliance Status
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getComplianceStatusData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend 
                      formatter={(value, entry) => {
                        // Use a custom formatter to avoid inactiveColor being passed to DOM
                        return <span style={{ color: entry.color }}>{value}</span>;
                      }}
                    />
                    <Bar dataKey="count" name="Asset Count" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Recent Data Assets */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Recent Data Assets
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/data-catalog')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {recentAssets.length > 0 ? (
                    recentAssets.map((asset) => (
                      <React.Fragment key={asset._id}>
                        <ListItem>
                          <ListItemIcon>
                            <LibraryBooksIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={asset.name} 
                            secondary={`${asset.type} • ${asset.domain}`}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
                      No recent data assets found
                    </Typography>
                  )}
                </List>
              </Paper>
            </Grid>
            
            {/* Tasks & Notifications */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Notifications
                  </Typography>
                  <Button 
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Mark All as Read
                  </Button>
                </Box>
                <List>
                  {notificationsData.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <ListItem>
                        <ListItemIcon>
                          <NotificationsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={notification.message} 
                          secondary={notification.time}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Portfolio Management Summary */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#003366' }}>
                Portfolio Management Overview
              </Typography>
              <Button 
                variant="outlined"
                startIcon={<BusinessIcon />}
                onClick={() => navigate('/portfolio')}
                sx={{ color: '#003366', borderColor: '#003366' }}
              >
                View Full Portfolio
              </Button>
            </Box>

            {/* Portfolio Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Enterprise AI Readiness */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  onClick={() => navigate('/portfolio')}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid #2196f3',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <AIIcon sx={{ fontSize: 32, color: '#2196f3', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
                      AI Readiness
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: '#2196f3', fontWeight: 600, mb: 1 }}>
                    {Math.round(portfolioSummaryData.reduce((sum, p) => sum + p.aiReadiness, 0) / portfolioSummaryData.length)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enterprise Average
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {portfolioSummaryData.map((portfolio, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 8,
                          height: 20,
                          bgcolor: portfolio.aiReadiness > 70 ? '#4caf50' : 
                                   portfolio.aiReadiness > 60 ? '#ff9800' : '#f44336',
                          borderRadius: 1
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Total Investment */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  onClick={() => navigate('/portfolio')}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid #4caf50',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
                      Investment
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 600, mb: 1 }}>
                    ${portfolioSummaryData.reduce((sum, p) => sum + parseFloat(p.totalBudget.replace(/[$M]/g, '')), 0).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Portfolio Budget
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    4 Active Portfolios
                  </Typography>
                </Paper>
              </Grid>

              {/* Critical Risks */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  onClick={() => navigate('/portfolio')}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid #ff9800',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(255, 152, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <RiskIcon sx={{ fontSize: 32, color: '#ff9800', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
                      Critical Risks
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 600, mb: 1 }}>
                    {portfolioSummaryData.reduce((sum, p) => sum + p.criticalRisks, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across All Portfolios
                  </Typography>
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                    Requires Attention
                  </Typography>
                </Paper>
              </Grid>

              {/* AI Innovations */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  onClick={() => navigate('/portfolio')}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid #9c27b0',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(156, 39, 176, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 32, color: '#9c27b0', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
                      AI Innovations
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: '#9c27b0', fontWeight: 600, mb: 1 }}>
                    {portfolioSummaryData.reduce((sum, p) => sum + p.aiInnovations, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-First Initiatives
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    In Development
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Portfolio Health Matrix */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
                  Portfolio Health Matrix
                </Typography>
                <Button
                  size="small"
                  startIcon={<TimelineIcon />}
                  onClick={() => navigate('/portfolio')}
                  sx={{ textTransform: 'none' }}
                >
                  View Analytics
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {portfolioSummaryData.map((portfolio) => (
                  <Grid item xs={12} sm={6} md={3} key={portfolio.id}>
                    <Card 
                      variant="outlined"
                      onClick={() => navigate('/portfolio')}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {portfolio.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CircularProgress
                            variant="determinate"
                            value={portfolio.aiReadiness}
                            size={30}
                            thickness={6}
                            sx={{ 
                              color: portfolio.aiReadiness > 70 ? '#4caf50' : 
                                     portfolio.aiReadiness > 60 ? '#ff9800' : '#f44336',
                              mr: 1
                            }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {portfolio.aiReadiness}% AI Ready
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {portfolio.programs} Programs • {portfolio.totalBudget}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <RiskIcon sx={{ fontSize: 14, color: portfolio.criticalRisks > 1 ? '#ff9800' : '#4caf50' }} />
                            <Typography variant="caption">
                              {portfolio.criticalRisks} risks
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#2196f3' }} />
                            <Typography variant="caption">
                              {portfolio.aiInnovations} AI
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;

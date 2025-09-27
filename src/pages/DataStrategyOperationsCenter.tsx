import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  AutoGraph as AutoGraphIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Speed as PerformanceIcon,
  Group as TeamIcon,
  Assignment as ProjectIcon,
  Refresh as RefreshIcon,
  Download as ExportIcon,
  Dashboard as DashboardIcon,
  AccountBalance as GovernanceIcon,
  Settings as AutomationIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import dataQualityService, { DataQualityMetrics } from '../services/dataQualityService';
import projectService, { ProjectMetrics } from '../services/projectService';
import teamUtilizationService, { TeamUtilizationMetrics } from '../services/teamUtilizationService';
import complianceService, { ComplianceMetrics } from '../services/complianceService';
import automatedProcessesService from '../services/automatedProcessesService';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dsoc-tabpanel-${index}`}
      aria-labelledby={`dsoc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DataStrategyOperationsCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState<{
    dataQualityScore: number | null;
    activeProjects: number | null;
    teamUtilization: number | null;
    complianceStatus: number | null;
    automatedProcesses: number | null;
    costSavings: number | null;
  }>({
    dataQualityScore: null,
    activeProjects: null,
    teamUtilization: null,
    complianceStatus: null,
    automatedProcesses: null,
    costSavings: null
  });
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [announcementText, setAnnouncementText] = useState('');
  const [cardLoadingStates, setCardLoadingStates] = useState<{[key: string]: boolean}>({});
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    loadDashboardMetrics();
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

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch real data quality metrics from MongoDB
      let qualityData: DataQualityMetrics | null = null;
      try {
        qualityData = await dataQualityService.getOverallQualityScore();
        console.log('Data Quality Metrics loaded:', qualityData);
      } catch (error) {
        console.error('Error loading data quality metrics:', error);
      }
      
      // Fetch real project metrics from MongoDB
      let projectData: ProjectMetrics | null = null;
      try {
        console.log('Attempting to fetch project metrics...');
        projectData = await projectService.getActiveProjects();
        console.log('Project Metrics loaded successfully:', projectData);
      } catch (error) {
        console.error('Error loading project metrics:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        } else if (error && typeof error === 'object' && 'response' in error) {
          console.error('Error details:', (error as any).response?.data || 'Unknown API error');
        }
      }
      
      // Fetch real team utilization metrics from MongoDB
      let teamData: TeamUtilizationMetrics | null = null;
      try {
        console.log('Attempting to fetch team utilization metrics...');
        teamData = await teamUtilizationService.getTeamUtilizationMetrics();
        console.log('Team Utilization Metrics loaded successfully:', teamData);
      } catch (error) {
        console.error('Error loading team utilization metrics:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        } else if (error && typeof error === 'object' && 'response' in error) {
          console.error('Error details:', (error as any).response?.data || 'Unknown API error');
        }
      }
      
      // Fetch real compliance metrics from MongoDB
      let complianceData: ComplianceMetrics | null = null;
      try {
        console.log('Attempting to fetch compliance metrics...');
        complianceData = await complianceService.getComplianceMetrics();
        console.log('Compliance Metrics loaded successfully:', complianceData);
      } catch (error) {
        console.error('Error loading compliance metrics:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        } else if (error && typeof error === 'object' && 'response' in error) {
          console.error('Error details:', (error as any).response?.data || 'Unknown API error');
          console.error('Error status:', (error as any).response?.status);
          console.error('Error headers:', (error as any).response?.headers);
        }
        console.error('Full error object:', JSON.stringify(error, null, 2));
      }
      
      // Fetch real automated processes metrics from MongoDB
      let automationData: { totalProcesses: number; activeProcesses: number } | null = null;
      try {
        console.log('Attempting to fetch automated processes metrics...');
        const automationResponse = await automatedProcessesService.getProcessesCount();
        automationData = automationResponse.data;
        console.log('Automated Processes Metrics loaded successfully:', automationData);
      } catch (error) {
        console.error('Error loading automated processes metrics:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        } else if (error && typeof error === 'object' && 'response' in error) {
          console.error('Error details:', (error as any).response?.data || 'Unknown API error');
        }
      }
      
      // Calculate cost savings based on automated processes
      let calculatedCostSavings = null;
      if (automationData?.activeProcesses) {
        // Base calculation: $480K per active process (average from our analysis)
        const basePerProcess = 0.48; // $480K in millions
        calculatedCostSavings = Number((automationData.activeProcesses * basePerProcess).toFixed(1));
      }

      setDashboardMetrics({
        dataQualityScore: qualityData?.overallScore || null,
        activeProjects: projectData?.totalActiveProjects || null,
        teamUtilization: teamData?.overallUtilization || null,
        complianceStatus: complianceData?.overallComplianceScore || null,
        automatedProcesses: automationData?.activeProcesses || null,
        costSavings: calculatedCostSavings
      });
      
      setMetricsLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
      setMetricsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    loadDashboardMetrics(); // Reload actual data
  };

  const handleProjectsClick = () => {
    navigate('/admin/project-details');
  };

  const handleTeamUtilizationClick = () => {
    navigate('/admin/team-utilization-details');
  };

  const handleComplianceClick = () => {
    navigate('/admin/compliance-details');
  };

  // Access control
  if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You need admin or data steward privileges to access the Data Strategy Operations Center.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Helper functions for dashboard metrics
  const getScoreColor = (score: number | null): string => {
    if (!score) return '#999';
    if (score < 51) return '#d32f2f'; // Critical - Red
    if (score < 71) return '#f57c00'; // Poor - Orange
    if (score < 86) return '#fbc02d'; // Fair - Yellow
    if (score < 96) return '#4caf50'; // Good - Green
    return '#2e7d32'; // Excellent - Dark Green
  };

  const getScoreLabel = (score: number | null): string => {
    if (!score) return 'No Data';
    if (score < 51) return 'Critical';
    if (score < 71) return 'Poor';
    if (score < 86) return 'Fair';
    if (score < 96) return 'Good';
    return 'Excellent';
  };

  const getProjectColor = (count: number | null): string => {
    if (!count) return '#999';
    if (count < 5) return '#d32f2f'; // Critical - Too few projects
    if (count < 15) return '#f57c00'; // Low - Need more projects
    if (count < 30) return '#4caf50'; // Good - Healthy project load
    if (count < 50) return '#1976d2'; // High - Very active
    return '#9c27b0'; // Excellent - Maximum capacity
  };

  const getProjectLabel = (count: number | null): string => {
    if (!count) return 'No Data';
    if (count < 5) return 'Critical';
    if (count < 15) return 'Low';
    if (count < 30) return 'Good';
    if (count < 50) return 'High';
    return 'Maximum';
  };

  const getProjectStatus = (count: number | null): string => {
    if (!count) return 'Connect project management systems';
    if (count < 5) return 'Insufficient project pipeline';
    if (count < 15) return 'Below optimal project load';
    if (count < 30) return 'Healthy project portfolio';
    if (count < 50) return 'High project activity';
    return 'At maximum capacity';
  };

  const getUtilizationColor = (percentage: number | null): string => {
    if (!percentage) return '#999';
    if (percentage < 40) return '#d32f2f'; // Critical - Under-utilized
    if (percentage < 60) return '#f57c00'; // Low - Below target
    if (percentage < 80) return '#4caf50'; // Good - Optimal range
    if (percentage < 95) return '#1976d2'; // High - Near capacity
    return '#9c27b0'; // Critical - Over-utilized
  };

  const getUtilizationLabel = (percentage: number | null): string => {
    if (!percentage) return 'No Data';
    if (percentage < 40) return 'Under-utilized';
    if (percentage < 60) return 'Below Target';
    if (percentage < 80) return 'Optimal';
    if (percentage < 95) return 'High';
    return 'Over-utilized';
  };

  const getUtilizationStatus = (percentage: number | null): string => {
    if (!percentage) return 'Connect HR systems to view team metrics';
    if (percentage < 40) return 'Team capacity available';
    if (percentage < 60) return 'Below optimal utilization';
    if (percentage < 80) return 'Healthy team utilization';
    if (percentage < 95) return 'Near maximum capacity';
    return 'Risk of burnout - redistribute workload';
  };

  const getComplianceColor = (percentage: number | null): string => {
    if (!percentage) return '#999';
    if (percentage < 60) return '#d32f2f'; // Critical - Non-compliant
    if (percentage < 70) return '#f57c00'; // Poor - Below standards
    if (percentage < 85) return '#fbc02d'; // Fair - Needs improvement
    if (percentage < 95) return '#4caf50'; // Good - Compliant
    return '#2e7d32'; // Excellent - Fully compliant
  };

  const getComplianceLabel = (percentage: number | null): string => {
    if (!percentage) return 'No Data';
    if (percentage < 60) return 'Critical';
    if (percentage < 70) return 'Poor';
    if (percentage < 85) return 'Fair';
    if (percentage < 95) return 'Good';
    return 'Excellent';
  };

  const getComplianceStatus = (percentage: number | null): string => {
    if (!percentage) return 'Connect compliance systems';
    if (percentage < 60) return 'Immediate action required';
    if (percentage < 70) return 'Below compliance standards';
    if (percentage < 85) return 'Needs improvement';
    if (percentage < 95) return 'Meeting compliance requirements';
    return 'Exceeding compliance standards';
  };

  const renderExecutiveDashboard = () => {

    return (
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
        
        <Grid container spacing={2}>
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
        
        {/* Key Performance Indicators */}
        <Grid item xs={12}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ color: '#003366', mb: 3 }}
            id="dashboard-title"
            role="heading"
            aria-level={2}
          >
            Executive Performance Dashboard
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2 }}
            id="dashboard-description"
          >
            Navigate through dashboard cards using Tab key. Press Enter or Space to view details. Press Escape to unfocus.
          </Typography>
        </Grid>
      
      {/* Top Level Metrics */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: dashboardMetrics.dataQualityScore 
            ? `linear-gradient(135deg, ${getScoreColor(dashboardMetrics.dataQualityScore)}08 0%, ${getScoreColor(dashboardMetrics.dataQualityScore)}15 100%)`
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: dashboardMetrics.dataQualityScore ? `2px solid ${getScoreColor(dashboardMetrics.dataQualityScore)}` : '2px solid #e0e0e0',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
          transform: animationTrigger ? 'translateY(0)' : 'translateY(20px)',
          opacity: animationTrigger ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: '0.1s',
          '&:hover': {
            transform: animationTrigger ? 'translateY(-4px) scale(1.02)' : 'translateY(20px)',
            boxShadow: '0 12px 32px rgba(0, 51, 102, 0.18)',
            borderColor: dashboardMetrics.dataQualityScore ? getScoreColor(dashboardMetrics.dataQualityScore) : '#003366',
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
            background: dashboardMetrics.dataQualityScore 
              ? `linear-gradient(90deg, ${getScoreColor(dashboardMetrics.dataQualityScore)} 0%, ${getScoreColor(dashboardMetrics.dataQualityScore)}80 100%)`
              : 'linear-gradient(90deg, #e0e0e0 0%, #e0e0e0 100%)',
            borderRadius: '3px 3px 0 0',
            transition: 'height 0.3s ease'
          },
          '&::after': cardLoadingStates['Data Quality Score'] ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer 1.5s infinite'
          } : {}
        }}
        tabIndex={0}
        role="button"
        aria-labelledby="data-quality-label"
        aria-describedby="data-quality-value data-quality-status"
        onFocus={() => handleCardFocus('Data Quality Score', dashboardMetrics.dataQualityScore ? `${dashboardMetrics.dataQualityScore}%` : null)}
        onKeyDown={(e) => handleCardKeyDown(e, () => {}, 'Data Quality Score')}>
          <CardContent sx={{ p: '12px 8px 8px !important', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 0.5,
              position: 'relative'
            }}>
              <PerformanceIcon sx={{ 
                fontSize: 24, 
                color: getScoreColor(dashboardMetrics.dataQualityScore) || '#666',
                mr: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#003366',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
                id="data-quality-label"
              >
                Data Quality Score
              </Typography>
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                color: getScoreColor(dashboardMetrics.dataQualityScore) || '#666', 
                fontWeight: 700,
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: dashboardMetrics.dataQualityScore 
                  ? `linear-gradient(135deg, ${getScoreColor(dashboardMetrics.dataQualityScore)} 0%, ${getScoreColor(dashboardMetrics.dataQualityScore)}CC 100%)`
                  : 'linear-gradient(135deg, #666 0%, #999 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              id="data-quality-value"
              aria-label={dashboardMetrics.dataQualityScore ? `${dashboardMetrics.dataQualityScore} percent` : 'No data available'}
            >
              {dashboardMetrics.dataQualityScore ? `${dashboardMetrics.dataQualityScore}%` : 'No Data'}
            </Typography>
            {dashboardMetrics.dataQualityScore && (
              <Chip 
                label={getScoreLabel(dashboardMetrics.dataQualityScore)}
                size="small"
                sx={{ 
                  backgroundColor: `${getScoreColor(dashboardMetrics.dataQualityScore)}20`,
                  color: getScoreColor(dashboardMetrics.dataQualityScore),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
                id="data-quality-status"
                aria-label={`Quality status: ${getScoreLabel(dashboardMetrics.dataQualityScore)}`}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: dashboardMetrics.activeProjects 
            ? `linear-gradient(135deg, ${getProjectColor(dashboardMetrics.activeProjects)}08 0%, ${getProjectColor(dashboardMetrics.activeProjects)}15 100%)`
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: dashboardMetrics.activeProjects ? `2px solid ${getProjectColor(dashboardMetrics.activeProjects)}` : '2px solid #e0e0e0',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 51, 102, 0.15)',
            borderColor: dashboardMetrics.activeProjects ? getProjectColor(dashboardMetrics.activeProjects) : '#003366'
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
            background: dashboardMetrics.activeProjects 
              ? `linear-gradient(90deg, ${getProjectColor(dashboardMetrics.activeProjects)} 0%, ${getProjectColor(dashboardMetrics.activeProjects)}80 100%)`
              : 'linear-gradient(90deg, #e0e0e0 0%, #e0e0e0 100%)',
            borderRadius: '3px 3px 0 0'
          }
        }}
        onClick={() => handleCardClick('Active Projects', handleProjectsClick)}
        role="button"
        tabIndex={0}
        aria-labelledby="active-projects-label"
        aria-describedby="active-projects-value active-projects-status"
        onFocus={() => handleCardFocus('Active Projects', dashboardMetrics.activeProjects)}
        onKeyDown={(e) => handleCardKeyDown(e, handleProjectsClick, 'Active Projects')}
        >
          <CardContent sx={{ p: '12px 8px 8px !important', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 0.5,
              position: 'relative'
            }}>
              <ProjectIcon sx={{ 
                fontSize: 24, 
                color: getProjectColor(dashboardMetrics.activeProjects) || '#666',
                mr: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#003366',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
                id="active-projects-label"
              >
                Active Projects
              </Typography>
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                color: getProjectColor(dashboardMetrics.activeProjects) || '#666', 
                fontWeight: 700,
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: dashboardMetrics.activeProjects 
                  ? `linear-gradient(135deg, ${getProjectColor(dashboardMetrics.activeProjects)} 0%, ${getProjectColor(dashboardMetrics.activeProjects)}CC 100%)`
                  : 'linear-gradient(135deg, #666 0%, #999 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              id="active-projects-value"
              aria-label={dashboardMetrics.activeProjects ? `${dashboardMetrics.activeProjects} active projects` : 'No data available'}
            >
              {dashboardMetrics.activeProjects || 'No Data'}
            </Typography>
            {dashboardMetrics.activeProjects && (
              <Chip 
                label={getProjectLabel(dashboardMetrics.activeProjects)}
                size="small"
                sx={{ 
                  backgroundColor: `${getProjectColor(dashboardMetrics.activeProjects)}20`,
                  color: getProjectColor(dashboardMetrics.activeProjects),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
                id="active-projects-status"
                aria-label={`Project status: ${getProjectLabel(dashboardMetrics.activeProjects)}`}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: dashboardMetrics.teamUtilization 
            ? `linear-gradient(135deg, ${getUtilizationColor(dashboardMetrics.teamUtilization)}08 0%, ${getUtilizationColor(dashboardMetrics.teamUtilization)}15 100%)`
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: dashboardMetrics.teamUtilization ? `2px solid ${getUtilizationColor(dashboardMetrics.teamUtilization)}` : '2px solid #e0e0e0',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 51, 102, 0.15)',
            borderColor: dashboardMetrics.teamUtilization ? getUtilizationColor(dashboardMetrics.teamUtilization) : '#003366'
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
            background: dashboardMetrics.teamUtilization 
              ? `linear-gradient(90deg, ${getUtilizationColor(dashboardMetrics.teamUtilization)} 0%, ${getUtilizationColor(dashboardMetrics.teamUtilization)}80 100%)`
              : 'linear-gradient(90deg, #e0e0e0 0%, #e0e0e0 100%)',
            borderRadius: '3px 3px 0 0'
          }
        }}
        onClick={handleTeamUtilizationClick}
        role="button"
        tabIndex={0}
        aria-label="View detailed team utilization breakdown"
        >
          <CardContent sx={{ p: '12px 8px 8px !important', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 0.5,
              position: 'relative'
            }}>
              <TeamIcon sx={{ 
                fontSize: 24, 
                color: getUtilizationColor(dashboardMetrics.teamUtilization) || '#666',
                mr: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography variant="subtitle2" sx={{ 
                color: '#003366',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              }}>
                Team Utilization
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ 
              color: getUtilizationColor(dashboardMetrics.teamUtilization) || '#666', 
              fontWeight: 700,
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: dashboardMetrics.teamUtilization 
                ? `linear-gradient(135deg, ${getUtilizationColor(dashboardMetrics.teamUtilization)} 0%, ${getUtilizationColor(dashboardMetrics.teamUtilization)}CC 100%)`
                : 'linear-gradient(135deg, #666 0%, #999 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {dashboardMetrics.teamUtilization ? `${dashboardMetrics.teamUtilization}%` : 'No Data'}
            </Typography>
            {dashboardMetrics.teamUtilization && (
              <Chip 
                label={getUtilizationLabel(dashboardMetrics.teamUtilization)}
                size="small"
                sx={{ 
                  backgroundColor: `${getUtilizationColor(dashboardMetrics.teamUtilization)}20`,
                  color: getUtilizationColor(dashboardMetrics.teamUtilization),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: dashboardMetrics.complianceStatus !== null 
            ? `linear-gradient(135deg, ${getComplianceColor(dashboardMetrics.complianceStatus)}08 0%, ${getComplianceColor(dashboardMetrics.complianceStatus)}15 100%)`
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: dashboardMetrics.complianceStatus !== null ? `2px solid ${getComplianceColor(dashboardMetrics.complianceStatus)}` : '2px solid #e0e0e0',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 51, 102, 0.15)',
            borderColor: dashboardMetrics.complianceStatus !== null ? getComplianceColor(dashboardMetrics.complianceStatus) : '#003366'
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
            background: dashboardMetrics.complianceStatus !== null 
              ? `linear-gradient(90deg, ${getComplianceColor(dashboardMetrics.complianceStatus)} 0%, ${getComplianceColor(dashboardMetrics.complianceStatus)}80 100%)`
              : 'linear-gradient(90deg, #e0e0e0 0%, #e0e0e0 100%)',
            borderRadius: '3px 3px 0 0'
          }
        }}
        onClick={handleComplianceClick}
        role="button"
        tabIndex={0}
        aria-label="View detailed compliance breakdown"
        >
          <CardContent sx={{ p: '12px 8px 8px !important', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 0.5,
              position: 'relative'
            }}>
              <SecurityIcon sx={{ 
                fontSize: 24, 
                color: getComplianceColor(dashboardMetrics.complianceStatus) || '#666',
                mr: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography variant="subtitle2" sx={{ 
                color: '#003366',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              }}>
                Compliance Status
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ 
              color: getComplianceColor(dashboardMetrics.complianceStatus) || '#666', 
              fontWeight: 700,
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: dashboardMetrics.complianceStatus !== null 
                ? `linear-gradient(135deg, ${getComplianceColor(dashboardMetrics.complianceStatus)} 0%, ${getComplianceColor(dashboardMetrics.complianceStatus)}CC 100%)`
                : 'linear-gradient(135deg, #666 0%, #999 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {dashboardMetrics.complianceStatus !== null ? `${dashboardMetrics.complianceStatus}%` : 'No Data'}
            </Typography>
            {dashboardMetrics.complianceStatus !== null && (
              <Chip 
                label={getComplianceLabel(dashboardMetrics.complianceStatus)}
                size="small"
                sx={{ 
                  backgroundColor: `${getComplianceColor(dashboardMetrics.complianceStatus)}20`,
                  color: getComplianceColor(dashboardMetrics.complianceStatus),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: dashboardMetrics.automatedProcesses 
            ? 'linear-gradient(135deg, #9c27b008 0%, #9c27b015 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: dashboardMetrics.automatedProcesses ? '2px solid #9c27b0' : '2px solid #e0e0e0',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 51, 102, 0.15)',
            borderColor: dashboardMetrics.automatedProcesses ? '#9c27b0' : '#003366'
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
            background: dashboardMetrics.automatedProcesses 
              ? 'linear-gradient(90deg, #9c27b0 0%, #9c27b080 100%)'
              : 'linear-gradient(90deg, #e0e0e0 0%, #e0e0e0 100%)',
            borderRadius: '3px 3px 0 0'
          }
        }}
        onClick={() => navigate('/admin/automated-processes?tab=dashboard')}
        role="button"
        tabIndex={0}
        aria-label="View automated processes dashboard"
        >
          <CardContent sx={{ p: '12px 8px 8px !important', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 0.5,
              position: 'relative'
            }}>
              <AutomationIcon sx={{ 
                fontSize: 24, 
                color: dashboardMetrics.automatedProcesses ? '#9c27b0' : '#666',
                mr: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography variant="subtitle2" sx={{ 
                color: '#003366',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              }}>
                Automated Processes
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ 
              color: dashboardMetrics.automatedProcesses ? '#9c27b0' : '#666', 
              fontWeight: 700,
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: dashboardMetrics.automatedProcesses 
                ? 'linear-gradient(135deg, #9c27b0 0%, #9c27b0CC 100%)'
                : 'linear-gradient(135deg, #666 0%, #999 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {dashboardMetrics.automatedProcesses || 'No Data'}
            </Typography>
            {dashboardMetrics.automatedProcesses && (
              <Chip 
                label="+12% this quarter"
                size="small"
                sx={{ 
                  backgroundColor: '#9c27b020',
                  color: '#9c27b0',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
            Recent Strategic Activities
          </Typography>
          <Box sx={{ mt: 2 }}>
            {metricsLoaded ? (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>No Recent Activities:</strong> Connect data sources and workflow systems to view real-time strategic activities and alerts.
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
        </Grid>
      </>
    );
  };

  const renderDataGovernance = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#003366' }}>
        Data Governance & Compliance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive data governance framework with quality standards, thresholds, and compliance tracking
      </Typography>
      
      {/* Quality Standards & Thresholds */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
          Data Quality Standards & Thresholds
        </Typography>
        
        {/* Government Requirements */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Government Compliance Requirements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" color="text.secondary">FISMA Compliance</Typography>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>75%</Typography>
                <Typography variant="caption">Minimum Required</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
                <Typography variant="body2" color="text.secondary">Section 508</Typography>
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>90%</Typography>
                <Typography variant="caption">Public Data</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" color="text.secondary">Data Stewardship</Typography>
                <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>80%</Typography>
                <Typography variant="caption">Mission Critical</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, backgroundColor: '#ffebee' }}>
                <Typography variant="body2" color="text.secondary">PII/Sensitive</Typography>
                <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>95%</Typography>
                <Typography variant="caption">Privacy Required</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Quality Score Ranges */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quality Score Classification
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#d32f2f', borderRadius: 1, mr: 2 }} />
                <Typography variant="body2"><strong>Critical (0-50%):</strong> Immediate action required</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#f57c00', borderRadius: 1, mr: 2 }} />
                <Typography variant="body2"><strong>Poor (51-70%):</strong> Improvement needed</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#fbc02d', borderRadius: 1, mr: 2 }} />
                <Typography variant="body2"><strong>Fair (71-85%):</strong> Acceptable with monitoring</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: 1, mr: 2 }} />
                <Typography variant="body2"><strong>Good (86-95%):</strong> Industry standard</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#2e7d32', borderRadius: 1, mr: 2 }} />
                <Typography variant="body2"><strong>Excellent (96-100%):</strong> Best in class</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Current Performance Assessment */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Current Performance Assessment
          </Typography>
          <Card sx={{ p: 3, border: `2px solid ${getScoreColor(dashboardMetrics.dataQualityScore)}` }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ 
                    color: getScoreColor(dashboardMetrics.dataQualityScore), 
                    fontWeight: 'bold' 
                  }}>
                    {dashboardMetrics.dataQualityScore || 'N/A'}
                    {dashboardMetrics.dataQualityScore && '%'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: getScoreColor(dashboardMetrics.dataQualityScore),
                    fontWeight: 'bold'
                  }}>
                    {getScoreLabel(dashboardMetrics.dataQualityScore)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Current Status Analysis</Typography>
                {dashboardMetrics.dataQualityScore ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Your current score of <strong>{dashboardMetrics.dataQualityScore}%</strong> indicates{' '}
                      {dashboardMetrics.dataQualityScore < 51 && 'critical data quality issues requiring immediate attention.'}
                      {dashboardMetrics.dataQualityScore >= 51 && dashboardMetrics.dataQualityScore < 71 && 'significant room for improvement in data governance practices.'}
                      {dashboardMetrics.dataQualityScore >= 71 && dashboardMetrics.dataQualityScore < 86 && 'acceptable quality with opportunities for enhancement.'}
                      {dashboardMetrics.dataQualityScore >= 86 && dashboardMetrics.dataQualityScore < 96 && 'good data quality meeting industry standards.'}
                      {dashboardMetrics.dataQualityScore >= 96 && 'excellent data quality representing best-in-class governance.'}
                    </Typography>
                    
                    {/* Gap Analysis */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Gap to FISMA Compliance (75%):</strong>{' '}
                        {dashboardMetrics.dataQualityScore >= 75 ? (
                          <span style={{ color: '#4caf50' }}>✓ Compliant</span>
                        ) : (
                          <span style={{ color: '#d32f2f' }}>
                            {75 - dashboardMetrics.dataQualityScore} points needed
                          </span>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Gap to Industry Standard (86%):</strong>{' '}
                        {dashboardMetrics.dataQualityScore >= 86 ? (
                          <span style={{ color: '#4caf50' }}>✓ Achieved</span>
                        ) : (
                          <span style={{ color: '#f57c00' }}>
                            {86 - dashboardMetrics.dataQualityScore} points needed
                          </span>
                        )}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Connect to data sources to view performance assessment
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Paper>

      {/* Improvement Roadmap */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
          Improvement Roadmap
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, height: '100%', backgroundColor: '#ffebee' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                Phase 1: Foundation
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Target: 60% in 3 months</Typography>
              <Typography variant="body2" component="div">
                • Assign data owners to critical assets<br/>
                • Add descriptions to top 1,000 assets<br/>
                • Standardize data classifications
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, height: '100%', backgroundColor: '#fff3e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                Phase 2: Governance
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Target: 75% in 6 months</Typography>
              <Typography variant="body2" component="div">
                • Implement data steward program<br/>
                • Establish metadata standards<br/>
                • Create freshness monitoring
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, height: '100%', backgroundColor: '#e8f5e9' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 1 }}>
                Phase 3: Excellence
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Target: 85% in 12 months</Typography>
              <Typography variant="body2" component="div">
                • Automated quality checks<br/>
                • Continuous monitoring<br/>
                • Data literacy training
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Domain Health & Compliance Monitoring */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>Data Domain Health</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Quality metrics across all USCIS data domains
            </Typography>
            {metricsLoaded ? (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Domain Analysis:</strong> Connect domain-specific data sources to view detailed health metrics by Customer, Finance, Operations, and HR domains.
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>Compliance Monitoring</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real-time compliance status tracking
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2">FISMA Compliance</Typography>
                <Chip 
                  label={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 75 ? "Compliant" : "Non-Compliant"} 
                  color={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 75 ? "success" : "error"}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2">Section 508</Typography>
                <Chip 
                  label={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 90 ? "Compliant" : "Needs Review"} 
                  color={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 90 ? "success" : "warning"}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2">Data Stewardship</Typography>
                <Chip 
                  label={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 80 ? "Adequate" : "Insufficient"} 
                  color={dashboardMetrics.dataQualityScore && dashboardMetrics.dataQualityScore >= 80 ? "success" : "error"}
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderWorkflowAutomation = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#003366' }}>
        Workflow Automation Engine
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Intelligent process orchestration and task routing with SLA monitoring
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AutomationIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Workflows
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                847
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks Routed Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PerformanceIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                94.2%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SLA Compliance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                2.3m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Access Full Workflow Engine */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => navigate('/admin/automated-processes?tab=workflow')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 1 }}>
                    🚀 Access Full Workflow Automation Engine
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete workflow designer, task routing intelligence, SLA monitoring, and performance analytics
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#003366' }}
                  endIcon={<TrendingUpIcon />}
                >
                  Open Workflow Engine
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Features Preview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                Intelligent Task Routing
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Priority-Based Routing"
                    secondary="96% routing accuracy"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Workload Balancing"
                    secondary="89% load distribution efficiency"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Skill-Based Assignment"
                    secondary="92% response time optimization"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                SLA Performance
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Application Processing"
                    secondary="SLA: 2 hours | Avg: 1.8h"
                  />
                  <Chip label="98%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Document Review"
                    secondary="SLA: 24 hours | Avg: 18h"
                  />
                  <Chip label="95%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Quality Assurance"
                    secondary="SLA: 4 hours | Avg: 4.2h"
                  />
                  <Chip label="87%" size="small" sx={{ bgcolor: '#fff3e0', color: '#f57c00' }} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Final Approval"
                    secondary="SLA: 1 hour | Avg: 45m"
                  />
                  <Chip label="99%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#003366' }}>
        Advanced Analytics & Intelligence
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        ML-powered insights, predictive analytics, and performance optimization
      </Typography>
      
      <Grid container spacing={3}>
        {/* AI Insights Overview */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PsychologyIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                87
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI Insights Generated
              </Typography>
              <Typography variant="caption" sx={{ color: '#9c27b0' }}>
                +23 this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                94.3%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prediction Accuracy
              </Typography>
              <Typography variant="caption" sx={{ color: '#4caf50' }}>
                Model confidence
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                156
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data Models Active
              </Typography>
              <Typography variant="caption" sx={{ color: '#2196f3' }}>
                Real-time processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PerformanceIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                32%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance Gain
              </Typography>
              <Typography variant="caption" sx={{ color: '#ff9800' }}>
                vs baseline
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive Analytics Dashboard */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                Predictive Analytics Dashboard
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      📈 Application Volume Forecast
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                      +18.5%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expected increase next quarter
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ 
                        mt: 1,
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { backgroundColor: '#2196f3' }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      85% confidence level
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ⚡ Processing Time Optimization
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                      -24%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Predicted time reduction
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      sx={{ 
                        mt: 1,
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      92% confidence level
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      🎯 Quality Score Prediction
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                      96.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Projected quality score
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={97} 
                      sx={{ 
                        mt: 1,
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { backgroundColor: '#9c27b0' }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      97% confidence level
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      🚨 Risk Assessment
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      Low
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall system risk level
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={25} 
                      sx={{ 
                        mt: 1,
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      25% risk probability
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ML Model Performance */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                ML Model Performance
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Document Classification"
                    secondary="Accuracy: 97.2%"
                  />
                  <Chip label="Active" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fraud Detection"
                    secondary="Precision: 94.8%"
                  />
                  <Chip label="Active" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Priority Scoring"
                    secondary="F1-Score: 91.5%"
                  />
                  <Chip label="Active" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2196f3' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sentiment Analysis"
                    secondary="Training: 89.3%"
                  />
                  <Chip label="Training" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI-Powered Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                🤖 AI-Powered Insights
              </Typography>
              <List dense>
                <ListItem sx={{ backgroundColor: '#e8f5e8', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary="High Priority Alert"
                    secondary="Document processing backlog detected. Recommend increasing reviewer capacity by 15%."
                  />
                  <Chip label="Action Required" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                </ListItem>
                <ListItem sx={{ backgroundColor: '#e3f2fd', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary="Optimization Opportunity"
                    secondary="Workflow automation could reduce processing time by 23% for Form I-485 applications."
                  />
                  <Chip label="Optimize" size="small" sx={{ bgcolor: '#2196f3', color: 'white' }} />
                </ListItem>
                <ListItem sx={{ backgroundColor: '#fff3e0', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary="Performance Trend"
                    secondary="Quality scores trending upward (+3.2%) due to enhanced training programs."
                  />
                  <Chip label="Positive" size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} />
                </ListItem>
                <ListItem sx={{ backgroundColor: '#f3e5f5', borderRadius: 1 }}>
                  <ListItemText
                    primary="Resource Planning"
                    secondary="Peak application period predicted for Q2. Consider staffing adjustments."
                  />
                  <Chip label="Plan Ahead" size="small" sx={{ bgcolor: '#9c27b0', color: 'white' }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Optimization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                ⚡ Performance Optimization
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    System Performance Metrics
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    CPU Utilization
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    68% - Optimal
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={45} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': { backgroundColor: '#2196f3' }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    45% - Excellent
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Database Performance
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={89} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    89% - Good
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    API Response Time
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={92} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': { backgroundColor: '#9c27b0' }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    92% - Very Good
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Features */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                🚀 Advanced Analytics Features
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                    <PsychologyIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Natural Language Processing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Automated document analysis, sentiment detection, and content classification
                    </Typography>
                    <Button variant="outlined" sx={{ borderColor: '#9c27b0', color: '#9c27b0' }}>
                      View NLP Models
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                    <AnalyticsIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Predictive Modeling
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Forecast application volumes, processing times, and resource requirements
                    </Typography>
                    <Button variant="outlined" sx={{ borderColor: '#2196f3', color: '#2196f3' }}>
                      View Predictions
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                    <PerformanceIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Real-time Optimization
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Dynamic resource allocation and automated performance tuning
                    </Typography>
                    <Button variant="outlined" sx={{ borderColor: '#4caf50', color: '#4caf50' }}>
                      View Optimizations
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Future Enhancements */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: '#e8f5e8',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}
          >
            <Typography variant="h6" gutterBottom>
              🎯 Next-Generation Analytics (Q2 2024)
            </Typography>
            <Typography variant="body2">
              Upcoming advanced analytics capabilities include:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Deep learning models for complex pattern recognition</li>
              <li>Automated anomaly detection and root cause analysis</li>
              <li>Advanced visualization with interactive dashboards</li>
              <li>Integration with external data sources and APIs</li>
              <li>Custom model training and deployment pipeline</li>
              <li>Real-time streaming analytics and alerts</li>
            </Box>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 600, mb: 1 }}>
            <DashboardIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Data Strategy Operations Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            USCIS OCDO/OPQ Comprehensive Data Strategy Platform
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            size="small"
            sx={{ color: '#003366', borderColor: '#003366' }}
          >
            Export Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
            sx={{ color: '#003366', borderColor: '#003366' }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Last Updated */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
        Last updated: {lastRefresh.toLocaleString()}
      </Typography>

      {/* Navigation Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        aria-label="Data Strategy Operations Center tabs"
      >
        <Tab 
          icon={<DashboardIcon />} 
          label="Executive Dashboard" 
        />
        <Tab 
          icon={<SecurityIcon />} 
          label="Data Governance" 
        />
        <Tab 
          icon={<AutomationIcon />} 
          label="Workflow Automation" 
        />
        <Tab 
          icon={<AnalyticsIcon />} 
          label="Advanced Analytics" 
        />
      </Tabs>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {renderExecutiveDashboard()}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {renderDataGovernance()}
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        {renderWorkflowAutomation()}
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        {renderAnalytics()}
      </TabPanel>
    </Container>
  );
};

export default DataStrategyOperationsCenter;

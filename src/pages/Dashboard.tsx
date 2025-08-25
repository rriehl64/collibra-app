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
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataAssetService } from '../services/api';
import DashboardService from '../services/dashboardService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
  }, []);

  // Chart configuration
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
          {/* Quick Access Links */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                role="button"
                tabIndex={0}
                aria-label="Open Data Strategy Support Services"
                onClick={() => navigate('/data-strategy-support')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/data-strategy-support');
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  outline: 'none',
                  '&:focus': { outline: '3px solid #003366', outlineOffset: 2 },
                }}
              >
                <CardHeader
                  avatar={<MenuBookIcon color="primary" />}
                  title={<Typography component="h2" variant="h6">Data Strategy Support</Typography>}
                  subheader={<Typography variant="body2" color="text.secondary">Plan, govern, and execute your data strategy</Typography>}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Access the Data Strategy Plan, Capstone Project, and curated resources to drive agency-wide data outcomes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                role="button"
                tabIndex={0}
                aria-label="Open Project Charter form"
                onClick={() => navigate('/project-charter')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/project-charter');
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  outline: 'none',
                  '&:focus': { outline: '3px solid #003366', outlineOffset: 2 },
                }}
              >
                <CardHeader
                  avatar={<AssignmentIcon color="primary" />}
                  title={<Typography component="h2" variant="h6">Project Charter</Typography>}
                  subheader={<Typography variant="body2" color="text.secondary">Create and manage your USCIS-styled charters</Typography>}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Click to open the editable module form capturing problem statement, KPIs, scope, RACI, risks, and more.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#E3F2FD',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Data Assets
                </Typography>
                <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  {dashboardMetrics?.dataAssets.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +{dashboardMetrics?.dataAssets.newThisMonth || 0} this month
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#E8F5E9',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Data Domains
                </Typography>
                <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  {dashboardMetrics?.dataDomains.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardMetrics?.dataDomains.active || 0} active
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#FFF8E1',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Compliance
                </Typography>
                <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  {dashboardMetrics?.compliance.percentage || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardMetrics && dashboardMetrics.compliance.changeFromLastMonth > 0 ? '+' : ''}
                  {dashboardMetrics?.compliance.changeFromLastMonth || 0}% from last month
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  backgroundColor: '#F3E5F5',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Open Tasks
                </Typography>
                <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  {dashboardMetrics?.tasks.open || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardMetrics?.tasks.urgent || 0} urgent
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {getDomainDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      formatter={(value, entry) => {
                        // Use a custom formatter to avoid inactiveColor being passed to DOM
                        return <span style={{ color: entry.color }}>{value}</span>;
                      }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
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
        </>
      )}
    </Container>
  );
};

export default Dashboard;

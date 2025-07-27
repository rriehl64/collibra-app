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
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Notifications as NotificationsIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataAssetService } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentAssets, setRecentAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const assets = await dataAssetService.getRecentDataAssets(5);
        setRecentAssets(assets); // Already limited to 5 items in the service
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample data for charts
  const domainDistributionData = [
    { name: 'Finance', value: 8 },
    { name: 'Sales', value: 6 },
    { name: 'HR', value: 4 },
    { name: 'IT', value: 12 },
    { name: 'Marketing', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const assetComplianceData = [
    { name: 'Compliant', count: 18 },
    { name: 'Needs Review', count: 7 },
    { name: 'Non-Compliant', count: 3 }
  ];

  const notificationsData = [
    { id: 1, message: 'New data asset "Customer Analytics Dashboard" was added', time: '2 hours ago' },
    { id: 2, message: 'Policy update for GDPR compliance standards', time: 'Yesterday' },
    { id: 3, message: 'Data quality review pending for Finance Database', time: '3 days ago' }
  ];

  const tasks = [
    { id: 1, task: 'Review new data assets', status: 'pending' },
    { id: 2, task: 'Update data governance policy', status: 'completed' },
    { id: 3, task: 'Approve access requests (3)', status: 'urgent' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Dashboard
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your data governance ecosystem
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  28
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +3 this month
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
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All active
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
                  84%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +2% from last month
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
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3 urgent
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
                      data={domainDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {domainDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
                    data={assetComplianceData}
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
                    <Legend />
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

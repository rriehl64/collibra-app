/**
 * Automated Processes Page
 * 
 * Comprehensive workflow automation and process orchestration interface
 * with Section 508 compliance and USCIS theme integration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardActions,
  TextField, InputAdornment, IconButton, Chip, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Tabs, Tab, Paper, Divider, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, Tooltip,
  LinearProgress, List, ListItem, ListItemText, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  AccountTree as WorkflowIcon,
  Timeline as TimelineIcon,
  Speed as SlaIcon,
  Route as RouteIcon
} from '@mui/icons-material';

import automatedProcessesService, { 
  AutomatedProcess, 
  DashboardAnalytics,
  ExecutionRecord 
} from '../services/automatedProcessesService';
import { useSnackbar } from '../contexts/SnackbarContext';
import ScheduledProcesses from '../components/ScheduledProcesses';
import ProcessMonitoring from '../components/ProcessMonitoring';

// Tab panel component for accessibility
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
      id={`automated-processes-tabpanel-${index}`}
      aria-labelledby={`automated-processes-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AutomatedProcesses: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [showBackButton, setShowBackButton] = useState(false);
  const [processes, setProcesses] = useState<AutomatedProcess[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<AutomatedProcess | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([]);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);

  const { showSnackbar } = useSnackbar();

  // Fetch processes data
  const fetchProcesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        search: searchText || undefined,
        category: filterCategory || undefined,
        status: filterStatus || undefined,
        limit: 50
      };
      
      const response = await automatedProcessesService.getProcesses(params);
      setProcesses(response.data);
    } catch (err: any) {
      console.error('Error fetching processes:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in as an admin or data steward to access automated processes.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You need admin or data steward permissions to view automated processes.');
      } else {
        setError('Failed to load automated processes. Please ensure you are logged in and try again.');
      }
      
      // Set empty array but don't show fallback data for security reasons
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, filterCategory, filterStatus]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await automatedProcessesService.getDashboardAnalytics('30d');
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      // Don't set error for analytics - just log it
      // The main error will be shown from fetchProcesses
    }
  }, []);

  // Execute process
  const handleExecuteProcess = async (process: AutomatedProcess) => {
    try {
      const response = await automatedProcessesService.executeProcess(process._id);
      showSnackbar(`Process "${process.name}" execution started`, 'success');
      
      // Refresh processes to show updated execution status
      setTimeout(() => {
        fetchProcesses();
      }, 1000);
    } catch (error) {
      showSnackbar(`Failed to execute process "${process.name}"`, 'error');
    }
  };

  // Toggle process status
  const handleToggleStatus = async (process: AutomatedProcess) => {
    try {
      const response = await automatedProcessesService.toggleProcessStatus(process._id);
      showSnackbar(response.message, 'success');
      fetchProcesses();
    } catch (error) {
      showSnackbar(`Failed to toggle process status`, 'error');
    }
  };

  // View execution history
  const handleViewHistory = async (process: AutomatedProcess) => {
    try {
      setSelectedProcess(process);
      const response = await automatedProcessesService.getExecutionHistory(process._id);
      setExecutionHistory(response.data);
      setShowExecutionDialog(true);
    } catch (error) {
      showSnackbar('Failed to load execution history', 'error');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProcesses();
    fetchAnalytics();
  }, [fetchProcesses, fetchAnalytics]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    // Show back button if we have a tab parameter (indicates navigation from DSOC)
    if (tabParam) {
      setShowBackButton(true);
    }
    
    if (tabParam === 'workflow') {
      setActiveTab(4); // Workflow Engine tab is at index 4
    } else if (tabParam === 'monitoring') {
      setActiveTab(3); // Monitoring tab is at index 3
    } else if (tabParam === 'scheduling') {
      setActiveTab(2); // Scheduling tab is at index 2
    } else if (tabParam === 'management') {
      setActiveTab(1); // Process Management tab is at index 1
    } else if (tabParam === 'dashboard') {
      setActiveTab(0); // Dashboard tab is at index 0
    }
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'Error':
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      case 'Paused':
        return <WarningIcon sx={{ color: '#FF9800' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196F3' }} />;
    }
  };

  return (
    <Container sx={{ py: 4 }} className="automated-processes-page">
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {showBackButton && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/data-strategy-operations-center')}
            sx={{ mr: 2 }}
            aria-label="Back to Data Strategy Operations Center"
          >
            Back
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ color: '#003366', fontWeight: 'bold' }}
          >
            Automated Processes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage workflow automation, process orchestration, and intelligent automation capabilities
          </Typography>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Automated processes navigation"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard" 
            id="automated-processes-tab-0"
            aria-controls="automated-processes-tabpanel-0"
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="Process Management" 
            id="automated-processes-tab-1"
            aria-controls="automated-processes-tabpanel-1"
          />
          <Tab 
            icon={<ScheduleIcon />} 
            label="Scheduling" 
            id="automated-processes-tab-2"
            aria-controls="automated-processes-tabpanel-2"
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label="Monitoring" 
            id="automated-processes-tab-3"
            aria-controls="automated-processes-tabpanel-3"
          />
          <Tab 
            icon={<WorkflowIcon />} 
            label="Workflow Engine" 
            id="automated-processes-tab-4"
            aria-controls="automated-processes-tabpanel-4"
          />
        </Tabs>
      </Paper>

      {/* Dashboard Tab */}
      <TabPanel value={activeTab} index={0}>
        {analytics && (
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Processes
                  </Typography>
                  <Typography variant="h4" component="div">
                    {analytics.summary.totalProcesses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.summary.activeProcesses} active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#4CAF50' }}>
                    {analytics.summary.successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.summary.totalSuccessful} successful
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Scheduled Processes
                  </Typography>
                  <Typography variant="h4" component="div">
                    {analytics.summary.scheduledProcesses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automated execution
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Execution Time
                  </Typography>
                  <Typography variant="h4" component="div">
                    {automatedProcessesService.formatDuration(analytics.summary.avgExecutionTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance metric
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Process Management Tab */}
      <TabPanel value={activeTab} index={1}>
        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search processes..."
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
                      <IconButton onClick={() => setSearchText('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Data Quality">Data Quality</MenuItem>
                  <MenuItem value="Data Governance">Data Governance</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Reporting">Reporting</MenuItem>
                  <MenuItem value="ETL/Integration">ETL/Integration</MenuItem>
                  <MenuItem value="Monitoring">Monitoring</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                  <MenuItem value="Error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ height: 56 }}
              >
                New Process
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* No Processes Message */}
        {!loading && !error && processes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Automated Processes Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchText || filterCategory || filterStatus 
                ? 'Try adjusting your search criteria or filters.'
                : 'No automated processes have been created yet. Click "New Process" to get started.'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Create First Process
            </Button>
          </Box>
        )}

        {/* Processes Grid */}
        {!loading && !error && processes.length > 0 && (
          <Grid container spacing={3}>
            {processes.map((process) => (
              <Grid item xs={12} md={6} lg={4} key={process._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: 3 }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getStatusIcon(process.status)}
                      <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {process.name}
                      </Typography>
                      <Chip 
                        label={process.status}
                        size="small"
                        sx={{
                          backgroundColor: automatedProcessesService.getStatusColor(process.status),
                          color: 'white'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {process.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={process.category}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={process.processType}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="caption" display="block">
                      Success Rate: {process.successRate}%
                    </Typography>
                    <Typography variant="caption" display="block">
                      Last Execution: {process.lastExecutionStatus}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Tooltip title="Execute Process">
                      <IconButton 
                        size="small"
                        onClick={() => handleExecuteProcess(process)}
                        disabled={process.status !== 'Active'}
                      >
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Toggle Status">
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleStatus(process)}
                      >
                        {process.status === 'Active' ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="View History">
                      <IconButton 
                        size="small"
                        onClick={() => handleViewHistory(process)}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit Process">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Scheduling Tab */}
      <TabPanel value={activeTab} index={2}>
        <ScheduledProcesses />
      </TabPanel>

      {/* Monitoring Tab */}
      <TabPanel value={activeTab} index={3}>
        <ProcessMonitoring />
      </TabPanel>

      {/* Workflow Engine Tab */}
      <TabPanel value={activeTab} index={4}>
        {/* Workflow Engine Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#003366', fontWeight: 'bold', mb: 2 }}>
            Workflow Automation Engine
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Intelligent process orchestration and task routing with SLA monitoring
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Workflow Overview Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <WorkflowIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Workflows
                </Typography>
                <Typography variant="caption" sx={{ color: '#1976d2' }}>
                  +3 this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <RouteIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  847
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasks Routed Today
                </Typography>
                <Typography variant="caption" sx={{ color: '#4caf50' }}>
                  98.5% success rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SlaIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  94.2%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SLA Compliance
                </Typography>
                <Typography variant="caption" sx={{ color: '#ff9800' }}>
                  Target: 95%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                  2.3m
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Processing Time
                </Typography>
                <Typography variant="caption" sx={{ color: '#9c27b0' }}>
                  -15% improvement
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Workflow Designer */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                  Workflow Designer
                </Typography>
                <Box sx={{ 
                  height: 400, 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fafafa'
                }}>
                  <WorkflowIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Visual Workflow Designer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                    Drag-and-drop interface for creating intelligent workflows with conditional logic, parallel processing, and automated decision points.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: '#003366' }}
                  >
                    Create New Workflow
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SLA Monitoring */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                  SLA Monitoring
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Application Processing"
                      secondary="SLA: 2 hours | Avg: 1.8h"
                    />
                    <Chip label="98%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Document Review"
                      secondary="SLA: 24 hours | Avg: 18h"
                    />
                    <Chip label="95%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon sx={{ color: '#ff9800' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Quality Assurance"
                      secondary="SLA: 4 hours | Avg: 4.2h"
                    />
                    <Chip label="87%" size="small" sx={{ bgcolor: '#fff3e0', color: '#f57c00' }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
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

          {/* Task Routing Intelligence */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                  Intelligent Task Routing
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Routing Rules Engine
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <RouteIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Priority-Based Routing"
                          secondary="High priority tasks → Senior reviewers"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <RouteIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Workload Balancing"
                          secondary="Distribute tasks based on current capacity"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <RouteIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Skill-Based Assignment"
                          secondary="Match tasks to reviewer expertise"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <RouteIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Geographic Routing"
                          secondary="Route to nearest available office"
                        />
                        <Switch color="primary" />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Routing Accuracy
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={96} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        96% - Excellent
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Load Distribution
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={89} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': { backgroundColor: '#2196f3' }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        89% - Good
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Response Time
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={92} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        92% - Very Good
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Coming Soon Features */}
          <Grid item xs={12}>
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: '#e3f2fd',
                '& .MuiAlert-icon': { color: '#1976d2' }
              }}
            >
              <Typography variant="h6" gutterBottom>
                🚀 Coming Soon: Advanced Workflow Automation Features
              </Typography>
              <Typography variant="body2">
                Advanced workflow automation features are currently in development and will include:
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                <li>AI-powered workflow optimization and bottleneck detection</li>
                <li>Machine learning-based task routing and priority assignment</li>
                <li>Advanced SLA prediction and proactive escalation</li>
                <li>Integration with external systems and APIs</li>
                <li>Real-time workflow analytics and performance dashboards</li>
                <li>Automated compliance checking and audit trails</li>
              </Box>
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Execution History Dialog */}
      <Dialog
        open={showExecutionDialog}
        onClose={() => setShowExecutionDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="execution-history-dialog-title"
      >
        <DialogTitle id="execution-history-dialog-title">
          Execution History - {selectedProcess?.name}
        </DialogTitle>
        <DialogContent>
          <List>
            {executionHistory.map((execution, index) => (
              <ListItem key={execution.executionId} divider>
                <ListItemIcon>
                  {execution.status === 'Completed' ? (
                    <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                  ) : execution.status === 'Failed' ? (
                    <ErrorIcon sx={{ color: '#F44336' }} />
                  ) : (
                    <InfoIcon sx={{ color: '#2196F3' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`Execution ${execution.executionId.slice(0, 8)}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Status: {execution.status}
                      </Typography>
                      <Typography variant="body2">
                        Started: {new Date(execution.startTime).toLocaleString()}
                      </Typography>
                      {execution.endTime && (
                        <Typography variant="body2">
                          Duration: {automatedProcessesService.formatExecutionTime(
                            execution.startTime, 
                            execution.endTime
                          )}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExecutionDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AutomatedProcesses;

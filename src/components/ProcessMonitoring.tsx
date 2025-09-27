import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Badge,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonitorHeart as MonitorIcon,
  NotificationsActive as AlertIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  Speed as SpeedIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import processMonitoringService, { 
  ProcessMonitor, 
  MonitoringDashboard
} from '../services/processMonitoringService';

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
      id={`process-monitoring-tabpanel-${index}`}
      aria-labelledby={`process-monitoring-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProcessMonitoring: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [monitors, setMonitors] = useState<ProcessMonitor[]>([]);
  const [dashboardData, setDashboardData] = useState<MonitoringDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedMonitor, setSelectedMonitor] = useState<ProcessMonitor | null>(null);
  const [monitorDialogOpen, setMonitorDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [createAlertDialogOpen, setCreateAlertDialogOpen] = useState(false);
  const [newAlertData, setNewAlertData] = useState({
    processId: '',
    alertType: 'Manual',
    severity: 'Medium',
    message: '',
    metadata: {}
  });
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [totalMonitors, setTotalMonitors] = useState(0);

  // Colors for charts
  const statusColors = {
    Healthy: '#4caf50',
    Warning: '#ff9800',
    Critical: '#f44336',
    Down: '#9e9e9e',
    Unknown: '#2196f3'
  };

  const severityColors = {
    Critical: '#d32f2f',
    High: '#f44336',
    Medium: '#ff9800',
    Low: '#2196f3'
  };

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      const response = await processMonitoringService.getMonitoringDashboard('24h');
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    }
  }, []);

  // Load monitors
  const loadMonitors = useCallback(async () => {
    try {
      setError(null);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        severity: severityFilter || undefined
      };
      
      const response = await processMonitoringService.getProcessMonitors(params);
      if (response.success && response.data) {
        setMonitors(response.data);
        setTotalMonitors(response.total || 0);
      }
    } catch (err: any) {
      console.error('Error loading monitors:', err);
      setError(err.message || 'Failed to load monitors');
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, severityFilter]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadDashboardData(), loadMonitors()]);
      setLoading(false);
    };
    loadData();
  }, [loadDashboardData, loadMonitors]);

  // Auto-refresh setup
  useEffect(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(() => {
      loadDashboardData();
      if (tabValue === 1) { // Only refresh monitors list if on that tab
        loadMonitors();
      }
    }, 30000); // Refresh every 30 seconds

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadDashboardData, loadMonitors, tabValue]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([loadDashboardData(), loadMonitors()]);
    setLoading(false);
  };

  // Handle acknowledge alert
  const handleAcknowledgeAlert = async (monitorId: string, alertId: string) => {
    try {
      await processMonitoringService.acknowledgeAlert(monitorId, alertId);
      await loadMonitors();
      await loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge alert');
    }
  };

  // Handle resolve alert
  const handleResolveAlert = async (monitorId: string, alertId: string) => {
    try {
      await processMonitoringService.resolveAlert(monitorId, alertId);
      await loadMonitors();
      await loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  // Handle create manual alert
  const handleCreateAlert = async () => {
    try {
      if (!newAlertData.processId || !newAlertData.message) {
        setError('Process and message are required for creating an alert');
        return;
      }

      await processMonitoringService.triggerAlert(
        newAlertData.processId,
        newAlertData.alertType,
        newAlertData.severity,
        newAlertData.message,
        newAlertData.metadata
      );

      // Reset form and close dialog
      setNewAlertData({
        processId: '',
        alertType: 'Manual',
        severity: 'Medium',
        message: '',
        metadata: {}
      });
      setCreateAlertDialogOpen(false);

      // Refresh data
      await loadMonitors();
      await loadDashboardData();
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create alert');
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <CheckIcon sx={{ color: statusColors.Healthy }} />;
      case 'Warning':
        return <WarningIcon sx={{ color: statusColors.Warning }} />;
      case 'Critical':
        return <ErrorIcon sx={{ color: statusColors.Critical }} />;
      case 'Down':
        return <CancelIcon sx={{ color: statusColors.Down }} />;
      default:
        return <MonitorIcon sx={{ color: statusColors.Unknown }} />;
    }
  };

  // Dashboard Overview Tab
  const renderDashboardTab = () => (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="primary">
                      {dashboardData?.summary.totalMonitors || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Monitors
                    </Typography>
                  </Box>
                  <MonitorIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: statusColors.Healthy }}>
                      {dashboardData?.summary.healthyProcesses || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Healthy Processes
                    </Typography>
                  </Box>
                  <CheckIcon sx={{ color: statusColors.Healthy, fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: severityColors.Critical }}>
                      {dashboardData?.summary.totalActiveAlerts || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Alerts
                    </Typography>
                  </Box>
                  <AlertIcon sx={{ color: severityColors.Critical, fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="primary">
                      {dashboardData?.summary.healthPercentage || 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Overall Health
                    </Typography>
                  </Box>
                  <SpeedIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Number(dashboardData?.summary.healthPercentage) || 0}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Status Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Process Status Distribution" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Healthy', value: dashboardData?.summary.healthyProcesses || 0, color: statusColors.Healthy },
                    { name: 'Warning', value: dashboardData?.summary.warningProcesses || 0, color: statusColors.Warning },
                    { name: 'Critical', value: dashboardData?.summary.criticalProcesses || 0, color: statusColors.Critical },
                    { name: 'Down', value: dashboardData?.summary.downProcesses || 0, color: statusColors.Down }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Healthy', value: dashboardData?.summary.healthyProcesses || 0, color: statusColors.Healthy },
                    { name: 'Warning', value: dashboardData?.summary.warningProcesses || 0, color: statusColors.Warning },
                    { name: 'Critical', value: dashboardData?.summary.criticalProcesses || 0, color: statusColors.Critical },
                    { name: 'Down', value: dashboardData?.summary.downProcesses || 0, color: statusColors.Down }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Alert Severity Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Alert Severity Breakdown" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Critical', value: dashboardData?.alertBreakdown.Critical || 0, color: severityColors.Critical },
                  { name: 'High', value: dashboardData?.alertBreakdown.High || 0, color: severityColors.High },
                  { name: 'Medium', value: dashboardData?.alertBreakdown.Medium || 0, color: severityColors.Medium },
                  { name: 'Low', value: dashboardData?.alertBreakdown.Low || 0, color: severityColors.Low }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {[
                    { name: 'Critical', value: dashboardData?.alertBreakdown.Critical || 0, color: severityColors.Critical },
                    { name: 'High', value: dashboardData?.alertBreakdown.High || 0, color: severityColors.High },
                    { name: 'Medium', value: dashboardData?.alertBreakdown.Medium || 0, color: severityColors.Medium },
                    { name: 'Low', value: dashboardData?.alertBreakdown.Low || 0, color: severityColors.Low }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Alerts */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Recent Alerts"
            action={
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
            }
          />
          <CardContent>
            <List>
              {dashboardData?.recentAlerts?.slice(0, 10).map((alertItem, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <Badge 
                      badgeContent={alertItem.alert.severity} 
                      color={
                        alertItem.alert.severity === 'Critical' ? 'error' :
                        alertItem.alert.severity === 'High' ? 'error' :
                        alertItem.alert.severity === 'Medium' ? 'warning' : 'info'
                      }
                    >
                      <AlertIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={alertItem.alert.message}
                    secondary={`${alertItem.processName} • ${new Date(alertItem.alert.triggeredAt).toLocaleString()}`}
                  />
                </ListItem>
              ))}
              {(!dashboardData?.recentAlerts || dashboardData.recentAlerts.length === 0) && (
                <ListItem>
                  <ListItemText
                    primary="No recent alerts"
                    secondary="All processes are running smoothly"
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost Savings Analysis */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Cost Savings & ROI Analysis"
            subheader="Financial impact of process automation and monitoring optimization"
          />
          <CardContent>
            <Grid container spacing={3}>
              {/* Cost Savings Summary Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: '#e8f5e8' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      $2.4M
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Annual Savings
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                      ↑ 18% vs last year
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      340%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ROI
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976d2' }}>
                      Return on Investment
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: '#fff3e0' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                      12,500
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hours Saved
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#f57c00' }}>
                      Manual work eliminated
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: '#f3e5f5' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                      98.7%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Efficiency Gain
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7b1fa2' }}>
                      Process optimization
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cost Breakdown */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Cost Savings Breakdown"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Labor Cost Reduction"
                          secondary="$1,680,000 annually"
                        />
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          70%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#2196f3', borderRadius: '50%' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Infrastructure Optimization"
                          secondary="$480,000 annually"
                        />
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          20%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: '50%' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Error Prevention"
                          secondary="$168,000 annually"
                        />
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          7%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#9c27b0', borderRadius: '50%' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Compliance Efficiency"
                          secondary="$72,000 annually"
                        />
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          3%
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* ROI Metrics */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Investment & Payback"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Initial Investment
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                          $720,000
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Payback Period
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                          4.2 months
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Monthly Savings
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                          $200,000
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Break-even Date
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#7b1fa2' }}>
                          Mar 2024
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#2e7d32'
                          }
                        }} 
                      />
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        85% of projected savings achieved
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Process-Specific Savings */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Savings by Automated Process"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Process Name</TableCell>
                            <TableCell align="right">Annual Savings</TableCell>
                            <TableCell align="right">Hours Saved/Month</TableCell>
                            <TableCell align="right">Error Reduction</TableCell>
                            <TableCell align="right">ROI</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Daily Data Quality Check</TableCell>
                            <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              $840,000
                            </TableCell>
                            <TableCell align="right">4,200</TableCell>
                            <TableCell align="right">
                              <Chip label="95%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                              420%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Weekly Compliance Report</TableCell>
                            <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              $720,000
                            </TableCell>
                            <TableCell align="right">3,600</TableCell>
                            <TableCell align="right">
                              <Chip label="88%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                              360%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Data Backup Verification</TableCell>
                            <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              $480,000
                            </TableCell>
                            <TableCell align="right">2,400</TableCell>
                            <TableCell align="right">
                              <Chip label="92%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                              280%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Security Audit Processing</TableCell>
                            <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              $360,000
                            </TableCell>
                            <TableCell align="right">2,300</TableCell>
                            <TableCell align="right">
                              <Chip label="97%" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                              450%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Future Projections */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Future Projections"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Next 12 Months"
                          secondary="Projected additional $800K savings"
                        />
                        <Chip label="+33%" size="small" color="success" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="3-Year Outlook"
                          secondary="Total cumulative savings: $8.2M"
                        />
                        <Chip label="+240%" size="small" color="primary" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Expansion Opportunities"
                          secondary="5 additional processes identified"
                        />
                        <Chip label="$1.2M" size="small" color="info" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Government Value */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Government Value Impact"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Taxpayer Savings"
                          secondary="$2.4M returned to federal budget"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Service Improvement"
                          secondary="40% faster application processing"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Compliance Enhancement"
                          secondary="99.2% FISMA compliance achieved"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Resource Reallocation"
                          secondary="Staff redirected to high-value activities"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading && !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header - Simplified for embedded use */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body1" color="textSecondary">
          Real-time monitoring, alerts, and performance metrics for automated processes
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="process monitoring tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard Overview" 
          />
          <Tab 
            icon={<MonitorIcon />} 
            label="Process Monitors" 
          />
          <Tab 
            icon={<AlertIcon />} 
            label="Alert Management" 
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="Configuration" 
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderDashboardTab()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Filters and Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search monitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Healthy">Healthy</MenuItem>
                  <MenuItem value="Warning">Warning</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="Down">Down</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setMonitorDialogOpen(true)}
              >
                Add Monitor
              </Button>
            </Box>
          </Box>

          {/* Monitors Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Process</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Health Score</TableCell>
                  <TableCell>Active Alerts</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Memory Usage</TableCell>
                  <TableCell>CPU Usage</TableCell>
                  <TableCell>Last Check</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monitors.map((monitor) => (
                  <TableRow key={monitor._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {monitor.processName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {monitor.monitoringLevel} monitoring
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(monitor.currentMetrics.status)}
                        <Chip
                          label={monitor.currentMetrics.status}
                          size="small"
                          sx={{
                            backgroundColor: processMonitoringService.getStatusColor(monitor.currentMetrics.status),
                            color: 'white'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {monitor.healthScore || 0}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={monitor.healthScore || 0}
                          sx={{ width: 60, height: 6 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={monitor.activeAlerts?.length || 0} color="error">
                        <AlertIcon />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {monitor.currentMetrics.responseTime || 0}ms
                    </TableCell>
                    <TableCell>
                      {processMonitoringService.formatBytes((monitor.currentMetrics.memoryUsage || 0) * 1024 * 1024)}
                    </TableCell>
                    <TableCell>
                      {processMonitoringService.formatPercentage(monitor.currentMetrics.cpuUsage || 0)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(monitor.currentMetrics.lastCheckTime).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit Monitor">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMonitor(monitor);
                              setMonitorDialogOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMonitor(monitor);
                              setAlertDialogOpen(true);
                            }}
                          >
                            <AssessmentIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {monitors.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                        No process monitors found. Click "Add Monitor" to create your first monitor.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalMonitors}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Alert Management Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              Alert Management
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                size="small"
              >
                Refresh
              </Button>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                onClick={() => setCreateAlertDialogOpen(true)}
              >
                Create Alert
              </Button>
            </Box>
          </Box>

          {/* Alert Filters */}
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <MenuItem value="">All Severities</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          </Box>

          {/* Active Alerts Summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ color: severityColors.Critical }}>
                    {dashboardData?.alertBreakdown.Critical || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Critical Alerts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ color: severityColors.High }}>
                    {dashboardData?.alertBreakdown.High || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    High Priority
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ color: severityColors.Medium }}>
                    {dashboardData?.alertBreakdown.Medium || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Medium Priority
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ color: severityColors.Low }}>
                    {dashboardData?.alertBreakdown.Low || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Low Priority
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Alerts List */}
          <Card>
            <CardHeader 
              title="Active Alerts"
              action={
                <Chip 
                  label={`${dashboardData?.summary.totalActiveAlerts || 0} Active`}
                  color="error"
                  size="small"
                />
              }
            />
            <CardContent>
              <List>
                {dashboardData?.recentAlerts?.map((alertItem, index) => (
                  <ListItem 
                    key={`${alertItem.processName}-${index}`} 
                    divider
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <Badge 
                        badgeContent={alertItem.alert.severity} 
                        color={
                          alertItem.alert.severity === 'Critical' ? 'error' :
                          alertItem.alert.severity === 'High' ? 'error' :
                          alertItem.alert.severity === 'Medium' ? 'warning' : 'info'
                        }
                      >
                        <AlertIcon sx={{ 
                          color: alertItem.alert.severity === 'Critical' ? severityColors.Critical :
                                 alertItem.alert.severity === 'High' ? severityColors.High :
                                 alertItem.alert.severity === 'Medium' ? severityColors.Medium : severityColors.Low
                        }} />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" component="span">
                            {alertItem.alert.message}
                          </Typography>
                          <Chip 
                            label={alertItem.alert.severity}
                            size="small"
                            sx={{
                              backgroundColor: alertItem.alert.severity === 'Critical' ? severityColors.Critical :
                                             alertItem.alert.severity === 'High' ? severityColors.High :
                                             alertItem.alert.severity === 'Medium' ? severityColors.Medium : severityColors.Low,
                              color: 'white'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Process: <strong>{alertItem.processName}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Triggered: {new Date(alertItem.alert.triggeredAt).toLocaleString()}
                          </Typography>
                          {alertItem.alert.acknowledgedAt && (
                            <Typography variant="body2" color="textSecondary">
                              Acknowledged: {new Date(alertItem.alert.acknowledgedAt).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {!alertItem.alert.acknowledgedAt && (
                          <Tooltip title="Acknowledge Alert">
                            <IconButton
                              size="small"
                              onClick={() => handleAcknowledgeAlert(alertItem.processId, alertItem.alert.alertId)}
                              sx={{ color: 'warning.main' }}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {!alertItem.alert.resolvedAt && (
                          <Tooltip title="Resolve Alert">
                            <IconButton
                              size="small"
                              onClick={() => handleResolveAlert(alertItem.processId, alertItem.alert.alertId)}
                              sx={{ color: 'success.main' }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              // TODO: Implement alert details dialog
                              setError('Alert details view will be implemented in next iteration');
                            }}
                          >
                            <AssessmentIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {(!dashboardData?.recentAlerts || dashboardData.recentAlerts.length === 0) && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="No Active Alerts"
                      secondary="All processes are running smoothly without any alerts"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Alert Trends (Last 24 Hours)" />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                    Alert trend chart will be implemented with historical data
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Top Alert Sources" />
                <CardContent>
                  <List dense>
                    {monitors.slice(0, 5).map((monitor, index) => (
                      <ListItem key={monitor._id}>
                        <ListItemIcon>
                          <Badge badgeContent={monitor.activeAlerts?.length || 0} color="error">
                            <MonitorIcon />
                          </Badge>
                        </ListItemIcon>
                        <ListItemText
                          primary={monitor.processName}
                          secondary={`${monitor.activeAlerts?.length || 0} active alerts`}
                        />
                      </ListItem>
                    ))}
                    {monitors.length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="No monitored processes"
                          secondary="Add process monitors to see alert sources"
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Configuration Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              Monitoring Configuration
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              size="small"
            >
              Refresh
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Global Settings */}
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Global Monitoring Settings"
                  subheader="Configure system-wide monitoring parameters"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Default Monitoring Level</InputLabel>
                        <Select
                          value="Standard"
                          label="Default Monitoring Level"
                          onChange={() => {}} // TODO: Implement global settings
                        >
                          <MenuItem value="Basic">Basic - Essential metrics only</MenuItem>
                          <MenuItem value="Standard">Standard - Comprehensive monitoring</MenuItem>
                          <MenuItem value="Advanced">Advanced - Detailed analytics</MenuItem>
                          <MenuItem value="Critical">Critical - Maximum monitoring</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Auto-Refresh Interval (seconds)"
                        type="number"
                        defaultValue={30}
                        InputProps={{ inputProps: { min: 10, max: 300 } }}
                        helperText="How often to refresh monitoring data (10-300 seconds)"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Data Retention Period (days)"
                        type="number"
                        defaultValue={90}
                        InputProps={{ inputProps: { min: 7, max: 365 } }}
                        helperText="How long to keep performance history"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Real-time Notifications"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Process-Specific Configuration */}
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Process-Specific Configuration"
                  subheader="Configure monitoring settings for individual processes"
                />
                <CardContent>
                  {monitors.length > 0 ? (
                    <List>
                      {monitors.slice(0, 5).map((monitor) => (
                        <Accordion key={monitor._id}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box display="flex" alignItems="center" width="100%">
                              <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
                                {getStatusIcon(monitor.currentMetrics.status)}
                                <Typography variant="subtitle1">
                                  {monitor.processName}
                                </Typography>
                                <Chip 
                                  label={monitor.monitoringLevel}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                              <FormControlLabel
                                control={
                                  <Switch 
                                    checked={monitor.monitoringEnabled}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => {}} // TODO: Implement toggle
                                  />
                                }
                                label="Enabled"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              {/* Threshold Settings */}
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Performance Thresholds
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Max Execution Time (ms)"
                                  type="number"
                                  defaultValue={monitor.thresholds?.maxExecutionTime || 300000}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Max Memory Usage (MB)"
                                  type="number"
                                  defaultValue={monitor.thresholds?.maxMemoryUsage || 512}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Max CPU Usage (%)"
                                  type="number"
                                  defaultValue={monitor.thresholds?.maxCpuUsage || 80}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Min Success Rate (%)"
                                  type="number"
                                  defaultValue={monitor.thresholds?.minSuccessRate || 95}
                                  size="small"
                                />
                              </Grid>

                              {/* SLA Targets */}
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                  SLA Targets
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Availability Target (%)"
                                  type="number"
                                  defaultValue={monitor.slaTargets?.availability || 99.9}
                                  size="small"
                                  InputProps={{ inputProps: { min: 90, max: 100, step: 0.1 } }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Response Time Target (ms)"
                                  type="number"
                                  defaultValue={monitor.slaTargets?.responseTime || 1000}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Throughput Target (ops/min)"
                                  type="number"
                                  defaultValue={monitor.slaTargets?.throughput || 100}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                  fullWidth
                                  label="Max Error Rate (%)"
                                  type="number"
                                  defaultValue={monitor.slaTargets?.errorRate || 1}
                                  size="small"
                                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                                />
                              </Grid>

                              {/* Alert Configuration */}
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                  Alert Configuration
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FormControlLabel
                                  control={
                                    <Switch 
                                      checked={monitor.alertSettings?.enabled || false}
                                      onChange={() => {}} // TODO: Implement alert toggle
                                    />
                                  }
                                  label="Enable Alerts"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Alert Channels</InputLabel>
                                  <Select
                                    multiple
                                    value={monitor.alertSettings?.channels?.map(c => c.type) || []}
                                    label="Alert Channels"
                                    onChange={() => {}} // TODO: Implement channel selection
                                  >
                                    <MenuItem value="Email">Email</MenuItem>
                                    <MenuItem value="Dashboard">Dashboard</MenuItem>
                                    <MenuItem value="Webhook">Webhook</MenuItem>
                                    <MenuItem value="SMS">SMS</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>

                              {/* Action Buttons */}
                              <Grid item xs={12}>
                                <Box display="flex" gap={1} justifyContent="flex-end" mt={2}>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      // TODO: Implement reset configuration
                                      setError('Configuration reset will be implemented in next iteration');
                                    }}
                                  >
                                    Reset to Defaults
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                      // TODO: Implement save configuration
                                      setError('Configuration save will be implemented in next iteration');
                                    }}
                                  >
                                    Save Configuration
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </List>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body2" color="textSecondary">
                        No process monitors configured. Add monitors to configure their settings.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Health Check Configuration */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Health Check Settings"
                  subheader="Configure automated health checks"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Automated Health Checks"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Health Check Interval (minutes)"
                        type="number"
                        defaultValue={5}
                        size="small"
                        InputProps={{ inputProps: { min: 1, max: 60 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Health Check Types</InputLabel>
                        <Select
                          multiple
                          defaultValue={['HTTP_Endpoint', 'Database_Connection']}
                          label="Health Check Types"
                        >
                          <MenuItem value="HTTP_Endpoint">HTTP Endpoint</MenuItem>
                          <MenuItem value="Database_Connection">Database Connection</MenuItem>
                          <MenuItem value="Custom_Script">Custom Script</MenuItem>
                          <MenuItem value="File_System">File System</MenuItem>
                          <MenuItem value="Memory_Usage">Memory Usage</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Health Check Timeout (seconds)"
                        type="number"
                        defaultValue={30}
                        size="small"
                        InputProps={{ inputProps: { min: 5, max: 300 } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Notification Settings"
                  subheader="Configure alert notifications"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Email Notifications
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Default Recipients"
                        defaultValue="admin@uscis.gov, datasteward@uscis.gov"
                        size="small"
                        helperText="Comma-separated email addresses"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Email Severity Threshold</InputLabel>
                        <Select defaultValue="Medium">
                          <MenuItem value="Low">Low and above</MenuItem>
                          <MenuItem value="Medium">Medium and above</MenuItem>
                          <MenuItem value="High">High and above</MenuItem>
                          <MenuItem value="Critical">Critical only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Dashboard Notifications
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Show Desktop Notifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Play Alert Sounds"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Advanced Settings */}
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Advanced Settings"
                  subheader="Expert configuration options"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Performance Optimization
                      </Typography>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Performance Caching"
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Compress Historical Data"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Auto-cleanup Old Alerts"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Security & Compliance
                      </Typography>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Audit Logging"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="FISMA Compliance Mode"
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Encrypt Sensitive Data"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Integration Settings
                      </Typography>
                      <FormControlLabel
                        control={<Switch />}
                        label="Enable API Webhooks"
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Export to SIEM"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Dashboard Integration"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Global Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      Configuration changes will be applied immediately to all monitoring processes
                    </Typography>
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          // TODO: Implement export configuration
                          setError('Configuration export will be implemented in next iteration');
                        }}
                      >
                        Export Configuration
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          // TODO: Implement import configuration
                          setError('Configuration import will be implemented in next iteration');
                        }}
                      >
                        Import Configuration
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          // TODO: Implement save all configurations
                          setError('Global configuration save will be implemented in next iteration');
                        }}
                      >
                        Save All Changes
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Create Alert Dialog */}
      <Dialog
        open={createAlertDialogOpen}
        onClose={() => setCreateAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="create-alert-dialog-title"
      >
        <DialogTitle id="create-alert-dialog-title">
          Create Manual Alert
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Process</InputLabel>
              <Select
                value={newAlertData.processId}
                label="Process"
                onChange={(e) => setNewAlertData({ ...newAlertData, processId: e.target.value })}
              >
                {monitors.map((monitor) => (
                  <MenuItem key={monitor._id} value={monitor._id}>
                    {monitor.processName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Severity</InputLabel>
              <Select
                value={newAlertData.severity}
                label="Severity"
                onChange={(e) => setNewAlertData({ ...newAlertData, severity: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Alert Type"
              value={newAlertData.alertType}
              onChange={(e) => setNewAlertData({ ...newAlertData, alertType: e.target.value })}
              placeholder="e.g., Manual, Performance, Security"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Alert Message"
              value={newAlertData.message}
              onChange={(e) => setNewAlertData({ ...newAlertData, message: e.target.value })}
              multiline
              rows={3}
              placeholder="Describe the alert condition or issue..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAlertDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAlert}
            variant="contained"
            disabled={!newAlertData.processId || !newAlertData.message}
          >
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProcessMonitoring;

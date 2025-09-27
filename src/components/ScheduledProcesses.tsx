/**
 * Scheduled Processes Component
 * 
 * Comprehensive scheduling management interface for automated processes
 * with cron expression builder, schedule monitoring, and execution tracking.
 * Section 508 compliant with USCIS theme integration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, CardActions, Typography, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Switch,
  FormControlLabel, Chip, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, List, ListItem, ListItemText,
  ListItemIcon, Divider, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Accordion,
  AccordionSummary, AccordionDetails, FormGroup, RadioGroup,
  FormLabel, Radio, InputAdornment, Tabs, Tab
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

import automatedProcessesService, { AutomatedProcess } from '../services/automatedProcessesService';
import { useSnackbar } from '../contexts/SnackbarContext';

// Cron expression presets
const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *', description: 'Runs every minute' },
  { label: 'Every 5 minutes', value: '*/5 * * * *', description: 'Runs every 5 minutes' },
  { label: 'Every 15 minutes', value: '*/15 * * * *', description: 'Runs every 15 minutes' },
  { label: 'Every 30 minutes', value: '*/30 * * * *', description: 'Runs every 30 minutes' },
  { label: 'Hourly', value: '0 * * * *', description: 'Runs at the top of every hour' },
  { label: 'Every 2 hours', value: '0 */2 * * *', description: 'Runs every 2 hours' },
  { label: 'Every 6 hours', value: '0 */6 * * *', description: 'Runs every 6 hours' },
  { label: 'Daily at midnight', value: '0 0 * * *', description: 'Runs daily at 12:00 AM' },
  { label: 'Daily at 6 AM', value: '0 6 * * *', description: 'Runs daily at 6:00 AM' },
  { label: 'Daily at noon', value: '0 12 * * *', description: 'Runs daily at 12:00 PM' },
  { label: 'Daily at 6 PM', value: '0 18 * * *', description: 'Runs daily at 6:00 PM' },
  { label: 'Weekly (Sunday)', value: '0 0 * * 0', description: 'Runs every Sunday at midnight' },
  { label: 'Weekly (Monday)', value: '0 0 * * 1', description: 'Runs every Monday at midnight' },
  { label: 'Monthly (1st)', value: '0 0 1 * *', description: 'Runs on the 1st of every month' },
  { label: 'Quarterly', value: '0 0 1 */3 *', description: 'Runs quarterly on the 1st' },
  { label: 'Yearly', value: '0 0 1 1 *', description: 'Runs yearly on January 1st' }
];

// Timezone options
const TIMEZONE_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney'
];

interface ScheduleFormData {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
  customCron: boolean;
}

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
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ScheduledProcesses: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [processes, setProcesses] = useState<AutomatedProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<AutomatedProcess | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    enabled: false,
    cronExpression: '0 0 * * *',
    timezone: 'America/New_York',
    customCron: false
  });
  const [cronError, setCronError] = useState<string | null>(null);

  const { showSnackbar } = useSnackbar();

  // Fetch scheduled processes
  const fetchScheduledProcesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await automatedProcessesService.getScheduledProcesses({
        limit: 100
      });
      setProcesses(response.data);
    } catch (err: any) {
      console.error('Error fetching scheduled processes:', err);
      setError('Failed to load scheduled processes. Please try again.');
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchScheduledProcesses();
  }, [fetchScheduledProcesses]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Open schedule dialog
  const handleEditSchedule = (process: AutomatedProcess) => {
    setSelectedProcess(process);
    setScheduleForm({
      enabled: process.schedule?.enabled || false,
      cronExpression: process.schedule?.cronExpression || '0 0 * * *',
      timezone: process.schedule?.timezone || 'America/New_York',
      customCron: !CRON_PRESETS.some(preset => preset.value === process.schedule?.cronExpression)
    });
    setCronError(null);
    setShowScheduleDialog(true);
  };

  // Validate cron expression
  const validateCronExpression = (expression: string): boolean => {
    if (!expression) return false;
    
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return false;
    
    // Basic validation - in production, use a proper cron parser library
    const cronRegex = /^(\*|([0-5]?\d)(-([0-5]?\d))?)(\/\d+)?\s+(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?)(\/\d+)?\s+(\*|([12]?\d|3[01])(-([12]?\d|3[01]))?)(\/\d+)?\s+(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?)(\/\d+)?\s+(\*|[0-6](-[0-6])?)(\/\d+)?$/;
    return cronRegex.test(expression);
  };

  // Handle cron expression change
  const handleCronChange = (value: string) => {
    setScheduleForm(prev => ({ ...prev, cronExpression: value }));
    
    if (value && !validateCronExpression(value)) {
      setCronError('Invalid cron expression format. Expected: minute hour day month weekday');
    } else {
      setCronError(null);
    }
  };

  // Save schedule
  const handleSaveSchedule = async () => {
    if (!selectedProcess) return;
    
    if (scheduleForm.enabled && !validateCronExpression(scheduleForm.cronExpression)) {
      setCronError('Please enter a valid cron expression');
      return;
    }

    try {
      await automatedProcessesService.updateProcessSchedule(selectedProcess._id, {
        enabled: scheduleForm.enabled,
        cronExpression: scheduleForm.cronExpression,
        timezone: scheduleForm.timezone
      });
      
      showSnackbar('Schedule updated successfully', 'success');
      setShowScheduleDialog(false);
      fetchScheduledProcesses();
    } catch (error) {
      showSnackbar('Failed to update schedule', 'error');
    }
  };

  // Toggle process schedule
  const handleToggleSchedule = async (process: AutomatedProcess) => {
    try {
      await automatedProcessesService.updateProcessSchedule(process._id, {
        enabled: !process.schedule?.enabled,
        cronExpression: process.schedule?.cronExpression || '0 0 * * *',
        timezone: process.schedule?.timezone || 'America/New_York'
      });
      
      showSnackbar(
        `Schedule ${!process.schedule?.enabled ? 'enabled' : 'disabled'} for ${process.name}`,
        'success'
      );
      fetchScheduledProcesses();
    } catch (error) {
      showSnackbar('Failed to toggle schedule', 'error');
    }
  };

  // Get next run time display
  const getNextRunDisplay = (process: AutomatedProcess): string => {
    if (!process.schedule?.enabled) return 'Disabled';
    if (!process.schedule?.nextRun) return 'Not calculated';
    
    const nextRun = new Date(process.schedule.nextRun);
    const now = new Date();
    const diffMs = nextRun.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Overdue';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `In ${diffHours}h ${diffMinutes}m`;
    } else {
      return `In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
  };

  // Get status color
  const getStatusColor = (process: AutomatedProcess): string => {
    if (!process.schedule?.enabled) return '#9E9E9E';
    if (process.status === 'Active') return '#4CAF50';
    if (process.status === 'Error') return '#F44336';
    if (process.status === 'Paused') return '#FF9800';
    return '#2196F3';
  };

  // Get cron description
  const getCronDescription = (cronExpression: string): string => {
    const preset = CRON_PRESETS.find(p => p.value === cronExpression);
    return preset ? preset.description : 'Custom schedule';
  };

  return (
    <Box>
      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Scheduled processes navigation"
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
            icon={<ScheduleIcon />} 
            label="Active Schedules" 
            id="schedule-tab-0"
            aria-controls="schedule-tabpanel-0"
          />
          <Tab 
            icon={<TimelineIcon />} 
            label="Schedule Calendar" 
            id="schedule-tab-1"
            aria-controls="schedule-tabpanel-1"
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label="Schedule Alerts" 
            id="schedule-tab-2"
            aria-controls="schedule-tabpanel-2"
          />
        </Tabs>
      </Paper>

      {/* Active Schedules Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Scheduled Processes ({processes.filter(p => p.schedule?.enabled).length} active)
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchScheduledProcesses}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && processes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Scheduled Processes Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create automated processes with scheduled execution to get started.
            </Typography>
          </Box>
        )}

        {!loading && processes.length > 0 && (
          <Grid container spacing={3}>
            {processes.map((process) => (
              <Grid item xs={12} md={6} lg={4} key={process._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${getStatusColor(process)}`,
                    '&:hover': { boxShadow: 3 }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScheduleIcon sx={{ color: getStatusColor(process), mr: 1 }} />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {process.name}
                      </Typography>
                      <Switch
                        checked={process.schedule?.enabled || false}
                        onChange={() => handleToggleSchedule(process)}
                        size="small"
                        color="primary"
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
                        label={process.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(process),
                          color: 'white'
                        }}
                      />
                    </Box>
                    
                    {process.schedule?.enabled && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>
                          Schedule: {process.schedule.cronExpression}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {getCronDescription(process.schedule.cronExpression || '')}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Timezone: {process.schedule.timezone}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" display="block">
                          Next Run:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {getNextRunDisplay(process)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" display="block">
                          Success Rate:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                          {process.successRate}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Tooltip title="Edit Schedule">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditSchedule(process)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Execute Now">
                      <IconButton 
                        size="small"
                        onClick={() => automatedProcessesService.executeProcess(process._id)}
                        disabled={process.status !== 'Active'}
                      >
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Schedule Calendar Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Schedule Calendar View
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Visual calendar showing upcoming scheduled executions and process timeline.
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Process Name</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Next Run</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processes.filter(p => p.schedule?.enabled).map((process) => (
                <TableRow key={process._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScheduleIcon sx={{ mr: 1, color: getStatusColor(process) }} />
                      {process.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {process.schedule?.cronExpression}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getCronDescription(process.schedule?.cronExpression || '')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getNextRunDisplay(process)}
                    </Typography>
                    {process.schedule?.nextRun && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(process.schedule.nextRun).toLocaleString()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={process.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(process),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={() => handleEditSchedule(process)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Schedule Alerts Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>
          Schedule Alerts & Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure alerts for schedule failures, delays, and performance issues.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Alert Configuration
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Schedule failure alerts"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Execution delay alerts"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Performance degradation alerts"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Daily schedule summary"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Alerts
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon sx={{ color: '#FF9800' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Schedule delay detected"
                      secondary="Daily Data Quality Check - 15 minutes late"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Schedule completed successfully"
                      secondary="Weekly Compliance Report - On time"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Schedule Edit Dialog */}
      <Dialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="schedule-dialog-title"
      >
        <DialogTitle id="schedule-dialog-title">
          Edit Schedule - {selectedProcess?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleForm.enabled}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, enabled: e.target.checked }))}
                />
              }
              label="Enable Scheduling"
              sx={{ mb: 3 }}
            />
            
            {scheduleForm.enabled && (
              <>
                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend">Schedule Type</FormLabel>
                  <RadioGroup
                    value={scheduleForm.customCron ? 'custom' : 'preset'}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, customCron: e.target.value === 'custom' }))}
                    row
                  >
                    <FormControlLabel value="preset" control={<Radio />} label="Use Preset" />
                    <FormControlLabel value="custom" control={<Radio />} label="Custom Cron" />
                  </RadioGroup>
                </FormControl>
                
                {!scheduleForm.customCron ? (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Schedule Preset</InputLabel>
                    <Select
                      value={scheduleForm.cronExpression}
                      onChange={(e) => handleCronChange(e.target.value)}
                      label="Schedule Preset"
                    >
                      {CRON_PRESETS.map((preset) => (
                        <MenuItem key={preset.value} value={preset.value}>
                          <Box>
                            <Typography variant="body2">{preset.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {preset.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label="Cron Expression"
                    value={scheduleForm.cronExpression}
                    onChange={(e) => handleCronChange(e.target.value)}
                    error={!!cronError}
                    helperText={cronError || 'Format: minute hour day month weekday (e.g., 0 6 * * 1 for Monday 6 AM)'}
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Cron expression help">
                            <IconButton>
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={scheduleForm.timezone}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, timezone: e.target.value }))}
                    label="Timezone"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Current Expression:</strong> {scheduleForm.cronExpression}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Description:</strong> {getCronDescription(scheduleForm.cronExpression)}
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScheduleDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSchedule}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={scheduleForm.enabled && !!cronError}
          >
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledProcesses;

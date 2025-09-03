import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Avatar,
  Badge
} from '@mui/material';
import AssetSelector from '../components/AssetSelector';
import DataLineageDiagram from '../components/DataLineageDiagram';
import taskService from '../services/taskService';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Warning as IssueIcon,
  TrendingUp as TrendIcon,
  People as UsersIcon,
  DataObject as AssetIcon,
  Security as GovernanceIcon,
  Assessment as QualityIcon,
  Notifications as NotificationIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Schedule as PendingIcon,
  Star as CertifyIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as RunIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Storage as StorageIcon,
  Transform as TransformIcon,
  CloudUpload as CollectionIcon,
  Speed as PerformanceIcon,
  BugReport as ErrorIcon,
  CheckCircleOutline as PassIcon,
  MonitorHeart as MonitorIcon,
  TrendingDown as TrendingDownIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  CloudQueue as CloudIcon,
  DataUsage as DataUsageIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface TaskItem {
  _id: string;
  title: string;
  type: 'review' | 'approval' | 'certification' | 'issue';
  priority: 'high' | 'medium' | 'low';
  assetName: string;
  assetType: string;
  status: 'Open' | 'In Progress' | 'Completed';
  dueDate: string;
  description: string;
  requestedBy: string;
  relatedAssets?: any[];
  completedAt?: string;
  assignee?: string;
}

interface MetricCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// Data Quality Monitoring Component
const DataQualityMonitoring: React.FC = () => {
  const [qualityRules, setQualityRules] = useState([
    {
      id: '1',
      name: 'Customer Email Validation',
      asset: 'Customer Database',
      rule: 'Email format validation',
      status: 'active',
      lastRun: '2024-01-15T10:30:00Z',
      passRate: 98.5,
      issues: 15
    },
    {
      id: '2', 
      name: 'Sales Amount Range Check',
      asset: 'Sales Database',
      rule: 'Amount > 0 AND Amount < 1000000',
      status: 'active',
      lastRun: '2024-01-15T09:15:00Z',
      passRate: 99.2,
      issues: 3
    },
    {
      id: '3',
      name: 'Date Consistency Check',
      asset: 'Order Database',
      rule: 'Order date <= Ship date',
      status: 'warning',
      lastRun: '2024-01-15T08:45:00Z',
      passRate: 95.8,
      issues: 42
    }
  ]);

  const [auditLog, setAuditLog] = useState([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      asset: 'Customer Database',
      action: 'Quality Check Completed',
      result: 'Pass',
      details: '1,250 records validated, 15 issues found'
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:15:00Z', 
      asset: 'Sales Database',
      action: 'Data Integrity Audit',
      result: 'Pass',
      details: '5,430 records validated, 3 anomalies detected'
    },
    {
      id: '3',
      timestamp: '2024-01-15T08:45:00Z',
      asset: 'Order Database', 
      action: 'Consistency Validation',
      result: 'Warning',
      details: '2,100 records validated, 42 inconsistencies found'
    }
  ]);

  const handleRunQualityCheck = (ruleId: string) => {
    setQualityRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, lastRun: new Date().toISOString(), status: 'active' }
          : rule
      )
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Quality Monitoring & Auditing
      </Typography>
      
      {/* Quality Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary">98.2%</Typography>
                  <Typography variant="body2" color="text.secondary">Overall Quality Score</Typography>
                </Box>
                <QualityIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">60</Typography>
                  <Typography variant="body2" color="text.secondary">Active Quality Issues</Typography>
                </Box>
                <ErrorIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="success.main">12</Typography>
                  <Typography variant="body2" color="text.secondary">Quality Rules Active</Typography>
                </Box>
                <PassIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="info.main">8.5M</Typography>
                  <Typography variant="body2" color="text.secondary">Records Monitored</Typography>
                </Box>
                <StorageIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quality Rules Management */}
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Data Quality Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Rule Definition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pass Rate</TableCell>
                  <TableCell>Issues</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualityRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>{rule.asset}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {rule.rule}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.status}
                        color={rule.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={rule.passRate}
                          sx={{ width: 60, height: 6 }}
                          color={rule.passRate > 95 ? 'success' : rule.passRate > 90 ? 'warning' : 'error'}
                        />
                        <Typography variant="body2">{rule.passRate}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.issues}
                        color={rule.issues > 20 ? 'error' : rule.issues > 5 ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(rule.lastRun).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Run Quality Check">
                        <IconButton
                          size="small"
                          onClick={() => handleRunQualityCheck(rule.id)}
                          color="primary"
                        >
                          <RunIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Data Lifecycle Management */}
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Complete Data Lifecycle Oversight</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Lifecycle Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CollectionIcon color="primary" />
                    <Typography variant="h6">Data Collection</Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Monitor data ingestion processes and source system health
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Active Sources:</Typography>
                      <Typography variant="body2" fontWeight="bold">15</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Daily Volume:</Typography>
                      <Typography variant="body2" fontWeight="bold">2.3GB</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Success Rate:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">99.1%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Failed Jobs:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="error.main">3</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="View Source Systems">
                      <IconButton size="small" color="primary">
                        <NetworkIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Collection Settings">
                      <IconButton size="small">
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Health Monitor">
                      <IconButton size="small" color="success">
                        <MonitorIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <StorageIcon color="info" />
                    <Typography variant="h6">Data Storage</Typography>
                    <Chip label="Optimizing" color="warning" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Oversee data storage optimization and retention policies
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage Used:</Typography>
                      <Typography variant="body2" fontWeight="bold">847GB / 1TB</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={84.7} 
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                      color="warning"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Growth Rate:</Typography>
                      <Typography variant="body2" fontWeight="bold">+12% monthly</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Retention Compliance:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">98.5%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Archived Data:</Typography>
                      <Typography variant="body2" fontWeight="bold">2.1TB</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="Storage Analytics">
                      <IconButton size="small" color="info">
                        <AnalyticsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Backup Management">
                      <IconButton size="small">
                        <BackupIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Archive Policies">
                      <IconButton size="small">
                        <ArchiveIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TransformIcon color="warning" />
                    <Typography variant="h6">Data Processing</Typography>
                    <Chip label="Running" color="info" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Monitor ETL processes and data transformation pipelines
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Active Pipelines:</Typography>
                      <Typography variant="body2" fontWeight="bold">28</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Avg Processing Time:</Typography>
                      <Typography variant="body2" fontWeight="bold">4.2 min</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Pipeline Health:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">96.8%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Queue Length:</Typography>
                      <Typography variant="body2" fontWeight="bold">142 jobs</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Failed Jobs:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="error.main">7</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="Pipeline Monitor">
                      <IconButton size="small" color="warning">
                        <TimelineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Performance Metrics">
                      <IconButton size="small">
                        <PerformanceIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Job Scheduler">
                      <IconButton size="small">
                        <ScheduleIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Monitoring Tables */}
          <Tabs value={0} sx={{ mb: 3 }}>
            <Tab label="Source Systems" />
            <Tab label="Storage Management" />
            <Tab label="Processing Pipelines" />
            <Tab label="Data Flow" />
          </Tabs>

          {/* Source Systems Monitoring */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Source System Health Monitoring
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source System</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Sync</TableCell>
                    <TableCell>Records/Day</TableCell>
                    <TableCell>Latency</TableCell>
                    <TableCell>Error Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Customer CRM', type: 'Salesforce', status: 'healthy', lastSync: '2 min ago', records: '15.2K', latency: '45ms', errorRate: '0.1%' },
                    { name: 'Sales Database', type: 'PostgreSQL', status: 'healthy', lastSync: '5 min ago', records: '8.7K', latency: '120ms', errorRate: '0.3%' },
                    { name: 'Marketing Platform', type: 'HubSpot', status: 'warning', lastSync: '15 min ago', records: '3.1K', latency: '890ms', errorRate: '2.1%' },
                    { name: 'Financial System', type: 'SAP', status: 'healthy', lastSync: '1 min ago', records: '12.5K', latency: '67ms', errorRate: '0.0%' }
                  ].map((source, index) => (
                    <TableRow key={index}>
                      <TableCell>{source.name}</TableCell>
                      <TableCell>{source.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={source.status}
                          color={source.status === 'healthy' ? 'success' : 'warning'}
                          size="small"
                          icon={source.status === 'healthy' ? <PassIcon /> : <IssueIcon />}
                        />
                      </TableCell>
                      <TableCell>{source.lastSync}</TableCell>
                      <TableCell>{source.records}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={parseInt(source.latency) > 500 ? 'error.main' : 'text.primary'}>
                          {source.latency}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={parseFloat(source.errorRate) > 1 ? 'error.main' : 'success.main'}>
                          {source.errorRate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Configure">
                          <IconButton size="small">
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Storage Capacity Planning */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Storage Capacity & Retention Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Storage Utilization by Category
                    </Typography>
                    {[
                      { category: 'Customer Data', size: '245GB', percentage: 29, color: 'primary' },
                      { category: 'Transaction Records', size: '198GB', percentage: 23, color: 'secondary' },
                      { category: 'Analytics Data', size: '156GB', percentage: 18, color: 'info' },
                      { category: 'Archived Data', size: '134GB', percentage: 16, color: 'warning' },
                      { category: 'Backup Data', size: '114GB', percentage: 14, color: 'success' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{item.category}</Typography>
                          <Typography variant="body2" fontWeight="bold">{item.size}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          color={item.color as any}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Retention Policy Compliance
                    </Typography>
                    <List>
                      {[
                        { policy: 'Customer PII (7 years)', compliance: 98.5, records: '2.1M', action: 'compliant' },
                        { policy: 'Transaction Data (10 years)', compliance: 99.2, records: '5.7M', action: 'compliant' },
                        { policy: 'Log Files (90 days)', compliance: 95.8, records: '890K', action: 'cleanup_needed' },
                        { policy: 'Temp Files (30 days)', compliance: 87.3, records: '156K', action: 'urgent_cleanup' }
                      ].map((policy, index) => (
                        <ListItem key={index} divider>
                          <ListItemIcon>
                            {policy.action === 'compliant' ? (
                              <PassIcon color="success" />
                            ) : policy.action === 'cleanup_needed' ? (
                              <IssueIcon color="warning" />
                            ) : (
                              <ErrorIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={policy.policy}
                            secondary={`${policy.compliance}% compliant • ${policy.records} records`}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {policy.action !== 'compliant' && (
                              <Tooltip title="Run Cleanup">
                                <IconButton size="small" color="warning">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View Policy">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Processing Pipeline Dashboard */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Processing Pipeline Monitoring
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pipeline Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Records Processed</TableCell>
                    <TableCell>Success Rate</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Customer Data ETL', status: 'running', schedule: 'Hourly', lastRun: '10 min ago', duration: '3.2 min', records: '15.2K', successRate: '99.8%', nextRun: '50 min' },
                    { name: 'Sales Analytics', status: 'completed', schedule: 'Daily', lastRun: '2 hours ago', duration: '12.5 min', records: '89.7K', successRate: '99.1%', nextRun: '22 hours' },
                    { name: 'Financial Reporting', status: 'failed', schedule: 'Daily', lastRun: '6 hours ago', duration: '8.1 min', records: '45.3K', successRate: '97.2%', nextRun: '18 hours' },
                    { name: 'Data Quality Check', status: 'queued', schedule: '4x Daily', lastRun: '1 hour ago', duration: '2.8 min', records: '125.6K', successRate: '98.9%', nextRun: '5 hours' }
                  ].map((pipeline, index) => (
                    <TableRow key={index}>
                      <TableCell>{pipeline.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={pipeline.status}
                          color={
                            pipeline.status === 'running' ? 'info' :
                            pipeline.status === 'completed' ? 'success' :
                            pipeline.status === 'failed' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{pipeline.schedule}</TableCell>
                      <TableCell>{pipeline.lastRun}</TableCell>
                      <TableCell>{pipeline.duration}</TableCell>
                      <TableCell>{pipeline.records}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={parseFloat(pipeline.successRate) > 98 ? 'success.main' : 'warning.main'}>
                          {pipeline.successRate}
                        </Typography>
                      </TableCell>
                      <TableCell>{pipeline.nextRun}</TableCell>
                      <TableCell>
                        <Tooltip title="Run Now">
                          <IconButton size="small" color="primary">
                            <RunIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Logs">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Configure">
                          <IconButton size="small">
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Audit Log */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Recent Audit Activities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {auditLog.map((log) => (
              <ListItem key={log.id} divider>
                <ListItemIcon>
                  {log.result === 'Pass' ? (
                    <PassIcon color="success" />
                  ) : log.result === 'Warning' ? (
                    <IssueIcon color="warning" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">{log.action}</Typography>
                      <Chip
                        label={log.result}
                        size="small"
                        color={log.result === 'Pass' ? 'success' : log.result === 'Warning' ? 'warning' : 'error'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {log.asset} • {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {log.details}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const DataStewardCenter: React.FC = () => {
  console.log('DataStewardCenter component rendering');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [completedTasksDialogOpen, setCompletedTasksDialogOpen] = useState(false);
  const [openTasksDialogOpen, setOpenTasksDialogOpen] = useState(false);
  const [inProgressTasksDialogOpen, setInProgressTasksDialogOpen] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [inProgressTasks, setInProgressTasks] = useState<TaskItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([]);
  const [openTasks, setOpenTasks] = useState<TaskItem[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskItem | null>(null);
  const [newTask, setNewTask] = useState<Partial<TaskItem>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'Open',
    dueDate: '',
    relatedAssets: []
  });

  // Load tasks from database
  const loadTasks = async () => {
    console.log('🔄 loadTasks function called');
    try {
      setLoading(true);
      console.log('📡 Making API call to getTasks...');
      const response = await taskService.getTasks();
      console.log('✅ API Response received:', response);
      console.log('📊 Response data:', response.data);
      console.log('🔢 Number of tasks received:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        const dbTasks = response.data.map((task: any) => taskService.convertToFrontendFormat(task));
        console.log('🔄 Converted tasks:', dbTasks);
        setTasks(dbTasks);
        console.log('✅ Tasks set in state');
      } else {
        console.log('⚠️ No tasks received from API');
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      console.error('❌ API call failed - check authentication and backend connection');
      console.error('❌ Full error details:', (error as any).response?.data || (error as any).message);
      setTasks([]);
    } finally {
      setLoading(false);
      console.log('✅ loadTasks function completed');
    }
  };

  // Calculate real metrics from task data
  const getMetrics = () => {
    const totalTasks = tasks.length;
    const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

    return [
      {
        title: 'Total Tasks',
        value: totalTasks,
        change: 0,
        icon: <TaskIcon />,
        color: '#003366',
        onClick: () => handleViewOpenTasks()
      },
      {
        title: 'In Progress',
        value: inProgressTasks,
        change: 0,
        icon: <AssetIcon />,
        color: '#2196f3',
        onClick: () => handleViewInProgressTasks()
      },
      {
        title: 'High Priority',
        value: highPriorityTasks,
        change: 0,
        icon: <IssueIcon />,
        color: '#f44336'
      },
      {
        title: 'Completed Tasks',
        value: completedTasksCount,
        change: 0,
        icon: <CertifyIcon />,
        color: '#4caf50',
        onClick: () => handleViewCompletedTasks()
      }
    ];
  };

  useEffect(() => {
    console.log('🚀 useEffect triggered - about to call loadTasks');
    // Load tasks from database on component mount
    loadTasks();
    
    // Load assets for diagram view
    const loadAssets = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/data-assets');
        const data = await response.json();
        
        if (data.success && data.data) {
          setAllAssets(data.data);
        }
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };
    
    loadAssets();
  }, []);

  // Update metrics whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const realMetrics = getMetrics();
      setMetrics(realMetrics);
    }
  }, [tasks]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTaskAction = (taskId: string, action: 'approve' | 'reject' | 'complete') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId
          ? { ...task, status: action === 'complete' ? 'Completed' : 'Completed' }
          : task
      )
    );
    setActionMenuAnchor(null);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setEditedTask({ ...selectedTask });
      setIsEditing(true);
    }
  };

  const handleSaveTask = async () => {
    if (editedTask) {
      console.log('💾 Attempting to save task:', editedTask.title);
      console.log('💾 Task ID:', editedTask._id);
      try {
        // Convert frontend format to database format
        const updateData = {
          title: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          priority: taskService.convertToDbPriority(editedTask.priority),
          dueDate: editedTask.dueDate
        };
        console.log('💾 Update data being sent:', updateData);

        // Update task in database
        const response = await taskService.updateTask(editedTask._id, updateData);
        console.log('💾 API response:', response);
        
        if (response.success) {
          // Update local state with the updated task
          const updatedTask = taskService.convertToFrontendFormat(response.data);
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === editedTask._id ? updatedTask : task
            )
          );
          setSelectedTask(updatedTask);
          setIsEditing(false);
          console.log('✅ Task saved successfully to database:', response.data);
          
          // Force reload tasks to ensure UI reflects database state
          await loadTasks();
        } else {
          console.error('❌ API returned success: false');
        }
      } catch (error) {
        console.error('❌ Error saving task:', error);
        console.error('❌ Error details:', (error as any).response?.data || (error as any).message);
        // Fallback to local update if API fails
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === editedTask._id ? editedTask : task
          )
        );
        setSelectedTask(editedTask);
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedTask(null);
    setIsEditing(false);
  };

  const handleViewCompletedTasks = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/tasks?status=Completed');
      const data = await response.json();
      if (data.success) {
        setCompletedTasks(data.data);
        setCompletedTasksDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  const handleViewOpenTasks = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/tasks?status=Open');
      const data = await response.json();
      if (data.success) {
        setOpenTasks(data.data);
        setOpenTasksDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching open tasks:', error);
    }
  };

  const handleViewInProgressTasks = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/tasks?status=In Progress');
      const data = await response.json();
      if (data.success) {
        setInProgressTasks(data.data);
        setInProgressTasksDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching in progress tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      console.log('Creating new task:', newTask);
      
      // Validate required fields
      if (!newTask.title || !newTask.description || !newTask.dueDate) {
        console.error('Missing required fields');
        return;
      }

      // Prepare task data for API
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: (newTask.priority ? newTask.priority.charAt(0).toUpperCase() + newTask.priority.slice(1) : 'Medium') as 'Low' | 'Medium' | 'High' | 'Urgent',
        status: 'Open' as const,
        dueDate: newTask.dueDate,
        taskType: 'Data Quality' as const,
        relatedAssets: newTask.relatedAssets?.map((asset: any) => 
          typeof asset === 'object' ? asset._id : asset
        ) || []
      };

      console.log('Task data being sent:', taskData);

      const response = await taskService.createTask({
        ...taskData,
        assignee: '68a3cd936fac09ceb0556f41',
        creator: '68a3cd936fac09ceb0556f41'
      });
      console.log('Create task response:', response);

      if (response.success) {
        await loadTasks();
        
        setNewTask({
          title: '',
          description: '',
          priority: 'medium',
          status: 'Open',
          dueDate: '',
          relatedAssets: []
        });
        setCreateTaskDialogOpen(false);
        
        console.log('Task created successfully');
      } else {
        console.error('Failed to create task:', response.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const exportTasksToCSV = (tasks: TaskItem[], filename: string) => {
    const csvHeaders = ['Title', 'Description', 'Priority', 'Due Date', 'Status', 'Assignee', 'Related Assets'];
    const csvData = tasks.map((task: TaskItem) => [
      task.title,
      task.description,
      task.priority,
      new Date(task.dueDate).toLocaleDateString(),
      task.status,
      typeof task.assignee === 'object' && (task.assignee as any)?.name ? (task.assignee as any).name : (task.assignee || 'Unassigned'),
      task.relatedAssets?.map((asset: any) => 
        typeof asset === 'object' && asset?.name ? asset.name : asset
      ).join('; ') || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCompletedTasksToCSV = () => {
    const csvHeaders = ['Title', 'Description', 'Priority', 'Due Date', 'Completed Date', 'Assignee', 'Related Assets'];
    const csvData = completedTasks.map((task: TaskItem) => [
      task.title,
      task.description,
      task.priority,
      task.dueDate,
      task.completedAt || 'N/A',
      typeof task.assignee === 'object' && (task.assignee as any)?.name ? (task.assignee as any).name : (task.assignee || 'Unassigned'),
      Array.isArray(task.relatedAssets) ? task.relatedAssets.join(', ') : (task.relatedAssets || 'None')
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `completed-tasks-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'review': return <ViewIcon />;
      case 'approval': return <ApproveIcon />;
      case 'certification': return <CertifyIcon />;
      case 'issue': return <IssueIcon />;
      default: return <TaskIcon />;
    }
  };

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getPriorityChip = (priority: string) => (
    <Chip
      label={priority.toUpperCase()}
      size="small"
      sx={{
        backgroundColor: getTaskColor(priority),
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  );

  const getStatusChip = (status: string) => {
    const statusConfig = {
      pending: { color: '#ff9800', label: 'Pending' },
      in_progress: { color: '#2196f3', label: 'In Progress' },
      completed: { color: '#4caf50', label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.color,
          color: 'white'
        }}
      />
    );
  };

  const TaskCard: React.FC<{ task: TaskItem }> = ({ task }) => {
    const handleCardClick = () => {
      setSelectedTask(task);
      setEditedTask({ ...task });
      setIsEditing(true);
      setTaskDialogOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardClick();
      }
    };

    return (
      <Card 
        sx={{ 
          mb: 2, 
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 3,
            borderColor: '#003366',
            backgroundColor: 'rgba(0, 51, 102, 0.02)'
          },
          '&:focus-within': {
            outline: '2px solid #003366',
            outlineOffset: '2px'
          }
        }}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        aria-label={`Edit task: ${task.title}. Priority: ${task.priority}. Status: ${task.status}. Due: ${new Date(task.dueDate).toLocaleDateString()}`}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTaskIcon(task.type)}
              <Typography variant="h6" component="h3">
                {task.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {getPriorityChip(task.priority)}
              {getStatusChip(task.status)}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenuAnchor(e.currentTarget);
                }}
                aria-label="More actions"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Asset:</Typography>
              <Typography variant="body2">{task.assetName} ({task.assetType})</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Due Date:</Typography>
              <Typography variant="body2">{new Date(task.dueDate).toLocaleDateString()}</Typography>
            </Grid>
          </Grid>
          
          <Typography variant="caption" color="text.secondary">
            Requested by: {task.requestedBy}
          </Typography>
        </CardContent>
      
        <CardActions>
          {task.status === 'Open' && (
            <>
              <Button
                size="small"
                startIcon={<ApproveIcon />}
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task._id, 'approve');
                }}
              >
                Approve
              </Button>
              <Button
                size="small"
                startIcon={<RejectIcon />}
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(task._id, 'reject');
                }}
              >
                Reject
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    );
  };

  const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: (metric as any).onClick ? 'pointer' : 'default',
        '&:hover': (metric as any).onClick ? {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        } : {}
      }}
      onClick={(metric as any).onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: metric.color }}>
              {metric.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {metric.title}
            </Typography>
          </Box>
          <Avatar sx={{ backgroundColor: metric.color, width: 48, height: 48 }}>
            {metric.icon}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TrendIcon 
            sx={{ 
              color: metric.change >= 0 ? '#4caf50' : '#f44336',
              transform: metric.change >= 0 ? 'none' : 'rotate(180deg)'
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: metric.change >= 0 ? '#4caf50' : '#f44336',
              ml: 0.5
            }}
          >
            {metric.change >= 0 ? '+' : ''}{metric.change} this week
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  console.log('DataStewardCenter rendering JSX');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        MATRIX Data Steward Control Center
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive data governance and quality management dashboard
      </Typography>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="data steward tabs">
            <Tab 
              label={
                <Badge badgeContent={tasks.filter(t => t.status === 'Open').length} color="error">
                  My Tasks
                </Badge>
              } 
              icon={<TaskIcon />} 
              iconPosition="start" 
            />
            <Tab label="Data Lineage" icon={<AssetIcon />} iconPosition="start" />
            <Tab label="Quality Monitoring" icon={<QualityIcon />} iconPosition="start" />
            <Tab label="Governance" icon={<GovernanceIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  My Tasks ({tasks.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<TaskIcon />}
                  onClick={() => setCreateTaskDialogOpen(true)}
                  sx={{ backgroundColor: '#003366' }}
                >
                  Create New Task
                </Button>
              </Box>

              {/* Instructions Card */}
              <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => setInstructionsExpanded(!instructionsExpanded)}
                  >
                    <Typography variant="h6" color="primary">
                      📋 How to Create Tasks with Asset Assignment
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {instructionsExpanded ? '−' : '+'}
                    </Typography>
                  </Box>
                  
                  {instructionsExpanded && (
                    <>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>1. Create New Task</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Click "Create New Task" button above to open the task creation dialog.
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>2. Fill Required Fields</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            • Task Title (required)<br/>
                            • Description (required)<br/>
                            • Priority (High/Medium/Low)<br/>
                            • Due Date (required)
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>3. Assign Related Assets</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            • Click "Select Assets" button<br/>
                            • Search by name, description, or owner<br/>
                            • Filter by domain (Finance, HR, etc.)<br/>
                            • Filter by type (Database, Table, Report, etc.)<br/>
                            • Multi-select assets using checkboxes
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>4. Save Task</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click "Create Task" to save with asset ObjectIds stored in database.
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label="🔍 Search Assets" 
                          variant="outlined" 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label="🏢 Filter by Domain" 
                          variant="outlined" 
                          size="small" 
                          color="secondary" 
                        />
                        <Chip 
                          label="📊 Filter by Type" 
                          variant="outlined" 
                          size="small" 
                          color="info" 
                        />
                        <Chip 
                          label="✅ Multi-Select" 
                          variant="outlined" 
                          size="small" 
                          color="success" 
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom>
                Pending Tasks ({tasks.filter(t => t.status === 'Open').length})
              </Typography>
              {tasks.filter(t => t.status === 'Open').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                In Progress ({tasks.filter(t => t.status === 'In Progress').length})
              </Typography>
              {tasks.filter(t => t.status === 'In Progress').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </Box>
          )}

          {activeTab === 1 && (
            <DataLineageDiagram 
              assets={allAssets}
              onNodeClick={(asset) => {
                console.log('Node clicked:', asset);
                // Could open asset details dialog here
              }}
            />
          )}

          {activeTab === 2 && (
            <DataQualityMonitoring />
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Data Governance Policies
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Governance controls will integrate with existing policy management.
              </Alert>
              {/* Governance content will go here */}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Task Detail Dialog */}
      <Dialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Task' : 'Task Details'}: {selectedTask?.title}
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Title:</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedTask?.title || ''}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{selectedTask.title}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Asset:</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedTask?.assetName || ''}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, assetName: e.target.value } : null)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">
                      {selectedTask.relatedAssets && selectedTask.relatedAssets.length > 0 
                        ? `${typeof selectedTask.relatedAssets[0] === 'object' && selectedTask.relatedAssets[0]?.name 
                            ? selectedTask.relatedAssets[0].name 
                            : selectedTask.assetName || selectedTask.relatedAssets[0]} (${typeof selectedTask.relatedAssets[0] === 'object' && selectedTask.relatedAssets[0]?.type 
                            ? selectedTask.relatedAssets[0].type 
                            : selectedTask.assetType || 'Database'})`
                        : `${selectedTask.assetName} (${selectedTask.assetType})`}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Priority:</Typography>
                  {isEditing ? (
                    <Select
                      fullWidth
                      value={editedTask?.priority || 'medium'}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, priority: e.target.value as 'high' | 'medium' | 'low' } : null)}
                      size="small"
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  ) : (
                    getPriorityChip(selectedTask.priority)
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Related Assets:</Typography>
                  {isEditing ? (
                    <AssetSelector
                      selectedAssets={editedTask?.relatedAssets || []}
                      onChange={(assets: any[]) => setEditedTask(prev => prev ? { ...prev, relatedAssets: assets } : null)}
                    />
                  ) : (
                    <Typography variant="body1">
                      {selectedTask.relatedAssets && selectedTask.relatedAssets.length > 0 
                        ? selectedTask.relatedAssets?.map((asset: any, index: number) => {
                            const assetName = typeof asset === 'object' && asset?.name ? asset.name : `Asset ID: ${asset}`;
                            const separator = index < (selectedTask.relatedAssets?.length || 0) - 1 ? ', ' : '';
                            return assetName + separator;
                          }).join('')
                        : 'No assets assigned'
                      }
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Due Date:</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="date"
                      label="Due Date"
                      value={editedTask?.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1">{new Date(selectedTask.dueDate).toLocaleDateString()}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                  {isEditing ? (
                    <Select
                      fullWidth
                      value={editedTask?.status || 'Open'}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, status: e.target.value as 'Open' | 'In Progress' | 'Completed' } : null)}
                      size="small"
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  ) : (
                    getStatusChip(selectedTask.status)
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editedTask?.description || ''}
                      onChange={(e) => setEditedTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{selectedTask.description}</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Requested By:</Typography>
                  <Typography variant="body1">{selectedTask.requestedBy}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveTask}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setTaskDialogOpen(false)}>Close</Button>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleEditTask}
                startIcon={<EditIcon />}
              >
                Edit Task
              </Button>
              {selectedTask?.status === 'Open' && (
                <>
                  <Button 
                    color="success" 
                    variant="contained"
                    onClick={() => {
                      handleTaskAction(selectedTask._id, 'approve');
                      setTaskDialogOpen(false);
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    color="error" 
                    variant="outlined"
                    onClick={() => {
                      handleTaskAction(selectedTask._id, 'reject');
                      setTaskDialogOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
      >
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <EditIcon sx={{ mr: 1 }} /> Edit Task
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <FlagIcon sx={{ mr: 1 }} /> Flag Issue
        </MenuItem>
        <MenuItem onClick={() => setActionMenuAnchor(null)}>
          <NotificationIcon sx={{ mr: 1 }} /> Send Reminder
        </MenuItem>
      </Menu>

      {/* Completed Tasks Dialog */}
      <Dialog 
        open={completedTasksDialogOpen} 
        onClose={() => setCompletedTasksDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Completed Tasks Review</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportCompletedTasksToCSV}
              size="small"
            >
              Export CSV
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Completed Date</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Related Assets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedTasks.map((task: TaskItem) => (
                  <TableRow key={task._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getPriorityChip(task.priority)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {typeof task.assignee === 'object' && (task.assignee as any)?.name ? (task.assignee as any).name : (task.assignee || 'Unassigned')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.relatedAssets?.map((asset: any) => 
                          typeof asset === 'object' && asset?.name ? asset.name : asset
                        ).join(', ') || 'None'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletedTasksDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Open Tasks Dialog */}
      <Dialog 
        open={openTasksDialogOpen} 
        onClose={() => setOpenTasksDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Open Tasks Review</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => exportTasksToCSV(openTasks, 'open-tasks')}
              size="small"
            >
              Export CSV
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Related Assets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openTasks.map((task: TaskItem) => (
                  <TableRow key={task._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getPriorityChip(task.priority)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(task.status)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {typeof task.assignee === 'object' && (task.assignee as any)?.name ? (task.assignee as any).name : (task.assignee || 'Unassigned')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.relatedAssets?.map((asset: any) => 
                          typeof asset === 'object' && asset?.name ? asset.name : asset
                        ).join(', ') || 'None'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTasksDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog
        open={createTaskDialogOpen}
        onClose={() => setCreateTaskDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority || 'medium'}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                  label="Priority"
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Related Assets
              </Typography>
              <AssetSelector
                selectedAssets={newTask.relatedAssets || []}
                onChange={(assets: any[]) => setNewTask(prev => ({ ...prev, relatedAssets: assets }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTaskDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTask}
            variant="contained"
            disabled={!newTask.title || !newTask.description || !newTask.dueDate}
            sx={{ backgroundColor: '#003366' }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* In Progress Tasks Dialog */}
      <Dialog 
        open={inProgressTasksDialogOpen} 
        onClose={() => setInProgressTasksDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">In Progress Tasks Review</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => exportTasksToCSV(inProgressTasks, 'in-progress-tasks')}
              size="small"
            >
              Export CSV
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Related Assets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inProgressTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getPriorityChip(task.priority)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(task.status)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {typeof task.assignee === 'object' && (task.assignee as any)?.name ? (task.assignee as any).name : (task.assignee || 'Unassigned')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.relatedAssets?.map((asset: any) => 
                          typeof asset === 'object' && asset?.name ? asset.name : asset
                        ).join(', ') || 'None'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInProgressTasksDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataStewardCenter;

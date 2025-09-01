import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assessment as QualityIcon,
  TableChart as TableIcon,
  Dashboard as DashboardIcon,
  Shield as ZeroTrustIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AttachMoney as CostIcon,
  MonitorHeart as MonitorIcon,
  Speed as OptimizeIcon,
  Settings as ConfigIcon,
  Label as TagIcon,
  Lightbulb as TipsIcon
} from '@mui/icons-material';

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
      id={`governance-tabpanel-${index}`}
      aria-labelledby={`governance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `governance-tab-${index}`,
    'aria-controls': `governance-tabpanel-${index}`,
  };
}

interface TimelineRecord {
  _id: string;
  taskName: string;
  phase: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  priority: string;
  description?: string;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
}

const DataGovernanceQuality: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timelineData, setTimelineData] = useState<TimelineRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TimelineRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch timeline data from API
  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      console.log('Fetching timeline data...');
      const response = await fetch('http://localhost:3002/api/v1/project-timeline', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Timeline data received:', result);
        setTimelineData(result.data || []);
      } else {
        console.error('Failed to fetch timeline data, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update timeline record
  const updateTimelineRecord = async (record: TimelineRecord) => {
    try {
      console.log('Updating record:', record._id);
      const response = await fetch(`http://localhost:3002/api/v1/project-timeline/${record._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      });
      console.log('Update response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        await fetchTimelineData(); // Refresh data
        setDialogOpen(false);
        setEditingRecord(null);
      } else {
        console.error('Failed to update timeline record, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error updating timeline record:', error);
    }
  };

  // Handle record click for editing
  const handleRecordClick = (record: TimelineRecord) => {
    setEditingRecord({ ...record });
    setDialogOpen(true);
  };

  // Handle record edit form changes
  const handleEditChange = (field: keyof TimelineRecord, value: any) => {
    if (editingRecord) {
      setEditingRecord({ ...editingRecord, [field]: value });
    }
  };

  // Handle save
  const handleSave = () => {
    if (editingRecord) {
      updateTimelineRecord(editingRecord);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setDialogOpen(false);
    setEditingRecord(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': case 'Active': return 'warning';
      case 'Planned': case 'Future': return 'default';
      case 'On Hold': return 'error';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  return (
    <Container sx={{ py: 4 }} className="data-governance-page">
      {/* DHS USCIS Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#003366', borderRadius: 1 }}>
        <Box sx={{ mr: 3 }}>
          <img 
            src="/images/uscis-logo.png" 
            alt="USCIS Logo" 
            style={{ height: '60px', width: 'auto' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Data Governance & Quality Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3D9FF' }}>
            Zero Trust Architecture • Databricks Quality • Lifecycle Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#CCE7FF' }}>
            Department of Homeland Security • U.S. Citizenship and Immigration Services
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
        Comprehensive data governance framework implementing Zero Trust security principles, 
        Databricks data quality management, and automated table lifecycle analysis for federal compliance.
      </Typography>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="data governance categories"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: '#003366',
              '&.Mui-selected': {
                color: '#003366',
                fontWeight: 600
              },
              '&:focus': {
                outline: '3px solid #003366',
                outlineOffset: 2
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#003366'
            }
          }}
        >
          <Tab label="Zero Trust Architecture" icon={<ZeroTrustIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Data Quality Management" icon={<QualityIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Table Lifecycle Analysis" icon={<TableIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Cost Management" icon={<CostIcon />} iconPosition="start" {...a11yProps(3)} />
          <Tab label="Implementation Roadmap" icon={<ScheduleIcon />} iconPosition="start" {...a11yProps(4)} />
          <Tab label="Governance Dashboard" icon={<DashboardIcon />} iconPosition="start" {...a11yProps(5)} />
        </Tabs>
      </Box>

      {/* Zero Trust Architecture Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Zero Trust Architecture (ZTA) - NIST SP 800-207 Implementation
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Zero Trust Philosophy:</strong> A robust security framework requiring continuous verification of every user, device, 
                and access request, regardless of location or past access, eliminating implicit trust and protecting resources through 
                dynamic and granular controls at every layer and session.
              </Typography>
            </Alert>
          </Grid>

          {/* Core Philosophy Section */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  Core Philosophy: "Never Trust, Always Verify"
                </Typography>
                <Typography variant="body1" paragraph>
                  Zero Trust signifies a fundamental shift: it abandons reliance on network boundaries or implicit trust in favor of 
                  defending specific resources (data, services, applications) based on strict identity, posture, and context. 
                  Every interaction is suspect until proven safe, and no trust is inherited from network or location.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* NIST Seven Tenets */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
              NIST Seven Tenets of Zero Trust
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    1. All Data and Services Are Resources
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Every endpoint, device, SaaS, and application is a potential target and must be governed with policy controls, 
                  regardless of ownership or location.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    2. Secure All Communications
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  No implicit trust for "internal" traffic—end-to-end encryption (TLS 1.3 for data in transit, AES-256 for data at rest) 
                  is required throughout all network segments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    3. Per-Session Resource Access
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Each session must be authenticated and authorized. Access to one resource never translates into 
                  generalized access or lateral movement privileges.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnalyticsIcon sx={{ mr: 2, color: '#2196F3' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    4. Dynamic, Attribute-Based Access
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Policy decisions draw on granular, real-time attributes of user, device, network, behavior, and environment 
                  and are continually recalculated as context changes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 2, color: '#9C27B0' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    5. Continuous Monitoring
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Devices and accounts are monitored and measured for integrity; vulnerabilities, subversions, and anomalies 
                  must trigger access revocation or policy tightening.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ZeroTrustIcon sx={{ mr: 2, color: '#E91E63' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    6. Dynamic Authentication
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Policies do not remain static. Multi-factor authentication (MFA), continuous trust evaluation, and 
                  just-in-time (JIT) privilege escalation are staples.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DashboardIcon sx={{ mr: 2, color: '#795548' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    7. Comprehensive Telemetry
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  All activity and asset states are logged, analyzed, and used to refine policies, mitigate emerging threats, 
                  and reduce attack surfaces.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    Federal Compliance Ready
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Aligned with Executive Order 14028, OMB Memoranda, and CISA Zero Trust maturity models for 
                  U.S. government agencies with annual milestones and measurable outcomes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Implementation Components */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2, mt: 3 }}>
              Zero Trust Implementation Components
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    Policy Engine & Control Plane
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon fontSize="small" sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Policy Engine" 
                      secondary="Makes dynamic allow/deny decisions based on policies, context, threat intel"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#FF9800' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Policy Administrator" 
                      secondary="Implements engine's access decisions, enforcing or blocking all traffic"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ZeroTrustIcon fontSize="small" sx={{ color: '#2196F3' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Policy Enforcement Point" 
                      secondary="Sits between user and resource, brokers each access, records every action"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    Identity & Access Management
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon fontSize="small" sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Multi-Factor Authentication" 
                      secondary="Mandatory for all privileged or sensitive resource accesses"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon fontSize="small" sx={{ color: '#B31B1B' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Role-Based Access Control" 
                      secondary="Permissions strictly mapped to job duties and data sensitivity"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ScheduleIcon fontSize="small" sx={{ color: '#2196F3' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Just-in-Time Access" 
                      secondary="Temporary elevation granted for specific tasks, auto-revoked when expired"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ZeroTrustIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    Network & Data Protection
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon fontSize="small" sx={{ color: '#B31B1B' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Micro-Segmentation" 
                      secondary="Networks split into small, isolated segments with brokered access"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon fontSize="small" sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText 
                      primary="End-to-End Encryption" 
                      secondary="TLS 1.3+ for data in motion, AES-256 for data at rest"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon fontSize="small" sx={{ color: '#FF5722' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Threat Surface Reduction" 
                      secondary="Only necessary services, accounts, and pathways exposed by default"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Federal Implementation Strategy */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  Federal Implementation Strategy & Compliance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#B31B1B', mb: 1 }}>
                      Executive Requirements
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Executive Order 14028" 
                          secondary="Mandatory Zero Trust implementation for all federal agencies"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="OMB Memoranda Compliance" 
                          secondary="Annual milestones and measurable outcomes required"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="CISA Zero Trust Maturity" 
                          secondary="Standardized maturity models and implementation playbooks"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#B31B1B', mb: 1 }}>
                      DHS/USCIS Implementation
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Cloud Security Gateways" 
                          secondary="Integrated across all systems for Zero Trust objectives"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Full-Spectrum Encryption" 
                          secondary="Identity/device management integrated throughout"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Continuous Improvement" 
                          secondary="Focus on 'brilliant at the basics' - inventory, classify, least-privilege"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Reference Documentation */}
          <Grid item xs={12}>
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body1">
                <strong>Reference Standards:</strong> This implementation follows NIST SP 800-207 Zero Trust Architecture guidelines, 
                DHS Zero Trust Implementation Strategy, and federal cybersecurity frameworks for maximum compliance and security effectiveness.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Data Quality Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Databricks Data Quality Framework
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Automated Quality Checks & Monitoring
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Quality Dimension</strong></TableCell>
                        <TableCell><strong>Check Type</strong></TableCell>
                        <TableCell><strong>Frequency</strong></TableCell>
                        <TableCell><strong>Threshold</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Completeness</TableCell>
                        <TableCell>Null value detection</TableCell>
                        <TableCell>Real-time</TableCell>
                        <TableCell>&lt; 5% null values</TableCell>
                        <TableCell>Alert + Block pipeline</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>Business rule validation</TableCell>
                        <TableCell>Batch processing</TableCell>
                        <TableCell>95% rule compliance</TableCell>
                        <TableCell>Data steward notification</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Consistency</TableCell>
                        <TableCell>Cross-table validation</TableCell>
                        <TableCell>Daily</TableCell>
                        <TableCell>Zero inconsistencies</TableCell>
                        <TableCell>Quarantine data</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Timeliness</TableCell>
                        <TableCell>Freshness monitoring</TableCell>
                        <TableCell>Continuous</TableCell>
                        <TableCell>&lt; 24 hours lag</TableCell>
                        <TableCell>SLA breach alert</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Table Lifecycle Analysis Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Table Usage Analysis & Lifecycle Management
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Governance Priority:</strong> Identify and manage unused, orphaned, or improperly owned data assets 
                to reduce costs, security risks, and compliance violations.
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    High Priority Issues
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Orphaned Tables: 47" 
                      secondary="Owner departed DHS/USCIS >6 months ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Empty Tables: 23" 
                      secondary="Zero rows, consuming storage resources"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Unused Tables: 156" 
                      secondary="No queries in past 12 months"
                    />
                  </ListItem>
                </List>
                <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
                  Review Priority Items
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Cost Optimization
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Potential Savings: $45K/month" 
                      secondary="From decommissioning unused tables"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Archive Candidates: 89" 
                      secondary="Low usage, suitable for cold storage"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Duplicate Data: 12TB" 
                      secondary="Similar datasets across departments"
                    />
                  </ListItem>
                </List>
                <Button variant="contained" color="warning" fullWidth sx={{ mt: 2 }}>
                  Generate Cost Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Governance Health
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Overall Governance Score</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={73} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">73% - Good</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Compliant Tables: 1,247" 
                      secondary="Proper ownership and documentation"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Active Stewards: 34" 
                      secondary="Data stewards managing assets"
                    />
                  </ListItem>
                </List>
                <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                  View Full Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Implementation Roadmap Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Implementation Roadmap & Project Timeline
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>12-Month Implementation Plan:</strong> Structured approach to deploying comprehensive data governance 
                and quality management across DHS/USCIS systems with measurable milestones and deliverables.
              </Typography>
            </Alert>
          </Grid>
          
          {/* Phase Overview Cards */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', border: '2px solid #4CAF50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Phase 1: Assessment
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Months 1-2 • Foundation & Discovery
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="• Current state analysis" /></ListItem>
                  <ListItem><ListItemText primary="• Data inventory & classification" /></ListItem>
                  <ListItem><ListItemText primary="• Risk assessment" /></ListItem>
                  <ListItem><ListItemText primary="• Stakeholder alignment" /></ListItem>
                  <ListItem><ListItemText primary="• Tool evaluation" /></ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={85} sx={{ mb: 1 }} />
                  <Typography variant="caption">85% Complete</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', border: '2px solid #FF9800' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Phase 2: Implementation
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Months 3-6 • Core Deployment
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="• Zero Trust architecture deployment" /></ListItem>
                  <ListItem><ListItemText primary="• Databricks quality framework" /></ListItem>
                  <ListItem><ListItemText primary="• Table lifecycle automation" /></ListItem>
                  <ListItem><ListItemText primary="• Governance workflows" /></ListItem>
                  <ListItem><ListItemText primary="• Training & onboarding" /></ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={35} sx={{ mb: 1 }} />
                  <Typography variant="caption">35% Complete</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', border: '2px solid #2196F3' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 2, color: '#2196F3' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Phase 3: Optimization
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Months 7-12 • Enhancement & Scale
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="• Performance optimization" /></ListItem>
                  <ListItem><ListItemText primary="• Advanced analytics" /></ListItem>
                  <ListItem><ListItemText primary="• AI/ML integration" /></ListItem>
                  <ListItem><ListItemText primary="• Compliance validation" /></ListItem>
                  <ListItem><ListItemText primary="• Continuous improvement" /></ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={10} sx={{ mb: 1 }} />
                  <Typography variant="caption">10% Complete</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Gantt Chart Timeline */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 3 }}>
                  Project Timeline & Gantt Chart
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <LinearProgress sx={{ width: '100%' }} />
                  </Box>
                ) : timelineData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No timeline data available. Loading from API...
                    </Typography>
                    <Button 
                      onClick={fetchTimelineData} 
                      variant="outlined" 
                      sx={{ mt: 2 }}
                    >
                      Retry Loading Data
                    </Button>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Task/Milestone</strong></TableCell>
                          <TableCell><strong>Owner</strong></TableCell>
                          <TableCell><strong>Start</strong></TableCell>
                          <TableCell><strong>End</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Progress</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {timelineData.map((record) => (
                          <TableRow 
                            key={record._id}
                            onClick={() => handleRecordClick(record)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit ${record.taskName} - Click to modify task details`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleRecordClick(record);
                              }
                            }}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                                '& .edit-icon': {
                                  opacity: 1
                                }
                              },
                              '&:focus': {
                                outline: '3px solid #003366',
                                outlineOffset: '2px',
                                backgroundColor: '#f0f8ff'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: record.phase === record.taskName ? 600 : 400 }}>
                                  {record.taskName}
                                </Typography>
                                <EditIcon 
                                  className="edit-icon"
                                  sx={{ 
                                    ml: 1, 
                                    fontSize: 16, 
                                    color: '#666', 
                                    opacity: 0,
                                    transition: 'opacity 0.2s ease-in-out'
                                  }} 
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{record.owner}</TableCell>
                            <TableCell>{formatDate(record.startDate)}</TableCell>
                            <TableCell>{formatDate(record.endDate)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={record.status} 
                                color={getStatusColor(record.status) as any} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={record.progress} 
                                  sx={{ flexGrow: 1, mr: 1 }} 
                                />
                                <Typography variant="caption">{record.progress}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecordClick(record);
                                }}
                                aria-label={`Edit ${record.taskName}`}
                                sx={{ color: '#003366' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Workflow Management */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Workflow Management
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Stakeholder Approval" 
                      secondary="Executive sponsor sign-off completed"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ScheduleIcon sx={{ color: '#FF9800' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Resource Allocation" 
                      secondary="Team assignments and budget approval pending"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: '#B31B1B' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Risk Mitigation" 
                      secondary="3 high-priority risks identified, mitigation plans active"
                    />
                  </ListItem>
                </List>
                <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#003366' }}>
                  Update Workflow Status
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Key Metrics */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Project Health Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Overall Project Progress</Typography>
                  <LinearProgress variant="determinate" value={43} sx={{ height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary">43% Complete</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Budget Utilization</Typography>
                  <LinearProgress variant="determinate" value={28} sx={{ height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary">$280K of $1M used</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Timeline Adherence</Typography>
                  <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { backgroundColor: '#4CAF50' } }} />
                  <Typography variant="caption" color="text.secondary">On track - 92%</Typography>
                </Box>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Generate Status Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Edit Timeline Record Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        aria-labelledby="edit-timeline-dialog-title"
      >
        <DialogTitle id="edit-timeline-dialog-title">
          Edit Timeline Record
        </DialogTitle>
        <DialogContent>
          {editingRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Name"
                  value={editingRecord.taskName}
                  onChange={(e) => handleEditChange('taskName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Phase</InputLabel>
                  <Select
                    value={editingRecord.phase}
                    label="Phase"
                    onChange={(e) => handleEditChange('phase', e.target.value)}
                  >
                    <MenuItem value="Assessment">Assessment</MenuItem>
                    <MenuItem value="Implementation">Implementation</MenuItem>
                    <MenuItem value="Optimization">Optimization</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={editingRecord.owner}
                  onChange={(e) => handleEditChange('owner', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={editingRecord.startDate.split('T')[0]}
                  onChange={(e) => handleEditChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={editingRecord.endDate.split('T')[0]}
                  onChange={(e) => handleEditChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingRecord.status}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Planned">Planned</MenuItem>
                    <MenuItem value="Future">Future</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Progress (%)"
                  type="number"
                  value={editingRecord.progress}
                  onChange={(e) => handleEditChange('progress', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 100 }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editingRecord.priority}
                    label="Priority"
                    onChange={(e) => handleEditChange('priority', e.target.value)}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Budget ($)"
                  type="number"
                  value={editingRecord.budget || ''}
                  onChange={(e) => handleEditChange('budget', parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editingRecord.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cost Management Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Databricks Cost Optimization & Management
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Cost Optimization Strategy:</strong> Comprehensive approach to reducing Databricks expenses through 
                intelligent monitoring, resource optimization, and organizational controls while maintaining performance and compliance.
              </Typography>
            </Alert>
          </Grid>

          {/* Overview Section */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  Why Cost Optimization Matters
                </Typography>
                <Typography variant="body1" paragraph>
                  Databricks costs can escalate rapidly without proper governance. Organizations typically see 30-60% cost 
                  reduction through systematic optimization while improving resource utilization and operational efficiency.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Chip label="30-60% Cost Reduction" color="success" />
                  <Chip label="Improved Performance" color="primary" />
                  <Chip label="Better Resource Utilization" color="warning" />
                  <Chip label="Enhanced Governance" color="info" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cost Reduction Strategies */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Six Key Cost Reduction Strategies
            </Typography>
          </Grid>

          {/* Strategy 1: Monitoring & Alerts */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MonitorIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    1. Granular Usage Monitoring
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Implement comprehensive tracking of compute usage, storage costs, and user activity patterns.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Real-time cost dashboards" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Automated spending alerts" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Usage pattern analysis" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategy 2: Auto-termination */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    2. Auto-termination Policies
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Automatically shut down idle clusters to prevent unnecessary compute charges.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="15-30 minute idle timeouts" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Scheduled cluster shutdown" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Weekend/holiday automation" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategy 3: Right-sizing */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <OptimizeIcon sx={{ mr: 2, color: '#2196F3' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    3. Cluster Right-sizing
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Match cluster configurations to actual workload requirements and usage patterns.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="CPU/Memory optimization" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Workload-specific sizing" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Auto-scaling configuration" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategy 4: Spot Instances */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 2, color: '#9C27B0' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    4. Spot Instance Utilization
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Leverage AWS/Azure spot instances for fault-tolerant workloads to achieve significant savings.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="50-90% cost reduction" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Batch processing optimization" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Fault-tolerance strategies" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategy 5: Resource Tagging */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TagIcon sx={{ mr: 2, color: '#795548' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    5. Resource Tagging & Chargeback
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Implement comprehensive tagging for cost allocation and department-level accountability.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Department cost allocation" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Project-based tracking" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Budget enforcement" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategy 6: Workload Optimization */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ConfigIcon sx={{ mr: 2, color: '#607D8B' }} />
                  <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                    6. Workload & Query Optimization
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Optimize Spark configurations, data formats, and query patterns for maximum efficiency.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Delta Lake optimization" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Query performance tuning" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon sx={{ color: '#4CAF50', fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary="Data partitioning strategies" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Implementation Recommendations */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TipsIcon sx={{ mr: 2, color: '#FFC107' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366', fontWeight: 600 }}>
                    Implementation Best Practices
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Strategy</TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Implementation Timeline</TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Expected Savings</TableCell>
                        <TableCell sx={{ fontWeight: 600, bgcolor: '#f5f5f5' }}>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Auto-termination Policies</TableCell>
                        <TableCell>1-2 weeks</TableCell>
                        <TableCell>20-40%</TableCell>
                        <TableCell><Chip label="High" color="error" size="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Usage Monitoring & Alerts</TableCell>
                        <TableCell>2-3 weeks</TableCell>
                        <TableCell>10-25%</TableCell>
                        <TableCell><Chip label="High" color="error" size="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cluster Right-sizing</TableCell>
                        <TableCell>3-4 weeks</TableCell>
                        <TableCell>15-30%</TableCell>
                        <TableCell><Chip label="Medium" color="warning" size="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Spot Instance Integration</TableCell>
                        <TableCell>4-6 weeks</TableCell>
                        <TableCell>30-60%</TableCell>
                        <TableCell><Chip label="Medium" color="warning" size="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Resource Tagging & Chargeback</TableCell>
                        <TableCell>2-4 weeks</TableCell>
                        <TableCell>Accountability</TableCell>
                        <TableCell><Chip label="Medium" color="warning" size="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Workload Optimization</TableCell>
                        <TableCell>6-8 weeks</TableCell>
                        <TableCell>20-40%</TableCell>
                        <TableCell><Chip label="Low" color="success" size="small" /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Items */}
          <Grid item xs={12}>
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="h6" component="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Immediate Action Items
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Week 1-2:</strong> Implement auto-termination policies and establish baseline monitoring<br/>
                <strong>Week 3-4:</strong> Deploy cost alerting and begin cluster right-sizing analysis<br/>
                <strong>Month 2:</strong> Pilot spot instance usage for non-critical workloads<br/>
                <strong>Month 3:</strong> Full resource tagging implementation and chargeback system
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Implementation Roadmap Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Implementation Roadmap & Timeline
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Project Timeline Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Track implementation progress across all governance initiatives with real-time updates and milestone tracking.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={fetchTimelineData}
                  disabled={loading}
                  sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
                >
                  {loading ? 'Loading...' : 'Refresh Timeline Data'}
                </Button>
              </Box>

              {loading && <LinearProgress sx={{ mb: 2 }} />}
              
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Phase</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Timeline</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timelineData.map((record) => (
                      <TableRow 
                        key={record._id} 
                        hover 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f9f9f9' },
                          '&:focus': { outline: '2px solid #003366', outlineOffset: -2 }
                        }}
                        onClick={() => handleRecordClick(record)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Edit ${record.taskName}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRecordClick(record);
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.taskName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.phase} 
                            size="small" 
                            variant="outlined"
                            sx={{ bgcolor: '#e3f2fd' }}
                          />
                        </TableCell>
                        <TableCell>{record.owner}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {formatDate(record.startDate)} - {formatDate(record.endDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.status} 
                            size="small"
                            color={getStatusColor(record.status) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={record.progress} 
                              sx={{ flexGrow: 1, mr: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 35, fontSize: '0.75rem' }}>
                              {record.progress}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.priority} 
                            size="small"
                            color={
                              record.priority === 'High' ? 'error' : 
                              record.priority === 'Medium' ? 'warning' : 'success'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecordClick(record);
                            }}
                            sx={{ color: '#003366' }}
                            aria-label={`Edit ${record.taskName}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {timelineData.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No timeline data available. Click "Refresh Timeline Data" to load records.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Edit Record Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCancel} 
        maxWidth="md" 
        fullWidth
        aria-labelledby="edit-record-dialog-title"
      >
        <DialogTitle id="edit-record-dialog-title">
          Edit Timeline Record
        </DialogTitle>
        <DialogContent>
          {editingRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Name"
                  value={editingRecord.taskName}
                  onChange={(e) => handleEditChange('taskName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phase"
                  value={editingRecord.phase}
                  onChange={(e) => handleEditChange('phase', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={editingRecord.owner}
                  onChange={(e) => handleEditChange('owner', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={editingRecord.startDate ? editingRecord.startDate.split('T')[0] : ''}
                  onChange={(e) => handleEditChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={editingRecord.endDate ? editingRecord.endDate.split('T')[0] : ''}
                  onChange={(e) => handleEditChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingRecord.status}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Planned">Planned</MenuItem>
                    <MenuItem value="Future">Future</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Progress (%)"
                  type="number"
                  value={editingRecord.progress}
                  onChange={(e) => handleEditChange('progress', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 100 }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editingRecord.priority}
                    label="Priority"
                    onChange={(e) => handleEditChange('priority', e.target.value)}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Budget ($)"
                  type="number"
                  value={editingRecord.budget || ''}
                  onChange={(e) => handleEditChange('budget', parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editingRecord.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Governance Dashboard Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Executive Governance Dashboard
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Governance Maturity Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time insights into data governance effectiveness and compliance status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label="Governance Score: 73%" color="success" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Compliance: 89%" color="primary" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Quality Score: 81%" color="warning" sx={{ mr: 1, mb: 1 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default DataGovernanceQuality;

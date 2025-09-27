import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
  Assessment as AuditIcon,
  Warning as RiskIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as PendingIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import complianceService, { ComplianceMetrics, PolicyDetail, ComplianceFramework } from '../services/complianceService';

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
      id={`compliance-tabpanel-${index}`}
      aria-labelledby={`compliance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ComplianceDetails: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null);
  const [policies, setPolicies] = useState<PolicyDetail[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      console.log('Loading compliance data...');
      
      // Load all compliance data
      const [metrics, policyData, frameworkData, auditData] = await Promise.all([
        complianceService.getComplianceMetrics(),
        complianceService.getPolicyDetails(),
        complianceService.getComplianceFrameworks(),
        complianceService.getAuditHistory()
      ]);

      console.log('Compliance data loaded:', { metrics, policyData, frameworkData, auditData });
      setComplianceMetrics(metrics);
      setPolicies(policyData);
      setFrameworks(frameworkData);
      setAuditHistory(auditData);
    } catch (error) {
      console.error('Error loading compliance data:', error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleBack = () => {
    navigate('/admin/data-strategy-operations-center');
  };

  const getComplianceColor = (percentage: number): string => {
    if (percentage < 60) return '#d32f2f'; // Critical
    if (percentage < 70) return '#f57c00'; // Poor
    if (percentage < 85) return '#fbc02d'; // Fair
    if (percentage < 95) return '#4caf50'; // Good
    return '#2e7d32'; // Excellent
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return <CheckIcon sx={{ color: '#4caf50' }} />;
      case 'non-compliant':
        return <CancelIcon sx={{ color: '#d32f2f' }} />;
      case 'pending-review':
      default:
        return <PendingIcon sx={{ color: '#f57c00' }} />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return '#4caf50';
      case 'non-compliant':
        return '#d32f2f';
      case 'pending-review':
      default:
        return '#f57c00';
    }
  };

  const getRiskColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
      default:
        return '#4caf50';
    }
  };

  // Access control
  if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You need admin or data steward privileges to access compliance details.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading compliance details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
          aria-label="Back to Data Strategy Operations Center"
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ color: '#003366', fontWeight: 'bold' }}>
            Compliance Status Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive compliance monitoring and policy management
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadComplianceData}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      {complianceMetrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SecurityIcon sx={{ mr: 1, color: '#003366' }} />
                  <Typography variant="h6">Overall Compliance</Typography>
                </Box>
                <Typography variant="h3" sx={{ 
                  color: getComplianceColor(complianceMetrics.overallComplianceScore), 
                  fontWeight: 'bold' 
                }}>
                  {complianceMetrics.overallComplianceScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {complianceMetrics.compliantPolicies} of {complianceMetrics.totalPolicies} policies compliant
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PolicyIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography variant="h6">Active Policies</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {complianceMetrics.totalPolicies}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {complianceMetrics.pendingReviewPolicies} pending review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RiskIcon sx={{ mr: 1, color: '#f57c00' }} />
                  <Typography variant="h6">Risk Assessment</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  {complianceMetrics.riskAssessment.totalRiskScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {complianceMetrics.riskAssessment.highRiskItems} high-risk items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AuditIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6">Recent Audits</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {complianceMetrics.recentAudits.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Compliance Alerts */}
      {complianceMetrics && (complianceMetrics.upcomingDeadlines.length > 0 || complianceMetrics.nonCompliantPolicies > 0) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {complianceMetrics.nonCompliantPolicies > 0 && (
            <Grid item xs={12} md={6}>
              <Alert severity="error" sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>Non-Compliant Policies</Typography>
                <Typography variant="body2">
                  {complianceMetrics.nonCompliantPolicies} policies require immediate attention
                </Typography>
              </Alert>
            </Grid>
          )}
          {complianceMetrics.upcomingDeadlines.length > 0 && (
            <Grid item xs={12} md={6}>
              <Alert severity="warning" sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
                <Typography variant="body2">
                  {complianceMetrics.upcomingDeadlines.length} policies need review within 30 days
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {complianceMetrics.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                    <Chip 
                      key={index}
                      label={`${deadline.policyName} (${deadline.daysRemaining} days)`}
                      size="small"
                      sx={{ mr: 1, mb: 1, backgroundColor: '#ff9800', color: 'white' }}
                    />
                  ))}
                </Box>
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Detailed Breakdown Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="compliance tabs">
            <Tab label="Policy Overview" />
            <Tab label="Compliance Frameworks" />
            <Tab label="Audit History" />
            <Tab label="Risk Analysis" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {/* Policy Overview */}
          <Typography variant="h6" gutterBottom>Policy Compliance Status</Typography>
          {policies.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Compliance Status</TableCell>
                    <TableCell>Last Review</TableCell>
                    <TableCell>Next Review</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>Affected Domains</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {policy.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {policy.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{policy.category}</TableCell>
                      <TableCell>
                        <Chip 
                          label={policy.status}
                          size="small"
                          color={policy.status === 'active' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(policy.complianceStatus)}
                          <Chip 
                            label={policy.complianceStatus}
                            size="small"
                            sx={{ 
                              ml: 1,
                              backgroundColor: getStatusColor(policy.complianceStatus),
                              color: 'white'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {policy.lastReviewDate ? 
                          new Date(policy.lastReviewDate).toLocaleDateString() : 
                          'Never'
                        }
                      </TableCell>
                      <TableCell>
                        {policy.nextReviewDate ? 
                          new Date(policy.nextReviewDate).toLocaleDateString() : 
                          'Not scheduled'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={policy.riskLevel}
                          size="small"
                          sx={{ 
                            backgroundColor: getRiskColor(policy.riskLevel),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {policy.affectedDomains.map((domain, index) => (
                            <Chip 
                              key={index}
                              label={domain}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No policy data available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Compliance Frameworks */}
          <Typography variant="h6" gutterBottom>Compliance Framework Status</Typography>
          {frameworks.length > 0 ? (
            <Grid container spacing={3}>
              {frameworks.map((framework) => (
                <Grid item xs={12} md={6} key={framework.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{framework.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {framework.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ 
                          color: getComplianceColor(framework.overallScore), 
                          fontWeight: 'bold',
                          mr: 2
                        }}>
                          {framework.overallScore}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={framework.overallScore} 
                          sx={{ 
                            flexGrow: 1,
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getComplianceColor(framework.overallScore)
                            }
                          }}
                        />
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Requirements:</strong> {framework.requirements.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Last Audit:</strong> {new Date(framework.lastAuditDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Next Audit:</strong> {new Date(framework.nextAuditDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No framework data available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Audit History */}
          <Typography variant="h6" gutterBottom>Recent Audit History</Typography>
          {auditHistory.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Audit ID</TableCell>
                    <TableCell>Framework</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Auditor</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Findings</TableCell>
                    <TableCell>Next Audit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditHistory.slice(0, 10).map((audit) => (
                    <TableRow key={audit.auditId}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {audit.auditId}
                        </Typography>
                      </TableCell>
                      <TableCell>{audit.framework}</TableCell>
                      <TableCell>{new Date(audit.auditDate).toLocaleDateString()}</TableCell>
                      <TableCell>{audit.auditor}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          color: getComplianceColor(audit.score),
                          fontWeight: 'bold'
                        }}>
                          {audit.score}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={audit.status}
                          size="small"
                          color={audit.status === 'Passed' ? 'success' : 
                                 audit.status === 'Conditional' ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{audit.findings}</TableCell>
                      <TableCell>{new Date(audit.nextAuditDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No audit history available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* Risk Analysis */}
          <Typography variant="h6" gutterBottom>Risk Assessment & Analysis</Typography>
          {complianceMetrics && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Risk Distribution</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">High Risk Items</Typography>
                      <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                        {complianceMetrics.riskAssessment.highRiskItems}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Medium Risk Items</Typography>
                      <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                        {complianceMetrics.riskAssessment.mediumRiskItems}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Low Risk Items</Typography>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {complianceMetrics.riskAssessment.lowRiskItems}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Compliance by Framework</Typography>
                    {complianceMetrics.complianceByFramework.map((framework, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{framework.framework}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {framework.score}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={framework.score} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getComplianceColor(framework.score)
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Card>
    </Container>
  );
};

export default ComplianceDetails;

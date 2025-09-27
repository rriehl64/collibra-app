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
  Avatar,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Group as TeamIcon,
  Person as PersonIcon,
  Business as BranchIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import teamUtilizationService, { TeamUtilizationMetrics, TeamMemberDetail } from '../services/teamUtilizationService';

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
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TeamUtilizationDetails: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [teamMetrics, setTeamMetrics] = useState<TeamUtilizationMetrics | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetail[]>([]);
  const [capacityForecast, setCapacityForecast] = useState<any>(null);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      // Load all team utilization data
      const [metrics, members, forecast] = await Promise.all([
        teamUtilizationService.getTeamUtilizationMetrics(),
        teamUtilizationService.getTeamMemberDetails(),
        teamUtilizationService.getCapacityForecast()
      ]);

      setTeamMetrics(metrics);
      setTeamMembers(members);
      setCapacityForecast(forecast);
    } catch (error) {
      console.error('Error loading team data:', error);
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

  const getUtilizationColor = (utilization: number): string => {
    if (utilization < 40) return '#d32f2f'; // Under-utilized
    if (utilization < 60) return '#f57c00'; // Below target
    if (utilization < 80) return '#4caf50'; // Optimal
    if (utilization < 95) return '#1976d2'; // High
    return '#9c27b0'; // Over-utilized
  };

  const getUtilizationLabel = (utilization: number): string => {
    if (utilization < 40) return 'Under-utilized';
    if (utilization < 60) return 'Below Target';
    if (utilization < 80) return 'Optimal';
    if (utilization < 95) return 'High';
    return 'Over-utilized';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over-utilized':
        return <WarningIcon sx={{ color: '#9c27b0' }} />;
      case 'under-utilized':
        return <TrendingUpIcon sx={{ color: '#d32f2f' }} />;
      default:
        return <PersonIcon sx={{ color: '#4caf50' }} />;
    }
  };

  // Access control
  if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You need admin or data steward privileges to access team utilization details.
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
          Loading team utilization details...
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
            Team Utilization Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of team capacity and workload distribution
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadTeamData}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      {teamMetrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TeamIcon sx={{ mr: 1, color: '#003366' }} />
                  <Typography variant="h6">Overall Utilization</Typography>
                </Box>
                <Typography variant="h3" sx={{ 
                  color: getUtilizationColor(teamMetrics.overallUtilization), 
                  fontWeight: 'bold' 
                }}>
                  {teamMetrics.overallUtilization}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getUtilizationLabel(teamMetrics.overallUtilization)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography variant="h6">Team Members</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {teamMetrics.totalTeamMembers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teamMetrics.activeMembers} actively assigned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6">Capacity</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {teamMetrics.totalAvailableHours}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teamMetrics.totalAllocatedHours}h allocated
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: '#f57c00' }} />
                  <Typography variant="h6">Avg Capacity</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  {teamMetrics.averageCapacity}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per team member
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Utilization Alerts */}
      {teamMetrics && (teamMetrics.topUtilizedMembers.length > 0 || teamMetrics.underUtilizedMembers.length > 0) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {teamMetrics.topUtilizedMembers.length > 0 && (
            <Grid item xs={12} md={6}>
              <Alert severity="warning" sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>Over-Utilized Team Members</Typography>
                <Typography variant="body2">
                  {teamMetrics.topUtilizedMembers.length} team members are at risk of burnout (≥95% utilization)
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {teamMetrics.topUtilizedMembers.slice(0, 3).map((member, index) => (
                    <Chip 
                      key={index}
                      label={`${member.name} (${member.utilization}%)`}
                      size="small"
                      sx={{ mr: 1, mb: 1, backgroundColor: '#9c27b0', color: 'white' }}
                    />
                  ))}
                </Box>
              </Alert>
            </Grid>
          )}
          {teamMetrics.underUtilizedMembers.length > 0 && (
            <Grid item xs={12} md={6}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>Available Capacity</Typography>
                <Typography variant="body2">
                  {teamMetrics.underUtilizedMembers.length} team members have available capacity (≤40% utilization)
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {teamMetrics.underUtilizedMembers.slice(0, 3).map((member, index) => (
                    <Chip 
                      key={index}
                      label={`${member.name} (${member.utilization}%)`}
                      size="small"
                      sx={{ mr: 1, mb: 1, backgroundColor: '#2196f3', color: 'white' }}
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
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="team utilization tabs">
            <Tab label="All Team Members" />
            <Tab label="By Branch" />
            <Tab label="By Role" />
            <Tab label="Capacity Forecast" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {/* All Team Members */}
          <Typography variant="h6" gutterBottom>Team Member Utilization</Typography>
          {teamMembers.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Utilization</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Available Hours</TableCell>
                    <TableCell>Current Assignments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: getUtilizationColor(member.utilization) }}>
                            {member.name.firstName.charAt(0)}{member.name.lastName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {member.name.firstName} {member.name.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.branch}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min(member.utilization, 100)} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getUtilizationColor(member.utilization)
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 'bold' }}>
                            {member.utilization}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(member.status)}
                          <Chip 
                            label={getUtilizationLabel(member.utilization)}
                            size="small"
                            sx={{ 
                              ml: 1,
                              backgroundColor: getUtilizationColor(member.utilization),
                              color: 'white'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{member.capacity.availableHours}h</TableCell>
                      <TableCell>
                        <Box>
                          {member.currentAssignments.length > 0 ? (
                            member.currentAssignments.map((assignment, index) => (
                              <Chip 
                                key={index}
                                label={`${assignment.priorityName} (${assignment.hoursAllocated}h)`}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No active assignments
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No team member data available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* By Branch */}
          <Typography variant="h6" gutterBottom>Utilization by Branch</Typography>
          {teamMetrics?.utilizationByBranch && teamMetrics.utilizationByBranch.length > 0 ? (
            <Grid container spacing={3}>
              {teamMetrics.utilizationByBranch.map((branch, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BranchIcon sx={{ mr: 1, color: '#003366' }} />
                        <Typography variant="h6">{branch.branch}</Typography>
                      </Box>
                      <Typography variant="h4" sx={{ 
                        color: getUtilizationColor(branch.utilization), 
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {branch.utilization}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={branch.utilization} 
                        sx={{ 
                          mb: 2,
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getUtilizationColor(branch.utilization)
                          }
                        }}
                      />
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{branch.memberCount}</strong> team members
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{branch.allocatedHours}h</strong> allocated of <strong>{branch.availableHours}h</strong> available
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No branch utilization data available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* By Role */}
          <Typography variant="h6" gutterBottom>Utilization by Role</Typography>
          {teamMetrics?.utilizationByRole && teamMetrics.utilizationByRole.length > 0 ? (
            <Grid container spacing={3}>
              {teamMetrics.utilizationByRole.map((role, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: '#003366' }} />
                        <Typography variant="h6">{role.role}</Typography>
                      </Box>
                      <Typography variant="h4" sx={{ 
                        color: getUtilizationColor(role.utilization), 
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {role.utilization}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={role.utilization} 
                        sx={{ 
                          mb: 2,
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getUtilizationColor(role.utilization)
                          }
                        }}
                      />
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{role.memberCount}</strong> team members
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{role.allocatedHours}h</strong> allocated of <strong>{role.availableHours}h</strong> available
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No role utilization data available.</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* Capacity Forecast */}
          <Typography variant="h6" gutterBottom>Capacity Forecast & Recommendations</Typography>
          {capacityForecast ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Current Capacity Overview</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Capacity</Typography>
                      <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        {capacityForecast.totalCapacity}h
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Currently Utilized</Typography>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {capacityForecast.totalUtilized}h
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Available Capacity</Typography>
                      <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                        {capacityForecast.availableCapacity}h
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Over-utilized:</strong> {capacityForecast.overUtilizedCount} members
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Under-utilized:</strong> {capacityForecast.underUtilizedCount} members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Recommendations</Typography>
                    {capacityForecast.recommendations && capacityForecast.recommendations.length > 0 ? (
                      capacityForecast.recommendations.map((rec: any, index: number) => (
                        <Alert 
                          key={index}
                          severity={rec.type === 'warning' ? 'warning' : rec.type === 'alert' ? 'error' : 'info'}
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="subtitle2" gutterBottom>{rec.title}</Typography>
                          <Typography variant="body2">{rec.message}</Typography>
                        </Alert>
                      ))
                    ) : (
                      <Alert severity="success">
                        <Typography variant="body2">
                          Team utilization is within optimal range. No immediate action required.
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">Capacity forecast data not available.</Alert>
          )}
        </TabPanel>
      </Card>
    </Container>
  );
};

export default TeamUtilizationDetails;

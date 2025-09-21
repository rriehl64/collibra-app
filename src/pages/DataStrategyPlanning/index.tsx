import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Autocomplete
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import dataStrategyPlanningService from '../../services/dataStrategyPlanningService';
import PriorityIntakeForm from '../../components/DataStrategyPlanning/PriorityIntakeForm';

// Import types from service
import type { 
  DataStrategyPriority as ServiceDataStrategyPriority,
  DataStrategyEpic as ServiceDataStrategyEpic,
  TeamCapacityData as ServiceTeamCapacityData,
  DashboardAnalytics as ServiceDashboardAnalytics
} from '../../services/dataStrategyPlanningService';

// Use service types directly
type DataStrategyPriority = ServiceDataStrategyPriority;
type DataStrategyEpic = ServiceDataStrategyEpic;
type TeamCapacityData = ServiceTeamCapacityData;
type DashboardAnalytics = ServiceDashboardAnalytics;

const DataStrategyPlanning: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priorities, setPriorities] = useState<DataStrategyPriority[]>([]);
  const [teamCapacity, setTeamCapacity] = useState<TeamCapacityData | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [epics, setEpics] = useState<DataStrategyEpic[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [priorityDialog, setPriorityDialog] = useState({ open: false, priority: null as DataStrategyPriority | null, mode: 'view' as 'view' | 'edit' | 'create' });
  const [epicDialog, setEpicDialog] = useState({ open: false, epic: null as DataStrategyEpic | null, mode: 'view' as 'view' | 'edit' | 'create' });
  const [teamMemberDialog, setTeamMemberDialog] = useState({ open: false, member: null as any, mode: 'view' as 'view' | 'edit' | 'create' });
  const [teamMemberForm, setTeamMemberForm] = useState({
    fullName: '',
    email: '',
    role: 'Data Analyst',
    branch: 'Data Management',
    currentUtilization: 0,
    availableCapacity: 100,
    skills: [] as string[]
  });
  const [filters, setFilters] = useState({
    status: '',
    strategicGoal: '',
    urgency: ''
  });
  const [teamFilters, setTeamFilters] = useState({
    branch: '',
    role: '',
    utilizationLevel: '',
    skills: [] as string[]
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prioritiesData, teamData, analyticsData, epicsData] = await Promise.all([
        dataStrategyPlanningService.getPriorities(),
        dataStrategyPlanningService.getTeamCapacity(),
        dataStrategyPlanningService.getDashboardAnalytics(),
        dataStrategyPlanningService.getEpics()
      ]);

      setPriorities(prioritiesData);
      setTeamCapacity(teamData);
      setAnalytics(analyticsData);
      setEpics(epicsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePriorityAction = (priority: DataStrategyPriority | null, mode: 'view' | 'edit' | 'create') => {
    setPriorityDialog({ open: true, priority, mode });
  };

  const handleEpicAction = (epic: DataStrategyEpic | null, mode: 'view' | 'edit' | 'create') => {
    setEpicDialog({ open: true, epic, mode });
  };

  const handleEditTeamMember = (member: any) => {
    setTeamMemberDialog({ open: true, member, mode: 'edit' });
    setTeamMemberForm({
      fullName: member.name || '', // Backend returns 'name' field (which is fullName virtual)
      email: member.email || '',
      role: member.role || '',
      branch: member.branch || '',
      currentUtilization: member.currentUtilization || 0,
      availableCapacity: member.availableCapacity || 100,
      skills: member.skills?.map((s: any) => s.skillName) || []
    });
  };

  const handleSaveTeamMember = async () => {
    try {
      const updateData = {
        name: {
          firstName: teamMemberForm.fullName.split(' ')[0] || '',
          lastName: teamMemberForm.fullName.split(' ').slice(1).join(' ') || ''
        },
        email: teamMemberForm.email,
        role: teamMemberForm.role,
        title: teamMemberForm.role, // Use role as title if not provided
        branch: teamMemberForm.branch,
        division: 'USCIS', // Default division
        skills: teamMemberForm.skills.map(skillName => ({
          skillName,
          proficiency: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
          certified: false
        })),
        capacity: {
          fteAllocation: 1,
          hoursPerWeek: 40,
          availableHours: 32
        },
        startDate: new Date()
      };
      
      if (teamMemberDialog.member?._id) {
        await dataStrategyPlanningService.updateTeamMember(teamMemberDialog.member._id, updateData);
      }
      
      setTeamMemberDialog({ open: false, member: null, mode: 'view' });
      showSnackbar('Team member saved successfully', 'success');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error saving team member:', error);
      showSnackbar('Error saving team member', 'error');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  // Filter team members based on selected filters
  const getFilteredTeamMembers = () => {
    if (!teamCapacity?.teamMembers) return [];
    
    return teamCapacity.teamMembers.filter(member => {
      // Branch filter
      if (teamFilters.branch && member.branch !== teamFilters.branch) return false;
      
      // Role filter
      if (teamFilters.role && member.role !== teamFilters.role) return false;
      
      // Utilization level filter
      if (teamFilters.utilizationLevel) {
        const utilization = member.currentUtilization;
        switch (teamFilters.utilizationLevel) {
          case 'Low (0-40%)':
            if (utilization > 40) return false;
            break;
          case 'Medium (41-70%)':
            if (utilization <= 40 || utilization > 70) return false;
            break;
          case 'High (71-100%)':
            if (utilization <= 70) return false;
            break;
        }
      }
      
      // Skills filter
      if (teamFilters.skills.length > 0) {
        const memberSkills = member.skills.map((s: any) => s.skillName);
        const hasMatchingSkill = teamFilters.skills.some(skill => memberSkills.includes(skill));
        if (!hasMatchingSkill) return false;
      }
      
      return true;
    });
  };

  const getGroupingStats = () => {
    const filteredMembers = getFilteredTeamMembers();
    
    const byBranch = filteredMembers.reduce((acc: any, member) => {
      acc[member.branch] = (acc[member.branch] || 0) + 1;
      return acc;
    }, {});
    
    const byRole = filteredMembers.reduce((acc: any, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {});
    
    const byUtilization = filteredMembers.reduce((acc: any, member) => {
      const utilization = member.currentUtilization;
      let level = 'Low (0-40%)';
      if (utilization > 40 && utilization <= 70) level = 'Medium (41-70%)';
      else if (utilization > 70) level = 'High (71-100%)';
      
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return { byBranch, byRole, byUtilization };
  };

  const renderDashboard = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="#003366">Total Priorities</Typography>
              <Typography variant="h4">{priorities.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="#003366">Team Members</Typography>
              <Typography variant="h4">{analytics?.team.totalMembers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="#003366">Team Utilization</Typography>
              <Typography variant="h4">{analytics?.team.utilizationPercentage || 0}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="#003366">Available Capacity</Typography>
              <Typography variant="h4" color="#28a745">{analytics?.team.availableCapacity || 0}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPriorities = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" color="#003366">
          Strategic Priorities ({priorities.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handlePriorityAction(null, 'create')}
          sx={{ 
            backgroundColor: '#003366',
            '&:hover': { backgroundColor: '#002244' }
          }}
        >
          Add Priority
        </Button>
      </Box>

      <Grid container spacing={3}>
        {priorities.map((priority) => (
          <Grid item xs={12} md={6} lg={4} key={priority._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                '&:focus-within': { outline: '2px solid #003366', outlineOffset: '2px' }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Edit priority ${priority.priorityName}`}
              onClick={() => handlePriorityAction(priority, 'edit')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePriorityAction(priority, 'edit');
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="#003366">
                  {priority.priorityName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {priority.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={priority.urgency} 
                    color={getUrgencyColor(priority.urgency)}
                    size="small"
                  />
                  <Chip 
                    label={priority.status} 
                    color={getStatusColor(priority.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  LOE: {priority.loeEstimate.size} ({priority.loeEstimate.hours}h)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTeamCapacity = () => {
    const filteredMembers = getFilteredTeamMembers();
    const groupingStats = getGroupingStats();
    const branches = Array.from(new Set(teamCapacity?.teamMembers.map(m => m.branch) || []));
    const roles = Array.from(new Set(teamCapacity?.teamMembers.map(m => m.role) || []));
    const allSkills = Array.from(new Set(teamCapacity?.teamMembers.flatMap(m => m.skills.map((s: any) => s.skillName)) || []));
    
    return (
      <Box>
        {teamCapacity && (
          <>
            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="#003366">
                Team Filters & Groupings
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Branch</InputLabel>
                    <Select
                      value={teamFilters.branch}
                      onChange={(e) => setTeamFilters(prev => ({ ...prev, branch: e.target.value }))}
                      label="Branch"
                    >
                      <MenuItem value="">All Branches</MenuItem>
                      {branches.map(branch => (
                        <MenuItem key={branch} value={branch}>
                          {branch} ({groupingStats.byBranch[branch] || 0})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={teamFilters.role}
                      onChange={(e) => setTeamFilters(prev => ({ ...prev, role: e.target.value }))}
                      label="Role"
                    >
                      <MenuItem value="">All Roles</MenuItem>
                      {roles.map(role => (
                        <MenuItem key={role} value={role}>
                          {role} ({groupingStats.byRole[role] || 0})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Utilization Level</InputLabel>
                    <Select
                      value={teamFilters.utilizationLevel}
                      onChange={(e) => setTeamFilters(prev => ({ ...prev, utilizationLevel: e.target.value }))}
                      label="Utilization Level"
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      <MenuItem value="Low (0-40%)">Low (0-40%) ({groupingStats.byUtilization['Low (0-40%)'] || 0})</MenuItem>
                      <MenuItem value="Medium (41-70%)">Medium (41-70%) ({groupingStats.byUtilization['Medium (41-70%)'] || 0})</MenuItem>
                      <MenuItem value="High (71-100%)">High (71-100%) ({groupingStats.byUtilization['High (71-100%)'] || 0})</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    multiple
                    options={allSkills}
                    value={teamFilters.skills}
                    onChange={(_, value) => setTeamFilters(prev => ({ ...prev, skills: value }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Skills" size="small" />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                  />
                </Grid>
              </Grid>

              {/* Clear Filters Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setTeamFilters({ branch: '', role: '', utilizationLevel: '', skills: [] })}
                  sx={{ color: '#003366', borderColor: '#003366' }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>

            {/* Team Members */}
            <Grid container spacing={3}>
              {filteredMembers.map((member) => (
                <Grid item xs={12} md={6} lg={4} key={member._id}>
                  <Card 
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        boxShadow: 3, 
                        backgroundColor: '#f8f9fa' 
                      },
                      '&:focus-within': { 
                        outline: '2px solid #003366', 
                        outlineOffset: '2px' 
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit team member ${member.fullName}`}
                    onClick={() => handleEditTeamMember(member)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEditTeamMember(member);
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="#003366">
                        {member.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {member.role} - {member.branch}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Utilization: {member.currentUtilization}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={member.currentUtilization}
                          sx={{ height: 8, borderRadius: 4 }}
                          color={member.currentUtilization > 80 ? 'warning' : 'primary'}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {member.skills.slice(0, 3).map((skill: any, index: number) => (
                          <Chip 
                            key={index}
                            label={skill.skillName}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {member.skills.length > 3 && (
                          <Chip 
                            label={`+${member.skills.length - 3} more`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    );
  };

  const renderEpics = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" color="#003366">
          Epics & Stories ({epics.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleEpicAction(null, 'create')}
          sx={{ 
            backgroundColor: '#003366',
            '&:hover': { backgroundColor: '#002244' }
          }}
        >
          Add Epic
        </Button>
      </Box>

      <Grid container spacing={3}>
        {epics.map((epic) => (
          <Grid item xs={12} md={6} lg={4} key={epic._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                '&:focus-within': { outline: '2px solid #003366', outlineOffset: '2px' }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Edit epic ${epic.title}`}
              onClick={() => handleEpicAction(epic, 'edit')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEpicAction(epic, 'edit');
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="#003366">
                  {epic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {epic.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={epic.status} 
                    color={getStatusColor(epic.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {epic.stories?.length || 0} stories
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Access control
  if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You need admin or data steward privileges to access this page.
        </Typography>
      </Box>
    );
  }

  // Main component JSX
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 600 }}>
          <TimelineIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Data Strategy Planning
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        aria-label="Data strategy planning tabs"
      >
        <Tab label="Dashboard" />
        <Tab label={`Priorities (${priorities.length})`} />
        <Tab label={`Team Capacity (${teamCapacity?.totalTeamSize || 0})`} />
        <Tab label={`Epics (${epics.length})`} />
      </Tabs>

      {tabValue === 0 && renderDashboard()}
      {tabValue === 1 && renderPriorities()}
      {tabValue === 2 && renderTeamCapacity()}
      {tabValue === 3 && renderEpics()}

      {/* Priority Dialog */}
      <PriorityIntakeForm
        open={priorityDialog.open}
        onClose={() => setPriorityDialog({ open: false, priority: null, mode: 'view' })}
        priority={priorityDialog.priority}
        mode={priorityDialog.mode}
        onSave={(priority) => {
          // Handle save logic here
          setPriorityDialog({ open: false, priority: null, mode: 'view' });
          loadData();
        }}
      />

      {/* Epic Dialog */}
      <Dialog 
        open={epicDialog.open} 
        onClose={() => setEpicDialog({ open: false, epic: null, mode: 'view' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {epicDialog.mode === 'create' ? 'Add New Epic' : 
           epicDialog.mode === 'edit' ? 'Edit Epic' : 'View Epic'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Epic Title"
                defaultValue={epicDialog.epic?.title || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                defaultValue={epicDialog.epic?.description || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={epicDialog.epic?.status || 'Planning'}
                  label="Status"
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  defaultValue={epicDialog.epic?.priority || 'Medium'}
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEpicDialog({ open: false, epic: null, mode: 'view' })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Handle save logic here
              setEpicDialog({ open: false, epic: null, mode: 'view' });
              showSnackbar('Epic saved successfully', 'success');
            }}
            sx={{ backgroundColor: '#003366', '&:hover': { backgroundColor: '#002244' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Member Dialog */}
      <Dialog 
        open={teamMemberDialog.open} 
        onClose={() => setTeamMemberDialog({ open: false, member: null, mode: 'view' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {teamMemberDialog.mode === 'create' ? 'Add Team Member' : 
           teamMemberDialog.mode === 'edit' ? 'Edit Team Member' : 'View Team Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={teamMemberForm.fullName}
                onChange={(e) => setTeamMemberForm(prev => ({ ...prev, fullName: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={teamMemberForm.email}
                onChange={(e) => setTeamMemberForm(prev => ({ ...prev, email: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={teamMemberForm.role}
                  onChange={(e) => setTeamMemberForm(prev => ({ ...prev, role: e.target.value }))}
                  label="Role"
                >
                  <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                  <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                  <MenuItem value="Data Engineer">Data Engineer</MenuItem>
                  <MenuItem value="Data Steward">Data Steward</MenuItem>
                  <MenuItem value="Business Analyst">Business Analyst</MenuItem>
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={teamMemberForm.branch}
                  onChange={(e) => setTeamMemberForm(prev => ({ ...prev, branch: e.target.value }))}
                  label="Branch"
                >
                  <MenuItem value="Front Office">Front Office</MenuItem>
                  <MenuItem value="Data Management">Data Management</MenuItem>
                  <MenuItem value="Data Analytics">Data Analytics</MenuItem>
                  <MenuItem value="Data Engineering">Data Engineering</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                  <MenuItem value="Business Intelligence">Business Intelligence</MenuItem>
                  <MenuItem value="Data Governance">Data Governance</MenuItem>
                  <MenuItem value="Product & Design">Product & Design</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Utilization (%)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={teamMemberForm.currentUtilization}
                onChange={(e) => setTeamMemberForm(prev => ({ ...prev, currentUtilization: parseInt(e.target.value) || 0 }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Available Capacity (%)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={teamMemberForm.availableCapacity}
                onChange={(e) => setTeamMemberForm(prev => ({ ...prev, availableCapacity: parseInt(e.target.value) || 100 }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={['Python', 'SQL', 'R', 'JavaScript', 'Java', 'Tableau', 'Power BI', 'Excel', 'Machine Learning', 'Data Visualization', 'ETL', 'Cloud Platforms', 'Kafka', 'ETL/ELT']}
                value={teamMemberForm.skills}
                onChange={(event, newValue) => setTeamMemberForm(prev => ({ ...prev, skills: newValue }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder="Select skills"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamMemberDialog({ open: false, member: null, mode: 'view' })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTeamMember}
            sx={{ backgroundColor: '#003366', '&:hover': { backgroundColor: '#002244' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataStrategyPlanning;

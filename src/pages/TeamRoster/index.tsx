import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Paper,
  Divider,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  Search,
  FilterList,
  Person,
  Email,
  Phone,
  Close,
  Edit,
  Visibility,
  Add,
  Delete,
  Archive,
  Restore,
  Code,
  Storage,
  Analytics,
  Computer,
  Language,
  Psychology,
  Business,
  CloudQueue,
  DataObject,
  Functions
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import dataStrategyPlanningService from '../../services/dataStrategyPlanningService';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  currentUtilization: number;
  availableCapacity: number;
  isActive: boolean;
  endDate?: string;
  skills: Array<{
    skillName: string;
    proficiency: string;
    certified: boolean;
  }>;
  capacity?: {
    fteAllocation: number;
    hoursPerWeek: number;
    availableHours: number;
  };
  assignments?: Array<{
    priorityId?: string;
    priorityName: string;
    allocation: number;
    startDate: string;
    endDate: string;
    hoursAllocated: number;
  }>;
}

const TeamRoster: React.FC = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    branch: '',
    skills: [] as string[],
    currentAssignments: [] as Array<{
      priorityId: string;
      priorityName: string;
      allocation: number;
      startDate?: string;
      endDate?: string;
    }>
  });
  const [newMemberForm, setNewMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personalPhone: '',
    role: '',
    branch: '',
    skills: [] as Array<{
      skillName: string;
      proficiency: string;
      certified: boolean;
    }>
  });

  const branches = [
    'Front Office',
    'Data Management', 
    'Data Analytics',
    'Data Engineering',
    'Data Science',
    'Business Intelligence',
    'Data Governance',
    'Product & Design'
  ];

  const roles = [
    'Data Scientist',
    'Data Engineer', 
    'Data Analyst',
    'Business Analyst',
    'Technical Lead',
    'Solution Architect',
    'Product Manager',
    'Program Manager',
    'Data Steward'
  ];

  useEffect(() => {
    loadTeamData();
  }, [statusFilter]);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchTerm, branchFilter, roleFilter]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      // Use the new team management API
      const response = await fetch(`http://localhost:3002/api/v1/team-management/members?status=${statusFilter}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load team data');
      }
      
      // Map the API response to match our interface
      const mappedMembers = (result.data || []).map((member: any) => ({
        ...member,
        name: typeof member.name === 'string' 
          ? member.name 
          : `${member.name?.firstName || ''} ${member.name?.lastName || ''}`.trim(),
        isActive: member.isActive !== false, // Default to true if not specified
        currentUtilization: member.currentUtilization || 0,
        availableCapacity: member.availableCapacity || 100
      }));
      
      setTeamMembers(mappedMembers);
      
      // Also update filtered members to ensure immediate UI refresh
      setFilteredMembers(mappedMembers);
    } catch (error) {
      console.error('Load team data error:', error);
      setSaveStatus('❌ Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (branchFilter) {
      filtered = filtered.filter(member => member.branch === branchFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredMembers(filtered);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return '#f44336'; // Red
    if (utilization >= 70) return '#ff9800'; // Orange
    if (utilization >= 50) return '#2196f3'; // Blue
    return '#4caf50'; // Green
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return '#1b5e20';      // Dark green - 4.5:1 contrast with white
      case 'Advanced': return '#0d47a1';    // Dark blue - 4.5:1 contrast with white
      case 'Intermediate': return '#e65100'; // Dark orange - 4.5:1 contrast with white
      case 'Beginner': return '#424242';    // Dark gray - 4.5:1 contrast with white
      default: return '#424242';
    }
  };

  const getSkillIcon = (skillName: string) => {
    const skill = skillName.toLowerCase();
    if (skill.includes('python') || skill.includes('r') || skill.includes('javascript')) return <Code />;
    if (skill.includes('sql') || skill.includes('database') || skill.includes('mongodb')) return <Storage />;
    if (skill.includes('analytics') || skill.includes('tableau') || skill.includes('power bi')) return <Analytics />;
    if (skill.includes('machine learning') || skill.includes('ai') || skill.includes('data science')) return <Psychology />;
    if (skill.includes('cloud') || skill.includes('aws') || skill.includes('azure')) return <CloudQueue />;
    if (skill.includes('etl') || skill.includes('data') || skill.includes('modeling')) return <DataObject />;
    if (skill.includes('excel') || skill.includes('office')) return <Functions />;
    if (skill.includes('business') || skill.includes('analysis')) return <Business />;
    return <Computer />; // Default icon
  };

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setDetailsDialog(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      branch: member.branch,
      skills: member.skills?.map(s => s.skillName) || [],
      currentAssignments: member.assignments?.map(a => ({
        priorityId: (a.priorityId as any)?._id || a.priorityId || '',
        priorityName: a.priorityName || '',
        allocation: a.allocation || 0,
        startDate: a.startDate ? new Date(a.startDate).toISOString().split('T')[0] : '',
        endDate: a.endDate ? new Date(a.endDate).toISOString().split('T')[0] : ''
      })) || []
    });
    setDetailsDialog(false);
    setEditDialog(true);
  };

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
    setSaveStatus('');
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      branch: member.branch,
      skills: member.skills?.map(s => s.skillName) || [],
      currentAssignments: member.assignments?.map(a => ({
        priorityId: (a.priorityId as any)?._id || a.priorityId || '',
        priorityName: a.priorityName || '',
        allocation: a.allocation || 0,
        startDate: a.startDate ? new Date(a.startDate).toISOString().split('T')[0] : '',
        endDate: a.endDate ? new Date(a.endDate).toISOString().split('T')[0] : ''
      })) || []
    });
    setEditDialog(true);
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;
    
    try {
      setSaveStatus('Saving...');
      
      const totalUtilization = editForm.currentAssignments.reduce((sum, a) => sum + a.allocation, 0);
      
      const updateData = {
        name: {
          firstName: editForm.name.split(' ')[0] || '',
          lastName: editForm.name.split(' ').slice(1).join(' ') || ''
        },
        email: editForm.email,
        role: editForm.role,
        title: editForm.role,
        branch: editForm.branch,
        division: 'USCIS',
        skills: editForm.skills.map(skillName => ({
          skillName,
          proficiency: 'Intermediate' as const,
          certified: false
        })),
        currentAssignments: editForm.currentAssignments.map(a => ({
          priorityId: a.priorityId || undefined,
          priorityName: a.priorityName,
          allocation: Number(a.allocation) || 0,
          startDate: a.startDate || new Date().toISOString().split('T')[0],
          endDate: a.endDate || '',
          hoursAllocated: Math.round((Number(a.allocation) / 100) * 40)
        })),
        capacity: {
          fteAllocation: 1,
          hoursPerWeek: 40,
          availableHours: Math.max(0, 40 - Math.round((totalUtilization / 100) * 40))
        }
      };
      
      const response = await dataStrategyPlanningService.updateTeamMember(selectedMember._id, updateData as any);
      setSaveStatus(`✅ Saved! New utilization: ${totalUtilization}%`);
      
      await loadTeamData();
      
      setTimeout(() => {
        setEditDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('❌ Error saving changes');
    }
  };

  const handleAddNewMember = async () => {
    try {
      setSaveStatus('Adding new team member...');
      
      const response = await fetch('http://localhost:3002/api/v1/team-management/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMemberForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add team member');
      }
      
      setSaveStatus('✅ Team member added successfully!');
      
      // Reset form
      setNewMemberForm({
        firstName: '',
        lastName: '',
        email: '',
        personalPhone: '',
        role: '',
        branch: '',
        skills: []
      });
      
      // Reload team data
      await loadTeamData();
      
      setTimeout(() => {
        setAddMemberDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Add member error:', error);
      setSaveStatus('❌ Error adding team member');
    }
  };

  const handleArchiveMember = async (memberId: string) => {
    try {
      setSaveStatus('Archiving team member...');
      
      const response = await fetch(`http://localhost:3002/api/v1/team-management/members/${memberId}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Archived via Team Roster interface' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to archive team member');
      }
      
      setSaveStatus('✅ Team member archived successfully!');
      
      // Reload team data
      await loadTeamData();
      
      setTimeout(() => {
        setDetailsDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Archive member error:', error);
      setSaveStatus('❌ Error archiving team member');
    }
  };

  const handleReactivateMember = async (memberId: string) => {
    try {
      setSaveStatus('Reactivating team member...');
      
      const response = await fetch(`http://localhost:3002/api/v1/team-management/members/${memberId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to reactivate team member');
      }
      
      setSaveStatus('✅ Team member reactivated successfully!');
      
      // Reload team data
      await loadTeamData();
      
      setTimeout(() => {
        setDetailsDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Reactivate member error:', error);
      setSaveStatus('❌ Error reactivating team member');
    }
  };

  const handleBulkArchive = async () => {
    try {
      setSaveStatus('Archiving selected members...');
      
      const promises = selectedMembers.map(memberId =>
        fetch(`http://localhost:3002/api/v1/team-management/members/${memberId}/archive`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Bulk archive operation' }),
        })
      );
      
      await Promise.all(promises);
      setSaveStatus(`✅ Successfully archived ${selectedMembers.length} members!`);
      
      setSelectedMembers([]);
      await loadTeamData();
      
      setTimeout(() => {
        setBulkActionDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Bulk archive error:', error);
      setSaveStatus('❌ Error archiving members');
    }
  };

  const handleBulkReactivate = async () => {
    try {
      setSaveStatus('Reactivating selected members...');
      
      const promises = selectedMembers.map(memberId =>
        fetch(`http://localhost:3002/api/v1/team-management/members/${memberId}/reactivate`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      
      await Promise.all(promises);
      setSaveStatus(`✅ Successfully reactivated ${selectedMembers.length} members!`);
      
      setSelectedMembers([]);
      await loadTeamData();
      
      setTimeout(() => {
        setBulkActionDialog(false);
        setSaveStatus('');
      }, 1500);
      
    } catch (error) {
      console.error('Bulk reactivate error:', error);
      setSaveStatus('❌ Error reactivating members');
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    const allIds = filteredMembers.map(m => m._id);
    setSelectedMembers(allIds);
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setBranchFilter('');
    setRoleFilter('');
    setStatusFilter('active');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Team Roster</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#003366', fontWeight: 'bold', mb: 1 }}>
            Team Roster
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666' }}>
            Comprehensive view of all team members, their skills, and current capacity
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddMemberDialog(true)}
          sx={{
            backgroundColor: '#003366',
            '&:hover': { backgroundColor: '#002244' },
            borderRadius: 2,
            px: 3,
            py: 1.5
          }}
        >
          Add New Team Member
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Branch</InputLabel>
              <Select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                label="Branch"
              >
                <MenuItem value="">All Branches</MenuItem>
                {branches.map(branch => (
                  <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              startIcon={<FilterList />}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Team Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Members</Typography>
              <Typography variant="h4">{teamMembers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#4caf50' }}>Active</Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                {teamMembers.filter(m => m.isActive !== false).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ff9800' }}>Archived</Typography>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>
                {teamMembers.filter(m => m.isActive === false).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Available</Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                {teamMembers.filter(m => m.isActive !== false && m.currentUtilization < 80).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Overallocated</Typography>
              <Typography variant="h4" sx={{ color: '#f44336' }}>
                {teamMembers.filter(m => m.isActive !== false && m.currentUtilization >= 100).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Indicator & Bulk Actions */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#003366' }}>
            {statusFilter === 'active' && 'Active Team Members'}
            {statusFilter === 'archived' && 'Archived Team Members'}
            {statusFilter === 'all' && 'All Team Members'}
            {filteredMembers.length > 0 && ` (${filteredMembers.length})`}
          </Typography>
          
          {filteredMembers.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Select all visible members">
                <Checkbox
                  checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  indeterminate={selectedMembers.length > 0 && selectedMembers.length < filteredMembers.length}
                  onChange={(e) => e.target.checked ? selectAllMembers() : clearSelection()}
                />
              </Tooltip>
              {selectedMembers.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ color: '#003366' }}>
                    {selectedMembers.length} selected
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setBulkActionDialog(true)}
                    sx={{ ml: 1 }}
                  >
                    Bulk Actions
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
        
        {filteredMembers.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No members found matching current filters
          </Typography>
        )}
      </Box>

      {/* Team Members Grid */}
      <Grid container spacing={2}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member._id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                opacity: member.isActive === false ? 0.7 : 1,
                border: member.isActive === false ? '2px solid #ff9800' : 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                '&:focus': {
                  outline: '2px solid #003366',
                  outlineOffset: '2px'
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Click anywhere to edit ${member.name}${member.isActive === false ? ' (Archived)' : ''}`}
              onClick={() => handleCardClick(member)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Checkbox
                    checked={selectedMembers.includes(member._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleMemberSelection(member._id);
                    }}
                    sx={{ mr: 1 }}
                    size="small"
                  />
                  <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" noWrap>{member.name}</Typography>
                      {member.isActive === false && (
                        <Chip 
                          label="Archived" 
                          size="small" 
                          color="warning"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {member.role}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    tabIndex={-1}
                    aria-label="Click anywhere to edit team member"
                  >
                    <Edit />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Business sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {member.branch}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Email sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {member.email}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Utilization: {member.currentUtilization}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(member.currentUtilization, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getUtilizationColor(member.currentUtilization)
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>Skills:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {member.skills?.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.skillName}
                        size="small"
                        icon={getSkillIcon(skill.skillName)}
                        sx={{
                          backgroundColor: getProficiencyColor(skill.proficiency),
                          color: 'white',
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: 'white',
                            fontSize: '16px'
                          }
                        }}
                      />
                    ))}
                    {member.skills?.length > 3 && (
                      <Chip
                        label={`+${member.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMembers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No team members found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Member Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Team Member Details</Typography>
            <Box>
              {selectedMember?.isActive !== false && (
                <>
                  <IconButton 
                    onClick={() => selectedMember && handleEditMember(selectedMember)}
                    sx={{ mr: 1 }}
                    aria-label="Edit team member"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => selectedMember && handleArchiveMember(selectedMember._id)}
                    sx={{ mr: 1, color: 'orange' }}
                    aria-label="Archive team member"
                  >
                    <Archive />
                  </IconButton>
                </>
              )}
              {selectedMember?.isActive === false && (
                <IconButton 
                  onClick={() => selectedMember && handleReactivateMember(selectedMember._id)}
                  sx={{ mr: 1, color: 'green' }}
                  aria-label="Reactivate team member"
                >
                  <Restore />
                </IconButton>
              )}
              <IconButton onClick={() => setDetailsDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#003366', mr: 2, width: 56, height: 56 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{selectedMember.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedMember.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMember.branch}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedMember.email}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Capacity Overview</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Current Utilization: {selectedMember.currentUtilization}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(selectedMember.currentUtilization, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getUtilizationColor(selectedMember.currentUtilization)
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2">
                  Available Capacity: {selectedMember.availableCapacity}%
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Skills & Expertise</Typography>
                <Grid container spacing={1}>
                  {selectedMember.skills?.map((skill, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={`${skill.skillName} (${skill.proficiency})`}
                        sx={{
                          backgroundColor: getProficiencyColor(skill.proficiency),
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                        icon={getSkillIcon(skill.skillName)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {selectedMember.assignments && selectedMember.assignments.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Current Assignments</Typography>
                  {selectedMember.assignments.map((assignment, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {assignment.priorityName}
                      </Typography>
                      <Typography variant="body2">
                        Allocation: {assignment.allocation}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh', maxHeight: '90vh' }
        }}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" id="edit-dialog-title">Edit Team Member</Typography>
            <IconButton 
              onClick={() => setEditDialog(false)}
              aria-label="Close edit team member dialog"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflowY: 'auto', padding: 3 }}>
          <Typography id="edit-dialog-description" sx={{ mb: 2, sr: 'only' }}>
            Edit team member information including name, email, role, branch, skills, and current assignments to modify utilization percentage.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  backgroundColor: '#e3f2fd', 
                  border: '2px solid #1976d2', 
                  borderRadius: 2, 
                  p: 2, 
                  mb: 2 
                }}
                role="region"
                aria-labelledby="utilization-section-title"
              >
                <Typography 
                  id="utilization-section-title"
                  variant="h6" 
                  color="primary" 
                  gutterBottom
                >
                  Edit Utilization Here
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Current Utilization Percentage"
                      value={editForm.currentAssignments.reduce((sum, a) => sum + a.allocation, 0)}
                      InputProps={{ 
                        readOnly: true,
                        'aria-label': 'Current utilization percentage, read only, calculated automatically from assignments below',
                        style: { backgroundColor: '#f5f5f5', cursor: 'not-allowed' }
                      }}
                      size="small"
                      helperText="Calculated automatically from assignments below"
                      aria-describedby="current-util-help"
                    />
                    <Typography 
                      id="current-util-help" 
                      variant="caption" 
                      sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                    >
                      This field is read-only and updates automatically
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Available Capacity Percentage"
                      value={100 - editForm.currentAssignments.reduce((sum, a) => sum + a.allocation, 0)}
                      InputProps={{ 
                        readOnly: true,
                        'aria-label': 'Available capacity percentage, read only, remaining capacity calculated as 100 percent minus utilization',
                        style: { backgroundColor: '#f5f5f5', cursor: 'not-allowed' }
                      }}
                      size="small"
                      helperText="Remaining capacity (100% - utilization)"
                      aria-describedby="available-cap-help"
                    />
                    <Typography 
                      id="available-cap-help" 
                      variant="caption" 
                      sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                    >
                      This field is read-only and updates automatically
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add assignments below to set utilization to 38%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editForm.role || ''}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  label="Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={editForm.branch || ''}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  label="Branch"
                >
                  {branches.map(branch => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Skills</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {editForm.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => {
                      const newSkills = editForm.skills.filter((_, i) => i !== index);
                      setEditForm({ ...editForm, skills: newSkills });
                    }}
                    sx={{
                      backgroundColor: '#003366', // USCIS primary blue
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#002244'
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                        '&:hover': {
                          color: '#ffcccc'
                        }
                      }
                    }}
                    aria-label={`Remove ${skill} skill`}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add Skill (press Enter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    const skill = target.value.trim();
                    if (skill && !editForm.skills.includes(skill)) {
                      setEditForm({ ...editForm, skills: [...editForm.skills, skill] });
                      target.value = '';
                    }
                  }
                }}
                placeholder="e.g., Python, SQL, Machine Learning"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Current Assignments
              </Typography>
              {editForm.currentAssignments.length === 0 && (
                <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
                  ⚠️ No assignments found. Click "Add Assignment" below to set utilization to 38%.
                </Typography>
              )}
              {editForm.currentAssignments.map((assignment, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Priority Name"
                        value={assignment.priorityName}
                        onChange={(e) => {
                          const newAssignments = [...editForm.currentAssignments];
                          newAssignments[index].priorityName = e.target.value;
                          setEditForm({ ...editForm, currentAssignments: newAssignments });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Allocation %"
                        type="number"
                        value={assignment.allocation}
                        onChange={(e) => {
                          const newAssignments = [...editForm.currentAssignments];
                          newAssignments[index].allocation = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setEditForm({ ...editForm, currentAssignments: newAssignments });
                        }}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={assignment.startDate}
                        onChange={(e) => {
                          const newAssignments = [...editForm.currentAssignments];
                          newAssignments[index].startDate = e.target.value;
                          setEditForm({ ...editForm, currentAssignments: newAssignments });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={assignment.endDate}
                        onChange={(e) => {
                          const newAssignments = [...editForm.currentAssignments];
                          newAssignments[index].endDate = e.target.value;
                          setEditForm({ ...editForm, currentAssignments: newAssignments });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        onClick={() => {
                          const newAssignments = editForm.currentAssignments.filter((_, i) => i !== index);
                          setEditForm({ ...editForm, currentAssignments: newAssignments });
                        }}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => {
                  const newAssignment = {
                    priorityId: '',
                    priorityName: '',
                    allocation: 0,
                    startDate: '',
                    endDate: ''
                  };
                  setEditForm({ 
                    ...editForm, 
                    currentAssignments: [...editForm.currentAssignments, newAssignment] 
                  });
                }}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Assignment
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Total Utilization: {editForm.currentAssignments.reduce((sum, a) => sum + a.allocation, 0)}%
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {saveStatus && (
            <Typography variant="body2" sx={{ mr: 2, color: saveStatus.includes('✅') ? 'green' : saveStatus.includes('❌') ? 'red' : 'blue' }}>
              {saveStatus}
            </Typography>
          )}
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMember} variant="contained" color="primary" disabled={saveStatus === 'Saving...'}>
            {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Team Member Dialog */}
      <Dialog
        open={addMemberDialog}
        onClose={() => setAddMemberDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Add New Team Member</Typography>
            <IconButton onClick={() => setAddMemberDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newMemberForm.firstName}
                onChange={(e) => setNewMemberForm({...newMemberForm, firstName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newMemberForm.lastName}
                onChange={(e) => setNewMemberForm({...newMemberForm, lastName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newMemberForm.email}
                onChange={(e) => setNewMemberForm({...newMemberForm, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Personal Phone"
                value={newMemberForm.personalPhone}
                onChange={(e) => setNewMemberForm({...newMemberForm, personalPhone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role/Title"
                value={newMemberForm.role}
                onChange={(e) => setNewMemberForm({...newMemberForm, role: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={newMemberForm.branch}
                  onChange={(e) => setNewMemberForm({...newMemberForm, branch: e.target.value})}
                  label="Branch"
                >
                  {branches.map(branch => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {saveStatus && (
            <Typography variant="body2" sx={{ mr: 2, color: saveStatus.includes('✅') ? 'green' : saveStatus.includes('❌') ? 'red' : 'blue' }}>
              {saveStatus}
            </Typography>
          )}
          <Button onClick={() => setAddMemberDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddNewMember} 
            variant="contained" 
            color="primary"
            disabled={!newMemberForm.firstName || !newMemberForm.lastName || !newMemberForm.email || !newMemberForm.role || !newMemberForm.branch || saveStatus === 'Adding new team member...'}
          >
            {saveStatus === 'Adding new team member...' ? 'Adding...' : 'Add Team Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog
        open={bulkActionDialog}
        onClose={() => setBulkActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Bulk Actions</Typography>
            <IconButton onClick={() => setBulkActionDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You have selected {selectedMembers.length} team member{selectedMembers.length !== 1 ? 's' : ''}. 
            Choose an action to apply to all selected members:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {statusFilter !== 'archived' && (
              <Button
                variant="outlined"
                startIcon={<Archive />}
                onClick={handleBulkArchive}
                disabled={saveStatus.includes('...') || selectedMembers.length === 0}
                sx={{ justifyContent: 'flex-start', color: '#ff9800', borderColor: '#ff9800' }}
              >
                Archive Selected Members
              </Button>
            )}
            
            {statusFilter !== 'active' && (
              <Button
                variant="outlined"
                startIcon={<Restore />}
                onClick={handleBulkReactivate}
                disabled={saveStatus.includes('...') || selectedMembers.length === 0}
                sx={{ justifyContent: 'flex-start', color: '#4caf50', borderColor: '#4caf50' }}
              >
                Reactivate Selected Members
              </Button>
            )}
          </Box>
          
          {saveStatus && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                p: 1, 
                borderRadius: 1, 
                backgroundColor: saveStatus.includes('✅') ? '#e8f5e8' : saveStatus.includes('❌') ? '#ffeaea' : '#e3f2fd',
                color: saveStatus.includes('✅') ? 'green' : saveStatus.includes('❌') ? 'red' : 'blue' 
              }}
            >
              {saveStatus}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamRoster;

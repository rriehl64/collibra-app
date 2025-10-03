import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Slider,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface TeamMemberEditFormProps {
  member: any;
  onSave: (memberData: any) => void;
  onClose: () => void;
}

const TeamMemberEditForm: React.FC<TeamMemberEditFormProps> = ({ member, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: {
      firstName: '',
      lastName: ''
    },
    email: '',
    role: '',
    title: '',
    branch: '',
    division: '',
    skills: [] as any[],
    capacity: {
      fteAllocation: 1,
      hoursPerWeek: 40,
      availableHours: 32
    },
    currentAssignments: [] as any[],
    isActive: true
  });

  const [newSkill, setNewSkill] = useState({
    skillName: '',
    proficiency: 'Intermediate',
    certified: false
  });

  const [newAssignment, setNewAssignment] = useState({
    priorityName: '',
    allocation: 0,
    startDate: '',
    endDate: '',
    hoursAllocated: 0
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
    'Data Engineer',
    'Data Analyst', 
    'Data Scientist',
    'Business Analyst',
    'Data Steward',
    'Solution Architect',
    'Product Manager',
    'Technical Lead'
  ];

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const commonSkills = [
    'Python', 'SQL', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL',
    'Tableau', 'Power BI', 'Apache Spark', 'Kafka', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Machine Learning', 'Data Modeling', 'ETL/ELT',
    'API Development', 'Data Visualization'
  ];

  useEffect(() => {
    if (member) {
      setFormData({
        name: {
          firstName: member.name?.firstName || '',
          lastName: member.name?.lastName || ''
        },
        email: member.email || '',
        role: member.role || '',
        title: member.title || '',
        branch: member.branch || '',
        division: member.division || '',
        skills: member.skills || [],
        capacity: {
          fteAllocation: member.capacity?.fteAllocation || 1,
          hoursPerWeek: member.capacity?.hoursPerWeek || 40,
          availableHours: member.capacity?.availableHours || 32
        },
        currentAssignments: (member.currentAssignments || []).map((assignment: any) => ({
          ...assignment,
          startDate: assignment.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : '',
          endDate: assignment.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : ''
        })),
        isActive: member.isActive !== undefined ? member.isActive : true
      });
    }
  }, [member]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as any;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.skillName.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill }]
      }));
      setNewSkill({
        skillName: '',
        proficiency: 'Intermediate',
        certified: false
      });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddAssignment = () => {
    if (newAssignment.priorityName.trim()) {
      setFormData(prev => ({
        ...prev,
        currentAssignments: [...prev.currentAssignments, { ...newAssignment }]
      }));
      setNewAssignment({
        priorityName: '',
        allocation: 0,
        startDate: '',
        endDate: '',
        hoursAllocated: 0
      });
    }
  };

  const handleRemoveAssignment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      currentAssignments: prev.currentAssignments.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Basic Information
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.name.firstName}
            onChange={(e) => handleInputChange('name.firstName', e.target.value)}
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.name.lastName}
            onChange={(e) => handleInputChange('name.lastName', e.target.value)}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select
              value={formData.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
              label="Branch"
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch}>{branch}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Division"
            value={formData.division}
            onChange={(e) => handleInputChange('division', e.target.value)}
          />
        </Grid>

        {/* Capacity Management */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="#003366">
            Capacity Management
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography gutterBottom>FTE Allocation</Typography>
          <Slider
            value={formData.capacity.fteAllocation}
            onChange={(_, value) => handleInputChange('capacity.fteAllocation', value)}
            min={0.1}
            max={1}
            step={0.1}
            marks={[
              { value: 0.5, label: '50%' },
              { value: 1, label: '100%' }
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </Grid>
        
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Hours Per Week"
            type="number"
            value={formData.capacity.hoursPerWeek}
            onChange={(e) => handleInputChange('capacity.hoursPerWeek', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 40 }}
          />
        </Grid>
        
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Available Hours"
            type="number"
            value={formData.capacity.availableHours}
            onChange={(e) => handleInputChange('capacity.availableHours', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 40 }}
          />
        </Grid>

        {/* Skills Management */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="#003366">
            Skills Management
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Current Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.skillName} (${skill.proficiency})`}
                  onDelete={() => handleRemoveSkill(index)}
                  color={skill.certified ? 'primary' : 'default'}
                  variant={skill.certified ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>Add New Skill</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Autocomplete
                  options={commonSkills}
                  freeSolo
                  value={newSkill.skillName}
                  onChange={(_, value) => setNewSkill(prev => ({ ...prev, skillName: value || '' }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Skill Name" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proficiency</InputLabel>
                  <Select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                    label="Proficiency"
                  >
                    {proficiencyLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Certified</InputLabel>
                  <Select
                    value={newSkill.certified ? 'true' : 'false'}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, certified: e.target.value === 'true' }))}
                    label="Certified"
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{ backgroundColor: '#003366' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Current Assignments */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="#003366">
            Current Assignments
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Active Assignments</Typography>
            <List>
              {formData.currentAssignments.map((assignment, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={assignment.priorityName}
                    secondary={`${assignment.allocation}% allocation • ${assignment.hoursAllocated} hours`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleRemoveAssignment(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Add New Assignment</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Priority Name"
                  value={newAssignment.priorityName}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, priorityName: e.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Allocation %"
                  type="number"
                  value={newAssignment.allocation}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, allocation: parseInt(e.target.value) }))}
                  inputProps={{ min: 0, max: 100 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Hours"
                  type="number"
                  value={newAssignment.hoursAllocated}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, hoursAllocated: parseInt(e.target.value) }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newAssignment.startDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newAssignment.endDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  onClick={handleAddAssignment}
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{ backgroundColor: '#003366' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ color: '#003366', borderColor: '#003366' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ backgroundColor: '#003366' }}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamMemberEditForm;

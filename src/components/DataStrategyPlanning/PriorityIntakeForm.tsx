import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Autocomplete,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
// Note: DatePicker components would require @mui/x-date-pickers package
// For now, using standard date input
import dataStrategyPlanningService, { DataStrategyPriority } from '../../services/dataStrategyPlanningService';

interface PriorityIntakeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (priority: DataStrategyPriority) => void;
  priority?: DataStrategyPriority | null;
  mode: 'create' | 'edit' | 'view';
}

const steps = ['Basic Information', 'Effort Estimation', 'Team & Resources', 'Review & Submit'];

const strategicGoals = [
  'Data Management',
  'Data Engineering', 
  'Data Science',
  'Streamline Case Processing',
  'Product & Design',
  'Data Governance',
  'NPD (Reference Data)',
  'Business Intelligence',
  'Analytics'
];

const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
const complexityLevels = ['Low', 'Medium', 'High'];
const valueLevels = ['Low', 'Medium', 'High'];
const sizeLevels = ['XS', 'S', 'M', 'L', 'XL'];

const commonSkills = [
  'SQL', 'Python', 'R', 'JavaScript', 'TypeScript', 'ETL', 'Data Modeling',
  'Business Analysis', 'Project Management', 'Agile/Scrum', 'Data Visualization',
  'Machine Learning', 'Statistics', 'Database Administration', 'Cloud Platforms',
  'API Development', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Tableau',
  'Power BI', 'Databricks', 'Spark', 'Kafka', 'Docker', 'Kubernetes'
];

const PriorityIntakeForm: React.FC<PriorityIntakeFormProps> = ({
  open,
  onClose,
  onSave,
  priority,
  mode
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<DataStrategyPriority>>({
    priorityName: '',
    description: '',
    strategicGoal: '',
    owner: '',
    branch: '',
    dueDate: '',
    urgency: 'Medium',
    loeEstimate: {
      hours: 0,
      size: 'M'
    },
    requiredSkills: [],
    complexity: 'Medium',
    riskFactors: [],
    estimatedValue: 'Medium',
    businessValue: '',
    deliverables: [],
    dependencies: [],
    stakeholders: [],
    assignedTeam: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for team resources form inputs
  const [newSkill, setNewSkill] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newDependency, setNewDependency] = useState('');
  const [newStakeholder, setNewStakeholder] = useState('');
  const [newRiskFactor, setNewRiskFactor] = useState('');

  useEffect(() => {
    if (priority && mode !== 'create') {
      setFormData(priority);
    } else {
      // Reset form for create mode
      setFormData({
        priorityName: '',
        description: '',
        strategicGoal: '',
        owner: '',
        branch: '',
        dueDate: '',
        urgency: 'Medium',
        loeEstimate: {
          hours: 0,
          size: 'M'
        },
        requiredSkills: [],
        complexity: 'Medium',
        riskFactors: [],
        estimatedValue: 'Medium',
        businessValue: '',
        deliverables: [],
        dependencies: [],
        stakeholders: [],
        assignedTeam: []
      });
    }
    setActiveStep(0);
    setErrors({});
  }, [priority, mode, open]);

  const handleInputChange = (field: keyof DataStrategyPriority, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const handleNestedInputChange = (parentField: keyof DataStrategyPriority, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [childField]: value
      }
    }));
  };

  const handleArrayAdd = (field: keyof DataStrategyPriority, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...((prev[field] as string[]) || []), value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: keyof DataStrategyPriority, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field] as string[]) || []).filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.priorityName?.trim()) {
          newErrors.priorityName = 'Priority name is required';
        }
        if (!formData.description?.trim()) {
          newErrors.description = 'Description is required';
        }
        if (!formData.strategicGoal) {
          newErrors.strategicGoal = 'Strategic goal is required';
        }
        if (!formData.owner?.trim()) {
          newErrors.owner = 'Owner is required';
        }
        if (!formData.branch?.trim()) {
          newErrors.branch = 'Branch is required';
        }
        if (!formData.dueDate) {
          newErrors.dueDate = 'Due date is required';
        }
        break;
      
      case 1: // Effort Estimation
        if (!formData.loeEstimate?.hours || formData.loeEstimate.hours <= 0) {
          newErrors.loeHours = 'LOE hours must be greater than 0';
        }
        if (!formData.businessValue?.trim()) {
          newErrors.businessValue = 'Business value is required';
        }
        break;
      
      case 2: // Team & Resources
        if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
          newErrors.requiredSkills = 'At least one required skill must be specified';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        let savedPriority;
        if (mode === 'create') {
          savedPriority = await dataStrategyPlanningService.createPriority(formData);
        } else {
          savedPriority = await dataStrategyPlanningService.updatePriority(priority!._id, formData);
        }
        onSave(savedPriority);
        onClose();
      } catch (error) {
        console.error('Error saving priority:', error);
      }
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Priority Name"
          value={formData.priorityName || ''}
          onChange={(e) => handleInputChange('priorityName', e.target.value)}
          error={!!errors.priorityName}
          helperText={errors.priorityName}
          required
          disabled={mode === 'view'}
          inputProps={{ 'aria-label': 'Priority name' }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description || 'Provide a detailed description of the priority'}
          required
          disabled={mode === 'view'}
          inputProps={{ 'aria-label': 'Priority description' }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.strategicGoal} required>
          <InputLabel>Strategic Goal</InputLabel>
          <Select
            value={formData.strategicGoal || ''}
            label="Strategic Goal"
            onChange={(e) => handleInputChange('strategicGoal', e.target.value)}
            disabled={mode === 'view'}
            aria-label="Strategic goal"
          >
            {strategicGoals.map(goal => (
              <MenuItem key={goal} value={goal}>{goal}</MenuItem>
            ))}
          </Select>
          {errors.strategicGoal && <FormHelperText>{errors.strategicGoal}</FormHelperText>}
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Urgency</InputLabel>
          <Select
            value={formData.urgency || 'Medium'}
            label="Urgency"
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            disabled={mode === 'view'}
            aria-label="Priority urgency"
          >
            {urgencyLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Owner"
          value={formData.owner || ''}
          onChange={(e) => handleInputChange('owner', e.target.value)}
          error={!!errors.owner}
          helperText={errors.owner}
          required
          disabled={mode === 'view'}
          inputProps={{ 'aria-label': 'Priority owner' }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Branch"
          value={formData.branch || ''}
          onChange={(e) => handleInputChange('branch', e.target.value)}
          error={!!errors.branch}
          helperText={errors.branch}
          required
          disabled={mode === 'view'}
          inputProps={{ 'aria-label': 'Branch or division' }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Due Date"
          value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
          onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
          error={!!errors.dueDate}
          helperText={errors.dueDate}
          required
          disabled={mode === 'view'}
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'aria-label': 'Due date' }}
        />
      </Grid>
    </Grid>
  );

  const renderEffortEstimation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Estimated Hours"
          value={formData.loeEstimate?.hours || 0}
          onChange={(e) => handleNestedInputChange('loeEstimate', 'hours', parseInt(e.target.value) || 0)}
          error={!!errors.loeHours}
          helperText={errors.loeHours || 'Estimated level of effort in hours'}
          required
          disabled={mode === 'view'}
          inputProps={{ min: 0, 'aria-label': 'Estimated hours' }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Size</InputLabel>
          <Select
            value={formData.loeEstimate?.size || 'M'}
            label="Size"
            onChange={(e) => handleNestedInputChange('loeEstimate', 'size', e.target.value)}
            disabled={mode === 'view'}
            aria-label="Effort size"
          >
            {sizeLevels.map(size => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
          <FormHelperText>XS: 1-8h, S: 8-40h, M: 40-80h, L: 80-160h, XL: 160h+</FormHelperText>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Complexity</InputLabel>
          <Select
            value={formData.complexity || 'Medium'}
            label="Complexity"
            onChange={(e) => handleInputChange('complexity', e.target.value)}
            disabled={mode === 'view'}
            aria-label="Project complexity"
          >
            {complexityLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Estimated Value</InputLabel>
          <Select
            value={formData.estimatedValue || 'Medium'}
            label="Estimated Value"
            onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
            disabled={mode === 'view'}
            aria-label="Estimated business value"
          >
            {valueLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Business Value"
          value={formData.businessValue || ''}
          onChange={(e) => handleInputChange('businessValue', e.target.value)}
          error={!!errors.businessValue}
          helperText={errors.businessValue || 'Describe the business value and impact'}
          required
          disabled={mode === 'view'}
          inputProps={{ 'aria-label': 'Business value description' }}
        />
      </Grid>
    </Grid>
  );

  const renderTeamResources = () => {

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Required Skills
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={commonSkills}
            value={formData.requiredSkills || []}
            onChange={(_, newValue) => handleInputChange('requiredSkills', newValue)}
            disabled={mode === 'view'}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Required Skills"
                placeholder="Type or select skills"
                error={!!errors.requiredSkills}
                helperText={errors.requiredSkills || 'Add skills required for this priority'}
                inputProps={{ ...params.inputProps, 'aria-label': 'Required skills' }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Deliverables
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Add Deliverable"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              disabled={mode === 'view'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleArrayAdd('deliverables', newDeliverable);
                  setNewDeliverable('');
                }
              }}
              inputProps={{ 'aria-label': 'New deliverable' }}
            />
            {mode !== 'view' && (
              <IconButton
                onClick={() => {
                  handleArrayAdd('deliverables', newDeliverable);
                  setNewDeliverable('');
                }}
                disabled={!newDeliverable.trim()}
                aria-label="Add deliverable"
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formData.deliverables || []).map((deliverable, index) => (
              <Chip
                key={index}
                label={deliverable}
                onDelete={mode !== 'view' ? () => handleArrayRemove('deliverables', index) : undefined}
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Dependencies
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Add Dependency"
              value={newDependency}
              onChange={(e) => setNewDependency(e.target.value)}
              disabled={mode === 'view'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleArrayAdd('dependencies', newDependency);
                  setNewDependency('');
                }
              }}
              inputProps={{ 'aria-label': 'New dependency' }}
            />
            {mode !== 'view' && (
              <IconButton
                onClick={() => {
                  handleArrayAdd('dependencies', newDependency);
                  setNewDependency('');
                }}
                disabled={!newDependency.trim()}
                aria-label="Add dependency"
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formData.dependencies || []).map((dependency, index) => (
              <Chip
                key={index}
                label={dependency}
                onDelete={mode !== 'view' ? () => handleArrayRemove('dependencies', index) : undefined}
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Stakeholders
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Add Stakeholder"
              value={newStakeholder}
              onChange={(e) => setNewStakeholder(e.target.value)}
              disabled={mode === 'view'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleArrayAdd('stakeholders', newStakeholder);
                  setNewStakeholder('');
                }
              }}
              inputProps={{ 'aria-label': 'New stakeholder' }}
            />
            {mode !== 'view' && (
              <IconButton
                onClick={() => {
                  handleArrayAdd('stakeholders', newStakeholder);
                  setNewStakeholder('');
                }}
                disabled={!newStakeholder.trim()}
                aria-label="Add stakeholder"
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formData.stakeholders || []).map((stakeholder, index) => (
              <Chip
                key={index}
                label={stakeholder}
                onDelete={mode !== 'view' ? () => handleArrayRemove('stakeholders', index) : undefined}
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Risk Factors
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Add Risk Factor"
              value={newRiskFactor}
              onChange={(e) => setNewRiskFactor(e.target.value)}
              disabled={mode === 'view'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleArrayAdd('riskFactors', newRiskFactor);
                  setNewRiskFactor('');
                }
              }}
              inputProps={{ 'aria-label': 'New risk factor' }}
            />
            {mode !== 'view' && (
              <IconButton
                onClick={() => {
                  handleArrayAdd('riskFactors', newRiskFactor);
                  setNewRiskFactor('');
                }}
                disabled={!newRiskFactor.trim()}
                aria-label="Add risk factor"
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formData.riskFactors || []).map((risk, index) => (
              <Chip
                key={index}
                label={risk}
                onDelete={mode !== 'view' ? () => handleArrayRemove('riskFactors', index) : undefined}
                variant="outlined"
                color="warning"
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderReview = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="#003366">
        Priority Summary
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">Priority Name</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{formData.priorityName}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">Strategic Goal</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{formData.strategicGoal}</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">Description</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{formData.description}</Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">Owner</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{formData.owner}</Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">Due Date</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">Urgency</Typography>
          <Chip label={formData.urgency} color="primary" size="small" />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">Estimated Effort</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {formData.loeEstimate?.hours}h ({formData.loeEstimate?.size})
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">Complexity</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{formData.complexity}</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">Required Skills</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {(formData.requiredSkills || []).map((skill, index) => (
              <Chip key={index} label={skill} variant="outlined" size="small" />
            ))}
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">Business Value</Typography>
          <Typography variant="body1">{formData.businessValue}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderEffortEstimation();
      case 2:
        return renderTeamResources();
      case 3:
        return renderReview();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="priority-intake-dialog-title"
    >
      <DialogTitle id="priority-intake-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === 'create' && 'Create New Priority'}
          {mode === 'edit' && 'Edit Priority'}
          {mode === 'view' && 'View Priority Details'}
          <Tooltip title="Priority intake helps capture all necessary information for proper planning and resource allocation">
            <IconButton size="small" aria-label="Priority intake information">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {mode !== 'view' && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        
        {getStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          startIcon={<CancelIcon />}
          aria-label="Cancel and close dialog"
        >
          Cancel
        </Button>
        
        {mode !== 'view' && activeStep > 0 && (
          <Button 
            onClick={handleBack}
            aria-label="Go to previous step"
          >
            Back
          </Button>
        )}
        
        {mode !== 'view' && activeStep < steps.length - 1 && (
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ backgroundColor: '#003366' }}
            aria-label="Go to next step"
          >
            Next
          </Button>
        )}
        
        {mode !== 'view' && activeStep === steps.length - 1 && (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: '#003366' }}
            aria-label="Save priority"
          >
            {mode === 'create' ? 'Create Priority' : 'Update Priority'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PriorityIntakeForm;

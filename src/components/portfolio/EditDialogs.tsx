import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
// Using regular date inputs instead of MUI X date pickers to avoid dependency issues
import { KPI, OKR, Risk, Innovation, Project, Milestone, KeyResult } from '../../services/portfolioService';

// KPI Edit Dialog
interface KPIEditDialogProps {
  open: boolean;
  kpis: KPI[];
  onClose: () => void;
  onSave: (kpis: KPI[]) => void;
}

export const KPIEditDialog: React.FC<KPIEditDialogProps> = ({ open, kpis, onClose, onSave }) => {
  const [editedKPIs, setEditedKPIs] = useState<KPI[]>(kpis);

  useEffect(() => {
    setEditedKPIs(kpis);
  }, [kpis]);

  const handleKPIChange = (index: number, field: keyof KPI, value: any) => {
    const updated = [...editedKPIs];
    updated[index] = { ...updated[index], [field]: value };
    setEditedKPIs(updated);
  };

  const addKPI = () => {
    setEditedKPIs([...editedKPIs, {
      name: '',
      current: 0,
      target: 0,
      unit: '',
      trend: 'stable',
      status: 'good'
    }]);
  };

  const removeKPI = (index: number) => {
    setEditedKPIs(editedKPIs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedKPIs);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="kpi-edit-title">
      <DialogTitle id="kpi-edit-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit KPIs</Typography>
          <Button startIcon={<AddIcon />} onClick={addKPI} variant="outlined" size="small">
            Add KPI
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {editedKPIs.map((kpi, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">KPI {index + 1}</Typography>
              <IconButton onClick={() => removeKPI(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="KPI Name"
                  value={kpi.name}
                  onChange={(e) => handleKPIChange(index, 'name', e.target.value)}
                  autoFocus={index === 0}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={kpi.unit}
                  onChange={(e) => handleKPIChange(index, 'unit', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Current Value"
                  type="number"
                  value={kpi.current}
                  onChange={(e) => handleKPIChange(index, 'current', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Target Value"
                  type="number"
                  value={kpi.target}
                  onChange={(e) => handleKPIChange(index, 'target', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Trend</InputLabel>
                  <Select
                    value={kpi.trend}
                    onChange={(e) => handleKPIChange(index, 'trend', e.target.value)}
                  >
                    <MenuItem value="up">Up</MenuItem>
                    <MenuItem value="down">Down</MenuItem>
                    <MenuItem value="stable">Stable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={kpi.status}
                    onChange={(e) => handleKPIChange(index, 'status', e.target.value)}
                  >
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// OKR Edit Dialog
interface OKREditDialogProps {
  open: boolean;
  okr?: OKR;
  onClose: () => void;
  onSave: (okr: OKR) => void;
}

export const OKREditDialog: React.FC<OKREditDialogProps> = ({ open, okr, onClose, onSave }) => {
  const [editedOKR, setEditedOKR] = useState<OKR>({
    objective: '',
    keyResults: []
  });

  useEffect(() => {
    if (okr) {
      setEditedOKR(okr);
    } else {
      setEditedOKR({
        objective: '',
        keyResults: []
      });
    }
  }, [okr, open]);

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: any) => {
    const updated = { ...editedOKR };
    updated.keyResults[index] = { ...updated.keyResults[index], [field]: value };
    setEditedOKR(updated);
  };

  const addKeyResult = () => {
    setEditedOKR({
      ...editedOKR,
      keyResults: [...editedOKR.keyResults, {
        description: '',
        current: 0,
        target: 0,
        unit: ''
      }]
    });
  };

  const removeKeyResult = (index: number) => {
    setEditedOKR({
      ...editedOKR,
      keyResults: editedOKR.keyResults.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    // Validate that objective is not empty
    if (!editedOKR.objective.trim()) {
      alert('Objective is required');
      return;
    }
    
    // Validate that all key results have descriptions
    for (const kr of editedOKR.keyResults) {
      if (!kr.description.trim()) {
        alert('All key results must have descriptions');
        return;
      }
    }
    
    onSave(editedOKR);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="okr-edit-title">
      <DialogTitle id="okr-edit-title">Edit OKR</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Objective"
          multiline
          rows={3}
          value={editedOKR.objective}
          onChange={(e) => setEditedOKR({ ...editedOKR, objective: e.target.value })}
          sx={{ mb: 3 }}
          autoFocus
          required
          error={!editedOKR.objective.trim()}
          helperText={!editedOKR.objective.trim() ? 'Objective is required' : ''}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Key Results</Typography>
          <Button startIcon={<AddIcon />} onClick={addKeyResult} variant="outlined" size="small">
            Add Key Result
          </Button>
        </Box>

        {editedOKR.keyResults.map((kr, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">Key Result {index + 1}</Typography>
              <IconButton onClick={() => removeKeyResult(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={kr.description}
                  onChange={(e) => handleKeyResultChange(index, 'description', e.target.value)}
                  autoFocus={index === 0}
                  required
                  error={!kr.description.trim()}
                  helperText={!kr.description.trim() ? 'Description is required' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Current"
                  type="number"
                  value={kr.current}
                  onChange={(e) => handleKeyResultChange(index, 'current', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Target"
                  type="number"
                  value={kr.target}
                  onChange={(e) => handleKeyResultChange(index, 'target', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={kr.unit}
                  onChange={(e) => handleKeyResultChange(index, 'unit', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Risk Edit Dialog
interface RiskEditDialogProps {
  open: boolean;
  risks: Risk[];
  onClose: () => void;
  onSave: (risks: Risk[]) => void;
}

export const RiskEditDialog: React.FC<RiskEditDialogProps> = ({ open, risks, onClose, onSave }) => {
  const [editedRisks, setEditedRisks] = useState<Risk[]>(risks);

  useEffect(() => {
    setEditedRisks(risks);
  }, [risks]);

  const handleRiskChange = (index: number, field: keyof Risk, value: any) => {
    const updated = [...editedRisks];
    updated[index] = { ...updated[index], [field]: value };
    setEditedRisks(updated);
  };

  const addRisk = () => {
    const newId = `risk-${Date.now()}`;
    setEditedRisks([...editedRisks, {
      id: newId,
      title: '',
      level: 'Medium',
      category: 'Technical',
      mitigation: '',
      owner: ''
    }]);
  };

  const removeRisk = (index: number) => {
    setEditedRisks(editedRisks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedRisks);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="risk-edit-title">
      <DialogTitle id="risk-edit-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit Risks</Typography>
          <Button startIcon={<AddIcon />} onClick={addRisk} variant="outlined" size="small">
            Add Risk
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {editedRisks.map((risk, index) => (
          <Box key={risk.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">{risk.title || `Risk ${index + 1}`}</Typography>
              <IconButton onClick={() => removeRisk(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Risk Title"
                  value={risk.title}
                  onChange={(e) => handleRiskChange(index, 'title', e.target.value)}
                  autoFocus={index === 0}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={risk.owner}
                  onChange={(e) => handleRiskChange(index, 'owner', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={risk.level}
                    onChange={(e) => handleRiskChange(index, 'level', e.target.value)}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={risk.category}
                    onChange={(e) => handleRiskChange(index, 'category', e.target.value)}
                  >
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Organizational">Organizational</MenuItem>
                    <MenuItem value="Compliance">Compliance</MenuItem>
                    <MenuItem value="Financial">Financial</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mitigation Strategy"
                  multiline
                  rows={2}
                  value={risk.mitigation}
                  onChange={(e) => handleRiskChange(index, 'mitigation', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Innovation Edit Dialog
interface InnovationEditDialogProps {
  open: boolean;
  innovations: Innovation[];
  onClose: () => void;
  onSave: (innovations: Innovation[]) => void;
}

export const InnovationEditDialog: React.FC<InnovationEditDialogProps> = ({ open, innovations, onClose, onSave }) => {
  const [editedInnovations, setEditedInnovations] = useState<Innovation[]>(innovations);

  useEffect(() => {
    setEditedInnovations(innovations);
  }, [innovations]);

  const handleInnovationChange = (index: number, field: keyof Innovation, value: any) => {
    const updated = [...editedInnovations];
    updated[index] = { ...updated[index], [field]: value };
    setEditedInnovations(updated);
  };

  const addInnovation = () => {
    const newId = `innovation-${Date.now()}`;
    setEditedInnovations([...editedInnovations, {
      id: newId,
      title: '',
      type: 'AI/ML',
      impact: 'Medium',
      aiFirst: false,
      description: ''
    }]);
  };

  const removeInnovation = (index: number) => {
    setEditedInnovations(editedInnovations.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedInnovations);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="innovation-edit-title">
      <DialogTitle id="innovation-edit-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit Innovations</Typography>
          <Button startIcon={<AddIcon />} onClick={addInnovation} variant="outlined" size="small">
            Add Innovation
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {editedInnovations.map((innovation, index) => (
          <Box key={innovation.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">{innovation.title || `Innovation ${index + 1}`}</Typography>
              <IconButton onClick={() => removeInnovation(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Innovation Title"
                  value={innovation.title}
                  onChange={(e) => handleInnovationChange(index, 'title', e.target.value)}
                  autoFocus={index === 0}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={innovation.type}
                    onChange={(e) => handleInnovationChange(index, 'type', e.target.value)}
                  >
                    <MenuItem value="AI/ML">AI/ML</MenuItem>
                    <MenuItem value="Automation">Automation</MenuItem>
                    <MenuItem value="Analytics">Analytics</MenuItem>
                    <MenuItem value="Process">Process</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Impact</InputLabel>
                  <Select
                    value={innovation.impact}
                    onChange={(e) => handleInnovationChange(index, 'impact', e.target.value)}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={innovation.aiFirst}
                      onChange={(e) => handleInnovationChange(index, 'aiFirst', e.target.checked)}
                    />
                  }
                  label="AI-First Initiative"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={innovation.description}
                  onChange={(e) => handleInnovationChange(index, 'description', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Project Edit Dialog
interface ProjectEditDialogProps {
  open: boolean;
  project?: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({ open, project, onClose, onSave }) => {
  const [editedProject, setEditedProject] = useState<Project>({
    id: '',
    name: '',
    status: 'Planning',
    progress: 0,
    manager: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    budget: '',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setEditedProject({
        ...project,
        startDate: project.startDate || new Date().toISOString().split('T')[0],
        endDate: project.endDate || new Date().toISOString().split('T')[0]
      });
    } else {
      // Reset to default values when no project is selected
      setEditedProject({
        id: '',
        name: '',
        status: 'Planning',
        progress: 0,
        manager: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        budget: '',
        description: ''
      });
    }
  }, [project, open]);

  const handleChange = (field: keyof Project, value: any) => {
    setEditedProject({ ...editedProject, [field]: value });
  };

  const handleSave = () => {
    onSave(editedProject);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="project-edit-title">
      <DialogTitle id="project-edit-title">{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={editedProject.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manager"
                value={editedProject.manager}
                onChange={(e) => handleChange('manager', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editedProject.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget"
                value={editedProject.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={editedProject.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={editedProject.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Progress: {editedProject.progress}%</Typography>
              <Slider
                value={editedProject.progress}
                onChange={(_, value) => handleChange('progress', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editedProject.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
        </DialogActions>
    </Dialog>
  );
};

// Current vs Future State Edit Dialog
interface CurrentFutureStateEditDialogProps {
  open: boolean;
  currentState: string;
  futureState: string;
  onClose: () => void;
  onSave: (currentState: string, futureState: string) => void;
}

export const CurrentFutureStateEditDialog: React.FC<CurrentFutureStateEditDialogProps> = ({ 
  open, 
  currentState, 
  futureState, 
  onClose, 
  onSave 
}) => {
  const [editedCurrentState, setEditedCurrentState] = useState(currentState);
  const [editedFutureState, setEditedFutureState] = useState(futureState);

  useEffect(() => {
    setEditedCurrentState(currentState);
    setEditedFutureState(futureState);
  }, [currentState, futureState]);

  const handleSave = () => {
    onSave(editedCurrentState, editedFutureState);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="current-future-state-dialog-title"
    >
      <DialogTitle id="current-future-state-dialog-title">
        Edit Current vs Future State
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="error" gutterBottom>
              Current State
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={editedCurrentState}
              onChange={(e) => setEditedCurrentState(e.target.value)}
              placeholder="Describe the current state of operations, processes, and capabilities..."
              variant="outlined"
              autoFocus
              aria-label="Current State Description"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="success.main" gutterBottom>
              Future State
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={editedFutureState}
              onChange={(e) => setEditedFutureState(e.target.value)}
              placeholder="Describe the desired future state with AI enhancements, automation, and improvements..."
              variant="outlined"
              aria-label="Future State Description"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

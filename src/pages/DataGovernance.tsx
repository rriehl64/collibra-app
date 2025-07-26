import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutomationIcon from '@mui/icons-material/AutoFixHigh';

interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  lastModified: string;
  owner: string;
  tags: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  trigger: string;
  steps: string[];
  lastRun: string;
}

const mockPolicies: Policy[] = [
  {
    id: '1',
    name: 'Data Classification Policy',
    description: 'Guidelines for classifying data sensitivity levels',
    status: 'active',
    lastModified: '2025-01-23',
    owner: 'Data Security Team',
    tags: ['security', 'compliance', 'classification'],
  },
  {
    id: '2',
    name: 'Data Retention Policy',
    description: 'Requirements for data retention periods',
    status: 'active',
    lastModified: '2025-01-22',
    owner: 'Legal Team',
    tags: ['compliance', 'retention'],
  },
];

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'New Dataset Approval',
    description: 'Workflow for approving new dataset additions',
    status: 'active',
    trigger: 'New dataset creation',
    steps: [
      'Data owner submission',
      'Security review',
      'Compliance check',
      'Final approval',
    ],
    lastRun: '2025-01-23',
  },
  {
    id: '2',
    name: 'Access Request Review',
    description: 'Automated workflow for data access requests',
    status: 'active',
    trigger: 'Access request submission',
    steps: [
      'Manager approval',
      'Security validation',
      'Access provisioning',
    ],
    lastRun: '2025-01-22',
  },
];

const DataGovernance: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [openPolicyDialog, setOpenPolicyDialog] = useState(false);
  const [openWorkflowDialog, setOpenWorkflowDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newPolicy, setNewPolicy] = useState<Partial<Policy> & { tags?: string | string[] }>({
    name: '',
    description: '',
    tags: [],
    status: 'draft'
  });

  const handlePolicyDialogOpen = (policy?: Policy) => {
    if (policy) {
      setSelectedPolicy(policy);
      setNewPolicy(policy);
    } else {
      setSelectedPolicy(null);
      setNewPolicy({
        name: '',
        description: '',
        tags: [],
        status: 'draft'
      });
    }
    setOpenPolicyDialog(true);
  };

  const handlePolicyDialogClose = () => {
    setOpenPolicyDialog(false);
    setSelectedPolicy(null);
    setNewPolicy({
      name: '',
      description: '',
      tags: [],
      status: 'draft'
    });
  };

  const handlePolicySave = () => {
    if (!newPolicy.name || !newPolicy.description) {
      return; // Don't save if required fields are empty
    }

    const policy: Policy = {
      id: selectedPolicy?.id || String(Date.now()),
      name: newPolicy.name,
      description: newPolicy.description,
      status: (newPolicy.status as 'active' | 'draft' | 'archived') || 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      owner: 'Current User',
      tags: typeof newPolicy.tags === 'string' 
        ? newPolicy.tags.split(',').map(tag => tag.trim())
        : newPolicy.tags || []
    };

    if (selectedPolicy) {
      setPolicies(policies.map(p => p.id === selectedPolicy.id ? policy : p));
    } else {
      setPolicies([...policies, policy]);
    }

    handlePolicyDialogClose();
  };

  const handlePolicyChange = (field: keyof Policy, value: string) => {
    setNewPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeletePolicy = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId));
  };

  const handleWorkflowDialogOpen = (workflow?: Workflow) => {
    if (workflow) {
      setSelectedWorkflow(workflow);
    } else {
      setSelectedWorkflow(null);
    }
    setOpenWorkflowDialog(true);
  };

  const handleWorkflowDialogClose = () => {
    setOpenWorkflowDialog(false);
    setSelectedWorkflow(null);
  };

  const handleCardClick = (type: 'policy' | 'workflow') => {
    setSelectedCard(type);
    if (type === 'policy') {
      handlePolicyDialogOpen();
    } else {
      handleWorkflowDialogOpen();
    }
  };

  const [selectedCard, setSelectedCard] = useState<'policy' | 'workflow' | null>(null);

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Data Governance
      </Typography>
      
      <Grid container spacing={3}>
        {/* Policies Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.01)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => handleCardClick('policy')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Policies</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePolicyDialogOpen();
                }}
              >
                New Policy
              </Button>
            </Box>
            <List>
              {policies.map((policy) => (
                <React.Fragment key={policy.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handlePolicyDialogOpen(policy)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeletePolicy(policy.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={policy.name}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {policy.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={policy.status}
                              size="small"
                              color={policy.status === 'active' ? 'success' : 'default'}
                              sx={{ mr: 1 }}
                            />
                            {policy.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                            ))}
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Workflows Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.01)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => handleCardClick('workflow')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Automated Workflows</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkflowDialogOpen();
                }}
              >
                New Workflow
              </Button>
            </Box>
            <List>
              {workflows.map((workflow) => (
                <React.Fragment key={workflow.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handleWorkflowDialogOpen(workflow)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AutomationIcon sx={{ mr: 1 }} />
                          {workflow.name}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {workflow.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={workflow.status}
                              size="small"
                              color={workflow.status === 'active' ? 'success' : 'default'}
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={`Last run: ${workflow.lastRun}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Policy Dialog */}
      <Dialog 
        open={openPolicyDialog} 
        onClose={handlePolicyDialogClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {selectedPolicy ? 'Edit Policy' : 'New Policy'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Policy Name"
              fullWidth
              required
              value={newPolicy.name}
              onChange={(e) => handlePolicyChange('name', e.target.value)}
              error={!newPolicy.name}
              helperText={!newPolicy.name ? 'Policy name is required' : ''}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              required
              value={newPolicy.description}
              onChange={(e) => handlePolicyChange('description', e.target.value)}
              error={!newPolicy.description}
              helperText={!newPolicy.description ? 'Description is required' : ''}
            />
            <TextField
              margin="dense"
              label="Tags (comma-separated)"
              fullWidth
              value={typeof newPolicy.tags === 'string' ? newPolicy.tags : newPolicy.tags?.join(', ')}
              onChange={(e) => handlePolicyChange('tags', e.target.value)}
              helperText="Enter tags separated by commas"
            />
            <TextField
              select
              margin="dense"
              label="Status"
              fullWidth
              required
              value={newPolicy.status || 'draft'}
              onChange={(e) => handlePolicyChange('status', e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePolicyDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePolicySave}
            disabled={!newPolicy.name || !newPolicy.description}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Dialog */}
      <Dialog 
        open={openWorkflowDialog} 
        onClose={handleWorkflowDialogClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {selectedWorkflow ? 'Edit Workflow' : 'New Workflow'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Workflow Name"
              fullWidth
              defaultValue={selectedWorkflow?.name}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              defaultValue={selectedWorkflow?.description}
              required
            />
            <TextField
              margin="dense"
              label="Trigger"
              fullWidth
              defaultValue={selectedWorkflow?.trigger}
              required
            />
            <TextField
              margin="dense"
              label="Steps (one per line)"
              fullWidth
              multiline
              rows={4}
              defaultValue={selectedWorkflow?.steps.join('\n')}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWorkflowDialogClose}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataGovernance;

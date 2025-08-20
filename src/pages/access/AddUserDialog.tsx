import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';

// User type (shared with Users.tsx)
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  jobTitle?: string;
  createdAt: string;
  lastActive?: string;
  assignedDomains?: string[];
  preferences?: {
    theme?: string;
    notifications?: {
      email?: boolean;
      inApp?: boolean;
    };
  };
  // UI-specific properties
  status?: 'active' | 'inactive' | 'pending';
  isEditing?: boolean;
}

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, '_id' | 'createdAt' | 'lastActive' | 'isEditing' | 'status'>) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    department: string;
    jobTitle: string;
    assignedDomains: string[];
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    department: '',
    jobTitle: '',
    assignedDomains: [],
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [domainInput, setDomainInput] = useState<string>('');

  // Reset form when dialog opens or closes
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        department: '',
        jobTitle: '',
        assignedDomains: [],
      });
      setFormErrors({});
      setDomainInput('');
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear errors when field is edited
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddDomain = () => {
    if (domainInput.trim() !== '' && !formData.assignedDomains.includes(domainInput.trim())) {
      setFormData(prev => ({
        ...prev,
        assignedDomains: [...prev.assignedDomains, domainInput.trim()]
      }));
      setDomainInput('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      assignedDomains: prev.assignedDomains.filter(d => d !== domain)
    }));
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Remove confirmPassword before submitting
        const { confirmPassword, ...userData } = formData;
        await onSave(userData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="add-user-dialog-title"
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle id="add-user-dialog-title" sx={{ bgcolor: '#003366', color: 'white' }}>
        Add New User
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* Required User Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Required Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                autoFocus
                inputProps={{
                  'aria-label': 'User full name',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                inputProps={{
                  'aria-label': 'User email address',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.password}
                helperText={formErrors.password}
                inputProps={{
                  'aria-label': 'User password',
                  'autoComplete': 'new-password'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                inputProps={{
                  'aria-label': 'Confirm user password',
                  'autoComplete': 'new-password'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role-select"
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  label="Role"
                  inputProps={{
                    'aria-label': 'User role',
                  }}
                >
                  <MenuItem value="user">
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>User</ListItemText>
                  </MenuItem>
                  <MenuItem value="data-steward">
                    <ListItemIcon>
                      <SupervisorAccountIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Data Steward</ListItemText>
                  </MenuItem>
                  <MenuItem value="admin">
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Administrator</ListItemText>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Optional User Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Optional Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  'aria-label': 'User department',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="jobTitle"
                label="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  'aria-label': 'User job title',
                }}
              />
            </Grid>
            
            {/* Assigned Domains */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Assigned Domains
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  label="Add Domain"
                  size="small"
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDomain();
                    }
                  }}
                  inputProps={{
                    'aria-label': 'Add domain for user',
                  }}
                />
                <Button
                  onClick={handleAddDomain}
                  variant="contained"
                  sx={{ ml: 1, minWidth: '90px' }}
                  disabled={domainInput.trim() === ''}
                  aria-label="Add domain"
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.assignedDomains.map((domain, index) => (
                  <Chip
                    key={index}
                    label={domain}
                    onDelete={() => handleRemoveDomain(domain)}
                    color="primary"
                    variant="outlined"
                    aria-label={`Domain ${domain}, press delete to remove`}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            startIcon={<CancelIcon />}
            aria-label="Cancel adding user"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={isSubmitting ? null : <SaveIcon />}
            disabled={isSubmitting}
            aria-label="Create new user"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserDialog;

import React, { useState } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Box, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  RadioGroup, 
  Radio, 
  Divider, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Person as PersonIcon, 
  Email as EmailIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  NotificationsActive as NotificationsIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    jobTitle: user?.jobTitle || '',
    theme: user?.preferences?.theme || 'system',
    emailNotifications: user?.preferences?.notifications?.email || false,
    inAppNotifications: user?.preferences?.notifications?.inApp || false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'emailNotifications' || name === 'inAppNotifications') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setFormData({
        ...formData,
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        jobTitle: user?.jobTitle || '',
        theme: user?.preferences?.theme || 'system',
        emailNotifications: user?.preferences?.notifications?.email || false,
        inAppNotifications: user?.preferences?.notifications?.inApp || false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(!isEditing);
    setSaveSuccess(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);

    try {
      // Password validation if attempting to change
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        if (!formData.currentPassword) {
          setError('Current password is required to set a new password');
          return;
        }
      }

      // Prepare update data
      const updateData: any = {
        name: formData.name,
        department: formData.department,
        jobTitle: formData.jobTitle,
        preferences: {
          theme: formData.theme,
          notifications: {
            email: formData.emailNotifications,
            inApp: formData.inAppNotifications
          }
        }
      };

      // Only include password change if present
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await updateUser(updateData);
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>You must be logged in to view this page.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom 
        sx={{ 
          color: '#003366', // USCIS blue
          fontWeight: 700,
          mb: 4
        }}
        tabIndex={0}
        aria-label="User Profile Page"
      >
        User Profile
      </Typography>

      {saveSuccess && (
        <Alert 
          severity="success" 
          sx={{ mb: 4 }}
          aria-live="polite"
        >
          Your profile has been successfully updated!
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSave}>
        <Grid container spacing={4}>
          {/* Left Column - User Information */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                border: '1px solid #e0e0e0',
                borderLeft: '5px solid #003366' // USCIS blue accent
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ color: '#003366', fontWeight: 600 }}
                  id="personal-info-heading"
                >
                  Personal Information
                </Typography>
                <Button
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? undefined : handleEditToggle}
                  type={isEditing ? 'submit' : 'button'}
                  variant={isEditing ? 'contained' : 'outlined'}
                  color={isEditing ? 'primary' : 'secondary'}
                  disabled={loading}
                  aria-label={isEditing ? 'Save changes' : 'Edit profile'}
                  sx={{ 
                    bgcolor: isEditing ? '#003366' : 'transparent',
                    '&:hover': {
                      bgcolor: isEditing ? '#002244' : 'rgba(0, 51, 102, 0.08)'
                    }
                  }}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                  {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  alt={user.name}
                  src="/images/user-avatar.png"
                  sx={{ 
                    width: 100, 
                    height: 100,
                    border: '3px solid #003366' // USCIS blue border
                  }}
                  aria-label={`${user.name}'s profile picture`}
                />
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                  <Chip 
                    label={user.role.toUpperCase()} 
                    color="primary" 
                    size="small"
                    sx={{ 
                      bgcolor: '#003366',
                      fontSize: '0.75rem',
                      mt: 1
                    }}
                    aria-label={`Role: ${user.role}`}
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: '#003366', mr: 1 }} />,
                    }}
                    inputProps={{
                      'aria-label': 'Full name',
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing || true} // Email changes typically require verification, so disabled
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: '#003366', mr: 1 }} />,
                    }}
                    inputProps={{
                      'aria-label': 'Email address',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ color: '#003366', mr: 1 }} />,
                    }}
                    inputProps={{
                      'aria-label': 'Department',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ color: '#003366', mr: 1 }} />,
                    }}
                    inputProps={{
                      'aria-label': 'Job title',
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Security & Preferences */}
          <Grid item xs={12} md={6}>
            {/* Preferences */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 4,
                border: '1px solid #e0e0e0',
                borderLeft: '5px solid #003366' // USCIS blue accent
              }}
              aria-labelledby="preferences-heading"
            >
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ color: '#003366', fontWeight: 600, mb: 3 }}
                id="preferences-heading"
              >
                Preferences
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel 
                  component="legend" 
                  sx={{ color: '#003366', '&.Mui-focused': { color: '#003366' } }}
                >
                  Theme
                </FormLabel>
                <RadioGroup
                  row
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  aria-label="Theme selection"
                >
                  <FormControlLabel 
                    value="light" 
                    control={<Radio disabled={!isEditing} />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LightModeIcon sx={{ mr: 1 }} />
                        Light
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="dark" 
                    control={<Radio disabled={!isEditing} />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DarkModeIcon sx={{ mr: 1 }} />
                        Dark
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="system" 
                    control={<Radio disabled={!isEditing} />} 
                    label="System Default" 
                  />
                </RadioGroup>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Notification Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formData.emailNotifications} 
                      onChange={handleInputChange} 
                      name="emailNotifications"
                      disabled={!isEditing}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formData.inAppNotifications} 
                      onChange={handleInputChange} 
                      name="inAppNotifications" 
                      disabled={!isEditing}
                      color="primary"
                    />
                  }
                  label="In-App Notifications"
                />
              </Box>
            </Paper>

            {/* Security Settings */}
            {isEditing && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderLeft: '5px solid #B31B1B' // USCIS red for security
                }}
                aria-labelledby="security-heading"
              >
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ color: '#B31B1B', fontWeight: 600, mb: 3 }}
                  id="security-heading"
                >
                  <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Change Password
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Current Password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="New Password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      helperText="Leave blank to keep current password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
                      helperText={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Account Information */}
            {!isEditing && (
              <Card 
                sx={{ 
                  mb: 4, 
                  border: '1px solid #e0e0e0',
                  borderLeft: '5px solid #003366' // USCIS blue accent
                }}
                aria-labelledby="account-info-heading"
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ color: '#003366', fontWeight: 600, mb: 2 }}
                    id="account-info-heading"
                  >
                    Account Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ color: '#003366', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Active
                      </Typography>
                      <Typography variant="body1">
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HistoryIcon sx={{ color: '#003366', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Created
                      </Typography>
                      <Typography variant="body1">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Action Buttons - Only visible in edit mode */}
        {isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleEditToggle}
              aria-label="Cancel edits"
              sx={{ 
                color: '#666',
                borderColor: '#ccc',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              aria-label="Save profile changes"
              sx={{ 
                bgcolor: '#003366',
                '&:hover': {
                  bgcolor: '#002244'
                }
              }}
            >
              {loading ? (
                <>
                  Saving... <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;

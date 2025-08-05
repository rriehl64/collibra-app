import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Accessibility as AccessibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component for accessibility
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: 'en_US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Theme
    theme: 'light',
    primaryColor: '#003366',
    fontSize: 'medium',
    highContrast: false,
    
    // Notifications
    emailNotifications: true,
    dashboardNotifications: true,
    assetChanges: true,
    roleAssignments: true,
    dataQualityAlerts: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiration: 90,
    
    // Accessibility
    screenReader: false,
    keyboardNavigation: true,
    reducedMotion: false,
    largeText: false
  });
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSettingChange = (setting: string, value: any) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setSnackbarMessage('Settings saved successfully');
    setSnackbarOpen(true);
  };
  
  return (
    <Container sx={{ py: 4 }} className="settings-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
        Settings
      </Typography>
      <Typography variant="body1" paragraph>
        Configure your application preferences and account settings.
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PaletteIcon />} iconPosition="start" label="Display & Theme" {...a11yProps(0)} />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" {...a11yProps(1)} />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" {...a11yProps(2)} />
            <Tab icon={<AccessibilityIcon />} iconPosition="start" label="Accessibility" {...a11yProps(3)} />
            <Tab icon={<LanguageIcon />} iconPosition="start" label="Language & Region" {...a11yProps(4)} />
          </Tabs>
        </Box>
        
        {/* Display & Theme Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" component="h2" gutterBottom>
                  Theme Settings
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="theme-select-label">Theme Mode</InputLabel>
                    <Select
                      labelId="theme-select-label"
                      id="theme-select"
                      value={settings.theme}
                      label="Theme Mode"
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">Use System Setting</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      name="highContrast"
                    />
                  }
                  label="High Contrast Mode"
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" component="h2" gutterBottom>
                  Display Options
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="font-size-label">Font Size</InputLabel>
                    <Select
                      labelId="font-size-label"
                      id="font-size-select"
                      value={settings.fontSize}
                      label="Font Size"
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Color
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['#003366', '#2E7D32', '#C62828', '#6A1B9A', '#1565C0', '#E65100'].map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: settings.primaryColor === color ? '2px solid #000' : 'none',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                        onClick={() => handleSettingChange('primaryColor', color)}
                        role="button"
                        aria-label={`Select color ${color}`}
                        tabIndex={0}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
            <Typography variant="h6" component="h2" gutterBottom>
              Notification Preferences
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    name="emailNotifications"
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Receive notifications via email for important updates.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dashboardNotifications}
                    onChange={(e) => handleSettingChange('dashboardNotifications', e.target.checked)}
                    name="dashboardNotifications"
                  />
                }
                label="In-App Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Show notification alerts within the application dashboard.
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Notify me about:
            </Typography>
            
            <Box sx={{ ml: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.assetChanges}
                    onChange={(e) => handleSettingChange('assetChanges', e.target.checked)}
                    name="assetChanges"
                  />
                }
                label="Data Asset Changes"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.roleAssignments}
                    onChange={(e) => handleSettingChange('roleAssignments', e.target.checked)}
                    name="roleAssignments"
                  />
                }
                label="Role Assignments"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataQualityAlerts}
                    onChange={(e) => handleSettingChange('dataQualityAlerts', e.target.checked)}
                    name="dataQualityAlerts"
                  />
                }
                label="Data Quality Alerts"
              />
            </Box>
          </Paper>
        </TabPanel>
        
        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" component="h2" gutterBottom>
                  Account Security
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        name="twoFactorAuth"
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Increase security by requiring a second verification step when logging in.
                  </Typography>
                </Box>
                
                {settings.twoFactorAuth && (
                  <Box sx={{ ml: 4, mb: 3 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ mr: 2 }}
                    >
                      Setup 2FA
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      color="secondary"
                    >
                      Backup Codes
                    </Button>
                  </Box>
                )}
                
                <Box sx={{ mb: 3, mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<EditIcon />}
                  >
                    Change Password
                  </Button>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Session Settings
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="session-timeout-label">Session Timeout (minutes)</InputLabel>
                  <Select
                    labelId="session-timeout-label"
                    id="session-timeout"
                    value={settings.sessionTimeout}
                    label="Session Timeout (minutes)"
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" component="h2" gutterBottom>
                  Privacy Settings
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Connected Applications
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Manage applications connected to your account.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label="Office 365" 
                      onDelete={() => {}}
                      sx={{ m: 0.5 }}
                    />
                    <Chip 
                      label="Google Workspace" 
                      onDelete={() => {}}
                      sx={{ m: 0.5 }}
                    />
                    <Chip 
                      label="Tableau" 
                      onDelete={() => {}}
                      sx={{ m: 0.5 }}
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle2" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    size="small"
                  >
                    Delete Account Data
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Accessibility Tab */}
        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
            <Typography variant="h6" component="h2" gutterBottom>
              Accessibility Settings
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              These settings help make the application more accessible for users with disabilities.
            </Alert>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.screenReader}
                    onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                    name="screenReader"
                  />
                }
                label="Optimize for Screen Readers"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Enhances compatibility with screen reading software.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.keyboardNavigation}
                    onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                    name="keyboardNavigation"
                  />
                }
                label="Enhanced Keyboard Navigation"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Improves navigation using only keyboard shortcuts.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.reducedMotion}
                    onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    name="reducedMotion"
                  />
                }
                label="Reduce Motion"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Minimizes animations and transitions throughout the application.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.largeText}
                    onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                    name="largeText"
                  />
                }
                label="Large Text"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Increases the font size across the application.
              </Typography>
            </Box>
          </Paper>
        </TabPanel>
        
        {/* Language & Region Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" component="h2" gutterBottom>
                  Language & Region Settings
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-select-label">Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={settings.language}
                    label="Language"
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <MenuItem value="en_US">English (US)</MenuItem>
                    <MenuItem value="en_GB">English (UK)</MenuItem>
                    <MenuItem value="es_ES">Spanish (Spain)</MenuItem>
                    <MenuItem value="fr_FR">French</MenuItem>
                    <MenuItem value="de_DE">German</MenuItem>
                    <MenuItem value="ja_JP">Japanese</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="date-format-label">Date Format</InputLabel>
                  <Select
                    labelId="date-format-label"
                    id="date-format"
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="time-format-label">Time Format</InputLabel>
                  <Select
                    labelId="time-format-label"
                    id="time-format"
                    value={settings.timeFormat}
                    label="Time Format"
                    onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  >
                    <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                    <MenuItem value="24h">24-hour</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Save button */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
      
      {/* Success snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default Settings;

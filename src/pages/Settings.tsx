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
  Snackbar,
  Tooltip,
  Link,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Accessibility as AccessibilityIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  TextFields as TextFieldsIcon,
  Contrast as ContrastIcon,
  VolumeUp as VolumeUpIcon
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
    fontFamily: 'sourceSansPro',
    
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
    largeText: false,
    audioFeedback: false,
    simplifiedInterface: false
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
      {/* Breadcrumb navigation for improved wayfinding */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="/dashboard" 
          sx={{ display: 'flex', alignItems: 'center' }}
          aria-label="Go to dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography 
          color="text.primary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#003366',
            fontWeight: 600 
          }}
        >
          <SettingsIcon sx={{ mr: 0.5 }} fontSize="small" />
          Settings
        </Typography>
      </Breadcrumbs>

      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#003366', 
          fontWeight: 700,
          borderBottom: '2px solid #003366',
          pb: 1,
          mb: 3 
        }}
        tabIndex={0}
      >
        Settings
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Configure your application preferences and account settings. Changes will be saved automatically to your user profile.
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#555',
                '&.Mui-selected': {
                  color: '#003366',
                  fontWeight: 600,
                },
                '&:focus': {
                  outline: '2px solid #003366',
                  outlineOffset: '2px',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#003366',
                height: 3
              }
            }}
          >
            <Tab 
              icon={<PaletteIcon />} 
              iconPosition="start" 
              label="Display & Theme" 
              {...a11yProps(0)} 
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
            <Tab 
              icon={<NotificationsIcon />} 
              iconPosition="start" 
              label="Notifications" 
              {...a11yProps(1)} 
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
            <Tab 
              icon={<SecurityIcon />} 
              iconPosition="start" 
              label="Security" 
              {...a11yProps(2)} 
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
            <Tab 
              icon={<AccessibilityIcon />} 
              iconPosition="start" 
              label="Accessibility" 
              {...a11yProps(3)} 
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
            <Tab 
              icon={<LanguageIcon />} 
              iconPosition="start" 
              label="Language & Region" 
              {...a11yProps(4)} 
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
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
          <Alert severity="info" sx={{ mb: 3, backgroundColor: '#E6F0F9', color: '#003366' }}>
            <Typography variant="subtitle1">
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              These settings help ensure compliance with Section 508 and WCAG 2.0 standards
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  sx={{ color: '#003366', fontWeight: 600 }}
                  id="accessibility-options-heading"
                >
                  <AccessibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Accessibility Options
                </Typography>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="accessibility-options-heading">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.screenReader}
                        onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                        name="screenReader"
                        inputProps={{ 'aria-describedby': 'screenreader-description' }}
                        color="primary"
                      />
                    }
                    label="Screen Reader Compatibility Mode"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="screenreader-description"
                  >
                    Optimize interface for screen readers with enhanced ARIA descriptions and skip navigation links.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="keyboard-navigation-label">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.keyboardNavigation}
                        onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                        name="keyboardNavigation"
                        inputProps={{ 'aria-describedby': 'keyboard-navigation-description' }}
                        color="primary"
                      />
                    }
                    label="Enhanced Keyboard Navigation"
                    id="keyboard-navigation-label"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="keyboard-navigation-description"
                  >
                    Enable focus indicators and keyboard shortcuts for all interactive elements.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="reduced-motion-label">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.reducedMotion}
                        onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                        name="reducedMotion"
                        inputProps={{ 'aria-describedby': 'reduced-motion-description' }}
                        color="primary"
                      />
                    }
                    label="Reduced Motion"
                    id="reduced-motion-label"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="reduced-motion-description"
                  >
                    Minimize animations and transitions for users with vestibular disorders.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  sx={{ color: '#003366', fontWeight: 600 }}
                  id="visual-options-heading"
                >
                  <TextFieldsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Visual Preferences
                </Typography>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="text-size-label">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.largeText}
                        onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                        name="largeText"
                        inputProps={{ 'aria-describedby': 'large-text-description' }}
                        color="primary"
                      />
                    }
                    label="Large Text"
                    id="text-size-label"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="large-text-description"
                  >
                    Increase font size throughout the application (minimum 16px).
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="contrast-mode-label">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.highContrast}
                        onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                        name="highContrast"
                        inputProps={{ 'aria-describedby': 'contrast-description' }}
                        color="primary"
                      />
                    }
                    label="High Contrast Mode"
                    id="contrast-mode-label"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="contrast-description"
                  >
                    Enable high contrast colors for better readability (WCAG AAA compliance).
                  </Typography>
                </Box>
                
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  sx={{ mt: 3 }}
                  aria-labelledby="font-family-label"
                >
                  <InputLabel id="font-family-label-id">Font Family</InputLabel>
                  <Select
                    labelId="font-family-label-id"
                    id="font-family-select"
                    value={settings.fontFamily || 'sourceSansPro'}
                    label="Font Family"
                    onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  >
                    <MenuItem value="sourceSansPro">Source Sans Pro (Default)</MenuItem>
                    <MenuItem value="merriweather">Merriweather</MenuItem>
                    <MenuItem value="roboto">Roboto</MenuItem>
                    <MenuItem value="openSans">Open Sans</MenuItem>
                  </Select>
                  <Typography id="font-family-label" variant="caption" sx={{ mt: 1 }}>
                    Select a font that is easier for you to read
                  </Typography>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }} elevation={0} variant="outlined">
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  sx={{ color: '#003366', fontWeight: 600 }}
                  id="cognitive-options-heading"
                >
                  <VolumeUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Audio & Cognitive Assistance
                </Typography>
                
                <Box sx={{ mb: 3 }} role="group" aria-labelledby="cognitive-options-heading">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.audioFeedback || false}
                        onChange={(e) => handleSettingChange('audioFeedback', e.target.checked)}
                        name="audioFeedback"
                        inputProps={{ 'aria-describedby': 'audio-feedback-description' }}
                        color="primary"
                      />
                    }
                    label="Audio Feedback"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="audio-feedback-description"
                  >
                    Enable audio cues for important actions and notifications.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.simplifiedInterface || false}
                        onChange={(e) => handleSettingChange('simplifiedInterface', e.target.checked)}
                        name="simplifiedInterface"
                        inputProps={{ 'aria-describedby': 'simplified-interface-description' }}
                        color="primary"
                      />
                    }
                    label="Simplified Interface"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 4 }}
                    id="simplified-interface-description"
                  >
                    Reduce visual complexity and provide clearer instructions.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HelpIcon />}
              href="https://www.section508.gov/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn more about Section 508 compliance"
            >
              Section 508 Information
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: '#003366' }}
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              aria-label="Save all accessibility settings"
            >
              Save Settings
            </Button>
          </Box>
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

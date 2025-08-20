import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
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
import AccessibilitySettings from '../components/Settings/AccessibilitySettings';

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
      className="settings-tab-panel"
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
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

const Settings = () => {
  const { user } = useAuth();
  const themeContext = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Scroll to top on component mount for accessibility
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: 'en_US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Theme
    theme: themeContext.themePreferences.mode,
    primaryColor: themeContext.themePreferences.primaryColor,
    fontSize: themeContext.themePreferences.fontSize,
    highContrast: themeContext.themePreferences.highContrast,
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
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          variant="scrollable"
          scrollButtons="auto"
          className="settings-tabs"
        >
            <Tab 
              icon={<PaletteIcon />} 
              iconPosition="start" 
              label="Display & Theme" 
              {...a11yProps(0)} 
              sx={{ border: 'none', boxShadow: 'none' }}
            />
            <Tab 
              icon={<NotificationsIcon />} 
              iconPosition="start" 
              label="Notifications" 
              {...a11yProps(1)} 
              sx={{ border: 'none', boxShadow: 'none' }}
            />
            <Tab 
              icon={<SecurityIcon />} 
              iconPosition="start" 
              label="Security" 
              {...a11yProps(2)} 
              sx={{ border: 'none', boxShadow: 'none' }}
            />
            <Tab 
              icon={<AccessibilityIcon />} 
              iconPosition="start" 
              label="Accessibility" 
              {...a11yProps(3)} 
              sx={{ border: 'none', boxShadow: 'none' }}
            />
            <Tab 
              icon={<LanguageIcon />} 
              iconPosition="start" 
              label="Language & Region" 
              {...a11yProps(4)} 
              sx={{ border: 'none', boxShadow: 'none' }}
            />
          </Tabs>
        
        {/* Display & Theme Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="settings-section">
                <Typography variant="h6" component="h2" gutterBottom className="settings-heading">
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
                      onChange={(e) => {
                        handleSettingChange('theme', e.target.value);
                        // Update theme context
                        themeContext.updateThemePreferences({ mode: e.target.value as 'light' | 'dark' | 'system' });
                      }}
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
                      onChange={(e) => {
                        handleSettingChange('highContrast', e.target.checked);
                        // Update theme context
                        themeContext.updateThemePreferences({ highContrast: e.target.checked });
                      }}
                      name="highContrast"
                    />
                  }
                  label="High Contrast Mode"
                />
              </div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <div className="settings-section settings-section-alt">
                <Typography variant="h6" component="h2" gutterBottom className="settings-heading">
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
                      onChange={(e) => {
                        handleSettingChange('fontSize', e.target.value);
                        // Update theme context
                        themeContext.updateThemePreferences({ fontSize: e.target.value as 'small' | 'medium' | 'large' });
                      }}
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
                        onClick={() => {
                          handleSettingChange('primaryColor', color);
                          // Update theme context
                          themeContext.updateThemePreferences({ primaryColor: color });
                        }}
                        role="button"
                        aria-label={`Select color ${color}`}
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSettingChange('primaryColor', color);
                            themeContext.updateThemePreferences({ primaryColor: color });
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </div>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="settings-section settings-section-warning">
            <Typography variant="h6" component="h2" gutterBottom className="settings-heading">
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
          </div>
        </TabPanel>
        
        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="settings-section settings-section-alt">
                <Typography variant="h6" component="h2" gutterBottom className="settings-heading">
                  Security Settings
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
              </div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <div className="settings-section settings-section-danger">
                <Typography variant="h6" component="h2" gutterBottom className="settings-heading">
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
              </div>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Accessibility Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#E6F0F9', color: '#003366' }}>
              <Typography variant="subtitle1">
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                These settings help ensure compliance with Section 508 and WCAG 2.1 standards
              </Typography>
            </Alert>
            
            <AccessibilitySettings />
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HelpIcon />}
                href="https://www.section508.gov/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about Section 508 compliance"
                sx={{ mr: 2 }}
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
          </Box>
        </TabPanel>
        
        {/* Language & Region Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="settings-section settings-section-alt">
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#5e35b1', fontWeight: 600 }}>
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
              </div>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Save button */}
        <div className="settings-button-container">
          <Button
            onClick={handleSaveSettings}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            aria-label="Save all settings"
            sx={{
              bgcolor: '#003366',
              '&:hover': {
                bgcolor: '#002855',
              },
              boxShadow: 'none',
              borderRadius: '4px',
            }}
          >
            Save Settings
          </Button>
        </div>

        {/* Success snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage || ''}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};

export default Settings;

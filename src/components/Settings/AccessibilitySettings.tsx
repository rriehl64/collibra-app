/**
 * Accessibility Settings Component
 * 
 * Provides user interface for adjusting accessibility preferences
 * with full Section 508 compliance and USCIS design guidelines.
 */
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Keyboard as KeyboardIcon,
  AccessibilityNew as AccessibilityIcon,
  TextFields as TextFieldsIcon,
  Speed as SpeedIcon,
  Help as HelpIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilitySettings = (): React.ReactElement => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const theme = useTheme();
  const [showInfoTooltips, setShowInfoTooltips] = useState(false);

  // Toggle info tooltips
  const toggleInfoTooltips = () => {
    setShowInfoTooltips(!showInfoTooltips);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        my: 2,
        '& .MuiCard-root': {
          mb: 3
        }
      }}
      role="region"
      aria-labelledby="accessibility-settings-title"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          id="accessibility-settings-title" 
          sx={{ color: '#003366', fontWeight: 700 }}
          tabIndex={-1}
        >
          Accessibility Settings
        </Typography>

        <Box>
          <Tooltip title="Show help information">
            <IconButton
              onClick={toggleInfoTooltips}
              aria-label="Toggle help information"
              aria-pressed={showInfoTooltips}
              color={showInfoTooltips ? "primary" : "default"}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reset all settings to default">
            <IconButton
              onClick={resetSettings}
              aria-label="Reset all accessibility settings"
              sx={{ ml: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="body1" paragraph>
        Customize your accessibility preferences to improve your experience. These settings will be saved and applied across the application.
      </Typography>

      {/* Visual Settings Card */}
      <Card raised>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">Visual Preferences</Typography>
            </Box>
          }
          sx={{ backgroundColor: '#f5f8fa' }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            {/* Font Size Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TextFieldsIcon sx={{ mt: 1, mr: 1, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="subtitle1" component="h3" gutterBottom fontWeight="bold">
                    Text Size
                  </Typography>
                  
                  {showInfoTooltips && (
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Adjust the size of text throughout the application for better readability.
                    </Typography>
                  )}
                  
                  <RadioGroup
                    aria-label="font size"
                    name="font-size"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value as any)}
                  >
                    <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                    <FormControlLabel value="large" control={<Radio />} label="Large (120%)" />
                    <FormControlLabel value="x-large" control={<Radio />} label="Extra Large (150%)" />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>

            {/* Contrast and Motion Section */}
            <Grid item xs={12} md={6}>
              <FormGroup>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.highContrast}
                          onChange={(e) => updateSetting('highContrast', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="High Contrast Mode"
                    />
                    
                    {showInfoTooltips && (
                      <Typography variant="body2" sx={{ mt: -1, mb: 1, ml: 4, color: 'text.secondary' }}>
                        Enhances color contrast for better visibility and readability.
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.reducedMotion}
                          onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Reduced Motion"
                    />
                    
                    {showInfoTooltips && (
                      <Typography variant="body2" sx={{ mt: -1, mb: 1, ml: 4, color: 'text.secondary' }}>
                        Minimizes animations and transitions for users who are sensitive to motion.
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.textSpacing}
                          onChange={(e) => updateSetting('textSpacing', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Increased Text Spacing"
                    />
                    
                    {showInfoTooltips && (
                      <Typography variant="body2" sx={{ mt: -1, ml: 4, color: 'text.secondary' }}>
                        Increases spacing between letters, words, and lines for better readability.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </FormGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Interaction Settings Card */}
      <Card raised>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <KeyboardIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">Interaction Preferences</Typography>
            </Box>
          }
          sx={{ backgroundColor: '#f5f8fa' }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enhancedFocus}
                        onChange={(e) => updateSetting('enhancedFocus', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enhanced Focus Indicators"
                  />
                  
                  {showInfoTooltips && (
                    <Typography variant="body2" sx={{ mt: -1, mb: 1, ml: 4, color: 'text.secondary' }}>
                      Makes focus outlines more visible for keyboard navigation.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.keyboardMode}
                        onChange={(e) => updateSetting('keyboardMode', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Keyboard Navigation Mode"
                  />
                  
                  {showInfoTooltips && (
                    <Typography variant="body2" sx={{ mt: -1, mb: 1, ml: 4, color: 'text.secondary' }}>
                      Optimizes the interface for keyboard-only navigation.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Screen Reader Settings Card */}
      <Card raised>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessibilityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">Screen Reader Optimizations</Typography>
            </Box>
          }
          sx={{ backgroundColor: '#f5f8fa' }}
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.verboseLabels}
                    onChange={(e) => updateSetting('verboseLabels', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enhanced Screen Reader Descriptions"
              />
              
              {showInfoTooltips && (
                <Typography variant="body2" sx={{ mt: -1, mb: 1, ml: 4, color: 'text.secondary' }}>
                  Provides more detailed descriptions for screen readers with extended ARIA labels.
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f8fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          About Accessibility at USCIS
        </Typography>
        <Typography variant="body2" paragraph>
          USCIS is committed to providing accessible digital content to all users, including those with disabilities. 
          These settings help customize your experience to meet your specific needs.
        </Typography>
        <Typography variant="body2">
          For additional assistance or to report accessibility issues, please contact the Help Desk or visit 
          the USCIS Accessibility Statement page.
        </Typography>
      </Box>
    </Box>
  );
};

export default AccessibilitySettings;

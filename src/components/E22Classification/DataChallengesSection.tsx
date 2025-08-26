import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import EditableField from '../shared/EditableField';
import DataChallengesForm, { DataChallengesData } from './DataChallengesForm';
import PrimaryButton from '../shared/PrimaryButton';

const DataChallengesSection: React.FC = () => {
  const { settings } = useAccessibility();
  const { isUserAdmin, editMode, setEditMode, setCurrentEditingSection } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  // Local editable state for key blocks (no backend persistence for now)
  const [mainTitle, setMainTitle] = useState<string>('Data Management and Challenges');
  const [introText, setIntroText] = useState<string>(
    'E22 classification data management involves tracking and processing information related to spouses of EB-2 principal immigrants. This data is crucial for case management, reporting, and policy analysis, but it also presents unique challenges.'
  );
  const [systemsTitle, setSystemsTitle] = useState<string>('Data Systems and Integration');
  const [challengesTitle, setChallengesTitle] = useState<string>('Data Challenges');
  const [improvementTitle, setImprovementTitle] = useState<string>('Improvement Initiatives');

  // Snapshot for Cancel
  const [originalSnapshot, setOriginalSnapshot] = useState({
    mainTitle,
    introText,
    systemsTitle,
    challengesTitle,
    improvementTitle,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const beginEdit = () => {
    setOriginalSnapshot({ mainTitle, introText, systemsTitle, challengesTitle, improvementTitle });
    setEditMode(true);
  };
  const cancelEdit = () => {
    setMainTitle(originalSnapshot.mainTitle);
    setIntroText(originalSnapshot.introText);
    setSystemsTitle(originalSnapshot.systemsTitle);
    setChallengesTitle(originalSnapshot.challengesTitle);
    setImprovementTitle(originalSnapshot.improvementTitle);
    setEditMode(false);
  };
  const saveEdit = () => {
    // In-memory only
    setSaveSuccess(true);
    setEditMode(false);
  };

  const openForm = () => {
    setCurrentEditingSection('data-challenges');
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);
  const handleFormSave = async (updated: DataChallengesData) => {
    setMainTitle(updated.mainTitle);
    setIntroText(updated.introText);
    setSystemsTitle(updated.systemsTitle);
    setChallengesTitle(updated.challengesTitle);
    setImprovementTitle(updated.improvementTitle);
    setSaveSuccess(true);
    setFormOpen(false);
  };

  // Click-anywhere to edit: focus first logical target and enable edit mode for admins
  const focusFirstEditable = () => {
    const el = document.getElementById('data-challenges-title');
    if (el && 'focus' in el) {
      (el as HTMLElement).focus();
    }
  };

  const handleActivateEdit = () => {
    if (isUserAdmin) {
      setCurrentEditingSection('data-challenges');
      if (!editMode) setEditMode(true);
      focusFirstEditable();
    }
  };

  return (
    <Box>
      {/* Admin controls */}
      {isUserAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
          {!editMode ? (
            <PrimaryButton
              startIcon={<EditIcon />}
              onClick={beginEdit}
              aria-label="Enable editing mode for Data Management and Challenges"
            >
              Field Editor
            </PrimaryButton>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={cancelEdit}
                aria-label="Cancel changes"
              >
                Cancel
              </Button>
              <PrimaryButton
                startIcon={<SaveIcon />}
                onClick={saveEdit}
                aria-label="Save all changes"
              >
                Save All
              </PrimaryButton>
            </>
          )}
          <PrimaryButton
            startIcon={<ListAltIcon />}
            onClick={openForm}
            aria-label="Open form editor for Data Management and Challenges"
          >
            Form Editor
          </PrimaryButton>
        </Box>
      )}

      {/* Save success snackbar (local) */}
      <Snackbar open={saveSuccess} autoHideDuration={2500} onClose={() => setSaveSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Changes saved (local only)
        </Alert>
      </Snackbar>
      <DataChallengesForm
        open={formOpen}
        onClose={closeForm}
        onSave={handleFormSave}
        data={{
          mainTitle,
          introText,
          systemsTitle,
          challengesTitle,
          improvementTitle,
        }}
        highContrast={highContrast}
        largeText={largeText}
      />
      <EditableField
        content={mainTitle}
        onSave={(val) => setMainTitle(val)}
        variant="h5"
        component="h2"
        fieldId="data-challenges-title"
        ariaLabel="Data Management and Challenges title"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          ...headingProps
        }}
      />

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          outline: 'none',
          '&:focus': { boxShadow: '0 0 0 3px rgba(0,51,102,0.4)' },
          ...contrastProps
        }}
        role="button"
        tabIndex={isUserAdmin ? 0 : -1}
        aria-label="Data Management and Challenges section. Activate to start editing."
        onClick={handleActivateEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActivateEdit();
          }
        }}
      >
        <EditableField 
          content={introText}
          onSave={(val) => setIntroText(val)}
          variant="body1" 
          fieldId="data-challenges-intro"
          ariaLabel="Data challenges introduction"
          multiline
          sx={{ ...textSizeProps }}
        />

        <EditableField 
          content={systemsTitle}
          onSave={(val) => setSystemsTitle(val)}
          variant="h6" 
          fieldId="data-systems-title"
          ariaLabel="Data systems and integration title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            mt: 3,
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                border: highContrast ? '1px solid #000000' : 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon sx={{ 
                    color: highContrast ? '#000000' : '#003366',
                    mr: 1,
                    fontSize: '2rem'
                  }} />
                  <Typography 
                    variant="h6"
                    sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      fontWeight: 'bold',
                      ...textSizeProps
                    }}
                  >
                    Primary Data Systems
                  </Typography>
                </Box>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="CLAIMS 3" 
                      secondary="Computer-Linked Application Information Management System for tracking adjustment of status cases"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="ELIS" 
                      secondary="Electronic Immigration System for electronic case processing"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="USCIS CIS" 
                      secondary="Central Index System for A-number tracking"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="NASS" 
                      secondary="National Appointment Scheduling System for biometrics and interview appointments"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                border: highContrast ? '1px solid #000000' : 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IntegrationInstructionsIcon sx={{ 
                    color: highContrast ? '#000000' : '#003366',
                    mr: 1,
                    fontSize: '2rem'
                  }} />
                  <Typography 
                    variant="h6"
                    sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      fontWeight: 'bold',
                      ...textSizeProps
                    }}
                  >
                    Integration Points
                  </Typography>
                </Box>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Department of State (DOS)" 
                      secondary="Information sharing for consular processing cases"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Customs and Border Protection (CBP)" 
                      secondary="Entry data and admission records"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="FBI" 
                      secondary="Background check data and fingerprint verification"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Department of Labor (DOL)" 
                      secondary="Labor certification data related to EB-2 principal applicants"
                      primaryTypographyProps={{ 
                        fontWeight: 'bold',
                        ...textSizeProps 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: largeText ? '1rem' : '0.875rem',
                        color: highContrast ? '#000000' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <EditableField 
          content={challengesTitle}
          onSave={(val) => setChallengesTitle(val)}
          variant="h6" 
          fieldId="data-challenges-subtitle"
          ariaLabel="Data challenges heading"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ 
                bgcolor: highContrast ? '#000000' : '#B31B1B',
                color: '#ffffff',
                p: 1.5,
                display: 'flex',
                alignItems: 'center'
              }}>
                <ErrorIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    ...textSizeProps
                  }}
                >
                  Data Fragmentation
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                  E22 data is often stored across multiple systems without comprehensive integration, creating challenges in case tracking and reporting.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Impact: High" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#B31B1B',
                      color: '#ffffff',
                      mr: 1,
                      mb: 1
                    }} 
                  />
                  <Chip 
                    label="Status: Ongoing" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#FF9800',
                      color: '#ffffff',
                      mb: 1
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ 
                bgcolor: highContrast ? '#000000' : '#B31B1B',
                color: '#ffffff',
                p: 1.5,
                display: 'flex',
                alignItems: 'center'
              }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    ...textSizeProps
                  }}
                >
                  Data Security Concerns
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                  Sensitive E22 applicant information requires robust security protocols, while still enabling necessary data sharing between agencies.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Impact: Critical" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#B31B1B',
                      color: '#ffffff',
                      mr: 1,
                      mb: 1
                    }} 
                  />
                  <Chip 
                    label="Status: Addressed" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#4CAF50',
                      color: '#ffffff',
                      mb: 1
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ 
                bgcolor: highContrast ? '#000000' : '#B31B1B',
                color: '#ffffff',
                p: 1.5,
                display: 'flex',
                alignItems: 'center'
              }}>
                <BugReportIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    ...textSizeProps
                  }}
                >
                  Data Quality Issues
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                  Manual data entry and system transitions can lead to inconsistencies, duplications, and incomplete records for E22 cases.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Impact: Medium" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#FF9800',
                      color: '#ffffff',
                      mr: 1,
                      mb: 1
                    }} 
                  />
                  <Chip 
                    label="Status: In Progress" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#FF9800',
                      color: '#ffffff',
                      mb: 1
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ 
                bgcolor: highContrast ? '#000000' : '#B31B1B',
                color: '#ffffff',
                p: 1.5,
                display: 'flex',
                alignItems: 'center'
              }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    ...textSizeProps
                  }}
                >
                  Tracking Difficulties
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                  Linking E22 derivative cases to principal EB-2 cases across different stages of processing can be challenging, especially for "follow to join" cases.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Impact: High" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#B31B1B',
                      color: '#ffffff',
                      mr: 1,
                      mb: 1
                    }} 
                  />
                  <Chip 
                    label="Status: In Progress" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#FF9800',
                      color: '#ffffff',
                      mb: 1
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ 
                bgcolor: highContrast ? '#000000' : '#B31B1B',
                color: '#ffffff',
                p: 1.5,
                display: 'flex',
                alignItems: 'center'
              }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    ...textSizeProps
                  }}
                >
                  Reporting Complexity
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                  Generating comprehensive reports on E22 cases requires complex data integration from multiple systems, making accurate statistical analysis difficult.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Impact: Medium" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#FF9800',
                      color: '#ffffff',
                      mr: 1,
                      mb: 1
                    }} 
                  />
                  <Chip 
                    label="Status: In Development" 
                    size="small"
                    sx={{ 
                      bgcolor: highContrast ? '#000000' : '#2196F3',
                      color: '#ffffff',
                      mb: 1
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <EditableField
        content={improvementTitle}
        onSave={(val) => setImprovementTitle(val)}
        variant="h5"
        component="h2"
        fieldId="improvement-initiatives-title"
        ariaLabel="Improvement initiatives title"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mt: 4,
          ...headingProps
        }}
      />

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          outline: 'none',
          '&:focus': { boxShadow: '0 0 0 3px rgba(0,51,102,0.4)' },
          ...contrastProps
        }}
        role="button"
        tabIndex={isUserAdmin ? 0 : -1}
        aria-label="Improvement Initiatives section. Activate to start editing."
        onClick={handleActivateEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActivateEdit();
          }
        }}
      >
        <Typography 
          variant="body1" 
          paragraph
          sx={{ ...textSizeProps }}
        >
          USCIS is working on several initiatives to address E22 data challenges:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <StorageIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="System Integration Efforts" 
              secondary="Developing APIs and integration points between CLAIMS 3, ELIS, and other systems to create a more unified view of cases"
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                ...textSizeProps 
              }}
              secondaryTypographyProps={{ 
                ...textSizeProps, 
                color: highContrast ? '#000000' : 'text.secondary'
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <StorageIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Data Quality Program" 
              secondary="Implementation of automated validation rules, data cleansing processes, and quality monitoring"
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                ...textSizeProps 
              }}
              secondaryTypographyProps={{ 
                ...textSizeProps, 
                color: highContrast ? '#000000' : 'text.secondary'
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <StorageIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Case Relationship Management" 
              secondary="Enhanced tracking capabilities to better associate derivative cases with principal applications throughout the process"
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                ...textSizeProps 
              }}
              secondaryTypographyProps={{ 
                ...textSizeProps, 
                color: highContrast ? '#000000' : 'text.secondary'
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <StorageIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Analytics Dashboards" 
              secondary="Development of comprehensive reporting tools to provide insights into E22 case processing, trends, and outcomes"
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                ...textSizeProps 
              }}
              secondaryTypographyProps={{ 
                ...textSizeProps, 
                color: highContrast ? '#000000' : 'text.secondary'
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <StorageIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Training Programs" 
              secondary="Enhanced data entry and management training for USCIS staff handling E22 cases"
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                ...textSizeProps 
              }}
              secondaryTypographyProps={{ 
                ...textSizeProps, 
                color: highContrast ? '#000000' : 'text.secondary'
              }}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default DataChallengesSection;

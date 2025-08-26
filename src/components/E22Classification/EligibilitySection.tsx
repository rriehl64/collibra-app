import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ClearIcon from '@mui/icons-material/Clear';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import EditableField from '../shared/EditableField';
import EditableListItem from '../shared/EditableListItem';
import EligibilityForm from './EligibilityForm';

interface EligibilityCriterion {
  _id?: string;
  title: string;
  description: string;
}

interface DerivativeEligibility {
  _id?: string;
  title: string;
  description: string;
}

interface DocumentRequirement {
  _id?: string;
  title: string;
  description: string;
}

interface E22EligibilityData {
  _id: string;
  mainTitle: string;
  mainDescription: string;
  criteriaTitle: string;
  eligibilityCriteria: EligibilityCriterion[];
  derivativeTitle: string;
  derivativeIntro: string;
  derivativeEligibility: DerivativeEligibility[];
  documentTitle: string;
  documentIntro: string;
  documentRequirements: DocumentRequirement[];
  lastUpdated?: Date;
  updatedBy?: string;
}

const EligibilitySection: React.FC = () => {
  const { settings } = useAccessibility();
  const { editMode, setEditMode, isUserAdmin } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [eligibilityData, setEligibilityData] = useState<E22EligibilityData | null>(null);
  const [originalData, setOriginalData] = useState<E22EligibilityData | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  // Fetch eligibility data from API
  useEffect(() => {
    const fetchEligibilityData = async () => {
      try {
        setLoading(true);
        const apiUrl = 'http://localhost:3002/api/v1/e22/eligibility/latest';
        console.log('Fetching eligibility data from:', apiUrl);
        const response = await fetch(apiUrl, {
          credentials: 'include',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
          },
        });
        console.log('Eligibility response status:', response.status);
        console.log('Eligibility response headers:', response.headers);
        if (!response.ok) {
          throw new Error(`Failed to fetch eligibility data: ${response.status} ${response.statusText}`);
        }

        // Clone to safely log body
        const responseClone = response.clone();
        const textData = await responseClone.text();
        console.log('Eligibility response text data:', textData.substring(0, 500) + '...');
        const data = JSON.parse(textData);
        if (data.success && data.data) {
          setEligibilityData(data.data);
          setOriginalData(data.data); // Keep a copy for cancellation
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching eligibility data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibilityData();
  }, []);

  // Handle field updates
  const handleFieldUpdate = (fieldName: string, value: string) => {
    if (!eligibilityData) return;

    setEligibilityData({
      ...eligibilityData,
      [fieldName]: value
    });
  };

  // Handle criteria updates
  const handleCriteriaUpdate = (index: number, field: 'title' | 'description', value: string) => {
    if (!eligibilityData) return;
    
    const updatedCriteria = [...eligibilityData.eligibilityCriteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: value
    };
    
    setEligibilityData({
      ...eligibilityData,
      eligibilityCriteria: updatedCriteria
    });
  };

  // Handle derivative eligibility updates
  const handleDerivativeUpdate = (index: number, field: 'title' | 'description', value: string) => {
    if (!eligibilityData) return;
    
    const updatedDerivative = [...eligibilityData.derivativeEligibility];
    updatedDerivative[index] = {
      ...updatedDerivative[index],
      [field]: value
    };
    
    setEligibilityData({
      ...eligibilityData,
      derivativeEligibility: updatedDerivative
    });
  };

  // Handle document requirement updates
  const handleDocumentUpdate = (index: number, field: 'title' | 'description', value: string) => {
    if (!eligibilityData) return;
    
    const updatedDocs = [...eligibilityData.documentRequirements];
    updatedDocs[index] = {
      ...updatedDocs[index],
      [field]: value
    };
    
    setEligibilityData({
      ...eligibilityData,
      documentRequirements: updatedDocs
    });
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (!eligibilityData) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/v1/e22/eligibility/${eligibilityData._id}`, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eligibilityData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      
      const data = await response.json();
      if (data.success) {
        setOriginalData(data.data);
        setSaveSuccess(true);
        setEditMode(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      console.error('Error saving changes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save changes coming from the form modal
  const handleFormSave = async (updated: E22EligibilityData) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/v1/e22/eligibility/${updated._id}`, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      const data = await response.json();
      if (data.success) {
        setEligibilityData(data.data);
        setOriginalData(data.data);
        setSaveSuccess(true);
        setFormOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      console.error('Error saving changes from form:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel changes and revert to original data
  const handleCancelChanges = () => {
    setEligibilityData(originalData);
    setEditMode(false);
  };

  if (loading && !eligibilityData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !eligibilityData) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error} — <strong>Please try again later.</strong>
      </Alert>
    );
  }

  if (!eligibilityData) {
    return (
      <Alert severity="warning">
        <AlertTitle>No Data</AlertTitle>
        No eligibility data available.
      </Alert>
    );
  }
  
  return (
    <Box>
      {isUserAdmin && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {!editMode ? (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setEditMode(true)}
              aria-label="Enable editing mode"
            >
              Edit Content
            </Button>
          ) : (
            <Box>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                sx={{ mr: 1 }}
                disabled={loading}
                aria-label="Save all changes"
              >
                {loading ? 'Saving...' : 'Save All'}
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                onClick={handleCancelChanges}
                disabled={loading}
                aria-label="Cancel all changes"
              >
                Cancel
              </Button>
            </Box>
          )}
          {!editMode && (
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              onClick={() => setFormOpen(true)}
              aria-label="Open form editor for eligibility content"
            >
              Edit in Form
            </Button>
          )}
        </Box>
      )}
      
      <EditableField
        content={eligibilityData.mainTitle}
        onSave={(value) => handleFieldUpdate('mainTitle', value)}
        variant="h5"
        fieldId="eligibility-main-title"
        component="h2"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mb: 2,
          ...headingProps
        }}
      />

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          ...contrastProps
        }}
      >
        <EditableField
          content={eligibilityData.mainDescription}
          onSave={(value) => handleFieldUpdate('mainDescription', value)}
          variant="body1"
          fieldId="eligibility-main-description"
          multiline
          minRows={2}
          sx={{ 
            ...textSizeProps,
            mb: 2
          }}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                border: highContrast ? '1px solid #000000' : 'none',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: highContrast ? '#000000' : '#003366',
                  color: '#ffffff',
                  px: 3,
                  py: 0.5,
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  ...textSizeProps
                }}
              >
                <EditableField
                  content={eligibilityData.criteriaTitle}
                  onSave={(value) => handleFieldUpdate('criteriaTitle', value)}
                  fieldId="eligibility-criteria-title"
                  variant="body1"
                  sx={{ color: '#ffffff', fontWeight: 'bold' }}
                />
              </Box>
              
              <CardContent sx={{ mt: 4.5, pt: 7, pb: 2 }}>
                <Box sx={{ height: 10 }}></Box>
                <List sx={{ '& .MuiListItem-root': { py: 1.5 } }}>
                  {eligibilityData.eligibilityCriteria.map((criterion, index) => (
                    <EditableListItem
                      key={`criterion-${index}`}
                      icon={<CheckIcon sx={{ color: highContrast ? '#000000' : '#4CAF50' }} />}
                      primary={criterion.title}
                      secondary={criterion.description}
                      onPrimarySave={(value) => handleCriteriaUpdate(index, 'title', value)}
                      onSecondarySave={(value) => handleCriteriaUpdate(index, 'description', value)}
                      primaryId={`criterion-title-${index}`}
                      secondaryId={`criterion-desc-${index}`}
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#fff4f4',
                border: highContrast ? '1px solid #000000' : 'none',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: highContrast ? '#000000' : '#B31B1B',
                  color: '#ffffff',
                  px: 3,
                  py: 0.5,
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  ...textSizeProps
                }}
              >
                <EditableField
                  content={eligibilityData.derivativeTitle}
                  onSave={(value) => handleFieldUpdate('derivativeTitle', value)}
                  fieldId="eligibility-derivative-title"
                  variant="body1"
                  sx={{ color: '#ffffff', fontWeight: 'bold' }}
                />
              </Box>
              
              <CardContent sx={{ mt: 4.5, pt: 7, pb: 2 }}>
                <Box sx={{ height: 10 }}></Box>
                <Box sx={{ mt: 2 }}>
                  <EditableField
                    content={eligibilityData.derivativeIntro}
                    onSave={(value) => handleFieldUpdate('derivativeIntro', value)}
                    variant="body1"
                    fieldId="derivative-intro"
                    multiline
                    sx={{ mb: 2, ...textSizeProps }}
                  />
                </Box>
                <List sx={{ '& .MuiListItem-root': { py: 1.5 } }}>
                  {eligibilityData.derivativeEligibility.map((item, index) => (
                    <EditableListItem
                      key={`derivative-${index}`}
                      icon={<ClearIcon sx={{ color: highContrast ? '#000000' : '#B31B1B' }} />}
                      primary={item.title}
                      secondary={item.description}
                      onPrimarySave={(value) => handleDerivativeUpdate(index, 'title', value)}
                      onSecondarySave={(value) => handleDerivativeUpdate(index, 'description', value)}
                      primaryId={`derivative-title-${index}`}
                      secondaryId={`derivative-desc-${index}`}
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <EditableField
          content={eligibilityData.documentTitle}
          onSave={(value) => handleFieldUpdate('documentTitle', value)}
          variant="h6"
          fieldId="document-title"
          component="h3"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
              }}
            >
              <CardContent>
                <EditableField
                  content={eligibilityData.documentIntro}
                  onSave={(value) => handleFieldUpdate('documentIntro', value)}
                  variant="body1"
                  fieldId="document-intro"
                  multiline
                  sx={{ 
                    mb: 2,
                    ...textSizeProps
                  }}
                />
                
                <List dense>
                  {eligibilityData.documentRequirements.slice(0, 2).map((doc, index) => (
                    <EditableListItem
                      key={`doc-${index}`}
                      icon={<WarningAmberIcon sx={{ color: highContrast ? '#000000' : '#FF9800' }} />}
                      primary={doc.title}
                      secondary={doc.description}
                      onPrimarySave={(value) => handleDocumentUpdate(index, 'title', value)}
                      onSecondarySave={(value) => handleDocumentUpdate(index, 'description', value)}
                      primaryId={`doc-title-${index}`}
                      secondaryId={`doc-desc-${index}`}
                      dense
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
              }}
            >
              <CardContent>
                <List dense>
                  {eligibilityData.documentRequirements.slice(2).map((doc, index) => (
                    <EditableListItem
                      key={`doc-${index + 2}`}
                      icon={<WarningAmberIcon sx={{ color: highContrast ? '#000000' : '#FF9800' }} />}
                      primary={doc.title}
                      secondary={doc.description}
                      onPrimarySave={(value) => handleDocumentUpdate(index + 2, 'title', value)}
                      onSecondarySave={(value) => handleDocumentUpdate(index + 2, 'description', value)}
                      primaryId={`doc-title-${index + 2}`}
                      secondaryId={`doc-desc-${index + 2}`}
                      dense
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mt: 4,
          ...headingProps
        }}
      >
        Verification Process
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          ...contrastProps
        }}
      >
        <Typography 
          variant="body1" 
          paragraph
          sx={{ ...textSizeProps }}
        >
          USCIS employs several methods to verify eligibility for E22 classification:
        </Typography>
        
        <List sx={{ '& .MuiListItem-root': { py: 1.5 } }}>
          <ListItem>
            <ListItemIcon>
              <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Marriage documentation review" 
              secondary="Marriage certificates, joint financial records, shared lease/property documents"
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
              <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Interviews" 
              secondary="May be required to establish the legitimacy of the marital relationship"
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
              <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Biometric and background checks" 
              secondary="Required for all applicants to identify security or inadmissibility concerns"
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
              <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary={<>
                <a 
                  href="https://www.uscis.gov/sites/default/files/USCIS/Outreach/Draft%20Request%20for%20Evidence%20(RFE)%20Template%20for%20Comment/E11_RFE_Template_1-10-11.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: highContrast ? '#000000' : '#0066cc',
                    textDecoration: 'underline'
                  }}
                  aria-label="Request for Evidence (RFE) Template (opens in a new tab as PDF)"
                >
                  Request for Evidence (RFE)
                </a>
              </>}
              secondary="May be issued if initial documentation is insufficient to establish eligibility"
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
              <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Form I-485 Submission" 
              secondary={
                <>
                  <span>Application to Register Permanent Residence or Adjust Status for applicants already in the United States</span>
                  <br />
                  <a 
                    href="https://www.uscis.gov/i-485" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: highContrast ? '#000000' : '#0066cc',
                      marginTop: '8px',
                      display: 'inline-block',
                      textDecoration: 'underline',
                      fontWeight: 'bold'
                    }}
                    aria-label="Form I-485, Application to Register Permanent Residence or Adjust Status (opens in a new tab)"
                  >
                    View Form on USCIS Website
                  </a>
                </>
              }
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                mb: 1,
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
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSaveSuccess(false)} severity="success">
          Changes saved successfully!
        </Alert>
      </Snackbar>

      {/* Form Mode Modal */}
      <EligibilityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        data={eligibilityData}
        onSave={handleFormSave}
        loading={loading}
      />
    </Box>
  );
};

export default EligibilitySection;

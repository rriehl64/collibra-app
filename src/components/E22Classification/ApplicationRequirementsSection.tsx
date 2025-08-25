import React, { useEffect, useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import EditableField from '../shared/EditableField';
import EditableListItem from '../shared/EditableListItem';
import EditableFormItem from '../shared/EditableFormItem';
import ApplicationRequirementsForm from './ApplicationRequirementsForm';

// Interfaces
interface RequirementItem {
  _id?: string;
  title: string;
  description: string;
}

interface FormItem {
  _id?: string;
  formName: string;
  formDescription: string;
  formUrl: string;
}

interface SupportingDocItem {
  _id?: string;
  title: string;
  description: string;
  isRequired: boolean;
}

interface ApplicationTipItem {
  _id?: string;
  title: string;
  description: string;
}

interface ApplicationRequirementsData {
  _id?: string;
  mainTitle: string;
  mainDescription: string;
  generalRequirementsTitle: string;
  generalRequirements: RequirementItem[];
  formsTitle: string;
  forms: FormItem[];
  supportingDocsTitle: string;
  supportingDocuments: SupportingDocItem[];
  tipsTitle: string;
  applicationTips: ApplicationTipItem[];
  lastUpdated?: Date;
  updatedBy?: string;
}

const ApplicationRequirementsSection: React.FC = () => {
  const { settings } = useAccessibility();
  const { editMode, setEditMode, isUserAdmin } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const [data, setData] = useState<ApplicationRequirementsData | null>(null);
  const [originalData, setOriginalData] = useState<ApplicationRequirementsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = 'http://localhost:3002/api/v1/e22/application-requirements/latest';
        console.log('Fetching application requirements from:', apiUrl);
        const response = await fetch(apiUrl, {
          credentials: 'include',
          mode: 'cors',
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
        setOriginalData(JSON.parse(JSON.stringify(result.data))); // Deep copy for cancel functionality
        setError(null);
      } catch (err) {
        setError('Failed to load application requirements data. Please try again.');
        console.error('Error fetching application requirements data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle saving changes to the API
  const handleSaveChanges = () => {
    if (!data || !data._id) return;

    setLoading(true);

    fetch(`http://localhost:3002/api/v1/e22/application-requirements/${data._id}`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        setData(result.data);
        setOriginalData(JSON.parse(JSON.stringify(result.data)));
        setSaveSuccess(true);
      })
      .catch((err) => {
        console.error('Error saving application requirements:', err);
        setSaveError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Handle cancel changes
  const handleCancelChanges = () => {
    if (originalData) {
      setData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  // Form modal save handler
  const handleFormSave = async (updated: ApplicationRequirementsData) => {
    if (!updated || !updated._id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3002/api/v1/e22/application-requirements/${updated._id}`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setData(result.data);
      setOriginalData(JSON.parse(JSON.stringify(result.data)));
      setSaveSuccess(true);
      setFormOpen(false);
    } catch (err) {
      console.error('Error saving application requirements (form):', err);
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  // Click-anywhere to edit: focus first editable field
  const focusFirstEditable = () => {
    const candidates = [
      'application-requirements-title',
      'application-requirements-description',
      'general-requirements-title'
    ];
    for (const id of candidates) {
      const el = document.getElementById(id);
      if (el && 'focus' in el) {
        (el as HTMLElement).focus();
        break;
      }
    }
  };
  
  // Field update handlers
  const updateField = (field: keyof ApplicationRequirementsData, value: string) => {
    if (data) {
      setData({ ...data, [field]: value });
    }
  };
  
  const updateRequirement = (index: number, field: keyof RequirementItem, value: string) => {
    if (data && data.generalRequirements[index]) {
      const updatedRequirements = [...data.generalRequirements];
      updatedRequirements[index] = { ...updatedRequirements[index], [field]: value };
      setData({ ...data, generalRequirements: updatedRequirements });
    }
  };
  
  const updateForm = (index: number, updatedForm: FormItem) => {
    if (data && data.forms[index]) {
      const updatedForms = [...data.forms];
      updatedForms[index] = updatedForm;
      setData({ ...data, forms: updatedForms });
    }
  };
  
  const addNewForm = () => {
    if (data) {
      const newForm: FormItem = {
        formName: 'New Form',
        formDescription: 'Form description',
        formUrl: 'https://www.uscis.gov/'
      };
      setData({ ...data, forms: [...data.forms, newForm] });
    }
  };
  
  const removeForm = (index: number) => {
    if (data && data.forms[index]) {
      const updatedForms = [...data.forms];
      updatedForms.splice(index, 1);
      setData({ ...data, forms: updatedForms });
    }
  };
  
  const updateSupportingDoc = (index: number, field: keyof SupportingDocItem, value: string | boolean) => {
    if (data && data.supportingDocuments[index]) {
      const updatedDocs = [...data.supportingDocuments];
      updatedDocs[index] = { ...updatedDocs[index], [field]: value };
      setData({ ...data, supportingDocuments: updatedDocs });
    }
  };

  const addNewSupportingDoc = () => {
    if (data) {
      const newDoc: SupportingDocItem = {
        title: 'New Supporting Document',
        description: 'Document description',
        isRequired: false
      };
      setData({ ...data, supportingDocuments: [...data.supportingDocuments, newDoc] });
    }
  };
  
  const removeSupportingDoc = (index: number) => {
    if (data && data.supportingDocuments[index]) {
      const updatedDocs = [...data.supportingDocuments];
      updatedDocs.splice(index, 1);
      setData({ ...data, supportingDocuments: updatedDocs });
    }
  };
  
  const updateApplicationTip = (index: number, field: keyof ApplicationTipItem, value: string) => {
    if (data && data.applicationTips[index]) {
      const updatedTips = [...data.applicationTips];
      updatedTips[index] = { ...updatedTips[index], [field]: value };
      setData({ ...data, applicationTips: updatedTips });
    }
  };

  const addNewApplicationTip = () => {
    if (data) {
      const newTip: ApplicationTipItem = {
        title: 'New Application Tip',
        description: 'Tip description'
      };
      setData({ ...data, applicationTips: [...data.applicationTips, newTip] });
    }
  };
  
  const removeApplicationTip = (index: number) => {
    if (data && data.applicationTips[index]) {
      const updatedTips = [...data.applicationTips];
      updatedTips.splice(index, 1);
      setData({ ...data, applicationTips: updatedTips });
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !data) {
    return (
      <Box sx={{ my: 2 }}>
        <Alert severity="error">{error || 'Failed to load application requirements data.'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Save/Cancel buttons for admin users */}
      {isUserAdmin && editMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelChanges}
            startIcon={<CancelIcon />}
            sx={{ mr: 1 }}
            aria-label="Cancel changes"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            startIcon={<SaveIcon />}
            aria-label="Save changes"
          >
            Save Changes
          </Button>
        </Box>
      )}

      {/* Edit controls for admin when not in inline edit mode */}
      {isUserAdmin && !editMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            aria-label="Enable editing mode for Application Requirements"
          >
            Edit Content
          </Button>
          <Button
            variant="contained"
            onClick={() => setFormOpen(true)}
            aria-label="Edit Application Requirements in form mode"
          >
            Edit in Form
          </Button>
        </Box>
      )}
      
      {/* Success/Error messages */}
      <Snackbar open={saveSuccess} autoHideDuration={3000} onClose={() => setSaveSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Application requirements updated successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar open={saveError} autoHideDuration={3000} onClose={() => setSaveError(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to save changes. Please try again.
        </Alert>
      </Snackbar>
      
      <EditableField
        content={data.mainTitle}
        onSave={(value) => updateField('mainTitle', value)}
        variant="h5"
        component="h2"
        fieldId="application-requirements-title"
        ariaLabel="Application requirements title"
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
        tabIndex={0}
        aria-label="Application Requirements section. Activate to start editing."
        onClick={focusFirstEditable}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            focusFirstEditable();
          }
        }}
      >
        <EditableField 
          content={data.mainDescription}
          onSave={(value) => updateField('mainDescription', value)}
          variant="body1" 
          fieldId="application-requirements-description"
          ariaLabel="Application requirements description"
          multiline
          sx={{ ...textSizeProps }}
        />

        <EditableField 
          content={data.generalRequirementsTitle}
          onSave={(value) => updateField('generalRequirementsTitle', value)}
          variant="h6" 
          fieldId="general-requirements-title"
          ariaLabel="General requirements title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            mt: 2,
            ...textSizeProps
          }}
        />

        <Stepper orientation="vertical" sx={{ mt: 3 }}>
          {data.generalRequirements.map((req, index) => (
            <Step active key={req._id || index}>
              <StepLabel 
                StepIconProps={{ 
                  sx: { color: highContrast ? '#000000' : '#003366' }
                }}
              >
                <EditableField 
                  content={req.title}
                  onSave={(value) => updateRequirement(index, 'title', value)}
                  variant="subtitle1" 
                  fieldId={`general-req-title-${index}`}
                  ariaLabel={`General requirement title ${index + 1}`}
                  sx={{ 
                    fontWeight: 'bold',
                    color: highContrast ? '#000000' : '#003366',
                    ...textSizeProps
                  }}
                />
              </StepLabel>
              <StepContent>
                <EditableField
                  content={req.description}
                  onSave={(value) => updateRequirement(index, 'description', value)}
                  variant="body1"
                  fieldId={`general-req-desc-${index}`}
                  ariaLabel={`General requirement description ${index + 1}`}
                  multiline
                  sx={{ ...textSizeProps }}
                />
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 4 }} />
        
        {/* Forms Section */}
        <EditableField 
          content={data.formsTitle}
          onSave={(value) => updateField('formsTitle', value)}
          variant="h6" 
          fieldId="forms-title"
          ariaLabel="Required forms title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {data.forms.map((form, index) => (
            <Grid item xs={12} md={6} key={form._id || index}>
              <EditableFormItem
                formData={form}
                onUpdate={(updatedForm) => updateForm(index, updatedForm)}
                onDelete={() => removeForm(index)}
                highContrast={highContrast}
                largeText={largeText}
                textSizeProps={textSizeProps}
                index={index}
              />
            </Grid>
          ))}
          
          {/* Add new form button for admin users */}
          {isUserAdmin && editMode && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={addNewForm}
                  startIcon={<AddIcon />}
                  aria-label="Add new form"
                  sx={{
                    borderColor: highContrast ? '#000000' : '#003366',
                    color: highContrast ? '#000000' : '#003366'
                  }}
                >
                  Add New Form
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        {/* Supporting Documents Section */}
        <EditableField 
          content={data.supportingDocsTitle}
          onSave={(value) => updateField('supportingDocsTitle', value)}
          variant="h6" 
          fieldId="supporting-docs-title"
          ariaLabel="Supporting documents title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {data.supportingDocuments.map((doc, index) => (
            <Grid item xs={12} md={6} key={doc._id || index}>
              <Card 
                variant="outlined"
                sx={{ 
                  height: '100%',
                  border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachFileIcon sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      mr: 1
                    }} />
                    <EditableField 
                      content={doc.title}
                      onSave={(value) => updateSupportingDoc(index, 'title', value)}
                      variant="subtitle1"
                      fieldId={`supporting-doc-title-${index}`}
                      ariaLabel={`Supporting document title ${index + 1}`}
                      sx={{ 
                        fontWeight: 'bold',
                        color: highContrast ? '#000000' : '#003366',
                        ...textSizeProps
                      }}
                    />
                  </Box>
                  
                  <EditableField 
                    content={doc.description}
                    onSave={(value) => updateSupportingDoc(index, 'description', value)}
                    variant="body2"
                    fieldId={`supporting-doc-desc-${index}`}
                    ariaLabel={`Supporting document description ${index + 1}`}
                    multiline
                    sx={{ ...textSizeProps }}
                  />
                  
                  {isUserAdmin && editMode && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1, ...textSizeProps }}>
                        Required:
                      </Typography>
                      <input 
                        type="checkbox"
                        checked={doc.isRequired}
                        onChange={(e) => updateSupportingDoc(index, 'isRequired', e.target.checked)}
                        aria-label={`Mark ${doc.title} as required`}
                      />
                    </Box>
                  )}
                  
                  {!editMode && doc.isRequired && (
                    <Box sx={{ mt: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: highContrast ? '#000000' : '#B31B1B',
                          fontWeight: 'bold',
                          ...textSizeProps
                        }}
                      >
                        Required document
                      </Typography>
                    </Box>
                  )}

                  {isUserAdmin && editMode && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => removeSupportingDoc(index)}
                        aria-label={`Delete ${doc.title}`}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Add new supporting document button for admin users */}
          {isUserAdmin && editMode && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={addNewSupportingDoc}
                  startIcon={<AddIcon />}
                  aria-label="Add new supporting document"
                  sx={{
                    borderColor: highContrast ? '#000000' : '#003366',
                    color: highContrast ? '#000000' : '#003366'
                  }}
                >
                  Add New Supporting Document
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        {/* Application Tips Section */}
        <EditableField 
          content={data.tipsTitle}
          onSave={(value) => updateField('tipsTitle', value)}
          variant="h6" 
          fieldId="tips-title"
          ariaLabel="Application tips title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {data.applicationTips.map((tip, index) => (
            <Grid item xs={12} md={6} key={tip._id || index}>
              <Card 
                variant="outlined"
                sx={{ 
                  height: '100%',
                  border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LightbulbOutlinedIcon sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      mr: 1
                    }} />
                    <EditableField 
                      content={tip.title}
                      onSave={(value) => updateApplicationTip(index, 'title', value)}
                      variant="subtitle1"
                      fieldId={`application-tip-title-${index}`}
                      ariaLabel={`Application tip title ${index + 1}`}
                      sx={{ 
                        fontWeight: 'bold',
                        color: highContrast ? '#000000' : '#003366',
                        ...textSizeProps
                      }}
                    />
                  </Box>
                  
                  <EditableField 
                    content={tip.description}
                    onSave={(value) => updateApplicationTip(index, 'description', value)}
                    variant="body2"
                    fieldId={`application-tip-desc-${index}`}
                    ariaLabel={`Application tip description ${index + 1}`}
                    multiline
                    sx={{ ...textSizeProps }}
                  />

                  {isUserAdmin && editMode && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => removeApplicationTip(index)}
                        aria-label={`Delete ${tip.title}`}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Add new application tip button for admin users */}
          {isUserAdmin && editMode && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={addNewApplicationTip}
                  startIcon={<AddIcon />}
                  aria-label="Add new application tip"
                  sx={{
                    borderColor: highContrast ? '#000000' : '#003366',
                    color: highContrast ? '#000000' : '#003366'
                  }}
                >
                  Add New Application Tip
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Modal Form for editing */}
      <ApplicationRequirementsForm
        open={formOpen}
        data={data}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
        highContrast={highContrast}
        largeText={largeText}
      />
    </Box>
  );
};

export default ApplicationRequirementsSection;

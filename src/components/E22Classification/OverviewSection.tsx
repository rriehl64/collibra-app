import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import EditableField from '../shared/EditableField';
import EditableCard from '../shared/EditableCard';
import OverviewForm from './OverviewForm';
import { E22OverviewData } from './types';
import PrimaryButton from '../shared/PrimaryButton';

interface KeyFeature {
  _id?: string;
  title: string;
  description: string;
}

interface ImportanceParagraph {
  _id?: string;
  paragraph: string;
}

// Using the imported E22OverviewData interface from types.ts

const OverviewSection: React.FC = () => {
  const { settings } = useAccessibility();
  const { editMode, setEditMode, isUserAdmin } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [overviewData, setOverviewData] = useState<E22OverviewData | null>(null);
  const [originalData, setOriginalData] = useState<E22OverviewData | null>(null);
  const [formMode, setFormMode] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  // Fetch overview data from API
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const apiUrl = 'http://localhost:3002/api/v1/e22/overview/latest';
        console.log('Fetching overview data from:', apiUrl);
        const response = await fetch(apiUrl, {
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch overview data: ${response.status} ${response.statusText}`);
        }
        
        // Clone the response for debugging
        const responseClone = response.clone();
        const textData = await responseClone.text();
        console.log('Response text data:', textData.substring(0, 500) + '...');
        
        // Try parsing the JSON
        let data;
        try {
          data = JSON.parse(textData);
        } catch (error) {
          console.error('JSON parse error:', error);
          throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (data.success && data.data) {
          setOverviewData(data.data);
          setOriginalData(data.data); // Keep a copy for cancellation
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching overview data:', err);
      
      // Additional error details
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An unknown error occurred');
      }
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Handle field updates
  const handleFieldUpdate = (fieldName: string, value: string) => {
    if (!overviewData) return;

    setOverviewData({
      ...overviewData,
      [fieldName]: value
    });
  };

  // Handle feature card updates
  const handleFeatureUpdate = (index: number, field: 'title' | 'description', value: string) => {
    if (!overviewData) return;
    
    const updatedFeatures = [...overviewData.keyFeatures];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    setOverviewData({
      ...overviewData,
      keyFeatures: updatedFeatures
    });
  };

  // Handle importance paragraph updates
  const handleParagraphUpdate = (index: number, value: string) => {
    if (!overviewData) return;
    
    const updatedParagraphs = [...overviewData.importanceDescription];
    updatedParagraphs[index] = {
      ...updatedParagraphs[index],
      paragraph: value
    };
    
    setOverviewData({
      ...overviewData,
      importanceDescription: updatedParagraphs
    });
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (!overviewData) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/v1/e22/overview/${overviewData._id}`, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(overviewData)
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

  // Cancel changes and revert to original data
  const handleCancelChanges = () => {
    setOverviewData(originalData);
    setEditMode(false);
  };

  if (loading && !overviewData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !overviewData) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error} — <strong>Please try again later.</strong>
      </Alert>
    );
  }

  if (!overviewData) {
    return (
      <Alert severity="warning">
        <AlertTitle>No Data</AlertTitle>
        No overview data available.
      </Alert>
    );
  }
  
  return (
    <Box>
      {isUserAdmin && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {!editMode ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PrimaryButton
                startIcon={<EditIcon />}
                onClick={() => {
                  setEditMode(true);
                  setFormMode(false);
                }}
                aria-label="Enable individual editing mode"
              >
                Field Editor
              </PrimaryButton>
              <Tooltip title="Open form editor">
                <PrimaryButton
                  startIcon={<ListAltIcon />}
                  onClick={() => {
                    setIsFormOpen(true);
                  }}
                  aria-label="Open form editor for Overview"
                >
                  Form Editor
                </PrimaryButton>
              </Tooltip>
            </Box>
          ) : (
            <Box>
              <PrimaryButton
                startIcon={<SaveIcon />}
                onClick={handleSaveChanges}
                sx={{ mr: 1 }}
                disabled={loading}
                aria-label="Save all changes"
              >
                {loading ? 'Saving...' : 'Save All'}
              </PrimaryButton>
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
        </Box>
      )}
      
      <EditableField
        content={overviewData.mainTitle}
        onSave={(value) => handleFieldUpdate('mainTitle', value)}
        variant="h5"
        fieldId="overview-main-title"
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
          content={overviewData.mainDescription}
          onSave={(value) => handleFieldUpdate('mainDescription', value)}
          variant="body1"
          fieldId="overview-main-description"
          multiline
          minRows={3}
          sx={{ 
            ...textSizeProps,
            mb: 2
          }}
        />

        <Divider sx={{ my: 3 }} />

        <EditableField
          content={overviewData.featuresTitle}
          onSave={(value) => handleFieldUpdate('featuresTitle', value)}
          variant="h6"
          fieldId="overview-features-title"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {overviewData.keyFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={`feature-${index}`}>
              <EditableCard
                title={feature.title}
                description={feature.description}
                onTitleSave={(value) => handleFeatureUpdate(index, 'title', value)}
                onDescriptionSave={(value) => handleFeatureUpdate(index, 'description', value)}
                titleId={`feature-title-${index}`}
                descriptionId={`feature-description-${index}`}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <EditableField
        content={overviewData.importanceTitle}
        onSave={(value) => handleFieldUpdate('importanceTitle', value)}
        variant="h5"
        fieldId="overview-importance-title"
        component="h2"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mt: 4,
          mb: 2,
          ...headingProps
        }}
      />

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          ...contrastProps
        }}
      >
        {overviewData.importanceDescription.map((item, index) => (
          <EditableField
            key={`importance-para-${index}`}
            content={item.paragraph}
            onSave={(value) => handleParagraphUpdate(index, value)}
            variant="body1"
            fieldId={`importance-para-${index}`}
            multiline
            minRows={2}
            sx={{ 
              ...textSizeProps,
              mb: 2
            }}
          />
        ))}
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
      
      {/* Form Mode Dialog */}
      <OverviewForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        data={overviewData}
        onSave={async (updatedData) => {
          try {
            setLoading(true);
            const response = await fetch(`http://localhost:3002/api/v1/e22/overview/${updatedData._id}`, {
              credentials: 'include',
              mode: 'cors',
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to save changes');
            }
            
            const data = await response.json();
            if (data.success) {
              setOverviewData(data.data);
              setOriginalData(data.data);
              setSaveSuccess(true);
              setIsFormOpen(false);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save changes');
            console.error('Error saving changes:', err);
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
      />
    </Box>
  );
};

export default OverviewSection;

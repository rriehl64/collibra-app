import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { E22OverviewData, KeyFeature, ImportanceParagraph } from '../../components/E22Classification/types';

interface OverviewFormProps {
  open: boolean;
  onClose: () => void;
  data: E22OverviewData | null;
  onSave: (updatedData: E22OverviewData) => void;
  loading: boolean;
}

const OverviewForm: React.FC<OverviewFormProps> = ({
  open,
  onClose,
  data,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState<E22OverviewData | null>(null);
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  // Initialize form data when the modal opens
  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data, open]);

  if (!formData) return null;

  // Handle main field changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  // Handle feature changes
  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedFeatures = [...formData.keyFeatures];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      keyFeatures: updatedFeatures
    });
  };

  // Handle importance paragraph changes
  const handleParagraphChange = (index: number, value: string) => {
    const updatedParagraphs = [...formData.importanceDescription];
    updatedParagraphs[index] = {
      ...updatedParagraphs[index],
      paragraph: value
    };
    
    setFormData({
      ...formData,
      importanceDescription: updatedParagraphs
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const contrastProps = highContrast ? { color: '#000000' } : {};

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-overview-form-title"
      scroll="paper"
    >
      <DialogTitle 
        id="edit-overview-form-title"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          ...textSizeProps
        }}
      >
        Edit E22 Overview Content
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Main Content
            </Typography>
            <TextField
              label="Main Title"
              value={formData.mainTitle}
              onChange={(e) => handleFieldChange('mainTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Main Title', ...textSizeProps }}
              InputLabelProps={{ 
                sx: { ...textSizeProps }
              }}
            />
            <TextField
              label="Main Description"
              value={formData.mainDescription}
              onChange={(e) => handleFieldChange('mainDescription', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              required
              inputProps={{ 'aria-label': 'Main Description', ...textSizeProps }}
              InputLabelProps={{ 
                sx: { ...textSizeProps }
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Key Features
            </Typography>
            <TextField
              label="Features Section Title"
              value={formData.featuresTitle}
              onChange={(e) => handleFieldChange('featuresTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Features Section Title', ...textSizeProps }}
              InputLabelProps={{ 
                sx: { ...textSizeProps }
              }}
            />
            
            {formData.keyFeatures.map((feature: KeyFeature, index: number) => (
              <Paper 
                key={feature._id || `feature-${index}`} 
                elevation={1} 
                sx={{ p: 2, my: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ ...contrastProps }}>
                  Feature {index + 1}
                </Typography>
                <TextField
                  label="Feature Title"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  inputProps={{ 
                    'aria-label': `Feature ${index + 1} Title`,
                    ...textSizeProps 
                  }}
                  InputLabelProps={{ 
                    sx: { ...textSizeProps }
                  }}
                />
                <TextField
                  label="Feature Description"
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  inputProps={{ 
                    'aria-label': `Feature ${index + 1} Description`,
                    ...textSizeProps 
                  }}
                  InputLabelProps={{ 
                    sx: { ...textSizeProps }
                  }}
                />
              </Paper>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Importance Section
            </Typography>
            <TextField
              label="Importance Section Title"
              value={formData.importanceTitle}
              onChange={(e) => handleFieldChange('importanceTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Importance Section Title', ...textSizeProps }}
              InputLabelProps={{ 
                sx: { ...textSizeProps }
              }}
            />
            
            {formData.importanceDescription.map((item: ImportanceParagraph, index: number) => (
              <TextField
                key={item._id || `paragraph-${index}`}
                label={`Paragraph ${index + 1}`}
                value={item.paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                required
                inputProps={{ 
                  'aria-label': `Paragraph ${index + 1}`,
                  ...textSizeProps 
                }}
                InputLabelProps={{ 
                  sx: { ...textSizeProps }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            sx={{
              bgcolor: highContrast ? '#000000' : '#003366',
              '&:hover': {
                bgcolor: highContrast ? '#333333' : '#002244',
              }
            }}
          >
            {loading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OverviewForm;

import React, { useEffect, useState } from 'react';
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
import PrimaryButton from '../shared/PrimaryButton';

interface ReferenceItem {
  _id?: string;
  title: string;
  description: string;
}

interface E22LegalFoundationData {
  _id: string;
  mainTitle: string;
  mainDescription: string;
  keyPrinciplesTitle: string;
  keyPrinciples: string[];
  referencesTitle: string;
  references: ReferenceItem[];
  lastUpdated?: Date;
  updatedBy?: string;
}

interface LegalFoundationFormProps {
  open: boolean;
  onClose: () => void;
  data: E22LegalFoundationData | null;
  onSave: (updatedData: E22LegalFoundationData) => void;
  loading: boolean;
}

const LegalFoundationForm: React.FC<LegalFoundationFormProps> = ({ open, onClose, data, onSave, loading }) => {
  const [formData, setFormData] = useState<E22LegalFoundationData | null>(null);
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  useEffect(() => {
    if (data) setFormData({ ...data });
  }, [data, open]);

  if (!formData) return null;

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const contrastProps = highContrast ? { color: '#000000' } : {};

  const handleFieldChange = (fieldName: keyof E22LegalFoundationData, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handlePrincipleChange = (index: number, value: string) => {
    const updated = [...formData.keyPrinciples];
    updated[index] = value;
    setFormData({ ...formData, keyPrinciples: updated });
  };

  const handleReferenceChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.references];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, references: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-legal-foundation-form-title"
      scroll="paper"
    >
      <DialogTitle
        id="edit-legal-foundation-form-title"
        sx={{
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          ...textSizeProps,
        }}
      >
        Edit Legal Foundation Content
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {/* Main Content */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Main Content
            </Typography>
            <TextField
              label="Main Title"
              value={formData.mainTitle}
              onChange={(e) => handleFieldChange('mainTitle' as keyof E22LegalFoundationData, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Main Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            <TextField
              label="Main Description"
              value={formData.mainDescription}
              onChange={(e) => handleFieldChange('mainDescription' as keyof E22LegalFoundationData, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              required
              inputProps={{ 'aria-label': 'Main Description', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Key Legal Principles */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Key Legal Principles
            </Typography>
            <TextField
              label="Section Title"
              value={formData.keyPrinciplesTitle}
              onChange={(e) => handleFieldChange('keyPrinciplesTitle' as keyof E22LegalFoundationData, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Key Principles Section Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            <Grid container spacing={2}>
              {formData.keyPrinciples.map((principle, index) => (
                <Grid item xs={12} key={`principle-${index}`}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}>
                    <TextField
                      label={`Principle ${index + 1}`}
                      value={principle}
                      onChange={(e) => handlePrincipleChange(index, e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      inputProps={{ 'aria-label': `Principle ${index + 1}`, ...textSizeProps }}
                      InputLabelProps={{ sx: { ...textSizeProps } }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* References */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Supporting Regulations and Policy Guidance
            </Typography>
            <TextField
              label="Section Title"
              value={formData.referencesTitle}
              onChange={(e) => handleFieldChange('referencesTitle' as keyof E22LegalFoundationData, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'References Section Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            <Grid container spacing={2}>
              {formData.references.map((ref, index) => (
                <Grid item xs={12} key={ref._id || `ref-${index}`}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ ...contrastProps }}>
                      Reference {index + 1}
                    </Typography>
                    <TextField
                      label="Title"
                      value={ref.title}
                      onChange={(e) => handleReferenceChange(index, 'title', e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      inputProps={{ 'aria-label': `Reference ${index + 1} Title`, ...textSizeProps }}
                      InputLabelProps={{ sx: { ...textSizeProps } }}
                    />
                    <TextField
                      label="Description"
                      value={ref.description}
                      onChange={(e) => handleReferenceChange(index, 'description', e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={3}
                      required
                      inputProps={{ 'aria-label': `Reference ${index + 1} Description`, ...textSizeProps }}
                      InputLabelProps={{ sx: { ...textSizeProps } }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <PrimaryButton onClick={onClose} disabled={loading} aria-label="Cancel form editing">
            Cancel
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            disabled={loading}
            aria-label="Save all changes in Legal Foundation form"
          >
            {loading ? 'Saving...' : 'Save All Changes'}
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LegalFoundationForm;

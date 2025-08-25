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

export interface E22EligibilityData {
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

interface EligibilityFormProps {
  open: boolean;
  onClose: () => void;
  data: E22EligibilityData | null;
  onSave: (updatedData: E22EligibilityData) => void;
  loading: boolean;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({ open, onClose, data, onSave, loading }) => {
  const [formData, setFormData] = useState<E22EligibilityData | null>(null);
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data, open]);

  if (!formData) return null;

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const contrastProps = highContrast ? { color: '#000000' } : {};

  const handleFieldChange = (fieldName: keyof E22EligibilityData, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleCriteriaChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.eligibilityCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, eligibilityCriteria: updated });
  };

  const handleDerivativeChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.derivativeEligibility];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, derivativeEligibility: updated });
  };

  const handleDocumentChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.documentRequirements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, documentRequirements: updated });
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
      aria-labelledby="edit-eligibility-form-title"
      scroll="paper"
    >
      <DialogTitle
        id="edit-eligibility-form-title"
        sx={{
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          ...textSizeProps,
        }}
      >
        Edit E22 Eligibility Content
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
              onChange={(e) => handleFieldChange('mainTitle', e.target.value)}
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
              onChange={(e) => handleFieldChange('mainDescription', e.target.value)}
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

          {/* Eligibility Criteria */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Primary Eligibility Criteria
            </Typography>
            <TextField
              label="Criteria Section Title"
              value={formData.criteriaTitle}
              onChange={(e) => handleFieldChange('criteriaTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Criteria Section Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            {formData.eligibilityCriteria.map((criterion, index) => (
              <Paper key={criterion._id || `criterion-${index}`} elevation={1} sx={{ p: 2, my: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ ...contrastProps }}>
                  Criterion {index + 1}
                </Typography>
                <TextField
                  label="Criterion Title"
                  value={criterion.title}
                  onChange={(e) => handleCriteriaChange(index, 'title', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  inputProps={{ 'aria-label': `Criterion ${index + 1} Title`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
                <TextField
                  label="Criterion Description"
                  value={criterion.description}
                  onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  inputProps={{ 'aria-label': `Criterion ${index + 1} Description`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
              </Paper>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Derivative Eligibility */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Derivative Status Considerations
            </Typography>
            <TextField
              label="Derivative Section Title"
              value={formData.derivativeTitle}
              onChange={(e) => handleFieldChange('derivativeTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Derivative Section Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            <TextField
              label="Derivative Intro"
              value={formData.derivativeIntro}
              onChange={(e) => handleFieldChange('derivativeIntro', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              required
              inputProps={{ 'aria-label': 'Derivative Intro', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            {formData.derivativeEligibility.map((item, index) => (
              <Paper key={item._id || `derivative-${index}`} elevation={1} sx={{ p: 2, my: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ ...contrastProps }}>
                  Derivative Item {index + 1}
                </Typography>
                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(e) => handleDerivativeChange(index, 'title', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  inputProps={{ 'aria-label': `Derivative ${index + 1} Title`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) => handleDerivativeChange(index, 'description', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  inputProps={{ 'aria-label': `Derivative ${index + 1} Description`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
              </Paper>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Documentation Requirements */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ...contrastProps }}>
              Documentation Requirements
            </Typography>
            <TextField
              label="Document Section Title"
              value={formData.documentTitle}
              onChange={(e) => handleFieldChange('documentTitle', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{ 'aria-label': 'Document Section Title', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            <TextField
              label="Document Intro"
              value={formData.documentIntro}
              onChange={(e) => handleFieldChange('documentIntro', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              required
              inputProps={{ 'aria-label': 'Document Intro', ...textSizeProps }}
              InputLabelProps={{ sx: { ...textSizeProps } }}
            />
            {formData.documentRequirements.map((doc, index) => (
              <Paper key={doc._id || `doc-${index}`} elevation={1} sx={{ p: 2, my: 2, bgcolor: highContrast ? '#ffffff' : '#f9f9f9' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ ...contrastProps }}>
                  Document {index + 1}
                </Typography>
                <TextField
                  label="Title"
                  value={doc.title}
                  onChange={(e) => handleDocumentChange(index, 'title', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  inputProps={{ 'aria-label': `Document ${index + 1} Title`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
                <TextField
                  label="Description"
                  value={doc.description}
                  onChange={(e) => handleDocumentChange(index, 'description', e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  inputProps={{ 'aria-label': `Document ${index + 1} Description`, ...textSizeProps }}
                  InputLabelProps={{ sx: { ...textSizeProps } }}
                />
              </Paper>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              bgcolor: highContrast ? '#000000' : '#003366',
              '&:hover': { bgcolor: highContrast ? '#333333' : '#002244' },
            }}
          >
            {loading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EligibilityForm;

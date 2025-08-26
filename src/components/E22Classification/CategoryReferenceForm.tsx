import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export interface CategoryReferenceData {
  mainTitle: string;
  introText: string;
  codesTitle: string;
  subcategoriesTitle: string;
  formsTitle: string;
  hierarchyTitle: string;
}

interface Props {
  open: boolean;
  data: CategoryReferenceData | null;
  onClose: () => void;
  onSave: (updated: CategoryReferenceData) => Promise<void> | void;
  highContrast?: boolean;
  largeText?: boolean;
}

const CategoryReferenceForm: React.FC<Props> = ({ open, data, onClose, onSave, highContrast, largeText }) => {
  const [local, setLocal] = useState<CategoryReferenceData | null>(data);
  const [saving, setSaving] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocal(data ? { ...data } : null);
  }, [data]);

  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
  }, [open]);

  if (!local) return null;

  const textSizeProps = largeText ? { fontSize: '1rem' } : {};

  const handleField = <K extends keyof CategoryReferenceData>(field: K, value: CategoryReferenceData[K]) => {
    setLocal({ ...local, [field]: value });
  };

  const handleSubmit = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await onSave(local);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="category-reference-form-title">
      <DialogTitle id="category-reference-form-title" sx={{ bgcolor: highContrast ? '#ffffff' : '#f5f7fb', color: highContrast ? '#000000' : '#003366' }}>
        Edit Category Reference
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              inputRef={firstFieldRef}
              label="Main Title"
              fullWidth
              value={local.mainTitle}
              onChange={(e) => handleField('mainTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Main title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Introduction"
              fullWidth
              multiline
              minRows={3}
              value={local.introText}
              onChange={(e) => handleField('introText', e.target.value)}
              inputProps={{ 'aria-label': 'Introduction text', style: textSizeProps }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: highContrast ? '#000000' : '#003366' }}>Section Headings</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Related Codes Title"
              fullWidth
              value={local.codesTitle}
              onChange={(e) => handleField('codesTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Related classification codes title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="EB-2 Subcategories Title"
              fullWidth
              value={local.subcategoriesTitle}
              onChange={(e) => handleField('subcategoriesTitle', e.target.value)}
              inputProps={{ 'aria-label': 'EB-2 subcategories title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Related Forms Title"
              fullWidth
              value={local.formsTitle}
              onChange={(e) => handleField('formsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Related forms title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hierarchy Title"
              fullWidth
              value={local.hierarchyTitle}
              onChange={(e) => handleField('hierarchyTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Hierarchy title', style: textSizeProps }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />} aria-label="Cancel" variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} startIcon={<SaveIcon />} aria-label="Save" variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryReferenceForm;

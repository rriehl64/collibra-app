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

export interface DataChallengesData {
  mainTitle: string;
  introText: string;
  systemsTitle: string;
  challengesTitle: string;
  improvementTitle: string;
}

interface Props {
  open: boolean;
  data: DataChallengesData | null;
  onClose: () => void;
  onSave: (updated: DataChallengesData) => Promise<void> | void;
  highContrast?: boolean;
  largeText?: boolean;
}

const DataChallengesForm: React.FC<Props> = ({ open, data, onClose, onSave, highContrast, largeText }) => {
  const [local, setLocal] = useState<DataChallengesData | null>(data);
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

  const handleField = <K extends keyof DataChallengesData>(field: K, value: DataChallengesData[K]) => {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="data-challenges-form-title">
      <DialogTitle id="data-challenges-form-title" sx={{ bgcolor: highContrast ? '#ffffff' : '#f5f7fb', color: highContrast ? '#000000' : '#003366' }}>
        Edit Data Management and Challenges
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
          <Grid item xs={12} sm={4}>
            <TextField
              label="Systems & Integration Title"
              fullWidth
              value={local.systemsTitle}
              onChange={(e) => handleField('systemsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Systems and integration title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Data Challenges Title"
              fullWidth
              value={local.challengesTitle}
              onChange={(e) => handleField('challengesTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Data challenges title', style: textSizeProps }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Improvement Initiatives Title"
              fullWidth
              value={local.improvementTitle}
              onChange={(e) => handleField('improvementTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Improvement initiatives title', style: textSizeProps }}
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

export default DataChallengesForm;

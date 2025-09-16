import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import api, { ApiResponse } from '../services/api';

interface ProjectCharterDoc {
  _id?: string;
  title: string;
  problemStatement: string;
  missionAlignment: string;
  objectivesKpis: string;
  inScope: string;
  outOfScope: string;
  stakeholdersRaci: string;
  assumptionsConstraints: string;
  risksMitigations: string;
  timelineMilestones: string;
  decisionCadence: string;
  notes: string;
}

const emptyCharter: ProjectCharterDoc = {
  title: '',
  problemStatement: '',
  missionAlignment: '',
  objectivesKpis: '',
  inScope: '',
  outOfScope: '',
  stakeholdersRaci: '',
  assumptionsConstraints: '',
  risksMitigations: '',
  timelineMilestones: '',
  decisionCadence: '',
  notes: ''
};

const ProjectCharter: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [charter, setCharter] = useState<ProjectCharterDoc>(emptyCharter);
  const [original, setOriginal] = useState<ProjectCharterDoc>(emptyCharter);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const headingColor = useMemo(() => '#003366', []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<ProjectCharterDoc[]>>('/project-charters');
        if (res.data && res.data.success) {
          const doc: ProjectCharterDoc = res.data.data?.[0] || emptyCharter;
          setCharter(doc);
          setOriginal(doc);
        }
      } catch (e) {
        setSnackbar({ open: true, message: 'Failed to load Project Charter.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editMode && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [editMode]);

  const handleActivateEdit = () => setEditMode(true);

  const handleKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setEditMode(true);
    }
  };

  const handleChange = (field: keyof ProjectCharterDoc) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCharter((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCancel = () => {
    setCharter(original);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const isNew = !charter._id;
      if (isNew) {
        const res = await api.post<ApiResponse<ProjectCharterDoc>>('/project-charters', charter);
        if (res.data.success && res.data.data) {
          setCharter(res.data.data);
          setOriginal(res.data.data);
        } else {
          throw new Error('Save failed');
        }
      } else {
        const res = await api.put<ApiResponse<ProjectCharterDoc>>(`/project-charters/${charter._id}`, charter);
        if (res.data.success && res.data.data) {
          setCharter(res.data.data);
          setOriginal(res.data.data);
        } else {
          throw new Error('Save failed');
        }
      }
      setSnackbar({ open: true, message: 'Project Charter saved.', severity: 'success' });
      setEditMode(false);
    } catch (e) {
      setSnackbar({ open: true, message: 'Error saving Project Charter.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography>Loading Project Charter…</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: headingColor, fontWeight: 700 }} gutterBottom>
            Project Charter Template (USCIS Styled)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Use USCIS blue ({headingColor}) for headings in slide exports. Ensure Section 508 compliance for shared versions.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            component={MuiLink}
            href="/templates/project-charter-data-governance-app.pdf"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              borderColor: headingColor, 
              color: headingColor,
              '&:hover': {
                borderColor: headingColor,
                backgroundColor: `${headingColor}08`
              }
            }}
            aria-label="Download Data Governance Project Charter PDF"
          >
            Data Governance Charter (PDF)
          </Button>
          
          <Button
            variant="text"
            size="small"
            startIcon={<DownloadIcon />}
            component={MuiLink}
            href="/templates/project-charter-template.md"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: headingColor }}
            aria-label="View Project Charter Template Markdown"
          >
            Template (Markdown)
          </Button>
        </Box>
      </Box>

      {/* Click-anywhere to edit card */}
      <Paper
        elevation={2}
        role={!editMode ? 'button' : undefined}
        aria-label={!editMode ? 'Activate edit mode for Project Charter' : undefined}
        tabIndex={!editMode ? 0 : -1}
        onClick={!editMode ? handleActivateEdit : undefined}
        onKeyDown={!editMode ? handleKeyActivate : undefined}
        sx={{
          p: 3,
          borderLeft: `4px solid ${headingColor}`,
          cursor: !editMode ? 'pointer' : 'default',
          '&:focus-visible': {
            outline: `3px solid ${headingColor}`,
            outlineOffset: '2px'
          }
        }}
      >
        {!editMode && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EditNoteIcon sx={{ color: headingColor, mr: 1 }} />
            <Typography sx={{ color: headingColor, fontWeight: 600 }}>
              Click anywhere to edit (Enter/Space to activate)
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              inputRef={firstFieldRef}
              label="Title"
              value={charter.title}
              onChange={handleChange('title')}
              fullWidth
              required
              disabled={!editMode}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Problem Statement"
              value={charter.problemStatement}
              onChange={handleChange('problemStatement')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mission Alignment"
              value={charter.missionAlignment}
              onChange={handleChange('missionAlignment')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={2}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Objectives & Success Metrics (KPIs)"
              value={charter.objectivesKpis}
              onChange={handleChange('objectivesKpis')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="In Scope"
              value={charter.inScope}
              onChange={handleChange('inScope')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Out of Scope"
              value={charter.outOfScope}
              onChange={handleChange('outOfScope')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Stakeholders & RACI"
              value={charter.stakeholdersRaci}
              onChange={handleChange('stakeholdersRaci')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Assumptions & Constraints"
              value={charter.assumptionsConstraints}
              onChange={handleChange('assumptionsConstraints')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Risks & Mitigations"
              value={charter.risksMitigations}
              onChange={handleChange('risksMitigations')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Timeline & Milestones"
              value={charter.timelineMilestones}
              onChange={handleChange('timelineMilestones')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Decision Cadence"
              value={charter.decisionCadence}
              onChange={handleChange('decisionCadence')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={2}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={charter.notes}
              onChange={handleChange('notes')}
              fullWidth
              disabled={!editMode}
              multiline
              minRows={2}
              helperText={
                <span>
                  Use USCIS blue ({headingColor}) for headings. Ensure 508 compliance. See{' '}
                  <MuiLink href="/templates/project-charter-template.md" underline="hover">template</MuiLink>.
                </span>
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!editMode || saving || !charter.title.trim()}
            sx={{ backgroundColor: headingColor }}
            aria-label="Save Project Charter"
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={!editMode || saving}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProjectCharter;

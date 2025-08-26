import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  Snackbar,
  Alert
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import { kpiService, Kpi } from '../services/kpiService';

const KpiDictionary: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [kpiId, setKpiId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const headingColor = useMemo(() => '#003366', []);

  interface KpiDoc {
    title: string;
    definition: string;
    calculation: string;
    dataSource: string;
    frequency: string;
    owner: string;
    target: string;
    thresholds: string;
    notes: string;
  }

  const empty: KpiDoc = {
    title: '',
    definition: '',
    calculation: '',
    dataSource: '',
    frequency: '',
    owner: '',
    target: '',
    thresholds: '',
    notes: ''
  };

  const [kpi, setKpi] = useState<KpiDoc>(empty);
  const [original, setOriginal] = useState<KpiDoc>(empty);
  const { id } = useParams<{ id: string }>();

  // Map backend KPI -> UI form
  const fromApi = (api: Kpi): KpiDoc => ({
    title: api.name || '',
    definition: api.definition || '',
    calculation: api.calculationMethod || '',
    dataSource: (api.dataSources && api.dataSources.length) ? api.dataSources.join(', ') : '',
    frequency: api.frequency || '',
    owner: api.owner || '',
    target: api.target || (typeof api.targetValue !== 'undefined' ? `${api.targetValue}${api.unit || ''}` : ''),
    thresholds: api.thresholds || '',
    notes: api.notes || ''
  });

  // Map UI form -> backend KPI
  const toApi = (doc: KpiDoc): Partial<Kpi> => ({
    name: doc.title.trim(),
    definition: doc.definition || undefined,
    calculationMethod: doc.calculation || undefined,
    dataSources: doc.dataSource ? doc.dataSource.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    frequency: doc.frequency || undefined,
    owner: doc.owner || undefined,
    target: doc.target || undefined,
    thresholds: doc.thresholds || undefined,
    notes: doc.notes || undefined,
  });

  useEffect(() => {
    if (editMode && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [editMode]);

  // Load KPI by id from route if provided; otherwise load latest
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const doc = await kpiService.get(id);
          setKpiId(doc._id || null);
          const normalized = fromApi(doc);
          setKpi(normalized);
          setOriginal(normalized);
          return;
        }
        const { items } = await kpiService.list({ limit: 1, sort: '-createdAt' });
        if (items && items.length > 0) {
          const first = items[0];
          setKpiId(first._id || null);
          const normalized = fromApi(first);
          setKpi(normalized);
          setOriginal(normalized);
        }
      } catch (_e) {
        setSnackbar({ open: true, message: 'Failed to load KPIs from server.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleActivateEdit = () => setEditMode(true);
  const handleKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setEditMode(true);
    }
  };

  const handleChange = (field: keyof KpiDoc) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKpi((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCancel = () => {
    setKpi(original);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = toApi(kpi);
      let saved: Kpi;
      if (kpiId) {
        saved = await kpiService.update(kpiId, payload);
      } else {
        saved = await kpiService.create(payload as Kpi);
      }
      setKpiId(saved._id || null);
      const normalized = fromApi(saved);
      setKpi(normalized);
      setOriginal(normalized);
      setSnackbar({ open: true, message: 'KPI saved.', severity: 'success' });
      setEditMode(false);
    } catch (_e) {
      setSnackbar({ open: true, message: 'Error saving KPI.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const node = contentRef.current;
    if (!node) return;
    const printWindow = window.open('', 'printWindow', 'width=1024,height=768');
    if (!printWindow) return;
    const title = 'E-Unify: KPI Dictionary';
    const now = new Date().toLocaleString();
    const styles = `
      <style>
        @page { margin: 16mm; }
        body { font-family: "Source Sans Pro", Arial, sans-serif; color: #000; }
        h1,h2,h3 { color: ${headingColor}; }
        a { color: ${headingColor}; text-decoration: underline; }
        ul, ol { padding-left: 20px; }
        .print-header { border-bottom: 2px solid ${headingColor}; margin-bottom: 12px; padding-bottom: 8px; }
        .print-footer { border-top: 1px solid #ccc; margin-top: 16px; padding-top: 8px; font-size: 12px; color: #555; }
        .field { margin: 8px 0; }
        .label { font-weight: bold; color: ${headingColor}; }
      </style>
    `;
    printWindow.document.write(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>${title}</title>
          ${styles}
        </head>
        <body>
          <div class="print-header">
            <h1>${title}</h1>
            <div>Printed: ${now}</div>
            <div>Template: <a href="/templates/kpi-dictionary.md">kpi-dictionary.md</a></div>
          </div>
          ${node.innerHTML}
          <div class="print-footer">USCIS-themed output • 508-friendly</div>
          <script>
            window.onload = function(){
              window.focus();
              window.print();
              setTimeout(function(){ window.close(); }, 200);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: headingColor, fontWeight: 700 }} gutterBottom>
        KPI Dictionary
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Define KPIs consistently. Use USCIS blue ({headingColor}) for exported headings. Ensure Section 508 compliance.
      </Typography>
      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Loading latest KPI…
        </Typography>
      )}

      <Paper
        elevation={2}
        role={!editMode ? 'button' : undefined}
        aria-label={!editMode ? 'Activate edit mode for KPI' : undefined}
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

        <Box ref={contentRef}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputRef={firstFieldRef}
                label="KPI Title"
                value={kpi.title}
                onChange={handleChange('title')}
                fullWidth
                required
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Definition"
                value={kpi.definition}
                onChange={handleChange('definition')}
                fullWidth
                disabled={!editMode}
                multiline
                minRows={3}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Calculation Method"
                value={kpi.calculation}
                onChange={handleChange('calculation')}
                fullWidth
                disabled={!editMode}
                multiline
                minRows={2}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Data Source(s)"
                value={kpi.dataSource}
                onChange={handleChange('dataSource')}
                fullWidth
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reporting Frequency"
                value={kpi.frequency}
                onChange={handleChange('frequency')}
                fullWidth
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Owner / Steward"
                value={kpi.owner}
                onChange={handleChange('owner')}
                fullWidth
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Target"
                value={kpi.target}
                onChange={handleChange('target')}
                fullWidth
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Thresholds (e.g., Green/Amber/Red)"
                value={kpi.thresholds}
                onChange={handleChange('thresholds')}
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
                value={kpi.notes}
                onChange={handleChange('notes')}
                fullWidth
                disabled={!editMode}
                multiline
                minRows={2}
                helperText={
                  <span>
                    Use USCIS blue ({headingColor}) for headings. Ensure 508 compliance. See{' '}
                    <MuiLink href="/templates/kpi-dictionary.md" underline="hover">template</MuiLink>.
                  </span>
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!editMode || saving || !kpi.title.trim()}
            sx={{ backgroundColor: headingColor }}
            aria-label="Save KPI"
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
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            aria-label="Print KPI to PDF"
          >
            Print PDF
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

export default KpiDictionary;

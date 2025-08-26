import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Divider,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

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

export interface ApplicationRequirementsData {
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

interface Props {
  open: boolean;
  data: ApplicationRequirementsData | null;
  onClose: () => void;
  onSave: (updated: ApplicationRequirementsData) => Promise<void> | void;
  highContrast?: boolean;
  largeText?: boolean;
}

const ApplicationRequirementsForm: React.FC<Props> = ({ open, data, onClose, onSave, highContrast, largeText }) => {
  const [local, setLocal] = useState<ApplicationRequirementsData | null>(data);
  const [saving, setSaving] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocal(data ? JSON.parse(JSON.stringify(data)) : null);
  }, [data]);

  useEffect(() => {
    if (open && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [open]);

  if (!local) return null;

  const textSizeProps = largeText ? { fontSize: '1rem' } : {};

  const handleField = <K extends keyof ApplicationRequirementsData>(field: K, value: ApplicationRequirementsData[K]) => {
    setLocal({ ...local, [field]: value });
  };

  const handleReq = (i: number, field: keyof RequirementItem, value: string) => {
    const arr = [...local.generalRequirements];
    arr[i] = { ...arr[i], [field]: value } as RequirementItem;
    handleField('generalRequirements', arr);
  };
  const addReq = () => handleField('generalRequirements', [...local.generalRequirements, { title: 'New requirement', description: '' }]);
  const delReq = (i: number) => handleField('generalRequirements', local.generalRequirements.filter((_, idx) => idx !== i));

  const handleFormItem = (i: number, field: keyof FormItem, value: string) => {
    const arr = [...local.forms];
    arr[i] = { ...arr[i], [field]: value } as FormItem;
    handleField('forms', arr);
  };
  const addForm = () => handleField('forms', [...local.forms, { formName: 'New Form', formDescription: '', formUrl: '' }]);
  const delForm = (i: number) => handleField('forms', local.forms.filter((_, idx) => idx !== i));

  const handleDoc = (i: number, field: keyof SupportingDocItem, value: string | boolean) => {
    const arr = [...local.supportingDocuments];
    (arr[i] as any)[field] = value;
    handleField('supportingDocuments', arr);
  };
  const addDoc = () => handleField('supportingDocuments', [...local.supportingDocuments, { title: 'New Supporting Document', description: '', isRequired: false }]);
  const delDoc = (i: number) => handleField('supportingDocuments', local.supportingDocuments.filter((_, idx) => idx !== i));

  const handleTip = (i: number, field: keyof ApplicationTipItem, value: string) => {
    const arr = [...local.applicationTips];
    arr[i] = { ...arr[i], [field]: value } as ApplicationTipItem;
    handleField('applicationTips', arr);
  };
  const addTip = () => handleField('applicationTips', [...local.applicationTips, { title: 'New Application Tip', description: '' }]);
  const delTip = (i: number) => handleField('applicationTips', local.applicationTips.filter((_, idx) => idx !== i));

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="app-req-form-title">
      <DialogTitle id="app-req-form-title" sx={{ bgcolor: highContrast ? '#ffffff' : '#f5f7fb', color: highContrast ? '#000000' : '#003366' }}>
        Edit Application Requirements
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
              label="Main Description"
              fullWidth
              multiline
              minRows={3}
              value={local.mainDescription}
              onChange={(e) => handleField('mainDescription', e.target.value)}
              inputProps={{ 'aria-label': 'Main description', style: textSizeProps }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: highContrast ? '#000000' : '#003366' }}>General Requirements</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="General Requirements Title"
              fullWidth
              value={local.generalRequirementsTitle}
              onChange={(e) => handleField('generalRequirementsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'General requirements title', style: textSizeProps }}
            />
          </Grid>
          {local.generalRequirements.map((req, i) => (
            <Grid container spacing={1} key={req._id || i} sx={{ mb: 1, px: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Requirement ${i + 1} Title`}
                  fullWidth
                  value={req.title}
                  onChange={(e) => handleReq(i, 'title', e.target.value)}
                  inputProps={{ 'aria-label': `Requirement ${i + 1} title`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Requirement ${i + 1} Description`}
                  fullWidth
                  value={req.description}
                  onChange={(e) => handleReq(i, 'description', e.target.value)}
                  inputProps={{ 'aria-label': `Requirement ${i + 1} description`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton aria-label={`Delete requirement ${i + 1}`} onClick={() => delReq(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addReq} startIcon={<AddIcon />} aria-label="Add requirement">Add Requirement</Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: highContrast ? '#000000' : '#003366' }}>Forms</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Forms Title"
              fullWidth
              value={local.formsTitle}
              onChange={(e) => handleField('formsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Forms title', style: textSizeProps }}
            />
          </Grid>
          {local.forms.map((f, i) => (
            <Grid container spacing={1} key={f._id || i} sx={{ mb: 1, px: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={`Form ${i + 1} Name`}
                  fullWidth
                  value={f.formName}
                  onChange={(e) => handleFormItem(i, 'formName', e.target.value)}
                  inputProps={{ 'aria-label': `Form ${i + 1} name`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={`Form ${i + 1} Description`}
                  fullWidth
                  value={f.formDescription}
                  onChange={(e) => handleFormItem(i, 'formDescription', e.target.value)}
                  inputProps={{ 'aria-label': `Form ${i + 1} description`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label={`Form ${i + 1} URL`}
                  fullWidth
                  value={f.formUrl}
                  onChange={(e) => handleFormItem(i, 'formUrl', e.target.value)}
                  inputProps={{ 'aria-label': `Form ${i + 1} URL`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton aria-label={`Delete form ${i + 1}`} onClick={() => delForm(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addForm} startIcon={<AddIcon />} aria-label="Add form">Add Form</Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: highContrast ? '#000000' : '#003366' }}>Supporting Documents</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Supporting Documents Title"
              fullWidth
              value={local.supportingDocsTitle}
              onChange={(e) => handleField('supportingDocsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Supporting documents title', style: textSizeProps }}
            />
          </Grid>
          {local.supportingDocuments.map((d, i) => (
            <Grid container spacing={1} key={d._id || i} sx={{ mb: 1, px: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Doc ${i + 1} Title`}
                  fullWidth
                  value={d.title}
                  onChange={(e) => handleDoc(i, 'title', e.target.value)}
                  inputProps={{ 'aria-label': `Supporting doc ${i + 1} title`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Doc ${i + 1} Description`}
                  fullWidth
                  value={d.description}
                  onChange={(e) => handleDoc(i, 'description', e.target.value)}
                  inputProps={{ 'aria-label': `Supporting doc ${i + 1} description`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Box display="flex" alignItems="center" height="100%">
                  <Checkbox
                    checked={d.isRequired}
                    onChange={(e) => handleDoc(i, 'isRequired', e.target.checked)}
                    inputProps={{ 'aria-label': `Supporting doc ${i + 1} required` }}
                  />
                  <Typography variant="body2">Required</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton aria-label={`Delete supporting doc ${i + 1}`} onClick={() => delDoc(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addDoc} startIcon={<AddIcon />} aria-label="Add supporting document">Add Supporting Document</Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: highContrast ? '#000000' : '#003366' }}>Application Tips</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tips Title"
              fullWidth
              value={local.tipsTitle}
              onChange={(e) => handleField('tipsTitle', e.target.value)}
              inputProps={{ 'aria-label': 'Tips title', style: textSizeProps }}
            />
          </Grid>
          {local.applicationTips.map((t, i) => (
            <Grid container spacing={1} key={t._id || i} sx={{ mb: 1, px: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Tip ${i + 1} Title`}
                  fullWidth
                  value={t.title}
                  onChange={(e) => handleTip(i, 'title', e.target.value)}
                  inputProps={{ 'aria-label': `Tip ${i + 1} title`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Tip ${i + 1} Description`}
                  fullWidth
                  value={t.description}
                  onChange={(e) => handleTip(i, 'description', e.target.value)}
                  inputProps={{ 'aria-label': `Tip ${i + 1} description`, style: textSizeProps }}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton aria-label={`Delete tip ${i + 1}`} onClick={() => delTip(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addTip} startIcon={<AddIcon />} aria-label="Add application tip">Add Tip</Button>
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

export default ApplicationRequirementsForm;

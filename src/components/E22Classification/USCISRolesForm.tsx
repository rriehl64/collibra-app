import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface BulletItem { _id?: string; text: string }
interface RoleItem { _id?: string; title: string; bullets: BulletItem[] }
export interface USCISRolesData {
  _id?: string;
  mainTitle: string;
  intro: string;
  primaryRoles: RoleItem[];
  supportingRoles: RoleItem[];
  workflowTitle: string;
  workflowSteps: BulletItem[];
  updatedBy?: string;
  lastUpdated?: Date;
}

interface USCISRolesFormProps {
  open: boolean;
  data: USCISRolesData | null;
  onClose: () => void;
  onSave: (updated: USCISRolesData) => Promise<void> | void;
}

const USCISRolesForm: React.FC<USCISRolesFormProps> = ({ open, data, onClose, onSave }) => {
  const [local, setLocal] = useState<USCISRolesData | null>(data);
  const [saving, setSaving] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => setLocal(data), [data]);
  useEffect(() => {
    if (open) setTimeout(() => firstFieldRef.current?.focus(), 50);
  }, [open]);

  if (!local) return null;

  const handleChange = (field: keyof USCISRolesData, value: any) => {
    setLocal(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleRoleTitleChange = (listKey: 'primaryRoles' | 'supportingRoles', idx: number, value: string) => {
    setLocal(prev => {
      if (!prev) return prev;
      const copy = { ...prev };
      const arr = [...copy[listKey]];
      arr[idx] = { ...arr[idx], title: value };
      copy[listKey] = arr;
      return copy;
    });
  };

  const handleBulletChange = (listKey: 'primaryRoles' | 'supportingRoles', idx: number, bIdx: number, value: string) => {
    setLocal(prev => {
      if (!prev) return prev;
      const copy = { ...prev };
      const arr = [...copy[listKey]];
      const role = { ...arr[idx] };
      const bullets = [...role.bullets];
      bullets[bIdx] = { ...bullets[bIdx], text: value };
      role.bullets = bullets;
      arr[idx] = role;
      copy[listKey] = arr;
      return copy;
    });
  };

  const addRole = (listKey: 'primaryRoles' | 'supportingRoles') => {
    setLocal(prev => prev ? ({
      ...prev,
      [listKey]: [...prev[listKey], { title: '', bullets: [{ text: '' }] }]
    }) : prev);
  };

  const removeRole = (listKey: 'primaryRoles' | 'supportingRoles', idx: number) => {
    setLocal(prev => {
      if (!prev) return prev;
      const arr = prev[listKey].filter((_, i) => i !== idx);
      return { ...prev, [listKey]: arr };
    });
  };

  const addBullet = (listKey: 'primaryRoles' | 'supportingRoles', idx: number) => {
    setLocal(prev => {
      if (!prev) return prev;
      const copy = { ...prev };
      const arr = [...copy[listKey]];
      const role = { ...arr[idx] };
      role.bullets = [...role.bullets, { text: '' }];
      arr[idx] = role;
      copy[listKey] = arr;
      return copy;
    });
  };

  const removeBullet = (listKey: 'primaryRoles' | 'supportingRoles', idx: number, bIdx: number) => {
    setLocal(prev => {
      if (!prev) return prev;
      const copy = { ...prev };
      const arr = [...copy[listKey]];
      const role = { ...arr[idx] };
      role.bullets = role.bullets.filter((_, i) => i !== bIdx);
      arr[idx] = role;
      copy[listKey] = arr;
      return copy;
    });
  };

  const handleWorkflowStepChange = (i: number, value: string) => {
    setLocal(prev => prev ? ({
      ...prev,
      workflowSteps: prev.workflowSteps.map((s, idx) => idx === i ? { ...s, text: value } : s)
    }) : prev);
  };

  const addWorkflowStep = () => {
    setLocal(prev => prev ? ({ ...prev, workflowSteps: [...prev.workflowSteps, { text: '' }] }) : prev);
  };

  const removeWorkflowStep = (i: number) => {
    setLocal(prev => prev ? ({ ...prev, workflowSteps: prev.workflowSteps.filter((_, idx) => idx !== i) }) : prev);
  };

  const submit = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await onSave(local);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="uscis-roles-form-title"
    >
      <DialogTitle id="uscis-roles-form-title">
        Edit USCIS Roles and Responsibilities
        <IconButton
          aria-label="Close"
          onClick={onClose}
          edge="end"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            inputRef={firstFieldRef}
            label="Main Title"
            fullWidth
            value={local.mainTitle}
            onChange={e => handleChange('mainTitle', e.target.value)}
            inputProps={{ 'aria-label': 'Main Title' }}
          />
          <TextField
            label="Introduction"
            fullWidth
            multiline
            minRows={3}
            value={local.intro}
            onChange={e => handleChange('intro', e.target.value)}
            inputProps={{ 'aria-label': 'Introduction' }}
          />

          <Divider />
          <Typography variant="h6" component="h3">Primary Roles</Typography>
          {local.primaryRoles.map((role, idx) => (
            <Box key={role._id || idx} sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label={`Role ${idx + 1} Title`}
                  fullWidth
                  value={role.title}
                  onChange={e => handleRoleTitleChange('primaryRoles', idx, e.target.value)}
                />
                <IconButton aria-label="Remove role" onClick={() => removeRole('primaryRoles', idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {role.bullets.map((b, bIdx) => (
                  <Box key={b._id || bIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label={`Bullet ${bIdx + 1}`}
                      fullWidth
                      value={b.text}
                      onChange={e => handleBulletChange('primaryRoles', idx, bIdx, e.target.value)}
                    />
                    <IconButton aria-label="Remove bullet" onClick={() => removeBullet('primaryRoles', idx, bIdx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => addBullet('primaryRoles', idx)} aria-label="Add bullet">Add Bullet</Button>
              </Box>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addRole('primaryRoles')} aria-label="Add primary role">Add Role</Button>

          <Divider />
          <Typography variant="h6" component="h3">Supporting Roles</Typography>
          {local.supportingRoles.map((role, idx) => (
            <Box key={role._id || idx} sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label={`Role ${idx + 1} Title`}
                  fullWidth
                  value={role.title}
                  onChange={e => handleRoleTitleChange('supportingRoles', idx, e.target.value)}
                />
                <IconButton aria-label="Remove role" onClick={() => removeRole('supportingRoles', idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {role.bullets.map((b, bIdx) => (
                  <Box key={b._id || bIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label={`Bullet ${bIdx + 1}`}
                      fullWidth
                      value={b.text}
                      onChange={e => handleBulletChange('supportingRoles', idx, bIdx, e.target.value)}
                    />
                    <IconButton aria-label="Remove bullet" onClick={() => removeBullet('supportingRoles', idx, bIdx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => addBullet('supportingRoles', idx)} aria-label="Add bullet">Add Bullet</Button>
              </Box>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addRole('supportingRoles')} aria-label="Add supporting role">Add Role</Button>

          <Divider />
          <TextField
            label="Workflow Title"
            fullWidth
            value={local.workflowTitle}
            onChange={e => handleChange('workflowTitle', e.target.value)}
          />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Workflow Steps</Typography>
          {local.workflowSteps.map((s, i) => (
            <Box key={s._id || i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <TextField
                label={`Step ${i + 1}`}
                fullWidth
                value={s.text}
                onChange={e => handleWorkflowStepChange(i, e.target.value)}
              />
              <IconButton aria-label="Remove step" onClick={() => removeWorkflowStep(i)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={addWorkflowStep} aria-label="Add workflow step">Add Step</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel editing">Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={saving} aria-label="Save changes">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default USCISRolesForm;

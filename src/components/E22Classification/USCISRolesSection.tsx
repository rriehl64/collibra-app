import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import USCISRolesForm, { USCISRolesData } from './USCISRolesForm';
import EditableField from '../shared/EditableField';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';

const USCISRolesSection: React.FC = () => {
  const { settings } = useAccessibility();
  const { isUserAdmin, editMode, setEditMode } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  const [data, setData] = useState<USCISRolesData | null>(null);
  const [originalData, setOriginalData] = useState<USCISRolesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3002/api/v1/e22/uscis-roles/latest', {
          credentials: 'include',
          mode: 'cors'
        });
        if (!res.ok) throw new Error(`Failed to fetch USCIS Roles (${res.status})`);
        const json = await res.json();
        // API returns { success, data }
        setData(json.data);
        setOriginalData(json.data);
      } catch (e) {
        console.error('Error fetching USCIS Roles:', e);
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleFormSave = async (updated: USCISRolesData) => {
    if (!updated || !updated._id) return;
    try {
      const res = await fetch(`http://localhost:3002/api/v1/e22/uscis-roles/${updated._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Failed to save changes');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setOriginalData(json.data);
        setSaveSuccess(true);
        setFormOpen(false);
      } else {
        setSaveError(true);
      }
    } catch (e) {
      console.error('Error saving USCIS Roles:', e);
      setSaveError(true);
    }
  };

  const handleSaveAll = async () => {
    if (!data || !data._id) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3002/api/v1/e22/uscis-roles/${data._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save changes');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setOriginalData(json.data);
        setSaveSuccess(true);
        setEditMode(false);
      } else {
        setSaveError(true);
      }
    } catch (e) {
      console.error('Error saving USCIS Roles:', e);
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAll = () => {
    if (originalData) setData(originalData);
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
        <CircularProgress aria-label="Loading USCIS Roles" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" role="alert">{error}</Alert>
    );
  }

  if (!data) return null;

  return (
    <Box>
      {isUserAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {!editMode ? (
            <ButtonGroup variant="outlined">
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                aria-label="Enable individual editing mode"
              >
                Edit Content
              </Button>
              <Tooltip title="Edit all content in form view">
                <Button
                  startIcon={<ListAltIcon />}
                  onClick={() => setFormOpen(true)}
                  aria-label="Open form editing mode"
                >
                  Form Mode
                </Button>
              </Tooltip>
            </ButtonGroup>
          ) : (
            <Box>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleSaveAll}
                sx={{ mr: 1 }}
                disabled={loading}
                aria-label="Save all changes"
              >
                {loading ? 'Saving...' : 'Save All'}
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                onClick={handleCancelAll}
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
        content={data.mainTitle}
        onSave={(value) => setData(prev => prev ? { ...prev, mainTitle: value } : prev)}
        variant="h5"
        fieldId="uscis-roles-main-title"
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
          content={data.intro}
          onSave={(value) => setData(prev => prev ? { ...prev, intro: value } : prev)}
          variant="body1"
          fieldId="uscis-roles-intro"
          multiline
          minRows={3}
          sx={{ ...textSizeProps }}
        />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {data.primaryRoles.map((role, idx) => (
            <Grid key={role._id || idx} item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                  border: highContrast ? '1px solid #000000' : 'none'
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      margin: '0 auto',
                      bgcolor: highContrast ? '#000000' : '#003366',
                      mb: 2
                    }}
                  >
                    {idx === 0 ? (
                      <SupervisorAccountIcon fontSize="large" />
                    ) : idx === 1 ? (
                      <BusinessCenterIcon fontSize="large" />
                    ) : (
                      <VerifiedUserIcon fontSize="large" />
                    )}
                  </Avatar>

                  <EditableField
                    content={role.title}
                    onSave={(value) => setData(prev => {
                      if (!prev) return prev;
                      const updated = { ...prev };
                      const arr = [...updated.primaryRoles];
                      arr[idx] = { ...arr[idx], title: value };
                      updated.primaryRoles = arr;
                      return updated;
                    })}
                    variant="h6"
                    fieldId={`uscis-roles-primary-role-title-${idx}`}
                    component="h3"
                    sx={{
                      color: highContrast ? '#000000' : '#003366',
                      fontWeight: 'bold',
                      ...textSizeProps
                    }}
                  />

                  <Divider sx={{ my: 1.5 }} />

                  <List dense>
                    {role.bullets.map((b, bIdx) => (
                      <ListItem key={b._id || bIdx}>
                        <ListItemText
                          primary={
                            <EditableField
                              content={b.text}
                              onSave={(value) => setData(prev => {
                                if (!prev) return prev;
                                const updated = { ...prev };
                                const arr = [...updated.primaryRoles];
                                const r = { ...arr[idx] };
                                const bullets = [...r.bullets];
                                bullets[bIdx] = { ...bullets[bIdx], text: value };
                                r.bullets = bullets;
                                arr[idx] = r;
                                updated.primaryRoles = arr;
                                return updated;
                              })}
                              variant="body1"
                              fieldId={`uscis-roles-primary-role-bullet-${idx}-${bIdx}`}
                              sx={{ ...textSizeProps }}
                            />
                          }
                          primaryTypographyProps={{
                            ...textSizeProps,
                            textAlign: 'left'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Typography
          variant="h6"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            mb: 3,
            ...textSizeProps
          }}
        >
          Supporting Roles
        </Typography>

        <Grid container spacing={3}>
          {data.supportingRoles.map((role, idx) => (
            <Grid key={role._id || idx} item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  border: highContrast ? '1px solid #000000' : '1px solid #ccc'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {idx === 0 ? (
                      <AssignmentIndIcon sx={{ color: highContrast ? '#000000' : '#003366', mr: 1 }} />
                    ) : idx === 1 ? (
                      <SchoolIcon sx={{ color: highContrast ? '#000000' : '#003366', mr: 1 }} />
                    ) : (
                      <BuildIcon sx={{ color: highContrast ? '#000000' : '#003366', mr: 1 }} />
                    )}
                    <EditableField
                      content={role.title}
                      onSave={(value) => setData(prev => {
                        if (!prev) return prev;
                        const updated = { ...prev };
                        const arr = [...updated.supportingRoles];
                        arr[idx] = { ...arr[idx], title: value };
                        updated.supportingRoles = arr;
                        return updated;
                      })}
                      variant="h6"
                      fieldId={`uscis-roles-supporting-role-title-${idx}`}
                      component="h3"
                      sx={{
                        color: highContrast ? '#000000' : '#003366',
                        fontSize: largeText ? '1.3rem' : '1.15rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <List dense>
                    {role.bullets.map((b, bIdx) => (
                      <ListItem key={b._id || bIdx}>
                        <ListItemText
                          primary={
                            <EditableField
                              content={b.text}
                              onSave={(value) => setData(prev => {
                                if (!prev) return prev;
                                const updated = { ...prev };
                                const arr = [...updated.supportingRoles];
                                const r = { ...arr[idx] };
                                const bullets = [...r.bullets];
                                bullets[bIdx] = { ...bullets[bIdx], text: value };
                                r.bullets = bullets;
                                arr[idx] = r;
                                updated.supportingRoles = arr;
                                return updated;
                              })}
                              variant="body1"
                              fieldId={`uscis-roles-supporting-role-bullet-${idx}-${bIdx}`}
                              sx={{ ...textSizeProps }}
                            />
                          }
                          primaryTypographyProps={{ ...textSizeProps }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <EditableField
        content={data.workflowTitle}
        onSave={(value) => setData(prev => prev ? { ...prev, workflowTitle: value } : prev)}
        variant="h5"
        fieldId="uscis-roles-workflow-title"
        component="h2"
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mt: 4,
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
        <Typography variant="body1" sx={{ ...textSizeProps }}>
          E22 cases follow a structured workflow within USCIS:
        </Typography>
        
        <List>
          {data.workflowSteps.map((s, i) => (
            <ListItem key={s._id || i}>
              <ListItemIcon>
                <AssignmentIndIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <EditableField
                    content={s.text}
                    onSave={(value) => setData(prev => {
                      if (!prev) return prev;
                      const updated = { ...prev };
                      const steps = [...updated.workflowSteps];
                      steps[i] = { ...steps[i], text: value };
                      updated.workflowSteps = steps;
                      return updated;
                    })}
                    variant="body1"
                    fieldId={`uscis-roles-workflow-step-${i}`}
                    sx={{ fontWeight: 'bold', ...textSizeProps }}
                  />
                }
                secondaryTypographyProps={{ ...textSizeProps, color: highContrast ? '#000000' : 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {isUserAdmin && !editMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={() => setFormOpen(true)} aria-label="Edit USCIS Roles in form mode">
            Edit in Form
          </Button>
        </Box>
      )}

      <USCISRolesForm open={formOpen} data={data} onClose={() => setFormOpen(false)} onSave={handleFormSave} />

      <Snackbar open={saveSuccess} autoHideDuration={3000} onClose={() => setSaveSuccess(false)}>
        <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
          USCIS Roles updated successfully
        </Alert>
      </Snackbar>
      <Snackbar open={saveError} autoHideDuration={4000} onClose={() => setSaveError(false)}>
        <Alert onClose={() => setSaveError(false)} severity="error" sx={{ width: '100%' }}>
          Failed to update USCIS Roles
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default USCISRolesSection;

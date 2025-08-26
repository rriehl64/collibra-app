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
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar,
  Button
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckIcon from '@mui/icons-material/Check';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import EditableField from '../shared/EditableField';
import EditableListItem from '../shared/EditableListItem';
import LegalFoundationForm from './LegalFoundationForm';
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

const LegalFoundationSection: React.FC = () => {
  const { settings } = useAccessibility();
  const { editMode, setEditMode, isUserAdmin } = useEdit();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [data, setData] = useState<E22LegalFoundationData | null>(null);
  const [originalData, setOriginalData] = useState<E22LegalFoundationData | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = 'http://localhost:3002/api/v1/e22/legal-foundation/latest';
        const response = await fetch(apiUrl, {
          credentials: 'include',
          mode: 'cors',
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`Failed to fetch Legal Foundation: ${response.status}`);
        const bodyText = await response.clone().text();
        const json = JSON.parse(bodyText);
        if (json.success && json.data) {
          setData(json.data);
          setOriginalData(json.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFieldUpdate = (field: keyof E22LegalFoundationData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value } as E22LegalFoundationData);
  };

  const handlePrincipleUpdate = (index: number, value: string) => {
    if (!data) return;
    const next = [...data.keyPrinciples];
    next[index] = value;
    setData({ ...data, keyPrinciples: next });
  };

  const handleReferenceUpdate = (
    index: number,
    part: 'title' | 'description',
    value: string
  ) => {
    if (!data) return;
    const next = [...data.references];
    next[index] = { ...next[index], [part]: value } as ReferenceItem;
    setData({ ...data, references: next });
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      setLoading(true);
      const resp = await fetch(`http://localhost:3002/api/v1/e22/legal-foundation/${data._id}`, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!resp.ok) throw new Error('Failed to save changes');
      const json = await resp.json();
      if (json.success) {
        setData(json.data);
        setOriginalData(json.data);
        setSaveSuccess(true);
        setEditMode(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = async (updated: E22LegalFoundationData) => {
    try {
      setLoading(true);
      const resp = await fetch(`http://localhost:3002/api/v1/e22/legal-foundation/${updated._id}`, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!resp.ok) throw new Error('Failed to save changes');
      const json = await resp.json();
      if (json.success) {
        setData(json.data);
        setOriginalData(json.data);
        setSaveSuccess(true);
        setFormOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setData(originalData);
    setEditMode(false);
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="warning">
        <AlertTitle>No Data</AlertTitle>
        No Legal Foundation data available.
      </Alert>
    );
  }

  return (
    <Box>
      {isUserAdmin && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {!editMode ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PrimaryButton
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                aria-label="Enable editing mode"
              >
                Field Editor
              </PrimaryButton>
              <PrimaryButton
                startIcon={<ListAltIcon />}
                onClick={() => setFormOpen(true)}
                aria-label="Open form editor for Legal Foundation"
              >
                Form Editor
              </PrimaryButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PrimaryButton
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                aria-label="Save all changes"
              >
                {loading ? 'Saving...' : 'Save All'}
              </PrimaryButton>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                onClick={handleCancel}
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
        onSave={(value) => handleFieldUpdate('mainTitle', value)}
        variant="h5"
        fieldId="legal-main-title"
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <EditableField
              content={data.mainDescription}
              onSave={(value) => handleFieldUpdate('mainDescription', value)}
              variant="body1"
              fieldId="legal-main-description"
              multiline
              minRows={2}
              sx={{ ...textSizeProps, mb: 2 }}
            />

            <Card
              variant="outlined"
              sx={{
                my: 2,
                p: 2,
                bgcolor: highContrast ? '#ffffff' : '#f8f8f8',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc'
              }}
            >
              <Typography
                variant="body1"
                component="blockquote"
                sx={{
                  fontStyle: 'italic',
                  pl: 2,
                  borderLeft: highContrast ? '4px solid #000000' : '4px solid #003366',
                  ...textSizeProps
                }}
              >
                Section 203(d) of the Immigration and Nationality Act (INA)
              </Typography>
            </Card>

            <Typography variant="body1" sx={{ ...textSizeProps }}>
              This provision is the cornerstone that enables spouses (E22) and children (E23) of EB-2 principal applicants to immigrate together or "follow to join" the principal, using a shared priority date and streamlined processing.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                border: highContrast ? '1px solid #000000' : 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GavelIcon
                    sx={{
                      color: highContrast ? '#000000' : '#003366',
                      mr: 1,
                      fontSize: '2rem'
                    }}
                  />
                  <EditableField
                    content={data.keyPrinciplesTitle}
                    onSave={(value) => handleFieldUpdate('keyPrinciplesTitle', value)}
                    fieldId="legal-principles-title"
                    variant="h6"
                    sx={{ color: highContrast ? '#000000' : '#003366', fontWeight: 'bold', ...textSizeProps }}
                  />
                </Box>

                <List>
                  {data.keyPrinciples.map((item, index) => (
                    <EditableListItem
                      key={`principle-${index}`}
                      icon={<CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />}
                      primary={item}
                      secondary=""
                      onPrimarySave={(value) => handlePrincipleUpdate(index, value)}
                      onSecondarySave={() => { /* no secondary content for principles */ }}
                      primaryId={`legal-principle-${index}`}
                      secondaryId={`legal-principle-desc-${index}`}
                      dense
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <EditableField
          content={data.referencesTitle}
          onSave={(value) => handleFieldUpdate('referencesTitle', value)}
          variant="h6"
          fieldId="legal-references-title"
          component="h3"
          sx={{
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {data.references.map((ref, index) => (
            <Grid item xs={12} md={4} key={`ref-${index}`}>
              <Card
                variant="outlined"
                sx={{ height: '100%', border: highContrast ? '1px solid #000000' : '1px solid #ccc' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ArticleIcon sx={{ color: highContrast ? '#000000' : '#003366', mr: 1 }} />
                    <EditableField
                      content={ref.title}
                      onSave={(value) => handleReferenceUpdate(index, 'title', value)}
                      fieldId={`legal-ref-title-${index}`}
                      variant="h6"
                      component="h3"
                      sx={{
                        color: highContrast ? '#000000' : '#003366',
                        fontSize: largeText ? '1.3rem' : '1.15rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <EditableField
                    content={ref.description}
                    onSave={(value) => handleReferenceUpdate(index, 'description', value)}
                    fieldId={`legal-ref-desc-${index}`}
                    variant="body2"
                    multiline
                    sx={{ ...textSizeProps }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Snackbar open={saveSuccess} autoHideDuration={6000} onClose={() => setSaveSuccess(false)}>
        <Alert onClose={() => setSaveSuccess(false)} severity="success">
          Changes saved successfully!
        </Alert>
      </Snackbar>

      <LegalFoundationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        data={data}
        onSave={handleFormSave}
        loading={loading}
      />
    </Box>
  );
};

export default LegalFoundationSection;

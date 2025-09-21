import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Gavel as GovernanceIcon,
  Architecture as DesignIcon,
  School as LearningIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Storage as DataIcon,
  OpenInNew as ExternalLinkIcon,
  Visibility as ValueIcon,
  Shield as ProtectIcon,
  Speed as EfficiencyIcon
} from '@mui/icons-material';
import EditableSection from '../components/EditableContent/EditableSection';
import EditablePrincipleCard from '../components/EditableContent/EditablePrincipleCard';
import EditableCorePracticeCard from '../components/EditableContent/EditableCorePracticeCard';
import EditableImplementationActionsCard from '../components/EditableContent/EditableImplementationActionsCard';
import federalDataStrategyService, { 
  FederalDataStrategyData, 
  Principle, 
  CorePractice,
  ImplementationAction
} from '../services/federalDataStrategyService';

const FederalDataStrategy = () => {
  const [data, setData] = useState<FederalDataStrategyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const strategyData = await federalDataStrategyService.getFederalDataStrategy();
      setData(strategyData);
      setError(null);
    } catch (err) {
      console.error('Error loading Federal Data Strategy:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to get icon for principles
  const getPrincipleIcon = (category: string) => {
    switch (category) {
      case 'Ethical Governance':
        return <GovernanceIcon />;
      case 'Conscious Design':
        return <DesignIcon />;
      case 'Learning Culture':
        return <LearningIcon />;
      default:
        return <GovernanceIcon />;
    }
  };

  // Helper function to get icon for core practices
  const getPracticeIcon = (title: string) => {
    switch (title) {
      case 'Value and Promote Data Use':
        return <ValueIcon />;
      case 'Govern and Protect Data':
        return <ProtectIcon />;
      case 'Enable Efficient, Appropriate Use':
        return <EfficiencyIcon />;
      default:
        return <ValueIcon />;
    }
  };

  // Update handlers
  const handleUpdateHeaderSection = async (updatedFields: { [key: string]: string }) => {
    try {
      const updatedData = await federalDataStrategyService.updateHeader(updatedFields);
      setData(updatedData);
      showSnackbar('Header section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update header section', 'error');
      throw error;
    }
  };

  const handleUpdateMissionSection = async (updatedFields: { [key: string]: string }) => {
    try {
      const updatedData = await federalDataStrategyService.updateMission(updatedFields);
      setData(updatedData);
      showSnackbar('Mission section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update mission section', 'error');
      throw error;
    }
  };

  const handleUpdatePrincipleCard = async (index: number, updatedPrinciple: Partial<Principle>) => {
    try {
      const updatedData = await federalDataStrategyService.updatePrinciple(index, updatedPrinciple);
      setData(updatedData);
      showSnackbar('Principle updated successfully');
    } catch (error) {
      showSnackbar('Failed to update principle', 'error');
      throw error;
    }
  };

  const handleUpdatePrinciplesSection = async (updatedFields: { [key: string]: string }) => {
    try {
      // Update the principles header section (title and description)
      const updatePromises = Object.entries(updatedFields).map(([field, value]) => 
        federalDataStrategyService.updatePrinciple(-1, { [field]: value })
      );
      
      const results = await Promise.all(updatePromises);
      // Use the last result as it will have all updates
      setData(results[results.length - 1]);
      showSnackbar('Principles section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update principles section', 'error');
      throw error;
    }
  };

  const handleUpdateCorePracticeCard = async (index: number, updatedPractice: Partial<CorePractice>) => {
    try {
      const updatedData = await federalDataStrategyService.updateCorePractice(index, updatedPractice);
      setData(updatedData);
      showSnackbar('Core practice updated successfully');
    } catch (error) {
      showSnackbar('Failed to update core practice', 'error');
      throw error;
    }
  };

  const handleUpdateCorePracticesSection = async (updatedFields: { [key: string]: string }) => {
    try {
      // Update the core practices header section (title and description)
      const updatePromises = Object.entries(updatedFields).map(([field, value]) => 
        federalDataStrategyService.updateCorePractice(-1, { [field]: value })
      );
      
      const results = await Promise.all(updatePromises);
      setData(results[results.length - 1]);
      showSnackbar('Core practices section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update core practices section', 'error');
      throw error;
    }
  };

  const handleUpdateImplementationSection = async (updatedFields: { [key: string]: string }) => {
    try {
      const updatedData = await federalDataStrategyService.updateImplementation(updatedFields);
      setData(updatedData);
      showSnackbar('Implementation section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update implementation section', 'error');
      throw error;
    }
  };

  const handleUpdateImplementationActions = async (updatedActions: ImplementationAction[]) => {
    try {
      const updatedData = await federalDataStrategyService.updateSection({
        sectionType: 'implementation',
        data: { actions: updatedActions }
      });
      setData(updatedData);
      showSnackbar('Implementation actions updated successfully');
    } catch (error) {
      showSnackbar('Failed to update implementation actions', 'error');
      throw error;
    }
  };

  const handleUpdateResourcesSection = async (updatedFields: { [key: string]: string }) => {
    try {
      const updatedData = await federalDataStrategyService.updateResources(updatedFields);
      setData(updatedData);
      showSnackbar('Resources section updated successfully');
    } catch (error) {
      showSnackbar('Failed to update resources section', 'error');
      throw error;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadData}>
            Retry
          </Button>
        }>
          {error || 'No data available'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <EditableSection
        title="Page Header"
        fields={[
          {
            key: 'title',
            label: 'Main Title',
            value: data.title,
            variant: 'h3',
            sx: { 
              component: 'h1',
              gutterBottom: true,
              fontWeight: 'bold',
              color: '#003366',
              textAlign: 'center',
              mb: 2
            }
          },
          {
            key: 'subtitle',
            label: 'Subtitle',
            value: data.subtitle,
            variant: 'h6',
            multiline: true,
            sx: {
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 3
            }
          }
        ]}
        onSave={handleUpdateHeaderSection}
        sx={{ mb: 4, textAlign: 'center' }}
      />
      
      {/* Tags */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {data.tags.map((tag, index) => (
          <Chip 
            key={index}
            label={tag} 
            color="primary" 
            variant="outlined" 
          />
        ))}
      </Box>

      {/* Mission and Vision Section */}
      <EditableSection
        title="Mission and Vision"
        fields={[
          {
            key: 'title',
            label: 'Mission Title',
            value: data.missionTitle,
            variant: 'h4',
            sx: {
              gutterBottom: true,
              color: '#003366',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }
          },
          {
            key: 'text',
            label: 'Mission Statement',
            value: data.missionText,
            variant: 'body1',
            multiline: true,
            sx: {
              fontSize: '1.1rem',
              lineHeight: 1.7
            }
          }
        ]}
        onSave={handleUpdateMissionSection}
        elevation={2}
        backgroundColor="#f8f9fa"
        sx={{ mb: 4 }}
      />

      {/* Principles Section */}
      <EditableSection
        title="Data Principles"
        fields={[
          {
            key: 'title',
            label: 'Principles Title',
            value: data.principlesTitle,
            variant: 'h4',
            sx: {
              gutterBottom: true,
              color: '#003366',
              fontWeight: 600,
              mb: 3
            }
          },
          {
            key: 'description',
            label: 'Principles Description',
            value: data.principlesDescription,
            variant: 'body1',
            multiline: true,
            sx: {
              color: 'text.secondary',
              mb: 3
            }
          }
        ]}
        onSave={handleUpdatePrinciplesSection}
        sx={{ mb: 3 }}
      />
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {data.principles.map((principle: Principle, index: number) => (
            <Grid item xs={12} md={4} key={index}>
              <EditablePrincipleCard
                principle={principle}
                index={index}
                onSave={handleUpdatePrincipleCard}
                getPrincipleIcon={getPrincipleIcon}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Core Practices Section */}
      <EditableSection
        title="Core Practices"
        fields={[
          {
            key: 'title',
            label: 'Practices Title',
            value: data.practicesTitle,
            variant: 'h4',
            sx: {
              gutterBottom: true,
              color: '#003366',
              fontWeight: 600,
              mb: 3
            }
          },
          {
            key: 'description',
            label: 'Practices Description',
            value: data.practicesDescription,
            variant: 'body1',
            multiline: true,
            sx: {
              color: 'text.secondary',
              mb: 3
            }
          }
        ]}
        onSave={handleUpdateCorePracticesSection}
        sx={{ mb: 3 }}
      />
      
      <Box sx={{ mb: 4 }}>

        <Grid container spacing={3}>
          {data.corePractices.map((practice: CorePractice, index: number) => (
            <Grid item xs={12} md={4} key={index}>
              <EditableCorePracticeCard
                practice={practice}
                index={index}
                onSave={handleUpdateCorePracticeCard}
                getPracticeIcon={getPracticeIcon}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Implementation and Actions Section */}
      <EditableSection
        title="Implementation and Actions"
        fields={[
          {
            key: 'title',
            label: 'Implementation Title',
            value: data.implementationTitle,
            variant: 'h4',
            sx: {
              gutterBottom: true,
              color: '#003366',
              fontWeight: 600
            }
          },
          {
            key: 'description',
            label: 'Implementation Description',
            value: data.implementationDescription,
            variant: 'body1',
            multiline: true,
            sx: {
              mb: 3,
              lineHeight: 1.7
            }
          }
        ]}
        onSave={handleUpdateImplementationSection}
        elevation={2}
        sx={{ p: 4, mb: 4 }}
      />
      
      {/* Implementation Actions Card */}
      <EditableImplementationActionsCard
        actions={data.implementationActions}
        onSave={handleUpdateImplementationActions}
      />

      {/* Resources */}
      {/* Resources Section */}
      <EditableSection
        title="Resources and Links"
        fields={[
          {
            key: 'title',
            label: 'Resources Title',
            value: data.resourcesTitle,
            variant: 'h4',
            sx: {
              gutterBottom: true,
              fontWeight: 600,
              color: 'white'
            }
          },
          {
            key: 'description',
            label: 'Resources Description',
            value: data.resourcesDescription,
            variant: 'body1',
            multiline: true,
            sx: {
              mb: 3,
              fontSize: '1.1rem',
              color: 'white'
            }
          }
        ]}
        onSave={handleUpdateResourcesSection}
        elevation={3}
        backgroundColor="#003366"
        sx={{ 
          p: 4, 
          color: 'white',
          textAlign: 'center'
        }}
      />
      
      {/* Resources Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ExternalLinkIcon />}
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#002244'
            }
          }}
          href={data.resourcesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit strategy.data.gov
        </Button>
      </Box>

      {/* Footer Note */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Source: 2020 Federal Data Strategy Framework PDF
        </Typography>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FederalDataStrategy;

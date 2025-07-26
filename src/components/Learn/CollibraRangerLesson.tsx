import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
  Architecture as ArchitectureIcon,
  Settings as SettingsIcon,
  DataObject as DataObjectIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
  AccountTree as AccountTreeIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const CollibraRangerLesson: React.FC<LessonContentProps> = ({
  onBack,
  onComplete,
  isCompleted,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Lessons
        </Button>
        <Button
          variant={isCompleted ? "outlined" : "contained"}
          color={isCompleted ? "success" : "primary"}
          onClick={onComplete}
          startIcon={isCompleted ? <CheckCircleIcon /> : <PlayIcon />}
        >
          {isCompleted ? "Completed" : "Mark as Complete"}
        </Button>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Collibra Ranger: Data Discovery and Metadata Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Collibra Ranger is a powerful tool for automated data discovery, metadata harvesting, 
          and data lineage tracking. Learn how to leverage Ranger for comprehensive data governance.
        </Typography>

        <Alert severity="info" sx={{ my: 3 }}>
          Ranger helps organizations automatically discover, catalog, and manage their data assets 
          across various data sources, making it easier to maintain data governance at scale.
        </Alert>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Key Capabilities
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DataObjectIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Automated Discovery
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Automatically scan and identify data assets across your enterprise, 
                  including databases, files, and applications.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Metadata Extraction
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Harvest technical metadata, including schemas, tables, columns, 
                  and relationships between data assets.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountTreeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Data Lineage
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Track data movement and transformations across systems to understand 
                  data flow and impact analysis.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Implementation Process
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          <Step>
            <StepLabel 
              onClick={() => handleStepClick(0)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1">Planning and Setup</Typography>
            </StepLabel>
            <StepContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Define Scope" 
                    secondary="Identify data sources and systems to be scanned"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Configure Access" 
                    secondary="Set up necessary permissions and credentials"
                  />
                </ListItem>
              </List>
            </StepContent>
          </Step>
          <Step>
            <StepLabel 
              onClick={() => handleStepClick(1)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1">Configuration</Typography>
            </StepLabel>
            <StepContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ArchitectureIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Set Up Connections" 
                    secondary="Configure connection details for each data source"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Define Scanning Schedule" 
                    secondary="Set up automated scanning intervals"
                  />
                </ListItem>
              </List>
            </StepContent>
          </Step>
          <Step>
            <StepLabel 
              onClick={() => handleStepClick(2)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1">Execution and Monitoring</Typography>
            </StepLabel>
            <StepContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Run Initial Scan" 
                    secondary="Execute first discovery scan and validate results"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Monitor Progress" 
                    secondary="Track scanning progress and review findings"
                  />
                </ListItem>
              </List>
            </StepContent>
          </Step>
        </Stepper>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Best Practices for Ranger Implementation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.contrastText">
                  Performance Optimization
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Schedule scans during off-peak hours"
                      secondary="Minimize impact on production systems"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'success.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'success.contrastText' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Optimize scan frequency"
                      secondary="Balance freshness with system load"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'success.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'success.contrastText' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.contrastText">
                  Governance Integration
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Align with data policies"
                      secondary="Ensure compliance with governance rules"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'primary.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'primary.contrastText' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Integrate with workflows"
                      secondary="Connect with approval and review processes"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'primary.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'primary.contrastText' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Key Takeaways
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Automated Discovery is Essential"
              secondary="Ranger reduces manual effort and improves accuracy in data cataloging"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Integration is Key"
              secondary="Connect Ranger with other Collibra tools for comprehensive governance"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Regular Maintenance"
              secondary="Keep configurations updated and monitor scanning performance"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default CollibraRangerLesson;

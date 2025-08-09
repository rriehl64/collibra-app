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

const EUnifyRangerLesson: React.FC<LessonContentProps> = ({
  onBack,
  onComplete,
  isCompleted,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    onComplete();
  };

  const lessonSteps = [
    {
      label: "Introduction to E-Unify Ranger",
      content: (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              E-Unify Ranger is a powerful data profiling and analytics tool that helps organizations discover, classify, and analyze their data assets across the enterprise.
            </Typography>
            <Typography variant="body1" paragraph>
              With E-Unify Ranger, you can:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><ArchitectureIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Automatically scan and profile data sources" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DataObjectIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Identify data patterns and relationships" />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Detect sensitive data and compliance issues" />
              </ListItem>
              <ListItem>
                <ListItemIcon><AnalyticsIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Generate comprehensive data quality metrics" />
              </ListItem>
            </List>
          </Box>
        </>
      ),
    },
    {
      label: "Setting Up E-Unify Ranger",
      content: (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              Before you can start using E-Unify Ranger, you need to set it up properly:
            </Typography>
            <ol style={{ paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <Typography variant="body1">
                  Install the E-Unify Ranger application on your system
                </Typography>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Typography variant="body1">
                  Configure connection to your E-Unify environment
                </Typography>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Typography variant="body1">
                  Set up connection profiles for your data sources
                </Typography>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Typography variant="body1">
                  Configure scanning schedules and parameters
                </Typography>
              </li>
            </ol>
            <Alert severity="info" sx={{ mt: 2 }}>
              Your system administrator may have already configured E-Unify Ranger for your organization. Check with them before proceeding with a new installation.
            </Alert>
          </Box>
        </>
      ),
    },
    {
      label: "Running Your First Scan",
      content: (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              Follow these steps to run your first data scan with E-Unify Ranger:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Step 1: Select a Data Source</Typography>
              <Typography variant="body2" paragraph>
                From the E-Unify Ranger dashboard, select "New Scan" and choose a data source from your configured connections.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Step 2: Configure Scan Parameters</Typography>
              <Typography variant="body2" paragraph>
                Choose which schema, tables, and columns to include. Set sampling parameters and scanning depth.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Step 3: Start the Scan</Typography>
              <Typography variant="body2" paragraph>
                Review your configuration and click "Start Scan" to begin the profiling process.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Step 4: Monitor Progress</Typography>
              <Typography variant="body2">
                The scan progress will be displayed. Large datasets may take some time to complete.
              </Typography>
            </Paper>
          </Box>
        </>
      ),
    },
    {
      label: "Analyzing Results",
      content: (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              After completing a scan, E-Unify Ranger provides detailed analytics:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Data Quality Metrics</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><SpeedIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Completeness" secondary="Percentage of non-null values" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Validity" secondary="Data conforming to rules/patterns" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><AccountTreeIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Consistency" secondary="Data consistency across tables" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Discovery Results</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><SecurityIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Sensitive Data" secondary="PII, financial data, etc." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><AccountTreeIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Relationships" secondary="Foreign key dependencies" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><AssignmentIcon color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Business Terms" secondary="Automatic term association" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ),
    },
    {
      label: "Integrating with E-Unify Data Catalog",
      content: (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              One of the most powerful features of E-Unify Ranger is its seamless integration with the E-Unify Data Catalog:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Automatic Asset Registration" 
                  secondary="Discovered data assets can be automatically registered in your catalog" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Metadata Enrichment" 
                  secondary="Technical metadata from Ranger can enrich your business metadata" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Data Quality Dashboards" 
                  secondary="Quality metrics flow into catalog dashboards" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Governance Workflow" 
                  secondary="Trigger governance workflows based on discovered issues" 
                />
              </ListItem>
            </List>
            <Alert severity="success" sx={{ mt: 2 }}>
              By integrating E-Unify Ranger with your Data Catalog, you create a complete view of your data landscape that combines both technical and business perspectives.
            </Alert>
          </Box>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Lessons
        </Button>
        <Typography variant="h5">E-Unify Ranger</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Learn how to use E-Unify Ranger for data profiling and discovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Duration: 20 minutes
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {lessonSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={
                        index === lessonSteps.length - 1
                          ? handleFinish
                          : handleNext
                      }
                      sx={{ mr: 1 }}
                    >
                      {index === lessonSteps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>

      {isCompleted && (
        <Alert severity="success" sx={{ mt: 2 }}>
          You have completed this lesson. You can review the material or return to the lesson list.
        </Alert>
      )}
    </Box>
  );
};

export default EUnifyRangerLesson;

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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Rule as RuleIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const DataGovernanceLesson: React.FC<LessonContentProps> = ({
  onBack,
  onComplete,
  isCompleted,
}) => {
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
          Understanding Data Governance
        </Typography>
        
        <Typography variant="body1" paragraph>
          Data Governance is the foundation of effective data management and compliance. 
          This lesson explores the key concepts, frameworks, and best practices of data governance.
        </Typography>

        <Alert severity="info" sx={{ my: 3 }}>
          Data Governance establishes the strategy, objectives, and policies for managing 
          enterprise data assets. It ensures data is consistent, trustworthy, and properly used.
        </Alert>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Core Components of Data Governance
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PolicyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Policies & Standards
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Define rules, guidelines, and standards for data handling, quality, 
                  and security across the organization.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Roles & Responsibilities
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Establish clear ownership and accountability for data assets through 
                  defined roles like Data Stewards and Owners.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Processes & Workflows
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Implement structured processes for data management, quality control, 
                  and issue resolution.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Key Data Governance Activities
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Security & Privacy" 
              secondary="Implement controls and policies to protect sensitive data and ensure compliance with regulations like GDPR and CCPA"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <RuleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Quality Management" 
              secondary="Define and monitor data quality rules, metrics, and standards to maintain high-quality data"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PolicyIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Policy Management" 
              secondary="Create, maintain, and enforce data policies across the organization"
            />
          </ListItem>
        </List>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Implementing Data Governance
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            A successful data governance implementation follows these key steps:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="1. Assessment & Planning" 
                secondary="Evaluate current state and define governance objectives"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="2. Framework Development" 
                secondary="Create policies, standards, and procedures"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="3. Organization & Roles" 
                secondary="Define governance structure and assign responsibilities"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="4. Tool Implementation" 
                secondary="Deploy governance tools and platforms"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="5. Monitoring & Improvement" 
                secondary="Track metrics and continuously improve processes"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Best Practices & Key Takeaways
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.contrastText">
                  Do's
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Start with clear objectives"
                      sx={{ color: 'primary.contrastText' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Engage stakeholders early"
                      sx={{ color: 'primary.contrastText' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Document policies clearly"
                      sx={{ color: 'primary.contrastText' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error.contrastText">
                  Don'ts
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'error.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Implement without planning"
                      sx={{ color: 'error.contrastText' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'error.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ignore business needs"
                      sx={{ color: 'error.contrastText' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'error.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Skip stakeholder buy-in"
                      sx={{ color: 'error.contrastText' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DataGovernanceLesson;

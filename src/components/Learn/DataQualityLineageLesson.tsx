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
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
  Timeline as TimelineIcon,
  VerifiedUser as VerifiedUserIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Route as RouteIcon,
  Source as SourceIcon,
  Transform as TransformIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const DataQualityLineageLesson: React.FC<LessonContentProps> = ({
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
          Data Quality and Lineage
        </Typography>
        
        <Typography variant="body1" paragraph>
          Understanding data quality and lineage is crucial for making informed decisions 
          and maintaining trust in your data assets. Learn how to assess, improve, and 
          track data throughout its lifecycle.
        </Typography>

        <Alert severity="info" sx={{ my: 3 }}>
          Data quality and lineage work together to provide a complete picture of your 
          data's reliability and journey through your organization.
        </Alert>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Data Quality Dimensions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: 'Accuracy',
              score: 85,
              description: 'Degree to which data correctly represents the real-world value',
              icon: <VerifiedUserIcon />
            },
            {
              title: 'Completeness',
              score: 92,
              description: 'Extent to which required data is available',
              icon: <CheckCircleIcon />
            },
            {
              title: 'Consistency',
              score: 78,
              description: 'Data is the same across all systems',
              icon: <TrendingUpIcon />
            },
            {
              title: 'Timeliness',
              score: 95,
              description: 'Data is up-to-date and available when needed',
              icon: <AssessmentIcon />
            }
          ].map((dimension) => (
            <Grid item xs={12} md={6} key={dimension.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {dimension.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {dimension.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {dimension.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={dimension.score} 
                        color={dimension.score >= 90 ? "success" : dimension.score >= 75 ? "primary" : "warning"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {dimension.score}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Data Lineage Components
        </Typography>

        <Box sx={{ position: 'relative', mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: 2,
              bgcolor: 'primary.main',
              zIndex: 0
            }
          }}>
            {[
              { icon: <SourceIcon />, label: 'Source Systems' },
              { icon: <TransformIcon />, label: 'Transformations' },
              { icon: <StorageIcon />, label: 'Target Systems' }
            ].map((step, index) => (
              <Tooltip title={step.label} key={index}>
                <Card sx={{ 
                  zIndex: 1, 
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  p: 2,
                  borderRadius: '50%'
                }}>
                  {step.icon}
                </Card>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Implementing Data Quality Controls
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <RouteIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Profiling" 
              secondary="Analyze data to understand its content, relationships, and quality issues"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TimelineIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Quality Monitoring" 
              secondary="Set up automated checks and alerts for data quality issues"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Impact Analysis" 
              secondary="Assess how data quality issues affect downstream processes"
            />
          </ListItem>
        </List>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Best Practices
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.contrastText">
                  Data Quality
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Define quality rules"
                      secondary="Establish clear metrics and thresholds"
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
                      primary="Implement validation"
                      secondary="Automate quality checks at data entry"
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
                  Data Lineage
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Document transformations"
                      secondary="Track all data modifications"
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
                      primary="Maintain metadata"
                      secondary="Keep transformation logic up-to-date"
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
              primary="Quality is Continuous"
              secondary="Data quality requires ongoing monitoring and improvement"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Lineage Provides Context"
              secondary="Understanding data flow helps in impact analysis and problem resolution"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Automation is Key"
              secondary="Implement automated checks and documentation processes"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default DataQualityLineageLesson;

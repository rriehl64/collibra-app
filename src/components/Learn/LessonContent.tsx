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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
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
          Introduction to Data Intelligence
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your journey into Data Intelligence! In this introductory lesson, 
          we'll explore the fundamental concepts of data intelligence and why it's 
          crucial for modern organizations.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          What is Data Intelligence?
        </Typography>
        
        <Typography variant="body1" paragraph>
          Data Intelligence is the practice of using data to gain meaningful insights 
          and make better business decisions. It combines several key elements:
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Quality" 
              secondary="Ensuring your data is accurate, complete, and reliable"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Governance" 
              secondary="Managing data availability, usability, consistency, and security"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Catalog" 
              secondary="Organizing and inventorying data assets across your organization"
            />
          </ListItem>
        </List>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Why Data Intelligence Matters
        </Typography>

        <Typography variant="body1" paragraph>
          In today's data-driven world, organizations need to make informed decisions 
          quickly and efficiently. Data Intelligence provides the framework to:
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, my: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Improve Decision Making
              </Typography>
              <Typography variant="body2">
                Access reliable data quickly to make informed business decisions
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ensure Compliance
              </Typography>
              <Typography variant="body2">
                Meet regulatory requirements and maintain data privacy standards
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Increase Efficiency
              </Typography>
              <Typography variant="body2">
                Streamline data operations and reduce time spent searching for information
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Key Takeaways
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Understanding the core components of Data Intelligence" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Recognizing the importance of data quality and governance" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Identifying the business benefits of implementing Data Intelligence" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default LessonContent;

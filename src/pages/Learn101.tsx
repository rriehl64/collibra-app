import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import LessonContent from '../components/Learn/LessonContent';
import DataGovernanceLesson from '../components/Learn/DataGovernanceLesson';
import DataCatalogLesson from '../components/Learn/DataCatalogLesson';
import BusinessGlossaryLesson from '../components/Learn/BusinessGlossaryLesson';
import DataQualityLineageLesson from '../components/Learn/DataQualityLineageLesson';
import EUnifyRangerLesson from '../components/Learn/EUnifyRangerLesson';

interface LessonType {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

const lessons: LessonType[] = [
  {
    id: 1,
    title: "Introduction to Data Intelligence",
    duration: "15 mins",
    completed: false
  },
  {
    id: 2,
    title: "Understanding Data Governance",
    duration: "20 mins",
    completed: false
  },
  {
    id: 3,
    title: "Data Catalog Fundamentals",
    duration: "25 mins",
    completed: false
  },
  {
    id: 4,
    title: "Working with Business Glossary",
    duration: "20 mins",
    completed: false
  },
  {
    id: 5,
    title: "Data Quality and Lineage",
    duration: "30 mins",
    completed: false
  },
  {
    id: 6,
    title: "E-Unify Ranger",
    duration: "20 mins",
    completed: false
  }
];

const Learn101 = () => {
  const [lessonState, setLessonState] = React.useState(lessons);
  const [selectedLesson, setSelectedLesson] = React.useState<number | null>(null);
  const totalLessons = lessonState.length;
  const completedLessons = lessonState.filter(lesson => lesson.completed).length;
  const progress = (completedLessons / totalLessons) * 100;

  const handleLessonClick = (lessonId: number) => {
    setSelectedLesson(lessonId);
  };

  const handleLessonComplete = () => {
    if (selectedLesson) {
      setLessonState(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === selectedLesson
            ? { ...lesson, completed: !lesson.completed }
            : lesson
        )
      );
    }
  };

  const handleBack = () => {
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    const currentLesson = lessonState.find(lesson => lesson.id === selectedLesson);
    
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        {selectedLesson === 1 && (
          <LessonContent
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
        {selectedLesson === 2 && (
          <DataGovernanceLesson
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
        {selectedLesson === 3 && (
          <DataCatalogLesson
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
        {selectedLesson === 4 && (
          <BusinessGlossaryLesson
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
        {selectedLesson === 5 && (
          <DataQualityLineageLesson
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
        {selectedLesson === 6 && (
          <EUnifyRangerLesson
            onBack={handleBack}
            onComplete={handleLessonComplete}
            isCompleted={currentLesson?.completed || false}
          />
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
          E-Unify 101: Your journey to data intelligence starts here
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Master the fundamentals of data intelligence and governance with our comprehensive introduction course.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Chip
            icon={<SchoolIcon />}
            label="E-Learning"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<TimeIcon />}
            label="2 hours total"
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  mb: 1
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                {completedLessons} of {totalLessons} lessons completed
              </Typography>
            </Box>

            <List sx={{ mt: 4 }}>
              {lessonState.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                    p: 2,
                    '&:last-child': { mb: 0 },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <ListItemIcon>
                    {lesson.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <PlayIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {lesson.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {lesson.duration}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    variant={lesson.completed ? "outlined" : "contained"}
                    color={lesson.completed ? "success" : "primary"}
                    onClick={() => handleLessonClick(lesson.id)}
                    sx={{ 
                      minWidth: 120,
                      ml: 2,
                      '&:hover': {
                        backgroundColor: lesson.completed ? 'success.light' : 'primary.dark',
                        color: 'white'
                      }
                    }}
                  >
                    {lesson.completed ? "Review" : "Start"}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: 'background.paper',
            boxShadow: (theme) => theme.shadows[1]
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                What you'll learn
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Data intelligence fundamentals" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Governance best practices" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Data catalog management" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Business glossary usage" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Data quality monitoring" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="E-Unify Ranger" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Learn101;

import React, { useState, useEffect, useContext, createContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import LearningInsights from '../components/LearningInsights';
import AdaptiveRecommendations from '../components/AdaptiveRecommendations';
import HandbookTab from '../components/handbook/HandbookTab';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  AvatarGroup,
  Chip,
  Link,
  LinearProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Rating,
  Tooltip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  CircularProgress,
  Badge,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Backdrop,
  Modal,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Timer as TimeIcon,
  School as SchoolIcon,
  Book as BookIcon,
  VerifiedUser as VerifiedUserIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Layers as LayersIcon,
  MenuBook as MenuBookIcon,
  LibraryBooks as LibraryBooksIcon,
  Public as PublicIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Timeline as TimelineIcon,
  ViewQuilt as ViewQuiltIcon,
  HelpOutline as HelpOutlineIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  Lock as LockIcon,
  Check as CheckIcon,
  Event as EventIcon,
  Recommend as RecommendIcon,
  AutoStories as AutoStoriesIcon,
  Article as ArticleIcon,
  Insights as InsightsIcon,
  Close as CloseIcon,
  QrCode as QrCodeIcon,
  FolderShared as FolderSharedIcon,
  LocalLibrary as LocalLibraryIcon,
  Business as BusinessIcon,
  Lightbulb as LightbulbIcon,
  Link as LinkIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  Leaderboard as LeaderboardIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Forum as ForumIcon,
  Groups as GroupsIcon,
  Folder as FolderIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Policy as PolicyIcon,
  DataUsage as DataUsageIcon,
  CloudDownload as CloudDownloadIcon,
  ContactSupport as ContactSupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  DateRange as DateRangeIcon,
  EmojiEvents as EmojiEventsIcon,
  DoneAll as DoneAllIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Quiz as QuizIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material';

// Enhanced model types for the learning module
interface LessonType {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked?: boolean;
  content?: string;
  prerequisites?: number[];
  quizId?: number;
  resourceIds?: number[];
}

interface ModuleType {
  id: number;
  title: string;
  description: string;
  lessons: LessonType[];
  completionPercentage: number;
  role?: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  lessonId: number;
}

interface TrainingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  enrolled: number;
  instructors: string[];
  type: 'virtual' | 'in-person' | 'hybrid';
}

export interface UserProgress {
  userId: string;
  completedLessons: number[];
  quizScores: { quizId: number; score: number }[];
  certificates: Certificate[];
  roleBasedPath: string;
  learningStreak: number;
  lastActivityDate: string;
  timeSpent: { date: string; minutes: number }[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedResources: { id: string; title: string; type: string; url?: string }[];
  handbookProgress?: {
    lastVisitedChapter: string;
    lastVisitedSection: string;
    bookmarks: {
      chapterId: string;
      sectionId: string;
      note?: string;
      dateAdded: string;
    }[];
    completedSections: string[];
    readTime: number;
    lastActivityDate?: string;
  };
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  expirationDate?: string;
  moduleId: number;
  score: number;
  userName?: string; // Added missing userName property
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Sample quiz questions for interactive learning modules
const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is data literacy?",
    options: [
      "The ability to read and write data files",
      "The ability to create databases",
      "The ability to read, understand, analyze and communicate with data",
      "The ability to program data algorithms"
    ],
    correctAnswer: 2,
    explanation: "Data literacy is the ability to read, understand, analyze and communicate with data. It encompasses understanding data sources, methods of collection, and how to interpret and apply insights."
  },
  {
    id: 2,
    question: "Which of these is NOT a pillar of data literacy?",
    options: [
      "Data Quality Assessment",
      "Statistical Analysis",
      "Programming Proficiency",
      "Visualization Interpretation"
    ],
    correctAnswer: 2,
    explanation: "While basic understanding of data tools is helpful, programming proficiency is not a core pillar of data literacy. The focus is on understanding, interpreting, and applying data insights rather than technical implementation."
  }
];

// Enhanced module data structure
const modules: ModuleType[] = [
  {
    id: 1,
    title: "Foundations of Data Literacy",
    description: "Essential concepts and skills for understanding and working with data",
    level: "beginner",
    completionPercentage: 0,
    lessons: [
      {
        id: 1,
        title: "Fundamentals of Data Literacy",
        duration: "45 min",
        completed: false,
        locked: false,
        quizId: 1,
        content: "This introductory lesson covers the basic concepts of data literacy and why it matters in your daily work at USCIS."
      },
      {
        id: 2,
        title: "Understanding Data Quality",
        duration: "30 min",
        completed: false,
        locked: true,
        prerequisites: [1],
        content: "Learn how to assess data quality and reliability before making decisions based on that data."
      },
      {
        id: 3,
        title: "Data Visualization Principles",
        duration: "60 min",
        completed: false,
        locked: true,
        prerequisites: [1, 2],
        content: "Discover key principles for creating and interpreting effective data visualizations."
      },
    ]
  },
  {
    id: 2,
    title: "Applied Data Skills",
    description: "Practical applications of data literacy in government contexts",
    level: "intermediate",
    completionPercentage: 0,
    lessons: [
      {
        id: 4,
        title: "Interpreting Statistical Data",
        duration: "45 min",
        completed: false,
        locked: true,
        prerequisites: [1, 2, 3],
        content: "Build skills to interpret statistical information and understand its implications."
      },
      {
        id: 5,
        title: "Ethics in Data Usage",
        duration: "30 min",
        completed: false,
        locked: true,
        prerequisites: [1, 2],
        content: "Explore ethical considerations when working with sensitive data in a government context."
      },
    ]
  },
  {
    id: 3,
    title: "Leadership and Decision Making",
    description: "Advanced concepts for data-driven leadership and decision making",
    level: "advanced",
    role: ["Manager", "Director", "Analyst"],
    completionPercentage: 0,
    lessons: [
      {
        id: 6,
        title: "Making Data-Driven Decisions",
        duration: "60 min",
        completed: false,
        locked: true,
        prerequisites: [1, 2, 3, 4, 5],
        content: "Learn frameworks for incorporating data insights into strategic decision-making processes."
      }
    ]
  }
];

// Initialize user progress (would typically come from backend API)
const initialUserProgress: UserProgress = {
  userId: "user123",
  completedLessons: [1],
  quizScores: [
    { quizId: 1, score: 85 }
  ],
  certificates: [],
  roleBasedPath: "Analyst",
  learningStreak: 7,
  lastActivityDate: new Date().toISOString(),
  timeSpent: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 25 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 40 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 30 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 45 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 20 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes: 35 },
    { date: new Date().toISOString().split('T')[0], minutes: 15 },
  ],
  strengths: ["Data Visualization", "Data Privacy"],
  areasForImprovement: ["Data Governance", "Statistical Analysis"],
  recommendedResources: [
    { id: "res-1", title: "Data Governance Fundamentals", type: "course" },
    { id: "res-2", title: "Statistics for Data Analysis", type: "workshop" },
    { id: "res-3", title: "Data Visualization Best Practices", type: "article", url: "#" }
  ]
};

// Create context for user progress
interface UserProgressContextType {
  userProgress: UserProgress;
  modules: ModuleType[];
  updateLessonStatus: (lessonId: number, completed: boolean) => void;
  updateQuizScore: (quizId: number, score: number) => void;
  addCertificate: (certificate: Certificate) => void;
  isLessonAccessible: (lesson: LessonType) => boolean;
  updateHandbookProgress: (handbookProgress: UserProgress['handbookProgress']) => void;
}

const defaultUserProgressContext: UserProgressContextType = {
  userProgress: initialUserProgress,
  modules: modules,
  updateLessonStatus: () => {},
  updateQuizScore: () => {},
  addCertificate: () => {},
  isLessonAccessible: () => false,
  updateHandbookProgress: () => {},
};

const UserProgressContext = createContext<UserProgressContextType>(defaultUserProgressContext);

const UserProgressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [moduleState, setModuleState] = useState<ModuleType[]>(modules);
  
  // Update completion percentages when progress changes
  useEffect(() => {
    const updatedModules = moduleState.map(module => {
      const moduleLesson = module.lessons.map(lesson => lesson.id);
      const completedModuleLessons = userProgress.completedLessons.filter(
        id => moduleLesson.includes(id)
      ).length;
      
      return {
        ...module,
        completionPercentage: moduleLesson.length > 0 
          ? (completedModuleLessons / moduleLesson.length) * 100
          : 0
      };
    });
    
    setModuleState(updatedModules);
  }, [userProgress.completedLessons]);
  
  const updateLessonStatus = (lessonId: number, completed: boolean) => {
    setUserProgress(prev => {
      let updatedCompletedLessons;
      
      if (completed) {
        updatedCompletedLessons = [...prev.completedLessons, lessonId];
      } else {
        updatedCompletedLessons = prev.completedLessons.filter(id => id !== lessonId);
      }
      
      return {
        ...prev,
        completedLessons: updatedCompletedLessons,
        lastActivityDate: new Date().toISOString()
      };
    });
  };
  
  const updateQuizScore = (quizId: number, score: number) => {
    setUserProgress(prev => {
      // Find if quiz score already exists and update it, or add new entry
      const existingIndex = prev.quizScores.findIndex(item => item.quizId === quizId);
      const updatedScores = [...prev.quizScores];
      
      if (existingIndex >= 0) {
        // Update existing entry
        updatedScores[existingIndex] = { quizId, score };
      } else {
        // Add new entry
        updatedScores.push({ quizId, score });
      }
      
      return {
        ...prev,
        quizScores: updatedScores,
        lastActivityDate: new Date().toISOString()
      };
    });
  };
  
  const addCertificate = (certificate: Certificate) => {
    setUserProgress(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificate],
      lastActivityDate: new Date().toISOString()
    }));
  };
  
  const isLessonAccessible = (lesson: LessonType) => {
    if (lesson.locked === undefined || lesson.locked === false) return true;
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
    
    // Check if all prerequisites are completed
    return lesson.prerequisites.every(prereqId => 
      userProgress.completedLessons.includes(prereqId)
    );
  };
  
  // Update handbook progress
  const updateHandbookProgress = (handbookProgress: UserProgress['handbookProgress']) => {
    setUserProgress(prev => ({
      ...prev,
      handbookProgress,
      lastActivityDate: new Date().toISOString()
    }));
  };
  
  return (
    <UserProgressContext.Provider 
      value={{
        userProgress,
        modules: moduleState,
        updateLessonStatus,
        updateQuizScore,
        addCertificate,
        isLessonAccessible,
        updateHandbookProgress
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

// Custom hook for accessing user progress
const useUserProgress = () => useContext(UserProgressContext);

const lessons: LessonType[] = [
  {
    id: 1,
    title: "Fundamentals of Data Literacy",
    duration: "20 mins",
    completed: false
  },
  {
    id: 2,
    title: "Data Interpretation & Analysis",
    duration: "25 mins",
    completed: false
  },
  {
    id: 3,
    title: "Critical Evaluation of Data",
    duration: "20 mins",
    completed: false
  },
  {
    id: 4,
    title: "Effective Data Communication",
    duration: "25 mins",
    completed: false
  },
  {
    id: 5,
    title: "Data Ethics & Privacy",
    duration: "30 mins",
    completed: false
  },
  {
    id: 6,
    title: "Data-Driven Decision Making",
    duration: "25 mins",
    completed: false
  }
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`data-literacy-tabpanel-${index}`}
      aria-labelledby={`data-literacy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `data-literacy-tab-${index}`,
    'aria-controls': `data-literacy-tabpanel-${index}`,
  };
}

const DataLiteracyModule = () => {
  // State for tab management
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  
  // State for interactive elements
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // State for modal dialogs
  const [showCertificate, setShowCertificate] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSeverity, setFeedbackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  // Calculate timestamp for certificate generation
  const certificateDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Get user progress context
  const { 
    userProgress, 
    modules, 
    updateLessonStatus, 
    updateQuizScore, 
    addCertificate,
    isLessonAccessible,
    updateHandbookProgress
  } = useUserProgress();
  
  // Calculate aggregated progress
  const totalLessonsCount = modules.reduce((count, module) => count + module.lessons.length, 0);
  const completedLessonsCount = userProgress.completedLessons.length;
  const overallProgress = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  // Flatten all lessons from all modules for easier access
  const allLessons = modules.flatMap(module => module.lessons);

  // Handle selecting a lesson to view
  const handleLessonClick = (lessonId: number) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    
    if (lesson && (!lesson.locked || isLessonAccessible(lesson))) {
      setSelectedLesson(lessonId);
      setShowQuiz(false);
      setQuizSubmitted(false);
    } else {
      // Show feedback for locked lessons
      setFeedbackMessage('This lesson is locked. Please complete the prerequisites first.');
      setFeedbackSeverity('info');
      setShowFeedback(true);
    }
  };

  // Handle marking a lesson as complete
  const handleLessonComplete = (lessonId: number) => {
    // Check if the lesson has a quiz requirement
    const lesson = allLessons.find(l => l.id === lessonId);
    
    if (lesson?.quizId) {
      // If lesson has a quiz, show it
      const quiz = sampleQuizQuestions.find(q => q.id === lesson.quizId);
      if (quiz) {
        setCurrentQuiz({
          id: lesson.quizId,
          title: `Quiz: ${lesson.title}`,
          description: 'Complete this quiz to mark the lesson as complete.',
          questions: [quiz], // In real app, we'd have multiple questions
          passingScore: 70,
          attempts: 0,
          lessonId: lesson.id
        });
        setQuizAnswers([]);
        setShowQuiz(true);
      }
    } else {
      // If no quiz, directly mark as complete
      const isCompleted = userProgress.completedLessons.includes(lessonId);
      updateLessonStatus(lessonId, !isCompleted);
      
      setFeedbackMessage(!isCompleted ? 'Lesson marked as complete!' : 'Lesson marked as incomplete');
      setFeedbackSeverity(!isCompleted ? 'success' : 'info');
      setShowFeedback(true);
    }
  };

  // Handle quiz answer selection
  const handleQuizAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };
  
  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    
    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Update user progress
    updateQuizScore(currentQuiz.id, score);
    
    if (score >= currentQuiz.passingScore) {
      // Mark lesson as complete if passed
      updateLessonStatus(currentQuiz.lessonId, true);
      
      setFeedbackMessage(`Congratulations! You scored ${score}% and passed the quiz.`);
      setFeedbackSeverity('success');
    } else {
      setFeedbackMessage(`You scored ${score}%. You need ${currentQuiz.passingScore}% to pass.`);
      setFeedbackSeverity('warning');
    }
    
    // Show feedback after quiz
    setShowFeedback(true);
  };
  
  // Handle going back to lesson list
  const handleBack = () => {
    setSelectedLesson(null);
    setShowQuiz(false);
  };
  
  // Check if all lessons are completed to enable certificate
  const allModulesCompleted = modules.every(module => 
    module.lessons.every(lesson => 
      userProgress.completedLessons.includes(lesson.id)
    )
  );
  
  // Function to get role description
  const getRoleDescription = (role: string): string => {
    switch(role) {
      case 'Analyst':
        return 'Focus on data analysis techniques, statistical methods, and visualization skills.';
      case 'Business User':
        return 'Emphasis on data interpretation, basic visualization reading, and informed decision-making.';
      case 'Manager':
        return 'Strategic focus on data-driven decision making and overseeing data initiatives.';
      case 'Data Steward':
        return 'Specialized track on data governance, quality management, and metadata practices.';
      default:
        return 'Customized learning path based on your specific role and responsibilities.';
    }
  };
  
  // Handle role path change
  const handleRolePathChange = (role: string) => {
    // In a real implementation, this would update the user profile in the backend
    const updatedProgress = {
      ...userProgress,
      roleBasedPath: role,
      lastActivityDate: new Date().toISOString()
    };
    
    // For now, we'll just update the local state and show feedback
    // This is a placeholder for actual API integration
    setFeedbackMessage(`Learning path updated to ${role}`);
    setFeedbackSeverity('success');
    setShowFeedback(true);
  };
  
  // Handle certificate generation
  const handleCertificateGenerate = () => {
    // Generate a unique certificate ID
    const certificateId = `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create certificate metadata
    const newCertificate: Certificate = {
      id: certificateId,
      title: "USCIS Data Literacy Certificate",
      issuedDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      moduleId: 0, // 0 represents all modules
      score: overallProgress // Add the missing score property
    };
    
    // Update current certificate
    setCurrentCertificate(newCertificate);
    
    // Show certificate dialog
    setShowCertificate(true);
    
    // Set focus to certificate content after dialog opens (for accessibility)
    setTimeout(() => {
      const certificateContent = document.getElementById('certificate-content');
      if (certificateContent) {
        certificateContent.focus();
      }
    }, 100);
  };
  
  // Handle certificate download or print
  const handleCertificateDownload = (type: 'pdf' | 'print') => {
    // Show feedback while processing
    setFeedbackMessage(`Preparing your certificate for ${type === 'pdf' ? 'download' : 'printing'}...`);
    setFeedbackSeverity('info');
    setShowFeedback(true);
    
    // In a real implementation, this would use a proper PDF generation library
    // or print API. For now, we're simulating the action.
    setTimeout(() => {
      if (type === 'pdf') {
        // Simulate PDF download completion
        setFeedbackMessage('Certificate downloaded successfully!');
        setFeedbackSeverity('success');
        setShowFeedback(true);
        
        // In a real implementation, this would trigger the actual download
        console.log('PDF download triggered for certificate:', currentCertificate);
      } else {
        // Simulate print dialog
        setFeedbackMessage('Certificate sent to printer!');
        setFeedbackSeverity('success');
        setShowFeedback(true);
        
        // In a real implementation, this would open the print dialog
        console.log('Print triggered for certificate:', currentCertificate);
      }
    }, 1500);
  };

  if (selectedLesson) {
    const currentLesson = allLessons.find(lesson => lesson.id === selectedLesson);
    
    // Placeholder for lesson content components
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Button 
            variant="outlined"
            onClick={handleBack}
            sx={{ mb: 3 }}
            aria-label="Return to lesson list"
          >
            Back to Lessons
          </Button>
          
          <Typography variant="h4" gutterBottom>
            {currentLesson?.title}
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="body1" paragraph>
              This lesson content is currently under development. The module will include interactive content, videos, 
              case studies and practical exercises related to {currentLesson?.title.toLowerCase()}.
            </Typography>
            <Typography variant="body1" paragraph>
              In a complete implementation, this page would contain detailed lesson content specific to {currentLesson?.title}.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              aria-label="Return to lesson list"
            >
              Back
            </Button>
            
            <Button
              variant={currentLesson?.completed ? "outlined" : "contained"}
              color={currentLesson?.completed ? "success" : "primary"}
              onClick={() => currentLesson && handleLessonComplete(currentLesson.id)}
              aria-label={currentLesson?.completed ? "Mark lesson as incomplete" : "Mark lesson as complete"}
            >
              {currentLesson?.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper sx={{ mb: 4, px: 3 }}>
        <Box sx={{ p: 3, backgroundColor: 'primary.main', color: '#ffffff' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', fontWeight: 700 }} tabIndex={-1} id="page-title">
            Data Literacy Module
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
            Empowering employees with the skills to effectively read, understand, analyze, and communicate with data.
          </Typography>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Data literacy module sections"
            sx={{ 
              backgroundColor: 'background.paper'
            }}
        >
          <Tab 
            icon={<InfoIcon />} 
            iconPosition="start" 
            label="Overview" 
            {...a11yProps(0)} 
            aria-label="Overview tab"
          />
          <Tab 
            icon={<LightbulbIcon />} 
            iconPosition="start" 
            label="Why It Matters" 
            {...a11yProps(1)} 
            aria-label="Why it matters tab"
          />
          <Tab 
            icon={<MenuBookIcon />} 
            iconPosition="start" 
            label="Learning Modules" 
            {...a11yProps(2)} 
            aria-label="Learning modules tab"
          />
          <Tab 
            icon={<PeopleIcon />} 
            iconPosition="start" 
            label="Roles" 
            {...a11yProps(3)} 
            aria-label="Roles tab"
          />
          <Tab 
            icon={<BookIcon />} 
            iconPosition="start" 
            label="Resources" 
            {...a11yProps(4)} 
            aria-label="Resources tab"
          />
          <Tab 
            icon={<AssessmentIcon />} 
            iconPosition="start" 
            label="Assessment" 
            {...a11yProps(5)} 
            aria-label="Assessment tab"
          />
          <Tab 
            icon={<BusinessIcon />} 
            iconPosition="start" 
            label="Agency Context" 
            {...a11yProps(6)} 
            aria-label="Agency context tab"
          />
          <Tab 
            icon={<LibraryBooksIcon />} 
            iconPosition="start" 
            label="Handbook" 
            {...a11yProps(7)} 
            aria-label="Data literacy handbook tab"
          />
          <Tab 
            icon={<EventIcon />} 
            iconPosition="start" 
            label="Events" 
            {...a11yProps(8)} 
            aria-label="Events tab"
          />
          <Tab 
            icon={<ContactSupportIcon />} 
            iconPosition="start" 
            label="Contact" 
            {...a11yProps(9)} 
            aria-label="Contact tab"
          />
        </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Paper
            elevation={2}
            sx={{ p: 3, mb: 3, backgroundColor: '#e6f2ff', borderLeft: '4px solid #003366', borderRadius: '4px' }}
            role="region"
            aria-label="Data Strategy Support Services callout"
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }} gutterBottom>
                  Data Strategy Support Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visit the Data Strategy module for the Operating Model, Capstone Project, and resources to advance agency data strategy.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  component={RouterLink}
                  to="/data-strategy-support"
                  variant="contained"
                  color="primary"
                  aria-label="Open Data Strategy Support Services"
                >
                  Open Data Strategy
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Accordion sx={{ mb: 3 }} defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="uscis-data-literacy-content"
              id="uscis-data-literacy-header"
              sx={{ 
                backgroundColor: 'primary.main', 
                color: '#ffffff',
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: '#ffffff',
                },
                '& .MuiSvgIcon-root': {
                  color: '#ffffff',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ffffff' }}>Understanding DHS USCIS Data Literacy: The 5 Ws</Typography>
              </Box>
            </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" gutterBottom>Understanding DHS USCIS Data Literacy: The 5 Ws</Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>1. What is Data Literacy at DHS USCIS?</Typography>
          <Typography paragraph>
            Data literacy at DHS USCIS refers to the organizational capability and individual skill to read, understand, create, and communicate data as information. Within USCIS, expanding data literacy means enabling staff to effectively incorporate data into everyday operations, make informed decisions, and cultivate a culture where business insights are regularly derived from data. The Data Literacy Lead is specifically charged with advancing these efforts through training, resources, and professional development initiatives.
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>2. Who is Involved?</Typography>
          <Typography component="div">
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Data Literacy Lead:</strong> A key personnel position responsible for leading the overall agency efforts to expand data literacy. This includes the development and presentation of professional training and sessions agency-wide.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>USCIS Staff:</strong> All personnel are impacted, as the goal is to create a data-fluent ecosystem.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Chief Data Officer (CDO) and OCDO:</strong> Set the vision and stewardship for data as a corporate asset, involving directorates and stakeholders across USCIS.</Typography>} 
                />
              </ListItem>
            </List>
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>3. Why is Data Literacy Important?</Typography>
          <Typography component="div">
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Support Informed Decisions:</strong> Data literacy ensures USCIS employees can make evidence-based policy and program choices.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Improve Mission Outcomes:</strong> By elevating data competencies, staff are better positioned to meet agency goals and streamline operations.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Foster a Data-Driven Culture:</strong> Advances a vibrant data culture as set forth in the Data Strategy goal to derive business insights from accessible data.</Typography>} 
                />
              </ListItem>
            </List>
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>4. When is Data Literacy Addressed?</Typography>
          <Typography paragraph>
            Data literacy is an ongoing effort, reflected in the FY23–27 Data Strategy and operationalized through structured training, ongoing development sessions, and regular updates to learning content. Deliverables related to data literacy (such as Data Culture Support Plans) are generally due 90 days after project kickoff and are updated as needed to keep the agency current.
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>5. Where Does Data Literacy Fit Within USCIS?</Typography>
          <Typography component="div">
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>USCIS Data Analytics Division – Data Literacy Branch:</strong> Directly responsible for fostering a data-literate culture.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Through Training, Dashboards, and Communities of Practice:</strong> Programs reach staff across directorates and roles, supporting foundation learning and advanced data competency.</Typography>} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Internal Stakeholder Outreach:</strong> The Communications Management Group supports messaging and awareness, enhancing the reach and engagement with data literacy initiatives.</Typography>} 
                />
              </ListItem>
            </List>
          </Typography>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold">Summary:</Typography>
            <Typography variant="body2" fontStyle="italic">
              Data literacy at DHS USCIS is a strategic, organization-wide focus designed to equip all employees with the skills to leverage data for improved decision-making. Led by the Data Literacy Lead and embedded in the agency data strategy, these efforts are sustained through training, community engagement, and continuous improvement to strengthen service delivery and program effectiveness.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
          
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Data Literacy in DHS USCIS
        </Typography>
        <Typography variant="body1" paragraph>
          Data literacy at USCIS refers to the organizational capability and individual skill to read, understand, create, and communicate data as information. It's a fundamental competency that enables staff to effectively incorporate data into everyday operations and make informed decisions.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom color="primary">
                USCIS Mission Alignment
              </Typography>
              <Typography variant="body2" paragraph>
                Data literacy directly supports USCIS's strategic goals by:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Enhancing evidence-based decision making across all levels of the agency" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Fostering a vibrant data culture where insights are derived from accessible data" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Improving operational efficiency through data-informed process improvements" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Supporting optimized policy design and evaluation" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Key Pillars of Data Literacy
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>1</Avatar>
                  <Typography variant="body1">Understanding and interpreting data visualizations</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>2</Avatar>
                  <Typography variant="body1">Evaluating data quality and sources</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>3</Avatar>
                  <Typography variant="body1">Making data-driven decisions</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>4</Avatar>
                  <Typography variant="body1">Upholding data ethics, privacy, and compliance</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>5</Avatar>
                  <Typography variant="body1">Communicating insights effectively</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* KPI Section */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Data Literacy Program KPIs
          </Typography>
          
          <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  borderTop: '4px solid',
                  borderColor: 'primary.main'
                }}
                role="region"
                aria-label="Training completion rate"
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Training Completion
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `conic-gradient(#003366 0% 68%, transparent 68% 100%)`
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      68%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Staff completed basic data literacy training
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  borderTop: '4px solid',
                  borderColor: '#1976d2'
                }}
                role="region"
                aria-label="Data-driven decision rate"
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Data-Driven Decisions
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `conic-gradient(#1976d2 0% 54%, transparent 54% 100%)`
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      54%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Projects using data to drive decisions
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  borderTop: '4px solid',
                  borderColor: '#B31B1B'
                }}
                role="region"
                aria-label="Data visualization proficiency"
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Visualization Skills
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `conic-gradient(#B31B1B 0% 42%, transparent 42% 100%)`
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      42%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Staff proficient in data visualization
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  borderTop: '4px solid',
                  borderColor: '#4caf50'
                }}
                role="region"
                aria-label="Data tool adoption rate"
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Tool Adoption
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `conic-gradient(#4caf50 0% 76%, transparent 76% 100%)`
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      76%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tool adoption across departments
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Yearly progress */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Yearly Progress Toward Data Literacy Goals
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ height: 30, display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>FY 2023</Typography>
                <Box sx={{ flexGrow: 1, height: 10, bgcolor: '#e0e0e0', borderRadius: 5 }}>
                  <Box 
                    sx={{ 
                      width: '92%', 
                      height: '100%', 
                      bgcolor: '#003366', 
                      borderRadius: 5 
                    }} 
                    role="progressbar"
                    aria-valuenow={92}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40, ml: 1 }}>92%</Typography>
              </Box>
              
              <Box sx={{ height: 30, display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>FY 2024</Typography>
                <Box sx={{ flexGrow: 1, height: 10, bgcolor: '#e0e0e0', borderRadius: 5 }}>
                  <Box 
                    sx={{ 
                      width: '68%', 
                      height: '100%', 
                      bgcolor: '#003366', 
                      borderRadius: 5 
                    }} 
                    role="progressbar"
                    aria-valuenow={68}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40, ml: 1 }}>68%</Typography>
              </Box>
              
              <Box sx={{ height: 30, display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>FY 2025</Typography>
                <Box sx={{ flexGrow: 1, height: 10, bgcolor: '#e0e0e0', borderRadius: 5 }}>
                  <Box 
                    sx={{ 
                      width: '35%', 
                      height: '100%', 
                      bgcolor: '#003366', 
                      borderRadius: 5 
                    }} 
                    role="progressbar"
                    aria-valuenow={35}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40, ml: 1 }}>35%</Typography>
              </Box>
              
              <Box sx={{ height: 30, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>FY 2026</Typography>
                <Box sx={{ flexGrow: 1, height: 10, bgcolor: '#e0e0e0', borderRadius: 5 }}>
                  <Box 
                    sx={{ 
                      width: '12%', 
                      height: '100%', 
                      bgcolor: '#003366', 
                      borderRadius: 5 
                    }} 
                    role="progressbar"
                    aria-valuenow={12}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40, ml: 1 }}>12%</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setActiveTab(2)}
            startIcon={<PlayIcon />}
            aria-label="Start learning modules"
          >
            Start Learning Modules
          </Button>
        </Box>
      </Box>
        </TabPanel>
        
        {/* Why It Matters Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Why Data Literacy Matters at USCIS
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={7}>
              <Typography variant="body1" paragraph>
                Data literacy is fundamental to USCIS's mission of providing accurate and timely immigration services. By building a data-literate workforce, we enhance our ability to:
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Impact Stories
                </Typography>
                
                <Card sx={{ mb: 3, backgroundColor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Case Processing Optimization
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      A data-literate team identified processing bottlenecks through dashboard analysis, resulting in a 15% reduction in case processing times and improved applicant experience.
                    </Typography>
                    <Chip label="Operational Improvement" size="small" color="primary" />
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 3, backgroundColor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Policy Impact Assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Data literacy enabled policy analysts to accurately measure the impact of policy changes on application volumes and processing times, supporting evidence-based adjustments.
                    </Typography>
                    <Chip label="Policy Enhancement" size="small" color="secondary" />
                  </CardContent>
                </Card>
                
                <Card sx={{ backgroundColor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Resource Allocation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Staff with strong data literacy skills utilized forecasting models to predict application surges, allowing for proactive resource allocation and preventing backlogs.
                    </Typography>
                    <Chip label="Resource Management" size="small" color="primary" />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f9ff', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                <Typography variant="h6" gutterBottom>
                  USCIS Data Culture Goals
                </Typography>
                
                <Typography variant="body2" paragraph>
                  The FY23–27 Data Strategy emphasizes building a "vibrant data culture" where:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Business insights are derived from timely, accessible data" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Data-driven decision making becomes standard practice at all levels" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Staff confidently use data tools to improve processes" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Data sharing and collaboration across directorates is seamless" />
                  </ListItem>
                </List>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <AlertTitle>Strategic Alignment</AlertTitle>
                  Data literacy is a cornerstone capability that directly supports USCIS's strategic goal of optimizing operations through data-driven insights.
                </Alert>
              </Paper>
              
              <Box sx={{ mt: 4, p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Benefits of Data Literacy
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="secondary">94%</Typography>
                      <Typography variant="body2">of organizations report improved decision-making with increased data literacy</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" color="secondary">75%</Typography>
                      <Typography variant="body2">reduction in report creation time with proper data skills</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Learning Modules Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>
            Data Literacy Learning Modules
          </Typography>
          <Typography variant="body1" paragraph>
            Enhance your data literacy skills with our comprehensive learning modules.
            Track your progress as you complete each lesson and earn your certification.
          </Typography>
          
          {/* Learning Insights - Personalized Dashboard */}
          <LearningInsights
            strengths={userProgress.strengths}
            areasForImprovement={userProgress.areasForImprovement}
            learningStreak={userProgress.learningStreak}
            completionPercentage={overallProgress}
            totalLessons={totalLessonsCount}
            completedLessons={userProgress.completedLessons}
          />
          
          {/* Adaptive Recommendations - Personalized Learning Path */}
          <AdaptiveRecommendations
            recommendedResources={userProgress.recommendedResources}
            strengths={userProgress.strengths}
            areasForImprovement={userProgress.areasForImprovement}
            roleBasedPath={userProgress.roleBasedPath}
          />
          
          {/* Overall Progress Indicator */}
          <Paper sx={{ p: 3, mb: 4, borderLeft: 5, borderColor: '#003366' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Overall Data Literacy Progress
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label="E-Learning"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<TimeIcon />}
                    label="Self-paced"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallProgress} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      mb: 1,
                      backgroundColor: 'rgba(0, 51, 102, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#003366'
                      }
                    }} 
                    aria-label={`Overall progress: ${overallProgress}%`}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {userProgress.completedLessons.length} of {totalLessonsCount} lessons completed ({overallProgress}%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!allModulesCompleted}
                  onClick={handleCertificateGenerate}
                  startIcon={<EmojiEventsIcon />}
                  aria-label="Generate data literacy certificate"
                  sx={{ 
                    backgroundColor: allModulesCompleted ? '#003366' : undefined,
                    '&:hover': {
                      backgroundColor: allModulesCompleted ? '#002244' : undefined
                    } 
                  }}
                >
                  Get Your Certificate
                </Button>
                {!allModulesCompleted && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Complete all modules to earn your certificate
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

      {/* Interactive Progress Dashboard with Section 508 Compliance */}
      <Box 
        sx={{ mb: 4 }}
        role="region"
        aria-labelledby="progress-dashboard-heading"
      >
        <Typography variant="h6" id="progress-dashboard-heading" sx={{ mb: 2 }}>
          Your Learning Progress
        </Typography>
        
        <Grid container spacing={3}>
          {/* Learning Streak */}
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                height: '100%',
                '&:hover': {
                  boxShadow: 1
                }
              }}
              role="region"
              aria-label="Learning streak statistics"
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Learning Streak</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalFireDepartmentIcon color="error" sx={{ mr: 1, fontSize: 32 }} aria-hidden="true" />
                <Typography variant="h4">7 Days</Typography>
              </Box>
              
              {/* Streak Calendar */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                {['M','T','W','T','F','S','S'].map((day, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">{day}</Typography>
                    <Box 
                      sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        bgcolor: index <= 6 ? '#B31B1B' : 'rgba(0,0,0,0.1)',
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-hidden="true"
                    >
                      {index <= 6 && <CheckIcon sx={{ fontSize: 14, color: 'white' }} />}
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}
              >
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Keep up the momentum!
              </Typography>
            </Paper>
          </Grid>
          
          {/* Weekly Time Spent */}
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                height: '100%',
                '&:hover': {
                  boxShadow: 1
                }
              }}
              role="region"
              aria-label="Weekly learning time statistics"
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Weekly Learning Time</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1, fontSize: 32 }} aria-hidden="true" />
                <Typography variant="h4">2.5 Hours</Typography>
              </Box>
              
              {/* Time Breakdown */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Videos</Typography>
                  <Typography variant="caption" color="text.secondary">45 min</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={30} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    mb: 1,
                    backgroundColor: 'rgba(0, 51, 102, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#003366'
                    }
                  }} 
                  aria-hidden="true"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Reading</Typography>
                  <Typography variant="caption" color="text.secondary">1.25 hr</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={50} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    mb: 1,
                    backgroundColor: 'rgba(0, 51, 102, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#003366'
                    }
                  }} 
                  aria-hidden="true"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Quizzes</Typography>
                  <Typography variant="caption" color="text.secondary">30 min</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={20} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 51, 102, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#003366'
                    }
                  }} 
                  aria-hidden="true"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <InsightsIcon sx={{ fontSize: 16, mr: 0.5 }} />
                30% increase from last week
              </Typography>
            </Paper>
          </Grid>
          
          {/* Achievement Progress */}
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                height: '100%',
                '&:hover': {
                  boxShadow: 1
                }
              }}
              role="region"
              aria-label="Module completion statistics"
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Achievements</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEventsIcon color="warning" sx={{ mr: 1, fontSize: 32 }} aria-hidden="true" />
                <Typography variant="h4">{modules.filter(m => m.completionPercentage === 100).length} of {modules.length}</Typography>
              </Box>
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: '#003366' }} />
                    <Typography variant="caption">Modules Completed</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight="bold">
                    {modules.filter(m => m.completionPercentage === 100).length}/{modules.length}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 16, mr: 0.5, color: '#003366' }} />
                    <Typography variant="caption">Lessons Completed</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight="bold">
                    {completedLessonsCount}/{totalLessonsCount}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuizIcon sx={{ fontSize: 16, mr: 0.5, color: '#003366' }} />
                    <Typography variant="caption">Quizzes Passed</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight="bold">
                    {userProgress.quizScores.filter(q => q.score >= 70).length}/{modules.length} {/* Using modules length as total quizzes count */}
                  </Typography>
                </Box>
              </Box>
              
              <CircularProgress 
                variant="determinate" 
                value={overallProgress} 
                size={36} 
                thickness={4}
                sx={{ 
                  color: overallProgress > 75 ? '#4CAF50' : overallProgress > 50 ? '#FF9800' : '#003366',
                  mr: 1 
                }}
                aria-hidden="true"
              />
              <Typography 
                variant="body2" 
                component="span" 
                color="text.secondary"
              >
                {Math.round(overallProgress)}% of curriculum complete
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Enhanced Role-Based Pathway Selection with Section 508 Compliance */}
      <Box 
        sx={{ mb: 4 }}
        role="region"
        aria-labelledby="learning-path-heading"
      >
        <Typography variant="h6" gutterBottom id="learning-path-heading">Choose Your Learning Path</Typography>
        <Typography variant="body2" paragraph>Select the path that best matches your role for a customized learning experience.</Typography>
        
        <Grid container spacing={2}>
          {['Analyst', 'Business User', 'Manager', 'Data Steward'].map((role) => (
            <Grid item xs={12} sm={6} md={3} key={role}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: userProgress.roleBasedPath === role ? '2px solid #003366' : '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-4px)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: '#003366',
                    outlineOffset: 2
                  },
                }}
                onClick={() => handleRolePathChange(role)}
                tabIndex={0}
                role="button"
                aria-pressed={userProgress.roleBasedPath === role}
                aria-label={`Select ${role} learning path`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRolePathChange(role);
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getRoleDescription(role)}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {userProgress.roleBasedPath === role && (
                      <Chip 
                        size="small" 
                        color="primary" 
                        label="Selected" 
                        icon={<CheckIcon />} 
                        aria-hidden="true" // Redundant with aria-pressed on parent
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Personalized Learning Recommendations */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mt: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            borderLeft: '4px solid #003366'
          }}
          role="region"
          aria-labelledby="personalized-recommendations-heading"
        >
          <Typography variant="h6" gutterBottom id="personalized-recommendations-heading">
            <RecommendIcon sx={{ mr: 1, verticalAlign: 'top' }} />
            Recommended Next Steps for {userProgress.roleBasedPath || 'You'}
          </Typography>
          
          <Typography variant="body2" paragraph>
            Based on your role and progress, we recommend the following resources to enhance your data literacy journey:
          </Typography>
          
          <Grid container spacing={2}>
            {/* Recommended Next Lesson */}
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  '&:hover': {
                    borderColor: '#003366'
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: '#003366',
                    outlineOffset: 2
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Start recommended next lesson"
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <PlayArrowIcon sx={{ mr: 1, verticalAlign: 'top', color: '#003366' }} />
                    Next Lesson
                  </Typography>
                  
                  {/* Dynamically find next unfinished lesson */}
                  {modules.flatMap(m => m.lessons).find(l => 
                    !userProgress.completedLessons.includes(l.id)
                  ) ? (
                    <>
                      <Typography variant="body2">
                        {modules.flatMap(m => m.lessons).find(l => 
                          !userProgress.completedLessons.includes(l.id)
                        )?.title || 'Next available lesson'}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={0} 
                        sx={{ 
                          mt: 2,
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: 'rgba(0, 51, 102, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#003366'
                          }
                        }} 
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Congratulations! You've completed all lessons.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Role-Specific Resources */}
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  '&:hover': {
                    borderColor: '#003366'
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: '#003366',
                    outlineOffset: 2
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="View role-specific resources"
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <AutoStoriesIcon sx={{ mr: 1, verticalAlign: 'top', color: '#003366' }} />
                    {userProgress.roleBasedPath || 'Role'} Resources
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" paragraph>
                      Specialized materials for {userProgress.roleBasedPath || 'your role'}:
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <MenuBookIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Role-specific best practices" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ArticleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Case studies and examples" />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Learning Community */}
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  '&:hover': {
                    borderColor: '#003366'
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: '#003366',
                    outlineOffset: 2
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Connect with learning community"
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <PeopleIcon sx={{ mr: 1, verticalAlign: 'top', color: '#003366' }} />
                    Learning Community
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Connect with peers in similar roles to share knowledge and best practices.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28 } }}>
                      <Avatar alt="User 1" src="/static/mock-images/avatars/avatar_1.jpg" />
                      <Avatar alt="User 2" src="/static/mock-images/avatars/avatar_2.jpg" />
                      <Avatar alt="User 3" src="/static/mock-images/avatars/avatar_3.jpg" />
                      <Avatar alt="User 4" src="/static/mock-images/avatars/avatar_4.jpg" />
                      <Avatar alt="User 5" src="/static/mock-images/avatars/avatar_5.jpg" />
                    </AvatarGroup>
                    <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
                      +24 active learners
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Visual Learning Pathway Map - Section 508 Compliant */}
      <Box 
        sx={{ mb: 4, overflow: 'auto' }}
        role="region" 
        aria-label="Learning pathway visualization"
      >
        <Typography variant="h6" gutterBottom id="learning-pathway-heading">Your Learning Pathway</Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: '1px solid', 
            borderColor: 'divider', 
            minWidth: 650,
            position: 'relative'
          }}
          aria-describedby="learning-pathway-heading"
        >
          {/* Hidden text for screen readers explaining the visual */}
          <Box className="visually-hidden" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            <p>This is a visual representation of your learning modules in sequence. Modules are shown from left to right with completion status.</p>
          </Box>
          
          {/* Connecting Lines */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: 90, 
              right: 90, 
              height: 3, 
              backgroundColor: '#e0e0e0', 
              zIndex: 0 
            }}
            aria-hidden="true" // Hide from screen readers as it's decorative
          />
          
          <Grid 
            container 
            spacing={1} 
            justifyContent="space-between" 
            sx={{ position: 'relative', zIndex: 1 }}
            role="list"
            aria-label="Learning modules sequence"
          >
            {modules.map((module, index) => {
              const isCompleted = module.completionPercentage === 100;
              const isActive = module.completionPercentage > 0 && module.completionPercentage < 100;
              const moduleStatus = isCompleted ? 'completed' : isActive ? 'in progress' : 'not started';
              
              return (
                <Grid 
                  item 
                  key={module.id} 
                  xs={12 / modules.length}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      position: 'relative',
                    }}
                    role="listitem"
                    tabIndex={0} // Make focusable for keyboard users
                    aria-label={`Module ${index + 1}: ${module.title}, ${moduleStatus}, ${Math.round(module.completionPercentage)}% complete`}
                  >
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: isCompleted ? '#4CAF50' : isActive ? '#FF9800' : '#e0e0e0',
                        mb: 1,
                        border: '3px solid',
                        borderColor: '#ffffff'
                      }}
                      aria-hidden="true" // Avatar is decorative, main info is in text
                    >
                      {isCompleted ? <CheckCircleOutlineIcon /> : (index + 1)}
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      align="center" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: isCompleted || isActive ? 'text.primary' : 'text.secondary'
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 0.5,
                        mt: 0.5
                      }}
                    >
                      <CircularProgress 
                        variant="determinate" 
                        value={module.completionPercentage} 
                        size={16} 
                        thickness={8}
                        sx={{ color: isCompleted ? '#4CAF50' : isActive ? '#FF9800' : '#e0e0e0' }}
                        aria-hidden="true" // Visual indicator, percentage is in text
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(module.completionPercentage)}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>

      {/* Module List with Lessons */}
      {modules.map((module, index) => (
        <Paper 
          key={module.id} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderTop: 3, 
            borderColor: module.level === 'beginner' ? '#4CAF50' : 
                        module.level === 'intermediate' ? '#FF9800' : '#F44336'
          }}
          id={`module-${module.id}`}
          role="region"
          aria-labelledby={`module-heading-${module.id}`}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h6" 
                gutterBottom 
                id={`module-heading-${module.id}`}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Chip 
                  label={module.level.charAt(0).toUpperCase() + module.level.slice(1)} 
                  size="small" 
                  color={module.level === 'beginner' ? 'success' : 
                          module.level === 'intermediate' ? 'warning' : 'error'} 
                  sx={{ mr: 1 }}
                />
                {module.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {module.description}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Progress: {Math.round(module.completionPercentage)}%
                </Typography>
                <CircularProgress 
                  variant="determinate"
                  value={module.completionPercentage} 
                  size={40} 
                  thickness={4} 
                  sx={{ color: module.level === 'beginner' ? '#4CAF50' : 
                                module.level === 'intermediate' ? '#FF9800' : '#F44336' }}
                  aria-label={`Module progress: ${Math.round(module.completionPercentage)}%`}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          
          <List sx={{ mt: 2 }} aria-label={`Lessons for ${module.title}`}>
            {module.lessons.map((lesson) => {
              const isCompleted = userProgress.completedLessons.includes(lesson.id);
              const isAccessible = isLessonAccessible(lesson);
              const isLocked = lesson.locked && !isAccessible;
              
              return (
                <ListItem
                  component="div"
                  key={lesson.id}
                  sx={{
                    border: '1px solid',
                    borderColor: isCompleted ? 'success.light' : isLocked ? 'action.disabledBackground' : 'divider',
                    borderRadius: 1,
                    mb: 2,
                    p: 0, 
                    backgroundColor: isLocked ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    position: 'relative',
                    '&:last-child': { mb: 0 },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': isLocked ? {} : {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderColor: 'primary.main',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #003366',
                      outlineOffset: 2
                    }
                  }}
                  role="button"
                  aria-disabled={isLocked}
                  aria-label={`${isLocked ? 'Locked lesson: ' : ''}${lesson.title}${isCompleted ? ' (completed)' : ''}`}
                  onClick={isLocked ? undefined : () => handleLessonClick(lesson.id)}
                  tabIndex={isLocked ? -1 : 0}
                >
                  <ListItemIcon>
                    {isCompleted ? (
                      <CheckCircleIcon color="success" aria-label="Completed lesson" />
                    ) : isLocked ? (
                      <Tooltip title="Locked - Complete prerequisites first">
                        <VerifiedUserIcon color="disabled" aria-label="Locked lesson" />
                      </Tooltip>
                    ) : (
                      <PlayIcon color="primary" aria-label="Available lesson" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: isLocked ? 'text.disabled' : 'text.primary'
                        }}
                      >
                        {lesson.title}
                        {lesson.quizId && (
                          <Tooltip title="Includes assessment quiz">
                            <QuizIcon 
                              fontSize="small" 
                              sx={{ ml: 1, verticalAlign: 'middle', color: isLocked ? 'text.disabled' : '#B31B1B' }} 
                              aria-label="Quiz required"
                            />
                          </Tooltip>
                        )}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: isLocked ? 'text.disabled' : 'text.secondary' }} />
                          <Typography variant="body2" color={isLocked ? 'text.disabled' : 'text.secondary'}>
                            {lesson.duration}
                          </Typography>
                        </Box>
                        {lesson.content && (
                          <Typography variant="body2" color={isLocked ? 'text.disabled' : 'text.secondary'} sx={{ mt: 0.5 }}>
                            {lesson.content.length > 80 ? lesson.content.substring(0, 80) + '...' : lesson.content}
                          </Typography>
                        )}
                        {isLocked && lesson.prerequisites && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                            Prerequisites: Lessons {lesson.prerequisites.join(', ')}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Lesson status */}
                    {isCompleted && (
                      <Chip 
                        icon={<CheckIcon />} 
                        label="Completed" 
                        color="success" 
                        size="small"
                        aria-hidden="true" // Main card is already labeled
                      />
                    )}
                    
                    {/* Visual indication of lesson status */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 2
                      }}
                    >
                      <Button
                        variant={isCompleted ? "outlined" : "contained"}
                        color={isCompleted ? "success" : "primary"}
                        onClick={(e) => {
                          // Prevent click propagation to avoid duplicate clicks
                          e.stopPropagation(); 
                          if (!isLocked) handleLessonClick(lesson.id);
                        }}
                        disabled={isLocked}
                        sx={{ 
                          minWidth: 100,
                          backgroundColor: isCompleted ? 'transparent' : '#003366',
                          '&:hover': isLocked ? {} : {
                            backgroundColor: isCompleted ? 'success.light' : '#002244',
                            color: 'white'
                          },
                          '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: '#003366',
                            outlineOffset: 2
                          }
                        }}
                        aria-hidden="true" // Main card is already accessible
                        tabIndex={-1} // Avoid keyboard tab trap within an interactive parent
                      >
                        {isLocked ? "Locked" : isCompleted ? "Review" : "Start"}
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      ))}
      
      {/* Dialog for Quiz - Enhanced with Section 508 Compliance */}
      <Dialog 
        open={showQuiz} 
        onClose={handleBack} 
        maxWidth="md"
        fullWidth
        aria-labelledby="quiz-dialog-title"
        aria-describedby="quiz-description"
        role="dialog"
      >
        <DialogTitle id="quiz-dialog-title">
          {currentQuiz?.title}
        </DialogTitle>
        <DialogContent dividers>
          {!quizSubmitted ? (
            <Box>
              <Typography variant="body1" paragraph id="quiz-description">
                {currentQuiz?.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Answer all questions below. Required passing score: {currentQuiz?.passingScore || 70}%
              </Typography>
              
              {currentQuiz?.questions.map((question, qIndex) => (
                <Paper key={question.id} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    <strong>{qIndex + 1}. {question.question}</strong>
                  </Typography>
                  
                  <RadioGroup 
                    value={quizAnswers[qIndex] !== undefined ? quizAnswers[qIndex] : -1}
                    onChange={(e) => handleQuizAnswerSelect(qIndex, parseInt(e.target.value))}
                    name={`question-${question.id}`}
                    aria-label={`Question ${qIndex + 1}`}
                  >
                    {question.options.map((option, oIndex) => (
                      <FormControlLabel 
                        key={oIndex} 
                        value={oIndex} 
                        control={<Radio />} 
                        label={option} 
                        sx={{ my: 0.5 }}
                      />
                    ))}
                  </RadioGroup>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                Quiz Results
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <CircularProgress 
                  variant="determinate"
                  value={quizScore}
                  size={100}
                  thickness={5}
                  sx={{ color: quizScore >= (currentQuiz?.passingScore || 70) ? '#4CAF50' : '#f44336' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  style={{ position: 'relative' }}
                >
                  <Typography variant="h4" component="div" color="text.secondary">
                    {quizScore}%
                  </Typography>
                </Box>
              </Box>
              
              <Alert severity={quizScore >= (currentQuiz?.passingScore || 70) ? "success" : "warning"} sx={{ mb: 3 }}>
                <AlertTitle>
                  {quizScore >= (currentQuiz?.passingScore || 70) ? "Congratulations!" : "Almost There"}
                </AlertTitle>
                {quizScore >= (currentQuiz?.passingScore || 70) 
                  ? "You've passed the quiz and completed this lesson."
                  : `You need ${currentQuiz?.passingScore || 70}% to pass this quiz. Try reviewing the material and taking the quiz again.`}
              </Alert>
              
              {currentQuiz?.questions.map((question, qIndex) => {
                const isCorrect = quizAnswers[qIndex] === question.correctAnswer;
                return (
                  <Paper 
                    key={question.id} 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      borderLeft: 5, 
                      borderColor: isCorrect ? '#4CAF50' : '#f44336' 
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <strong>{qIndex + 1}. {question.question}</strong>
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Your answer: <strong>{question.options[quizAnswers[qIndex]]}</strong>
                      {isCorrect ? (
                        <CheckCircleIcon color="success" sx={{ ml: 1, verticalAlign: 'middle' }} />
                      ) : (
                        <>
                          <Typography variant="body2" sx={{ mt: 1, color: '#4CAF50' }}>
                            Correct answer: <strong>{question.options[question.correctAnswer]}</strong>
                          </Typography>
                        </>
                      )}
                    </Typography>
                    
                    <Box sx={{ mt: 2, backgroundColor: 'rgba(0,0,0,0.03)', p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Explanation:</strong> {question.explanation}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack} color="inherit">
            Back to Modules
          </Button>
          {!quizSubmitted && (
            <Button 
              onClick={handleQuizSubmit} 
              variant="contained"
              color="primary"
              disabled={currentQuiz?.questions.some((_, i) => quizAnswers[i] === undefined)}
              sx={{ 
                backgroundColor: '#003366',
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: '#003366',
                  outlineOffset: 2
                } 
              }}
              aria-label="Submit quiz answers"
            >
              Submit Answers
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Certificate Dialog - Section 508 Compliant */}
      <Dialog
        open={showCertificate}
        onClose={() => setShowCertificate(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="certificate-dialog-title"
        aria-describedby="certificate-dialog-description"
        PaperProps={{
          sx: {
            '&:focus-visible': {
              outline: '2px solid #003366',
              outlineOffset: 2
            }
          }
        }}
      >
        <DialogTitle id="certificate-dialog-title">
          Data Literacy Program Certificate
          <IconButton
            aria-label="Close certificate dialog"
            onClick={() => setShowCertificate(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              '&:focus-visible': {
                outline: '2px solid #003366',
                outlineOffset: 2
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography id="certificate-dialog-description" sx={{ mb: 2 }} className="sr-only" aria-live="polite">
            Your certificate of completion for the Data Literacy Program. You can view and download it as a PDF.
          </Typography>
          
          <Box 
            id="certificate-content"
            sx={{ 
              p: 4, 
              border: '2px solid #003366', 
              borderRadius: 2, 
              backgroundColor: '#f9f9f9',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              mb: 2
            }}
            tabIndex={0} // Makes certificate content keyboard focusable
            aria-label="Certificate content"
          >
            {/* Top border */}
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '10px', 
              backgroundColor: '#003366' 
            }} aria-hidden="true" />
            
            {/* Bottom border */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: '10px', 
              backgroundColor: '#003366' 
            }} aria-hidden="true" />
            
            {/* Watermark */}
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              left: 0,
              bottom: 0,
              opacity: 0.03,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }} aria-hidden="true">
              <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/2/24/USCIS_logo_2017.svg"
                sx={{ width: '80%', maxHeight: '80%', opacity: 0.5 }}
                alt=""
              />
            </Box>
            
            <Typography variant="h6" color="#003366" sx={{ fontWeight: 'bold' }}>
              UNITED STATES CITIZENSHIP AND IMMIGRATION SERVICES
            </Typography>
            
            <Typography variant="h4" sx={{ mt: 3, mb: 1, color: '#B31B1B', fontWeight: 'bold' }}>
              CERTIFICATE OF COMPLETION
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
              This certifies that
            </Typography>
            
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, fontStyle: 'italic' }}>
              {currentCertificate?.userName || userProgress.userId}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              has successfully completed the Data Literacy Program
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
              with an overall score of <strong>{Math.round(overallProgress)}%</strong>
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                mt: 5, 
                mb: 2,
                gap: 2
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#003366' }} aria-hidden="true" />
                  <strong>Date Issued:</strong> {certificateDate}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUserIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#003366' }} aria-hidden="true" />
                  <strong>Certificate ID:</strong> DL-{Date.now().toString().substring(6)}
                </Typography>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                mt: 5, 
                pt: 2, 
                borderTop: '1px dashed #003366'
              }} 
              aria-hidden="true"
            >
              <Typography variant="caption" color="text.secondary">
                Scan to verify certificate authenticity
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 1 
                }}
              >
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#003366', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <QrCodeIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} aria-hidden="true" />
              This certificate serves as proof of completion of the USCIS Data Literacy Program.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setShowCertificate(false)} 
            color="primary"
            variant="outlined"
            aria-label="Close certificate dialog"
            sx={{
              '&:focus-visible': {
                outline: '2px solid #003366',
                outlineOffset: 2
              }
            }}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ 
                backgroundColor: '#003366',
                mr: 1,
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2
                }
              }}
              aria-label="Download certificate as PDF"
              startIcon={<PdfIcon />}
              onClick={() => handleCertificateDownload('pdf')}
            >
              Download PDF
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              aria-label="Print certificate"
              startIcon={<PrintIcon />}
              onClick={() => handleCertificateDownload('print')}
              sx={{
                '&:focus-visible': {
                  outline: '2px solid #003366',
                  outlineOffset: 2
                }
              }}
            >
              Print
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      
      {/* Feedback Snackbar */}
      <Snackbar 
        open={showFeedback} 
        autoHideDuration={6000} 
        onClose={() => setShowFeedback(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowFeedback(false)} 
          severity={feedbackSeverity}
          sx={{ width: '100%' }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
      </TabPanel>
      
      {/* Roles and Responsibilities Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom>
            Roles and Responsibilities in Data Literacy
          </Typography>
          <Typography variant="body1" paragraph>
            Effective data literacy implementation requires clearly defined roles and responsibilities across the organization.
            Below are the key roles that contribute to the data literacy initiative at DHS USCIS.
          </Typography>

          {/* Key Data Literacy Roles Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Key Data Literacy Roles
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: 'primary.main', mr: 2 }}>
                        <PeopleIcon />
                      </Avatar>
                      <Typography variant="h6">Data Literacy Lead</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      The Data Literacy Lead is responsible for developing and implementing the agency's data literacy program. This includes:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Developing and delivering data literacy training curriculum" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Coordinating with directorates to assess data literacy needs" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Creating and maintaining data literacy resources" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Measuring progress and reporting on data literacy initiatives" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: 'secondary.main', mr: 2 }}>
                        <BusinessIcon />
                      </Avatar>
                      <Typography variant="h6">Chief Data Officer (CDO)</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      The CDO sets the vision and stewardship for data as a corporate asset and oversees the data literacy program:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Establishing the data strategy that includes literacy as a key pillar" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Advocating for data literacy initiatives with executive leadership" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Allocating resources to data literacy programs" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Ensuring alignment with federal data strategy requirements" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                      Data Stewards
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Subject matter experts responsible for maintaining data quality and promoting proper data use within their business domains.
                    </Typography>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Ensure data quality standards" secondary="Within specific business domains" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Act as domain experts" secondary="For data interpretation questions" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                      Executive Sponsors
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Senior leaders who champion data literacy initiatives and ensure organizational buy-in.
                    </Typography>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Provide strategic direction" secondary="For data literacy programs" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Secure necessary resources" secondary="For implementation and training" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                      Front-Line Staff
                    </Typography>
                    <Typography variant="body2" paragraph>
                      All USCIS employees who use data in their daily work and benefit from data literacy initiatives.
                    </Typography>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Apply data literacy skills" secondary="In daily operational decisions" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Participate in training" secondary="To enhance data competencies" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Organizational Structure Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Organizational Structure
            </Typography>
            
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom>
                How Data Literacy Roles Fit Within USCIS
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                mt: 2, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 1,
                position: 'relative'
              }}>
                <Typography variant="subtitle2" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                  USCIS Data Governance Structure
                </Typography>
                
                <Box sx={{ 
                  width: '80%', 
                  mx: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 2 
                }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      width: '100%', 
                      textAlign: 'center', 
                      backgroundColor: '#003366',
                      color: 'white'
                    }}
                  >
                    <Typography variant="subtitle1">
                      Executive Leadership
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 2 }}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        width: '48%', 
                        textAlign: 'center',
                        backgroundColor: '#0050a0',
                        color: 'white'
                      }}
                    >
                      <Typography variant="subtitle2">
                        Chief Data Officer (CDO)
                      </Typography>
                    </Paper>
                    
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        width: '48%', 
                        textAlign: 'center',
                        backgroundColor: '#0050a0',
                        color: 'white'
                      }}
                    >
                      <Typography variant="subtitle2">
                        Directorate Leadership
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        width: '48%', 
                        textAlign: 'center',
                        backgroundColor: '#0050a0',
                        color: 'white'
                      }}
                    >
                      <Typography variant="body2">
                        Program Managers
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 1.5, 
                      width: '100%', 
                      textAlign: 'center',
                      backgroundColor: '#4b9fea',
                      color: 'white'
                    }}
                  >
                    <Typography variant="body2">
                      Front-Line Staff & Data Users
                    </Typography>
                  </Paper>
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  Data literacy initiatives are coordinated by the Data Literacy Lead but integrated across all organizational levels.
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          {/* Role-Specific Responsibilities Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Role-Based Learning Paths
            </Typography>
            
            <Typography variant="body2" paragraph>
              Each role requires specific data literacy skills and competencies. Below are recommended learning paths based on role:
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography sx={{ fontWeight: 500 }}>Executive Leaders</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Recommended Training:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Strategy for Leaders" secondary="Understanding how data drives organizational success" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Making Data-Driven Decisions" secondary="Using data insights to inform strategic choices" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Ethics and Governance" secondary="Ensuring responsible data use at the organizational level" />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">
                    <strong>Key Metrics:</strong> Leaders should focus on understanding high-level data trends, organizational performance indicators, and cross-directorate data relationships.
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                <Typography sx={{ fontWeight: 500 }}>Program Managers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Recommended Training:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Program Evaluation with Data" secondary="Using metrics to assess program effectiveness" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Visualization for Managers" secondary="Creating impactful visual representations of program data" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Collection Planning" secondary="Designing effective data collection methods" />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">
                    <strong>Key Metrics:</strong> Program managers should focus on operational metrics, performance indicators, and outcome measures specific to their programs.
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
                <Typography sx={{ fontWeight: 500 }}>Data Analysts</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Recommended Training:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Advanced Data Analysis Techniques" secondary="Statistical methods and analytical approaches" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Modeling and Predictive Analytics" secondary="Creating models to predict trends and outcomes" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Storytelling" secondary="Communicating insights effectively to non-technical audiences" />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">
                    <strong>Key Metrics:</strong> Analysts should master detailed data analysis, interpretation, and transformation techniques to extract meaningful insights.
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
                <Typography sx={{ fontWeight: 500 }}>Front-Line Staff</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Recommended Training:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Basics" secondary="Understanding common data concepts and terminology" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Reading Reports and Dashboards" secondary="Interpreting visualizations and reports correctly" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Data Quality Fundamentals" secondary="Recognizing and addressing data quality issues" />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">
                    <strong>Key Metrics:</strong> Front-line staff should focus on understanding operational data relevant to their daily work and how to use it for better decision making.
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          {/* Role Transformation Stories */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Role Transformation Stories
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Adjudications Officer Success Story
                    </Typography>
                    <Typography variant="body2" paragraph>
                      After completing the data literacy training program, an adjudications officer was able to use dashboard data to identify patterns in case processing times, leading to workflow improvements that reduced processing time by 12%.
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      bgcolor: 'background.paper', 
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="body2">
                        <strong>Key Outcome:</strong> Improved ability to interpret case processing metrics resulted in more efficient adjudications.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Policy Analyst Transformation
                    </Typography>
                    <Typography variant="body2" paragraph>
                      A policy analyst developed enhanced data literacy skills that allowed them to effectively analyze policy implementation data across multiple USCIS directorates, providing evidence-based recommendations that improved policy outcomes.
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      bgcolor: 'background.paper', 
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="body2">
                        <strong>Key Outcome:</strong> Data-informed policy adjustments that better served both the agency and applicants.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Alert severity="info" sx={{ mt: 4 }}>
            <AlertTitle>Get Involved</AlertTitle>
            <Typography variant="body2">
              Interested in becoming a data literacy champion within your directorate? Contact the Data Literacy Lead to learn about upcoming opportunities and training resources specific to your role.
            </Typography>
          </Alert>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" gutterBottom>
            Data Literacy Resources
          </Typography>
          <Typography variant="body1" paragraph>
            Explore our curated collection of resources to help you develop and enhance your data literacy skills.
            These materials range from beginner to advanced levels and cover various aspects of working with data.
          </Typography>

          {/* Learning Materials Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Learning Materials
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: 'primary.main', mr: 2 }}>
                        <MenuBookIcon />
                      </Avatar>
                      <Typography variant="h6">Online Courses</Typography>
                    </Box>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Data Literacy Fundamentals"
                          secondary="A beginner's guide to understanding and working with data"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Data Visualization Essentials"
                          secondary="Learn to create effective charts and graphs"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Critical Data Analysis"
                          secondary="Techniques for evaluating and interpreting complex data sets"
                        />
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        aria-label="Access online courses"
                        startIcon={<SchoolIcon />}
                      >
                        Access Courses
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: 'secondary.main', mr: 2 }}>
                        <BookIcon />
                      </Avatar>
                      <Typography variant="h6">Guides & Handbooks</Typography>
                    </Box>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <BookIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="USCIS Data Literacy Handbook"
                          secondary="Official agency guide to data literacy concepts"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <BookIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Data Ethics Guide"
                          secondary="Best practices for ethical use of data"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <BookIcon color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Statistical Concepts Simplified"
                          secondary="Plain language explanations of key statistical terms"
                        />
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        size="small"
                        aria-label="Download guides and handbooks"
                        startIcon={<BookIcon />}
                      >
                        Download Guides
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: '#B31B1B', mr: 2 }}>
                        <PlayIcon />
                      </Avatar>
                      <Typography variant="h6">Video Resources</Typography>
                    </Box>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PlayIcon sx={{ color: '#B31B1B' }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Data Literacy Quick Tips"
                          secondary="Short videos on essential data literacy concepts"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PlayIcon sx={{ color: '#B31B1B' }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Understanding Data Visualization"
                          secondary="Tutorial series on reading different chart types"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PlayIcon sx={{ color: '#B31B1B' }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Ask the Expert Series"
                          secondary="Q&A sessions with USCIS data experts"
                        />
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        sx={{ color: '#B31B1B', borderColor: '#B31B1B' }}
                        size="small"
                        aria-label="View video resources"
                        startIcon={<PlayIcon />}
                      >
                        Watch Videos
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Data Tools Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Data Tools & Platforms
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Agency-approved tools to help you work with and analyze data effectively:
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      Data Visualization Tools
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Power BI" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Tableau" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Excel Charts" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      Data Analysis Software
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Microsoft Excel" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="R Statistical Package" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Python with Pandas" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      Database Access Tools
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="SQL Server Management Studio" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Oracle SQL Developer" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Microsoft Access" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <AlertTitle>Tool Access</AlertTitle>
                <Typography variant="body2">
                  Contact your IT support team for installation of these tools. Training is available for all listed software through the USCIS Learning Management System.
                </Typography>
              </Alert>
            </Paper>
          </Box>
          
          {/* External Resources Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              External Resources
            </Typography>
            
            <Typography variant="body2" paragraph>
              These vetted external resources provide additional learning opportunities and reference materials:
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data.gov"
                      secondary="The federal government's open data site, with datasets and tools"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Federal Data Strategy"
                      secondary="Official guidance and resources for the Federal Data Strategy"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Harvard Data Science Review"
                      secondary="Academic journal covering data science concepts and applications"
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data Literacy Project"
                      secondary="Global initiative to promote data literacy across industries"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="MIT OpenCourseware - Data Analysis"
                      secondary="Free course materials for data analysis techniques"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Coursera - Data Science Specialization"
                      secondary="Online learning path for data science skills"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>External Resource Notice</AlertTitle>
              <Typography variant="body2">
                External resources are provided for informational purposes only. Always follow USCIS policies regarding external sites and information security.
              </Typography>
            </Alert>
          </Box>
          
          {/* Request Resources Section */}
          <Box sx={{ p: 3, backgroundColor: '#f5f9ff', border: '1px solid', borderColor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Request Additional Resources
            </Typography>
            
            <Typography variant="body2" paragraph>
              Can't find what you need? The Data Literacy team can help connect you with appropriate resources.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<ContactSupportIcon />}
                aria-label="Request custom resources"
              >
                Request Resources
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<BookIcon />}
                aria-label="Suggest a resource for the library"
              >
                Suggest a Resource
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Assessment Tab */}
        <TabPanel value={activeTab} index={5}>
          <Typography variant="h5" gutterBottom>
            Data Literacy Assessment
          </Typography>
          <Typography variant="body1" paragraph>
            Evaluate your data literacy skills through our assessment tools. These assessments will help you identify your strengths and areas for growth.
          </Typography>

          {/* Self-Assessment Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <AssessmentIcon />
              </Avatar>
              <Typography variant="h6">Self-Assessment</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Rate your confidence level in the following data literacy competencies. This will help identify your strengths and areas for improvement.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {[
                {
                  id: 'data-understanding',
                  title: 'Data Understanding',
                  description: 'Ability to read, interpret and draw conclusions from data'
                },
                {
                  id: 'data-analysis',
                  title: 'Data Analysis',
                  description: 'Skills in analyzing data to identify patterns and insights'
                },
                {
                  id: 'data-visualization',
                  title: 'Data Visualization',
                  description: 'Creating effective charts and graphs to communicate data'
                },
                {
                  id: 'data-governance',
                  title: 'Data Governance',
                  description: 'Understanding data policies, quality, and management practices'
                },
                {
                  id: 'data-ethics',
                  title: 'Data Ethics',
                  description: 'Awareness of ethical considerations in data collection and use'
                }
              ].map((competency) => (
                <Box key={competency.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" id={`${competency.id}-label`} gutterBottom>
                    {competency.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {competency.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography id={`${competency.id}-beginner`} variant="caption" sx={{ width: '80px', textAlign: 'center' }}>
                      Beginner
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <RadioGroup
                          row
                          aria-labelledby={`${competency.id}-label`}
                          name={`${competency.id}-rating`}
                          sx={{
                            justifyContent: 'space-between',
                            width: '100%',
                            '& .MuiFormControlLabel-root': { margin: 0 }
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((value) => (
                            <FormControlLabel
                              key={value}
                              value={value}
                              control={<Radio />}
                              label={`${value}`}
                              aria-describedby={value === 1 ? `${competency.id}-beginner` : value === 5 ? `${competency.id}-expert` : undefined}
                              sx={{
                                '& .MuiFormControlLabel-label': { 
                                  fontSize: '0.875rem',
                                  color: 'text.secondary'
                                }
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Typography id={`${competency.id}-expert`} variant="caption" sx={{ width: '80px', textAlign: 'center' }}>
                      Expert
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AssessmentIcon />}
                aria-label="Save self-assessment results"
              >
                Save Assessment
              </Button>
            </Box>
          </Paper>
          
          {/* Data Literacy Quiz */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <QuizIcon />
              </Avatar>
              <Typography variant="h6">Data Literacy Quiz</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Test your knowledge with our interactive quiz. This 10-question assessment will evaluate your understanding of key data literacy concepts.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Quiz Information</AlertTitle>
              <Typography variant="body2">
                The quiz takes approximately 15 minutes to complete. You'll receive your results immediately after submission, along with recommended learning resources based on your performance.
              </Typography>
            </Alert>
            
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<PlayIcon />}
                aria-label="Start the data literacy quiz"
              >
                Start Quiz
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Sample Questions:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="What is the difference between structured and unstructured data?" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Which chart type is most appropriate for showing data composition as parts of a whole?" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HelpIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="What does the term 'data steward' refer to in a data governance framework?" />
              </ListItem>
            </List>
          </Paper>
          
          {/* Data Literacy Certification */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                <WorkspacePremiumIcon />
              </Avatar>
              <Typography variant="h6">Data Literacy Certification</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Complete the USCIS Data Literacy Certification program to formally validate your data literacy skills.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f9ff' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Level 1: Fundamental Certification
                    </Typography>
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Basic data literacy concepts" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Introduction to USCIS data sources" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Essential data visualization" />
                      </ListItem>
                    </List>
                    
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        60-minute assessment
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        color="primary"
                        aria-label="Register for fundamental certification"
                      >
                        Register
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f9ff' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Level 2: Advanced Certification
                    </Typography>
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Advanced data analysis techniques" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Data governance and stewardship" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Strategic data-driven decision making" />
                      </ListItem>
                    </List>
                    
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        90-minute assessment
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        color="primary"
                        aria-label="Register for advanced certification"
                      >
                        Register
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Alert severity="success">
              <AlertTitle>Professional Development</AlertTitle>
              <Typography variant="body2">
                Data Literacy Certification can be added to your Individual Development Plan (IDP) as a professional growth goal. Certified staff may be eligible for special projects and detail opportunities related to data initiatives.
              </Typography>
            </Alert>
          </Paper>
          
          {/* Assessment History */}
          <Box sx={{ p: 3, backgroundColor: '#f5f9ff', border: '1px solid', borderColor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Your Assessment History
            </Typography>
            
            <Typography variant="body2" paragraph>
              Track your progress over time. Your previous assessment results and certifications are stored here.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<HistoryIcon />}
                aria-label="View your assessment history"
              >
                View History
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<PrintIcon />}
                aria-label="Print your certificates"
              >
                Print Certificates
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Agency Context Tab */}
        <TabPanel value={activeTab} index={6}>
          <Typography variant="h5" gutterBottom>
            USCIS Data Literacy: Agency Context
          </Typography>
          <Typography variant="body1" paragraph>
            Understanding how data literacy fits within the broader USCIS mission, governance framework, and strategic goals is essential for effective implementation across the agency.
          </Typography>
          
          {/* Mission Connection Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PublicIcon />
              </Avatar>
              <Typography variant="h6">USCIS Mission & Data Literacy</Typography>
            </Box>
            
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f9ff', borderRadius: 1, borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                USCIS Mission Statement
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "USCIS administers the nation's lawful immigration system, safeguarding its integrity and promise by efficiently and fairly adjudicating requests for immigration benefits while protecting Americans, securing the homeland, and honoring our values."
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              How Data Literacy Supports Our Mission
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LeaderboardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Efficient Adjudication</Typography>
                    </Box>
                    <Typography variant="body2">
                      Data literacy enables officers to accurately interpret case data, identify patterns, and make informed decisions, leading to more efficient and consistent adjudication of immigration benefits.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ShieldIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">System Integrity</Typography>
                    </Box>
                    <Typography variant="body2">
                      Strong data literacy skills help identify potential fraud patterns, ensure data quality, and maintain the integrity of our immigration processes and systems through evidence-based approaches.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Strategic Decision Making</Typography>
                    </Box>
                    <Typography variant="body2">
                      Data literacy empowers leadership to make evidence-based strategic decisions, allocate resources effectively, and continuously improve operational processes across the agency.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Strategic Goals Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <FlagIcon />
              </Avatar>
              <Typography variant="h6">Strategic Goals & Alignment</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              The USCIS Data Literacy Program directly supports the agency's strategic goals and DHS priorities. Understanding this alignment helps contextualize the importance of data literacy in your daily work.
            </Typography>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="goal1-content"
                id="goal1-header"
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Goal 1: Strengthen the security and integrity of the immigration system
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Data literacy enables staff to identify patterns and anomalies that may indicate fraud or security concerns, ensuring the integrity of our immigration processes.
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Data Literacy Connection Points:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Advanced fraud detection through pattern recognition" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Data quality verification for case management" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Evidence-based risk assessment" />
                    </ListItem>
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="goal2-content"
                id="goal2-header"
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Goal 2: Improve operational efficiency and effectiveness
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Data literacy improves efficiency by enabling data-driven resource allocation, workflow optimization, and performance tracking across the agency.
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Data Literacy Connection Points:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Performance analytics for workload balancing" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Process optimization through data visualization" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Predictive analytics for resource planning" />
                    </ListItem>
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="goal3-content"
                id="goal3-header"
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Goal 3: Enhance the customer experience and promote equity
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Data literacy helps identify service gaps, measure customer experience metrics, and ensure equitable outcomes for all applicants through data-informed decision making.
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Data Literacy Connection Points:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Customer satisfaction metrics analysis" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Equity impact assessments through data" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Service delivery optimization based on user insights" />
                    </ListItem>
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
          
          {/* Data Governance Framework */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                <AccountBalanceIcon />
              </Avatar>
              <Typography variant="h6">USCIS Data Governance Framework</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Data literacy is a cornerstone of USCIS's Data Governance Framework, which establishes how the agency manages data as a strategic asset.
            </Typography>
            
            <Box sx={{ position: 'relative', width: '100%', height: 300, border: '1px solid', borderColor: 'divider', mb: 3, p: 2, borderRadius: 1 }}>
              {/* This would typically be an SVG chart - we're simulating it with positioned divs */}
              <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2 }}>
                USCIS Data Governance Structure
              </Typography>
              
              {/* Top Level */}
              <Box sx={{ 
                position: 'absolute', 
                top: '40px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '200px', 
                bgcolor: 'primary.main', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Executive Data Board
                </Typography>
              </Box>
              
              {/* Connector Lines (would be SVG in real implementation) */}
              <Box sx={{ 
                position: 'absolute', 
                top: '73px', 
                left: '50%', 
                height: '20px',
                width: '2px',
                bgcolor: 'grey.500'
              }} />
              
              {/* Middle Level */}
              <Box sx={{ 
                position: 'absolute', 
                top: '100px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '220px', 
                bgcolor: 'secondary.main', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Data Governance Council
                </Typography>
              </Box>
              
              {/* Connector Lines */}
              <Box sx={{ 
                position: 'absolute', 
                top: '133px', 
                left: '25%', 
                height: '20px',
                width: '2px',
                bgcolor: 'grey.500'
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: '133px', 
                left: '50%', 
                height: '20px',
                width: '2px',
                bgcolor: 'grey.500'
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: '133px', 
                left: '75%', 
                height: '20px',
                width: '2px',
                bgcolor: 'grey.500'
              }} />
              
              {/* Bottom Level */}
              <Box sx={{ 
                position: 'absolute', 
                top: '160px', 
                left: '25%', 
                transform: 'translateX(-50%)',
                width: '180px', 
                bgcolor: '#B31B1B', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Data Stewards
                </Typography>
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                top: '160px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '180px', 
                bgcolor: '#B31B1B', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Data Literacy Team
                </Typography>
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                top: '160px', 
                left: '75%', 
                transform: 'translateX(-50%)',
                width: '180px', 
                bgcolor: '#B31B1B', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Working Groups
                </Typography>
              </Box>
              
              {/* Connector Lines */}
              <Box sx={{ 
                position: 'absolute', 
                top: '193px', 
                left: '50%', 
                height: '20px',
                width: '2px',
                bgcolor: 'grey.500'
              }} />
              
              {/* Bottom Level */}
              <Box sx={{ 
                position: 'absolute', 
                top: '220px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '250px', 
                bgcolor: 'grey.700', 
                color: 'white',
                p: 1,
                textAlign: 'center',
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  All USCIS Personnel
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Key Functions of the Data Governance Framework:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.light', height: '100%' }}>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    Data Management
                  </Typography>
                  <Typography variant="body2">
                    Establishes policies and procedures for data lifecycle management, ensuring data quality, accessibility, and security across USCIS systems.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.light', height: '100%' }}>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    Standards & Compliance
                  </Typography>
                  <Typography variant="body2">
                    Defines data standards, metadata requirements, and compliance protocols to ensure consistency and interoperability across the agency.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.light', height: '100%' }}>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    Data Literacy Promotion
                  </Typography>
                  <Typography variant="body2">
                    Provides training, resources, and tools to enhance data literacy skills across all levels of the organization.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Policy Framework */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <GavelIcon />
              </Avatar>
              <Typography variant="h6">Policy Framework</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              USCIS data literacy initiatives operate within a comprehensive policy framework that includes federal mandates and agency-specific policies.
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PolicyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Federal Data Strategy" 
                  secondary="Government-wide framework that provides principles and practices for leveraging data as a strategic asset"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PolicyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Evidence-Based Policymaking Act" 
                  secondary="Legislation that requires federal agencies to use data for evidence-based decision making"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PolicyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="USCIS Data Strategy" 
                  secondary="Agency-specific strategy that outlines how USCIS will use data to achieve its mission and strategic goals"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PolicyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="USCIS Data Management Directive" 
                  secondary="Agency policy that establishes requirements for data management practices across USCIS"
                />
              </ListItem>
            </List>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Policy Resources</AlertTitle>
              <Typography variant="body2">
                Access the full text of these policies and related resources through the USCIS Policy Portal on the intranet. Contact the Office of Policy and Strategy for specific policy questions.
              </Typography>
            </Alert>
          </Paper>
          
          {/* How Data Literacy Fits In */}
          <Box sx={{ p: 3, backgroundColor: '#f5f9ff', border: '1px solid', borderColor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Your Role in the Data Ecosystem
            </Typography>
            
            <Typography variant="body2" paragraph>
              Every USCIS employee plays a part in the agency's data ecosystem. Understanding the agency context of data literacy helps you connect your daily work to the broader mission.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon sx={{ color: '#B31B1B', mr: 1 }} />
                      <Typography variant="subtitle2">How You Can Contribute</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Apply data literacy skills to your daily work by:
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Questioning assumptions in data reports" />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Advocating for data quality in your role" />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Sharing insights from data with your team" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HelpIcon sx={{ color: '#B31B1B', mr: 1 }} />
                      <Typography variant="subtitle2">Where to Get Support</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Resources available to support your data literacy journey:
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Data Literacy Community of Practice" />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Office of the Chief Data Officer" />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Data Literacy Champions in your directorate" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<ContactSupportIcon />}
                aria-label="Contact the data literacy team"
              >
                Connect With Data Literacy Team
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Handbook Tab */}
        <TabPanel value={activeTab} index={7}>
          <HandbookTab 
            userProgress={userProgress} 
            updateUserProgress={(progress) => {
              if (progress.handbookProgress) {
                // Use the context function for updating handbook progress
                updateHandbookProgress(progress.handbookProgress);
              }
            }} 
          />
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={activeTab} index={8}>
          <Typography variant="h5" gutterBottom>
            USCIS Data Literacy: Events & Training
          </Typography>
          <Typography variant="body1" paragraph>
            Stay up-to-date with the latest data literacy events, workshops, and training opportunities available to USCIS staff. Registration is available through the links below.
          </Typography>
          
          {/* Featured Event */}
          <Box sx={{ mb: 4, p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Paper elevation={3}>
              <Grid container>
                <Grid item xs={12} md={4} sx={{ bgcolor: 'primary.main', color: 'white', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    FEATURED EVENT
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">August 15-16, 2025</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">USCIS Headquarters</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">In-Person & Virtual</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Annual USCIS Data Summit 2025
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Join colleagues from across USCIS for our flagship data event of the year, featuring keynotes from agency leadership, hands-on workshops, and the latest innovations in immigration data analytics.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Keynote Speakers" size="small" color="primary" />
                    <Chip label="Workshops" size="small" color="primary" />
                    <Chip label="Networking" size="small" color="primary" />
                    <Chip label="Case Studies" size="small" color="primary" />
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<EventIcon />}
                    aria-label="Register for the Annual USCIS Data Summit"
                  >
                    Register Now
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          {/* Events Calendar Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <EventIcon />
              </Avatar>
              <Typography variant="h6">Upcoming Events</Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Event Registration</AlertTitle>
              All events require registration through the USCIS Training Portal. Virtual events will provide connection details after registration.
            </Alert>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>AUGUST 2025</Typography>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} md={1}>
                      <Box sx={{ bgcolor: '#f5f9ff', p: 1, borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="h6">10</Typography>
                        <Typography variant="caption">AUG</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Data Visualization Workshop: Creating Effective Dashboards
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">10:00 AM - 12:00 PM ET</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">Virtual (MS Teams)</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        Learn how to create effective dashboards using USCIS-approved visualization tools. This hands-on workshop will cover best practices for data presentation.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
                      <Button variant="outlined" color="primary" size="small" aria-label="Register for Data Visualization Workshop">
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} md={1}>
                      <Box sx={{ bgcolor: '#f5f9ff', p: 1, borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="h6">18</Typography>
                        <Typography variant="caption">AUG</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Data Ethics Roundtable: Responsible Use of Immigration Data
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">1:00 PM - 3:00 PM ET</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">USCIS HQ Room 4052 & Virtual</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        Join a discussion on ethical considerations when working with immigration data, including privacy, bias prevention, and responsible use policies.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
                      <Button variant="outlined" color="primary" size="small" aria-label="Register for Data Ethics Roundtable">
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>SEPTEMBER 2025</Typography>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} md={1}>
                      <Box sx={{ bgcolor: '#f5f9ff', p: 1, borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="h6">5</Typography>
                        <Typography variant="caption">SEP</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Introduction to SQL for Data Analysis
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">9:00 AM - 4:00 PM ET (Lunch provided)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">USCIS Training Center, Room 320</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        A full-day workshop for beginners to learn SQL basics for data analysis. Bring your laptop for hands-on exercises using sample immigration datasets.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
                      <Button variant="outlined" color="primary" size="small" aria-label="Register for Introduction to SQL workshop">
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} md={1}>
                      <Box sx={{ bgcolor: '#f5f9ff', p: 1, borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="h6">22</Typography>
                        <Typography variant="caption">SEP</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Webinar: Data-Driven Decision Making for Immigration Officers
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">11:00 AM - 12:30 PM ET</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">Virtual (Zoom Webinar)</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        Learn how field officers can leverage data insights to improve adjudication consistency and efficiency while maintaining compliance with agency policies.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
                      <Button variant="outlined" color="primary" size="small" aria-label="Register for Data-Driven Decision Making webinar">
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<EventIcon />}
                aria-label="View all upcoming events in the USCIS training calendar"
              >
                View Full Calendar
              </Button>
            </Box>
          </Paper>
          
          {/* Recorded Sessions */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                <PlayArrowIcon />
              </Avatar>
              <Typography variant="h6">Recorded Sessions</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Missed an event? Access our library of recorded training sessions and workshops. All recordings are available on the USCIS Learning Portal.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Data Literacy Fundamentals
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Recorded: July 12, 2025 • 45 minutes
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      An introduction to key data literacy concepts and their application in immigration services.
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                      <Button 
                        startIcon={<PlayArrowIcon />} 
                        size="small" 
                        color="primary"
                        aria-label="Watch Data Literacy Fundamentals recording"
                      >
                        Watch Recording
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Advanced Data Analysis Techniques
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Recorded: June 28, 2025 • 90 minutes
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Learn advanced analytical methods for deriving insights from complex immigration datasets.
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                      <Button 
                        startIcon={<PlayArrowIcon />} 
                        size="small" 
                        color="primary"
                        aria-label="Watch Advanced Data Analysis Techniques recording"
                      >
                        Watch Recording
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Data Visualization Best Practices
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Recorded: May 15, 2025 • 60 minutes
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Guidelines for creating clear, effective, and accessible data visualizations for immigration data.
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                      <Button 
                        startIcon={<PlayArrowIcon />} 
                        size="small" 
                        color="primary"
                        aria-label="Watch Data Visualization Best Practices recording"
                      >
                        Watch Recording
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<MenuBookIcon />}
                aria-label="View the complete library of recorded training sessions"
              >
                Access Full Library
              </Button>
            </Box>
          </Paper>
          
          {/* Suggest an Event */}
          <Box sx={{ p: 3, backgroundColor: '#f5f9ff', border: '1px solid', borderColor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Suggest an Event
            </Typography>
            
            <Typography variant="body2" paragraph>
              Have ideas for data literacy events, workshops, or training sessions that would benefit USCIS staff? Submit your suggestions using the form below.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Event Title"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Suggest an event title"
                />
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Your name"
                />
                <TextField
                  fullWidth
                  label="Your Email"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Your email address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  multiline
                  rows={4}
                  aria-label="Describe your suggested event"
                />
                <FormControl fullWidth size="small" margin="normal">
                  <InputLabel id="event-type-label">Event Type</InputLabel>
                  <Select
                    labelId="event-type-label"
                    id="event-type"
                    label="Event Type"
                    defaultValue=""
                    aria-label="Select event type"
                  >
                    <MenuItem value=""><em>Select type</em></MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="webinar">Webinar</MenuItem>
                    <MenuItem value="conference">Conference</MenuItem>
                    <MenuItem value="training">Training</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                aria-label="Submit your event suggestion"
              >
                Submit Suggestion
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Contact Tab */}
        <TabPanel value={activeTab} index={9}>
          <Typography variant="h5" gutterBottom>
            USCIS Data Literacy: Contact & Support
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions about data literacy at USCIS? Connect with our team for support, guidance, or to share feedback about the Data Literacy Program.
          </Typography>
          
          {/* Key Contacts Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <ContactSupportIcon />
              </Avatar>
              <Typography variant="h6">Key Contacts</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="subtitle1">Program Director</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      <strong>Sarah Johnson</strong><br />
                      Director, USCIS Data Literacy Program
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Link href="mailto:sarah.johnson@uscis.dhs.gov" aria-label="Email Sarah Johnson">
                          sarah.johnson@uscis.dhs.gov
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">(202) 555-1234</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                        <SchoolIcon />
                      </Avatar>
                      <Typography variant="subtitle1">Training Coordinator</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      <strong>Michael Rodriguez</strong><br />
                      Data Literacy Training Lead
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Link href="mailto:michael.rodriguez@uscis.dhs.gov" aria-label="Email Michael Rodriguez">
                          michael.rodriguez@uscis.dhs.gov
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">(202) 555-5678</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                        <HelpIcon />
                      </Avatar>
                      <Typography variant="subtitle1">Support Desk</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      <strong>Data Literacy Help Desk</strong><br />
                      Technical and program support
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Link href="mailto:data-literacy-support@uscis.dhs.gov" aria-label="Email the Data Literacy Help Desk">
                          data-literacy-support@uscis.dhs.gov
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">(202) 555-4321</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Office Locations */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <LocationOnIcon />
              </Avatar>
              <Typography variant="h6">Office Locations</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      USCIS Headquarters
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Data Literacy Program Office<br />
                      5th Floor, Room 5201<br />
                      111 Massachusetts Ave NW<br />
                      Washington, DC 20529
                    </Typography>
                    <Typography variant="body2">
                      <strong>Office Hours:</strong> Monday-Friday, 8:30 AM - 5:00 PM ET
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ height: 120, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" color="text.secondary">[Office Location Map]</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      USCIS Data Academy
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Training Center<br />
                      2nd Floor, Suite 210<br />
                      4600 Eisenhower Ave<br />
                      Alexandria, VA 22304
                    </Typography>
                    <Typography variant="body2">
                      <strong>Training Hours:</strong> Monday-Thursday, 9:00 AM - 4:00 PM ET
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ height: 120, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" color="text.secondary">[Training Center Map]</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* FAQ Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                <QuestionAnswerIcon />
              </Avatar>
              <Typography variant="h6">Frequently Asked Questions</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Find quick answers to common questions about the Data Literacy Program and related resources.
            </Typography>
            
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq1-content"
                id="faq1-header"
              >
                <Typography variant="subtitle2">How do I register for Data Literacy certification?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Registration for Data Literacy certification is available through the USCIS Training Portal. Navigate to the "Data Literacy Program" section and select "Certification Registration." You'll need to complete the pre-assessment before registering for the certification exam.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq2-content"
                id="faq2-header"
              >
                <Typography variant="subtitle2">Who should I contact for technical issues with data tools?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  For technical issues with USCIS data tools and applications, contact the Data Literacy Help Desk at data-literacy-support@uscis.dhs.gov or (202) 555-4321. Please provide specific details about the issue you're experiencing, including the name of the tool, error messages, and steps to reproduce the problem.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq3-content"
                id="faq3-header"
              >
                <Typography variant="subtitle2">How can I suggest topics for future training sessions?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  We welcome suggestions for future training topics! You can submit your ideas through the Events tab using the "Suggest an Event" form, or email them directly to Michael Rodriguez, our Training Coordinator, at michael.rodriguez@uscis.dhs.gov. Please include potential topics, target audience, and any specific learning objectives you'd like to see addressed.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq4-content"
                id="faq4-header"
              >
                <Typography variant="subtitle2">How can I join the Data Literacy Community of Practice?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  The Data Literacy Community of Practice is open to all USCIS employees interested in enhancing their data skills. To join, email data-literacy-community@uscis.dhs.gov with your name, position, and office. You'll be added to our mailing list for regular updates, invitations to community events, and access to our MS Teams channel where members share resources and best practices.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
          
          {/* Contact Form */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <EmailIcon />
              </Avatar>
              <Typography variant="h6">Contact Form</Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              Have a question not covered in our FAQs? Send us a message using the form below and a member of our team will get back to you within 2 business days.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Your full name"
                  required
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Your email address"
                  required
                />
                <FormControl fullWidth size="small" margin="normal" required>
                  <InputLabel id="inquiry-type-label">Inquiry Type</InputLabel>
                  <Select
                    labelId="inquiry-type-label"
                    id="inquiry-type"
                    label="Inquiry Type"
                    defaultValue=""
                    aria-label="Select your inquiry type"
                  >
                    <MenuItem value=""><em>Select type</em></MenuItem>
                    <MenuItem value="training">Training Question</MenuItem>
                    <MenuItem value="certification">Certification Inquiry</MenuItem>
                    <MenuItem value="tools">Data Tools Support</MenuItem>
                    <MenuItem value="events">Events Information</MenuItem>
                    <MenuItem value="resources">Resource Request</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Radio 
                      value="phoneCallback" 
                      name="phoneCallback" 
                      color="primary" 
                      aria-label="Request phone callback"
                    />
                  }
                  label="Request phone callback"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  aria-label="Subject of your inquiry"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  multiline
                  rows={5}
                  aria-label="Your message"
                  required
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                * Required fields
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SendIcon />}
                aria-label="Submit your inquiry"
              >
                Submit Inquiry
              </Button>
            </Box>
          </Paper>
          
          {/* Additional Support Resources */}
          <Box sx={{ p: 3, backgroundColor: '#f5f9ff', border: '1px solid', borderColor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Additional Resources
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ForumIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Discussion Forums</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Join our internal discussion forums to connect with colleagues, share insights, and ask questions about data literacy topics.
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="primary"
                        aria-label="Visit the Data Literacy discussion forums"
                      >
                        Join Discussions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GroupsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Office Hours</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Data literacy experts host weekly office hours for personalized guidance and support with your data-related questions.
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="primary"
                        aria-label="View the schedule for data literacy office hours"
                      >
                        View Schedule
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Knowledge Base</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Access our searchable knowledge base for articles, guides, and solutions to common data literacy challenges.
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="primary"
                        aria-label="Search the data literacy knowledge base"
                      >
                        Search Articles
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

// Main export wrapped with UserProgressProvider
const DataLiteracyModuleWithProgress: React.FC = () => (
  <UserProgressProvider>
    <DataLiteracyModule />
  </UserProgressProvider>
);

export default DataLiteracyModuleWithProgress;

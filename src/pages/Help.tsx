import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Chip,
  useMediaQuery,
  IconButton,
  Collapse
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Search as SearchIcon,
  ExpandMore,
  School,
  MenuBook,
  Help as HelpIcon,
  ContactSupport,
  PlayCircleOutline,
  Description,
  GetApp,
  Bookmark,
  QuestionAnswer,
  NavigateNext,
  Home,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Translate,
  VideoLibrary,
  Info,
  Assessment,
  NavigateBefore,
  ThumbUp,
  ThumbDown,
  CheckCircle
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// TabPanel component for accessibility
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`help-tabpanel-${index}`}
      aria-labelledby={`help-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Function for accessibility props
function a11yProps(index: number) {
  return {
    id: `help-tab-${index}`,
    'aria-controls': `help-tabpanel-${index}`,
  };
}

// Styled search box with USCIS styling
const SearchBox = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fff',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#003366',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#003366',
      borderWidth: 2,
    }
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(2),
  }
}));

// FAQ item interface for type safety
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Video tutorial interface
interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
}

// Help document interface
interface HelpDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  downloadUrl: string;
  fileType: string;
  lastUpdated: string;
}

// Main Help page component
const Help: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // State for active tab
  const [value, setValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSideNav, setShowSideNav] = useState(!isMobile);
  const [expandedCategory, setExpandedCategory] = useState<string | false>('getting-started');
  
  // Effect to handle responsive behavior
  useEffect(() => {
    setShowSideNav(!isMobile);
  }, [isMobile]);

  // Handle tab change
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  // Toggle side navigation
  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  // Sample FAQ data
  const faqs: FAQItem[] = [
    {
      question: "How do I reset my password?",
      answer: "Navigate to the login screen and click 'Forgot Password'. Follow the instructions sent to your email to reset your password.",
      category: "Account"
    },
    {
      question: "How do I update my profile information?",
      answer: "Click on your profile picture in the top right, select 'Profile', and click the 'Edit' button to update your information.",
      category: "Account"
    },
    {
      question: "What is Data Governance?",
      answer: "Data governance is the overall management of data availability, usability, integrity, and security in an enterprise. It includes processes, roles, policies, standards, and metrics that ensure the effective and efficient use of data.",
      category: "Data"
    },
    {
      question: "How do I request access to a dataset?",
      answer: "Navigate to the dataset you need access to, click the 'Request Access' button, fill out the justification form, and submit your request for approval.",
      category: "Data"
    },
    {
      question: "How are data classification labels determined?",
      answer: "Data classification labels are determined based on data sensitivity, regulatory requirements, and organizational policies. The Data Steward evaluates and assigns the appropriate classification during the data intake process.",
      category: "Security"
    },
    {
      question: "What browsers are supported by E-Unify?",
      answer: "E-Unify officially supports Google Chrome (latest version), Microsoft Edge (latest version), and Mozilla Firefox (latest version). For best experience, we recommend using Chrome.",
      category: "Technical"
    }
  ];

  // Sample video tutorials data
  const videoTutorials: VideoTutorial[] = [
    {
      id: "v1",
      title: "Getting Started with E-Unify",
      description: "Learn the basics of navigating and using E-Unify in this introductory tutorial.",
      thumbnail: "/images/videos/getting-started.jpg",
      duration: "4:30",
      category: "Beginner"
    },
    {
      id: "v2",
      title: "Data Catalog Search Techniques",
      description: "Advanced search techniques to find the data assets you need quickly.",
      thumbnail: "/images/videos/search-techniques.jpg",
      duration: "3:15",
      category: "Intermediate"
    },
    {
      id: "v3",
      title: "Managing Data Access Requests",
      description: "Learn how to submit, track, and approve data access requests.",
      thumbnail: "/images/videos/access-requests.jpg",
      duration: "5:45",
      category: "Advanced"
    }
  ];

  // Sample help documents
  const helpDocuments: HelpDocument[] = [
    {
      id: "d1",
      title: "E-Unify User Guide",
      description: "Complete user guide covering all features and functions of the E-Unify platform.",
      category: "Comprehensive",
      downloadUrl: "/docs/eunify-user-guide.pdf",
      fileType: "PDF",
      lastUpdated: "2025-06-15"
    },
    {
      id: "d2",
      title: "Data Governance Quick Reference",
      description: "One-page reference guide for data governance terms and processes.",
      category: "Quick Reference",
      downloadUrl: "/docs/governance-reference.pdf",
      fileType: "PDF",
      lastUpdated: "2025-07-28"
    },
    {
      id: "d3",
      title: "Keyboard Shortcuts",
      description: "List of all keyboard shortcuts available in E-Unify.",
      category: "Accessibility",
      downloadUrl: "/docs/keyboard-shortcuts.pdf",
      fileType: "PDF",
      lastUpdated: "2025-08-01"
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Page header with title and search */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
          Help Center
        </Typography>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpIcon sx={{ mr: 0.5 }} fontSize="small" />
            Help Center
          </Typography>
        </Breadcrumbs>
        
        {/* Search bar - accessible and prominently placed */}
        <SearchBox
          fullWidth
          placeholder="Search for help topics"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#003366' }} />
              </InputAdornment>
            ),
            'aria-label': 'Search help topics',
          }}
          sx={{ mb: 4 }}
        />
      </Box>
      
      {/* Main content layout with responsive grid */}
      <Grid container spacing={3}>
        {/* Side navigation with toggle for mobile */}
        {isMobile && (
          <Grid item xs={12}>
            <Button
              onClick={toggleSideNav}
              startIcon={showSideNav ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              variant="outlined"
              fullWidth
              sx={{ 
                mb: 2, 
                color: '#003366', 
                borderColor: '#003366',
                '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
              }}
              aria-expanded={showSideNav}
              aria-controls="help-side-nav"
            >
              {showSideNav ? 'Hide Topics' : 'Show Topics'}
            </Button>
          </Grid>
        )}
        
        {/* Side navigation panel */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Collapse in={showSideNav} id="help-side-nav">
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 1, 
                height: '100%', 
                border: '1px solid #e0e0e0' 
              }}
            >
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: '#003366', 
                  fontWeight: 600, 
                  mb: 2,
                  borderBottom: '2px solid #003366',
                  pb: 1
                }}
                id="help-topics-heading"
              >
                Help Topics
              </Typography>
              
              <List 
                component="nav" 
                aria-labelledby="help-topics-heading"
                dense
                sx={{ width: '100%' }}
              >
                <Accordion 
                  expanded={expandedCategory === 'getting-started'} 
                  onChange={handleAccordionChange('getting-started')}
                  disableGutters
                  elevation={0}
                  sx={{ border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="getting-started-content"
                    id="getting-started-header"
                    sx={{ px: 1, py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <School fontSize="small" sx={{ color: '#003366' }} />
                    </ListItemIcon>
                    <ListItemText primary="Getting Started" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <List component="div" disablePadding>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#orientation"
                      >
                        <ListItemText primary="Orientation" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#first-steps"
                      >
                        <ListItemText primary="First Steps" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#account-setup"
                      >
                        <ListItemText primary="Account Setup" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion 
                  expanded={expandedCategory === 'knowledge-base'} 
                  onChange={handleAccordionChange('knowledge-base')}
                  disableGutters
                  elevation={0}
                  sx={{ border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="knowledge-base-content"
                    id="knowledge-base-header"
                    sx={{ px: 1, py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MenuBook fontSize="small" sx={{ color: '#003366' }} />
                    </ListItemIcon>
                    <ListItemText primary="Knowledge Base" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <List component="div" disablePadding>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#articles"
                      >
                        <ListItemText primary="Articles" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#tutorials"
                      >
                        <ListItemText primary="Tutorials" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#glossary"
                      >
                        <ListItemText primary="Glossary" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion 
                  expanded={expandedCategory === 'videos'} 
                  onChange={handleAccordionChange('videos')}
                  disableGutters
                  elevation={0}
                  sx={{ border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="videos-content"
                    id="videos-header"
                    sx={{ px: 1, py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VideoLibrary fontSize="small" sx={{ color: '#003366' }} />
                    </ListItemIcon>
                    <ListItemText primary="Video Tutorials" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <List component="div" disablePadding>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#beginner-videos"
                      >
                        <ListItemText primary="Beginner" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#intermediate-videos"
                      >
                        <ListItemText primary="Intermediate" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#advanced-videos"
                      >
                        <ListItemText primary="Advanced" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion 
                  expanded={expandedCategory === 'faq'} 
                  onChange={handleAccordionChange('faq')}
                  disableGutters
                  elevation={0}
                  sx={{ border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="faq-content"
                    id="faq-header"
                    sx={{ px: 1, py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <QuestionAnswer fontSize="small" sx={{ color: '#003366' }} />
                    </ListItemIcon>
                    <ListItemText primary="FAQ" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <List component="div" disablePadding>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#account-faq"
                      >
                        <ListItemText primary="Account" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#data-faq"
                      >
                        <ListItemText primary="Data" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#security-faq"
                      >
                        <ListItemText primary="Security" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#technical-faq"
                      >
                        <ListItemText primary="Technical" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion 
                  expanded={expandedCategory === 'downloads'} 
                  onChange={handleAccordionChange('downloads')}
                  disableGutters
                  elevation={0}
                  sx={{ border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="downloads-content"
                    id="downloads-header"
                    sx={{ px: 1, py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <GetApp fontSize="small" sx={{ color: '#003366' }} />
                    </ListItemIcon>
                    <ListItemText primary="Downloads" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <List component="div" disablePadding>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#user-guides"
                      >
                        <ListItemText primary="User Guides" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#quick-references"
                      >
                        <ListItemText primary="Quick References" />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          pl: 4,
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                          '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                        }}
                        component="a"
                        role="button"
                        tabIndex={0}
                        href="#templates"
                      >
                        <ListItemText primary="Templates" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <ListItem 
                  sx={{ 
                    pl: 2, 
                    py: 1,
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' },
                    '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' }
                  }}
                  component={RouterLink}
                  to="/contact"
                  role="button"
                  tabIndex={0}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ContactSupport fontSize="small" sx={{ color: '#003366' }} />
                  </ListItemIcon>
                  <ListItemText primary="Contact Support" />
                </ListItem>
              </List>
            </Paper>
          </Collapse>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={12} md={showSideNav ? 9 : 12} lg={showSideNav ? 9.5 : 12}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: { xs: 2, md: 3 }, 
              borderRadius: 1, 
              minHeight: '70vh',
              border: '1px solid #e0e0e0' 
            }}
          >
            {/* Tabs for top-level navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                aria-label="Help content tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  '& .Mui-selected': { color: '#003366' },
                  '& .MuiTabs-indicator': { backgroundColor: '#003366' }
                }}
              >
                <Tab 
                  label="Getting Started" 
                  icon={<School />} 
                  iconPosition="start" 
                  {...a11yProps(0)} 
                  sx={{ 
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                />
                <Tab 
                  label="Knowledge Base" 
                  icon={<MenuBook />} 
                  iconPosition="start" 
                  {...a11yProps(1)}
                  sx={{ 
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                />
                <Tab 
                  label="Video Tutorials" 
                  icon={<VideoLibrary />} 
                  iconPosition="start" 
                  {...a11yProps(2)}
                  sx={{ 
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                />
                <Tab 
                  label="FAQ" 
                  icon={<QuestionAnswer />} 
                  iconPosition="start" 
                  {...a11yProps(3)}
                  sx={{ 
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                />
                <Tab 
                  label="Downloads" 
                  icon={<GetApp />} 
                  iconPosition="start" 
                  {...a11yProps(4)}
                  sx={{ 
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                />
              </Tabs>
            </Box>
            
            {/* Tab content panels */}
            <TabPanel value={value} index={0}>
              <Box id="orientation">
                <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  Welcome to E-Unify
                </Typography>
                <Typography paragraph>
                  E-Unify is USCIS's enterprise data governance platform designed to help you discover, understand, and govern data assets across the organization. This getting started guide will help you navigate the platform and understand its key features.
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600, mb: 1 }}>
                          Core Features
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Data Catalog" secondary="Discover and explore available datasets" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Data Lineage" secondary="Understand data origin and transformations" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Data Dictionary" secondary="View metadata and definitions" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600, mb: 1 }}>
                          Navigation
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Top Menu" secondary="Access main application features" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Side Navigation" secondary="Context-specific options and filters" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Search" secondary="Find data assets and documentation" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h4" sx={{ color: '#003366', fontWeight: 600, mb: 1 }}>
                          Help Resources
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Documentation" secondary="Detailed guides and references" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Training" secondary="Video tutorials and workshops" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" sx={{ color: '#003366' }} /></ListItemIcon>
                            <ListItemText primary="Support" secondary="Contact help desk for assistance" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              <Box id="first-steps" sx={{ mt: 6 }}>
                <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  First Steps
                </Typography>
                
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 1, mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" component="h4" gutterBottom>
                        1. Set Up Your Profile
                      </Typography>
                      <Typography paragraph>
                        Complete your user profile to personalize your experience and enable collaboration features. Add your department, role, and areas of interest.
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={RouterLink} 
                        to="/profile"
                        sx={{ 
                          backgroundColor: '#003366',
                          '&:hover': { backgroundColor: '#002244' },
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                        }}
                      >
                        Go to Profile
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <img 
                        src="/images/help/profile-setup.png" 
                        alt="Screenshot of profile setup page" 
                        style={{ 
                          width: '100%', 
                          maxWidth: '300px', 
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px'
                        }} 
                      />
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" component="h4" gutterBottom>
                        2. Explore the Data Catalog
                      </Typography>
                      <Typography paragraph>
                        Browse available data assets or use the search to find specific datasets. Review metadata, lineage, and documentation before requesting access.
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={RouterLink} 
                        to="/data-catalog"
                        sx={{ 
                          backgroundColor: '#003366',
                          '&:hover': { backgroundColor: '#002244' },
                          '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                        }}
                      >
                        Browse Catalog
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <img 
                        src="/images/help/data-catalog.png" 
                        alt="Screenshot of data catalog browsing interface" 
                        style={{ 
                          width: '100%', 
                          maxWidth: '300px', 
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px'
                        }} 
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              
              <Box id="account-setup" sx={{ mt: 6 }}>
                <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 2 }}>
                  Account Setup
                </Typography>
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="account-prerequisites"
                    id="account-prerequisites-header"
                  >
                    <Typography variant="h6" component="h4">Prerequisites</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemIcon><CheckCircle sx={{ color: '#003366' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Valid USCIS network account"
                          secondary="Must have active directory credentials"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle sx={{ color: '#003366' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Data governance training"
                          secondary="Complete required security and privacy training"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircle sx={{ color: '#003366' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Manager approval"
                          secondary="For certain access levels and features"
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="account-access-levels"
                    id="account-access-levels-header"
                  >
                    <Typography variant="h6" component="h4">Access Levels</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                            Basic User
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Browse catalog, view public assets, request access
                          </Typography>
                          <Chip label="Default" size="small" sx={{ bgcolor: '#e8f4f8' }} />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                            Data Steward
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Manage metadata, approve access, set policies
                          </Typography>
                          <Chip label="Requires Approval" size="small" sx={{ bgcolor: '#fff4e5' }} />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                            Administrator
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Configure system, manage users, define taxonomy
                          </Typography>
                          <Chip label="Restricted" size="small" sx={{ bgcolor: '#ffe5e5' }} />
                        </Paper>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </TabPanel>
            
            <TabPanel value={value} index={1}>
              <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
                Knowledge Base
              </Typography>
              
              <Box id="articles">
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Featured Articles
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h5" gutterBottom>
                          Understanding Data Governance Fundamentals
                        </Typography>
                        <Typography variant="caption" color="text.secondary" paragraph>
                          Last updated: August 10, 2025
                        </Typography>
                        <Typography paragraph>
                          Learn the core principles of data governance and how they apply to USCIS operations and policies.
                        </Typography>
                        <Button 
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#003366', 
                            borderColor: '#003366',
                            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="h5" gutterBottom>
                          Data Classification Guidelines
                        </Typography>
                        <Typography variant="caption" color="text.secondary" paragraph>
                          Last updated: July 28, 2025
                        </Typography>
                        <Typography paragraph>
                          Comprehensive guide to data classification levels, handling procedures, and security requirements.
                        </Typography>
                        <Button 
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#003366', 
                            borderColor: '#003366',
                            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#003366',
                      '&:hover': { backgroundColor: '#002244' },
                      '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                    }}
                  >
                    Browse All Articles
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box id="tutorials" sx={{ mt: 4 }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Step-by-Step Tutorials
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon><Description sx={{ color: '#003366' }} /></ListItemIcon>
                    <ListItemText 
                      primary="How to Request Access to Restricted Datasets" 
                      secondary="Learn the process for requesting and receiving approval for sensitive data assets."
                    />
                    <Button size="small">View</Button>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon><Description sx={{ color: '#003366' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Creating and Managing Business Glossary Terms" 
                      secondary="Best practices for maintaining consistent data terminology."
                    />
                    <Button size="small">View</Button>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon><Description sx={{ color: '#003366' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Data Quality Monitoring and Reporting" 
                      secondary="How to set up alerts and generate reports on data quality metrics."
                    />
                    <Button size="small">View</Button>
                  </ListItem>
                </List>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box id="glossary" sx={{ mt: 4 }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Data Governance Glossary
                </Typography>
                
                <TextField
                  label="Filter Terms"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Data Steward</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      An individual responsible for managing and overseeing a specific data asset or collection of data. Their responsibilities include ensuring data quality, appropriate access, and compliance with policies and standards.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Related Terms:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip label="Data Owner" size="small" onClick={() => {}} />
                      <Chip label="Data Custodian" size="small" onClick={() => {}} />
                      <Chip label="Data Governance" size="small" onClick={() => {}} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Data Lineage</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      The documentation of the data's origins, transformations, and movement through systems. Data lineage provides visibility into the data flow and helps in tracing errors back to their source.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Related Terms:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip label="Data Flow" size="small" onClick={() => {}} />
                      <Chip label="Data Provenance" size="small" onClick={() => {}} />
                      <Chip label="Metadata" size="small" onClick={() => {}} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Data Classification</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      The process of categorizing data based on its level of sensitivity and the impact to the organization should that data be disclosed, altered, or destroyed without authorization.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Related Terms:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip label="Sensitive PII" size="small" onClick={() => {}} />
                      <Chip label="Data Security" size="small" onClick={() => {}} />
                      <Chip label="Access Control" size="small" onClick={() => {}} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#003366',
                      '&:hover': { backgroundColor: '#002244' },
                      '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                    }}
                  >
                    View Full Glossary
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            
            <TabPanel value={value} index={2}>
              <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
                Video Tutorials
              </Typography>
              
              <Box id="featured-videos">
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Featured Videos
                </Typography>
                
                <Grid container spacing={3}>
                  {videoTutorials.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={video.thumbnail}
                          alt={`Thumbnail for ${video.title}`}
                        />
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Chip 
                              label={video.category} 
                              size="small" 
                              sx={{ 
                                bgcolor: video.category === 'Beginner' ? '#e8f4f8' : 
                                        video.category === 'Intermediate' ? '#fff4e5' : 
                                        '#ffe5e5'
                              }} 
                            />
                            <Typography variant="body2" color="text.secondary">
                              {video.duration}
                            </Typography>
                          </Box>
                          <Typography variant="h6" component="h5" gutterBottom sx={{ fontSize: '1.1rem' }}>
                            {video.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {video.description}
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<PlayCircleOutline />}
                            size="small"
                            sx={{ 
                              backgroundColor: '#003366',
                              '&:hover': { backgroundColor: '#002244' },
                              '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                            }}
                          >
                            Watch Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box id="video-categories" sx={{ mt: 4 }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Video Categories
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                        Getting Started
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Introductory videos covering basic navigation and features.
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Chip label="5 videos" size="small" />
                        <Button 
                          size="small" 
                          sx={{ 
                            mt: 1, 
                            color: '#003366',
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                        Data Governance
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Videos explaining governance concepts, policies, and procedures.
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Chip label="8 videos" size="small" />
                        <Button 
                          size="small" 
                          sx={{ 
                            mt: 1, 
                            color: '#003366',
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                        Advanced Features
                      </Typography>
                      <Typography variant="body2" paragraph>
                        In-depth tutorials on complex functionality and integrations.
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Chip label="6 videos" size="small" />
                        <Button 
                          size="small" 
                          sx={{ 
                            mt: 1, 
                            color: '#003366',
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <Box id="webinars" sx={{ mt: 6 }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                  Recent Webinars
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon><VideoLibrary sx={{ color: '#003366' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Data Governance Best Practices for USCIS" 
                      secondary="Recorded July 15, 2025 | 45 min"
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        color: '#003366', 
                        borderColor: '#003366',
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    >
                      Watch
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon><VideoLibrary sx={{ color: '#003366' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Implementing Data Quality Controls" 
                      secondary="Recorded June 22, 2025 | 60 min"
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        color: '#003366', 
                        borderColor: '#003366',
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    >
                      Watch
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </TabPanel>
            
            <TabPanel value={value} index={3}>
              <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
                Frequently Asked Questions
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <TextField
                  label="Search FAQ"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Filter by Category
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label="All" 
                      onClick={() => {}} 
                      sx={{ 
                        backgroundColor: '#003366', 
                        color: '#fff',
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }} 
                    />
                    <Chip 
                      label="Account" 
                      onClick={() => {}} 
                      variant="outlined" 
                      sx={{ 
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    />
                    <Chip 
                      label="Data" 
                      onClick={() => {}} 
                      variant="outlined" 
                      sx={{ 
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    />
                    <Chip 
                      label="Security" 
                      onClick={() => {}} 
                      variant="outlined" 
                      sx={{ 
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    />
                    <Chip 
                      label="Technical" 
                      onClick={() => {}} 
                      variant="outlined" 
                      sx={{ 
                        '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Top Questions
                </Typography>
                
                {faqs.map((faq, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`faq-panel-${index}-content`}
                      id={`faq-panel-${index}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{faq.question}</Typography>
                        <Chip 
                          label={faq.category} 
                          size="small" 
                          sx={{ 
                            ml: 2,
                            bgcolor: 
                              faq.category === 'Account' ? '#e8f4f8' :
                              faq.category === 'Data' ? '#fff4e5' :
                              faq.category === 'Security' ? '#ffe5e5' :
                              '#f0f0f0'
                          }} 
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography paragraph>{faq.answer}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Was this helpful?</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<ThumbUp />}
                          sx={{ 
                            minWidth: '100px',
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          Yes
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<ThumbDown />}
                          sx={{ 
                            minWidth: '100px',
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          No
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Still Have Questions?
                </Typography>
                <Typography paragraph>
                  Contact our support team for personalized assistance with your issues.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<ContactSupport />}
                  sx={{ 
                    backgroundColor: '#003366',
                    '&:hover': { backgroundColor: '#002244' },
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                >
                  Contact Support
                </Button>
              </Box>
            </TabPanel>
            
            <TabPanel value={value} index={4}>
              <Typography variant="h5" component="h3" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
                Downloads & Resources
              </Typography>
              
              <Grid container spacing={3}>
                {helpDocuments.map((doc) => (
                  <Grid item xs={12} md={6} key={doc.id}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1, 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2
                      }}
                    >
                      <Description sx={{ color: '#003366', fontSize: 40 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h4" gutterBottom>
                          {doc.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {doc.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Chip 
                              label={doc.fileType} 
                              size="small" 
                              sx={{ mr: 1, bgcolor: '#e8f4f8' }} 
                            />
                            <Typography variant="caption" color="text.secondary">
                              Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<GetApp />}
                            href={doc.downloadUrl}
                            download
                            size="small"
                            sx={{ 
                              backgroundColor: '#003366',
                              '&:hover': { backgroundColor: '#002244' },
                              '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" component="h4" sx={{ mb: 3 }}>
                  Additional Resources
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h5">
                          Training Calendar
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          View upcoming training sessions, workshops, and certification opportunities.
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          sx={{ 
                            color: '#003366', 
                            borderColor: '#003366',
                            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          View Calendar
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h5">
                          Data Governance Framework
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Learn about USCIS's data governance approach, policies, and standards.
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          sx={{ 
                            color: '#003366', 
                            borderColor: '#003366',
                            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h5">
                          System Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Check the current operational status of E-Unify and related systems.
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          sx={{ 
                            color: '#003366', 
                            borderColor: '#003366',
                            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0, 51, 102, 0.04)' },
                            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                          }}
                        >
                          Check Status
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Help;

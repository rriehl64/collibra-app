import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  MenuBook as MenuBookIcon,
  VideoLibrary as VideoLibraryIcon,
  HelpOutline as HelpOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`docs-tabpanel-${index}`}
      aria-labelledby={`docs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `docs-tab-${index}`,
    'aria-controls': `docs-tabpanel-${index}`,
  };
}

interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'reference' | 'tutorial' | 'video' | 'faq';
  lastUpdated: string;
  tags: string[];
}

const Documentation: React.FC = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>('panel1');
  
  // Mock documentation items
  const documentationItems: DocItem[] = [
    {
      id: 'doc-001',
      title: 'Getting Started with Data Literacy',
      description: 'A comprehensive guide to understanding data literacy and how to use this platform.',
      category: 'guide',
      type: 'guide',
      lastUpdated: '2025-07-15',
      tags: ['beginner', 'overview', 'introduction']
    },
    {
      id: 'doc-002',
      title: 'Data Catalog API Reference',
      description: 'Complete API documentation for programmatic access to the Data Catalog.',
      category: 'reference',
      type: 'reference',
      lastUpdated: '2025-08-01',
      tags: ['api', 'integration', 'developer']
    },
    {
      id: 'doc-003',
      title: 'Creating Your First Data Asset',
      description: 'Step-by-step tutorial for creating and managing data assets in the system.',
      category: 'tutorial',
      type: 'tutorial',
      lastUpdated: '2025-07-22',
      tags: ['data-asset', 'tutorial', 'beginner']
    },
    {
      id: 'doc-004',
      title: 'Data Governance Best Practices',
      description: 'Learn about recommended practices for effective data governance.',
      category: 'guide',
      type: 'guide',
      lastUpdated: '2025-06-18',
      tags: ['governance', 'compliance', 'best-practices']
    },
    {
      id: 'doc-005',
      title: 'Video: User Management Tutorial',
      description: 'Visual guide to managing users and permissions in the system.',
      category: 'video',
      type: 'video',
      lastUpdated: '2025-07-30',
      tags: ['video', 'users', 'access-management']
    },
    {
      id: 'doc-006',
      title: 'Role-Based Access Control',
      description: 'Detailed explanation of the RBAC model implemented in this platform.',
      category: 'reference',
      type: 'reference',
      lastUpdated: '2025-07-12',
      tags: ['rbac', 'security', 'permissions']
    },
    {
      id: 'doc-007',
      title: 'Data Classification Framework',
      description: 'Understanding how to classify data assets for proper governance.',
      category: 'guide',
      type: 'guide',
      lastUpdated: '2025-08-03',
      tags: ['classification', 'governance', 'compliance']
    },
    {
      id: 'doc-008',
      title: 'FAQ: Common Data Literacy Questions',
      description: 'Answers to frequently asked questions about data literacy concepts.',
      category: 'faq',
      type: 'faq',
      lastUpdated: '2025-07-25',
      tags: ['faq', 'help', 'support']
    },
    {
      id: 'doc-009',
      title: 'Video: Data Visualization Best Practices',
      description: 'Learn how to create effective visualizations with your data.',
      category: 'video',
      type: 'video',
      lastUpdated: '2025-07-08',
      tags: ['video', 'visualization', 'reporting']
    },
    {
      id: 'doc-010',
      title: 'Jurisdiction Compliance Guide',
      description: 'How to ensure your data governance meets various jurisdictional requirements.',
      category: 'guide',
      type: 'guide',
      lastUpdated: '2025-08-02',
      tags: ['compliance', 'legal', 'jurisdictions']
    }
  ];
  
  const filteredDocs = documentationItems.filter(doc => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      doc.title.toLowerCase().includes(searchLower) ||
      doc.description.toLowerCase().includes(searchLower) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Get docs by category for tab panels
  const getDocsByCategory = (category: string) => {
    return filteredDocs.filter(doc => doc.category === category);
  };
  
  const guides = getDocsByCategory('guide');
  const references = getDocsByCategory('reference');
  const tutorials = getDocsByCategory('tutorial');
  const videos = getDocsByCategory('video');
  const faqs = getDocsByCategory('faq');
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get icon by doc type
  const getIconByType = (type: string) => {
    switch (type) {
      case 'guide':
        return <MenuBookIcon />;
      case 'reference':
        return <DescriptionIcon />;
      case 'tutorial':
        return <SchoolIcon />;
      case 'video':
        return <VideoLibraryIcon />;
      case 'faq':
        return <HelpOutlineIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };
  
  // Mock FAQ data
  const faqItems = [
    {
      id: 'panel1',
      question: 'What is data literacy?',
      answer: 'Data literacy refers to the ability to read, understand, create, and communicate data as information. It involves the competence to work with data effectively, interpret data visualizations, think critically about information derived from data, and utilize data effectively to inform decisions.'
    },
    {
      id: 'panel2',
      question: 'How do I request access to restricted data assets?',
      answer: 'To request access to restricted data assets, navigate to the specific asset in the data catalog, click the "Request Access" button, and complete the request form. Your request will be reviewed by the data steward responsible for that asset, who will approve or deny it based on your role and business need.'
    },
    {
      id: 'panel3',
      question: 'What is a data steward?',
      answer: 'A data steward is responsible for managing data assets within an organization. They ensure the quality, accessibility, and security of data, define data governance rules, approve access requests, and maintain metadata accuracy. Data stewards are subject matter experts for their respective data domains.'
    },
    {
      id: 'panel4',
      question: 'How do I report a data quality issue?',
      answer: "You can report a data quality issue by navigating to the affected data asset, clicking the 'Report Issue' button, and filling out the data quality issue form with details about the problem you've identified. The responsible data steward will be notified and will address the issue."
    },
    {
      id: 'panel5',
      question: 'What is the difference between a data dictionary and a glossary?',
      answer: 'A data dictionary is a technical document that describes the structure of a database, including details about tables, fields, and relationships. A business glossary, on the other hand, provides standardized definitions of business terms and concepts to ensure consistent understanding across the organization.'
    }
  ];

  return (
    <Container sx={{ py: 4 }} className="documentation-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
        Documentation
      </Typography>
      <Typography variant="body1" paragraph>
        Comprehensive guides, tutorials, and reference materials for the Data Literacy Support platform.
      </Typography>
      
      {/* Search bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search documentation..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText ? (
                  <InputAdornment position="end">
                    <IconButton 
                      aria-label="Clear search" 
                      onClick={() => setSearchText('')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              aria-label="Search documentation"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Documentation Categories */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="documentation categories"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Documents" icon={<ArticleIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Guides" icon={<MenuBookIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Tutorials" icon={<SchoolIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="References" icon={<DescriptionIcon />} iconPosition="start" {...a11yProps(3)} />
          <Tab label="Videos" icon={<VideoLibraryIcon />} iconPosition="start" {...a11yProps(4)} />
          <Tab label="FAQs" icon={<HelpOutlineIcon />} iconPosition="start" {...a11yProps(5)} />
        </Tabs>
      </Box>
      
      {/* All Documents Tab */}
      <TabPanel value={tabValue} index={0}>
        {filteredDocs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">No documentation found matching your search.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredDocs.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }} aria-hidden="true">
                        {getIconByType(doc.type)}
                      </Box>
                      <Typography variant="h6" component="h2">
                        {doc.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {doc.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {doc.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }} 
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {formatDate(doc.lastUpdated)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" endIcon={<DescriptionIcon />}>
                      View
                    </Button>
                    <Button size="small" endIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      {/* Guides Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {guides.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">No guides found matching your search.</Typography>
            </Grid>
          ) : (
            guides.map((guide) => (
              <Grid item xs={12} md={6} key={guide.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }} aria-hidden="true">
                        <MenuBookIcon />
                      </Box>
                      <Typography variant="h6" component="h2">
                        {guide.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {guide.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {guide.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {formatDate(guide.lastUpdated)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" endIcon={<DescriptionIcon />}>
                      View
                    </Button>
                    <Button size="small" endIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* Tutorials Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {tutorials.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">No tutorials found matching your search.</Typography>
            </Grid>
          ) : (
            tutorials.map((tutorial) => (
              <Grid item xs={12} key={tutorial.id}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ mr: 2, mt: 1 }} aria-hidden="true">
                      <SchoolIcon fontSize="large" />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {tutorial.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {tutorial.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tutorial.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {formatDate(tutorial.lastUpdated)}
                        </Typography>
                        <Box>
                          <Button size="small" variant="outlined" sx={{ mr: 1 }}>Start Tutorial</Button>
                          <Button size="small" variant="text">Download PDF</Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* References Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {references.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">No reference materials found matching your search.</Typography>
            </Grid>
          ) : (
            references.map((reference) => (
              <Grid item xs={12} key={reference.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }} aria-hidden="true">
                        <DescriptionIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h2">
                          {reference.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {formatDate(reference.lastUpdated)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {reference.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        icon={<AssignmentIcon />}
                        label="Technical Reference" 
                        color="primary"
                        variant="outlined"
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                      {reference.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<CodeIcon />}>
                      API Reference
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* Videos Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          {videos.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">No videos found matching your search.</Typography>
            </Grid>
          ) : (
            videos.map((video) => (
              <Grid item xs={12} md={6} key={video.id}>
                <Card elevation={2}>
                  <Box 
                    sx={{ 
                      height: 180, 
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <VideoLibraryIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {video.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {formatDate(video.lastUpdated)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Watch Video
                    </Button>
                    <Button size="small">
                      Download Transcript
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* FAQs Tab */}
      <TabPanel value={tabValue} index={5}>
        {faqs.length === 0 && faqItems.length === 0 ? (
          <Typography variant="body1" align="center">No FAQs found matching your search.</Typography>
        ) : (
          <>
            {faqs.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  FAQ Documents
                </Typography>
                <Grid container spacing={3}>
                  {faqs.map((faq) => (
                    <Grid item xs={12} md={6} key={faq.id}>
                      <Card elevation={2}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ mr: 2 }} aria-hidden="true">
                              <HelpOutlineIcon />
                            </Box>
                            <Typography variant="h6" component="h3">
                              {faq.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {faq.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last updated: {formatDate(faq.lastUpdated)}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">
                            View FAQs
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Frequently Asked Questions
              </Typography>
              {faqItems.map((item) => (
                <Accordion 
                  key={item.id}
                  expanded={expandedFAQ === item.id}
                  onChange={handleAccordionChange(item.id)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${item.id}-content`}
                    id={`${item.id}-header`}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </>
        )}
      </TabPanel>
    </Container>
  );
};

export default Documentation;

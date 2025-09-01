import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
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
  Print as PrintIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Architecture as ArchitectureIcon,
  SmartToy as AIIcon,
  Build as BuildIcon,
  MonitorHeart as MonitorIcon,
  AttachMoney as CostIcon,
  Timeline as TimelineIcon,
  Gavel as ComplianceIcon,
  CloudQueue as CloudIcon,
  IntegrationInstructions as IntegrationIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../services/api';
import ReactMarkdown from 'react-markdown';

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
  const [featuresMd, setFeaturesMd] = useState<string>('');
  const [featuresLoading, setFeaturesLoading] = useState<boolean>(true);
  const [featuresError, setFeaturesError] = useState<string | null>(null);
  const featuresPrintRef = useRef<HTMLDivElement>(null);
  
  // Derive backend origin from API base (e.g., http://localhost:3002)
  let backendOrigin = API_BASE_URL.replace(/\/api\/v1$/, '');
  // If pointing to frontend or wrong port (e.g., 3000/3001), normalize to 3002
  backendOrigin = backendOrigin.replace(/:(3000|3001)(?=\/|$)/, ':3002');

  // Normalize common mojibake and Unicode punctuation to ASCII equivalents
  const normalizeMarkdown = (input: string): string => {
    return input
      // true Unicode characters
      .replace(/\u00A0/g, ' ')   // NBSP -> space
      .replace(/\u2011/g, '-')   // non-breaking hyphen -> hyphen
      .replace(/\u2013/g, '-')   // en dash -> hyphen
      .replace(/\u2014/g, '-')   // em dash -> hyphen
      // common UTF-8 -> Win-1252 mojibake sequences seen in browsers
      .replace(/â€‘/g, '-')
      .replace(/â€“/g, '-')
      .replace(/â€”/g, '-')
      .replace(/Â /g, ' ');
  };

  // Load Features markdown once
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setFeaturesLoading(true);
        setFeaturesError(null);
        const res = await fetch(`${backendOrigin}/docs/features.md`, { signal: controller.signal, credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        setFeaturesMd(normalizeMarkdown(text));
      } catch (e: any) {
        if (e.name !== 'AbortError') setFeaturesError(e.message || 'Failed to load features doc');
      } finally {
        setFeaturesLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [backendOrigin]);

  const handlePrintFeatures = () => {
    const node = featuresPrintRef.current;
    if (!node) return;
    const printWindow = window.open('', 'printWindow', 'width=1024,height=768');
    if (!printWindow) return;
    const title = 'E-Unify: Features & Capabilities';
    const now = new Date().toLocaleString();
    const styles = `
      <style>
        @page { margin: 16mm; }
        body { font-family: "Source Sans Pro", Arial, sans-serif; color: #000; }
        h1,h2,h3 { color: #003366; }
        a { color: #003366; text-decoration: underline; }
        .markdown-content { max-width: 100%; }
        ul, ol { padding-left: 20px; }
        .print-header { border-bottom: 2px solid #003366; margin-bottom: 12px; padding-bottom: 8px; }
        .print-footer { border-top: 1px solid #ccc; margin-top: 16px; padding-top: 8px; font-size: 12px; color: #555; }
      </style>
    `;
    printWindow.document.write(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>${title}</title>
          ${styles}
        </head>
        <body>
          <div class="print-header">
            <h1>${title}</h1>
            <div>Printed: ${now}</div>
          </div>
          <div class="markdown-content">${node.innerHTML}</div>
          <div class="print-footer">Source: Features & Capabilities (Inline View)</div>
          <script>
            window.onload = function(){
              window.focus();
              window.print();
              setTimeout(function(){ window.close(); }, 200);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
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
      {/* DHS USCIS Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#003366', borderRadius: 1 }}>
        <Box sx={{ mr: 3 }}>
          <img 
            src="/images/uscis-logo.png" 
            alt="USCIS Logo" 
            style={{ height: '60px', width: 'auto' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            E-Unify Documentation Hub
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3D9FF' }}>
            U.S. Citizenship and Immigration Services
          </Typography>
          <Typography variant="body2" sx={{ color: '#CCE7FF' }}>
            Department of Homeland Security
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
        Comprehensive enterprise documentation for E-Unify: System Architecture, Security & Compliance, 
        AI Operations, DevOps, Cost Analysis, and Technical Resources. All documentation meets Section 508 
        accessibility standards and federal compliance requirements.
      </Typography>
      
      {/* Quick Links */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h6" component="h2" sx={{ mb: 0.5 }}>
                Features & Capabilities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore a curated inventory of app features across frontend and backend.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              color="primary"
              component="a"
              href={`${backendOrigin}/docs/features.md`}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<DescriptionIcon />}
              aria-label="Open Features and Capabilities documentation in a new tab"
            >
              Open Features Doc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Templates & Forms */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h6" component="h2" sx={{ mb: 0.5 }}>
                Templates & Forms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quickly access the Project Charter and KPI Dictionary modules.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'inline-flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/project-charter"
                startIcon={<AssignmentIcon />}
                aria-label="Open Project Charter form"
                sx={{
                  backgroundColor: '#003366',
                  '&:hover': { backgroundColor: '#00264d' },
                  '&:focus': { outline: '3px solid #003366', outlineOffset: 2 }
                }}
              >
                Project Charter
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/templates/kpi-dictionary"
                startIcon={<TrendingUpIcon />}
                aria-label="Open KPI Dictionary page"
                sx={{
                  '&:focus': { outline: '3px solid #003366', outlineOffset: 2 }
                }}
              >
                KPI Dictionary
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/templates/kpis"
                startIcon={<TrendingUpIcon />}
                aria-label="Open KPI Catalog browser"
                sx={{
                  '&:focus': { outline: '3px solid #003366', outlineOffset: 2 }
                }}
              >
                Open KPI Catalog
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features & Capabilities (Inline, Collapsible) */}
      <Accordion sx={{ mb: 3 }} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="features-content"
          id="features-header"
        >
          <Typography variant="h6" component="h2" sx={{ color: '#003366', fontWeight: 700 }}>
            Features & Capabilities (Inline View)
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintIcon />}
              aria-label="Print Features section to PDF"
              onClick={(e) => { e.stopPropagation(); handlePrintFeatures(); }}
              onFocus={(e) => e.stopPropagation()}
              onKeyDown={(e) => { e.stopPropagation(); }}
            >
              Print PDF
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails aria-live="polite" aria-busy={featuresLoading ? 'true' : 'false'}>
          {featuresLoading && (
            <Typography variant="body1">Loading features...</Typography>
          )}
          {featuresError && (
            <Typography role="alert" color="error.main">{featuresError}</Typography>
          )}
          {!featuresLoading && !featuresError && (
            <Box className="markdown-content" ref={featuresPrintRef}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <Typography variant="h4" component="h3" sx={{ mt: 2, color: '#003366', fontWeight: 700 }}>
                      {children}
                    </Typography>
                  ),
                  h2: ({ children }) => (
                    <Typography variant="h5" component="h4" sx={{ mt: 2, color: '#003366', fontWeight: 700 }}>
                      {children}
                    </Typography>
                  ),
                  h3: ({ children }) => (
                    <Typography variant="h6" component="h5" sx={{ mt: 2, color: '#003366', fontWeight: 700 }}>
                      {children}
                    </Typography>
                  ),
                  p: ({ children }) => (
                    <Typography variant="body1" paragraph>
                      {children}
                    </Typography>
                  ),
                  li: ({ children }) => (
                    <li>
                      <Typography component="span" variant="body1">{children}</Typography>
                    </li>
                  ),
                  a: ({ href, title, children }) => (
                    <a href={href} title={title as string | undefined} target="_blank" rel="noopener noreferrer">{children}</a>
                  )
                }}
              >
                {featuresMd}
              </ReactMarkdown>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      
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
          sx={{
            '& .MuiTab-root': {
              color: '#003366',
              '&.Mui-selected': {
                color: '#003366',
                fontWeight: 600
              },
              '&:focus': {
                outline: '3px solid #003366',
                outlineOffset: 2
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#003366'
            }
          }}
        >
          <Tab label="Overview" icon={<ArticleIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="System Architecture" icon={<ArchitectureIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Security & Compliance" icon={<SecurityIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="AI Operations" icon={<AIIcon />} iconPosition="start" {...a11yProps(3)} />
          <Tab label="DevOps & CI/CD" icon={<BuildIcon />} iconPosition="start" {...a11yProps(4)} />
          <Tab label="Observability" icon={<MonitorIcon />} iconPosition="start" {...a11yProps(5)} />
          <Tab label="Cost & LOE" icon={<CostIcon />} iconPosition="start" {...a11yProps(6)} />
          <Tab label="Resources" icon={<MenuBookIcon />} iconPosition="start" {...a11yProps(7)} />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Section 508 Compliant:</strong> All documentation and interfaces meet federal accessibility standards. 
                Use keyboard navigation (Tab, Arrow keys) and screen readers are fully supported.
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArchitectureIcon sx={{ mr: 2, color: '#003366' }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#003366', fontWeight: 600 }}>
                    System Architecture
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Technical architecture, infrastructure design, database schemas, API documentation, 
                  and system integration patterns for E-Unify.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• Node.js/Express Backend Architecture" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• React/TypeScript Frontend Design" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• MongoDB Database Schema" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• API Endpoint Documentation" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#003366', fontWeight: 600 }}>
                    Security & Compliance
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Federal security requirements, compliance frameworks, and authorization processes 
                  for government deployment.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• DHS ATO (Authority to Operate)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Privacy Impact Assessment (PIA)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• FISMA Compliance Framework" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• FedRAMP Authorization Process" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AIIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#003366', fontWeight: 600 }}>
                    AI Operations & Maintenance
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Artificial Intelligence integration for automated operations, maintenance, 
                  monitoring, and continuous improvement during development and production.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• AI-Powered Code Analysis" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Automated Testing & QA" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Predictive Maintenance" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Performance Optimization" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BuildIcon sx={{ mr: 2, color: '#FF9800' }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#003366', fontWeight: 600 }}>
                    DevOps & CI/CD
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Continuous Integration/Continuous Deployment pipelines, testing strategies, 
                  deployment automation, and development workflow documentation.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• GitHub Actions CI/CD Pipeline" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Automated Testing Framework" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Deployment Strategies" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Quality Gates & Code Review" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* System Architecture Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              System Architecture & Technical Design
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Backend Architecture
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Component</strong></TableCell>
                        <TableCell><strong>Technology</strong></TableCell>
                        <TableCell><strong>Purpose</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Runtime</TableCell>
                        <TableCell>Node.js 18+</TableCell>
                        <TableCell>JavaScript server runtime</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Framework</TableCell>
                        <TableCell>Express.js</TableCell>
                        <TableCell>Web application framework</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Database</TableCell>
                        <TableCell>MongoDB</TableCell>
                        <TableCell>Document-based data storage</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ODM</TableCell>
                        <TableCell>Mongoose</TableCell>
                        <TableCell>Object Document Mapping</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Authentication</TableCell>
                        <TableCell>JWT + bcrypt</TableCell>
                        <TableCell>Secure user authentication</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Frontend Architecture
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Component</strong></TableCell>
                        <TableCell><strong>Technology</strong></TableCell>
                        <TableCell><strong>Purpose</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Framework</TableCell>
                        <TableCell>React 18</TableCell>
                        <TableCell>Component-based UI library</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Language</TableCell>
                        <TableCell>TypeScript</TableCell>
                        <TableCell>Type-safe JavaScript</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>UI Library</TableCell>
                        <TableCell>Material-UI v5</TableCell>
                        <TableCell>Component library & theming</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Routing</TableCell>
                        <TableCell>React Router</TableCell>
                        <TableCell>Client-side navigation</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>State Management</TableCell>
                        <TableCell>React Context</TableCell>
                        <TableCell>Global state management</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Database Schema & Collections
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Core Collections</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• users - User accounts & profiles" /></ListItem>
                        <ListItem><ListItemText primary="• dataassets - Data catalog entries" /></ListItem>
                        <ListItem><ListItemText primary="• businessprocesses - Process documentation" /></ListItem>
                        <ListItem><ListItemText primary="• datacategories - Classification taxonomy" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Reporting Collections</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• weeklystatuses - Weekly reports" /></ListItem>
                        <ListItem><ListItemText primary="• monthlystatuses - Monthly summaries" /></ListItem>
                        <ListItem><ListItemText primary="• kpis - Key Performance Indicators" /></ListItem>
                        <ListItem><ListItemText primary="• projectcharters - Project documentation" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Reference Collections</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• datadomains - Domain classifications" /></ListItem>
                        <ListItem><ListItemText primary="• dataconcepts - Business concepts" /></ListItem>
                        <ListItem><ListItemText primary="• subjectcategories - Subject areas" /></ListItem>
                        <ListItem><ListItemText primary="• studyaids - Learning resources" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Security & Compliance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              Security & Compliance Framework
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Federal Compliance Required:</strong> All security measures must meet DHS, FISMA, and FedRAMP standards for government deployment.
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComplianceIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    DHS ATO Process
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Authority to Operate (ATO) is required for all DHS systems processing federal data.
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="1. System Security Plan (SSP) Development" /></ListItem>
                  <ListItem><ListItemText primary="2. Security Control Implementation (NIST SP 800-53)" /></ListItem>
                  <ListItem><ListItemText primary="3. Security Assessment & Testing" /></ListItem>
                  <ListItem><ListItemText primary="4. Risk Assessment & Mitigation" /></ListItem>
                  <ListItem><ListItemText primary="5. Continuous Monitoring Plan" /></ListItem>
                  <ListItem><ListItemText primary="6. ATO Decision & Documentation" /></ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <Chip label="Timeline: 12-18 months" color="warning" size="small" />
                  <Chip label="Cost: $500K-$1M" color="error" size="small" sx={{ ml: 1 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 2, color: '#B31B1B' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Privacy Assessments
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Privacy Impact Assessment (PIA) and Privacy Threshold Assessment (PTA) for PII handling.
                </Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">PIA Requirements</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem><ListItemText primary="• Data collection and usage documentation" /></ListItem>
                      <ListItem><ListItemText primary="• Privacy risk assessment and mitigation" /></ListItem>
                      <ListItem><ListItemText primary="• Data sharing and retention policies" /></ListItem>
                      <ListItem><ListItemText primary="• Individual rights and consent mechanisms" /></ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">PTA Requirements</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem><ListItemText primary="• Threshold determination for PII processing" /></ListItem>
                      <ListItem><ListItemText primary="• Privacy risk level assessment" /></ListItem>
                      <ListItem><ListItemText primary="• Recommendation for full PIA requirement" /></ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Security Scanning & Vulnerability Management
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                      <CloudIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                      <Typography variant="h6" component="h4">Palo Alto Networks</Typography>
                      <Typography variant="body2" paragraph>Prisma Cloud (Twistlock)</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• Container vulnerability scanning" /></ListItem>
                        <ListItem><ListItemText primary="• Runtime protection monitoring" /></ListItem>
                        <ListItem><ListItemText primary="• Compliance reporting" /></ListItem>
                        <ListItem><ListItemText primary="• CI/CD pipeline integration" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                      <Typography variant="h6" component="h4">FISMA Compliance</Typography>
                      <Typography variant="body2" paragraph>Federal Security Framework</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• NIST Cybersecurity Framework" /></ListItem>
                        <ListItem><ListItemText primary="• Security control documentation" /></ListItem>
                        <ListItem><ListItemText primary="• Continuous monitoring program" /></ListItem>
                        <ListItem><ListItemText primary="• Regular security assessments" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                      <ComplianceIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                      <Typography variant="h6" component="h4">FedRAMP Authorization</Typography>
                      <Typography variant="body2" paragraph>Cloud Security Authorization</Typography>
                      <List dense>
                        <ListItem><ListItemText primary="• Cloud service provider authorization" /></ListItem>
                        <ListItem><ListItemText primary="• Security requirements compliance" /></ListItem>
                        <ListItem><ListItemText primary="• Continuous monitoring & reporting" /></ListItem>
                        <ListItem><ListItemText primary="• JAB or Agency authorization path" /></ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* AI Operations Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              AI-Powered Operations & Maintenance
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>AI Integration:</strong> Leveraging artificial intelligence for automated operations, predictive maintenance, and continuous improvement throughout the development lifecycle and production operations.
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AIIcon sx={{ mr: 2, color: '#4CAF50' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Development Phase AI
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Code Analysis & Review" 
                      secondary="AI-powered code quality analysis, security vulnerability detection, and automated code review suggestions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Automated Testing Generation" 
                      secondary="AI generates comprehensive test cases, edge case detection, and test coverage optimization"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><IntegrationIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Documentation Generation" 
                      secondary="Automatic API documentation, code comments, and technical specification generation"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MonitorIcon sx={{ mr: 2, color: '#2196F3' }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#003366' }}>
                    Production AI Operations
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><TimelineIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Predictive Maintenance" 
                      secondary="AI monitors system health, predicts failures, and recommends preventive maintenance actions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MonitorIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Performance Optimization" 
                      secondary="Real-time performance analysis, resource allocation optimization, and bottleneck identification"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="Security Monitoring" 
                      secondary="AI-powered threat detection, anomaly identification, and automated incident response"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  AI Implementation Roadmap
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Phase</strong></TableCell>
                        <TableCell><strong>Timeline</strong></TableCell>
                        <TableCell><strong>AI Capabilities</strong></TableCell>
                        <TableCell><strong>Expected Benefits</strong></TableCell>
                        <TableCell><strong>Investment</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Phase 1: Foundation</TableCell>
                        <TableCell>Months 1-3</TableCell>
                        <TableCell>Code analysis, automated testing</TableCell>
                        <TableCell>30% reduction in bugs, 50% faster testing</TableCell>
                        <TableCell>$50K-$100K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phase 2: Operations</TableCell>
                        <TableCell>Months 4-8</TableCell>
                        <TableCell>Performance monitoring, predictive maintenance</TableCell>
                        <TableCell>25% improved uptime, 40% faster issue resolution</TableCell>
                        <TableCell>$100K-$200K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phase 3: Intelligence</TableCell>
                        <TableCell>Months 9-12</TableCell>
                        <TableCell>Advanced analytics, automated optimization</TableCell>
                        <TableCell>20% cost reduction, 60% faster deployments</TableCell>
                        <TableCell>$150K-$300K</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* DevOps & CI/CD Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
              DevOps & CI/CD Pipeline Documentation
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Continuous Integration/Continuous Deployment Pipeline
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4CAF50' }}>Development Workflow</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="1. Feature Development" secondary="Git feature branches, code review process" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="2. Automated Testing" secondary="Unit tests, integration tests, E2E testing" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><SecurityIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="3. Security Scanning" secondary="SAST, DAST, dependency vulnerability checks" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CloudIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="4. Deployment" secondary="Staging validation, production deployment" />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#FF9800' }}>Quality Gates</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="✓ Code Coverage > 80%" secondary="Comprehensive test coverage requirement" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="✓ Zero Critical Vulnerabilities" secondary="Security scanning must pass" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="✓ Performance Benchmarks" secondary="Load testing and performance validation" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="✓ Accessibility Compliance" secondary="Section 508 automated testing" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="✓ Code Review Approval" secondary="Peer review and approval required" />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Testing Strategy & Framework
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Test Type</strong></TableCell>
                        <TableCell><strong>Framework/Tools</strong></TableCell>
                        <TableCell><strong>Coverage</strong></TableCell>
                        <TableCell><strong>Automation Level</strong></TableCell>
                        <TableCell><strong>Execution Trigger</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Unit Tests</TableCell>
                        <TableCell>Jest, React Testing Library</TableCell>
                        <TableCell>85%+ code coverage</TableCell>
                        <TableCell>Fully Automated</TableCell>
                        <TableCell>Every commit</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Integration Tests</TableCell>
                        <TableCell>Supertest, MongoDB Memory Server</TableCell>
                        <TableCell>API endpoints, database operations</TableCell>
                        <TableCell>Fully Automated</TableCell>
                        <TableCell>Pull request</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>End-to-End Tests</TableCell>
                        <TableCell>Cypress, Playwright</TableCell>
                        <TableCell>Critical user journeys</TableCell>
                        <TableCell>Automated + Manual</TableCell>
                        <TableCell>Pre-deployment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Performance Tests</TableCell>
                        <TableCell>Artillery, Lighthouse CI</TableCell>
                        <TableCell>Load testing, page performance</TableCell>
                        <TableCell>Automated</TableCell>
                        <TableCell>Nightly builds</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Security Tests</TableCell>
                        <TableCell>OWASP ZAP, Snyk, Twistlock</TableCell>
                        <TableCell>Vulnerability scanning</TableCell>
                        <TableCell>Fully Automated</TableCell>
                        <TableCell>Every build</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Accessibility Tests</TableCell>
                        <TableCell>axe-core, Pa11y</TableCell>
                        <TableCell>Section 508 compliance</TableCell>
                        <TableCell>Automated + Manual</TableCell>
                        <TableCell>Pull request</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Deployment Environments
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><BuildIcon sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Development" 
                      secondary="Local development environment with hot reloading and debugging tools"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TimelineIcon sx={{ color: '#FF9800' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Staging" 
                      secondary="Production-like environment for integration testing and user acceptance testing"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CloudIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Production" 
                      secondary="Live environment with full monitoring, logging, and disaster recovery capabilities"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#003366', mb: 2 }}>
                  Deployment Strategies
                </Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Blue-Green Deployment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Two identical production environments (Blue and Green) where one serves live traffic while the other is updated. 
                      Provides zero-downtime deployments and instant rollback capability.
                    </Typography>
                    <Chip label="Zero Downtime" color="success" size="small" />
                    <Chip label="Instant Rollback" color="primary" size="small" sx={{ ml: 1 }} />
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Rolling Deployment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Gradual replacement of instances with new versions, maintaining service availability throughout the process. 
                      Suitable for applications that can handle mixed versions temporarily.
                    </Typography>
                    <Chip label="Gradual Rollout" color="info" size="small" />
                    <Chip label="Service Continuity" color="success" size="small" sx={{ ml: 1 }} />
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Canary Deployment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Deploy new version to a small subset of users first, monitor performance and feedback, 
                      then gradually increase traffic to the new version.
                    </Typography>
                    <Chip label="Risk Mitigation" color="warning" size="small" />
                    <Chip label="User Feedback" color="primary" size="small" sx={{ ml: 1 }} />
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

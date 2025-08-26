// USCIS Accessible About Page - Section 508 Compliant
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useMediaQuery,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Button,
  Badge,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QuestionAnswerIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Menu as MenuIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  SwapHoriz as SwapHorizIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as GavelIcon,
  Speed as SpeedIcon,
  Shield as ShieldIcon,
  SupervisorAccount as SupervisorAccountIcon,
  SecurityUpdate as SecurityUpdateIcon,
  Policy as PolicyIcon,
  FactCheck as FactCheckIcon,
  DeveloperMode as DeveloperModeIcon,
  Timeline as TimelineIcon,
  ManageAccounts as ManageAccountsIcon,
  Category as CategoryIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Tab Panel component for accessibility
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, id, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Side navigation item component for accessibility
interface SideNavItemProps {
  icon: React.ReactElement;
  label: string;
  selected: boolean;
  onClick: () => void;
  index: number;
  tabId: string;
}

function SideNavItem({ icon, label, selected, onClick, index, tabId }: SideNavItemProps) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      role="tab"
      aria-selected={selected}
      aria-controls={`${tabId}-tabpanel-${index}`}
      id={`${tabId}-tab-${index}`}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

function About() {
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Function to handle tab changes with keyboard accessibility
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Function to handle side navigation clicks
  const handleSideNavClick = (index: number) => {
    setTabValue(index);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Tab ID for accessibility
  const tabId = "about-eunify";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation for improved wayfinding */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
          aria-label="Go to dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </MuiLink>
        <Typography
          color="text.primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#003366',
            fontWeight: 600
          }}
        >
          <InfoIcon sx={{ mr: 0.5 }} fontSize="small" />
          About E-Unify
        </Typography>
      </Breadcrumbs>

      {/* Page title and introduction */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          color: '#003366',
          fontWeight: 700
        }}
      >
        About E-Unify
      </Typography>

      <Box
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#f5f5f5',
          borderLeft: '4px solid #003366',
          borderRadius: '4px'
        }}
      >
        <Typography variant="body1">
          E-Unify is USCIS's enterprise metadata management platform that provides a single source of truth for data assets across the organization. This comprehensive solution enables better data discovery, understanding, and governance, ultimately supporting improved decision-making and operational efficiency.
        </Typography>
      </Box>

      {/* Mobile menu toggle button - only visible on small screens */}
      {isMobile && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={showMobileMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            onClick={toggleMobileMenu}
            variant="outlined"
            sx={{ color: '#003366', borderColor: '#003366' }}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-sidenav"
          >
            {showMobileMenu ? 'Hide Menu' : 'Show Menu'}
          </Button>
        </Box>
      )}

      {/* Main content with tabs and side navigation */}
      <Box sx={{ mb: 2, display: { xs: 'flex', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          onClick={toggleSideNav}
          aria-expanded={sideNavOpen}
          aria-label={sideNavOpen ? "Hide side menu" : "Show side menu"}
          startIcon={sideNavOpen ? <KeyboardArrowLeftIcon /> : <MenuIcon />}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ 
            borderColor: '#003366', 
            color: '#003366',
            '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' },
            '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
          }}
        >
          {sideNavOpen ? "Hide Side Menu" : "Show Side Menu"}
        </Button>
      </Box>
      <Grid container spacing={3}>
        {/* Side Navigation - Hidden on mobile unless expanded */}
        <Grid 
          item 
          xs={12} 
          md={sideNavOpen ? 3 : 0}
          sx={{ 
            display: sideNavOpen ? 'block' : 'none',
            transition: 'all 0.3s ease-in-out' 
          }}
        >
          <Button
            fullWidth
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            startIcon={showMobileMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{ display: { xs: 'flex', md: 'none' }, mb: 1 }}
            aria-expanded={showMobileMenu}
            aria-controls="side-navigation"
          >
            {showMobileMenu ? 'Hide Navigation' : 'Show Navigation'}
          </Button>
          <Collapse in={showMobileMenu || !isMobile}>
            <Paper elevation={3} sx={{ height: '100%' }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#003366', 
                  color: 'white',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                }}
              >
                Navigation
              </Typography>
              <List 
                component="div" 
                role="tablist"
                id="side-navigation"
                aria-label="About E-Unify navigation"
                sx={{ '.MuiListItemIcon-root': { color: '#003366' } }}
              >
                <SideNavItem 
                  icon={<InfoIcon />} 
                  label="Overview"
                  selected={tabValue === 0}
                  onClick={() => handleSideNavClick(0)}
                  index={0}
                  tabId={tabId}
                />
                <SideNavItem 
                  icon={<MenuBookIcon />} 
                  label="Mission & Vision"
                  selected={tabValue === 1}
                  onClick={() => handleSideNavClick(1)}
                  index={1}
                  tabId={tabId}
                />
                <SideNavItem 
                  icon={<HistoryIcon />} 
                  label="History & Development"
                  selected={tabValue === 2}
                  onClick={() => handleSideNavClick(2)}
                  index={2}
                  tabId={tabId}
                />
                <SideNavItem 
                  icon={<PeopleIcon />} 
                  label="Team & Organization"
                  selected={tabValue === 3}
                  onClick={() => handleSideNavClick(3)}
                  index={3}
                  tabId={tabId}
                />
                <SideNavItem 
                  icon={<SecurityIcon />} 
                  label="Security & Compliance"
                  selected={tabValue === 4}
                  onClick={() => handleSideNavClick(4)}
                  index={4}
                  tabId={tabId}
                />
                <SideNavItem 
                  icon={<QuestionAnswerIcon />} 
                  label="FAQ"
                  selected={tabValue === 5}
                  onClick={() => handleSideNavClick(5)}
                  index={5}
                  tabId={tabId}
                />
              </List>
            </Paper>
          </Collapse>
        </Grid>

        {/* Tab Content Area */}
        <Grid 
          item 
          xs={12} 
          md={sideNavOpen ? 9 : 12}
          sx={{ transition: 'all 0.3s ease-in-out' }}
        >
          <Paper elevation={3} sx={{ minHeight: '600px' }}>
            {/* Horizontal tabs - alternative navigation method for accessibility */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="About E-Unify tabs"
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                sx={{ 
                  '.MuiTab-root': { 
                    color: '#003366', 
                    '&.Mui-selected': {
                      color: '#003366',
                      fontWeight: 700
                    }
                  }
                }}
              >
                <Tab 
                  label="Overview" 
                  id={`${tabId}-tab-0`}
                  aria-controls={`${tabId}-tabpanel-0`}
                />
                <Tab 
                  label="Mission & Vision" 
                  id={`${tabId}-tab-1`}
                  aria-controls={`${tabId}-tabpanel-1`}
                />
                <Tab 
                  label="History & Development" 
                  id={`${tabId}-tab-2`}
                  aria-controls={`${tabId}-tabpanel-2`}
                />
                <Tab 
                  label="Team & Organization" 
                  id={`${tabId}-tab-3`}
                  aria-controls={`${tabId}-tabpanel-3`}
                />
                <Tab 
                  label="Security & Compliance" 
                  id={`${tabId}-tab-4`}
                  aria-controls={`${tabId}-tabpanel-4`}
                />
                <Tab 
                  label="FAQ" 
                  id={`${tabId}-tab-5`}
                  aria-controls={`${tabId}-tabpanel-5`}
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {/* Tab 0: Overview */}
            <TabPanel value={tabValue} index={0} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Overview of E-Unify
              </Typography>
              
              <Typography paragraph>
                E-Unify serves as the authoritative enterprise metadata management platform for USCIS, centralizing data asset documentation, governance, and discovery capabilities. The platform enhances data understanding across the organization by providing context, lineage, and quality metrics for all connected data assets.
              </Typography>
              
              <Typography paragraph>
                By implementing E-Unify, USCIS has established a foundation for improved data management practices, enabling better decision-making, reducing redundancy, and fostering collaboration between technical and business teams. The platform supports metadata-driven automation, semantic search, and integration with other enterprise systems.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }} id="branding-section-heading">
                About the E-Unify Name and Tagline
              </Typography>
              
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mb: 4,
                  borderLeft: '4px solid #003366',
                  backgroundColor: '#f8f9fa'
                }}
                aria-labelledby="branding-section-heading"
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }} id="branding-tagline">
                      "E-Unify: Your Pathway to Benefit"
                    </Typography>
                    
                    <Typography paragraph>
                      The name "E-Unify" embodies our core mission of unifying enterprise data across USCIS. The "E" represents both "Enterprise" and "Electronic," reflecting our digital approach to data integration. "Unify" speaks to our commitment to bringing together disparate data sources into a cohesive, accessible framework.
                    </Typography>
                    
                    <Typography paragraph>
                      Our tagline, "Your Pathway to Benefit," emphasizes the platform's ultimate purpose: creating clear pathways for users to derive tangible benefits from organizational data. It highlights that E-Unify is not just a technical tool, but a means to unlock value and enable better outcomes for USCIS stakeholders.
                    </Typography>
                    
                    <Box 
                      sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
                      role="figure"
                      aria-labelledby="branding-formation-label"
                    >
                      <Typography id="branding-formation-label" sx={{ width: '1px', height: '1px', overflow: 'hidden', position: 'absolute' }}>
                        Visual representation of how E-Unify name is formed
                      </Typography>
                      <Chip 
                        label="Enterprise" 
                        color="primary" 
                        sx={{ mr: 1, mb: { xs: 1, sm: 0 }, bgcolor: '#003366', fontSize: '0.875rem' }} 
                        aria-label="Enterprise"
                        tabIndex={0}
                      />
                      <Typography variant="body2" sx={{ mx: 1 }} aria-hidden="true">+</Typography>
                      <Chip 
                        label="Unify" 
                        sx={{ mr: 1, mb: { xs: 1, sm: 0 }, bgcolor: '#0056b3', color: 'white', fontSize: '0.875rem' }} 
                        aria-label="Unify"
                        tabIndex={0}
                      />
                      <Typography variant="body2" sx={{ mx: 1 }} aria-hidden="true">=</Typography>
                      <Chip 
                        label="E-Unify" 
                        sx={{ fontWeight: 'bold', bgcolor: '#003366', color: 'white', fontSize: '0.875rem' }} 
                        aria-label="E-Unify"
                        tabIndex={0}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        borderRadius: '50%', 
                        bgcolor: '#f0f4f8',
                        border: '2px solid #003366',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 180,
                        height: 180
                      }}
                      role="img"
                      aria-labelledby="branding-logo-label"
                    >
                      <Typography id="branding-logo-label" sx={{ width: '1px', height: '1px', overflow: 'hidden', position: 'absolute' }}>
                        E-Unify logo with tagline Your Pathway to Benefit
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#003366', mb: 1 }}>
                        E-Unify
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#003366', fontStyle: 'italic', textAlign: 'center' }}>
                        Your Pathway to Benefit
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Accessibility features for screen readers */}
                <Box className="sr-only" sx={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                  <Typography variant="body2">
                    The E-Unify branding combines Enterprise and Unify concepts, with the official tagline "Your Pathway to Benefit" to emphasize how the platform creates pathways for users to benefit from organizational data.
                  </Typography>
                </Box>
              </Paper>
              
              {/* Contextual callout to Data Strategy Support Services */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mb: 4,
                  backgroundColor: '#e6f2ff',
                  borderLeft: '4px solid #003366',
                  borderRadius: '4px'
                }}
                role="region"
                aria-label="Data Strategy Support Services callout"
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }} gutterBottom>
                      Data Strategy Support Services
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explore our 508-compliant Data Strategy Support module featuring the Operating Model, Capstone Project, and curated resources to help you plan and execute your agency data strategy.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      component={Link}
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

              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }}>
                Core Features
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Business Glossary
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Standardized terminology and definitions for business concepts across the organization, ensuring consistent understanding of key terms.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Catalog
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comprehensive inventory of data assets with detailed metadata, making data discoverable and understandable for all users.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Lineage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visual tracking of data flow from source to consumption, providing transparency into transformations and dependencies.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Policy Management
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documentation and enforcement of data governance policies, standards, and procedures across the enterprise.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Workflow Automation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Streamlined processes for metadata curation, approvals, and change management to ensure data quality.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Impact Analysis
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assessment capabilities to understand the downstream effects of proposed data changes before implementation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 1: Mission & Vision */}
            <TabPanel value={tabValue} index={1} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Mission & Vision
              </Typography>
              
              <Box 
                sx={{
                  p: 3,
                  mb: 4,
                  backgroundColor: '#e6f7ff',
                  borderLeft: '4px solid #003366',
                  borderRadius: '4px'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                  Mission Statement
                </Typography>
                <Typography>
                  To establish a unified, trusted source of metadata that empowers USCIS personnel to efficiently discover, understand, and leverage the agency's data assets for improved operational outcomes and informed decision-making.
                </Typography>
              </Box>
              
              <Box 
                sx={{
                  p: 3,
                  mb: 4,
                  backgroundColor: '#e6f7ff',
                  borderLeft: '4px solid #003366',
                  borderRadius: '4px'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                  Vision Statement
                </Typography>
                <Typography>
                  To transform USCIS into a data-driven organization where all stakeholders can seamlessly access accurate, consistent metadata to enhance data quality, promote reuse, and foster innovation while ensuring security and compliance with federal regulations.
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Strategic Objectives
              </Typography>
              
              <Box component="ul" sx={{ pl: 3 }}>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Improve Data Discovery:</strong> Enable users to quickly find relevant data assets across the enterprise through intuitive search and navigation capabilities.</Typography>
                </Box>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Enhance Data Understanding:</strong> Provide comprehensive context for data assets including definitions, relationships, quality metrics, and usage guidelines.</Typography>
                </Box>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Strengthen Data Governance:</strong> Establish and enforce consistent policies, standards, and procedures for data management across USCIS.</Typography>
                </Box>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Support Regulatory Compliance:</strong> Maintain documentation and traceability to demonstrate adherence to federal data regulations and security requirements.</Typography>
                </Box>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Promote Data Reuse:</strong> Reduce redundancy and inconsistency by making existing data assets visible and accessible to all authorized users.</Typography>
                </Box>
                <Box component="li" sx={{ mb: 2 }}>
                  <Typography><strong>Enable Data-Driven Decision Making:</strong> Provide the metadata foundation necessary for advanced analytics and reporting capabilities.</Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Guiding Principles
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      borderTop: '4px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      User-Centered Design
                    </Typography>
                    <Typography variant="body2">
                      The platform is designed around user needs, with intuitive interfaces and workflows that accommodate both technical and non-technical users.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      borderTop: '4px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      Enterprise Perspective
                    </Typography>
                    <Typography variant="body2">
                      Decisions about metadata management prioritize the needs of the entire organization over those of individual departments or systems.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      borderTop: '4px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      Data as an Asset
                    </Typography>
                    <Typography variant="body2">
                      Data is treated as a valuable organizational asset that requires proper documentation, management, and protection throughout its lifecycle.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      borderTop: '4px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      Continuous Improvement
                    </Typography>
                    <Typography variant="body2">
                      The platform evolves based on user feedback, emerging requirements, and technological advancements to maintain its relevance and effectiveness.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Tab 2: History & Development */}
            <TabPanel value={tabValue} index={2} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                History & Development of E-Unify
              </Typography>
              
              <Typography paragraph>
                E-Unify has evolved through multiple phases of development to become USCIS's comprehensive metadata management platform. Below is a timeline of key milestones in its evolution.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                  <Table aria-label="E-Unify development timeline">
                    <TableHead sx={{ backgroundColor: '#003366' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Year</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phase</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Key Developments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>2019</TableCell>
                        <TableCell>Planning & Research</TableCell>
                        <TableCell>
                          <Typography variant="body2">Initial assessment of metadata management needs across USCIS. Market research and evaluation of potential platforms. Business case development and funding approval.</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2020</TableCell>
                        <TableCell>Pilot Implementation</TableCell>
                        <TableCell>
                          <Typography variant="body2">Limited rollout with core business glossary functionality. Integration with key data systems. Initial user testing and feedback collection.</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2021</TableCell>
                        <TableCell>Platform Expansion</TableCell>
                        <TableCell>
                          <Typography variant="body2">Addition of data catalog capabilities. Development of data lineage visualization. Improved search functionality and user interface based on pilot feedback.</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2022</TableCell>
                        <TableCell>Enterprise Adoption</TableCell>
                        <TableCell>
                          <Typography variant="body2">Full agency rollout. Integration with additional enterprise systems. Implementation of role-based access controls. Introduction of policy management features.</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023</TableCell>
                        <TableCell>Feature Enhancement</TableCell>
                        <TableCell>
                          <Typography variant="body2">Advanced workflow automation. Data quality monitoring capabilities. Expanded reporting and analytics. Mobile-responsive design implementation.</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-2025</TableCell>
                        <TableCell>Continuous Evolution</TableCell>
                        <TableCell>
                          <Typography variant="body2">Implementation of AI-assisted metadata suggestions. Enhanced integration capabilities. Improved compliance monitoring tools. Section 508 accessibility enhancements.</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Development Methodology
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderLeft: '4px solid #003366',
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      Agile Development
                    </Typography>
                    <Typography paragraph>
                      E-Unify was developed using Agile methodologies with 2-week sprints. This iterative approach allowed for regular stakeholder feedback and continuous refinement of features based on user needs.
                    </Typography>
                    <Typography variant="body2">
                      Key practices included:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Regular sprint reviews with stakeholders</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Continuous integration and deployment</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>User story-driven development</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Cross-functional development teams</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderLeft: '4px solid #003366',
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#003366' }}>
                      User-Centered Design
                    </Typography>
                    <Typography paragraph>
                      Throughout development, E-Unify maintained a strong focus on user-centered design principles to ensure the platform was intuitive and effective for diverse user roles.
                    </Typography>
                    <Typography variant="body2">
                      Design practices included:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>User research and persona development</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Usability testing throughout development</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Accessibility considerations from day one</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Iterative refinement based on user feedback</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Key Implementation Challenges
              </Typography>
              
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mt: 2,
                  backgroundColor: '#f8f8f8',
                }}
              >
                <Typography paragraph>
                  The implementation of E-Unify across USCIS required overcoming several significant challenges:
                </Typography>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                  Technical Challenges
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>System Integration:</strong> Connecting with numerous legacy systems using diverse technologies</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Data Volume:</strong> Managing metadata for millions of data elements across the organization</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Performance:</strong> Ensuring responsive search and navigation with large metadata repositories</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Security:</strong> Implementing robust security while maintaining accessibility</Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                  Organizational Challenges
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Change Management:</strong> Facilitating adoption across diverse departments</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Metadata Governance:</strong> Establishing standards and ownership</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Training:</strong> Educating users with varied technical backgrounds</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography><strong>Resource Allocation:</strong> Balancing development priorities with limited resources</Typography>
                  </Box>
                </Box>
                
                <Typography paragraph sx={{ mt: 2 }}>
                  Despite these challenges, the development team implemented mitigation strategies including phased rollout, comprehensive user training, regular stakeholder engagement, and adaptive development practices to ensure successful platform adoption across USCIS.
                </Typography>
              </Paper>
            </TabPanel>

            {/* Tab 3: Team & Organization */}
            <TabPanel value={tabValue} index={3} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Team & Organization
              </Typography>
              
              <Typography paragraph>
                The E-Unify platform is supported by a dedicated team of professionals organized across multiple disciplines. Our organizational structure ensures comprehensive governance, development support, and stakeholder engagement.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: '#003366', fontWeight: 600 }}>
                Organizational Structure
              </Typography>
              
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderTop: '6px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                        Leadership & Oversight
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        <Box component="li" sx={{ mb: 1 }}>
                          <Typography><strong>Executive Sponsor:</strong> USCIS Chief Data Officer</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <Typography><strong>Program Director:</strong> Metadata Governance Lead</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <Typography><strong>Technical Lead:</strong> Enterprise Architect</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                          <Typography><strong>Advisory Board:</strong> Cross-functional directors</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderTop: '6px solid #003366',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                      Operational Teams
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography><strong>Metadata Stewards:</strong> Subject matter experts from each business domain</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography><strong>Development Team:</strong> Software engineers and UX designers</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography><strong>Data Governance Council:</strong> Cross-functional data policy group</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography><strong>Training & Adoption:</strong> Change management specialists</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Governance Structure
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderLeft: '4px solid #B31B1B'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#B31B1B' }}>
                      Strategic Governance
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Data Executive Board</strong> - Approves enterprise metadata standards</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Metadata Steering Committee</strong> - Sets strategic direction</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Budget & Resource Planning</strong> - Ensures program sustainability</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderLeft: '4px solid #003366'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#003366' }}>
                      Tactical Governance
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Domain Working Groups</strong> - Specialized domain expertise</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Metadata Standards Group</strong> - Develops data element definitions</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Technical Architecture Team</strong> - Integration standards and APIs</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Key Team Roles
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                        Data Stewards
                      </Typography>
                      <Typography variant="body2">
                        Subject matter experts responsible for ensuring metadata quality within their business domains.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                        Platform Engineers
                      </Typography>
                      <Typography variant="body2">
                        Technical specialists responsible for E-Unify's infrastructure, performance, and integrations.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                        Data Architects
                      </Typography>
                      <Typography variant="body2">
                        Experts who design metadata models, taxonomies, and relationship structures.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                        Training Specialists
                      </Typography>
                      <Typography variant="body2">
                        Educators who develop learning materials and conduct training on metadata practices.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Tab 4: Security & Compliance */}
            <TabPanel value={tabValue} index={4} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Security & Compliance
              </Typography>
              
              <Typography paragraph>
                Security and compliance are foundational principles of the E-Unify platform, ensuring protection of sensitive USCIS data while maintaining regulatory alignment.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }}>
                Security Framework
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ bgcolor: '#003366', p: 2, display: 'flex', alignItems: 'center' }}>
                      <SearchIcon sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        Enhanced Discoverability
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography variant="body2">
                        Implement powerful search capabilities and intuitive navigation to reduce the time spent locating relevant data assets by 50% by the end of 2025.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ bgcolor: '#003366', p: 2, display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        Organization-wide Adoption
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography variant="body2">
                        Achieve 90% active usage across all USCIS directorates through comprehensive training, intuitive interfaces, and demonstrated value in daily workflows.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ bgcolor: '#003366', p: 2, display: 'flex', alignItems: 'center' }}>
                      <SwapHorizIcon sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        System Integration
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography variant="body2">
                        Connect with all critical USCIS systems and data repositories, creating a comprehensive network of metadata that spans the entire data ecosystem.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ bgcolor: '#003366', p: 2, display: 'flex', alignItems: 'center' }}>
                      <VerifiedUserIcon sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        Data Quality Improvement
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography variant="body2">
                        Leverage metadata management to drive measurable improvements in data quality, with comprehensive metrics tracking accuracy, completeness, and consistency.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Alignment with USCIS Strategic Goals
              </Typography>
              
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <GavelIcon sx={{ color: '#003366', mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                          Strengthening the Security and Integrity of the Immigration System
                        </Typography>
                        <Typography variant="body2" paragraph>
                          E-Unify supports this goal by ensuring data quality and accessibility, enabling more accurate verification and vetting processes through standardized metadata and data lineage tracking.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <SpeedIcon sx={{ color: '#003366', mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                          Improving Operational Efficiency
                        </Typography>
                        <Typography variant="body2" paragraph>
                          By providing clear data definitions, ownership, and relationships, E-Unify reduces duplicative efforts, streamlines data access, and enables more efficient analysis and decision-making processes.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <PeopleIcon sx={{ color: '#003366', mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                          Enhancing Customer Experience
                        </Typography>
                        <Typography variant="body2" paragraph>
                          E-Unify improves customer experience indirectly by enabling USCIS staff to access accurate data quickly, resulting in more responsive service, consistent information across touchpoints, and reduced processing times.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* Tab 3: Team & Organization */}
            <TabPanel value={tabValue} index={3} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Team & Organization
              </Typography>
              
              <Typography paragraph>
                The E-Unify platform is supported by a dedicated team of professionals committed to delivering enterprise metadata management excellence. Our organizational structure ensures comprehensive coverage of technical development, user experience, training, and governance.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#003366', fontWeight: 600 }}>
                Organizational Structure
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6} lg={3}>
                  <Card elevation={3} sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#003366', mb: 1 }}>
                          <SupervisorAccountIcon />
                        </Avatar>
                        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                          Executive Leadership
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Strategic direction and resource allocation for the E-Unify platform, ensuring alignment with USCIS objectives.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
                        Key Responsibilities:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Strategic planning</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Cross-agency coordination</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Budget oversight</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Performance accountability</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card elevation={3} sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#003366', mb: 1 }}>
                          <DeveloperModeIcon />
                        </Avatar>
                        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                          Technical Team
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Engineers and developers responsible for platform functionality, integrations, and technical architecture.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
                        Key Responsibilities:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Platform development</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">System integrations</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Performance optimization</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Security implementation</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card elevation={3} sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#003366', mb: 1 }}>
                          <PeopleIcon />
                        </Avatar>
                        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                          User Experience
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Design and usability specialists focused on creating an intuitive, accessible interface for all users.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
                        Key Responsibilities:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Interface design</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Accessibility compliance</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Usability testing</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">User research</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card elevation={3} sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#003366', mb: 1 }}>
                          <SchoolIcon />
                        </Avatar>
                        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                          Training & Support
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Specialists dedicated to user onboarding, ongoing education, and responsive support services.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
                        Key Responsibilities:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Training development</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Help desk support</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">Documentation</Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">User community management</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#003366', fontWeight: 600 }}>
                Governance Structure
              </Typography>
              
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 2 }}>
                      Executive Steering Committee
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Senior leaders from across USCIS who provide strategic guidance and resource prioritization for the E-Unify platform. The committee meets quarterly to review progress and set direction.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Members include:</strong> Chief Data Officer, CIO, representatives from major operational directorates, and key business stakeholders.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 2 }}>
                      Metadata Governance Council
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Cross-functional team responsible for metadata standards, quality controls, and organizational adoption. The council meets monthly to address ongoing governance needs.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Members include:</strong> Data stewards, business analysts, technical leads, and subject matter experts from key operational areas.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 2 }}>
                      Governance Framework
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            <PolicyIcon fontSize="small" sx={{ mr: 1, color: '#003366', verticalAlign: 'middle' }} />
                            Policies & Standards
                          </Typography>
                          <Typography variant="body2">
                            Formalized rules and guidelines governing metadata management and platform usage.
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            <AssignmentIcon fontSize="small" sx={{ mr: 1, color: '#003366', verticalAlign: 'middle' }} />
                            Roles & Responsibilities
                          </Typography>
                          <Typography variant="body2">
                            Clearly defined ownership and accountability for metadata quality and management.
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            <FactCheckIcon fontSize="small" sx={{ mr: 1, color: '#003366', verticalAlign: 'middle' }} />
                            Quality Controls
                          </Typography>
                          <Typography variant="body2">
                            Processes and metrics to ensure metadata accuracy, completeness, and consistency.
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            <TimelineIcon fontSize="small" sx={{ mr: 1, color: '#003366', verticalAlign: 'middle' }} />
                            Change Management
                          </Typography>
                          <Typography variant="body2">
                            Structured approach to transitions in metadata definitions, relationships, and platform features.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#003366', fontWeight: 600 }}>
                Collaboration with Stakeholders
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                      Cross-Directorate Engagement
                    </Typography>
                    <Typography variant="body2" paragraph>
                      The E-Unify team works closely with representatives from all USCIS directorates to ensure the platform meets diverse operational needs. Regular engagement sessions include:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Quarterly stakeholder reviews</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Monthly user group meetings</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Embedded liaison officers in key directorates</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Feedback collection through surveys and interviews</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>
                      External Partnerships
                    </Typography>
                    <Typography variant="body2" paragraph>
                      The team maintains strategic partnerships to enhance platform capabilities and ensure alignment with broader government standards:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">DHS Data Management Working Group</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Federal CDO Council</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Industry standards bodies</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">Technology vendor collaborations</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 4: Security & Compliance */}
            <TabPanel value={tabValue} index={4} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Security & Compliance
              </Typography>
              
              <Typography paragraph>
                E-Unify adheres to the highest standards of security and compliance in accordance with federal regulations and USCIS policies. Our comprehensive approach ensures data protection, privacy, and regulatory compliance.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#003366', fontWeight: 600 }}>
                Security Framework
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <ShieldIcon sx={{ color: '#003366', mr: 2, fontSize: 36 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                          Access Control & Authentication
                        </Typography>
                        <Typography variant="body2" paragraph>
                          E-Unify implements a robust role-based access control (RBAC) system that ensures users can only access metadata and features appropriate to their role and responsibilities.
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Multi-factor authentication</strong> required for all users</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Integration with USCIS Identity Management System</strong> for centralized access control</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Granular permission settings</strong> at the community, domain, and asset levels</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Regular access reviews</strong> to ensure proper authorization</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LockIcon sx={{ color: '#003366', mr: 2, fontSize: 36 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                          Data Protection & Encryption
                        </Typography>
                        <Typography variant="body2" paragraph>
                          All data within E-Unify is protected through comprehensive encryption and security measures that meet federal standards for data protection.
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Encryption at rest</strong> for all stored metadata</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>TLS 1.3 encryption</strong> for all data in transit</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Secure API endpoints</strong> with strict authentication requirements</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Regular security assessments</strong> including penetration testing</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <VisibilityIcon sx={{ color: '#003366', mr: 2, fontSize: 36 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                          Monitoring & Auditing
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Comprehensive monitoring and auditing capabilities track all user activities and system changes to ensure accountability and enable incident investigation.
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Complete audit trails</strong> of all metadata changes</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>User activity logging</strong> for security monitoring</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Automated alerts</strong> for suspicious activities</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Retention policies</strong> aligned with federal requirements</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%', borderLeft: '4px solid #003366' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <SecurityUpdateIcon sx={{ color: '#003366', mr: 2, fontSize: 36 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                          Vulnerability Management
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Proactive identification and remediation of security vulnerabilities ensures the ongoing protection of the E-Unify platform and its data.
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Regular security scanning</strong> of all platform components</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Prioritized vulnerability remediation</strong> based on risk assessment</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Scheduled patching</strong> with minimal service disruption</Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>Secure development practices</strong> including code review and testing</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#003366', fontWeight: 600 }}>
                Regulatory Compliance
              </Typography>
              
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 70, height: 70, bgcolor: '#003366', mx: 'auto', mb: 2 }}>
                        <PolicyIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                        Federal Requirements
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>FISMA compliance</strong> with continuous monitoring</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>NIST 800-53</strong> security controls implementation</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>FedRAMP</strong> security assessment framework</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Section 508 compliance</strong> for accessibility</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 70, height: 70, bgcolor: '#003366', mx: 'auto', mb: 2 }}>
                        <GavelIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                        Privacy Regulations
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Privacy Act of 1974</strong> requirements</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>E-Government Act</strong> Privacy Impact Assessments</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>OMB Circular A-130</strong> privacy provisions</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>DHS Privacy Policy</strong> directives</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 70, height: 70, bgcolor: '#003366', mx: 'auto', mb: 2 }}>
                        <FactCheckIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                        Certification & Authorization
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Authority to Operate (ATO)</strong> certification</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Annual security assessments</strong> and recertification</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Continuous monitoring</strong> program</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography variant="body2"><strong>Plan of Action & Milestones (POA&M)</strong> tracking</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#003366', fontWeight: 600 }}>
                Data Governance Controls
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge
                          color="primary"
                          badgeContent="1"
                          sx={{ '& .MuiBadge-badge': { bgcolor: '#003366', color: 'white' } }}
                        >
                          <Avatar sx={{ bgcolor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                            <ManageAccountsIcon />
                          </Avatar>
                        </Badge>
                        <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 600 }}>
                          Data Ownership
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Clear assignment of data owners and stewards responsible for metadata quality and governance enforcement.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge
                          color="primary"
                          badgeContent="2"
                          sx={{ '& .MuiBadge-badge': { bgcolor: '#003366', color: 'white' } }}
                        >
                          <Avatar sx={{ bgcolor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                            <CategoryIcon />
                          </Avatar>
                        </Badge>
                        <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 600 }}>
                          Classification
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Metadata tagging for sensitivity level, protection requirements, and handling procedures.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge
                          color="primary"
                          badgeContent="3"
                          sx={{ '& .MuiBadge-badge': { bgcolor: '#003366', color: 'white' } }}
                        >
                          <Avatar sx={{ bgcolor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                            <HistoryIcon />
                          </Avatar>
                        </Badge>
                        <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 600 }}>
                          Lineage Tracking
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        End-to-end data flow visualization showing origins, transformations, and dependencies for compliance verification.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge
                          color="primary"
                          badgeContent="4"
                          sx={{ '& .MuiBadge-badge': { bgcolor: '#003366', color: 'white' } }}
                        >
                          <Avatar sx={{ bgcolor: 'rgba(0, 51, 102, 0.1)', color: '#003366' }}>
                            <AssignmentTurnedInIcon />
                          </Avatar>
                        </Badge>
                        <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 600 }}>
                          Compliance Reporting
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Automated compliance reporting capabilities for audit readiness and regulatory requirements.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Tab 5: FAQ */}
            <TabPanel value={tabValue} index={5} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Frequently Asked Questions
              </Typography>
              
              <Typography paragraph>
                Find answers to common questions about E-Unify's features, access, and support. If you don't see your question answered below, please contact the E-Unify support team.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                  General Questions
                </Typography>
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography sx={{ fontWeight: 500 }}>What is E-Unify?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      E-Unify is USCIS's enterprise metadata management platform that provides a single source of truth for data assets across the organization. It serves as a comprehensive solution for data discovery, understanding, and governance.
                    </Typography>
                    <Typography>
                      Key capabilities include:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Business glossary for standardized terminology</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Data catalog for asset discovery</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Data lineage visualization</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Policy management</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Workflow automation</Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography sx={{ fontWeight: 500 }}>How do I get access to E-Unify?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>
                      Access to E-Unify is role-based and managed through the agency's identity management system. To request access:
                    </Typography>
                    <Box component="ol" sx={{ pl: 3 }}>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Complete the E-Unify Access Request Form available on the USCIS intranet</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Include your required role(s) and business justification</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Obtain supervisor approval</Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 1 }}>
                        <Typography>Submit to the E-Unify administrator at <MuiLink href="mailto:eunify-admin@uscis.dhs.gov">eunify-admin@uscis.dhs.gov</MuiLink></Typography>
                      </Box>
                    </Box>
                    <Typography paragraph sx={{ mt: 2 }}>
                      Access approval typically takes 3-5 business days. Training may be required depending on your assigned role.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;

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
  Button
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  QuestionAnswer as QuestionAnswerIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Menu as MenuIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Function to handle tab changes with keyboard accessibility
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
      <Grid container spacing={3}>
        {/* Side Navigation - Hidden on mobile unless expanded */}
        <Grid item xs={12} md={3}>
          <Collapse in={!isMobile || showMobileMenu} id="mobile-sidenav">
            <Paper 
              elevation={3} 
              sx={{ 
                mb: { xs: 2, md: 0 },
                '.MuiListItemButton-root.Mui-selected': {
                  backgroundColor: 'rgba(0, 51, 102, 0.1)',
                  borderRight: '4px solid #003366',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 51, 102, 0.15)',
                  }
                }
              }}
            >
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
        <Grid item xs={12} md={9}>
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

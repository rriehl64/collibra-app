import React, { useState, useEffect } from 'react';
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
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  DataObject as DataObjectIcon,
  Storage as StorageIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  FindInPage as FindInPageIcon,
  ImportExport as ImportExportIcon,
  History as HistoryIcon,
  Launch as LaunchIcon,
  DataUsage as DataUsageIcon,
  Archive as ArchiveIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AutoGraph as AutoGraphIcon,
  Architecture as ArchitectureIcon,
  Cloud as CloudIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  DeviceHub as DeviceHubIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ChevronRight as ChevronRightIcon,
  Memory as MemoryIcon,
  Dns as DnsIcon,
  ViewTimeline as ViewTimelineIcon,
  Star as StarIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Circle as CircleIcon,
  Person as PersonIcon,
  DocumentScanner as DocumentScannerIcon,
  Dashboard as DashboardIcon,
  Equalizer as EqualizerIcon,
  QueryStats as QueryStatsIcon,
  WorkHistory as WorkHistoryIcon,
  CloudSync as CloudSyncIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Gavel as GavelIcon,
  Article as ArticleIcon,
  VerifiedUser as VerifiedUserIcon,
  FilterAlt as FilterAltIcon,
  ViewWeek as ViewWeekIcon,
  AutoAwesome as AutoAwesomeIcon,
  RocketLaunch as RocketLaunchIcon,
  Engineering as EngineeringIcon,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  Layers as LayersIcon,
  DesignServices as DesignServicesIcon,
  Groups as GroupsIcon,
  EventNote as EventNoteIcon,
  HourglassTop as HourglassTopIcon,
  HourglassEmpty as HourglassEmptyIcon,
  DoNotDisturb as DoNotDisturbIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  MenuBook as MenuBookIcon,
  VideoLibrary as VideoLibraryIcon,
  IntegrationInstructions as IntegrationInstructionsIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  Event as EventIcon,
  OndemandVideo as OndemandVideoIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  EmojiEvents as EmojiEventsIcon,
  Support as SupportIcon,
  SupportAgent as SupportAgentIcon,
  Call as CallIcon,
  Email as EmailIcon,
  BugReport as BugReportIcon,
  ArrowForward as ArrowForwardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  // Optional label for accessibility
  label?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, label, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`npd-tabpanel-${index}`}
      aria-labelledby={`npd-tab-${index}`}
      aria-label={label ? `${label} content` : undefined}
      tabIndex={value === index ? 0 : -1}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {label && <Typography sx={{ position: 'absolute', width: '1px', height: '1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }} id={`tabpanel-heading-${index}`}>{label}</Typography>}
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `npd-tab-${index}`,
    'aria-controls': `npd-tabpanel-${index}`,
  };
}

const NationalProductionDataset = () => {
  // State for tab management
  const [activeTab, setActiveTab] = useState(0);
  // State for mobile sidenav toggle
  const [showMobileSidenav, setShowMobileSidenav] = useState(false);
  // Ref for tab focus management
  const tabRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Define tab items for dynamic access and management
  const tabItems = [
    { label: 'Overview', icon: <HomeIcon /> },
    { label: 'Data Integration', icon: <ImportExportIcon /> },
    { label: 'System Architecture', icon: <ArchitectureIcon /> },
    { label: 'Governance', icon: <GavelIcon /> },
    { label: 'Key Metrics', icon: <QueryStatsIcon /> },
    { label: 'Development Timeline', icon: <ViewTimelineIcon /> },
    { label: 'Resources', icon: <MenuBookIcon /> }
  ];

  // Handle keyboard navigation for sidenav
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      
      const totalTabs = tabItems.length;
      let newIndex: number = index;
      
      if (event.key === 'ArrowUp') {
        newIndex = (index - 1 + totalTabs) % totalTabs;
      } else if (event.key === 'ArrowDown') {
        newIndex = (index + 1) % totalTabs;
      } else if (event.key === 'Home') {
        newIndex = 0;
      } else if (event.key === 'End') {
        newIndex = totalTabs - 1;
      }
      
      setActiveTab(newIndex);
      // Focus the newly selected tab
      if (tabRefs.current[newIndex]) {
        tabRefs.current[newIndex]?.focus();
      }
    }
  };
  
  const toggleMobileSidenav = () => {
    setShowMobileSidenav(prev => !prev);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      {/* Mobile Sidenav Toggle */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<MenuIcon />} 
          onClick={toggleMobileSidenav}
          aria-expanded={showMobileSidenav}
          aria-controls="npd-sidenav"
          aria-label="Toggle navigation menu"
          fullWidth
        >
          NPD Navigation
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Sidenav - Currently Hidden */}
        <Grid 
          item 
          xs={12} 
          md={3} 
          lg={2.5} 
          sx={{ 
            display: 'none', // Hidden for now
            mb: { xs: 2, md: 0 }
          }}
        >
          <Paper 
              sx={{ height: '100%' }}
              elevation={2}
              role="navigation"
              aria-label="NPD navigation sidebar"
              id="npd-sidenav"
            >
            <List 
              component="nav"
              aria-label="National Production Dataset navigation"
              sx={{ 
                borderRadius: 1,
                '& .MuiListItemButton-root': {
                  '&:focus-visible': {
                    outline: '2px solid #003366',
                    outlineOffset: '-2px',
                  },
                },
                '& .MuiListItemButton-root.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                },
              }}
            >
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      NPD Navigation
                    </Typography>
                  } 
                />
              </ListItem>
              <Divider />
              
              {/* Dynamically render tab items */}
              {tabItems.map((item, index) => (
                <ListItemButton 
                  key={`sidenav-tab-${index}`}
                  selected={activeTab === index}
                  onClick={() => setActiveTab(index)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, index)}
                  aria-current={activeTab === index ? 'page' : undefined}
                  ref={(el: HTMLDivElement | null) => (tabRefs.current[index] = el)}
                  tabIndex={activeTab === index ? 0 : -1}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-label={`${item.label} tab`}
                  id={`npd-sidenav-tab-${index}`}
                  aria-controls={`npd-tabpanel-${index}`}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Paper sx={{ mb: 4 }}>
            <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h4" gutterBottom>
                National Production Dataset (NPD)
              </Typography>
              <Typography variant="subtitle1">
                A central repository for integrated immigration case data across USCIS systems
              </Typography>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="National Production Dataset tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  my: 1, 
                  '& .MuiTab-root': {
                    minHeight: '56px',
                    py: 1.5
                  },
                  '& .MuiTab-root.Mui-selected': { 
                    color: 'primary.main',
                    fontWeight: 'bold'
                  } 
                }}
              >
                {tabItems.map((item, index) => (
                  <Tab 
                    key={`tab-${index}`}
                    label={item.label} 
                    icon={item.icon} 
                    iconPosition="start" 
                    {...a11yProps(index)}
                    aria-controls={`npd-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>
            
            {/* Tab Panels */}
            <Paper sx={{ p: 3 }}>
              <TabPanel value={activeTab} index={0} label={tabItems[0].label}>
                <Typography variant="h5" gutterBottom>
                  National Production Dataset (NPD) Overview
                </Typography>
                
                <Typography variant="body1" paragraph>
                  The National Production Dataset (NPD) serves as a central repository for information on both pending and completed immigration cases. 
                  Its primary function is to integrate data from a variety of key USCIS systems to promote seamless data sharing and timely decision-making across the agency.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                    <DataObjectIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Key NPD Capabilities
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Integration of multiple USCIS case management systems" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Centralized reporting on case volumes and adjudication rates" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Performance metrics across service centers and field offices" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Support for backlog reduction and workforce optimization" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Data-driven strategic planning and resource allocation" />
                    </ListItem>
                  </List>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
                    Data Integration and System Architecture
                  </Typography>
                  
                  <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    <StorageIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'secondary.main' }} />
                    Data Sources
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    NPD incorporates information collected from multiple systems that manage different aspects of case processing and benefits adjudication. Core contributors include:
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Benefits Mart" 
                        secondary="Primary source for adjudication data" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="eCISCOR" 
                        secondary="Enterprise data warehouse for case records" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="GLOBAL" 
                        secondary="Case management system data" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="C3, ELSIS, INFACT, CIS2, VIBE, NASS, RAILS, CPMS" 
                        secondary="Supporting systems providing specialized data" 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    <ArchiveIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'secondary.main' }} />
                    Database Environment
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    The dataset is maintained within a data lake architecture, primarily managed by the OIT/DBIS teams, ensuring scalability and efficient data retrieval.
                  </Typography>
                  
                  <Card sx={{ bgcolor: '#f8f9fa', mb: 2, mt: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Technical Architecture Highlights
                      </Typography>
                      <List dense>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Data lake design for flexible storage and analytics" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="ETL processes for data integration and standardization" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="OIT/DBIS-managed infrastructure" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Key Stakeholders
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table aria-label="NPD key stakeholders table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Entity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role/Contribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>OCDO</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Project management, data strategy, governance</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StorageIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>OIT/DBIS</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Technical development, maintenance (data lake)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>SCOPS</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Coordinates functional requirements and use</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>FOD</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Adds resources, supports operational use</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>OPQ</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Expands platform's analytical capabilities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PublicIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>USCIS Program Offices</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Policy and process input</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Operational Impact
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <FindInPageIcon />
                      </Avatar>
                      <Typography variant="h6">Case Management</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      NPD enables USCIS to report, track, and analyze case volumes, adjudication rates, and performance metrics across all service centers and field offices.
                    </Typography>
                    <Box sx={{ backgroundColor: '#f5f9ff', p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Impact:</strong> Improved case tracking and workload management
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <ImportExportIcon />
                      </Avatar>
                      <Typography variant="h6">Data Sharing</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Integrating disparate case management systems supports better information flow and collaboration between program offices, thereby improving customer service and operational efficiency.
                    </Typography>
                    <Box sx={{ backgroundColor: '#f5f9ff', p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Impact:</strong> Enhanced cross-functional collaboration and reduced data silos
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <AutoGraphIcon />
                      </Avatar>
                      <Typography variant="h6">Strategic Planning</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      The dataset is essential for ongoing efforts to reduce backlogs, optimize workforce allocation, and meet internal cycle time goals for case processing.
                    </Typography>
                    <Box sx={{ backgroundColor: '#f5f9ff', p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Impact:</strong> Data-driven resource allocation and performance improvement
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Recent Developments
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#f9f9f9' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      icon={<PeopleIcon />} 
                      label="Product Ownership Expansion" 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                  </Box>
                  <Typography variant="body2" paragraph>
                    In 2025, a new team was assembled to enhance NPD development and support, broadening the product ownership model.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      icon={<HistoryIcon />} 
                      label="Workforce Transition Program" 
                      sx={{ bgcolor: '#B31B1B', color: 'white', mr: 1 }} 
                    />
                  </Box>
                  <Typography variant="body2" paragraph>
                    In March 2025, workforce reductions were implemented, impacting the Product Owner team and overall staffing levels.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          <Box sx={{ mt: 4, bgcolor: '#f5f9ff', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom>
              Conclusion
            </Typography>
            <Typography variant="body1" paragraph>
              The National Production Dataset is a cornerstone of USCIS's modernization strategy, enabling improved data-driven decision-making and efficient case management through the integration of numerous core systems and interoffice collaboration.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                startIcon={<LaunchIcon />}
                component={Link}
                href="https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data"
                target="_blank"
                aria-label="Visit USCIS immigration and citizenship data page (opens in a new tab)"
              >
                USCIS Data Portal
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<StorageIcon />}
                component={Link}
                href="https://www.uscis.gov/about-us/organization/directorates-and-program-offices/service-center-operations-directorate"
                target="_blank"
                aria-label="Visit Service Center Operations Directorate page (opens in a new tab)"
              >
                SCOPS Information
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Data Integration Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>
            NPD Data Integration
          </Typography>
          
          <Typography variant="body1" paragraph>
            The National Production Dataset (NPD) brings together data from diverse USCIS systems into a cohesive platform,
            enabling unified reporting and analysis of immigration case data across the agency.
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Integration Architecture
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                    <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Data Flow Model
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    The NPD implements a hybrid ETL (Extract, Transform, Load) approach that combines batch processing with near-real-time data updates for critical systems:
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ImportExportIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Extraction" 
                        secondary="Scheduled extracts from source systems with varying frequencies (daily, weekly, or monthly) based on operational needs" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AutoGraphIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Transformation" 
                        secondary="Standardization of data formats, deduplication, and business rule application to ensure consistency" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArchiveIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Loading" 
                        secondary="Integration into the central data lake with appropriate partitioning and indexing for optimal query performance" 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', bgcolor: '#f5f9ff' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'secondary.main' }}>
                    <DataObjectIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Integration Challenges & Solutions
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ bgcolor: '#f8f9fa', mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="error" gutterBottom>
                            Challenges
                          </Typography>
                          <List dense>
                            <ListItem disableGutters>
                              <ListItemText primary="Inconsistent data formats across systems" />
                            </ListItem>
                            <ListItem disableGutters>
                              <ListItemText primary="Duplicate case records requiring resolution" />
                            </ListItem>
                            <ListItem disableGutters>
                              <ListItemText primary="Varying data refresh rates between systems" />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ bgcolor: '#f0f7ff', mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Solutions
                          </Typography>
                          <List dense>
                            <ListItem disableGutters>
                              <ListItemText primary="Common data model standardization" />
                            </ListItem>
                            <ListItem disableGutters>
                              <ListItemText primary="Master data management processes" />
                            </ListItem>
                            <ListItem disableGutters>
                              <ListItemText primary="Scheduled integration synchronization" />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">
                      <strong>Data Quality Management:</strong> The NPD integration process includes validation rules, quality checks, and data profiling to ensure data integrity and usability for reporting and analysis.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Source Systems Integration
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table aria-label="NPD source systems integration table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>System Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Data Provided</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Integration Method</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Update Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Benefits Mart</Typography>
                    </TableCell>
                    <TableCell>Case adjudication data, processing times</TableCell>
                    <TableCell>Direct database connection</TableCell>
                    <TableCell>
                      <Chip size="small" label="Daily" color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>eCISCOR</Typography>
                    </TableCell>
                    <TableCell>Enterprise case records, historical data</TableCell>
                    <TableCell>ETL process</TableCell>
                    <TableCell>
                      <Chip size="small" label="Daily" color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>GLOBAL</Typography>
                    </TableCell>
                    <TableCell>Case management workflow data</TableCell>
                    <TableCell>API integration</TableCell>
                    <TableCell>
                      <Chip size="small" label="Real-time" color="secondary" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>C3</Typography>
                    </TableCell>
                    <TableCell>Customer service interaction data</TableCell>
                    <TableCell>Data extract</TableCell>
                    <TableCell>
                      <Chip size="small" label="Weekly" sx={{ bgcolor: '#B31B1B', color: 'white' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>CPMS</Typography>
                    </TableCell>
                    <TableCell>Biometric and background check data</TableCell>
                    <TableCell>Secure file transfer</TableCell>
                    <TableCell>
                      <Chip size="small" label="Daily" color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Other Systems</Typography>
                      <Typography variant="caption">(ELSIS, INFACT, CIS2, VIBE, NASS, RAILS)</Typography>
                    </TableCell>
                    <TableCell>Specialized case information</TableCell>
                    <TableCell>Various methods</TableCell>
                    <TableCell>
                      <Chip size="small" label="Varies" color="default" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              Data Standardization
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      <ViewTimelineIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                      Common Data Model
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      The NPD implements a standardized data model that normalizes information from different source systems into consistent formats and structures.
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Unified case identifier system" secondary="Linking related records across systems" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Standardized status codes" secondary="Consistent representation of case stages" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Normalized date formats" secondary="Uniform temporal data representation" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                      Reference Data Management
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      To ensure consistency across data sources, NPD maintains a centralized repository of reference data that standardizes codes and taxonomies.
                    </Typography>
                    
                    <Box sx={{ bgcolor: '#f5f9ff', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Examples of Standardized Reference Data:</strong>
                      </Typography>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Form types and categories" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Processing centers and field offices" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Case status classification" />
                        </ListItem>
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, bgcolor: '#f0f7ff', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom>
              Data Integration Benefits
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, height: '100%', boxShadow: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Improved Data Consistency
                  </Typography>
                  <Typography variant="body2">
                    Single source of truth eliminates conflicting data from different systems, improving reporting accuracy.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, height: '100%', boxShadow: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Enhanced Analytical Capabilities
                  </Typography>
                  <Typography variant="body2">
                    Comprehensive data integration enables advanced analytics and insights across the entire case lifecycle.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, height: '100%', boxShadow: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Operational Efficiency
                  </Typography>
                  <Typography variant="body2">
                    Reduces manual data consolidation efforts and enables faster, more accurate decision-making across directorates.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* System Architecture Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>
            NPD System Architecture
          </Typography>
          
          <Typography variant="body1" paragraph>
            The National Production Dataset is built on a modern, scalable architecture designed to handle large volumes of immigration case data
            while ensuring security, reliability, and performance across the USCIS enterprise.
          </Typography>
          
          {/* High-Level Architecture */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <ArchitectureIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              High-Level Architecture
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }} variant="outlined">
              <Typography variant="body2" paragraph>
                The NPD system architecture follows a modern n-tier design with separate layers for data storage, processing, API services, and presentation.
                This separation of concerns enables independent scaling, enhanced security, and modular development.  
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%', bgcolor: '#f0f7ff', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                        <CloudIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Presentation Layer
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Web Portal Interface" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Reporting Dashboards" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Admin Console" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%', bgcolor: '#f0f7ff', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                        <SettingsEthernetIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Service Layer
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="RESTful APIs" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Authentication Services" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Business Logic" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%', bgcolor: '#f0f7ff', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                        <DeviceHubIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Processing Layer
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="ETL Pipelines" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Data Transformation" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Batch Processing" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%', bgcolor: '#f0f7ff', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                        <StorageIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Data Layer
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Data Lake" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Operational Database" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Data Warehouse" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          {/* Technical Components */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <DnsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Technical Infrastructure Components
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <StorageIcon />
                      </Avatar>
                      <Typography variant="h6">
                        Data Storage
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Enterprise-grade storage solutions optimized for both transactional processing and analytical workloads.
                    </Typography>
                    <Table size="small" aria-label="data storage technologies">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Primary Database</TableCell>
                          <TableCell>Oracle Enterprise</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Data Warehouse</TableCell>
                          <TableCell>Snowflake</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Data Lake</TableCell>
                          <TableCell>AWS S3 / Azure Data Lake</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Caching Layer</TableCell>
                          <TableCell>Redis Enterprise</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <MemoryIcon />
                      </Avatar>
                      <Typography variant="h6">
                        Compute Resources
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Scalable processing infrastructure deployed in FedRAMP-compliant government cloud environments.
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Containerized Microservices" 
                          secondary="Kubernetes orchestration for scalability and resilience" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Serverless Functions" 
                          secondary="Event-driven processing for ETL workflows" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="High-Performance Computing" 
                          secondary="For complex analytics and reporting tasks" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#B31B1B', mr: 2 }}>
                        <SecurityIcon />
                      </Avatar>
                      <Typography variant="h6">
                        Security Infrastructure
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Comprehensive security measures ensuring data protection and compliance with federal standards.
                    </Typography>
                    
                    <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Security Features
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Role-based Access" 
                            size="small" 
                            color="default"
                            sx={{ mb: 1, width: '100%' }} 
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Data Encryption" 
                            size="small" 
                            color="default"
                            sx={{ mb: 1, width: '100%' }} 
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Audit Logging" 
                            size="small" 
                            color="default"
                            sx={{ mb: 1, width: '100%' }} 
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="MFA" 
                            size="small" 
                            color="default"
                            sx={{ mb: 1, width: '100%' }} 
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Typography variant="body2">
                      <strong>Compliance:</strong> FISMA High, FedRAMP High, NIST 800-53
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* System Performance */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <SpeedIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              System Performance & Scalability
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: '#f0f7ff' }} variant="outlined">
              <Typography variant="body2" paragraph>
                The NPD architecture is designed to scale elastically to meet varying workload demands while maintaining consistent performance.
                Key performance metrics and scalability features include:
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Performance Benchmarks
                      </Typography>
                      
                      <TableContainer>
                        <Table size="small" aria-label="performance benchmarks">
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Query Response Time</TableCell>
                              <TableCell>95% of queries &lt; 3 seconds</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Dashboard Load Time</TableCell>
                              <TableCell>&lt; 5 seconds for complex dashboards</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>ETL Processing Window</TableCell>
                              <TableCell>4-hour SLA for daily full refresh</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Concurrent Users</TableCell>
                              <TableCell>Supports 500+ simultaneous users</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DataUsageIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Scalability Features
                      </Typography>
                      
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Horizontal Scaling" 
                            secondary="Dynamic addition of compute resources during peak periods" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Database Partitioning" 
                            secondary="Sharded data architecture for optimized query performance" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Intelligent Caching" 
                            secondary="Multi-level caching strategy for frequently accessed data" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Load Balancing" 
                            secondary="Automatic distribution of workloads across resources" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Disaster Recovery & High Availability
                </Typography>
                <Typography variant="body2">
                  The NPD system implements a comprehensive disaster recovery strategy with geographically distributed redundancy, 
                  automated failover mechanisms, and regular recovery testing. The architecture maintains 99.9% uptime SLA 
                  through multi-region deployment and continuous monitoring.
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          {/* Future Architecture */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Future Architectural Enhancements
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      AI/ML Capabilities
                    </Typography>
                    <Typography variant="body2">
                      Integration of machine learning models for predictive analytics, anomaly detection, and workload forecasting.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Event-Driven Architecture
                    </Typography>
                    <Typography variant="body2">
                      Enhanced real-time data processing through event streams and message brokers for improved system responsiveness.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      GraphQL API Layer
                    </Typography>
                    <Typography variant="body2">
                      Implementation of GraphQL for more flexible and efficient data queries and integrations with other USCIS systems.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Governance Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom>
            NPD Governance Framework
          </Typography>
          
          <Typography variant="body1" paragraph>
            The National Production Dataset operates under a comprehensive governance framework that ensures data quality, 
            accessibility, security, and compliance with federal regulations while supporting the agency's mission objectives.
          </Typography>
          
          {/* Governance Structure */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <AdminPanelSettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Governance Structure
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, bgcolor: '#f8f9fa' }} variant="outlined">
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                    Tiered Governance Model
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card sx={{ mb: 2, borderLeft: '4px solid', borderColor: '#003366' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            Executive Steering Committee
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Senior leadership providing strategic direction and resource allocation for the NPD program.
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label="Quarterly Meetings" 
                              variant="outlined" 
                              color="primary" 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption">8 Members</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%', borderLeft: '4px solid', borderColor: '#1976d2' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                            Data Governance Board
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Cross-functional team overseeing data standards, quality, and compliance.
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label="Monthly Meetings" 
                              variant="outlined" 
                              color="primary" 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption">15 Members</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%', borderLeft: '4px solid', borderColor: '#1976d2' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                            Technical Working Group
                          </Typography>
                          <Typography variant="body2" paragraph>
                            Subject matter experts handling day-to-day operations and technical implementation.
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label="Weekly Meetings" 
                              variant="outlined" 
                              color="primary" 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption">12 Members</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Key Roles & Responsibilities
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Chief Data Officer</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" paragraph>
                          Executive sponsor responsible for NPD strategic alignment with agency data strategy.
                        </Typography>
                        <List dense disablePadding>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Approves major design decisions" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Secures funding and resources" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Reports to USCIS leadership" />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">NPD Program Manager</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" paragraph>
                          Oversees day-to-day operations and implementation of the NPD program.
                        </Typography>
                        <List dense disablePadding>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Coordinates development teams" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Manages project timeline and scope" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Escalates issues to leadership" />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Data Stewards</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" paragraph>
                          Subject matter experts responsible for data quality and business rules within their domains.
                        </Typography>
                        <List dense disablePadding>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Define data standards" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Review data quality reports" />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Represent business units" />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Governance Processes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <FindInPageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Governance Processes
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Data Quality Management
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small" aria-label="data quality processes">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Process</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Frequency</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Owner</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Data Profiling</TableCell>
                            <TableCell>Daily</TableCell>
                            <TableCell>Data Engineering Team</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Quality Validation</TableCell>
                            <TableCell>Weekly</TableCell>
                            <TableCell>Data Stewards</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Reconciliation</TableCell>
                            <TableCell>Monthly</TableCell>
                            <TableCell>Quality Assurance</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Audit Review</TableCell>
                            <TableCell>Quarterly</TableCell>
                            <TableCell>Governance Board</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Typography variant="body2">
                      The NPD implements automated quality checks with defined thresholds for data completeness, accuracy, and consistency.
                      Any exceptions are tracked, documented, and resolved through a formal review process.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Change Management & Access Control
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Change Management Process
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2, overflow: 'auto' }}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1, 
                            bgcolor: '#e3f2fd', 
                            mr: 1,
                            minWidth: '110px',
                            border: '1px solid',
                            borderColor: 'primary.light'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                            Request
                          </Typography>
                        </Paper>
                        <Typography sx={{ lineHeight: '32px', mx: 1 }}>&rarr;</Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1, 
                            bgcolor: '#e3f2fd', 
                            mr: 1,
                            minWidth: '110px',
                            border: '1px solid',
                            borderColor: 'primary.light'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                            Review
                          </Typography>
                        </Paper>
                        <Typography sx={{ lineHeight: '32px', mx: 1 }}>&rarr;</Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1, 
                            bgcolor: '#e3f2fd', 
                            mr: 1,
                            minWidth: '110px',
                            border: '1px solid',
                            borderColor: 'primary.light'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                            Approval
                          </Typography>
                        </Paper>
                        <Typography sx={{ lineHeight: '32px', mx: 1 }}>&rarr;</Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1, 
                            bgcolor: '#e3f2fd', 
                            mr: 1,
                            minWidth: '110px',
                            border: '1px solid',
                            borderColor: 'primary.light'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                            Implementation
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Access Control Framework
                      </Typography>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Role-Based Access Control
                            </Typography>
                            <Typography variant="caption">
                              Access permissions assigned based on job functions and responsibilities
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Least Privilege Principle
                            </Typography>
                            <Typography variant="caption">
                              Users granted minimum access required for their duties
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Regular Certification
                            </Typography>
                            <Typography variant="caption">
                              Quarterly review and certification of all user access rights
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Access Monitoring
                            </Typography>
                            <Typography variant="caption">
                              Continuous monitoring and logging of all system access
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Compliance Framework */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Compliance & Policy Framework
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: '#f0f7ff' }} variant="outlined">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Regulatory Compliance
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Federal Information Security Management Act (FISMA)" 
                        secondary="Security controls and risk management" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Privacy Act of 1974" 
                        secondary="Protection of personally identifiable information" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="E-Government Act of 2002" 
                        secondary="Information sharing and transparency" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Federal Data Strategy" 
                        secondary="Data governance and management practices" 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Internal Policies
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="USCIS Data Governance Policy" 
                        secondary="Framework for data management" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="System Security Plan" 
                        secondary="Security controls and procedures" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Quality Standards" 
                        secondary="Data quality metrics and thresholds" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Access Policy" 
                        secondary="Access request and authorization procedures" 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Audit & Oversight
                  </Typography>
                  
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Regular Assessments
                      </Typography>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Annual security assessments" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Quarterly compliance reviews" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="External audit validation" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    startIcon={<LaunchIcon />}
                    aria-label="View latest compliance report"
                  >
                    View Latest Compliance Report
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Data Classification & Handling
                </Typography>
                <TableContainer>
                  <Table size="small" aria-label="data classification table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Classification Level</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Handling Requirements</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Public</TableCell>
                        <TableCell>Non-sensitive data cleared for public release</TableCell>
                        <TableCell>Standard protection controls</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>For Official Use Only</TableCell>
                        <TableCell>Non-sensitive but requiring limited distribution</TableCell>
                        <TableCell>Need-to-know basis access only</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Sensitive</TableCell>
                        <TableCell>Contains PII or other protected information</TableCell>
                        <TableCell>Encryption and strict access controls</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Box>
        </TabPanel>
        
        {/* Key Metrics Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" gutterBottom>
            NPD Key Performance Metrics
          </Typography>
          
          <Typography variant="body1" paragraph>
            The National Production Dataset's performance is continuously monitored through comprehensive metrics that track
            data quality, system performance, usage patterns, and business impact. These metrics drive ongoing improvements
            and demonstrate the value provided to the agency.
          </Typography>
          
          {/* Metrics Dashboard */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Key Performance Indicators
            </Typography>
            
            <Grid container spacing={3}>
              {/* Data Quality Metrics */}
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Data Quality
                      </Typography>
                      <DataUsageIcon fontSize="medium" color="primary" />
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Completeness:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>97.2%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Accuracy:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>99.1%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Timeliness:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>98.5%</Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                      Exceeds quality threshold targets
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* System Performance Metrics */}
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        System Performance
                      </Typography>
                      <SpeedIcon fontSize="medium" color="primary" />
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Avg Query Time:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>1.8 sec</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Uptime:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>99.98%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">ETL Processing:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>4.2 hrs</Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                      All metrics within SLA parameters
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Usage Metrics */}
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Usage Statistics
                      </Typography>
                      <PeopleIcon fontSize="medium" color="primary" />
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Active Users:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>1,240</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Daily Queries:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>42,500+</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Data Accessed:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>15.8 TB/day</Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}>
                      <ArrowUpwardIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                      12% increase in user adoption Q/Q
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Business Impact Metrics */}
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%', borderTop: '4px solid #003366' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Business Impact
                      </Typography>
                      <BusinessIcon fontSize="medium" color="primary" />
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Time Saved:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>24,600 hrs/mo</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Cost Savings:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>$2.4M/year</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Process Efficiency:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>+32%</Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                      ROI exceeds original projections
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Metrics Over Time */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <AnalyticsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Metrics Trends & Analysis
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Performance Trends (Last 12 Months)
                </Typography>
              </Box>
              
              <Box sx={{ height: '300px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  [Performance metrics visualization would appear here]
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Data Processing Volume</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpwardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">34% increase YoY</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Query Response Time</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowDownwardIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">18% faster YoY</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>System Incidents</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowDownwardIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">42% reduction YoY</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Data Quality Index</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpwardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">7.8% improvement YoY</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }} variant="outlined">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    System Usage by Directorate
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small" aria-label="system usage by directorate">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Directorate</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Users</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Daily Queries</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>% of Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Field Operations</TableCell>
                          <TableCell align="right">485</TableCell>
                          <TableCell align="right">15,750</TableCell>
                          <TableCell align="right">37%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Service Center Operations</TableCell>
                          <TableCell align="right">328</TableCell>
                          <TableCell align="right">12,320</TableCell>
                          <TableCell align="right">29%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Refugee, Asylum & Int'l Operations</TableCell>
                          <TableCell align="right">206</TableCell>
                          <TableCell align="right">8,450</TableCell>
                          <TableCell align="right">20%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Fraud Detection & National Security</TableCell>
                          <TableCell align="right">145</TableCell>
                          <TableCell align="right">4,240</TableCell>
                          <TableCell align="right">10%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Other Directorates</TableCell>
                          <TableCell align="right">76</TableCell>
                          <TableCell align="right">1,740</TableCell>
                          <TableCell align="right">4%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Top 5 Most Used Data Elements
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" aria-label="most used data elements">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data Element</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Access Frequency</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Receipt Number</TableCell>
                          <TableCell>Case Identifiers</TableCell>
                          <TableCell align="right">14,320/day</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>A-Number</TableCell>
                          <TableCell>Applicant Identifiers</TableCell>
                          <TableCell align="right">12,840/day</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Case Status</TableCell>
                          <TableCell>Case Processing</TableCell>
                          <TableCell align="right">9,750/day</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Processing Time</TableCell>
                          <TableCell>Performance Metrics</TableCell>
                          <TableCell align="right">8,460/day</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Form Type</TableCell>
                          <TableCell>Case Categorization</TableCell>
                          <TableCell align="right">7,920/day</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          {/* Data Volume Metrics */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Data Volume & Growth
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Current Data Volume
                    </Typography>
                    
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>248 TB</Typography>
                      <Typography variant="body2" color="text.secondary">Total data managed</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ChevronRightIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="187 billion records" 
                          secondary="Across all integrated systems" 
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ChevronRightIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="42 source systems" 
                          secondary="Contributing data elements" 
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ChevronRightIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="15+ years" 
                          secondary="Of historical data" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Growth Projections
                    </Typography>
                    
                    <TableContainer sx={{ mb: 2 }}>
                      <Table size="small" aria-label="growth projections">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Projected Size</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Growth</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Current</TableCell>
                            <TableCell align="right">248 TB</TableCell>
                            <TableCell align="right">-</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Year 1</TableCell>
                            <TableCell align="right">312 TB</TableCell>
                            <TableCell align="right">+26%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Year 2</TableCell>
                            <TableCell align="right">410 TB</TableCell>
                            <TableCell align="right">+31%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Year 3</TableCell>
                            <TableCell align="right">580 TB</TableCell>
                            <TableCell align="right">+41%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Typography variant="body2">
                      Growth projections account for additional data sources, increased granularity, and expanded historical coverage.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Capacity Planning
                    </Typography>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Infrastructure Scaling Strategy
                      </Typography>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Elastic storage architecture" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Automated tiering for cost efficiency" />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Quarterly capacity reviews" />
                        </ListItem>
                      </List>
                    </Box>
                    
                    <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="body2" paragraph sx={{ fontWeight: 'medium' }}>
                        Current Utilization: 72%
                      </Typography>
                      <Typography variant="body2">
                        Next scheduled infrastructure expansion: Q1 2026
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Development Timeline Tab */}
        <TabPanel value={activeTab} index={5}>
          <Typography variant="h5" gutterBottom>
            NPD Development Timeline
          </Typography>
          
          <Typography variant="body1" paragraph>
            The National Production Dataset represents a multi-phase development initiative delivering enhanced data capabilities 
            to USCIS. This timeline outlines completed milestones, current activities, and planned future enhancements.
          </Typography>
          
          {/* Timeline Overview */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 1, 
              bgcolor: '#f0f7ff',
              border: '1px solid',
              borderColor: 'primary.light'
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm="auto">
                  <Box sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    p: 1.5,
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ViewTimelineIcon fontSize="large" />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" gutterBottom>
                    Project Duration
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Start Date
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          January 2020
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Phase
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          <Chip 
                            size="small" 
                            label="Phase 3: Enhanced Analytics" 
                            color="primary" 
                            sx={{ fontWeight: 'medium' }}
                          />
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Final Delivery
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          December 2026 (Projected)
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            
            {/* Timeline Progress */}
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ 
                height: 8, 
                bgcolor: '#e0e0e0', 
                borderRadius: 5, 
                mb: 1, 
                position: 'relative' 
              }}>
                <Box sx={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: 0, 
                  height: '100%', 
                  width: '55%', 
                  bgcolor: 'primary.main', 
                  borderRadius: 5 
                }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">Phase 1</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'primary.main' }}>55% Complete</Typography>
                <Typography variant="caption" color="text.secondary">Phase 5</Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Project Phases */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Project Phases and Key Milestones
            </Typography>
            
            {/* Phase 1 - Foundation */}
            <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#003366', 
                    color: 'white',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  1
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Phase 1: Foundation
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Completed" 
                      color="success" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    January 2020 - June 2021
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Established the core infrastructure and initial data integration framework for the National Production Dataset.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Deliverables
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Core infrastructure provisioning" 
                            secondary="March 2020"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Initial data model development" 
                            secondary="July 2020"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="ETL framework implementation" 
                            secondary="November 2020"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Initial integration with 5 source systems" 
                            secondary="April 2021"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Achievements
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <StarIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="ATO certification obtained" 
                            secondary="Authority to Operate - February 2021"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <StarIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Beta release to 50 pilot users" 
                            secondary="June 2021"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
            
            {/* Phase 2 - Expansion */}
            <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#003366', 
                    color: 'white',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  2
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Phase 2: Expansion
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Completed" 
                      color="success" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    July 2021 - December 2022
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Expanded the data sources, enhanced the data model, and released the production version to a wider user base.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Deliverables
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Integration with 15 additional systems" 
                            secondary="October 2021"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Enhanced security framework implementation" 
                            secondary="January 2022"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Basic reporting capabilities" 
                            secondary="April 2022"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Historical data backloading (10 years)" 
                            secondary="August 2022"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Achievements
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <StarIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Full production release - 500 users" 
                            secondary="June 2022"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <StarIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Director's Innovation Award" 
                            secondary="December 2022"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
            
            {/* Phase 3 - Analytics */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  3
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Phase 3: Enhanced Analytics
                    </Typography>
                    <Chip 
                      size="small" 
                      label="In Progress" 
                      color="primary" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    January 2023 - December 2024 (Current Phase)
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Adding advanced analytics capabilities, improving data visualization, and expanding system capacity for greater usage.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Deliverables
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Interactive dashboarding capability" 
                            secondary="May 2023"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Integration with 15 more systems (35 total)" 
                            secondary="November 2023"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Advanced analytics module deployment" 
                            secondary="October 2024 (Planned)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Self-service reporting tools" 
                            secondary="December 2024 (Planned)"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Current Status
                        </Typography>
                        <List dense disablePadding>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CircleIcon sx={{ fontSize: '0.8rem', color: 'success.main' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Major milestone completion" 
                              secondary="57%"
                            />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CircleIcon sx={{ fontSize: '0.8rem', color: 'success.main' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="User adoption" 
                              secondary="1,240+ active users"
                            />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CircleIcon sx={{ fontSize: '0.8rem', color: 'warning.main' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Integration complexity" 
                              secondary="Medium-high"
                            />
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Current Focus
                      </Typography>
                      <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'primary.light' }}>
                        <Typography variant="body2" paragraph>
                          Development of predictive analytics capabilities for workload and resource forecasting
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
            
            {/* Phase 4 - AI/ML */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, opacity: 0.85 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#e0e0e0', 
                    color: 'text.secondary',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  4
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Phase 4: AI/ML Integration
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Planned" 
                      variant="outlined" 
                      color="default" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    January 2025 - June 2026
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Implementing machine learning capabilities for advanced pattern recognition, anomaly detection, and predictive modeling.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Planned Deliverables
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="ML model development framework" 
                            secondary="Q2 2025"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Anomaly detection capabilities" 
                            secondary="Q3 2025"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Case processing time prediction models" 
                            secondary="Q1 2026"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                          Planning Status
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Initial planning and assessment phase beginning Q3 2024. Technical requirements gathering and feasibility studies currently underway.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
            
            {/* Phase 5 - Federation */}
            <Paper variant="outlined" sx={{ p: 3, mb: 2, opacity: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#e0e0e0', 
                    color: 'text.secondary',
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  5
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Phase 5: Federation & Expansion
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Planned" 
                      variant="outlined" 
                      color="default" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    July 2026 - December 2026
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Federating the NPD with other DHS components' data systems and expanding external integration capabilities.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, opacity: 0.8 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Initial Planning Areas
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                Cross-Component Federation
                              </Typography>
                              <Typography variant="caption">
                                Integration with ICE, CBP, and TSA data systems
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                External API Framework
                              </Typography>
                              <Typography variant="caption">
                                Secure access for authorized external systems
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                Final System Scaling
                              </Typography>
                              <Typography variant="caption">
                                Architecture optimization for max performance
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          {/* Project Team */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <PeopleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Project Leadership
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Executive Sponsorship
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Sarah Johnson" 
                          secondary="Chief Data Officer, USCIS" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Michael Chen" 
                          secondary="CIO, USCIS" 
                        />
                      </ListItem>
                    </List>
                    
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Providing strategic direction and agency alignment
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Program Management
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Robert Taylor" 
                          secondary="Program Director" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Jennifer Martinez" 
                          secondary="Technical Project Manager" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="David Wilson" 
                          secondary="Business Integration Lead" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Technical Leadership
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Dr. Samantha Lee" 
                          secondary="Chief Architect" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="James Rodriguez" 
                          secondary="Data Engineering Lead" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Alexandra Peterson" 
                          secondary="Security & Compliance Lead" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Resources Tab */}
        <TabPanel value={activeTab} index={6}>
          <Typography variant="h5" gutterBottom>
            NPD Resources
          </Typography>
          
          <Typography variant="body1" paragraph>
            Access documentation, training materials, support channels, and tools to help you effectively utilize 
            the National Production Dataset in your work.
          </Typography>
          
          {/* Documentation Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Documentation
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      User Guides
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PictureAsPdfIcon color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="NPD User Manual" 
                          secondary="Complete guide to using the NPD platform (PDF, 8.2MB)" 
                        />
                        <Button size="small" endIcon={<DownloadIcon />}>
                          Download
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PictureAsPdfIcon color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Quick Start Guide" 
                          secondary="Essential features in 10 pages (PDF, 2.1MB)" 
                        />
                        <Button size="small" endIcon={<DownloadIcon />}>
                          Download
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <MenuBookIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="NPD Data Dictionary" 
                          secondary="Definitions of all data elements and relationships" 
                        />
                        <Button size="small" endIcon={<LaunchIcon />}>
                          Open
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <VideoLibraryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Video Tutorials" 
                          secondary="Step-by-step visual guides for common tasks" 
                        />
                        <Button size="small" endIcon={<LaunchIcon />}>
                          View
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Technical Documentation
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <IntegrationInstructionsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="API Documentation" 
                          secondary="REST API reference for programmatic access" 
                        />
                        <Button size="small" endIcon={<LaunchIcon />}>
                          Open
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <StorageIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Data Model Specification" 
                          secondary="Entity relationship diagrams and schema details" 
                        />
                        <Button size="small" endIcon={<LaunchIcon />}>
                          Open
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Security Documentation" 
                          secondary="Security protocols, compliance, and best practices" 
                        />
                        <Button size="small" endIcon={<DownloadIcon />}>
                          Download
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <HistoryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Release Notes" 
                          secondary="Detailed history of changes and updates" 
                        />
                        <Button size="small" endIcon={<LaunchIcon />}>
                          View
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Training Materials */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Training Resources
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                        <PeopleIcon />
                      </Avatar>
                      <Typography variant="h6">
                        Instructor-Led Training
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Register for live, instructor-led training sessions on various aspects of the NPD platform.
                    </Typography>
                    
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Upcoming Sessions
                      </Typography>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <EventIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="NPD for Analysts" 
                            secondary="Oct 15, 2023 | 10:00 AM - 12:00 PM ET"
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <EventIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Advanced Data Querying" 
                            secondary="Oct 22, 2023 | 1:00 PM - 3:00 PM ET"
                          />
                        </ListItem>
                      </List>
                    </Box>
                    
                    <Button variant="outlined" color="primary" fullWidth endIcon={<LaunchIcon />}>
                      View Training Calendar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                        <OndemandVideoIcon />
                      </Avatar>
                      <Typography variant="h6">
                        On-Demand Learning
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Self-paced learning modules, videos, and interactive tutorials that you can access anytime.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <PlayCircleFilledIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="NPD Fundamentals Course" 
                            secondary="5 modules | Approx. 2 hours | Certificate available"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PlayCircleFilledIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Data Analysis with NPD" 
                            secondary="8 modules | Approx. 4 hours | Advanced level"
                          />
                        </ListItem>
                      </List>
                    </Box>
                    
                    <Button variant="outlined" color="primary" fullWidth endIcon={<SchoolIcon />}>
                      Access Learning Portal
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                        <ForumIcon />
                      </Avatar>
                      <Typography variant="h6">
                        Community Resources
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Connect with other NPD users, share experiences, and learn best practices from the community.
                    </Typography>
                    
                    <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ChatIcon fontSize="small" sx={{ mr: 1 }} />
                        User Community
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Join 800+ NPD users in the official community forum. Get answers, share tips, and connect with peers.
                      </Typography>
                      <Button variant="outlined" size="small" color="primary" endIcon={<LaunchIcon />}>
                        Join Community
                      </Button>
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEventsIcon fontSize="small" sx={{ mr: 1 }} />
                        Office Hours
                      </Typography>
                      <Typography variant="body2">
                        Virtual office hours every Wednesday, 1-3pm ET. Drop in for live assistance from NPD experts.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Tools & Utilities */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <BuildIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Tools & Utilities
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Data Query Builder
                        </Typography>
                      </Box>
                      <Chip size="small" label="Essential" color="primary" />
                    </Box>
                    <Typography variant="body2" paragraph>
                      Visual query interface for creating complex data queries without SQL knowledge.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" endIcon={<LaunchIcon />}>
                      Launch Tool
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Report Templates
                        </Typography>
                      </Box>
                      <Chip size="small" label="Popular" color="secondary" />
                    </Box>
                    <Typography variant="body2" paragraph>
                      Pre-built report templates for common analyses and data presentations.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" endIcon={<LaunchIcon />}>
                      Browse Templates
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Data Quality Scanner
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Tool to assess completeness, accuracy, and validity of your data.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" endIcon={<LaunchIcon />}>
                      Run Scanner
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          API Explorer
                        </Typography>
                      </Box>
                      <Chip size="small" label="Technical" sx={{ bgcolor: '#e0e0e0' }} />
                    </Box>
                    <Typography variant="body2" paragraph>
                      Interactive tool for exploring and testing NPD API endpoints.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" endIcon={<LaunchIcon />}>
                      Open Explorer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Support */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, borderBottom: 1, pb: 1, borderColor: 'divider' }}>
              <SupportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Support Resources
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    How to Get Help
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SupportAgentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="NPD Help Desk" 
                        secondary="Available Monday-Friday, 8:00 AM - 6:00 PM ET" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <CallIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="(800) 555-0123" 
                        secondary="Tier 1 Support - General questions and access issues" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="npd-support@uscis.dhs.gov" 
                        secondary="Email support with 24-hour response time" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <BugReportIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Report Technical Issues" 
                        secondary="Submit bug reports and technical problems" 
                      />
                      <Button size="small" variant="outlined" color="primary">
                        Report Issue
                      </Button>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Frequently Asked Questions
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography>How do I request access to NPD?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Access to NPD requires supervisor approval and completion of required training. Complete the NPD Access Request Form available on the intranet, obtain your supervisor's signature, and submit to the NPD Access Management Team at npd-access@uscis.dhs.gov.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography>What data sources are included in NPD?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        NPD currently integrates data from 42 different USCIS systems, including CLAIMS 3, CLAIMS 4, ELIS, PCQS, and more. For a complete list, please refer to the NPD Data Dictionary available in the Documentation section.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3-content"
                      id="panel3-header"
                    >
                      <Typography>How often is data updated in NPD?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Data update frequency varies by source system. Most operational data is updated daily during overnight ETL processes. Some systems provide near-real-time updates. Check the data freshness indicator in the NPD interface for specific update timestamps for each data element.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4-content"
                      id="panel4-header"
                    >
                      <Typography>How do I export data from NPD?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        NPD allows authorized users to export data in various formats including CSV, Excel, PDF, and JSON. Use the export button in the query results interface. Note that data export is subject to permission controls and may be restricted based on data classification levels and your access credentials.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button variant="text" color="primary" endIcon={<ArrowForwardIcon />}>
                      View All FAQs
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
              </TabPanel>
              
              {/* Data Integration Tab */}
              <TabPanel value={activeTab} index={1} label={tabItems[1].label}>
                <Typography variant="h5" gutterBottom>Data Integration</Typography>
                <Typography variant="body1" paragraph>
                  The National Production Dataset integrates data from multiple USCIS systems to provide a unified view of immigration case data.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Connected Systems</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1">CLAIMS 3</Typography>
                        <Typography variant="body2">Computer-Linked Application Information Management System</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1">CLAIMS 4</Typography>
                        <Typography variant="body2">Computer-Linked Application Information Management System</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1">ELIS</Typography>
                        <Typography variant="body2">Electronic Immigration System</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              
              {/* System Architecture Tab */}
              <TabPanel value={activeTab} index={2} label={tabItems[2].label}>
                <Typography variant="h5" gutterBottom>System Architecture</Typography>
                <Typography variant="body1" paragraph>
                  The National Production Dataset architecture is designed for secure, high-performance data access and integration.
                </Typography>
              </TabPanel>
              
              {/* Governance Tab */}
              <TabPanel value={activeTab} index={3} label={tabItems[3].label}>
                <Typography variant="h5" gutterBottom>Governance</Typography>
                <Typography variant="body1" paragraph>
                  The governance framework for the National Production Dataset ensures data quality, security, and appropriate access controls.
                </Typography>
              </TabPanel>
              
              {/* Key Metrics Tab */}
              <TabPanel value={activeTab} index={4} label={tabItems[4].label}>
                <Typography variant="h5" gutterBottom>Key Metrics</Typography>
                <Typography variant="body1" paragraph>
                  Performance indicators and usage statistics for the National Production Dataset.
                </Typography>
              </TabPanel>
              
              {/* Development Timeline Tab */}
              <TabPanel value={activeTab} index={5} label={tabItems[5].label}>
                <Typography variant="h5" gutterBottom>Development Timeline</Typography>
                <Typography variant="body1" paragraph>
                  Major milestones and development plans for the National Production Dataset platform.
                </Typography>
              </TabPanel>
              
              {/* Resources Tab */}
              <TabPanel value={activeTab} index={6} label={tabItems[6].label}>
                <Typography variant="h5" gutterBottom>Resources</Typography>
                <Typography variant="body1" paragraph>
                  Training materials, documentation, and support resources for NPD users.
                </Typography>
              </TabPanel>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NationalProductionDataset;

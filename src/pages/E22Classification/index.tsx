import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EditProvider } from '../../contexts/EditContext';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import GavelIcon from '@mui/icons-material/Gavel';
import EligibilityIcon from '@mui/icons-material/AssignmentInd';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import DataIcon from '@mui/icons-material/Storage';
import CategoryIcon from '@mui/icons-material/Category';
import { useAccessibility } from '../../contexts/AccessibilityContext';

// Import all section components
import OverviewSection from '../../components/E22Classification/OverviewSection';
import LegalFoundationSection from '../../components/E22Classification/LegalFoundationSection';
import EligibilitySection from '../../components/E22Classification/EligibilitySection';
import ApplicationRequirementsSection from '../../components/E22Classification/ApplicationRequirementsSection';
import USCISRolesSection from '../../components/E22Classification/USCISRolesSection';
import DataChallengesSection from '../../components/E22Classification/DataChallengesSection';
import CategoryReferenceSection from '../../components/E22Classification/CategoryReferenceSection';

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
      id={`e22-tabpanel-${index}`}
      aria-labelledby={`e22-tab-${index}`}
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
    id: `e22-tab-${index}`,
    'aria-controls': `e22-tabpanel-${index}`,
    'aria-label': getTabLabel(index),
  };
}

function getTabLabel(index: number): string {
  const labels = [
    'Overview tab',
    'Legal Foundation tab',
    'Eligibility tab',
    'Application Requirements tab',
    'USCIS Roles tab',
    'Data and Challenges tab',
    'Category Reference tab'
  ];
  return labels[index] || '';
}

interface E22ClassificationProps {
  isAdmin?: boolean;
}

const E22Classification: React.FC<E22ClassificationProps> = ({ isAdmin = true }) => {
  const [value, setValue] = useState(0);
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  useEffect(() => {
    if (isMobile) {
      setSidenavOpen(false);
    }
  }, [isMobile]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const handleSidenavClick = (index: number) => {
    setValue(index);
    if (isMobile) {
      setSidenavOpen(false);
    }
  };
  
  // Handle keyboard navigation for the side menu
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setValue(Math.min(index + 1, tabLabels.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setValue(Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setValue(0);
        break;
      case 'End':
        event.preventDefault();
        setValue(tabLabels.length - 1);
        break;
      default:
        break;
    }
  };

  const tabLabels = [
    'Overview',
    'Legal Foundation',
    'Eligibility',
    'Application Requirements',
    'USCIS Roles',
    'Data & Challenges',
    'Category Reference'
  ];

  const tabIcons = [
    <InfoIcon />,
    <GavelIcon />,
    <EligibilityIcon />,
    <DescriptionIcon />,
    <WorkIcon />,
    <DataIcon />,
    <CategoryIcon />
  ];

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

  return (
    <EditProvider isAdmin={isAdmin}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            fontSize: largeText ? '2.2rem' : '2rem' 
          }}
        >
          E-Unify E22 Classification
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center"
          paragraph
          sx={{ 
            mb: 3,
            ...textSizeProps,
            ...contrastProps
          }}
        >
          Comprehensive guide to the E22 immigration classification for spouses of EB-2 immigrants
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Toggle button for mobile */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <IconButton 
              onClick={toggleSidenav} 
              aria-label={sidenavOpen ? "Close side navigation" : "Open side navigation"}
              aria-expanded={sidenavOpen}
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <MenuIcon />
              <Typography variant="body2" sx={{ ml: 1, ...textSizeProps }}>
                {sidenavOpen ? 'Hide Menu' : 'Show Menu'}
              </Typography>
            </IconButton>
          </Box>
        )}

        {/* Side Navigation */}
        {(sidenavOpen || !isMobile) && (
          <Box 
            sx={{ 
              width: isMobile ? '100%' : '250px',
              mr: isMobile ? 0 : 3,
              mb: isMobile ? 2 : 0,
              flexShrink: 0
            }}
          >
            <Paper 
              elevation={3} 
              sx={{
                p: 2,
                ...contrastProps
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: highContrast ? '#000000' : '#003366',
                  ...textSizeProps
                }}
              >
                E22 Classification
              </Typography>
              <List component="nav" aria-label="E22 classification navigation">
                {tabLabels.map((label, index) => (
                  <li key={index}>
                    <Box
                      sx={{
                        bgcolor: value === index ? (highContrast ? '#000000' : '#003366') : 'transparent',
                        color: value === index ? '#ffffff' : (highContrast ? '#000000' : 'inherit'),
                        '&:hover': {
                          bgcolor: value === index ? (highContrast ? '#000000' : '#003366') : '#f5f5f5',
                        },
                        borderRadius: '4px',
                        m: 0.5,
                      }}
                    >
                      <button
                        onClick={() => handleSidenavClick(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        role="tab"
                        aria-selected={value === index}
                        tabIndex={0}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          outline: 'none',
                          color: 'inherit',
                          borderRadius: '4px'
                        }}
                      >
                        <Box 
                          component="span" 
                          sx={{ 
                            color: value === index ? '#ffffff' : (highContrast ? '#000000' : 'inherit'),
                            minWidth: '40px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {tabIcons[index]}
                        </Box>
                        <Typography 
                          sx={{
                            ...textSizeProps,
                            ml: 1
                          }}
                        >
                          {label}
                        </Typography>
                      </button>
                    </Box>
                  </li>
                ))}
                {tabLabels.map((label, index) => (
                  index < tabLabels.length - 1 && (
                    <Divider variant="middle" component="li" key={index} />
                  )
                ))}
              </List>
            </Paper>
          </Box>
        )}

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Horizontal tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="E22 classification tabs"
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{ 
                '& .MuiTab-root': { 
                  ...textSizeProps,
                  color: highContrast ? '#000000' : 'inherit'
                },
                '& .Mui-selected': { 
                  color: highContrast ? '#000000' : '#003366',
                  fontWeight: 'bold'
                },
                '& .MuiTabs-indicator': { 
                  backgroundColor: highContrast ? '#000000' : '#003366' 
                }
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Paper elevation={3} sx={{ p: 0, mt: 2, ...contrastProps }}>
            <TabPanel value={value} index={0}>
              <OverviewSection />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <LegalFoundationSection />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <EligibilitySection />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <ApplicationRequirementsSection />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <USCISRolesSection />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <DataChallengesSection />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <CategoryReferenceSection />
            </TabPanel>
          </Paper>
        </Box>
      </Box>
      </Container>
    </EditProvider>
  );
};

export default E22Classification;

import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import OverviewSection from './OverviewSection';
import EligibilitySection from './EligibilitySection';
import ApplicationRequirementsSection from './ApplicationRequirementsSection';
import CategoryReferenceSection from './CategoryReferenceSection';
import USCISRolesSection from './USCISRolesSection';
import DataChallengesSection from './DataChallengesSection';
import LegalFoundationSection from './LegalFoundationSection';
import { EditProvider } from '../../contexts/EditContext';

// USCIS blue-on-white tabs styling
const PRIMARY_BLUE = '#003366';
const FOCUS_OUTLINE = '3px solid #B31B1B';

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
      style={{ padding: '20px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `e22-tab-${index}`,
    'aria-controls': `e22-tabpanel-${index}`,
  };
}

interface E22ClassificationProps {
  isAdmin?: boolean;
}

const E22Classification: React.FC<E22ClassificationProps> = ({ isAdmin = false }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <EditProvider isAdmin={isAdmin}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#ffffff' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="E22 Classification tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: '#ffffff',
              '& .MuiTabs-indicator': {
                backgroundColor: PRIMARY_BLUE
              }
            }}
          >
            <Tab
              label="Overview"
              {...a11yProps(0)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="Eligibility"
              {...a11yProps(1)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="Application Requirements"
              {...a11yProps(2)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="Category Reference"
              {...a11yProps(3)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="USCIS Roles"
              {...a11yProps(4)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="Data Challenges"
              {...a11yProps(5)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
            <Tab
              label="Legal Foundation"
              {...a11yProps(6)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: PRIMARY_BLUE,
                '&.Mui-selected': { color: PRIMARY_BLUE },
                '&:focus-visible': { outline: FOCUS_OUTLINE, outlineOffset: '2px' }
              }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <OverviewSection />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EligibilitySection />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ApplicationRequirementsSection />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CategoryReferenceSection />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <USCISRolesSection />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <DataChallengesSection />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <LegalFoundationSection />
        </TabPanel>
      </Box>
    </EditProvider>
  );
};

export default E22Classification;

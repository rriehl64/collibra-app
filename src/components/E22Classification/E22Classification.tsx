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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="E22 Classification tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Eligibility" {...a11yProps(1)} />
            <Tab label="Application Requirements" {...a11yProps(2)} />
            <Tab label="Category Reference" {...a11yProps(3)} />
            <Tab label="USCIS Roles" {...a11yProps(4)} />
            <Tab label="Data Challenges" {...a11yProps(5)} />
            <Tab label="Legal Foundation" {...a11yProps(6)} />
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

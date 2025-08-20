// USCIS Accessible About Page - Section 508 Compliant
import React, { useState } from 'react';
import { Container, Typography, Box, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Basic tab panel component for accessibility
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id: string;
}

// Simplified Tab Panel component
function TabPanel(props: TabPanelProps) {
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
}

// Simplified About component
function About() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Tab ID for accessibility
  const tabId = "about-eunify";
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
        About E-Unify
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue}
          onChange={handleTabChange}
          aria-label="About E-Unify tabs"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '.MuiTab-root': { 
              color: '#003366', 
              '&.Mui-selected': { color: '#003366', fontWeight: 700 } 
            }
          }}
        >
          <Tab label="Overview" id={`${tabId}-tab-0`} aria-controls={`${tabId}-tabpanel-0`} />
          <Tab label="FAQ" id={`${tabId}-tab-1`} aria-controls={`${tabId}-tabpanel-1`} />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0} id={tabId}>
        <Typography paragraph>
          E-Unify is USCIS's enterprise metadata management platform that provides a single source of truth for data assets across the organization.
        </Typography>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1} id={tabId}>
        <Typography paragraph>
          Frequently Asked Questions about E-Unify platform functionality, access, and support.
        </Typography>
      </TabPanel>
    </Container>
  );
}

export default About;

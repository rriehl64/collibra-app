import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Tab, Tabs, Button } from '@mui/material';
import { Description as DocumentIcon } from '@mui/icons-material';
import Markdown from 'markdown-to-jsx';
import { useLocation, useNavigate } from 'react-router-dom';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const PolicyManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [documentation, setDocumentation] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Set initial tab based on route
  useEffect(() => {
    if (location.pathname.includes('/gdpr')) {
      setTabValue(0);
    } else if (location.pathname.includes('/standards')) {
      setTabValue(1);
    }
  }, [location]);

  useEffect(() => {
    // Fetch the documentation content
    fetch('http://localhost:3002/docs/collibra-workflows.md', {
      headers: {
        'Accept': 'text/markdown',
        'Content-Type': 'text/markdown',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load documentation');
        }
        return response.text();
      })
      .then(text => {
        console.log('Documentation loaded:', text.substring(0, 100) + '...');
        setDocumentation(text);
      })
      .catch(error => {
        console.error('Error loading documentation:', error);
        setDocumentation('Error loading documentation. Please try again later.');
      });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update route based on selected tab
    navigate(newValue === 0 ? '/policy/gdpr' : '/policy/standards');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {location.pathname.includes('/gdpr') ? 'GDPR Articles' : 'Policies & Standards'}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="GDPR Articles" />
          <Tab label="Policies & Standards" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            GDPR Articles
          </Typography>
          <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
            <Markdown>
              {documentation}
            </Markdown>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Policies & Standards
          </Typography>
          <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
            <Markdown>
              {documentation}
            </Markdown>
          </Box>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default PolicyManager;

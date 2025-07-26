// React imports
import React, { useState } from 'react';

// Type imports
import type { SxProps, Theme } from '@mui/material/styles';
import type { SvgIconProps } from '@mui/material';

// MUI component imports
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';

// MUI icon imports
import {
  Code as CodeIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
  DeviceHub as DeviceHubIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';

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
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<SvgIconProps>;
  sx?: SxProps<Theme>;
}

interface ScalabilityFeature {
  title: string;
  description: string;
  icon: React.ComponentType<SvgIconProps>;
  sx?: SxProps<Theme>;
  fontSize?: string;
}

interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  authentication: string;
}

// Mock API endpoints data
const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    endpoint: '/api/v1/assets',
    description: 'Retrieve all data assets',
    authentication: 'Bearer Token',
  },
  {
    method: 'POST',
    endpoint: '/api/v1/assets',
    description: 'Create a new data asset',
    authentication: 'Bearer Token',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/policies',
    description: 'List all governance policies',
    authentication: 'Bearer Token',
  },
  {
    method: 'POST',
    endpoint: '/api/v1/workflows',
    description: 'Create a new workflow',
    authentication: 'Bearer Token',
  },
];

// Mock integrations data
const integrations: Integration[] = [
  {
    name: 'AWS Services',
    description: 'Native integration with AWS S3, RDS, and Redshift',
    icon: CloudIcon,
  },
  {
    name: 'Database Connectors',
    description: 'Connect to MySQL, PostgreSQL, Oracle, and SQL Server',
    icon: StorageIcon,
  },
  {
    name: 'ETL Tools',
    description: 'Integration with popular ETL and data pipeline tools',
    icon: SwapHorizIcon,
  },
  {
    name: 'BI Platforms',
    description: 'Connect with Tableau, Power BI, and other BI tools',
    icon: DeviceHubIcon,
  },
];

// Mock scalability features
const scalabilityFeatures: ScalabilityFeature[] = [
  {
    title: 'Microservices Architecture',
    description: 'Independently scalable components for optimal resource utilization',
    icon: CodeIcon,
  },
  {
    title: 'Auto-scaling',
    description: 'Automatic scaling based on demand and workload',
    icon: SpeedIcon,
  },
  {
    title: 'Load Balancing',
    description: 'Intelligent traffic distribution across service instances',
    icon: DeviceHubIcon,
  },
  {
    title: 'Security',
    description: 'Enterprise-grade security with encryption and access controls',
    icon: SecurityIcon,
  },
];

const Integration: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Integration & Scalability
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="integration and scalability tabs"
        >
          <Tab 
            label="API Documentation" 
            aria-controls="integration-tabpanel-0" 
            id="integration-tab-0"
            aria-selected={tabValue === 0}
          />
          <Tab 
            label="Integrations" 
            aria-controls="integration-tabpanel-1" 
            id="integration-tab-1"
            aria-selected={tabValue === 1}
          />
          <Tab 
            label="Scalability" 
            aria-controls="integration-tabpanel-2" 
            id="integration-tab-2"
            aria-selected={tabValue === 2}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              REST API Endpoints
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our comprehensive REST API enables seamless integration with your existing systems.
            </Typography>
          </Box>
          
          {apiEndpoints.map((endpoint, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={endpoint.method}
                    color={endpoint.method === 'GET' ? 'success' : 'primary'}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="subtitle2" component="code">
                    {endpoint.endpoint}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {endpoint.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Authentication: {endpoint.authentication}
                </Typography>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ApiIcon />}
              aria-label="View complete API documentation"
            >
              View Full API Documentation
            </Button>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {integrations.map((integration, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <integration.icon sx={{ mr: 2, color: 'primary.main' }} fontSize="medium" />
                  <Typography variant="h6">{integration.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {integration.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {scalabilityFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <feature.icon sx={{ mr: 2, color: 'primary.main' }} fontSize="medium" />
                  <Typography variant="h6">{feature.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default Integration;

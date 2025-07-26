import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for visualizations
const timeSeriesData = [
  { month: 'Jan', assets: 400, policies: 240 },
  { month: 'Feb', assets: 300, policies: 139 },
  { month: 'Mar', assets: 200, policies: 980 },
  { month: 'Apr', assets: 278, policies: 390 },
  { month: 'May', assets: 189, policies: 480 },
  { month: 'Jun', assets: 239, policies: 380 },
];

const complianceData = [
  { name: 'Compliant', value: 400 },
  { name: 'Non-Compliant', value: 30 },
  { name: 'Under Review', value: 50 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

// Mock business glossary data
const initialGlossaryTerms = [
  {
    term: 'Data Asset',
    definition: 'Any piece of data that provides value to the organization.',
  },
  {
    term: 'Data Governance',
    definition: 'Framework for managing data assets throughout their lifecycle.',
  },
  {
    term: 'Data Steward',
    definition: 'Individual responsible for managing and overseeing data assets.',
  },
  {
    term: 'Metadata',
    definition: 'Data that provides information about other data.',
  },
];

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
      id={`analytics-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Analytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [glossaryTerms] = useState(initialGlossaryTerms);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredTerms = glossaryTerms.filter((term) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Analytics & Reporting
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Data Analytics" />
          <Tab label="Business Glossary" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Data Assets and Policies Over Time
              </Typography>
              <LineChart
                width={600}
                height={300}
                data={timeSeriesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="assets"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="policies" stroke="#82ca9d" />
              </LineChart>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Compliance Status
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={complianceData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {complianceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Search Terms"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <List>
            {filteredTerms.map((term, index) => (
              <React.Fragment key={term.term}>
                <ListItem>
                  <ListItemText
                    primary={term.term}
                    secondary={term.definition}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                {index < filteredTerms.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default Analytics;

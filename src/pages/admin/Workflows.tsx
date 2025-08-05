import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Simple workflow type definition
interface Workflow {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  steps: number;
  owner: string;
  lastModified: string;
}

// Sample data
const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Data Asset Approval',
    description: 'Process for reviewing and approving new data assets',
    type: 'Approval',
    status: 'active',
    steps: 5,
    owner: 'Data Governance Team',
    lastModified: '2025-07-15'
  },
  {
    id: 'wf-002',
    name: 'Business Term Definition',
    description: 'Workflow for creating and approving business term definitions',
    type: 'Definition',
    status: 'active',
    steps: 4,
    owner: 'Business Glossary Team',
    lastModified: '2025-07-22'
  },
  {
    id: 'wf-003',
    name: 'Data Quality Issue Resolution',
    description: 'Process for addressing and resolving data quality issues',
    type: 'Issue Management',
    status: 'active',
    steps: 7,
    owner: 'Data Quality Team',
    lastModified: '2025-08-01'
  },
  {
    id: 'wf-004',
    name: 'New Report Request',
    description: 'Workflow for requesting and building new business reports',
    type: 'Request',
    status: 'draft',
    steps: 6,
    owner: 'BI Team',
    lastModified: '2025-08-02'
  },
  {
    id: 'wf-005',
    name: 'Metadata Change Review',
    description: 'Process for reviewing changes to metadata standards',
    type: 'Review',
    status: 'archived',
    steps: 3,
    owner: 'Metadata Management',
    lastModified: '2025-06-10'
  }
];

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWorkflows(sampleWorkflows);
      setLoading(false);
    }, 500);
  }, []);

  // Filter workflows based on search
  const filteredWorkflows = workflows.filter(workflow => {
    if (!searchText) return true;
    
    const search = searchText.toLowerCase();
    return (
      workflow.name.toLowerCase().includes(search) ||
      workflow.description.toLowerCase().includes(search) ||
      workflow.type.toLowerCase().includes(search) ||
      workflow.owner.toLowerCase().includes(search)
    );
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
      case 'draft':
        return { bg: '#E3F2FD', color: '#1976D2' }; // Blue
      case 'archived':
        return { bg: '#F5F5F5', color: '#757575' }; // Grey
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Workflow Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage and configure workflows for data governance processes.
      </Typography>
      
      {/* Search and actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search workflows..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton 
                    aria-label="Clear search" 
                    onClick={() => setSearchText('')}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            aria-label="Search workflows"
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            aria-label="Create new workflow"
          >
            Create Workflow
          </Button>
        </Grid>
      </Grid>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading workflows" />
        </Box>
      )}
      
      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}
      
      {/* Results count */}
      {!loading && !error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredWorkflows.length === 0
              ? 'No workflows found matching your criteria.'
              : `Showing ${filteredWorkflows.length} workflow${filteredWorkflows.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Workflows table */}
      {!loading && !error && filteredWorkflows.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="Workflows management table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Steps</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkflows.map((workflow) => {
                const statusColors = getStatusColor(workflow.status);
                
                return (
                  <TableRow key={workflow.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{workflow.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{workflow.description}</Typography>
                    </TableCell>
                    <TableCell>{workflow.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)} 
                        size="small" 
                        sx={{ backgroundColor: statusColors.bg, color: statusColors.color }}
                      />
                    </TableCell>
                    <TableCell>{workflow.steps}</TableCell>
                    <TableCell>{workflow.owner}</TableCell>
                    <TableCell>
                      {new Date(workflow.lastModified).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Workflows;

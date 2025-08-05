import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  LinearProgress,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  CompareArrows as MigrateIcon,
  Sync as SyncIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  PauseCircleOutline as PausedIcon
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface MigrationJob {
  id: string;
  name: string;
  description: string;
  source: string;
  destination: string;
  status: 'completed' | 'in-progress' | 'paused' | 'scheduled' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  recordsTotal: number;
  recordsMigrated: number;
  lastUpdated: string;
}

const ProcessingMigration: React.FC = () => {
  const navigate = useNavigate();
  const [migrationJobs, setMigrationJobs] = useState<MigrationJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<MigrationJob[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<MigrationJob | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Sample data for migration jobs
  const sampleMigrationJobs: MigrationJob[] = [
    {
      id: '1',
      name: 'Customer Data Migration',
      description: 'Migrating customer data from legacy system to new CRM',
      source: 'Legacy SQL Database',
      destination: 'Salesforce CRM',
      status: 'in-progress',
      progress: 65,
      startTime: '2025-07-28T08:30:00Z',
      estimatedCompletion: '2025-08-05T16:00:00Z',
      owner: 'Sarah Johnson',
      priority: 'high',
      recordsTotal: 250000,
      recordsMigrated: 162500,
      lastUpdated: '2025-08-04T20:15:00Z'
    },
    {
      id: '2',
      name: 'Financial Records Migration',
      description: 'Moving financial records to new accounting system',
      source: 'SAP ERP',
      destination: 'Oracle Financials',
      status: 'scheduled',
      progress: 0,
      startTime: '2025-08-10T09:00:00Z',
      estimatedCompletion: '2025-08-12T17:00:00Z',
      owner: 'Michael Chen',
      priority: 'high',
      recordsTotal: 120000,
      recordsMigrated: 0,
      lastUpdated: '2025-08-03T15:30:00Z'
    },
    {
      id: '3',
      name: 'Marketing Campaign Data',
      description: 'Migrating historical campaign data to analytics platform',
      source: 'Marketing Automation Platform',
      destination: 'Analytics Data Warehouse',
      status: 'completed',
      progress: 100,
      startTime: '2025-07-15T10:00:00Z',
      estimatedCompletion: '2025-07-18T17:00:00Z',
      owner: 'Alicia Torres',
      priority: 'medium',
      recordsTotal: 85000,
      recordsMigrated: 85000,
      lastUpdated: '2025-07-18T16:45:00Z'
    },
    {
      id: '4',
      name: 'Product Catalog Migration',
      description: 'Updating product data in the new e-commerce platform',
      source: 'Legacy Product Database',
      destination: 'Shopify Commerce',
      status: 'paused',
      progress: 42,
      startTime: '2025-07-25T14:00:00Z',
      estimatedCompletion: '2025-08-06T12:00:00Z',
      owner: 'Robert Williams',
      priority: 'medium',
      recordsTotal: 45000,
      recordsMigrated: 18900,
      lastUpdated: '2025-07-30T09:20:00Z'
    },
    {
      id: '5',
      name: 'HR Employee Records',
      description: 'Migrating employee records to new HR management system',
      source: 'Legacy HR System',
      destination: 'Workday',
      status: 'failed',
      progress: 78,
      startTime: '2025-07-20T09:00:00Z',
      estimatedCompletion: '2025-07-25T17:00:00Z',
      owner: 'Emma Rodriguez',
      priority: 'high',
      recordsTotal: 5200,
      recordsMigrated: 4056,
      lastUpdated: '2025-07-22T14:10:00Z'
    },
    {
      id: '6',
      name: 'Supplier Database Migration',
      description: 'Transferring supplier information to procurement system',
      source: 'Excel Spreadsheets',
      destination: 'SAP Ariba',
      status: 'completed',
      progress: 100,
      startTime: '2025-06-15T08:00:00Z',
      estimatedCompletion: '2025-06-18T17:00:00Z',
      owner: 'David Smith',
      priority: 'low',
      recordsTotal: 3500,
      recordsMigrated: 3500,
      lastUpdated: '2025-06-17T16:30:00Z'
    }
  ];

  // Debounce search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setDebouncedSearchText(searchValue);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchText('');
    setDebouncedSearchText('');
  };

  // Filter jobs based on search text and filters
  const fetchMigrationJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await axios.get('/api/processing-migration');
      // const data = response.data;
      
      // For now, use our sample data
      const data = [...sampleMigrationJobs];
      setMigrationJobs(data);
      
      // Apply filters
      let filtered = [...data];
      
      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        filtered = filtered.filter(job => job.status === statusFilter);
      }
      
      // Filter by priority if not 'all'
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(job => job.priority === priorityFilter);
      }
      
      // Filter by search text
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(job => 
          job.name.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.source.toLowerCase().includes(searchLower) ||
          job.destination.toLowerCase().includes(searchLower) ||
          job.owner.toLowerCase().includes(searchLower)
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('processingMigrationSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setFilteredJobs(filtered);
    } catch (err) {
      console.error('Failed to fetch migration jobs:', err);
      setError('Failed to load migration jobs. Please try again later.');
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, statusFilter, priorityFilter]);

  // Load jobs when component mounts or search/filters change
  useEffect(() => {
    fetchMigrationJobs();
  }, [fetchMigrationJobs]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('processingMigrationSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }
  }, []);

  // Handle opening the delete confirmation dialog
  const handleDeleteDialogOpen = (job: MigrationJob) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  // Handle closing the delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handle job deletion
  const handleDeleteJob = () => {
    if (selectedJob) {
      // In a real app, this would be an API call
      // await axios.delete(`/api/processing-migration/${selectedJob.id}`);
      
      // For now, just filter out the deleted job
      const updatedJobs = migrationJobs.filter(
        job => job.id !== selectedJob.id
      );
      setMigrationJobs(updatedJobs);
      fetchMigrationJobs();
      
      setSnackbarMessage(`Migration job "${selectedJob.name}" was deleted.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    
    setDeleteDialogOpen(false);
    setSelectedJob(null);
  };

  // Handle opening the edit dialog
  const handleEditDialogOpen = (job: MigrationJob) => {
    setSelectedJob(job);
    setEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedJob(null);
  };

  // Handle opening the create dialog
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  // Handle closing the create dialog
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: <SuccessIcon /> };
      case 'in-progress':
        return { color: 'info', icon: <SyncIcon /> };
      case 'paused':
        return { color: 'warning', icon: <PausedIcon /> };
      case 'scheduled':
        return { color: 'secondary', icon: <ScheduleIcon /> };
      case 'failed':
        return { color: 'error', icon: <ErrorIcon /> };
      default:
        return { color: 'default', icon: <MigrateIcon /> };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
          Data Migration Jobs
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
          sx={{
            backgroundColor: '#003366',
            '&:hover': {
              backgroundColor: '#00264d'
            }
          }}
        >
          New Migration
        </Button>
      </Box>
      
      <Typography variant="body1" paragraph>
        Manage and monitor your data migration jobs between systems and platforms.
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search migrations..."
              value={searchText}
              onChange={handleSearchChange}
              aria-label="Search migration jobs"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleClearSearch}
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {/* Search history */}
            {searchText && searchHistory.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Recent searches:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {searchHistory.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      onClick={() => {
                        setSearchText(item);
                        setDebouncedSearchText(item);
                      }}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {loading ? 'Loading...' : `${filteredJobs.length} migration ${filteredJobs.length === 1 ? 'job' : 'jobs'} found`}
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* No results */}
      {!loading && filteredJobs.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MigrateIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No migration jobs found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {debouncedSearchText
              ? `No results match "${debouncedSearchText}"`
              : 'Try adjusting your filters or create a new migration job.'}
          </Typography>
          {debouncedSearchText && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleClearSearch}
              sx={{ mr: 1 }}
            >
              Clear Search
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
            size="small"
          >
            Create New Migration
          </Button>
        </Paper>
      )}
      
      {/* Migration Jobs Grid */}
      {!loading && filteredJobs.length > 0 && (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => {
            const { color, icon } = getStatusInfo(job.status);
            return (
              <Grid item xs={12} sm={6} lg={4} key={job.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6
                    },
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease-in-out'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <Chip
                      icon={icon}
                      label={job.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={color as any}
                      size="small"
                    />
                  </Box>
                  
                  <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MigrateIcon sx={{ mr: 1, color: '#003366' }} />
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        {job.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {job.description}
                    </Typography>
                    
                    {/* Migration path */}
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ maxWidth: '40%' }}>
                          <Typography variant="caption" color="text.secondary">Source</Typography>
                          <Typography variant="body2" noWrap>{job.source}</Typography>
                        </Box>
                        <MigrateIcon color="action" />
                        <Box sx={{ maxWidth: '40%', textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">Destination</Typography>
                          <Typography variant="body2" noWrap>{job.destination}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    {/* Progress bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {job.progress}% Complete
                        </Typography>
                        <Typography variant="body2">
                          {formatNumber(job.recordsMigrated)} / {formatNumber(job.recordsTotal)} records
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={job.progress} 
                        color={color as any}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    {/* Migration timing */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Started
                        </Typography>
                        <Typography variant="body2">
                          {job.startTime ? new Date(job.startTime).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Est. Completion
                        </Typography>
                        <Typography variant="body2">
                          {job.estimatedCompletion ? new Date(job.estimatedCompletion).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Owner
                        </Typography>
                        <Typography variant="body2">{job.owner}</Typography>
                      </Box>
                      <Chip 
                        label={`${job.priority} priority`} 
                        size="small" 
                        color={getPriorityColor(job.priority) as any}
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      startIcon={<SettingsIcon />}
                      onClick={() => navigate(`/processing/migration/${job.id}`)}
                    >
                      Manage
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditDialogOpen(job)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteDialogOpen(job)}
                      disabled={job.status === 'in-progress'}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-job-dialog-title"
        aria-describedby="delete-job-dialog-description"
      >
        <DialogTitle id="delete-job-dialog-title">
          Delete Migration Job
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-job-dialog-description">
            Are you sure you want to delete the migration job "{selectedJob?.name}"?
            This action cannot be undone and may result in loss of migration history and tracking.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteJob} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Migration Dialog Placeholder */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-job-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-job-dialog-title">
          Edit Migration Job
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dialog would contain a form to edit the migration job configuration.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Form implementation would be added in the next phase)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleEditDialogClose} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Migration Dialog Placeholder */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        aria-labelledby="create-job-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="create-job-dialog-title">
          Create New Migration Job
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={0} alternativeLabel>
              <Step>
                <StepLabel>Configure Source</StepLabel>
              </Step>
              <Step>
                <StepLabel>Configure Destination</StepLabel>
              </Step>
              <Step>
                <StepLabel>Map Fields</StepLabel>
              </Step>
              <Step>
                <StepLabel>Schedule</StepLabel>
              </Step>
            </Stepper>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" paragraph>
                This dialog would contain a multi-step form to create a new migration job.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Form implementation would be added in the next phase)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateDialogClose} color="primary">
            Save Draft
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProcessingMigration;

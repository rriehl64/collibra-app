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
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface ProcessingMeasure {
  id: string;
  name: string;
  description: string;
  type: string;
  unit: string;
  threshold: number;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
  owner: string;
  category: string;
}

const ProcessingMeasures: React.FC = () => {
  const navigate = useNavigate();
  const [measures, setMeasures] = useState<ProcessingMeasure[]>([]);
  const [filteredMeasures, setFilteredMeasures] = useState<ProcessingMeasure[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedMeasure, setSelectedMeasure] = useState<ProcessingMeasure | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Sample data for processing measures
  const sampleMeasures: ProcessingMeasure[] = [
    {
      id: '1',
      name: 'Data Processing Time',
      description: 'Average time taken to process a single data record',
      type: 'Performance',
      unit: 'ms',
      threshold: 250,
      value: 180,
      status: 'healthy',
      lastUpdated: '2025-08-01T15:30:00Z',
      owner: 'Sarah Johnson',
      category: 'Customer Data Processing'
    },
    {
      id: '2',
      name: 'Error Rate',
      description: 'Percentage of records that fail processing',
      type: 'Quality',
      unit: '%',
      threshold: 2,
      value: 0.8,
      status: 'healthy',
      lastUpdated: '2025-08-02T10:15:00Z',
      owner: 'Michael Chen',
      category: 'Financial Data Workflows'
    },
    {
      id: '3',
      name: 'Memory Usage',
      description: 'Average memory consumption during processing',
      type: 'Resource',
      unit: 'MB',
      threshold: 2048,
      value: 1850,
      status: 'warning',
      lastUpdated: '2025-08-01T20:45:00Z',
      owner: 'David Smith',
      category: 'Marketing Analytics'
    },
    {
      id: '4',
      name: 'Data Throughput',
      description: 'Number of records processed per minute',
      type: 'Performance',
      unit: 'records/min',
      threshold: 1000,
      value: 1200,
      status: 'healthy',
      lastUpdated: '2025-08-03T09:20:00Z',
      owner: 'Alicia Torres',
      category: 'Customer Data Processing'
    },
    {
      id: '5',
      name: 'Failed Validations',
      description: 'Number of records failing validation rules',
      type: 'Quality',
      unit: 'count',
      threshold: 50,
      value: 78,
      status: 'critical',
      lastUpdated: '2025-08-02T14:10:00Z',
      owner: 'Robert Williams',
      category: 'Regulatory Compliance'
    },
    {
      id: '6',
      name: 'CPU Utilization',
      description: 'Percentage of CPU used during processing',
      type: 'Resource',
      unit: '%',
      threshold: 85,
      value: 72,
      status: 'warning',
      lastUpdated: '2025-08-03T16:30:00Z',
      owner: 'Emma Rodriguez',
      category: 'HR Data Processing'
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

  // Filter measures based on search text and filters
  const fetchMeasures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await axios.get('/api/processing-measures');
      // const data = response.data;
      
      // For now, use our sample data
      const data = [...sampleMeasures];
      setMeasures(data);
      
      // Apply filters
      let filtered = [...data];
      
      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        filtered = filtered.filter(measure => measure.status === statusFilter);
      }
      
      // Filter by type if not 'all'
      if (typeFilter !== 'all') {
        filtered = filtered.filter(measure => measure.type === typeFilter);
      }
      
      // Filter by search text
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(measure => 
          measure.name.toLowerCase().includes(searchLower) ||
          measure.description.toLowerCase().includes(searchLower) ||
          measure.owner.toLowerCase().includes(searchLower) ||
          measure.category.toLowerCase().includes(searchLower)
        );
        
        // Add to search history if it's a new search
        if (!searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('processingMeasuresSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      setFilteredMeasures(filtered);
    } catch (err) {
      console.error('Failed to fetch processing measures:', err);
      setError('Failed to load processing measures. Please try again later.');
      setFilteredMeasures([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, searchHistory, statusFilter, typeFilter]);

  // Load measures when component mounts or search/filters change
  useEffect(() => {
    fetchMeasures();
  }, [fetchMeasures]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('processingMeasuresSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }
  }, []);

  // Handle opening the delete confirmation dialog
  const handleDeleteDialogOpen = (measure: ProcessingMeasure) => {
    setSelectedMeasure(measure);
    setDeleteDialogOpen(true);
  };

  // Handle closing the delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handle measure deletion
  const handleDeleteMeasure = () => {
    if (selectedMeasure) {
      // In a real app, this would be an API call
      // await axios.delete(`/api/processing-measures/${selectedMeasure.id}`);
      
      // For now, just filter out the deleted measure
      const updatedMeasures = measures.filter(
        measure => measure.id !== selectedMeasure.id
      );
      setMeasures(updatedMeasures);
      fetchMeasures();
      
      setSnackbarMessage(`Processing measure "${selectedMeasure.name}" was deleted.`);
      setSnackbarOpen(true);
    }
    
    setDeleteDialogOpen(false);
    setSelectedMeasure(null);
  };

  // Handle opening the edit dialog
  const handleEditDialogOpen = (measure: ProcessingMeasure) => {
    setSelectedMeasure(measure);
    setEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedMeasure(null);
  };

  // Handle opening the create dialog
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  // Handle closing the create dialog
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get progress color based on status
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'primary';
    }
  };

  // Calculate progress percentage based on value and threshold
  const calculateProgress = (value: number, threshold: number) => {
    return Math.min(100, (value / threshold) * 100);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
          Processing Measures
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
          New Measure
        </Button>
      </Box>
      
      <Typography variant="body1" paragraph>
        Monitor and manage key performance indicators for your data processing workflows.
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search measures..."
              value={searchText}
              onChange={handleSearchChange}
              aria-label="Search processing measures"
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
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Performance">Performance</MenuItem>
                <MenuItem value="Quality">Quality</MenuItem>
                <MenuItem value="Resource">Resource</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {loading ? 'Loading...' : `${filteredMeasures.length} ${filteredMeasures.length === 1 ? 'measure' : 'measures'} found`}
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
      {!loading && filteredMeasures.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SpeedIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No processing measures found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {debouncedSearchText
              ? `No results match "${debouncedSearchText}"`
              : 'Try adjusting your filters or create a new processing measure.'}
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
            Create New Measure
          </Button>
        </Paper>
      )}
      
      {/* Measures Grid */}
      {!loading && filteredMeasures.length > 0 && (
        <Grid container spacing={3}>
          {filteredMeasures.map((measure) => (
            <Grid item xs={12} sm={6} md={4} key={measure.id}>
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
                    label={measure.status.charAt(0).toUpperCase() + measure.status.slice(1)}
                    color={getStatusColor(measure.status) as any}
                    size="small"
                  />
                </Box>
                
                <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon sx={{ mr: 1, color: '#003366' }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {measure.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {measure.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      label={measure.type} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={measure.category}
                      size="small"
                      variant="outlined"
                      icon={<AssessmentIcon />}
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Current: {measure.value} {measure.unit}
                      </Typography>
                      <Typography variant="body2">
                        Threshold: {measure.threshold} {measure.unit}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(measure.value, measure.threshold)} 
                      color={getProgressColor(measure.status) as any}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Owner
                      </Typography>
                      <Typography variant="body2">{measure.owner}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body2">
                        {new Date(measure.lastUpdated).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate(`/processing/measures/${measure.id}`)}
                  >
                    Manage
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEditDialogOpen(measure)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteDialogOpen(measure)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-measure-dialog-title"
        aria-describedby="delete-measure-dialog-description"
      >
        <DialogTitle id="delete-measure-dialog-title">
          Delete Processing Measure
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-measure-dialog-description">
            Are you sure you want to delete the processing measure "{selectedMeasure?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteMeasure} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Measure Dialog Placeholder */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-measure-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-measure-dialog-title">
          Edit Processing Measure
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dialog would contain a form to edit the processing measure.
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
      
      {/* Create Measure Dialog Placeholder */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        aria-labelledby="create-measure-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="create-measure-dialog-title">
          Create New Processing Measure
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This dialog would contain a form to create a new processing measure.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Form implementation would be added in the next phase)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateDialogClose} color="primary">
            Create Measure
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
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProcessingMeasures;

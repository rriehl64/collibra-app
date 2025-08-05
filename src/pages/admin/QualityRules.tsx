import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Rating,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortByAlphaIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Quality Rule type definition
interface QualityRule {
  id: string;
  name: string;
  description: string;
  domain: string;
  type: 'completeness' | 'accuracy' | 'consistency' | 'timeliness' | 'validity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  implementation: string;
  createdBy: string;
  createdDate: string;
  lastRun?: string;
  successRate?: number;
  failedCount?: number;
  lastIssues?: string[];
}

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const QualityRules: React.FC = () => {
  // State
  const [rules, setRules] = useState<QualityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [currentRule, setCurrentRule] = useState<QualityRule | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Auth context
  const { user } = useAuth();
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);
  
  // Sample data
  const sampleRules: QualityRule[] = [
    {
      id: 'qr-001',
      name: 'Customer Email Validation',
      description: 'Ensures customer email addresses follow proper format',
      domain: 'Customer',
      type: 'validity',
      severity: 'medium',
      enabled: true,
      implementation: 'SQL Regex validation',
      createdBy: 'Data Steward',
      createdDate: '2025-01-10',
      lastRun: '2025-08-02',
      successRate: 97.8,
      failedCount: 45,
      lastIssues: ['Invalid format', 'Missing domain']
    },
    {
      id: 'qr-002',
      name: 'Product Price Range',
      description: 'Validates that product prices fall within expected ranges',
      domain: 'Product',
      type: 'validity',
      severity: 'high',
      enabled: true,
      implementation: 'Stored procedure with range checks',
      createdBy: 'Product Steward',
      createdDate: '2025-02-15',
      lastRun: '2025-08-01',
      successRate: 99.5,
      failedCount: 12,
      lastIssues: ['Price below minimum threshold']
    },
    {
      id: 'qr-003',
      name: 'Order Completeness Check',
      description: 'Ensures all required order fields are populated',
      domain: 'Sales',
      type: 'completeness',
      severity: 'critical',
      enabled: true,
      implementation: 'Python data quality pipeline',
      createdBy: 'Sales Data Owner',
      createdDate: '2025-03-01',
      lastRun: '2025-08-03',
      successRate: 95.2,
      failedCount: 128,
      lastIssues: ['Missing shipping address', 'Missing payment info']
    },
    {
      id: 'qr-004',
      name: 'Date Consistency Check',
      description: 'Verifies that transaction dates are consistent with business rules',
      domain: 'Finance',
      type: 'consistency',
      severity: 'high',
      enabled: true,
      implementation: 'SQL temporal logic validation',
      createdBy: 'Finance Data Steward',
      createdDate: '2025-01-20',
      lastRun: '2025-08-02',
      successRate: 98.9,
      failedCount: 32,
      lastIssues: ['Future dated transactions', 'Invalid fiscal period']
    },
    {
      id: 'qr-005',
      name: 'Employee ID Format',
      description: 'Validates that employee IDs follow the company standard format',
      domain: 'HR',
      type: 'accuracy',
      severity: 'medium',
      enabled: false,
      implementation: 'Java validation service',
      createdBy: 'HR Data Owner',
      createdDate: '2025-02-05',
      lastRun: '2025-07-15',
      successRate: 96.7,
      failedCount: 18,
      lastIssues: ['Legacy format detected', 'Invalid department code']
    },
    {
      id: 'qr-006',
      name: 'Inventory Update Timeliness',
      description: 'Ensures inventory updates occur within expected timeframes',
      domain: 'Inventory',
      type: 'timeliness',
      severity: 'high',
      enabled: true,
      implementation: 'Event-driven monitor',
      createdBy: 'Inventory Manager',
      createdDate: '2025-04-10',
      lastRun: '2025-08-03',
      successRate: 91.4,
      failedCount: 87,
      lastIssues: ['Delayed updates', 'Missing daily reconciliation']
    },
    {
      id: 'qr-007',
      name: 'Location Data Accuracy',
      description: 'Validates address and GPS coordinates against reference data',
      domain: 'Location',
      type: 'accuracy',
      severity: 'medium',
      enabled: true,
      implementation: 'GIS validation service',
      createdBy: 'Data Quality Team',
      createdDate: '2025-03-15',
      lastRun: '2025-07-30',
      successRate: 94.8,
      failedCount: 65,
      lastIssues: ['Invalid coordinates', 'Unresolvable addresses']
    },
    {
      id: 'qr-008',
      name: 'Product Metadata Completeness',
      description: 'Checks that all required product metadata fields are populated',
      domain: 'Product',
      type: 'completeness',
      severity: 'medium',
      enabled: true,
      implementation: 'Apache NiFi workflow',
      createdBy: 'Product Data Steward',
      createdDate: '2025-02-20',
      lastRun: '2025-08-01',
      successRate: 97.2,
      failedCount: 43,
      lastIssues: ['Missing dimensions', 'Missing category']
    },
    {
      id: 'qr-009',
      name: 'Financial Transaction Balance',
      description: 'Ensures credits and debits balance correctly',
      domain: 'Finance',
      type: 'consistency',
      severity: 'critical',
      enabled: true,
      implementation: 'Financial reconciliation service',
      createdBy: 'Financial Controller',
      createdDate: '2025-01-05',
      lastRun: '2025-08-04',
      successRate: 99.9,
      failedCount: 3,
      lastIssues: ['Rounding error']
    },
    {
      id: 'qr-010',
      name: 'Customer Duplicate Detection',
      description: 'Identifies potential duplicate customer records',
      domain: 'Customer',
      type: 'accuracy',
      severity: 'low',
      enabled: false,
      implementation: 'Fuzzy matching algorithm',
      createdBy: 'CRM Data Owner',
      createdDate: '2025-05-01',
      lastRun: '2025-06-15',
      successRate: 89.5,
      failedCount: 215,
      lastIssues: ['False positives', 'Similar names with different accounts']
    }
  ];
  
  // Load rules
  const fetchRules = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter based on search and filters
      let filtered = [...sampleRules];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(rule => 
          rule.name.toLowerCase().includes(searchLower) ||
          rule.description.toLowerCase().includes(searchLower) ||
          rule.domain.toLowerCase().includes(searchLower) ||
          rule.implementation.toLowerCase().includes(searchLower)
        );
      }
      
      if (domainFilter !== 'all') {
        filtered = filtered.filter(rule => rule.domain === domainFilter);
      }
      
      if (typeFilter !== 'all') {
        filtered = filtered.filter(rule => rule.type === typeFilter);
      }
      
      if (severityFilter !== 'all') {
        filtered = filtered.filter(rule => rule.severity === severityFilter);
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(rule => 
          (statusFilter === 'enabled' && rule.enabled) || 
          (statusFilter === 'disabled' && !rule.enabled)
        );
      }
      
      setRules(filtered);
    } catch (err) {
      console.error("Error fetching quality rules:", err);
      setError("Failed to load quality rules. Please try again later.");
      setRules([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, domainFilter, typeFilter, severityFilter, statusFilter]);
  
  // Fetch on mount and when filters change
  useEffect(() => {
    fetchRules();
  }, [fetchRules]);
  
  // Get all unique domains
  const domains = Array.from(
    new Set(sampleRules.map(rule => rule.domain))
  );
  
  // Handle edit rule
  const handleEdit = (rule: QualityRule) => {
    setCurrentRule(rule);
    setDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      // In a real app, this would call an API to delete the rule
      const updatedRules = rules.filter(rule => rule.id !== ruleToDelete);
      setRules(updatedRules);
    }
    setDeleteConfirmOpen(false);
  };
  
  // Toggle rule status
  const toggleRuleStatus = (id: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, enabled: !rule.enabled };
      }
      return rule;
    });
    setRules(updatedRules);
  };
  
  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get severity chip color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
      case 'medium':
        return { bg: '#FFF3E0', color: '#E65100' }; // Orange
      case 'high':
        return { bg: '#FFF8E1', color: '#FF8F00' }; // Amber
      case 'critical':
        return { bg: '#FFEBEE', color: '#C62828' }; // Red
      default:
        return { bg: '#E8F5E9', color: '#2E7D32' }; // Default to green
    }
  };
  
  // Get type chip color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'completeness':
        return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
      case 'accuracy':
        return { bg: '#E3F2FD', color: '#1976D2' }; // Blue
      case 'consistency':
        return { bg: '#E8EAF6', color: '#3F51B5' }; // Indigo
      case 'timeliness':
        return { bg: '#FFF3E0', color: '#E65100' }; // Orange
      case 'validity':
        return { bg: '#F3E5F5', color: '#7B1FA2' }; // Purple
      default:
        return { bg: '#ECEFF1', color: '#546E7A' }; // Blue Grey
    }
  };
  
  return (
    <Container sx={{ py: 4 }} className="quality-rules-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Data Quality Rules Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage and monitor data quality rules that validate your data assets.
      </Typography>
      
      {/* Search and Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search quality rules..."
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
              aria-label="Search quality rules"
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 1 }}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentRule(null);
                setDialogOpen(true);
              }}
              aria-label="Add new quality rule"
            >
              Add Rule
            </Button>
          </Grid>
          
          {/* Extended filters */}
          {showFilters && (
            <Grid item xs={12} id="filter-panel" aria-label="Filter options">
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="domain-filter-label">Domain</InputLabel>
                  <Select
                    labelId="domain-filter-label"
                    value={domainFilter}
                    label="Domain"
                    onChange={(e) => setDomainFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Domains</MenuItem>
                    {domains.map((domain) => (
                      <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="type-filter-label">Rule Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={typeFilter}
                    label="Rule Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="completeness">Completeness</MenuItem>
                    <MenuItem value="accuracy">Accuracy</MenuItem>
                    <MenuItem value="consistency">Consistency</MenuItem>
                    <MenuItem value="timeliness">Timeliness</MenuItem>
                    <MenuItem value="validity">Validity</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="severity-filter-label">Severity</InputLabel>
                  <Select
                    labelId="severity-filter-label"
                    value={severityFilter}
                    label="Severity"
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Severities</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="enabled">Enabled</MenuItem>
                    <MenuItem value="disabled">Disabled</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    setDomainFilter('all');
                    setTypeFilter('all');
                    setSeverityFilter('all');
                    setStatusFilter('all');
                    setSearchText('');
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading quality rules" />
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
            {rules.length === 0
              ? 'No quality rules found matching your criteria.'
              : `Showing ${rules.length} quality rule${rules.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Quality rules table */}
      {!loading && !error && rules.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Quality rules table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Rule Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Domain</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Success Rate</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Last Run</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => {
                const severityColors = getSeverityColor(rule.severity);
                const typeColors = getTypeColor(rule.type);
                
                return (
                  <TableRow key={rule.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{rule.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{rule.description}</Typography>
                    </TableCell>
                    <TableCell>{rule.domain}</TableCell>
                    <TableCell>
                      <Chip 
                        label={rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} 
                        size="small" 
                        sx={{ backgroundColor: typeColors.bg, color: typeColors.color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)} 
                        size="small" 
                        sx={{ backgroundColor: severityColors.bg, color: severityColors.color }}
                      />
                    </TableCell>
                    <TableCell>
                      {rule.successRate !== undefined ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: '45px' }}>
                            {rule.successRate}%
                          </Typography>
                          <Box sx={{ ml: 1, width: 100 }}>
                            <Box
                              sx={{
                                height: 6,
                                width: '100%',
                                backgroundColor: '#e0e0e0',
                                borderRadius: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${rule.successRate}%`,
                                  backgroundColor: 
                                    rule.successRate >= 95 ? '#4caf50' : 
                                    rule.successRate >= 90 ? '#ff9800' : 
                                    '#f44336',
                                  borderRadius: 3,
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{formatDate(rule.lastRun)}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rule.enabled}
                            onChange={() => toggleRuleStatus(rule.id)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={rule.enabled ? "Enabled" : "Disabled"}
                        sx={{ m: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Run now">
                          <IconButton 
                            size="small" 
                            color="primary"
                            aria-label={`Run ${rule.name} rule now`}
                          >
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit rule">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleEdit(rule)}
                            aria-label={`Edit ${rule.name} rule`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete rule">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(rule.id)}
                            aria-label={`Delete ${rule.name} rule`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Edit/Create Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        aria-labelledby="rule-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="rule-dialog-title">
          {currentRule ? 'Edit Quality Rule' : 'Create New Quality Rule'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {currentRule ? 
              'Update the quality rule details below.' : 
              'Fill in the details to create a new quality rule.'}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            The full form implementation would be added here in a production environment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setDialogOpen(false)}
          >
            {currentRule ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this quality rule? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QualityRules;

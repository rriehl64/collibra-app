/**
 * Domain Types Admin Page
 * 
 * Displays and manages data domain types with full accessibility support
 * and consistent styling with other admin pages.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress, 
  Box, 
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
// Import auth context
import { useAuth } from '../../contexts/AuthContext';

// Inline implementation of useDebounce hook to avoid module resolution issues
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

// Domain Type definition
interface DomainType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  parentTypeId?: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  attributes?: string[];
  usageCount?: number;
}

const DomainTypes: React.FC = () => {
  // State management
  const [domainTypes, setDomainTypes] = useState<DomainType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentDomainType, setCurrentDomainType] = useState<DomainType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [domainTypeToDelete, setDomainTypeToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Auth context for user permissions
  const { user } = useAuth();
  
  // Debounced search text to prevent excessive API calls
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - in a real app this would come from an API
  const sampleDomainTypes: DomainType[] = [
    {
      id: 'dt-001',
      name: 'Business',
      description: 'Business domain types encompass all data related to core business operations.',
      status: 'active',
      createdBy: 'Admin User',
      createdDate: '2025-01-15',
      updatedBy: 'Admin User',
      updatedDate: '2025-07-20',
      attributes: ['Industry', 'Department', 'Function'],
      usageCount: 42
    },
    {
      id: 'dt-002',
      name: 'Technical',
      description: 'Technical domain types contain data assets related to system infrastructure and technical operations.',
      status: 'active',
      createdBy: 'System Admin',
      createdDate: '2025-01-15',
      attributes: ['Platform', 'Language', 'Protocol'],
      usageCount: 38
    },
    {
      id: 'dt-003',
      name: 'Financial',
      description: 'Financial domain types include all data assets related to financial operations and reporting.',
      status: 'active',
      parentTypeId: 'dt-001',
      createdBy: 'Admin User',
      createdDate: '2025-02-10',
      updatedBy: 'Finance Manager',
      updatedDate: '2025-07-15',
      attributes: ['Currency', 'Fiscal Period', 'Account Type'],
      usageCount: 35
    },
    {
      id: 'dt-004',
      name: 'Customer',
      description: 'Customer domain types include data assets related to customer information and interactions.',
      status: 'active',
      parentTypeId: 'dt-001',
      createdBy: 'CRM Manager',
      createdDate: '2025-02-15',
      attributes: ['Customer Type', 'Geography', 'Segment'],
      usageCount: 29
    },
    {
      id: 'dt-005',
      name: 'Product',
      description: 'Product domain types include data assets related to products and services.',
      status: 'active',
      parentTypeId: 'dt-001',
      createdBy: 'Product Manager',
      createdDate: '2025-03-01',
      updatedBy: 'Data Steward',
      updatedDate: '2025-06-10',
      attributes: ['Product Category', 'SKU', 'Lifecycle Stage'],
      usageCount: 27
    },
    {
      id: 'dt-006',
      name: 'HR',
      description: 'Human Resources domain types include data assets related to employees and HR processes.',
      status: 'active',
      parentTypeId: 'dt-001',
      createdBy: 'HR Manager',
      createdDate: '2025-03-15',
      attributes: ['Employee Type', 'Department', 'Position Level'],
      usageCount: 22
    },
    {
      id: 'dt-007',
      name: 'Infrastructure',
      description: 'Infrastructure domain types include data assets related to IT infrastructure and systems.',
      status: 'active',
      parentTypeId: 'dt-002',
      createdBy: 'IT Manager',
      createdDate: '2025-04-01',
      attributes: ['System Type', 'Hardware', 'Network'],
      usageCount: 18
    },
    {
      id: 'dt-008',
      name: 'Application',
      description: 'Application domain types include data assets related to software applications and services.',
      status: 'active',
      parentTypeId: 'dt-002',
      createdBy: 'Application Manager',
      createdDate: '2025-04-15',
      updatedBy: 'System Admin',
      updatedDate: '2025-06-25',
      attributes: ['App Type', 'Technology Stack', 'User Base'],
      usageCount: 24
    },
    {
      id: 'dt-009',
      name: 'Marketing',
      description: 'Marketing domain types include data assets related to marketing campaigns and activities.',
      status: 'draft',
      parentTypeId: 'dt-001',
      createdBy: 'Marketing Director',
      createdDate: '2025-05-01',
      attributes: ['Campaign Type', 'Channel', 'Target Audience'],
      usageCount: 0
    },
    {
      id: 'dt-010',
      name: 'Legacy Systems',
      description: 'Legacy systems domain types include data assets from legacy or deprecated systems.',
      status: 'inactive',
      parentTypeId: 'dt-002',
      createdBy: 'System Admin',
      createdDate: '2025-01-20',
      updatedBy: 'Data Governance Lead',
      updatedDate: '2025-05-15',
      attributes: ['Original System', 'Migration Status', 'Deprecation Date'],
      usageCount: 7
    }
  ];

  // Function to fetch domain types - would use API in production
  const fetchDomainTypes = useCallback(async () => {
    // Only set loading true if we don't already have domain types loaded (prevents flashing)
    if (domainTypes.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // For development, filter and sort the sample data locally
      let filteredTypes = [...sampleDomainTypes];
      
      // Filter by search text if provided
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filteredTypes = filteredTypes.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          (item.attributes && item.attributes.some(attr => attr.toLowerCase().includes(searchLower)))
        );
      }
      
      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        filteredTypes = filteredTypes.filter(item => item.status === statusFilter);
      }
      
      // Sort the filtered data
      filteredTypes.sort((a, b) => {
        let valA: any = a[sortField as keyof DomainType];
        let valB: any = b[sortField as keyof DomainType];
        
        // Handle string comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
          if (sortDirection === 'asc') {
            return valA.localeCompare(valB);
          } else {
            return valB.localeCompare(valA);
          }
        }
        
        // Handle number comparison
        if (typeof valA === 'number' && typeof valB === 'number') {
          if (sortDirection === 'asc') {
            return valA - valB;
          } else {
            return valB - valA;
          }
        }
        
        // Default comparison
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      
      setDomainTypes(filteredTypes);
    } catch (err) {
      console.error('Failed to fetch domain types:', err);
      setError('Failed to load domain types. Please try again later.');
      setDomainTypes([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, sortField, sortDirection, statusFilter]);

  // Fetch domain types when relevant dependencies change
  useEffect(() => {
    fetchDomainTypes();
  }, [fetchDomainTypes]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Convert internal sort direction to ARIA compliant values
  const getAriaSortValue = (field: string): 'ascending' | 'descending' | undefined => {
    if (sortField !== field) return undefined;
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };
  
  // Handle edit domain type
  const handleEditDomainType = (domainType: DomainType) => {
    setCurrentDomainType(domainType);
    setOpenDialog(true);
  };
  
  // Handle delete domain type
  const handleDeleteClick = (id: string) => {
    setDomainTypeToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm delete domain type
  const handleDeleteConfirm = () => {
    if (domainTypeToDelete) {
      // In a real app, this would call an API to delete the domain type
      const updatedTypes = domainTypes.filter(item => item.id !== domainTypeToDelete);
      setDomainTypes(updatedTypes);
      setSnackbarMessage('Domain type deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setDeleteConfirmOpen(false);
    setDomainTypeToDelete(null);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#E8F5E9', text: '#2E7D32' }; // Green
      case 'inactive':
        return { bg: '#FFEBEE', text: '#C62828' }; // Red
      case 'draft':
        return { bg: '#FFF3E0', text: '#E65100' }; // Orange
      default:
        return { bg: '#E8F5E9', text: '#2E7D32' }; // Default to green
    }
  };
  
  // Get parent type name by ID
  const getParentTypeName = (parentId?: string) => {
    if (!parentId) return 'None';
    const parent = sampleDomainTypes.find(type => type.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  return (
    <Container sx={{ py: 4 }} className="domain-types-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Domain Types Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage data domain type definitions and hierarchies.
      </Typography>

      {/* Admin Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search domain types..."
            size="small"
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
            aria-label="Search domain types"
            sx={{ minWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
              aria-label="Filter by status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentDomainType(null);
            setOpenDialog(true);
          }}
          aria-label="Add new domain type"
        >
          Add Domain Type
        </Button>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading domain types" />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}

      {/* Domain Types Table */}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Domain types table" size="medium">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                  onClick={() => handleSort('name')}
                  style={{ cursor: 'pointer' }}
                  aria-sort={getAriaSortValue('name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                >
                  Description
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                  onClick={() => handleSort('status')}
                  style={{ cursor: 'pointer' }}
                  aria-sort={getAriaSortValue('status')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                >
                  Parent Type
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                  onClick={() => handleSort('usageCount')}
                  style={{ cursor: 'pointer' }}
                  aria-sort={getAriaSortValue('usageCount')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Usage
                    {sortField === 'usageCount' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', color: '#0C1F3F' }}
                  onClick={() => handleSort('createdDate')}
                  style={{ cursor: 'pointer' }}
                  aria-sort={getAriaSortValue('createdDate')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Created
                    {sortField === 'createdDate' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domainTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No domain types found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                domainTypes.map((type) => {
                  const statusColors = getStatusColor(type.status);
                  
                  return (
                    <TableRow key={type.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{type.name}</TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>{type.description}</TableCell>
                      <TableCell>
                        <Chip 
                          label={type.status.charAt(0).toUpperCase() + type.status.slice(1)} 
                          size="small" 
                          sx={{ 
                            backgroundColor: statusColors.bg, 
                            color: statusColors.text,
                            fontWeight: 500 
                          }}
                        />
                      </TableCell>
                      <TableCell>{getParentTypeName(type.parentTypeId)}</TableCell>
                      <TableCell>{type.usageCount || 0}</TableCell>
                      <TableCell>{formatDate(type.createdDate)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            aria-label={`Edit ${type.name} domain type`}
                            onClick={() => handleEditDomainType(type)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            aria-label={`Delete ${type.name} domain type`}
                            onClick={() => handleDeleteClick(type.id)}
                            disabled={type.usageCount ? type.usageCount > 0 : false}
                            title={type.usageCount && type.usageCount > 0 ? 
                              "Cannot delete domain type that is in use" : 
                              `Delete ${type.name} domain type`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Stats Summary */}
      {!loading && !error && domainTypes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {domainTypes.length} domain type{domainTypes.length !== 1 ? 's' : ''}.
            {' '}
            {domainTypes.filter(t => t.status === 'active').length} active,
            {' '}
            {domainTypes.filter(t => t.status === 'draft').length} draft,
            {' '}
            {domainTypes.filter(t => t.status === 'inactive').length} inactive.
          </Typography>
        </Box>
      )}
      
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
            Are you sure you want to delete this domain type? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            color="primary"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create/Edit Dialog - This would be expanded to include a full form in a real implementation */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="domain-type-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="domain-type-dialog-title">
          {currentDomainType ? 'Edit Domain Type' : 'Create Domain Type'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {currentDomainType ? 
              'Update the domain type details below.' : 
              'Fill in the details below to create a new domain type.'}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            The full form implementation would be added here in a production environment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            color="primary"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setSnackbarMessage(currentDomainType ? 
                'Domain type updated successfully' : 
                'New domain type created successfully');
              setSnackbarSeverity('success');
              setSnackbarOpen(true);
            }} 
            color="primary" 
            variant="contained"
            startIcon={<CheckIcon />}
          >
            {currentDomainType ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default DomainTypes;

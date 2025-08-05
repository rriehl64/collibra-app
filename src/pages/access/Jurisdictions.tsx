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
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Jurisdiction interface
interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  type: 'country' | 'state' | 'province' | 'region' | 'other';
  description: string;
  dataRules: number;
  activeAssets: number;
  lastUpdated: string;
  contactEmail?: string;
  parentJurisdiction?: string;
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

const Jurisdictions: React.FC = () => {
  // Auth context
  const { user } = useAuth();
  
  // State
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [filteredJurisdictions, setFilteredJurisdictions] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [jurisdictionTypeFilter, setJurisdictionTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - would come from API
  const sampleJurisdictions: Jurisdiction[] = [
    {
      id: 'jur-001',
      name: 'United States',
      code: 'US',
      type: 'country',
      description: 'Federal jurisdiction of the United States of America',
      dataRules: 15,
      activeAssets: 248,
      lastUpdated: '2025-07-15T14:30:00Z',
      contactEmail: 'us-compliance@example.com'
    },
    {
      id: 'jur-002',
      name: 'California',
      code: 'CA-US',
      type: 'state',
      description: 'State of California, includes CCPA regulations',
      dataRules: 12,
      activeAssets: 87,
      lastUpdated: '2025-07-28T09:45:00Z',
      contactEmail: 'ca-compliance@example.com',
      parentJurisdiction: 'United States'
    },
    {
      id: 'jur-003',
      name: 'European Union',
      code: 'EU',
      type: 'region',
      description: 'European Union jurisdiction, includes GDPR regulations',
      dataRules: 24,
      activeAssets: 176,
      lastUpdated: '2025-08-01T16:20:00Z',
      contactEmail: 'eu-compliance@example.com'
    },
    {
      id: 'jur-004',
      name: 'Germany',
      code: 'DE',
      type: 'country',
      description: 'Federal Republic of Germany, includes GDPR plus national regulations',
      dataRules: 18,
      activeAssets: 53,
      lastUpdated: '2025-07-20T10:15:00Z',
      contactEmail: 'de-compliance@example.com',
      parentJurisdiction: 'European Union'
    },
    {
      id: 'jur-005',
      name: 'New York',
      code: 'NY-US',
      type: 'state',
      description: 'State of New York, includes SHIELD Act regulations',
      dataRules: 9,
      activeAssets: 64,
      lastUpdated: '2025-07-25T11:30:00Z',
      contactEmail: 'ny-compliance@example.com',
      parentJurisdiction: 'United States'
    },
    {
      id: 'jur-006',
      name: 'United Kingdom',
      code: 'UK',
      type: 'country',
      description: 'United Kingdom, includes UK GDPR and Data Protection Act',
      dataRules: 16,
      activeAssets: 89,
      lastUpdated: '2025-08-03T08:45:00Z',
      contactEmail: 'uk-compliance@example.com'
    },
    {
      id: 'jur-007',
      name: 'Ontario',
      code: 'ON-CA',
      type: 'province',
      description: 'Province of Ontario, includes PIPEDA and provincial regulations',
      dataRules: 7,
      activeAssets: 28,
      lastUpdated: '2025-07-10T13:20:00Z',
      contactEmail: 'on-compliance@example.com',
      parentJurisdiction: 'Canada'
    },
    {
      id: 'jur-008',
      name: 'Canada',
      code: 'CA',
      type: 'country',
      description: 'Federal jurisdiction of Canada, includes PIPEDA regulations',
      dataRules: 11,
      activeAssets: 72,
      lastUpdated: '2025-07-18T15:10:00Z',
      contactEmail: 'ca-compliance@example.com'
    },
    {
      id: 'jur-009',
      name: 'Australia',
      code: 'AU',
      type: 'country',
      description: 'Commonwealth of Australia, includes Privacy Act regulations',
      dataRules: 10,
      activeAssets: 47,
      lastUpdated: '2025-08-02T09:30:00Z',
      contactEmail: 'au-compliance@example.com'
    },
    {
      id: 'jur-010',
      name: 'Asia-Pacific Region',
      code: 'APAC',
      type: 'region',
      description: 'Asia-Pacific regional data governance framework',
      dataRules: 8,
      activeAssets: 103,
      lastUpdated: '2025-07-30T16:45:00Z',
      contactEmail: 'apac-compliance@example.com'
    }
  ];

  // Filter jurisdictions based on search and type filter
  const filterJurisdictions = useCallback(() => {
    setLoading(true);
    
    try {
      let filtered = [...sampleJurisdictions];
      
      // Apply type filter
      if (jurisdictionTypeFilter !== 'all') {
        filtered = filtered.filter(j => j.type === jurisdictionTypeFilter);
      }
      
      // Apply text search
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(j => 
          j.name.toLowerCase().includes(searchLower) ||
          j.code.toLowerCase().includes(searchLower) ||
          j.description.toLowerCase().includes(searchLower) ||
          (j.parentJurisdiction && j.parentJurisdiction.toLowerCase().includes(searchLower))
        );
      }
      
      setFilteredJurisdictions(filtered);
    } catch (err) {
      console.error('Error filtering jurisdictions:', err);
      setError('An error occurred while filtering jurisdictions.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, jurisdictionTypeFilter]);

  // Fetch jurisdictions on mount and when filters change
  useEffect(() => {
    filterJurisdictions();
  }, [filterJurisdictions]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get jurisdiction type color and icon
  const getJurisdictionTypeInfo = (type: string) => {
    switch (type) {
      case 'country':
        return { 
          color: '#E3F2FD', 
          textColor: '#1565C0', 
          icon: <PublicIcon fontSize="small" /> 
        };
      case 'state':
      case 'province':
        return { 
          color: '#E8F5E9', 
          textColor: '#2E7D32', 
          icon: <LanguageIcon fontSize="small" /> 
        };
      case 'region':
        return { 
          color: '#FFF3E0', 
          textColor: '#E65100', 
          icon: <LanguageIcon fontSize="small" /> 
        };
      default:
        return { 
          color: '#F5F5F5', 
          textColor: '#616161', 
          icon: <LanguageIcon fontSize="small" /> 
        };
    }
  };

  return (
    <Container sx={{ py: 4 }} className="jurisdictions-management-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Jurisdiction Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage jurisdictions and their data governance rules for regulatory compliance.
      </Typography>
      
      {/* Search and filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search jurisdictions..."
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
              aria-label="Search jurisdictions"
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
                setSelectedJurisdiction(null);
                setEditDialogOpen(true);
              }}
              aria-label="Add new jurisdiction"
            >
              Add Jurisdiction
            </Button>
          </Grid>
          
          {/* Extended filters */}
          {showFilters && (
            <Grid item xs={12} id="filter-panel" aria-label="Filter options">
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Jurisdiction Type"
                  value={jurisdictionTypeFilter}
                  onChange={(e) => setJurisdictionTypeFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="country">Countries</option>
                  <option value="state">States</option>
                  <option value="province">Provinces</option>
                  <option value="region">Regions</option>
                  <option value="other">Other</option>
                </TextField>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    setJurisdictionTypeFilter('all');
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
          <CircularProgress aria-label="Loading jurisdictions" />
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
            {filteredJurisdictions.length === 0
              ? 'No jurisdictions found matching your criteria.'
              : `Showing ${filteredJurisdictions.length} jurisdiction${filteredJurisdictions.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Jurisdictions grid */}
      {!loading && !error && filteredJurisdictions.length > 0 && (
        <Grid container spacing={3}>
          {filteredJurisdictions.map((jurisdiction) => {
            const typeInfo = getJurisdictionTypeInfo(jurisdiction.type);
            
            return (
              <Grid item xs={12} md={6} key={jurisdiction.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            bgcolor: typeInfo.color,
                            color: typeInfo.textColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                          aria-hidden="true"
                        >
                          {typeInfo.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" component="h2">
                            {jurisdiction.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Code: {jurisdiction.code}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Chip 
                        label={jurisdiction.type.charAt(0).toUpperCase() + jurisdiction.type.slice(1)} 
                        size="small"
                        sx={{ 
                          bgcolor: typeInfo.color,
                          color: typeInfo.textColor,
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {jurisdiction.description}
                    </Typography>
                    
                    {jurisdiction.parentJurisdiction && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Parent Jurisdiction:</strong> {jurisdiction.parentJurisdiction}
                      </Typography>
                    )}
                    
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Data Rules:</strong> {jurisdiction.dataRules}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Active Assets:</strong> {jurisdiction.activeAssets}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Contact:</strong> {jurisdiction.contactEmail || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="caption" color="text.secondary">
                      Last Updated: {formatDate(jurisdiction.lastUpdated)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelectedJurisdiction(jurisdiction);
                        setEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setSelectedJurisdiction(jurisdiction);
                        setDeleteDialogOpen(true);
                      }}
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
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Jurisdiction Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the jurisdiction "{selectedJurisdiction?.name}"?
            {selectedJurisdiction && selectedJurisdiction.activeAssets > 0 && (
              <>
                <br /><br />
                <strong>Warning:</strong> This jurisdiction is currently applied to {selectedJurisdiction.activeAssets} asset{selectedJurisdiction.activeAssets === 1 ? '' : 's'}.
                Deleting it will remove all jurisdiction rules from these assets.
              </>
            )}
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            onClick={() => setDeleteDialogOpen(false)}
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit/Create dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        aria-labelledby="jurisdiction-dialog-title"
      >
        <DialogTitle id="jurisdiction-dialog-title">
          {selectedJurisdiction ? `Edit Jurisdiction: ${selectedJurisdiction.name}` : 'Create New Jurisdiction'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedJurisdiction 
              ? 'Modify jurisdiction details below.'
              : 'Define a new jurisdiction with its regulatory framework.'}
          </Typography>
          
          <Typography variant="body2" paragraph sx={{ mt: 2, color: 'info.main' }}>
            This is a placeholder for the jurisdiction edit/create form. In a full implementation, you would:
          </Typography>
          <Typography component="ul" variant="body2">
            <li>Enter jurisdiction name, code, and type</li>
            <li>Define description and contact information</li>
            <li>Select parent jurisdiction if applicable</li>
            <li>Configure data rules and compliance settings</li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setEditDialogOpen(false)}
          >
            {selectedJurisdiction ? 'Save Changes' : 'Create Jurisdiction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Jurisdictions;

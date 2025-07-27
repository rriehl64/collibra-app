import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Popover,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
  Dataset as DatabaseIcon,
  TableChart as TableIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

import { DataAsset, dataAssetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type CertificationType = 'certified' | 'pending' | 'none';

interface Filters {
  types: string[];
  domains: string[];
  statuses: string[];
  certifications: CertificationType[];
}

// Sample data for fallback during development
const sampleDataAssets: DataAsset[] = [
  {
    _id: '1',
    name: 'Customer Data Warehouse',
    type: 'Database',
    domain: 'Customer Analytics',
    owner: 'Sarah Chen',
    lastModified: new Date('2025-01-22'),
    status: 'Production',
    tags: ['PII', 'Customer', 'Sales'],
    certification: 'certified',
  },
  {
    _id: '2',
    name: 'Sales Transactions',
    type: 'Table',
    domain: 'Sales',
    owner: 'Mike Johnson',
    lastModified: new Date('2025-01-21'),
    status: 'Production',
    tags: ['Sales', 'Finance', 'Transactions'],
    certification: 'certified',
  },
  {
    _id: '3',
    name: 'Marketing Campaign Results',
    type: 'Report',
    domain: 'Marketing',
    owner: 'Emma Davis',
    lastModified: new Date('2025-01-20'),
    status: 'Development',
    tags: ['Marketing', 'Analytics'],
    certification: 'pending',
  }
];

const DataCatalog: React.FC = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    domains: [],
    statuses: [],
    certifications: [],
  });
  const [starredAssets, setStarredAssets] = useState<string[]>([]);
  
  // State for API data
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const limit = 10; // Items per page

  // Get unique values for filters from our current data
  const availableTypes = Array.from(new Set(dataAssets.map((asset) => asset.type || '')));
  const availableDomains = Array.from(new Set(dataAssets.map((asset) => asset.domain || '')));
  const availableStatuses = Array.from(new Set(dataAssets.map((asset) => asset.status || '')));

  // Fetch data assets from API
  useEffect(() => {
    const fetchDataAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParams: Record<string, any> = {
          page,
          limit,
          sort: '-lastModified'
        };
        
        // Apply filters if they exist
        if (filters.types.length > 0) {
          searchParams.type = filters.types.join(',');
        }
        
        if (filters.domains.length > 0) {
          searchParams.domain = filters.domains.join(',');
        }
        
        if (filters.statuses.length > 0) {
          searchParams.status = filters.statuses.join(',');
        }
        
        if (filters.certifications.length > 0) {
          searchParams.certification = filters.certifications.join(',');
        }
        
        // If search text exists, use search endpoint
        let result;
        if (searchText.trim()) {
          result = await dataAssetService.searchDataAssets(searchText, searchParams);
        } else {
          result = await dataAssetService.getDataAssets(searchParams);
        }
        
        setDataAssets(result.assets);
        setTotalAssets(result.total);
        setTotalPages(Math.ceil(result.total / limit));
      } catch (err) {
        console.error('Error fetching data assets:', err);
        setError('Failed to load data assets. Please try again.');
        // Fallback to sample data in development
        if (process.env.NODE_ENV === 'development') {
          setDataAssets(sampleDataAssets);
          setTotalAssets(sampleDataAssets.length);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDataAssets();
  }, [searchText, filters, page]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleStar = (id: string) => {
    setStarredAssets(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Handle search with debounce
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    // Reset to first page when search changes
    setPage(1);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Type guard to check if a value is a CertificationType
  const isCertificationType = (value: string): value is CertificationType => {
    return ['certified', 'pending', 'none'].includes(value);
  };

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string,
    checked: boolean
  ) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (checked) {
        if (filterType === 'certifications') {
          // Type check for certifications
          if (isCertificationType(value)) {
            updatedFilters.certifications = [...updatedFilters.certifications, value];
          }
        } else {
          // For other string[] types
          updatedFilters[filterType] = [...updatedFilters[filterType], value] as any;
        }
      } else {
        // Remove value from filter
        if (filterType === 'certifications') {
          updatedFilters.certifications = updatedFilters.certifications.filter(
            item => item !== value
          );
        } else {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            item => item !== value
          ) as any;
        }
      }
      
      return updatedFilters;
    });
    
    // Reset to first page when filters change
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      types: [],
      domains: [],
      statuses: [],
      certifications: [],
    });
  };

  // Filter displayed assets based on tabs
  const displayedAssets = tabValue === 0 
    ? dataAssets 
    : tabValue === 1 
      ? dataAssets.filter(asset => {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return asset.lastModified && new Date(asset.lastModified) >= thirtyDaysAgo;
        })
      : tabValue === 2
        ? dataAssets.filter(asset => asset._id && starredAssets.includes(asset._id))
        : tabValue === 3
          ? dataAssets.filter(asset => asset.certification === 'pending')
          : dataAssets;

  const activeFiltersCount = Object.values(filters).reduce(
    (count, filterArray) => count + filterArray.length,
    0
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 2,
          pb: 6,
          boxShadow: 1,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Data Catalog
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and discover data assets across the organization
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Search Bar */}
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              bgcolor: 'white'
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Search data assets, owners, domains..."
              variant="standard"
              InputProps={{ 
                disableUnderline: true,
                'aria-label': 'search data assets'
              }}
              value={searchText}
              onChange={handleSearch}
            />
            <IconButton 
              sx={{ p: '10px' }}
              onClick={handleFilterClick}
              color={activeFiltersCount > 0 ? "primary" : "default"}
              aria-label="filter list"
              aria-haspopup="true"
              aria-controls="filter-menu"
              aria-expanded={Boolean(filterAnchorEl)}
            >
              <FilterIcon />
              {activeFiltersCount > 0 && (
                <Chip
                  size="small"
                  label={activeFiltersCount}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: 20,
                    minWidth: 20,
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </IconButton>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="data asset categories"
            >
              <Tab label="All Assets" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Recently Modified" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Favorites" id="tab-2" aria-controls="tabpanel-2" />
              <Tab label="Pending Certification" id="tab-3" aria-controls="tabpanel-3" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Filters Popover */}
        <Popover
          id="filter-menu"
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 3, maxWidth: 400, maxHeight: 400, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Filters</Typography>
              <Button 
                size="small" 
                onClick={handleClearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {/* Types Filter */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Asset Type
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              {availableTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={filters.types.includes(type)}
                      onChange={(e) => handleFilterChange('types', type, e.target.checked)}
                      size="small"
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
            
            {/* Domains Filter */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Domain
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              {availableDomains.map((domain) => (
                <FormControlLabel
                  key={domain}
                  control={
                    <Checkbox
                      checked={filters.domains.includes(domain)}
                      onChange={(e) => handleFilterChange('domains', domain, e.target.checked)}
                      size="small"
                    />
                  }
                  label={domain}
                />
              ))}
            </FormGroup>
            
            {/* Status Filter */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Status
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              {availableStatuses.map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={filters.statuses.includes(status)}
                      onChange={(e) => handleFilterChange('statuses', status, e.target.checked)}
                      size="small"
                    />
                  }
                  label={status}
                />
              ))}
            </FormGroup>
            
            {/* Certification Filter */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Certification
            </Typography>
            <FormGroup>
              {(['certified', 'pending', 'none'] as CertificationType[]).map((cert) => (
                <FormControlLabel
                  key={cert}
                  control={
                    <Checkbox
                      checked={filters.certifications.includes(cert)}
                      onChange={(e) => handleFilterChange('certifications', cert, e.target.checked)}
                      size="small"
                    />
                  }
                  label={cert === 'certified' ? 'Certified' : cert === 'pending' ? 'Pending Certification' : 'Not Certified'}
                />
              ))}
            </FormGroup>
          </Box>
        </Popover>
        
        {/* Data Assets Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="data assets table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress aria-label="Loading data assets" />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : displayedAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Typography>No data assets found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                displayedAssets.map((asset) => (
                  <TableRow key={asset._id} hover>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => asset._id && handleToggleStar(asset._id)}
                        aria-label={asset._id && starredAssets.includes(asset._id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {asset._id && starredAssets.includes(asset._id) ? <StarIcon color="primary" /> : <StarBorderIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{asset.name}</Typography>
                        {asset.certification === 'certified' && (
                          <Chip 
                            size="small" 
                            label="Certified" 
                            color="primary" 
                            sx={{ height: 20 }} 
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.domain}</TableCell>
                    <TableCell>{asset.owner}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={asset.status} 
                        color={asset.status === 'Production' ? 'success' : 'warning'}
                        sx={{ height: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {asset.tags && asset.tags.map((tag) => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ height: 20 }} 
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {asset.lastModified 
                        ? new Date(asset.lastModified).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              showFirstButton 
              showLastButton
              aria-label="Data catalog pagination"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DataCatalog;

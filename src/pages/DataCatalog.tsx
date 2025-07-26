import React, { useState } from 'react';
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

type CertificationType = 'certified' | 'pending' | 'none';

interface DataAsset {
  id: string;
  name: string;
  type: string;
  domain: string;
  owner: string;
  lastModified: string;
  status: string;
  tags: string[];
  certification: CertificationType;
}

interface Filters {
  types: string[];
  domains: string[];
  statuses: string[];
  certifications: CertificationType[];
}

const mockDataAssets: DataAsset[] = [
  {
    id: '1',
    name: 'Customer Data Warehouse',
    type: 'Database',
    domain: 'Customer Analytics',
    owner: 'Sarah Chen',
    lastModified: '2025-01-22',
    status: 'Production',
    tags: ['PII', 'Customer', 'Sales'],
    certification: 'certified',
  },
  {
    id: '2',
    name: 'Sales Transactions',
    type: 'Table',
    domain: 'Sales',
    owner: 'Mike Johnson',
    lastModified: '2025-01-21',
    status: 'Production',
    tags: ['Sales', 'Finance', 'Transactions'],
    certification: 'certified',
  },
  {
    id: '3',
    name: 'Marketing Campaign Results',
    type: 'Report',
    domain: 'Marketing',
    owner: 'Emma Davis',
    lastModified: '2025-01-20',
    status: 'Development',
    tags: ['Marketing', 'Analytics'],
    certification: 'pending',
  },
  {
    id: '4',
    name: 'Product Inventory Database',
    type: 'Database',
    domain: 'Supply Chain',
    owner: 'Alex Thompson',
    lastModified: '2025-01-19',
    status: 'Production',
    tags: ['Inventory', 'Products', 'Supply Chain'],
    certification: 'certified',
  },
  {
    id: '5',
    name: 'HR Employee Records',
    type: 'Table',
    domain: 'Human Resources',
    owner: 'Maria Garcia',
    lastModified: '2025-01-18',
    status: 'Production',
    tags: ['HR', 'PII', 'Employees'],
    certification: 'certified',
  },
  {
    id: '6',
    name: 'Financial Reports Q4 2024',
    type: 'Report',
    domain: 'Finance',
    owner: 'David Kim',
    lastModified: '2025-01-17',
    status: 'Production',
    tags: ['Finance', 'Quarterly Reports'],
    certification: 'certified',
  },
  {
    id: '7',
    name: 'Customer Feedback Analysis',
    type: 'Report',
    domain: 'Customer Experience',
    owner: 'Rachel Brown',
    lastModified: '2025-01-16',
    status: 'Development',
    tags: ['Customer', 'Feedback', 'Analytics'],
    certification: 'pending',
  },
  {
    id: '8',
    name: 'Supply Chain Metrics',
    type: 'Dashboard',
    domain: 'Supply Chain',
    owner: 'Tom Wilson',
    lastModified: '2025-01-15',
    status: 'Production',
    tags: ['Supply Chain', 'Metrics', 'KPI'],
    certification: 'certified',
  },
  {
    id: '9',
    name: 'Product Catalog Master',
    type: 'Table',
    domain: 'Product Management',
    owner: 'Lisa Zhang',
    lastModified: '2025-01-14',
    status: 'Production',
    tags: ['Products', 'Catalog', 'Master Data'],
    certification: 'certified',
  },
  {
    id: '10',
    name: 'Social Media Analytics',
    type: 'Dashboard',
    domain: 'Marketing',
    owner: 'James Wilson',
    lastModified: '2025-01-13',
    status: 'Development',
    tags: ['Social Media', 'Marketing', 'Analytics'],
    certification: 'pending',
  },
  {
    id: '11',
    name: 'Vendor Management System',
    type: 'Database',
    domain: 'Procurement',
    owner: 'Sophie Martin',
    lastModified: '2025-01-12',
    status: 'Production',
    tags: ['Vendors', 'Procurement', 'Contracts'],
    certification: 'certified',
  },
  {
    id: '12',
    name: 'Customer Service Logs',
    type: 'Table',
    domain: 'Customer Support',
    owner: 'Chris Taylor',
    lastModified: '2025-01-11',
    status: 'Production',
    tags: ['Customer Support', 'Service', 'Logs'],
    certification: 'certified',
  },
  {
    id: '13',
    name: 'Compliance Documentation',
    type: 'Document',
    domain: 'Legal',
    owner: 'Patricia Lee',
    lastModified: '2025-01-10',
    status: 'Production',
    tags: ['Legal', 'Compliance', 'Documentation'],
    certification: 'certified',
  }
];

const DataCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    domains: [],
    statuses: [],
    certifications: [],
  });

  // Extract unique values for filters
  const uniqueTypes = Array.from(new Set(mockDataAssets.map(asset => asset.type)));
  const uniqueDomains = Array.from(new Set(mockDataAssets.map(asset => asset.domain)));
  const uniqueStatuses = Array.from(new Set(mockDataAssets.map(asset => asset.status)));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string | CertificationType
  ) => {
    setFilters(prev => {
      if (filterType === 'certifications' && typeof value !== 'string') {
        const certArray = prev.certifications;
        return {
          ...prev,
          certifications: certArray.includes(value)
            ? certArray.filter(item => item !== value)
            : [...certArray, value]
        };
      }
      
      if (filterType !== 'certifications' && typeof value === 'string') {
        const array = prev[filterType] as string[];
        return {
          ...prev,
          [filterType]: array.includes(value)
            ? array.filter(item => item !== value)
            : [...array, value]
        };
      }
      
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      domains: [],
      statuses: [],
      certifications: [],
    });
  };

  const filteredAssets = mockDataAssets.filter(asset => {
    const searchMatch = !searchTerm || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const typeMatch = filters.types.length === 0 || filters.types.includes(asset.type);
    const domainMatch = filters.domains.length === 0 || filters.domains.includes(asset.domain);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(asset.status);
    const certificationMatch = filters.certifications.length === 0 || filters.certifications.includes(asset.certification);

    // Tab-specific filtering
    const tabMatch = (() => {
      switch (currentTab) {
        case 0: // All Assets
          return true;
        case 1: // Recently Modified
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(asset.lastModified) >= thirtyDaysAgo;
        case 2: // Favorites
          return favorites.includes(asset.id);
        case 3: // Pending Certification
          return asset.certification === 'pending';
        default:
          return true;
      }
    })();

    return searchMatch && typeMatch && domainMatch && statusMatch && certificationMatch && tabMatch;
  });

  const activeFiltersCount = Object.values(filters).reduce(
    (count, filterArray) => count + filterArray.length,
    0
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 6,
        mb: 4,
        mt: 8
      }}>
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Data Catalog
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Discover, understand, and manage your data assets in one place
          </Typography>
          
          {/* Search Bar */}
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              bgcolor: 'white'
            }}
          >
            <IconButton sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Search data assets, owners, domains..."
              variant="standard"
              InputProps={{ 
                disableUnderline: true,
                sx: { color: 'text.primary' }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton 
              sx={{ p: '10px' }}
              onClick={handleFilterClick}
              color={activeFiltersCount > 0 ? "primary" : "default"}
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
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <DatabaseIcon />, label: 'Total Assets', value: '2,547' },
            { icon: <TableIcon />, label: 'Data Tables', value: '1,283' },
            { icon: <TimelineIcon />, label: 'Reports', value: '864' },
            { icon: <DescriptionIcon />, label: 'Documents', value: '400' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="h4" component="div">{stat.value}</Typography>
                    <Typography color="text.secondary">{stat.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="All Assets" />
            <Tab label="Recently Modified" />
            <Tab label="Favorites" />
            <Tab label="Pending Certification" />
          </Tabs>
        </Box>

        {/* Data Assets Table */}
        <TableContainer component={Paper} sx={{ mb: 4, mt: 2 }}>
          <Table>
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
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => toggleFavorite(asset.id)}
                      sx={{ color: 'primary.main' }}
                    >
                      {favorites.includes(asset.id) ? <StarIcon /> : <StarBorderIcon />}
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
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {asset.tags.map(tag => (
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
                  <TableCell>{asset.lastModified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<StorageIcon />}
          >
            Register New Asset
          </Button>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
          >
            Import Metadata
          </Button>
        </Box>
      </Container>

      {/* Filter Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Button size="small" onClick={clearFilters}>Clear all</Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Type</Typography>
          <FormGroup>
            {uniqueTypes.map(type => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={filters.types.includes(type)}
                    onChange={() => handleFilterChange('types', type)}
                    size="small"
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Domain</Typography>
          <FormGroup>
            {uniqueDomains.map(domain => (
              <FormControlLabel
                key={domain}
                control={
                  <Checkbox
                    checked={filters.domains.includes(domain)}
                    onChange={() => handleFilterChange('domains', domain)}
                    size="small"
                  />
                }
                label={domain}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Status</Typography>
          <FormGroup>
            {uniqueStatuses.map(status => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={filters.statuses.includes(status)}
                    onChange={() => handleFilterChange('statuses', status)}
                    size="small"
                  />
                }
                label={status}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Certification</Typography>
          <FormGroup>
            {(['certified', 'pending', 'none'] as const).map((cert) => (
              <FormControlLabel
                key={cert}
                control={
                  <Checkbox
                    checked={filters.certifications.includes(cert)}
                    onChange={() => handleFilterChange('certifications', cert)}
                    size="small"
                  />
                }
                label={cert.charAt(0).toUpperCase() + cert.slice(1)}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>
    </Box>
  );
};

export default DataCatalog;

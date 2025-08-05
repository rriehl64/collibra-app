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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  FilterList as FilterListIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  CategoryOutlined as CategoryOutlinedIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Permission type definition
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  roleCount: number;
  systemDefault: boolean;
  createdAt: string;
  updatedAt: string;
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

// TabPanel component for categories
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
      id={`permission-tabpanel-${index}`}
      aria-labelledby={`permission-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `permission-tab-${index}`,
    'aria-controls': `permission-tabpanel-${index}`,
  };
}

const Permissions: React.FC = () => {
  // Auth context
  const { user } = useAuth();

  // State
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showSystemPermissions, setShowSystemPermissions] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - would come from API
  const samplePermissions: Permission[] = [
    {
      id: 'perm-001',
      name: 'View Users',
      description: 'Can view list of users and their basic details',
      category: 'User Management',
      roleCount: 3,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-002',
      name: 'Create User',
      description: 'Can create new user accounts',
      category: 'User Management',
      roleCount: 2,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-003',
      name: 'Edit User',
      description: 'Can edit existing user details',
      category: 'User Management',
      roleCount: 2,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-004',
      name: 'Delete User',
      description: 'Can delete user accounts',
      category: 'User Management',
      roleCount: 1,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-005',
      name: 'Assign Roles',
      description: 'Can assign roles to users',
      category: 'Role Management',
      roleCount: 2,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-006',
      name: 'View Roles',
      description: 'Can view list of roles and their permissions',
      category: 'Role Management',
      roleCount: 4,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-007',
      name: 'Create Role',
      description: 'Can create new roles',
      category: 'Role Management',
      roleCount: 1,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-008',
      name: 'Edit Role',
      description: 'Can edit existing roles',
      category: 'Role Management',
      roleCount: 1,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-009',
      name: 'Delete Role',
      description: 'Can delete roles',
      category: 'Role Management',
      roleCount: 1,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-010',
      name: 'View Assets',
      description: 'Can view data assets',
      category: 'Asset Management',
      roleCount: 6,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-011',
      name: 'Create Asset',
      description: 'Can create data assets',
      category: 'Asset Management',
      roleCount: 3,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-012',
      name: 'Edit Asset',
      description: 'Can edit data assets',
      category: 'Asset Management',
      roleCount: 3,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-013',
      name: 'Delete Asset',
      description: 'Can delete data assets',
      category: 'Asset Management',
      roleCount: 2,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-014',
      name: 'Approve Workflows',
      description: 'Can approve workflow stages',
      category: 'Workflow',
      roleCount: 3,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-015',
      name: 'System Settings',
      description: 'Can access and modify system settings',
      category: 'System',
      roleCount: 1,
      systemDefault: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'perm-016',
      name: 'Comment on Assets',
      description: 'Can add comments to assets',
      category: 'Asset Management',
      roleCount: 5,
      systemDefault: false,
      createdAt: '2024-02-10T14:22:00Z',
      updatedAt: '2024-02-10T14:22:00Z'
    },
    {
      id: 'perm-017',
      name: 'View Finance Data',
      description: 'Access to finance data assets',
      category: 'Domain Specific',
      roleCount: 1,
      systemDefault: false,
      createdAt: '2024-04-05T09:30:00Z',
      updatedAt: '2024-04-05T09:30:00Z'
    },
    {
      id: 'perm-018',
      name: 'Export Reports',
      description: 'Can export financial reports',
      category: 'Reporting',
      roleCount: 1,
      systemDefault: false,
      createdAt: '2024-04-05T09:35:00Z',
      updatedAt: '2024-04-05T09:35:00Z'
    },
    {
      id: 'perm-019',
      name: 'View Marketing Data',
      description: 'Access to marketing data assets',
      category: 'Domain Specific',
      roleCount: 1,
      systemDefault: false,
      createdAt: '2024-05-12T10:45:00Z',
      updatedAt: '2024-05-12T10:45:00Z'
    },
    {
      id: 'perm-020',
      name: 'Create Campaigns',
      description: 'Can create marketing campaigns',
      category: 'Domain Specific',
      roleCount: 1,
      systemDefault: false,
      createdAt: '2024-05-12T10:50:00Z',
      updatedAt: '2024-05-12T10:50:00Z'
    },
    {
      id: 'perm-021',
      name: 'Reset Passwords',
      description: 'Can reset user passwords',
      category: 'User Management',
      roleCount: 1,
      systemDefault: false,
      createdAt: '2024-03-20T11:15:00Z',
      updatedAt: '2024-03-20T11:15:00Z'
    },
  ];

  // Extract unique categories for tabs
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(samplePermissions.map(p => p.category)));
    setCategories(['All', ...uniqueCategories]);
  }, []);

  // Filter permissions based on search, tabs, and toggles
  const filterPermissions = useCallback(() => {
    setLoading(true);

    try {
      let filtered = [...samplePermissions];

      // Filter by system permission toggle
      if (!showSystemPermissions) {
        filtered = filtered.filter(permission => !permission.systemDefault);
      }

      // Apply category filter (tab)
      if (tabValue > 0 && categories.length > 1) {
        const selectedCategory = categories[tabValue];
        filtered = filtered.filter(permission => permission.category === selectedCategory);
      }

      // Apply text search
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(permission => 
          permission.name.toLowerCase().includes(searchLower) ||
          permission.description.toLowerCase().includes(searchLower)
        );
      }

      setFilteredPermissions(filtered);
    } catch (err) {
      console.error('Error filtering permissions:', err);
      setError('An error occurred while filtering permissions.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, tabValue, showSystemPermissions, categories]);

  // Fetch permissions on mount and when filters change
  useEffect(() => {
    filterPermissions();
  }, [filterPermissions]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle action menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, permission: Permission) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedPermission(permission);
  };
  
  // Handle action menu close
  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  return (
    <Container sx={{ py: 4 }} className="permissions-management-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Permission Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage individual permissions that can be assigned to roles. Each permission grants access to specific functionality.
      </Typography>
      
      {/* Search and filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search permissions..."
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
              aria-label="Search permissions"
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showSystemPermissions}
                  onChange={(e) => setShowSystemPermissions(e.target.checked)}
                  color="primary"
                />
              }
              label="Show System Permissions"
              aria-label="Toggle system permissions visibility"
            />
          </Grid>
          
          <Grid item xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              aria-label="Create new permission"
              onClick={() => setEditDialogOpen(true)}
            >
              Add Permission
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Category tabs */}
      {categories.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="Permission category tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category, index) => (
              <Tab 
                key={category} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {index === 0 ? null : <CategoryOutlinedIcon fontSize="small" sx={{ mr: 1 }} />}
                    {category}
                  </Box>
                } 
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
      )}
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading permissions" />
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
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredPermissions.length === 0
              ? 'No permissions found matching your criteria.'
              : `Showing ${filteredPermissions.length} permission${filteredPermissions.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* TabPanel for each category */}
      {!loading && !error && filteredPermissions.length > 0 && (
        <TabPanel value={tabValue} index={tabValue}>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table aria-label="Permissions table">
              <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Permission Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Description</TableCell>
                  {tabValue === 0 && (
                    <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Category</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }} align="center">Used In Roles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }} align="center">System Default</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {permission.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {permission.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(permission.createdAt)}
                      </Typography>
                    </TableCell>
                    {tabValue === 0 && (
                      <TableCell>
                        <Chip 
                          label={permission.category} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#E3F2FD',
                            color: '#0D47A1'
                          }} 
                        />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Tooltip title={`Used in ${permission.roleCount} role${permission.roleCount !== 1 ? 's' : ''}`}>
                        <Chip 
                          label={permission.roleCount} 
                          size="small"
                          sx={{ 
                            minWidth: 30,
                            backgroundColor: permission.roleCount > 0 ? '#E8F5E9' : '#F5F5F5',
                            color: permission.roleCount > 0 ? '#2E7D32' : '#757575'
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {permission.systemDefault ? (
                        <CheckIcon color="success" fontSize="small" />
                      ) : (
                        <CloseIcon color="disabled" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        aria-label={`Actions for ${permission.name}`}
                        onClick={(e) => handleMenuOpen(e, permission)}
                        disabled={permission.systemDefault}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      )}
      
      {/* Action menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            setEditDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit Permission</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Delete Permission</Typography>
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Permission Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the permission "{selectedPermission?.name}"? 
            {selectedPermission && selectedPermission.roleCount > 0 && (
              <>
                <br /><br />
                <strong>Warning:</strong> This permission is currently used in {selectedPermission.roleCount} role{selectedPermission.roleCount === 1 ? '' : 's'}.
                Deleting it will remove this capability from those roles.
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
      
      {/* Edit/Create Permission Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        aria-labelledby="permission-dialog-title"
      >
        <DialogTitle id="permission-dialog-title">
          {selectedPermission ? `Edit Permission: ${selectedPermission.name}` : 'Create New Permission'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedPermission 
              ? 'Modify permission details below.'
              : 'Define a new permission that can be assigned to roles.'}
          </Typography>
          
          <Typography variant="body2" paragraph sx={{ mt: 2, color: 'info.main' }}>
            This is a placeholder for the permission edit/create form. In a full implementation, you would:
          </Typography>
          <Typography component="ul" variant="body2">
            <li>Edit permission name and description</li>
            <li>Select the permission category</li>
            <li>Configure any specific parameters for the permission</li>
            <li>View roles that currently use this permission</li>
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
            {selectedPermission ? 'Save Changes' : 'Create Permission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Permissions;

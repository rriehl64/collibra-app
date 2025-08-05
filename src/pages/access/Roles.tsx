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
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Security as SecurityIcon,
  PeopleAlt as PeopleAltIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Role type definition
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  system: boolean;
}

// Permission type definition
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}

// Permission category type
interface PermissionCategory {
  name: string;
  permissions: Permission[];
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

const Roles: React.FC = () => {
  // Auth context
  const { user } = useAuth();

  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showSystemRoles, setShowSystemRoles] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedPermissions, setExpandedPermissions] = useState<Record<string, boolean>>({});
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);

  // Sample data - would come from API
  const sampleRoles: Role[] = [
    {
      id: 'role-001',
      name: 'Administrator',
      description: 'Full system access with all privileges',
      userCount: 3,
      permissions: [
        { id: 'perm-001', name: 'View Users', description: 'Can view user list', category: 'User Management', active: true },
        { id: 'perm-002', name: 'Create User', description: 'Can create new users', category: 'User Management', active: true },
        { id: 'perm-003', name: 'Edit User', description: 'Can edit existing users', category: 'User Management', active: true },
        { id: 'perm-004', name: 'Delete User', description: 'Can delete users', category: 'User Management', active: true },
        { id: 'perm-005', name: 'Assign Roles', description: 'Can assign roles to users', category: 'Role Management', active: true },
        { id: 'perm-006', name: 'View Roles', description: 'Can view role list', category: 'Role Management', active: true },
        { id: 'perm-007', name: 'Create Role', description: 'Can create new roles', category: 'Role Management', active: true },
        { id: 'perm-008', name: 'Edit Role', description: 'Can edit existing roles', category: 'Role Management', active: true },
        { id: 'perm-009', name: 'Delete Role', description: 'Can delete roles', category: 'Role Management', active: true },
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-011', name: 'Create Asset', description: 'Can create data assets', category: 'Asset Management', active: true },
        { id: 'perm-012', name: 'Edit Asset', description: 'Can edit data assets', category: 'Asset Management', active: true },
        { id: 'perm-013', name: 'Delete Asset', description: 'Can delete data assets', category: 'Asset Management', active: true },
        { id: 'perm-014', name: 'Approve Workflows', description: 'Can approve workflow stages', category: 'Workflow', active: true },
        { id: 'perm-015', name: 'System Settings', description: 'Can access and modify system settings', category: 'System', active: true },
      ],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2025-07-20T14:30:15Z',
      system: true
    },
    {
      id: 'role-002',
      name: 'Data Steward',
      description: 'Manages data quality and metadata',
      userCount: 5,
      permissions: [
        { id: 'perm-001', name: 'View Users', description: 'Can view user list', category: 'User Management', active: true },
        { id: 'perm-005', name: 'Assign Roles', description: 'Can assign roles to users', category: 'Role Management', active: false },
        { id: 'perm-006', name: 'View Roles', description: 'Can view role list', category: 'Role Management', active: true },
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-011', name: 'Create Asset', description: 'Can create data assets', category: 'Asset Management', active: true },
        { id: 'perm-012', name: 'Edit Asset', description: 'Can edit data assets', category: 'Asset Management', active: true },
        { id: 'perm-013', name: 'Delete Asset', description: 'Can delete data assets', category: 'Asset Management', active: false },
        { id: 'perm-014', name: 'Approve Workflows', description: 'Can approve workflow stages', category: 'Workflow', active: true },
      ],
      createdAt: '2024-02-10T10:15:00Z',
      updatedAt: '2025-08-01T09:45:30Z',
      system: true
    },
    {
      id: 'role-003',
      name: 'Basic User',
      description: 'Standard user with limited privileges',
      userCount: 42,
      permissions: [
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-016', name: 'Comment on Assets', description: 'Can add comments to assets', category: 'Asset Management', active: true },
      ],
      createdAt: '2024-02-15T11:30:00Z',
      updatedAt: '2025-06-30T16:20:45Z',
      system: true
    },
    {
      id: 'role-004',
      name: 'Finance Analyst',
      description: 'Specialized role for finance department',
      userCount: 8,
      permissions: [
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-016', name: 'Comment on Assets', description: 'Can add comments to assets', category: 'Asset Management', active: true },
        { id: 'perm-017', name: 'View Finance Data', description: 'Access to finance data assets', category: 'Domain Specific', active: true },
        { id: 'perm-018', name: 'Export Reports', description: 'Can export financial reports', category: 'Reporting', active: true },
      ],
      createdAt: '2024-04-05T14:20:00Z',
      updatedAt: '2025-07-15T10:10:50Z',
      system: false
    },
    {
      id: 'role-005',
      name: 'Marketing Specialist',
      description: 'Role for marketing team members',
      userCount: 6,
      permissions: [
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-016', name: 'Comment on Assets', description: 'Can add comments to assets', category: 'Asset Management', active: true },
        { id: 'perm-019', name: 'View Marketing Data', description: 'Access to marketing data assets', category: 'Domain Specific', active: true },
        { id: 'perm-020', name: 'Create Campaigns', description: 'Can create marketing campaigns', category: 'Domain Specific', active: true },
      ],
      createdAt: '2024-05-12T09:15:00Z',
      updatedAt: '2025-07-28T15:30:20Z',
      system: false
    },
    {
      id: 'role-006',
      name: 'IT Support',
      description: 'Technical support role with system access',
      userCount: 4,
      permissions: [
        { id: 'perm-001', name: 'View Users', description: 'Can view user list', category: 'User Management', active: true },
        { id: 'perm-002', name: 'Create User', description: 'Can create new users', category: 'User Management', active: true },
        { id: 'perm-003', name: 'Edit User', description: 'Can edit existing users', category: 'User Management', active: true },
        { id: 'perm-006', name: 'View Roles', description: 'Can view role list', category: 'Role Management', active: true },
        { id: 'perm-010', name: 'View Assets', description: 'Can view data assets', category: 'Asset Management', active: true },
        { id: 'perm-021', name: 'Reset Passwords', description: 'Can reset user passwords', category: 'User Management', active: true },
      ],
      createdAt: '2024-03-20T13:45:00Z',
      updatedAt: '2025-08-02T11:25:40Z',
      system: false
    }
  ];

  // Filter roles based on search and toggles
  const filterRoles = useCallback(() => {
    setLoading(true);

    try {
      let filtered = [...sampleRoles];

      // Filter by system role toggle
      if (!showSystemRoles) {
        filtered = filtered.filter(role => !role.system);
      }

      // Apply text search
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(role => 
          role.name.toLowerCase().includes(searchLower) ||
          role.description.toLowerCase().includes(searchLower)
        );
      }

      setFilteredRoles(filtered);
    } catch (err) {
      console.error('Error filtering roles:', err);
      setError('An error occurred while filtering roles.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, showSystemRoles]);

  // Fetch roles on mount and when filters change
  useEffect(() => {
    filterRoles();
  }, [filterRoles]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group permissions by category
  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const categories: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    
    return Object.keys(categories).map(category => ({
      name: category,
      permissions: categories[category]
    }));
  };
  
  // Toggle permission category expansion
  const togglePermissionCategory = (category: string) => {
    setExpandedPermissions(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Get role icon
  const getRoleIcon = (role: Role) => {
    if (role.name.toLowerCase().includes('admin')) {
      return <AdminPanelSettingsIcon />;
    } else if (role.name.toLowerCase().includes('steward')) {
      return <SupervisorAccountIcon />;
    } else if (role.name.toLowerCase().includes('support') || role.name.toLowerCase().includes('specialist')) {
      return <SecurityIcon />;
    } else {
      return <PersonIcon />;
    }
  };

  return (
    <Container sx={{ py: 4 }} className="roles-management-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Role Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage roles and permissions for the data literacy portal. Roles determine what actions users can perform.
      </Typography>
      
      {/* Search and filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search roles..."
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
              aria-label="Search roles"
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showSystemRoles}
                  onChange={(e) => setShowSystemRoles(e.target.checked)}
                  color="primary"
                />
              }
              label="Show System Roles"
              aria-label="Toggle system roles visibility"
            />
          </Grid>
          
          <Grid item xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              aria-label="Create new role"
              onClick={() => setEditDialogOpen(true)}
            >
              Create Role
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading roles" />
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
            {filteredRoles.length === 0
              ? 'No roles found matching your criteria.'
              : `Showing ${filteredRoles.length} role${filteredRoles.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Roles grid */}
      {!loading && !error && filteredRoles.length > 0 && (
        <Grid container spacing={3}>
          {filteredRoles.map((role) => {
            const permissionCategories = groupPermissionsByCategory(role.permissions);
            const activePermissions = role.permissions.filter(p => p.active).length;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={role.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderLeft: role.system ? '4px solid #1976D2' : 'none'
                  }}
                >
                  {role.system && (
                    <Chip
                      label="System Role"
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          backgroundColor: '#F0F7FF',
                          borderRadius: '50%',
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1976D2',
                          mr: 2
                        }}
                      >
                        {getRoleIcon(role)}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h2" fontWeight="600">
                          {role.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleAltIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {role.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Permissions:</strong> {activePermissions} active out of {role.permissions.length} total
                      </Typography>
                      
                      <List dense component="div" sx={{ mt: 1 }}>
                        {permissionCategories.map((category, idx) => (
                          <React.Fragment key={category.name}>
                            <ListItem 
                              onClick={() => togglePermissionCategory(category.name)}
                              dense
                              sx={{ py: 0.5, cursor: 'pointer' }}
                            >
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                {expandedPermissions[category.name] ? (
                                  <ExpandLessIcon fontSize="small" />
                                ) : (
                                  <ExpandMoreIcon fontSize="small" />
                                )}
                              </ListItemIcon>
                              <ListItemText 
                                primary={
                                  <Typography variant="body2" fontWeight={500}>
                                    {category.name} ({category.permissions.filter(p => p.active).length}/{category.permissions.length})
                                  </Typography>
                                }
                              />
                            </ListItem>
                            
                            <Collapse in={expandedPermissions[category.name] === true}>
                              <List dense component="div" disablePadding>
                                {category.permissions.map((permission) => (
                                  <ListItem 
                                    key={permission.id}
                                    sx={{ 
                                      pl: 6, 
                                      py: 0,
                                      opacity: permission.active ? 1 : 0.5
                                    }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                      {permission.active ? (
                                        <CheckIcon 
                                          fontSize="small" 
                                          color="success"
                                          sx={{ fontSize: 16 }}
                                        />
                                      ) : null}
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={
                                        <Typography variant="body2">
                                          {permission.name}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="caption" color="text.secondary">
                                          {permission.description}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                            
                            {idx < permissionCategories.length - 1 && (
                              <Divider component="li" />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last updated: {formatDate(role.updatedAt)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedRole(role);
                        setEditDialogOpen(true);
                      }}
                      startIcon={<EditIcon />}
                      disabled={role.system}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setSelectedRole(role);
                        setDeleteDialogOpen(true);
                      }}
                      startIcon={<DeleteIcon />}
                      disabled={role.system}
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
          Confirm Role Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the role "{selectedRole?.name}"? 
            This will remove all role assignments from {selectedRole?.userCount} user{selectedRole?.userCount !== 1 ? 's' : ''}.
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
      
      {/* Edit/Create Role Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        aria-labelledby="role-dialog-title"
      >
        <DialogTitle id="role-dialog-title">
          {selectedRole ? `Edit Role: ${selectedRole.name}` : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedRole 
              ? 'Modify role details and permissions below.'
              : 'Define a new role with specific permissions for users.'}
          </Typography>
          
          <Typography variant="body2" paragraph sx={{ mt: 2, color: 'info.main' }}>
            This is a placeholder for the role edit/create form. In a full implementation, you would:
          </Typography>
          <Typography component="ul" variant="body2">
            <li>Edit role name and description</li>
            <li>Select which permissions to grant this role</li>
            <li>View and manage users assigned to this role</li>
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
            {selectedRole ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Roles;

/**
 * UserManagementSystem Component
 * 
 * Comprehensive user management system with role-based access control (RBAC).
 * Fully compliant with Section 508 requirements and WCAG 2.0 guidelines.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'data-steward' | 'data-analyst' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
  phone?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Data Asset Permissions
  { id: 'assets.view', name: 'View Assets', description: 'View data assets', category: 'Data Assets' },
  { id: 'assets.create', name: 'Create Assets', description: 'Create new data assets', category: 'Data Assets' },
  { id: 'assets.edit', name: 'Edit Assets', description: 'Edit existing data assets', category: 'Data Assets' },
  { id: 'assets.delete', name: 'Delete Assets', description: 'Delete data assets', category: 'Data Assets' },
  
  // User Management Permissions
  { id: 'users.view', name: 'View Users', description: 'View user accounts', category: 'User Management' },
  { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
  { id: 'users.edit', name: 'Edit Users', description: 'Edit user accounts', category: 'User Management' },
  { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts', category: 'User Management' },
  
  // System Permissions
  { id: 'system.admin', name: 'System Admin', description: 'Full system administration', category: 'System' },
  { id: 'system.config', name: 'System Config', description: 'Configure system settings', category: 'System' },
  { id: 'system.audit', name: 'View Audit Logs', description: 'View system audit logs', category: 'System' },
  
  // Data Quality Permissions
  { id: 'quality.view', name: 'View Quality', description: 'View data quality metrics', category: 'Data Quality' },
  { id: 'quality.manage', name: 'Manage Quality', description: 'Manage data quality rules', category: 'Data Quality' },
  
  // Lineage Permissions
  { id: 'lineage.view', name: 'View Lineage', description: 'View data lineage', category: 'Data Lineage' },
  { id: 'lineage.edit', name: 'Edit Lineage', description: 'Edit data lineage', category: 'Data Lineage' }
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
    userCount: 0
  },
  {
    id: 'data-steward',
    name: 'Data Steward',
    description: 'Manage data assets and quality',
    permissions: [
      'assets.view', 'assets.create', 'assets.edit', 'assets.delete',
      'quality.view', 'quality.manage',
      'lineage.view', 'lineage.edit',
      'users.view'
    ],
    userCount: 0
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'View and analyze data assets',
    permissions: [
      'assets.view', 'assets.create',
      'quality.view',
      'lineage.view'
    ],
    userCount: 0
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to data catalog',
    permissions: [
      'assets.view',
      'quality.view',
      'lineage.view'
    ],
    userCount: 0
  }
];

export const UserManagementSystem: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Form states
  const [userForm, setUserForm] = useState<Partial<User>>({});
  const [roleForm, setRoleForm] = useState<Partial<Role>>({});
  
  // Table states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<User | null>(null);

  // Generate mock users
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'admin',
          department: 'IT',
          status: 'active',
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          permissions: DEFAULT_ROLES.find(r => r.id === 'admin')?.permissions || [],
          phone: '+1 (555) 123-4567'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          role: 'data-steward',
          department: 'Data Management',
          status: 'active',
          lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          permissions: DEFAULT_ROLES.find(r => r.id === 'data-steward')?.permissions || [],
          phone: '+1 (555) 234-5678'
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@example.com',
          role: 'data-analyst',
          department: 'Analytics',
          status: 'active',
          lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          permissions: DEFAULT_ROLES.find(r => r.id === 'data-analyst')?.permissions || [],
          phone: '+1 (555) 345-6789'
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          role: 'viewer',
          department: 'Finance',
          status: 'active',
          lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          permissions: DEFAULT_ROLES.find(r => r.id === 'viewer')?.permissions || []
        },
        {
          id: '5',
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          role: 'data-analyst',
          department: 'Operations',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          permissions: DEFAULT_ROLES.find(r => r.id === 'data-analyst')?.permissions || []
        }
      ];
      
      setUsers(mockUsers);
      
      // Update role user counts
      const updatedRoles = DEFAULT_ROLES.map(role => ({
        ...role,
        userCount: mockUsers.filter(user => user.role === role.id).length
      }));
      setRoles(updatedRoles);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const roleMatch = filterRole === 'all' || user.role === filterRole;
      const statusMatch = filterStatus === 'all' || user.status === filterStatus;
      return roleMatch && statusMatch;
    });
  }, [users, filterRole, filterStatus]);

  // Handle user creation/editing
  const handleSaveUser = useCallback(async () => {
    try {
      if (selectedUser) {
        // Edit existing user
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...userForm }
            : user
        );
        setUsers(updatedUsers);
        setSuccess('User updated successfully');
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name: userForm.name || '',
          email: userForm.email || '',
          role: userForm.role || 'viewer',
          department: userForm.department || '',
          status: 'pending',
          createdAt: new Date(),
          permissions: DEFAULT_ROLES.find(r => r.id === userForm.role)?.permissions || [],
          phone: userForm.phone
        };
        setUsers(prev => [...prev, newUser]);
        setSuccess('User created successfully');
      }
      
      setUserDialogOpen(false);
      setSelectedUser(null);
      setUserForm({});
    } catch (err) {
      setError('Failed to save user');
    }
  }, [selectedUser, userForm, users]);

  // Handle user deletion
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;
    
    try {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setSuccess('User deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  }, [selectedUser]);

  // Handle user status toggle
  const handleToggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : user
    ));
  }, []);

  // Get role display name
  const getRoleDisplayName = (roleId: string): string => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || roleId;
  };

  // Get role color
  const getRoleColor = (roleId: string): string => {
    switch (roleId) {
      case 'admin': return '#F44336';
      case 'data-steward': return '#FF9800';
      case 'data-analyst': return '#2196F3';
      case 'viewer': return '#4CAF50';
      default: return '#757575';
    }
  };

  // Check if current user has permission
  const hasPermission = (permission: string): boolean => {
    return currentUser?.role === 'admin' || currentUser?.permissions?.includes(permission) || false;
  };

  if (!hasPermission('users.view')) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        You don't have permission to access user management.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 700 }}>
          User Management
        </Typography>
        
        {hasPermission('users.create') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setUserForm({});
              setUserDialogOpen(true);
            }}
          >
            Add User
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#2196F3', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {users.filter(u => u.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {roles.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User Roles
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#9C27B0', mr: 2 }}>
                  <AdminIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Filter by Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: getRoleColor(user.role) }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleDisplayName(user.role)}
                      size="small"
                      sx={{
                        bgcolor: getRoleColor(user.role),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status.toUpperCase()}
                      size="small"
                      color={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'error' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {hasPermission('users.edit') && (
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserForm(user);
                              setUserDialogOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {hasPermission('users.edit') && (
                        <Tooltip title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === 'active' ? <LockIcon /> : <UnlockIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {hasPermission('users.delete') && user.id !== currentUser?.id && (
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={userForm.name || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={userForm.role || 'viewer'}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                  label="Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={userForm.department || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={userForm.phone || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagementSystem;

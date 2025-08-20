import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
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
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Avatar,
  Snackbar,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  ListItemText,
  FormHelperText
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  History as HistoryIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { AlertColor } from '@mui/material';
import AddUserDialog from './AddUserDialog';

// User type definition
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  jobTitle?: string;
  createdAt: string;
  lastActive?: string;
  assignedDomains?: string[];
  preferences?: {
    theme?: string;
    notifications?: {
      email?: boolean;
      inApp?: boolean;
    };
  };
  // UI-specific properties
  status?: 'active' | 'inactive' | 'pending';
  isEditing?: boolean;
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

// User Edit Dialog Component
interface UserEditDialogProps {
  user: User;
  onSave: (user: User, updatedData: Partial<User>) => void;
  onCancel: (user: User) => void;
}

// Add User Dialog Component is imported from ./AddUserDialog

const UserEditDialog: React.FC<UserEditDialogProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  
  // Initialize form data when dialog opens
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      jobTitle: user.jobTitle || ''
    });
  }, [user]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle role selection change
  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user, formData);
  };
  
  return (
    <Dialog 
      open={true} 
      onClose={() => onCancel(user)}
      aria-labelledby="edit-user-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="edit-user-dialog-title">
        Edit User: {user.name}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name || ''}
            onChange={handleChange}
            required
            inputProps={{ 'aria-label': 'User full name' }}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email || ''}
            onChange={handleChange}
            required
            inputProps={{ 'aria-label': 'User email address' }}
          />
          <FormControl fullWidth margin="dense" variant="outlined" required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role"
              name="role"
              value={formData.role || 'user'}
              label="Role"
              onChange={handleRoleChange}
              inputProps={{ 'aria-label': 'User role' }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="data-steward">Data Steward</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="department"
            name="department"
            label="Department"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.department || ''}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'User department' }}
          />
          <TextField
            margin="dense"
            id="jobTitle"
            name="jobTitle"
            label="Job Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'User job title' }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => onCancel(user)} 
            startIcon={<CancelIcon />}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            aria-label="Save changes"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Users: React.FC = () => {
  // Auth context
  const { user } = useAuth();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);
  
  // Function to fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters for filtering
      let queryParams = new URLSearchParams();
      
      if (debouncedSearchText) {
        queryParams.append('search', debouncedSearchText);
      }
      
      if (roleFilter !== 'all') {
        queryParams.append('role', roleFilter);
      }
      
      // Use the api service which automatically includes auth tokens
      const response = await api.get(`/users?${queryParams.toString()}`);
      
      // Axios responses have data directly in the response object
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Error fetching users');
      }
      
      // Process users data to match our interface
      const processedUsers: User[] = data.data.map((user: any) => ({
        ...user,
        // Set UI status based on lastActive timestamp (within 30 days = active)
        status: user.lastActive && new Date(user.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive',
        isEditing: false
      }));
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
      
      // Add search term to history if it's a new search
      if (debouncedSearchText.trim() && !searchHistory.includes(debouncedSearchText)) {
        const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
        setSearchHistory(newHistory);
        localStorage.setItem('usersSearchHistory', JSON.stringify(newHistory));
      }
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, roleFilter, searchHistory]);
  
  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('usersSearchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  // Function to apply local filters (status filter only, other filters handled by API)
  const applyLocalFilters = useCallback(() => {
    if (!users.length) return;
    
    let filtered = [...users];
    
    // Apply status filter locally
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, statusFilter]);
  
  // Apply local filters when status filter changes
  useEffect(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);
  
  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Function to save user data
  const saveUser = async (user: User, updatedData: Partial<User>) => {
    try {
      setLoading(true);
      
      // Use the api service which automatically includes auth tokens
      const response = await api.put(`/users/${user._id}`, updatedData);
      
      // Axios responses have data directly in the response object
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Error updating user');
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? { ...data.data, isEditing: false } : u
        )
      );
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? { ...data.data, isEditing: false } : u
        )
      );
      
      // Show success message
      setSnackbarMessage('User updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error updating user:', err);
      setSnackbarMessage(err instanceof Error ? err.message : 'An error occurred while updating user');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      // Call the delete user API endpoint
      const response = await api.delete(`/api/v1/users/${selectedUser._id}`);
      
      if (response.data.success) {
        // Remove the user from the UI lists
        setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
        setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
        
        // Close the dialog
        setDeleteDialogOpen(false);
        
        // Reset selected user
        setSelectedUser(null);
        
        // Show success message
        setSnackbarMessage(`User '${selectedUser.name}' has been deleted`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      
      let errorMessage = 'An error occurred while deleting the user';
      
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new user
  const handleAddUser = async (userData: Omit<User, '_id' | 'createdAt' | 'lastActive' | 'isEditing' | 'status'>) => {
    try {
      setLoading(true);
      
      // Use the auth service register endpoint to create a new user
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        // Refresh the users list to include the new user
        fetchUsers();
        
        // Close the dialog
        setAddUserDialogOpen(false);

        // Show success message
        setSnackbarMessage(`User '${userData.name}' created successfully`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      let errorMessage = 'An error occurred while creating user';
      
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle edit mode for a user
  const toggleEditMode = (user: User) => {
    setFilteredUsers(prevUsers => 
      prevUsers.map(u => 
        u._id === user._id ? { ...u, isEditing: !u.isEditing } : u
      )
    );
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format timestamp to relative time
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Get role color and icon
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { 
          color: { bg: '#EDE7F6', text: '#5E35B1' }, 
          icon: <AdminPanelSettingsIcon fontSize="small" />,
          label: 'Admin'
        };
      case 'data_steward':
        return { 
          color: { bg: '#E1F5FE', text: '#0288D1' }, 
          icon: <SupervisorAccountIcon fontSize="small" />,
          label: 'Data Steward'
        };
      default:
        return { 
          color: { bg: '#F5F5F5', text: '#616161' }, 
          icon: <PersonIcon fontSize="small" />,
          label: 'User'
        };
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
      case 'inactive':
        return { bg: '#FFEBEE', color: '#C62828' }; // Red
      case 'pending':
        return { bg: '#FFF8E1', color: '#F57F17' }; // Amber
      default:
        return { bg: '#F5F5F5', color: '#757575' }; // Grey
    }
  };
  
  // Handle user menu open
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  // Handle user menu close
  const handleUserMenuClose = () => {
    setActionMenuAnchorEl(null);
  };
  
  // Handle search history item click
  const handleSearchHistoryClick = (text: string) => {
    setSearchText(text);
    setShowSearchHistory(false);
    setSearchAnchorEl(null);
  };
  
  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase();
  };
  
  // Generate avatar color based on user id
  const getAvatarColor = (_id: string) => {
    const colors = [
      '#1976D2', // Blue
      '#388E3C', // Green
      '#D32F2F', // Red
      '#7B1FA2', // Purple
      '#FFA000', // Amber
      '#0097A7', // Cyan
      '#C2185B', // Pink
      '#5D4037', // Brown
    ];
    
    // Generate a simple hash code from a string
    const hashCode = (str: string) => {
      return str.split('').reduce((acc: number, char: string) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
      }, 0);
    };  
    
    return colors[hashCode(_id) % colors.length];
  };
  
  // Handle menu actions
  const handleMenuAction = (action: string) => {
    if (!selectedUser) return;
    
    handleUserMenuClose();
    
    switch (action) {
      case 'edit':
        // Open edit dialog
        toggleEditMode(selectedUser);
        break;
      case 'reset_password':
        // Reset password functionality
        setSnackbarMessage(`Password reset functionality not implemented in this version`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        break;
      case 'deactivate':
        // Deactivate user
        setSnackbarMessage(`User deactivation functionality not implemented in this version`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        break;
      case 'delete':
        // Open delete confirmation
        setDeleteDialogOpen(true);
        break;
    }
  }; 
  
  return (
    <Container sx={{ py: 4 }} className="users-management-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        User Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage user accounts and access permissions for the data literacy portal.
      </Typography>
      
      {/* Search and filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box position="relative">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={(e) => {
                  if (searchHistory.length > 0) {
                    setSearchAnchorEl(e.currentTarget);
                    setShowSearchHistory(true);
                  }
                }}
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
                  ) : searchHistory.length > 0 ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Show search history"
                        onClick={(e) => {
                          setSearchAnchorEl(e.currentTarget);
                          setShowSearchHistory(!showSearchHistory);
                        }}
                        edge="end"
                        size="small"
                      >
                        <HistoryIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
                aria-label="Search users"
                aria-controls={showSearchHistory ? 'search-history-menu' : undefined}
                aria-expanded={showSearchHistory ? 'true' : undefined}
                aria-haspopup="true"
              />
              
              {/* Search history dropdown */}
              <Menu
                id="search-history-menu"
                anchorEl={searchAnchorEl}
                open={showSearchHistory}
                onClose={() => {
                  setShowSearchHistory(false);
                  setSearchAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                PaperProps={{
                  style: { 
                    width: Math.max(searchAnchorEl?.clientWidth || 0, 220), // Ensure minimum width for menu items
                    maxHeight: '300px'
                  },
                }}
              >
                <MenuItem disabled dense>
                  <Typography variant="caption">Recent searches</Typography>
                </MenuItem>
                {searchHistory.map((item, index) => (
                  <MenuItem 
                    key={index} 
                    onClick={() => handleSearchHistoryClick(item)}
                    dense
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    {item}
                  </MenuItem>
                ))}
                {searchHistory.length > 0 && (
                  <MenuItem 
                    onClick={() => {
                      localStorage.removeItem('usersSearchHistory');
                      setSearchHistory([]);
                      setShowSearchHistory(false);
                      setSearchAnchorEl(null);
                    }}
                    sx={{ 
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)', 
                      mt: 1, 
                      pt: 1,
                      '&:hover': { bgcolor: 'rgba(179, 27, 27, 0.08)' } 
                    }}
                    aria-label="Clear all search history"
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: '#B31B1B' }}>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography color="#B31B1B" fontWeight="medium">Clear search history</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
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
              aria-label="Add new user"
              onClick={() => setAddUserDialogOpen(true)}
            >
              Add User
            </Button>
          </Grid>
          
          {/* Extended filters */}
          {showFilters && (
            <Grid item xs={12} id="filter-panel" aria-label="Filter options">
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="data_steward">Data Steward</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </TextField>
                
                <TextField
                  select
                  size="small"
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </TextField>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    setRoleFilter('all');
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
          <CircularProgress aria-label="Loading users" />
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
            {filteredUsers.length === 0
              ? 'No users found matching your criteria.'
              : `Showing ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Users table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Users management table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Last Active</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const statusColors = getStatusColor(user.status || 'inactive');
                const avatarColor = getAvatarColor(user._id);
                
                // Table row that works as a clickable card for editing
                return (
                  <TableRow 
                    key={user._id} 
                    hover
                    onClick={() => toggleEditMode(user)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      '&:focus-visible': {
                        outline: '2px solid #003366',
                        backgroundColor: 'rgba(0, 51, 102, 0.08)'
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Edit user ${user.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleEditMode(user);
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: avatarColor, 
                            width: 36, 
                            height: 36, 
                            mr: 1,
                            fontSize: '0.875rem'
                          }}
                          aria-hidden="true"
                        >
                          {getUserInitials(user.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created {formatDate(user.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={roleInfo.icon}
                        label={roleInfo.label}
                        size="small"
                        sx={{ 
                          backgroundColor: roleInfo.color.bg, 
                          color: roleInfo.color.text,
                          '& .MuiChip-icon': { color: roleInfo.color.text }
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.department || 'Not specified'}</TableCell>
                    <TableCell>{user.jobTitle || 'Not specified'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'} 
                        size="small" 
                        sx={{ backgroundColor: statusColors.bg, color: statusColors.color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.lastActive ? formatDate(user.lastActive) : 'Never logged in'}>
                        <Typography variant="body2">
                          {user.lastActive ? getRelativeTime(user.lastActive) : 'Never'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        aria-label={`Actions for ${user.name}`}
                        aria-haspopup="true"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleUserMenuOpen(e, user);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* User Edit Dialog */}
        {filteredUsers.find(u => u.isEditing) && (
          <UserEditDialog 
            user={filteredUsers.find(u => u.isEditing)!}
            onSave={saveUser}
            onCancel={toggleEditMode}
          />
        )}
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Add User Dialog */}
        <AddUserDialog 
          open={addUserDialogOpen}
          onClose={() => setAddUserDialogOpen(false)}
          onSave={handleAddUser}
        />
      </>
      )}
      
      {/* User action menu */}
      <Menu
        id="user-actions-menu"
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit User</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('reset_password')}>
          <ListItemIcon>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Change Password</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('deactivate')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Deactivate User</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handleMenuAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Delete User</Typography>
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ bgcolor: '#003366', color: 'white' }}>
          Confirm User Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? 
            This action cannot be undone and will remove all associated data for this user.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            startIcon={<CancelIcon />}
            aria-label="Cancel user deletion"
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
            aria-label={`Confirm deletion of user ${selectedUser?.name}`}
            onClick={() => handleDeleteUser()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;

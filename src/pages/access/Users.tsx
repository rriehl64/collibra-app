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
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Avatar
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
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// User type definition
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'data_steward' | 'user';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
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

const Users: React.FC = () => {
  // Auth context
  const { user } = useAuth();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);
  
  // Sample data - would come from API
  const sampleUsers: User[] = [
    {
      id: 'user-001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2025-08-03T10:15:30Z',
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'user-002',
      firstName: 'Data',
      lastName: 'Steward',
      email: 'steward@example.com',
      role: 'data_steward',
      department: 'Data Governance',
      status: 'active',
      lastLogin: '2025-08-01T14:22:10Z',
      createdAt: '2024-02-20T09:30:00Z'
    },
    {
      id: 'user-003',
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      role: 'user',
      department: 'Marketing',
      status: 'active',
      lastLogin: '2025-07-28T09:45:22Z',
      createdAt: '2024-03-10T11:15:00Z'
    },
    {
      id: 'user-004',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sjohnson@example.com',
      role: 'data_steward',
      department: 'Finance',
      status: 'active',
      lastLogin: '2025-08-02T16:30:45Z',
      createdAt: '2024-02-05T10:20:00Z'
    },
    {
      id: 'user-005',
      firstName: 'Michael',
      lastName: 'Roberts',
      email: 'mroberts@example.com',
      role: 'user',
      department: 'Sales',
      status: 'inactive',
      lastLogin: '2025-06-15T11:10:05Z',
      createdAt: '2024-04-18T13:45:00Z'
    },
    {
      id: 'user-006',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'echen@example.com',
      role: 'user',
      department: 'Research',
      status: 'active',
      lastLogin: '2025-08-03T09:20:15Z',
      createdAt: '2024-05-22T09:00:00Z'
    },
    {
      id: 'user-007',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'dwilson@example.com',
      role: 'admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2025-08-04T08:05:30Z',
      createdAt: '2024-01-30T14:15:00Z'
    },
    {
      id: 'user-008',
      firstName: 'Jessica',
      lastName: 'Martinez',
      email: 'jmartinez@example.com',
      role: 'data_steward',
      department: 'Customer Support',
      status: 'pending',
      createdAt: '2025-07-30T15:30:00Z'
    }
  ];
  
  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('usersSearchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  // Filter users based on search and filters
  const filterUsers = useCallback(() => {
    setLoading(true);
    
    try {
      let filtered = [...sampleUsers];
      
      // Apply text search
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.department.toLowerCase().includes(searchLower)
        );
        
        // Add to search history if it's a new search
        if (debouncedSearchText.trim() && !searchHistory.includes(debouncedSearchText)) {
          const newHistory = [...searchHistory.slice(-4), debouncedSearchText];
          setSearchHistory(newHistory);
          localStorage.setItem('usersSearchHistory', JSON.stringify(newHistory));
        }
      }
      
      // Apply role filter
      if (roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === roleFilter);
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === statusFilter);
      }
      
      setFilteredUsers(filtered);
    } catch (err) {
      console.error('Error filtering users:', err);
      setError('An error occurred while filtering users.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, roleFilter, statusFilter, searchHistory]);
  
  // Fetch users on mount and when filters change
  useEffect(() => {
    filterUsers();
  }, [filterUsers]);
  
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
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Generate avatar color based on user id
  const getAvatarColor = (id: string) => {
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
    
    // Simple hash function for consistent color selection
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
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
                  style: { width: searchAnchorEl?.clientWidth },
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
                    dense
                    onClick={() => {
                      localStorage.removeItem('usersSearchHistory');
                      setSearchHistory([]);
                      setShowSearchHistory(false);
                      setSearchAnchorEl(null);
                    }}
                  >
                    <Typography variant="caption" color="error">Clear search history</Typography>
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
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Users management table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const statusColors = getStatusColor(user.status);
                const avatarColor = getAvatarColor(user.id);
                
                return (
                  <TableRow key={user.id} hover>
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
                          {getUserInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.firstName} {user.lastName}
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
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} 
                        size="small" 
                        sx={{ backgroundColor: statusColors.bg, color: statusColors.color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}>
                        <Typography variant="body2">
                          {user.lastLogin ? getRelativeTime(user.lastLogin) : 'Never'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        aria-label={`Actions for ${user.firstName} ${user.lastName}`}
                        aria-haspopup="true"
                        onClick={(e) => handleUserMenuOpen(e, user)}
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
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit User</Typography>
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Change Password</Typography>
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">View Activity</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleUserMenuClose();
            setDeleteDialogOpen(true);
          }}
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
        <DialogTitle id="delete-dialog-title">
          Confirm User Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? 
            This action cannot be undone and will remove all associated data for this user.
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
    </Container>
  );
};

export default Users;

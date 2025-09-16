import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Button,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Toolbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import menuSettingsService, { MenuSettings } from '../../services/menuSettingsService';

const AdminMenuManagement: React.FC = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [editDialog, setEditDialog] = useState({ open: false, item: null as MenuSettings | null });
  const [bulkAction, setBulkAction] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await menuSettingsService.getAllMenuSettings();
      setMenuItems(items);
    } catch (error) {
      showSnackbar('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleItem = async (id: string) => {
    try {
      const updatedItem = await menuSettingsService.toggleMenuItem(id);
      setMenuItems(prev => prev.map(item => 
        item._id === id ? updatedItem : item
      ));
      showSnackbar('Menu item updated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to update menu item', 'error');
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(menuItems.map(item => item._id));
    }
  };

  const handleBulkToggle = async (isEnabled: boolean) => {
    if (selectedItems.length === 0) {
      showSnackbar('Please select items to update', 'error');
      return;
    }

    try {
      setBulkAction(true);
      await menuSettingsService.bulkToggleMenuItems(selectedItems, isEnabled);
      await loadMenuItems();
      setSelectedItems([]);
      showSnackbar(`${selectedItems.length} items updated successfully`, 'success');
    } catch (error) {
      showSnackbar('Failed to update selected items', 'error');
    } finally {
      setBulkAction(false);
    }
  };

  const handleInitializeMenuItems = async () => {
    try {
      await menuSettingsService.initializeMenuItems();
      await loadMenuItems();
      showSnackbar('Menu items initialized successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to initialize menu items', 'error');
    }
  };

  const handleEditItem = (item: MenuSettings) => {
    setEditDialog({ open: true, item: { ...item } });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.item) return;

    try {
      const updatedItem = await menuSettingsService.updateMenuItem(
        editDialog.item._id,
        editDialog.item
      );
      setMenuItems(prev => prev.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
      setEditDialog({ open: false, item: null });
      showSnackbar('Menu item updated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to update menu item', 'error');
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'primary' ? 'primary' : 'secondary';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'data-steward': return 'warning';
      default: return 'default';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 600 }}>
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Admin Menu Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadMenuItems}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleInitializeMenuItems}
            sx={{ backgroundColor: '#003366' }}
          >
            Initialize Menu Items
          </Button>
        </Box>
      </Box>

      {/* Bulk Actions Toolbar */}
      {selectedItems.length > 0 && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Toolbar sx={{ pl: 0 }}>
            <Typography variant="subtitle1" sx={{ flex: '1 1 100%' }}>
              {selectedItems.length} item(s) selected
            </Typography>
            <Button
              variant="contained"
              color="success"
              startIcon={<VisibilityIcon />}
              onClick={() => handleBulkToggle(true)}
              disabled={bulkAction}
              sx={{ mr: 1 }}
            >
              Enable Selected
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<VisibilityOffIcon />}
              onClick={() => handleBulkToggle(false)}
              disabled={bulkAction}
            >
              Disable Selected
            </Button>
          </Toolbar>
        </Paper>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="menu management table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < menuItems.length}
                    checked={menuItems.length > 0 && selectedItems.length === menuItems.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all menu items' }}
                  />
                </TableCell>
                <TableCell><strong>Menu Item</strong></TableCell>
                <TableCell><strong>Path</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Required Role</strong></TableCell>
                <TableCell><strong>Order</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No menu items found. Click "Initialize Menu Items" to create default menu structure.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item) => (
                  <TableRow
                    key={item._id}
                    hover
                    role="checkbox"
                    aria-checked={selectedItems.includes(item._id)}
                    selected={selectedItems.includes(item._id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelectItem(item._id)}
                        inputProps={{ 'aria-label': `select ${item.text}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {item.menuId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.path}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        color={getCategoryColor(item.category) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.requiredRole}
                        color={getRoleColor(item.requiredRole) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={item.isEnabled}
                            onChange={() => handleToggleItem(item._id)}
                            color="primary"
                            inputProps={{ 'aria-label': `toggle ${item.text}` }}
                          />
                        }
                        label={item.isEnabled ? 'Enabled' : 'Disabled'}
                        sx={{ m: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit menu item">
                        <IconButton
                          size="small"
                          onClick={() => handleEditItem(item)}
                          aria-label={`edit ${item.text}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, item: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          {editDialog.item && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Menu Text"
                value={editDialog.item.text}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  item: prev.item ? { ...prev.item, text: e.target.value } : null
                }))}
                fullWidth
              />
              <TextField
                label="Path"
                value={editDialog.item.path}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  item: prev.item ? { ...prev.item, path: e.target.value } : null
                }))}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editDialog.item.category}
                  label="Category"
                  onChange={(e) => setEditDialog(prev => ({
                    ...prev,
                    item: prev.item ? { ...prev.item, category: e.target.value as 'primary' | 'secondary' } : null
                  }))}
                >
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Required Role</InputLabel>
                <Select
                  value={editDialog.item.requiredRole}
                  label="Required Role"
                  onChange={(e) => setEditDialog(prev => ({
                    ...prev,
                    item: prev.item ? { ...prev.item, requiredRole: e.target.value as 'user' | 'data-steward' | 'admin' } : null
                  }))}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="data-steward">Data Steward</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Order"
                type="number"
                value={editDialog.item.order}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  item: prev.item ? { ...prev.item, order: parseInt(e.target.value) || 0 } : null
                }))}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, item: null })}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMenuManagement;

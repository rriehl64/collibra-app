import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Save,
  Cancel,
  ArrowUpward,
  ArrowDownward,
  Settings
} from '@mui/icons-material';
import teamRosterPicklistService, { Picklist, PicklistValue } from '../services/teamRosterPicklistService';
import { useAuth } from '../contexts/AuthContext';

const TeamRosterPicklistManagement: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [picklists, setPicklists] = useState<Picklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingValue, setEditingValue] = useState<PicklistValue | null>(null);
  const [newValue, setNewValue] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const picklistTypes = [
    { type: 'role', label: 'Roles' },
    { type: 'branch', label: 'Branches' },
    { type: 'positionTitle', label: 'Position Titles' }
  ];

  useEffect(() => {
    loadPicklists();
  }, []);

  const loadPicklists = async () => {
    try {
      setLoading(true);
      const data = await teamRosterPicklistService.getAll();
      
      // If no picklists exist, initialize them
      if (data.length === 0) {
        const initialized = await teamRosterPicklistService.initialize();
        setPicklists(initialized);
      } else {
        setPicklists(data);
      }
    } catch (error) {
      console.error('Error loading picklists:', error);
      showSnackbar('Error loading picklists', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPicklist = (): Picklist | undefined => {
    const type = picklistTypes[currentTab].type;
    return picklists.find(p => p.type === type);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddValue = async () => {
    if (!newValue.trim()) {
      showSnackbar('Please enter a value', 'error');
      return;
    }

    try {
      const type = picklistTypes[currentTab].type;
      const currentPicklist = getCurrentPicklist();
      const displayOrder = currentPicklist ? currentPicklist.values.length + 1 : 1;
      
      await teamRosterPicklistService.addValue(type, newValue.trim(), displayOrder);
      await loadPicklists();
      setNewValue('');
      setAddDialogOpen(false);
      showSnackbar('Value added successfully');
    } catch (error: any) {
      console.error('Error adding value:', error);
      showSnackbar(error.response?.data?.error || 'Error adding value', 'error');
    }
  };

  const handleDeleteValue = async (valueId: string) => {
    if (!window.confirm('Are you sure you want to delete this value?')) {
      return;
    }

    try {
      const type = picklistTypes[currentTab].type;
      await teamRosterPicklistService.deleteValue(type, valueId);
      await loadPicklists();
      showSnackbar('Value deleted successfully');
    } catch (error) {
      console.error('Error deleting value:', error);
      showSnackbar('Error deleting value', 'error');
    }
  };

  const handleMoveValue = async (index: number, direction: 'up' | 'down') => {
    const currentPicklist = getCurrentPicklist();
    if (!currentPicklist) return;

    const newValues = [...currentPicklist.values];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newValues.length) return;

    // Swap values
    [newValues[index], newValues[targetIndex]] = [newValues[targetIndex], newValues[index]];

    // Update display orders
    newValues.forEach((val, idx) => {
      val.displayOrder = idx + 1;
    });

    try {
      const type = picklistTypes[currentTab].type;
      await teamRosterPicklistService.update(type, newValues, user?.name || 'admin');
      await loadPicklists();
      showSnackbar('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      showSnackbar('Error updating order', 'error');
    }
  };

  const handleToggleActive = async (valueId: string) => {
    const currentPicklist = getCurrentPicklist();
    if (!currentPicklist) return;

    const newValues = currentPicklist.values.map(v =>
      v._id === valueId ? { ...v, isActive: !v.isActive } : v
    );

    try {
      const type = picklistTypes[currentTab].type;
      await teamRosterPicklistService.update(type, newValues, user?.name || 'admin');
      await loadPicklists();
      showSnackbar('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Error updating status', 'error');
    }
  };

  const currentPicklist = getCurrentPicklist();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
            Team Roster Picklist Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage dropdown values for Role, Branch, and Position Title fields
          </Typography>
        </Box>
        <Settings sx={{ fontSize: 40, color: '#003366' }} />
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            },
            '& .Mui-selected': {
              color: '#003366'
            }
          }}
        >
          {picklistTypes.map((type, index) => (
            <Tab key={type.type} label={type.label} />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#003366' }}>
              {picklistTypes[currentTab].label}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ backgroundColor: '#003366' }}
            >
              Add New Value
            </Button>
          </Box>

          {currentPicklist && currentPicklist.values.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPicklist.values
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((value, index) => (
                      <TableRow key={value._id}>
                        <TableCell>{value.displayOrder}</TableCell>
                        <TableCell>
                          <Typography variant="body1">{value.value}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={value.isActive ? 'Active' : 'Inactive'}
                            color={value.isActive ? 'success' : 'default'}
                            size="small"
                            onClick={() => handleToggleActive(value._id!)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleMoveValue(index, 'up')}
                            disabled={index === 0}
                            aria-label="Move up"
                          >
                            <ArrowUpward />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveValue(index, 'down')}
                            disabled={index === currentPicklist.values.length - 1}
                            aria-label="Move down"
                          >
                            <ArrowDownward />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteValue(value._id!)}
                            aria-label="Delete"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No values found. Click "Add New Value" to get started.
            </Alert>
          )}

          {currentPicklist && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Last modified: {new Date(currentPicklist.lastModified).toLocaleString()} by {currentPicklist.modifiedBy}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Add Value Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New {picklistTypes[currentTab].label.slice(0, -1)}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Value"
            fullWidth
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddValue();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddValue} variant="contained" sx={{ backgroundColor: '#003366' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamRosterPicklistManagement;

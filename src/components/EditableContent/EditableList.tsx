import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface EditableListItem {
  text: string;
  order: number;
  _id?: string;
}

interface EditableListProps {
  items: EditableListItem[];
  onUpdateItem: (index: number, newText: string) => Promise<void>;
  onAddItem: (newText: string) => Promise<void>;
  onDeleteItem: (index: number) => Promise<void>;
  iconColor?: string;
  disabled?: boolean;
  addButtonText?: string;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  iconColor = '#1976d2',
  disabled = false,
  addButtonText = 'Add Item'
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const handleEdit = (index: number, currentText: string) => {
    if (disabled) return;
    setEditingIndex(index);
    setEditValue(currentText);
  };

  const handleSave = async (index: number) => {
    if (editValue.trim() === items[index].text.trim()) {
      setEditingIndex(null);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateItem(index, editValue.trim());
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating item:', error);
      setEditValue(items[index].text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleAdd = async () => {
    if (!newItemText.trim()) return;

    setIsLoading(true);
    try {
      await onAddItem(newItemText.trim());
      setNewItemText('');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    setIsLoading(true);
    try {
      await onDeleteItem(index);
      setDeleteConfirmIndex(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave(index);
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Box>
      <List dense>
        {items.map((item, index) => (
          <ListItem 
            key={index} 
            sx={{ 
              py: 0.5,
              '&:hover .item-actions': {
                opacity: disabled ? 0 : 1
              },
              border: '1px solid transparent',
              borderRadius: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: disabled ? 'transparent' : 'rgba(0, 51, 102, 0.02)',
                border: disabled ? '1px solid transparent' : '1px solid rgba(0, 51, 102, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CheckIcon sx={{ fontSize: 16, color: iconColor }} />
            </ListItemIcon>
            
            {editingIndex === index ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  autoFocus
                />
                <IconButton
                  onClick={() => handleSave(index)}
                  disabled={isLoading}
                  size="small"
                  color="primary"
                >
                  {isLoading ? <CircularProgress size={16} /> : <SaveIcon fontSize="small" />}
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                  disabled={isLoading}
                  size="small"
                  color="secondary"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                  sx={{ cursor: disabled ? 'default' : 'pointer' }}
                  onClick={() => handleEdit(index, item.text)}
                />
                {!disabled && (
                  <Box 
                    className="item-actions"
                    sx={{ 
                      opacity: 0, 
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      gap: 0.5
                    }}
                  >
                    <Tooltip title="Edit item">
                      <IconButton
                        onClick={() => handleEdit(index, item.text)}
                        size="small"
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete item">
                      <IconButton
                        onClick={() => setDeleteConfirmIndex(index)}
                        size="small"
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>

      {!disabled && (
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {addButtonText}
          </Button>
        </Box>
      )}

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item text"
            fullWidth
            variant="outlined"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAdd} 
            variant="contained"
            disabled={!newItemText.trim() || isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmIndex !== null} 
        onClose={() => setDeleteConfirmIndex(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmIndex(null)}>Cancel</Button>
          <Button 
            onClick={() => deleteConfirmIndex !== null && handleDelete(deleteConfirmIndex)}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditableList;

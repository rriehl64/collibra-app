import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Button,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { CorePractice, PracticeItem } from '../../services/federalDataStrategyService';

interface EditableCorePracticeCardProps {
  practice: CorePractice;
  index: number;
  onSave: (index: number, updatedPractice: Partial<CorePractice>) => Promise<void>;
  getPracticeIcon: (title: string) => React.ReactNode;
  disabled?: boolean;
}

const colorOptions = [
  { value: '#1976d2', label: 'Blue' },
  { value: '#388e3c', label: 'Green' },
  { value: '#f57c00', label: 'Orange' },
  { value: '#7b1fa2', label: 'Purple' },
  { value: '#d32f2f', label: 'Red' },
  { value: '#0288d1', label: 'Light Blue' },
  { value: '#689f38', label: 'Light Green' },
  { value: '#fbc02d', label: 'Yellow' },
  { value: '#e64a19', label: 'Deep Orange' },
  { value: '#5d4037', label: 'Brown' }
];

const EditableCorePracticeCard: React.FC<EditableCorePracticeCardProps> = ({
  practice,
  index,
  onSave,
  getPracticeIcon,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: practice.title,
    color: practice.color,
    practices: [...practice.practices]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const firstFieldRef = useRef<any>(null);

  // Reset edit values when practice changes
  useEffect(() => {
    setEditValues({
      title: practice.title,
      color: practice.color,
      practices: [...practice.practices]
    });
  }, [practice]);

  // Focus first field when entering edit mode
  useEffect(() => {
    if (isEditing && firstFieldRef.current) {
      setTimeout(() => {
        const inputElement = firstFieldRef.current.querySelector('input, textarea');
        if (inputElement) {
          inputElement.focus();
          if (typeof inputElement.select === 'function') {
            inputElement.select();
          }
        }
      }, 100);
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Check if any values have changed
    const hasChanges = 
      editValues.title.trim() !== practice.title.trim() ||
      editValues.color !== practice.color ||
      JSON.stringify(editValues.practices) !== JSON.stringify(practice.practices);

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Basic validation
    if (!editValues.title.trim()) {
      alert('Please fill in the practice title field.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedPractice: Partial<CorePractice> = {
        title: editValues.title.trim(),
        color: editValues.color,
        practices: editValues.practices.map((item, idx) => ({
          ...item,
          order: idx + 1
        }))
      };

      await onSave(index, updatedPractice);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving practice:', error);
      // Reset to original values on error
      setEditValues({
        title: practice.title,
        color: practice.color,
        practices: [...practice.practices]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditValues({
      title: practice.title,
      color: practice.color,
      practices: [...practice.practices]
    });
    setNewItemText('');
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: PracticeItem = {
        text: newItemText.trim(),
        order: editValues.practices.length + 1
      };
      setEditValues(prev => ({
        ...prev,
        practices: [...prev.practices, newItem]
      }));
      setNewItemText('');
    }
  };

  const handleUpdateItem = (itemIndex: number, newText: string) => {
    setEditValues(prev => ({
      ...prev,
      practices: prev.practices.map((item, idx) => 
        idx === itemIndex ? { ...item, text: newText } : item
      )
    }));
  };

  const handleDeleteItem = (itemIndex: number) => {
    setEditValues(prev => ({
      ...prev,
      practices: prev.practices.filter((_, idx) => idx !== itemIndex)
    }));
  };

  if (isEditing) {
    return (
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          height: '100%',
          borderTop: `4px solid ${editValues.color}`,
          position: 'relative'
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, color: editValues.color, fontWeight: 600 }}>
          Editing Practice {index + 1}
        </Typography>
        
        <Stack spacing={3} onKeyDown={handleKeyDown}>
          {/* Title Field */}
          <TextField
            ref={firstFieldRef}
            label="Practice Title"
            value={editValues.title}
            onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
            variant="outlined"
            size="small"
            fullWidth
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                fontWeight: 600,
              }
            }}
          />

          {/* Color Selection */}
          <FormControl size="small" fullWidth>
            <InputLabel>Color Theme</InputLabel>
            <Select
              value={editValues.color}
              label="Color Theme"
              onChange={(e) => setEditValues(prev => ({ ...prev, color: e.target.value }))}
              disabled={isLoading}
            >
              {colorOptions.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 20, 
                        height: 20, 
                        backgroundColor: color.value, 
                        borderRadius: 1 
                      }} 
                    />
                    {color.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Practices Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Practice Items ({editValues.practices.length})
            </Typography>
            
            {editValues.practices.length > 0 && (
              <Paper variant="outlined" sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {editValues.practices.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <TextField
                              value={item.text}
                              onChange={(e) => handleUpdateItem(itemIndex, e.target.value)}
                              variant="standard"
                              size="small"
                              fullWidth
                              disabled={isLoading}
                              multiline
                              maxRows={3}
                            />
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteItem(itemIndex)}
                            disabled={isLoading}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {itemIndex < editValues.practices.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* Add New Item */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Add new practice item"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                disabled={isLoading}
                multiline
                maxRows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddItem}
                disabled={isLoading || !newItemText.trim()}
                startIcon={<AddIcon />}
                size="small"
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isLoading}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
              sx={{
                backgroundColor: editValues.color,
                '&:hover': { 
                  backgroundColor: editValues.color,
                  filter: 'brightness(0.9)'
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3,
        height: '100%',
        borderTop: `4px solid ${practice.color}`,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': {
          boxShadow: disabled ? 3 : 6,
          transform: disabled ? 'none' : 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
          '& .edit-icon': {
            opacity: disabled ? 0 : 1
          }
        }
      }}
      onClick={handleEdit}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleEdit();
        }
      }}
      aria-label={disabled ? undefined : `Click to edit ${practice.title} practice`}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color: practice.color, mr: 2 }}>
          {getPracticeIcon(practice.title)}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: practice.color }}
        >
          {practice.title}
        </Typography>
      </Box>
      
      {practice.practices.length > 0 && (
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            Best Practices ({practice.practices.length}):
          </Typography>
          <Stack spacing={0.5}>
            {practice.practices.slice(0, 4).map((item, itemIndex) => (
              <Chip
                key={itemIndex}
                label={item.text}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: practice.color,
                  color: practice.color,
                  fontSize: '0.75rem',
                  height: 'auto',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    textAlign: 'left',
                    padding: '4px 8px'
                  }
                }}
              />
            ))}
            {practice.practices.length > 4 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                +{practice.practices.length - 4} more practices...
              </Typography>
            )}
          </Stack>
        </Box>
      )}
      
      {!disabled && (
        <Tooltip title={`Edit ${practice.title} practice`}>
          <IconButton
            className="edit-icon"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: showEditIcon ? 1 : 0,
              transition: 'opacity 0.2s ease',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              }
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

export default EditableCorePracticeCard;

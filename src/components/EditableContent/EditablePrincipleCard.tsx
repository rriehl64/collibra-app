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
  Card,
  CardContent,
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
  Delete as DeleteIcon,
  Palette as ColorIcon
} from '@mui/icons-material';
import { Principle, PrincipleItem } from '../../services/federalDataStrategyService';

interface EditablePrincipleCardProps {
  principle: Principle;
  index: number;
  onSave: (index: number, updatedPrinciple: Partial<Principle>) => Promise<void>;
  getPrincipleIcon: (category: string) => React.ReactNode;
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

const EditablePrincipleCard: React.FC<EditablePrincipleCardProps> = ({
  principle,
  index,
  onSave,
  getPrincipleIcon,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    category: principle.category,
    description: principle.description,
    color: principle.color,
    items: [...principle.items]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const firstFieldRef = useRef<any>(null);

  // Reset edit values when principle changes
  useEffect(() => {
    setEditValues({
      category: principle.category,
      description: principle.description,
      color: principle.color,
      items: [...principle.items]
    });
  }, [principle]);

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
      editValues.category.trim() !== principle.category.trim() ||
      editValues.description.trim() !== principle.description.trim() ||
      editValues.color !== principle.color ||
      JSON.stringify(editValues.items) !== JSON.stringify(principle.items);

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Basic validation
    if (!editValues.category.trim() || !editValues.description.trim()) {
      alert('Please fill in the category and description fields.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedPrinciple: Partial<Principle> = {
        category: editValues.category.trim(),
        description: editValues.description.trim(),
        color: editValues.color,
        items: editValues.items.map((item, idx) => ({
          ...item,
          order: idx + 1
        }))
      };

      await onSave(index, updatedPrinciple);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving principle:', error);
      // Reset to original values on error
      setEditValues({
        category: principle.category,
        description: principle.description,
        color: principle.color,
        items: [...principle.items]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditValues({
      category: principle.category,
      description: principle.description,
      color: principle.color,
      items: [...principle.items]
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
      const newItem: PrincipleItem = {
        text: newItemText.trim(),
        order: editValues.items.length + 1
      };
      setEditValues(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      setNewItemText('');
    }
  };

  const handleUpdateItem = (itemIndex: number, newText: string) => {
    setEditValues(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => 
        idx === itemIndex ? { ...item, text: newText } : item
      )
    }));
  };

  const handleDeleteItem = (itemIndex: number) => {
    setEditValues(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== itemIndex)
    }));
  };

  if (isEditing) {
    return (
      <Card 
        sx={{ 
          height: '100%',
          border: `2px solid ${editValues.color}`,
          position: 'relative'
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: editValues.color, fontWeight: 600 }}>
            Editing Principle {index + 1}
          </Typography>
          
          <Stack spacing={3} onKeyDown={handleKeyDown}>
            {/* Category Field */}
            <TextField
              ref={firstFieldRef}
              label="Principle Category"
              value={editValues.category}
              onChange={(e) => setEditValues(prev => ({ ...prev, category: e.target.value }))}
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

            {/* Description Field */}
            <TextField
              label="Principle Description"
              value={editValues.description}
              onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
              variant="outlined"
              size="small"
              multiline
              rows={3}
              fullWidth
              disabled={isLoading}
            />

            {/* Items Section */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Principle Items ({editValues.items.length})
              </Typography>
              
              {editValues.items.length > 0 && (
                <Paper variant="outlined" sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {editValues.items.map((item, itemIndex) => (
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
                        {itemIndex < editValues.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}

              {/* Add New Item */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Add new item"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        border: `2px solid ${principle.color}`,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': {
          boxShadow: disabled ? 2 : 6,
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
      aria-label={disabled ? undefined : `Click to edit ${principle.category} principle`}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color: principle.color, mr: 2 }}>
            {getPrincipleIcon(principle.category)}
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: principle.color }}
          >
            {principle.category}
          </Typography>
        </Box>
        
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 2 }}
        >
          {principle.description}
        </Typography>
        
        {principle.items.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
              Key Points ({principle.items.length}):
            </Typography>
            <Stack spacing={0.5}>
              {principle.items.slice(0, 3).map((item, itemIndex) => (
                <Chip
                  key={itemIndex}
                  label={item.text}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: principle.color,
                    color: principle.color,
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
              {principle.items.length > 3 && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  +{principle.items.length - 3} more items...
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
      
      {!disabled && (
        <Tooltip title={`Edit ${principle.category} principle`}>
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
    </Card>
  );
};

export default EditablePrincipleCard;

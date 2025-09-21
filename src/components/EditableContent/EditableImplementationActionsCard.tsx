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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { ImplementationAction } from '../../services/federalDataStrategyService';

interface EditableImplementationActionsCardProps {
  actions: ImplementationAction[];
  onSave: (updatedActions: ImplementationAction[]) => Promise<void>;
  disabled?: boolean;
}

const EditableImplementationActionsCard: React.FC<EditableImplementationActionsCardProps> = ({
  actions,
  onSave,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editActions, setEditActions] = useState<ImplementationAction[]>([...actions]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const firstFieldRef = useRef<any>(null);

  // Reset edit values when actions change
  useEffect(() => {
    setEditActions([...actions]);
  }, [actions]);

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
    const hasChanges = JSON.stringify(editActions) !== JSON.stringify(actions);

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Basic validation - check for empty actions
    const emptyActions = editActions.filter(action => !action.text.trim());
    if (emptyActions.length > 0) {
      alert('Please fill in all action items or remove empty ones.');
      return;
    }

    setIsLoading(true);
    try {
      // Reorder actions and ensure they have proper order values
      const orderedActions = editActions.map((action, index) => ({
        ...action,
        order: index + 1
      }));

      await onSave(orderedActions);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving implementation actions:', error);
      // Reset to original values on error
      setEditActions([...actions]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditActions([...actions]);
    setNewActionText('');
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

  const handleAddAction = () => {
    if (newActionText.trim()) {
      const newAction: ImplementationAction = {
        text: newActionText.trim(),
        order: editActions.length + 1
      };
      setEditActions(prev => [...prev, newAction]);
      setNewActionText('');
    }
  };

  const handleUpdateAction = (actionIndex: number, newText: string) => {
    setEditActions(prev => 
      prev.map((action, idx) => 
        idx === actionIndex ? { ...action, text: newText } : action
      )
    );
  };

  const handleDeleteAction = (actionIndex: number) => {
    setEditActions(prev => prev.filter((_, idx) => idx !== actionIndex));
  };

  const handleMoveAction = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editActions.length) return;
    
    const newActions = [...editActions];
    const [movedAction] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, movedAction);
    setEditActions(newActions);
  };

  if (isEditing) {
    return (
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#003366', fontWeight: 600 }}>
          Editing Implementation Actions
        </Typography>
        
        <Stack spacing={3} onKeyDown={handleKeyDown}>
          {/* Actions List */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Key 2020 Implementation Actions ({editActions.length})
            </Typography>
            
            {editActions.length > 0 && (
              <Paper variant="outlined" sx={{ mb: 2, maxHeight: 400, overflow: 'auto' }}>
                <List>
                  {editActions.map((action, actionIndex) => (
                    <React.Fragment key={actionIndex}>
                      <ListItem sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                          <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <TextField
                              ref={actionIndex === 0 ? firstFieldRef : null}
                              value={action.text}
                              onChange={(e) => handleUpdateAction(actionIndex, e.target.value)}
                              variant="standard"
                              size="small"
                              fullWidth
                              disabled={isLoading}
                              multiline
                              maxRows={4}
                              placeholder={`Implementation action ${actionIndex + 1}...`}
                            />
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {actionIndex > 0 && (
                              <IconButton
                                size="small"
                                onClick={() => handleMoveAction(actionIndex, actionIndex - 1)}
                                disabled={isLoading}
                                title="Move up"
                              >
                                <DragIcon fontSize="small" sx={{ transform: 'rotate(-90deg)' }} />
                              </IconButton>
                            )}
                            {actionIndex < editActions.length - 1 && (
                              <IconButton
                                size="small"
                                onClick={() => handleMoveAction(actionIndex, actionIndex + 1)}
                                disabled={isLoading}
                                title="Move down"
                              >
                                <DragIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAction(actionIndex)}
                              disabled={isLoading}
                              color="error"
                              title="Delete action"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {actionIndex < editActions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* Add New Action */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <CheckIcon sx={{ color: 'success.main', fontSize: 20, mt: 2 }} />
              <TextField
                label="Add new implementation action"
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                disabled={isLoading}
                multiline
                maxRows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddAction();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddAction}
                disabled={isLoading || !newActionText.trim()}
                startIcon={<AddIcon />}
                size="small"
                sx={{ minWidth: 'auto', px: 2, mt: 0.5 }}
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
                backgroundColor: '#003366',
                '&:hover': { backgroundColor: '#002244' }
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
      elevation={2} 
      sx={{ 
        p: 4, 
        mb: 4,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': {
          boxShadow: disabled ? 2 : 4,
          backgroundColor: disabled ? 'transparent' : 'rgba(0, 51, 102, 0.01)',
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
      aria-label={disabled ? undefined : "Click to edit implementation actions"}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Key 2020 Implementation Actions:
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <CheckIcon sx={{ color: 'success.main', mr: 1, fontSize: 20, mt: 0.2 }} />
                <Typography
                  variant="body2"
                  sx={{ 
                    lineHeight: 1.4,
                    color: 'text.primary'
                  }}
                >
                  {action.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {actions.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No implementation actions defined. Click to add some.
          </Typography>
        )}
        
        {!disabled && (
          <Tooltip title="Edit implementation actions">
            <IconButton
              className="edit-icon"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
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
      </Box>
    </Paper>
  );
};

export default EditableImplementationActionsCard;

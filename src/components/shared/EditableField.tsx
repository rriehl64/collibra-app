import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEdit } from '../../contexts/EditContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface EditableFieldProps {
  content: string;
  onSave: (newContent: string) => void;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  fieldId: string;
  multiline?: boolean;
  minRows?: number;
  ariaLabel?: string;
  component?: React.ElementType;
  sx?: any;
}

const EditableField: React.FC<EditableFieldProps> = ({
  content,
  onSave,
  variant = 'body1',
  fieldId,
  multiline = false,
  minRows = 2,
  ariaLabel = 'Editable field',
  component,
  sx = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { editMode, setCurrentEditingSection, currentEditingSection, isUserAdmin } = useEdit();
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';
  const textFieldRef = useRef<HTMLDivElement>(null);

  // Reset edited content when external content changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  // Handle keyboard accessibility
  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      const input = textFieldRef.current.querySelector('input, textarea');
      if (input) {
        (input as HTMLElement).focus();
      }
    }
  }, [isEditing]);

  const handleEditClick = () => {
    if (!editMode) return;
    
    setIsEditing(true);
    setCurrentEditingSection(fieldId);
  };

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
    setCurrentEditingSection(null);
  };

  const handleCancel = () => {
    setEditedContent(content); // Revert to original content
    setIsEditing(false);
    setCurrentEditingSection(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 'Enter' && !multiline) {
      handleSave();
    } else if (event.key === 'Enter' && event.ctrlKey) {
      handleSave();
    }
  };

  const textSizeProps = largeText ? { fontSize: variant === 'body1' ? '1.1rem' : '1.3rem' } : {};
  const containerProps = {
    sx: {
      position: 'relative',
      cursor: editMode && !isEditing ? 'pointer' : 'default',
      padding: editMode && !isEditing ? '8px' : '0',
      margin: editMode && !isEditing ? '-8px' : '0',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: editMode && !isEditing && !highContrast ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
        boxShadow: editMode && !isEditing ? '0 0 0 1px rgba(0, 102, 204, 0.5)' : 'none',
      },
      border: editMode && !isEditing ? '1px dashed transparent' : 'none',
      '&:hover .editHintText': {
        opacity: 1,
      },
      ...sx
    },
    onClick: editMode && !isEditing ? handleEditClick : undefined,
    role: editMode && !isEditing ? 'button' : undefined,
    tabIndex: editMode && !isEditing ? 0 : undefined,
    'aria-label': editMode && !isEditing ? `Edit ${ariaLabel}` : undefined,
    onKeyDown: editMode && !isEditing ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleEditClick();
        e.preventDefault();
      }
    } : undefined,
  };

  // If not admin or not in edit mode, just render the content
  if (!isUserAdmin || (!editMode && !isEditing)) {
    return (
      <Typography
        variant={variant}
        component={component || 'div'}
        sx={{ ...textSizeProps, ...sx }}
      >
        {content}
      </Typography>
    );
  }

  if (isEditing && currentEditingSection === fieldId) {
    return (
      <Paper elevation={2} sx={{ p: 2, position: 'relative' }}>
        <TextField
          fullWidth
          multiline={multiline}
          minRows={multiline ? minRows : 1}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          inputProps={{ 'aria-label': ariaLabel }}
          ref={textFieldRef}
          sx={{
            '& .MuiInputBase-input': {
              ...textSizeProps
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Tooltip title="Cancel (Esc)">
            <IconButton onClick={handleCancel} size="small" aria-label="Cancel editing">
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save (Ctrl+Enter)">
            <IconButton 
              onClick={handleSave} 
              color="primary" 
              size="small"
              sx={{ ml: 1 }} 
              aria-label="Save changes"
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  }

  return (
    <Box {...containerProps}>
      <Typography
        variant={variant}
        component={component || 'div'}
        sx={{ ...textSizeProps }}
      >
        {content}
      </Typography>
      {editMode && !isEditing && (
        <Typography 
          variant="caption" 
          className="editHintText"
          sx={{
            position: 'absolute',
            bottom: '-18px',
            right: '4px',
            color: 'text.secondary',
            opacity: 0,
            transition: 'opacity 0.2s',
            backgroundColor: 'background.paper',
            px: 1,
            borderRadius: '4px',
          }}
        >
          Click to edit
        </Typography>
      )}
    </Box>
  );
};

export default EditableField;

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface EditableContentProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2';
  multiline?: boolean;
  placeholder?: string;
  sx?: any;
  component?: string;
  gutterBottom?: boolean;
  color?: string;
  fontWeight?: string | number;
  textAlign?: string;
  maxWidth?: string | number;
  mx?: string;
  mb?: number;
  disabled?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  onSave,
  variant = 'body1',
  multiline = false,
  placeholder = 'Click to edit...',
  sx = {},
  component,
  gutterBottom,
  color,
  fontWeight,
  textAlign,
  maxWidth,
  mx,
  mb,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const textFieldRef = useRef<any>(null);

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      // For Material-UI TextField, we need to access the input element
      const inputElement = textFieldRef.current.querySelector('input, textarea');
      if (inputElement) {
        inputElement.focus();
        // Only call select() if it exists (not available on textarea elements)
        if (typeof inputElement.select === 'function') {
          inputElement.select();
        }
      }
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue.trim() === content.trim()) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      // Reset to original content on error
      setEditValue(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !multiline) {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const combinedSx = {
    ...sx,
    ...(component && { component }),
    ...(gutterBottom && { gutterBottom }),
    ...(color && { color }),
    ...(fontWeight && { fontWeight }),
    ...(textAlign && { textAlign }),
    ...(maxWidth && { maxWidth }),
    ...(mx && { mx }),
    ...(mb && { mb })
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
        <TextField
          ref={textFieldRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline={multiline}
          rows={multiline ? 3 : 1}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          fullWidth
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: variant.startsWith('h') ? '1.5rem' : '1rem',
              fontWeight: variant.startsWith('h') ? 600 : 400,
            }
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Tooltip title="Save changes">
            <IconButton
              onClick={handleSave}
              disabled={isLoading}
              size="small"
              color="primary"
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              {isLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              onClick={handleCancel}
              disabled={isLoading}
              size="small"
              color="secondary"
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': {
          backgroundColor: disabled ? 'transparent' : 'rgba(0, 51, 102, 0.02)',
          border: disabled ? 'none' : '1px solid rgba(0, 51, 102, 0.1)',
          borderRadius: 1,
          transition: 'background-color 0.2s ease',
          '& .edit-icon': {
            opacity: disabled ? 0 : 1
          }
        },
        p: 1,
        borderRadius: 1,
        border: disabled ? 'none' : '1px solid transparent'
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
      aria-label={disabled ? undefined : "Click to edit content"}
    >
      <Typography
        variant={variant}
        sx={combinedSx}
      >
        {content || placeholder}
      </Typography>
      {!disabled && (
        <IconButton
          className="edit-icon"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
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
      )}
    </Box>
  );
};

export default EditableContent;

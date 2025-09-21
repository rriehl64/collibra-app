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
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface EditableField {
  key: string;
  label: string;
  value: string;
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
}

interface EditableSectionProps {
  title?: string;
  fields: EditableField[];
  onSave: (updatedFields: { [key: string]: string }) => Promise<void>;
  disabled?: boolean;
  sx?: any;
  elevation?: number;
  backgroundColor?: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  fields,
  onSave,
  disabled = false,
  sx = {},
  elevation = 0,
  backgroundColor = 'transparent'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const firstFieldRef = useRef<any>(null);

  // Initialize edit values from fields
  useEffect(() => {
    const initialValues: { [key: string]: string } = {};
    fields.forEach(field => {
      initialValues[field.key] = field.value;
    });
    setEditValues(initialValues);
  }, [fields]);

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
    const hasChanges = fields.some(field => 
      editValues[field.key]?.trim() !== field.value.trim()
    );

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Basic validation - check for empty required fields
    const emptyFields = fields.filter(field => 
      !editValues[field.key]?.trim() && field.value.trim()
    );

    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyFields.map(f => f.label).join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      // Only send changed values
      const changedValues: { [key: string]: string } = {};
      fields.forEach(field => {
        if (editValues[field.key]?.trim() !== field.value.trim()) {
          changedValues[field.key] = editValues[field.key]?.trim() || '';
        }
      });

      await onSave(changedValues);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving section:', error);
      // Reset to original values on error
      const originalValues: { [key: string]: string } = {};
      fields.forEach(field => {
        originalValues[field.key] = field.value;
      });
      setEditValues(originalValues);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    const originalValues: { [key: string]: string } = {};
    fields.forEach(field => {
      originalValues[field.key] = field.value;
    });
    setEditValues(originalValues);
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleKeyDown = (event: React.KeyboardEvent, field: EditableField) => {
    if (event.key === 'Enter' && !field.multiline) {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = fields.some(field => 
    editValues[field.key]?.trim() !== field.value.trim()
  );

  const combinedSx = {
    ...sx,
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
    p: 2,
    borderRadius: 1,
    border: disabled ? 'none' : '1px solid transparent',
    backgroundColor: backgroundColor
  };

  if (isEditing) {
    return (
      <Paper elevation={elevation} sx={{ p: 3, backgroundColor }}>
        {title && (
          <Typography variant="h5" sx={{ mb: 3, color: '#003366', fontWeight: 600 }}>
            {title} - Editing
          </Typography>
        )}
        
        <Stack spacing={3}>
          {fields.map((field, index) => (
            <Box key={field.key}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                {field.label}
              </Typography>
              <TextField
                ref={index === 0 ? firstFieldRef : null}
                value={editValues[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, field)}
                multiline={field.multiline}
                rows={field.multiline ? 3 : 1}
                variant="outlined"
                size="small"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                fullWidth
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: field.variant?.startsWith('h') ? '1.5rem' : '1rem',
                    fontWeight: field.variant?.startsWith('h') ? 600 : 400,
                  }
                }}
              />
            </Box>
          ))}
          
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
      elevation={elevation}
      sx={combinedSx}
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
      aria-label={disabled ? undefined : `Click to edit ${title || 'section'}`}
    >
      {title && (
        <Typography variant="h5" sx={{ mb: 2, color: '#003366', fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      
      {fields.map((field) => {
        const fieldSx = {
          ...(field.sx || {}),
          ...(field.component && { component: field.component }),
          ...(field.gutterBottom && { gutterBottom: field.gutterBottom }),
          ...(field.color && { color: field.color }),
          ...(field.fontWeight && { fontWeight: field.fontWeight }),
          ...(field.textAlign && { textAlign: field.textAlign }),
          ...(field.maxWidth && { maxWidth: field.maxWidth }),
          ...(field.mx && { mx: field.mx }),
          ...(field.mb && { mb: field.mb })
        };

        return (
          <Typography
            key={field.key}
            variant={field.variant || 'body1'}
            sx={fieldSx}
          >
            {field.value || field.placeholder}
          </Typography>
        );
      })}
      
      {!disabled && (
        <Tooltip title={`Edit ${title || 'section'}`}>
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

export default EditableSection;

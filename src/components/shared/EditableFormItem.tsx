import React from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditableField from './EditableField';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useEdit } from '../../contexts/EditContext';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface FormData {
  _id?: string;
  formName: string;
  formDescription: string;
  formUrl: string;
}

interface EditableFormItemProps {
  formData: FormData;
  onUpdate: (updatedForm: FormData) => void;
  onDelete: () => void;
  highContrast: boolean;
  largeText: boolean;
  textSizeProps: any;
  index: number;
}

const EditableFormItem: React.FC<EditableFormItemProps> = ({
  formData,
  onUpdate,
  onDelete,
  highContrast,
  largeText,
  textSizeProps,
  index
}) => {
  const { editMode, isUserAdmin } = useEdit();
  
  const secondaryTextSizeProps = largeText 
    ? { fontSize: '1rem' } 
    : { fontSize: '0.875rem' };
    
  const handleUpdate = (field: keyof FormData, value: string) => {
    onUpdate({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: '100%',
        border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
      }}
    >
      <CardContent>
        {isUserAdmin && editMode && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mr: -1 }}>
            <Tooltip title="Delete this form">
              <IconButton 
                size="small" 
                onClick={onDelete}
                aria-label="Delete form"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachFileIcon sx={{ 
            color: highContrast ? '#000000' : '#003366',
            mr: 1,
            fontSize: '1.8rem'
          }} />
          <EditableField
            content={formData.formName}
            onSave={(value) => handleUpdate('formName', value)}
            variant="h6"
            component="h3"
            fieldId={`form-name-${index}`}
            ariaLabel={`Form name ${index + 1}`}
            sx={{ 
              color: highContrast ? '#000000' : '#003366',
              fontSize: largeText ? '1.3rem' : '1.15rem',
              fontWeight: 'bold'
            }}
          />
        </Box>
        
        <EditableField
          content={formData.formDescription}
          onSave={(value) => handleUpdate('formDescription', value)}
          variant="body1"
          fieldId={`form-description-${index}`}
          ariaLabel={`Form description ${index + 1}`}
          multiline
          sx={{ 
            mb: 2,
            ...textSizeProps
          }}
        />
        
        {editMode ? (
          <EditableField
            content={formData.formUrl}
            onSave={(value) => handleUpdate('formUrl', value)}
            variant="body2"
            fieldId={`form-url-${index}`}
            ariaLabel={`Form URL ${index + 1}`}
            sx={{ 
              color: highContrast ? '#000066' : '#0066cc',
              textDecoration: 'underline',
              fontWeight: 'medium',
              ...secondaryTextSizeProps
            }}
          />
        ) : (
          <a 
            href={formData.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: highContrast ? '#000066' : '#0066cc',
              textDecoration: 'underline',
              fontWeight: 'medium',
              fontSize: secondaryTextSizeProps.fontSize
            }}
            aria-label={`${formData.formName} (opens in a new tab)`}
          >
            View Form Information
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableFormItem;

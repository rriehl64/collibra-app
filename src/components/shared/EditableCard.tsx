import React from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import EditableField from './EditableField';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface EditableCardProps {
  title: string;
  description: string;
  onTitleSave: (newTitle: string) => void;
  onDescriptionSave: (newDescription: string) => void;
  titleId: string;
  descriptionId: string;
}

const EditableCard: React.FC<EditableCardProps> = ({
  title,
  description,
  onTitleSave,
  onDescriptionSave,
  titleId,
  descriptionId
}) => {
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: '100%',
        border: highContrast ? '1px solid #000000' : '1px solid #ccc',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        }
      }}
      role="region"
      aria-label={`${title} - clickable card`}
    >
      <CardContent>
        <EditableField
          content={title}
          onSave={onTitleSave}
          variant="h6"
          fieldId={titleId}
          ariaLabel="Card title"
          component="h3"
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontSize: largeText ? '1.3rem' : '1.15rem',
            fontWeight: 'bold',
            mb: 1
          }}
        />
        <Box mt={1}>
          <EditableField
            content={description}
            onSave={onDescriptionSave}
            variant="body2"
            fieldId={descriptionId}
            ariaLabel="Card description"
            multiline
            sx={{ 
              fontSize: largeText ? '1.1rem' : 'inherit'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditableCard;

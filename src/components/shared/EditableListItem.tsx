import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import EditableField from './EditableField';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface EditableListItemProps {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  onPrimarySave: (value: string) => void;
  onSecondarySave: (value: string) => void;
  primaryId: string;
  secondaryId: string;
  iconColor?: string;
  dense?: boolean;
}

const EditableListItem: React.FC<EditableListItemProps> = ({
  icon,
  primary,
  secondary,
  onPrimarySave,
  onSecondarySave,
  primaryId,
  secondaryId,
  iconColor,
  dense = false
}) => {
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const secondaryTextSizeProps = largeText 
    ? { fontSize: '1rem' } 
    : { fontSize: '0.875rem' };

  return (
    <ListItem sx={{ py: dense ? 0.75 : 1.5 }}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <EditableField
            content={primary}
            onSave={onPrimarySave}
            variant="body1"
            fieldId={primaryId}
            ariaLabel="Item title"
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              ...textSizeProps
            }}
          />
        }
        secondary={
          <EditableField
            content={secondary}
            onSave={onSecondarySave}
            variant="body2"
            fieldId={secondaryId}
            ariaLabel="Item description"
            multiline
            sx={{ 
              ...secondaryTextSizeProps,
              color: highContrast ? '#000000' : 'text.secondary'
            }}
          />
        }
      />
    </ListItem>
  );
};

export default EditableListItem;

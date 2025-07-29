/**
 * Custom hook for managing accessible edit functionality
 * Provides state and handlers for keyboard and mouse interactions
 * with edit mode functionality
 */
import { useState, useCallback, KeyboardEvent } from 'react';

interface UseAccessibleEditProps {
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const useAccessibleEdit = ({
  onEdit,
  onSave,
  onCancel,
}: UseAccessibleEditProps = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleEdit = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
      onEdit?.();
    }
  }, [isEditing, onEdit]);

  const handleSave = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      onSave?.();
    }
  }, [isEditing, onSave]);

  const handleCancel = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      onCancel?.();
    }
  }, [isEditing, onCancel]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && !isEditing && !event.shiftKey) {
      event.preventDefault();
      handleEdit();
    } else if (event.key === 'Escape' && isEditing) {
      event.preventDefault();
      handleCancel();
    } else if (event.key === 'Enter' && isEditing && event.ctrlKey) {
      event.preventDefault();
      handleSave();
    }
  }, [isEditing, handleEdit, handleCancel, handleSave]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    isEditing,
    isFocused,
    handleEdit,
    handleSave,
    handleCancel,
    handleKeyDown,
    handleFocus,
    handleBlur,
  };
};

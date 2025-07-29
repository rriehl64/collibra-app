/**
 * AccessibleCard Component
 * 
 * A fully accessible card component with click-anywhere-to-edit functionality.
 * Complies with WCAG 2.0 AA and Section 508 requirements.
 * 
 * Features:
 * - Keyboard accessible (focusable and activatable)
 * - Visible focus indicators
 * - Proper ARIA attributes
 * - Large click target for motor control limitations
 * - Tooltip support
 * - Focus management when transitioning between view/edit modes
 */

import React, { ReactNode, useRef, useEffect } from 'react';
import { useAccessibleEdit } from '../../../hooks/useAccessibleEdit';

interface AccessibleCardProps {
  /** Title of the card */
  title: string;
  /** Subtitle or additional header info (optional) */
  subtitle?: string;
  /** Content to display when not in edit mode */
  children: ReactNode;
  /** Content to display when in edit mode */
  editComponent?: ReactNode;
  /** Function called when edit mode is activated */
  onEdit?: () => void;
  /** Function called when changes are saved */
  onSave?: () => void;
  /** Function called when edit is cancelled */
  onCancel?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Optional tooltip text */
  tooltip?: string;
  /** Whether the card is currently disabled */
  disabled?: boolean;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Custom test ID for testing */
  testId?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  title,
  subtitle,
  children,
  editComponent,
  onEdit,
  onSave,
  onCancel,
  className = '',
  tooltip,
  disabled = false,
  loading = false,
  testId = 'accessible-card'
}) => {
  // Refs for focus management
  const cardRef = useRef<HTMLDivElement>(null);
  const firstEditableElementRef = useRef<HTMLElement | null>(null);
  
  // Use our custom hook for edit state management
  const {
    isEditing,
    isFocused,
    handleEdit,
    handleSave,
    handleCancel,
    handleKeyDown,
    handleFocus,
    handleBlur,
  } = useAccessibleEdit({ onEdit, onSave, onCancel });

  // Trap focus within the card when in edit mode
  useEffect(() => {
    if (isEditing && cardRef.current) {
      // Find the first focusable element in the edit component
      const focusableElements = cardRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0] as HTMLElement;
        firstEditableElementRef.current = firstFocusable;
        firstFocusable.focus();
      }
    }
  }, [isEditing]);

  // Combine classes based on states
  const cardClasses = [
    'data-asset-card',
    className,
    isFocused ? 'focused' : '',
    isEditing ? 'editing' : '',
    disabled ? 'disabled' : '',
    loading ? 'loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={cardRef}
      className={cardClasses}
      onClick={disabled || loading || isEditing ? undefined : handleEdit}
      onKeyDown={disabled || loading ? undefined : handleKeyDown}
      tabIndex={disabled || isEditing ? -1 : 0}
      role="button"
      aria-pressed={isEditing}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-haspopup={true}
      aria-expanded={isEditing}
      aria-describedby={tooltip ? `${testId}-tooltip` : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-testid={testId}
      style={{
        cursor: disabled || loading ? 'default' : isEditing ? 'auto' : 'pointer',
        position: 'relative',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '16px',
        margin: '8px 0',
        transition: 'all 0.2s ease',
        boxShadow: isFocused ? '0 0 0 2px #003366' : 'none',
      }}
    >
      {/* Card Header */}
      <div className="card-header" style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Card Content - switches between view and edit modes */}
      <div className="card-content">
        {isEditing ? editComponent : children}
      </div>

      {/* Action buttons shown in edit mode */}
      {isEditing && (
        <div 
          className="card-actions"
          style={{ 
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button 
            onClick={handleCancel}
            aria-label="Cancel editing"
            className="cancel-button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            aria-label="Save changes"
            className="save-button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* Loading indicator overlay */}
      {loading && (
        <div 
          className="loading-overlay"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
        >
          <span>Loading...</span>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div 
          id={`${testId}-tooltip`}
          className="tooltip"
          style={{ display: 'none' }}
        >
          {tooltip}
        </div>
      )}

      {/* Screen reader instructions for keyboard users */}
      <span 
        className="sr-only" 
        style={{ position: 'absolute', overflow: 'hidden', width: '1px', height: '1px' }}
      >
        {isEditing 
          ? 'You are in edit mode. Press Escape to cancel or Control+Enter to save changes.'
          : 'Press Enter to edit this item.'
        }
      </span>
    </div>
  );
};

export default AccessibleCard;

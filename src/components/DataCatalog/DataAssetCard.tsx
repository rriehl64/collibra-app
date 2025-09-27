/**
 * DataAssetCard Component
 * 
 * Displays a data asset in an accessible card format with click-anywhere-to-edit functionality.
 * Fully compliant with Section 508 requirements and WCAG 2.0 guidelines.
 */

import React, { useState, useMemo } from 'react';
import { AccessibleCard } from '../common/Card';
import { DataAsset } from '../../types/DataAsset';
import { getDomainColorScheme } from '../../utils/domainColors';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface DataAssetCardProps {
  /** The data asset to display */
  asset: DataAsset;
  /** Function called when asset is updated */
  onUpdateAsset?: (updatedAsset: DataAsset) => Promise<void>;
  /** Additional CSS class names */
  className?: string;
}

export const DataAssetCard: React.FC<DataAssetCardProps> = ({ 
  asset, 
  onUpdateAsset,
  className = ''
}) => {
  // Access accessibility settings
  const { settings } = useAccessibility();

  // Local state for tracking form data during edit mode
  const [formData, setFormData] = useState<Partial<DataAsset>>({});
  // Track loading state for API operations
  const [isLoading, setIsLoading] = useState(false);
  // Track focus states for keyboard navigation
  const [cancelButtonFocused, setCancelButtonFocused] = useState(false);
  const [saveButtonFocused, setSaveButtonFocused] = useState(false);
  
  // Dynamic styles based on accessibility settings
  const accessibleStyles = useMemo(() => ({
    card: {
      fontSize: settings.fontSize === 'large' ? '1.1rem' : 
              settings.fontSize === 'x-large' ? '1.25rem' : '1rem',
      lineHeight: settings.textSpacing ? '1.8' : '1.5',
      letterSpacing: settings.textSpacing ? '0.05em' : 'normal'
    },
    heading: {
      fontSize: settings.fontSize === 'large' ? '1.3rem' : 
              settings.fontSize === 'x-large' ? '1.5rem' : '1.1rem',
      fontWeight: 600,
      marginBottom: '8px'
    },
    badge: {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: settings.fontSize === 'large' ? '14px' : 
               settings.fontSize === 'x-large' ? '16px' : '12px'
    },
    label: {
      fontWeight: 500,
      display: 'block',
      marginBottom: settings.fontSize === 'x-large' ? '8px' : '4px'
    },
    input: {
      width: '100%',
      padding: settings.fontSize === 'x-large' ? '12px' : '8px',
      border: settings.enhancedFocus ? '2px solid #003366' : '1px solid #ccc',
      borderRadius: '4px',
      fontSize: settings.fontSize === 'large' ? '1.1rem' : 
               settings.fontSize === 'x-large' ? '1.25rem' : '1rem',
      '&:focus': settings.enhancedFocus ? {
        outline: '3px dashed #003366',
        outlineOffset: '2px'
      } : {}
    }
  }), [settings]);

  // Initialize form data when edit mode is activated
  const handleEdit = () => {
    setFormData({
      name: asset.name,
      type: asset.type,
      domain: asset.domain,
      description: asset.description || '',
      tags: [...(asset.tags || [])]
    });
  };

  // Handle saving the edited data
  const handleSave = async () => {
    if (!onUpdateAsset) return;
    
    try {
      setIsLoading(true);
      await onUpdateAsset({
        ...asset,
        ...formData,
      });
    } catch (error) {
      console.error('Error updating asset:', error);
      // In a real app, we would show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle canceling edit mode
  const handleCancel = () => {
    // Reset form data and exit edit mode
    setFormData({});
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag input (comma separated values)
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagInput = e.target.value;
    const tagArray = tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      tags: tagArray
    }));
  };

  // Calculate quality score average from metrics
  const getQualityScore = () => {
    if (!asset.qualityMetrics) return 'N/A';
    
    const { completeness = 0, accuracy = 0, consistency = 0 } = asset.qualityMetrics;
    const avgScore = (completeness + accuracy + consistency) / 3;
    return avgScore.toFixed(1) + '%';
  };

  // Get appropriate badge color based on certification status
  const getCertificationBadgeColor = () => {
    switch (asset.certification) {
      case 'certified': return '#007B3E'; // Green
      case 'pending': return '#F1C21B';   // Yellow
      case 'uncertified':
      default: return '#8A8B8C';          // Gray
    }
  };

  // Get domain-specific color scheme
  const domainColorScheme = getDomainColorScheme(asset.domain);

  // View mode content
  const viewContent = (
    <div className="asset-details" style={accessibleStyles.card}>
      <div className="asset-metadata" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            className="asset-type"
            style={{ 
              ...accessibleStyles.badge,
              backgroundColor: settings.highContrast ? '#ffffff' : '#003366', 
              color: settings.highContrast ? '#000000' : 'white',
              border: settings.highContrast ? '1px solid #000000' : 'none'
            }}
          >
            {asset.type}
          </span>
          <span 
            className="certification-badge"
            style={{
              ...accessibleStyles.badge,
              backgroundColor: settings.highContrast ? 
                (asset.certification === 'certified' ? '#ffffff' : '#cccccc') : 
                getCertificationBadgeColor(),
              color: settings.highContrast ? '#000000' : 'white',
              border: settings.highContrast ? '1px solid #000000' : 'none'
            }}
            aria-label={`Certification status: ${asset.certification || 'none'}`}
          >
            {asset.certification || 'uncertified'}
          </span>
        </div>
        
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '4px', marginRight: '8px' }}>
            <span 
              className="label" 
              style={{ 
                fontWeight: 500,
                color: settings.highContrast ? '#ffffff' : 'inherit'
              }}
            >
              Domain: 
            </span>
            <span 
              className="value"
              style={{ 
                fontWeight: settings.fontSize === 'x-large' ? 600 : 'normal',
              }}
            >
              {asset.domain}
            </span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span 
              className="label"
              style={{ 
                fontWeight: 500,
                color: settings.highContrast ? '#ffffff' : 'inherit'
              }}
            >
              Owner: 
            </span>
            <span 
              className="value"
              style={{ 
                fontWeight: settings.fontSize === 'x-large' ? 600 : 'normal',
              }}
            >
              {asset.owner}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <span 
            className="label"
            style={{ 
              fontWeight: 500,
              color: settings.highContrast ? '#ffffff' : 'inherit'
            }}
          >
            Quality Score: 
          </span>
          <span 
            className="value"
            style={{ 
              fontWeight: settings.fontSize === 'x-large' ? 600 : 'normal',
            }}
          >
            {getQualityScore()}
          </span>
        </div>
      </div>

      <div 
        className="asset-description" 
        style={{ 
          marginBottom: '12px',
          backgroundColor: settings.highContrast ? '#111111' : 'transparent',
          padding: settings.fontSize === 'x-large' ? '8px' : '4px',
          borderRadius: '4px',
          border: settings.highContrast ? '1px solid #333333' : 'none'
        }}
      >
        <p style={{ 
          margin: '0',
          lineHeight: settings.textSpacing ? '1.8' : '1.5',
          letterSpacing: settings.textSpacing ? '0.05em' : 'normal'
        }}>
          {asset.description || 'No description provided.'}
        </p>
      </div>

      {asset.tags && asset.tags.length > 0 && (
        <div 
          className="asset-tags" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: settings.fontSize === 'x-large' ? '8px' : '4px',
            marginTop: settings.fontSize === 'x-large' ? '16px' : '8px'
          }}
          aria-label="Asset tags"
        >
          {asset.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                ...accessibleStyles.badge,
                backgroundColor: settings.highContrast ? '#333333' : '#E5F0F8',
                color: settings.highContrast ? '#ffffff' : '#003366',
                border: settings.highContrast ? '1px solid #555555' : 'none'
              }}
              role="listitem"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {asset.governance && (
        <div 
          className="asset-governance" 
          style={{ 
            marginTop: '12px', 
            fontSize: settings.fontSize === 'large' ? '16px' : 
                     settings.fontSize === 'x-large' ? '18px' : '14px',
            padding: settings.fontSize === 'x-large' ? '8px' : '4px',
            backgroundColor: settings.highContrast ? '#111111' : 'transparent',
            borderRadius: '4px',
            border: settings.highContrast ? '1px solid #333333' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span 
              className={`compliance-indicator ${asset.governance.complianceStatus?.toLowerCase()}`}
              style={{
                height: settings.fontSize === 'x-large' ? '14px' : '10px',
                width: settings.fontSize === 'x-large' ? '14px' : '10px',
                borderRadius: '50%',
                backgroundColor: 
                  settings.highContrast ?
                    (asset.governance.complianceStatus === 'Compliant' ? '#ffffff' : 
                     asset.governance.complianceStatus === 'Non-Compliant' ? '#ffcccc' : '#aaaaaa') :
                    (asset.governance.complianceStatus === 'Compliant' ? 'green' : 
                     asset.governance.complianceStatus === 'Non-Compliant' ? 'red' : 'gray'),
                marginRight: '8px',
                border: settings.highContrast ? '1px solid #ffffff' : 'none'
              }}
              aria-hidden="true"
            />
            <span style={{ 
              fontWeight: 500,
              color: settings.highContrast ? '#ffffff' : 'inherit'
            }}>
              Compliance: {asset.governance.complianceStatus || 'Unknown'}
            </span>
          </div>
          {asset.governance.policies && asset.governance.policies.length > 0 && (
            <div style={{ 
              marginTop: settings.fontSize === 'x-large' ? '12px' : '8px',
              lineHeight: settings.textSpacing ? '1.8' : '1.5'
            }}>
              <span style={{ 
                fontWeight: 500,
                color: settings.highContrast ? '#ffffff' : 'inherit'
              }}>
                Policies:
              </span>{' '}
              <span>
                {asset.governance.policies.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Edit mode content
  const editContent = (
    <form className="asset-edit-form" style={accessibleStyles.card}>
      <div className="form-group" style={{ marginBottom: settings.fontSize === 'x-large' ? '24px' : '16px' }}>
        <label 
          htmlFor="asset-name" 
          style={{ 
            ...accessibleStyles.label,
            color: settings.highContrast ? '#ffffff' : 'inherit'
          }}
        >
          Name:
        </label>
        <input
          id="asset-name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={handleChange}
          style={{
            ...accessibleStyles.input,
            backgroundColor: settings.highContrast ? '#222222' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : 'inherit',
          }}
          aria-required="true"
          aria-describedby={settings.verboseLabels ? 'name-desc' : undefined}
        />
        {settings.verboseLabels && (
          <div id="name-desc" style={{ fontSize: '0.8em', marginTop: '4px', color: settings.highContrast ? '#dddddd' : '#666666' }}>
            Enter the full name of the data asset
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: settings.fontSize === 'x-large' ? '24px' : '16px' }}>
        <label 
          htmlFor="asset-type" 
          style={{ 
            ...accessibleStyles.label,
            color: settings.highContrast ? '#ffffff' : 'inherit'
          }}
        >
          Type:
        </label>
        <select
          id="asset-type"
          name="type"
          value={formData.type || ''}
          onChange={handleChange}
          style={{
            ...accessibleStyles.input,
            backgroundColor: settings.highContrast ? '#222222' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : 'inherit',
          }}
          aria-required="true"
        >
          <option value="Database" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>Database</option>
          <option value="Table" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>Table</option>
          <option value="Report" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>Report</option>
          <option value="Dashboard" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>Dashboard</option>
          <option value="Document" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>Document</option>
          <option value="API" style={{ backgroundColor: settings.highContrast ? '#333333' : '#ffffff', color: settings.highContrast ? '#ffffff' : 'inherit' }}>API</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: settings.fontSize === 'x-large' ? '24px' : '16px' }}>
        <label 
          htmlFor="asset-domain" 
          style={{ 
            ...accessibleStyles.label,
            color: settings.highContrast ? '#ffffff' : 'inherit'
          }}
        >
          Domain:
        </label>
        <input
          id="asset-domain"
          name="domain"
          type="text"
          value={formData.domain || ''}
          onChange={handleChange}
          style={{
            ...accessibleStyles.input,
            backgroundColor: settings.highContrast ? '#222222' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : 'inherit',
          }}
          aria-required="true"
          aria-describedby={settings.verboseLabels ? 'domain-desc' : undefined}
        />
        {settings.verboseLabels && (
          <div id="domain-desc" style={{ fontSize: '0.8em', marginTop: '4px', color: settings.highContrast ? '#dddddd' : '#666666' }}>
            Specify the business domain this asset belongs to
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: settings.fontSize === 'x-large' ? '24px' : '16px' }}>
        <label 
          htmlFor="asset-description" 
          style={{ 
            ...accessibleStyles.label,
            color: settings.highContrast ? '#ffffff' : 'inherit'
          }}
        >
          Description:
        </label>
        <textarea
          id="asset-description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          style={{
            ...accessibleStyles.input,
            backgroundColor: settings.highContrast ? '#222222' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : 'inherit',
            minHeight: settings.fontSize === 'x-large' ? '150px' : '100px',
            resize: 'vertical'
          }}
          aria-required="false"
          aria-describedby={settings.verboseLabels ? 'description-desc' : undefined}
        />
        {settings.verboseLabels && (
          <div id="description-desc" style={{ fontSize: '0.8em', marginTop: '4px', color: settings.highContrast ? '#dddddd' : '#666666' }}>
            Provide a detailed description of this data asset
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: settings.fontSize === 'x-large' ? '24px' : '16px' }}>
        <label 
          htmlFor="asset-tags" 
          style={{ 
            ...accessibleStyles.label,
            color: settings.highContrast ? '#ffffff' : 'inherit'
          }}
        >
          Tags (comma-separated):
        </label>
        <input
          id="asset-tags"
          name="tags"
          type="text"
          value={formData.tags?.join(', ') || ''}
          onChange={handleTagChange}
          style={{
            ...accessibleStyles.input,
            backgroundColor: settings.highContrast ? '#222222' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : 'inherit',
          }}
          aria-describedby="tags-hint"
        />
        <div 
          id="tags-hint" 
          style={{ 
            fontSize: '0.8em', 
            marginTop: '4px', 
            color: settings.highContrast ? '#dddddd' : '#666666',
            lineHeight: settings.textSpacing ? '1.8' : '1.5'
          }}
        >
          Enter tags separated by commas (e.g., "sales, marketing, quarterly")
        </div>
      </div>
      
      <div className="form-actions" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: settings.fontSize === 'x-large' ? '16px' : '8px',
        marginTop: settings.fontSize === 'x-large' ? '24px' : '16px' 
      }}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          onFocus={() => setCancelButtonFocused(true)}
          onBlur={() => setCancelButtonFocused(false)}
          style={{
            padding: settings.fontSize === 'x-large' ? '12px 24px' : '8px 16px',
            backgroundColor: settings.highContrast ? '#444444' : '#f0f0f0',
            color: settings.highContrast ? '#ffffff' : 'inherit',
            border: cancelButtonFocused && settings.enhancedFocus 
              ? `2px solid ${settings.highContrast ? '#ffffff' : '#003366'}` 
              : settings.enhancedFocus ? '2px solid transparent' : '1px solid #ccc',
            borderRadius: '4px',
            cursor: isLoading ? 'wait' : 'pointer',
            fontSize: settings.fontSize === 'large' ? '1.1rem' : 
                      settings.fontSize === 'x-large' ? '1.25rem' : '1rem',
            outline: 'none',
            position: 'relative',
            boxShadow: cancelButtonFocused && settings.enhancedFocus 
              ? `0 0 0 2px ${settings.highContrast ? '#ffffff' : '#003366'}` 
              : 'none'
          }}
          aria-label={settings.verboseLabels ? 'Cancel editing and return to view mode' : 'Cancel'}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          onFocus={() => setSaveButtonFocused(true)}
          onBlur={() => setSaveButtonFocused(false)}
          style={{
            padding: settings.fontSize === 'x-large' ? '12px 24px' : '8px 16px',
            backgroundColor: settings.highContrast ? '#ffffff' : '#003366',
            color: settings.highContrast ? '#000000' : 'white',
            border: saveButtonFocused && settings.enhancedFocus 
              ? `2px solid ${settings.highContrast ? '#000000' : '#ffffff'}` 
              : settings.enhancedFocus ? '2px solid transparent' : 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'wait' : 'pointer',
            fontSize: settings.fontSize === 'large' ? '1.1rem' : 
                      settings.fontSize === 'x-large' ? '1.25rem' : '1rem',
            outline: 'none',
            fontWeight: 600,
            boxShadow: saveButtonFocused && settings.enhancedFocus 
              ? `0 0 0 2px ${settings.highContrast ? '#000000' : '#ffffff'}` 
              : 'none'
          }}
          aria-busy={isLoading}
          aria-label={settings.verboseLabels ? 
            (isLoading ? 'Currently saving changes' : 'Save changes to data asset') : 
            (isLoading ? 'Saving...' : 'Save')
          }
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );

  // Define enhanced card props based on accessibility settings
  const enhancedCardStyle = useMemo(() => ({
    backgroundColor: settings.highContrast ? '#111111' : domainColorScheme.background,
    borderLeft: `4px solid ${settings.highContrast ? '#ffffff' : domainColorScheme.border}`,
    color: settings.highContrast ? '#ffffff' : domainColorScheme.text,
    fontSize: settings.fontSize === 'large' ? '1.1rem' : 
             settings.fontSize === 'x-large' ? '1.25rem' : '1rem',
    lineHeight: settings.textSpacing ? '1.8' : '1.5',
    letterSpacing: settings.textSpacing ? '0.05em' : 'normal',
    transition: settings.reducedMotion ? 'none' : 'all 0.2s ease-in-out'
  }), [settings, domainColorScheme]);

  // AccessibleCard expects 'children' for content, not 'viewComponent'
  return (
    <AccessibleCard
      title={asset.name}
      subtitle={`Last updated: ${new Date(asset.updatedAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
      editComponent={editContent}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      className={className}
      testId={`asset-card-${asset._id}`}
      loading={isLoading}
      customStyle={{
        ...enhancedCardStyle,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      tooltip={settings.verboseLabels ? `Data asset: ${asset.name}. Press Enter or click to edit.` : undefined}
    >
      {viewContent}
    </AccessibleCard>
  );
};

// We'll use TypeScript interfaces for type safety
// PropTypes are omitted since they don't fully align with our TypeScript types
// and would cause type errors when trying to make them match exactly

export default DataAssetCard;

/**
 * DataAssetCard Component
 * 
 * Displays a data asset in an accessible card format with click-anywhere-to-edit functionality.
 * Fully compliant with Section 508 requirements and WCAG 2.0 guidelines.
 */

import React, { useState } from 'react';
import { AccessibleCard } from '../common/Card';
import { DataAsset } from '../../types/DataAsset';
import { getDomainColorScheme } from '../../utils/domainColors';

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
  // Local state for tracking form data during edit mode
  const [formData, setFormData] = useState<Partial<DataAsset>>({});
  // Track loading state for API operations
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="asset-details">
      <div className="asset-metadata" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            className="asset-type"
            style={{ 
              padding: '2px 8px',
              backgroundColor: '#003366', 
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {asset.type}
          </span>
          <span 
            className="certification-badge"
            style={{
              padding: '2px 8px',
              backgroundColor: getCertificationBadgeColor(),
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            aria-label={`Certification status: ${asset.certification || 'none'}`}
          >
            {asset.certification || 'uncertified'}
          </span>
        </div>
        
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span className="label">Domain: </span>
            <span className="value">{asset.domain}</span>
          </div>
          <div>
            <span className="label">Owner: </span>
            <span className="value">{asset.owner}</span>
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <span className="label">Quality Score: </span>
          <span className="value">{getQualityScore()}</span>
        </div>
      </div>

      <div className="asset-description" style={{ marginBottom: '12px' }}>
        <p style={{ margin: '0' }}>{asset.description || 'No description provided.'}</p>
      </div>

      {asset.tags && asset.tags.length > 0 && (
        <div className="asset-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {asset.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                padding: '2px 8px',
                backgroundColor: '#E5F0F8',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {asset.governance && (
        <div className="asset-governance" style={{ marginTop: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span 
              className={`compliance-indicator ${asset.governance.complianceStatus?.toLowerCase()}`}
              style={{
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                backgroundColor: 
                  asset.governance.complianceStatus === 'Compliant' ? 'green' : 
                  asset.governance.complianceStatus === 'Non-Compliant' ? 'red' : 'gray',
                marginRight: '6px'
              }}
              aria-hidden="true"
            />
            <span>Compliance: {asset.governance.complianceStatus || 'Unknown'}</span>
          </div>
          {asset.governance.policies && asset.governance.policies.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <span>Policies: {asset.governance.policies.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Edit mode content
  const editContent = (
    <form className="asset-edit-form">
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label htmlFor="asset-name" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Name:
        </label>
        <input
          id="asset-name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          aria-required="true"
        />
      </div>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label htmlFor="asset-type" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Type:
        </label>
        <select
          id="asset-type"
          name="type"
          value={formData.type || ''}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          aria-required="true"
        >
          <option value="Database">Database</option>
          <option value="Table">Table</option>
          <option value="Report">Report</option>
          <option value="Dashboard">Dashboard</option>
          <option value="Document">Document</option>
          <option value="API">API</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label htmlFor="asset-domain" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Domain:
        </label>
        <input
          id="asset-domain"
          name="domain"
          type="text"
          value={formData.domain || ''}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          aria-required="true"
        />
      </div>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label htmlFor="asset-description" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Description:
        </label>
        <textarea
          id="asset-description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '100px'
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="asset-tags" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Tags (comma-separated):
        </label>
        <input
          id="asset-tags"
          name="tags"
          type="text"
          value={formData.tags?.join(', ') || ''}
          onChange={handleTagChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          aria-describedby="tags-hint"
        />
        <small id="tags-hint" style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          Enter tags separated by commas (e.g., "sales, marketing, quarterly")
        </small>
      </div>
    </form>
  );

  return (
    <AccessibleCard
      title={asset.name}
      subtitle={`Last updated: ${new Date(asset.updatedAt || '').toLocaleDateString()}`}
      editComponent={editContent}
      onEdit={handleEdit}
      onSave={handleSave}
      className={className}
      testId={`asset-card-${asset._id}`}
      loading={isLoading}
      customStyle={{
        backgroundColor: domainColorScheme.background,
        borderLeft: `4px solid ${domainColorScheme.border}`,
        color: domainColorScheme.text,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {viewContent}
    </AccessibleCard>
  );
};

// We'll use TypeScript interfaces for type safety
// PropTypes are omitted since they don't fully align with our TypeScript types
// and would cause type errors when trying to make them match exactly

export default DataAssetCard;

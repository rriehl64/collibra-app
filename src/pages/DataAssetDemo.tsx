/**
 * Data Asset Demo Page
 * 
 * Demonstrates the accessible card interface for data assets with
 * full Section 508 compliance and keyboard navigation support.
 */

import React, { useState } from 'react';
import { DataAssetCard } from '../components/DataCatalog/DataAssetCard';
import { DataAsset } from '../types/DataAsset';

const DataAssetDemo: React.FC = () => {
  // Sample data assets
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([
    {
      _id: '1',
      name: 'Customer Data Warehouse',
      type: 'Database',
      domain: 'Marketing',
      owner: 'Jane Smith',
      description: 'Central repository for all customer data including demographics, purchase history, and interaction data.',
      status: 'Production',
      tags: ['customers', 'data warehouse', 'critical'],
      certification: 'certified',
      updatedAt: '2025-07-25T14:30:00Z',
      createdAt: '2025-01-15T09:00:00Z',
      governance: {
        complianceStatus: 'Compliant',
        policies: [
          { name: 'PII Handling', description: 'Policy for personally identifiable information', status: 'Active' }
        ]
      },
      qualityMetrics: {
        completeness: 92,
        accuracy: 88,
        consistency: 95
      }
    },
    {
      _id: '2',
      name: 'Sales Analytics Dashboard',
      type: 'Dashboard',
      domain: 'Sales',
      owner: 'Robert Johnson',
      description: 'Executive dashboard showing sales performance metrics, trends, and forecasts.',
      status: 'Development',
      tags: ['sales', 'analytics', 'executive'],
      certification: 'pending',
      updatedAt: '2025-07-28T10:15:00Z',
      createdAt: '2025-06-20T13:45:00Z',
      governance: {
        complianceStatus: 'Non-Compliant',
        policies: [
          { name: 'Data Accuracy', description: 'Standards for data accuracy in reports', status: 'Violation' }
        ]
      },
      qualityMetrics: {
        completeness: 75,
        accuracy: 68,
        consistency: 72
      }
    },
    {
      _id: '3',
      name: 'Product Catalog API',
      type: 'API',
      domain: 'Product',
      owner: 'Alex Chen',
      description: 'RESTful API providing access to the current product catalog with pricing and inventory information.',
      status: 'Production',
      tags: ['api', 'products', 'inventory'],
      certification: 'certified',
      updatedAt: '2025-07-15T16:20:00Z',
      createdAt: '2025-03-10T11:30:00Z',
      governance: {
        complianceStatus: 'Compliant',
        policies: [
          { name: 'API Security', description: 'Standards for API authentication and authorization', status: 'Active' }
        ]
      },
      qualityMetrics: {
        completeness: 98,
        accuracy: 95,
        consistency: 97
      }
    }
  ]);

  // Handle asset updates
  const handleUpdateAsset = async (updatedAsset: DataAsset): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        setDataAssets(prevAssets => 
          prevAssets.map(asset => 
            asset._id === updatedAsset._id ? updatedAsset : asset
          )
        );
        resolve();
      }, 800);
    });
  };

  return (
    <div className="data-asset-demo" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#003366' }}>Data Asset Management</h1>
        <p>
          Click anywhere on a card to edit the asset details. Press Tab to navigate between cards and Enter to activate edit mode.
        </p>
      </header>
      
      <div className="accessibility-info" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '4px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px' }}>Accessibility Features</h2>
        <ul>
          <li><strong>Keyboard Navigation:</strong> Tab to focus cards, Enter to edit, Escape to cancel, Ctrl+Enter to save</li>
          <li><strong>Screen Reader Support:</strong> ARIA attributes and instructions for assistive technology</li>
          <li><strong>Focus Management:</strong> Visual indicators and focus trapping in edit mode</li>
          <li><strong>Large Click Targets:</strong> Full card is clickable for users with motor control limitations</li>
        </ul>
      </div>
      
      <div className="cards-container">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Data Assets ({dataAssets.length})</h2>
        {dataAssets.map(asset => (
          <DataAssetCard 
            key={asset._id} 
            asset={asset}
            onUpdateAsset={handleUpdateAsset}
          />
        ))}
      </div>
    </div>
  );
};

export default DataAssetDemo;

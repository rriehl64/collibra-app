import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataAsset } from '../types/DataAsset';
import { getDomainColorScheme } from '../utils/domainColors';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider,
  FormHelperText,
  InputAdornment,
  Checkbox,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  AccountTree as LineageIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

import { dataAssetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdvancedSearch from '../components/DataCatalog/AdvancedSearch';
import DataLineageVisualization from '../components/DataLineage/DataLineageVisualization';

// Type definitions
type CertificationType = 'certified' | 'pending' | 'none';

interface Filters {
  types: string[];
  domains: string[];
  statuses: string[];
  certifications: CertificationType[];
  owners: string[];
  complianceStatuses: string[];
  tags: string[];
}

// Error Boundary Component for graceful error handling
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert 
          severity="error"
          sx={{ my: 2 }}
          aria-live="assertive"
        >
          <Typography component="h3" variant="h6">
            Something went wrong displaying the data
          </Typography>
          <Typography variant="body2">
            Please try refreshing the page or contact support if the issue persists.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 1 }}
            onClick={() => this.setState({ hasError: false })}
            aria-label="Try to recover from error"
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Main DataCatalog component
const DataCatalog: React.FC = () => {
  // Core state
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search & filter state
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    types: [],
    domains: [],
    statuses: [],
    certifications: [],
    owners: [],
    complianceStatuses: [],
    tags: []
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // Increased to show 50 records per page
  const [totalAssets, setTotalAssets] = useState(0);
  
  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // State for controlling the edit 
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DataAsset | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<DataAsset | null>(null);
  
  // State for lineage dialog
  const [lineageDialogOpen, setLineageDialogOpen] = useState(false);
  const [lineageAsset, setLineageAsset] = useState<DataAsset | null>(null);
  const [editedAsset, setEditedAsset] = useState<DataAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Comparison functionality
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  
  // Data lineage functionality
  const handleViewLineage = (asset: DataAsset) => {
    setLineageAsset(asset);
    setLineageDialogOpen(true);
  };

  const handleCloseLineageDialog = () => {
    setLineageDialogOpen(false);
    setLineageAsset(null);
  };

  // Generate sample lineage data for demonstration
  const generateLineageData = (asset: DataAsset) => {
    const nodes = [
      {
        id: asset._id || asset.name,
        name: asset.name,
        type: asset.type,
        level: 0,
        isCenter: true
      },
      {
        id: `${asset.name}_source_1`,
        name: `${asset.domain} Raw Data`,
        type: 'Database',
        level: -1,
        isCenter: false
      },
      {
        id: `${asset.name}_source_2`,
        name: `${asset.domain} API`,
        type: 'API',
        level: -1,
        isCenter: false
      },
      {
        id: `${asset.name}_target_1`,
        name: `${asset.name} Analytics`,
        type: 'Dashboard',
        level: 1,
        isCenter: false
      },
      {
        id: `${asset.name}_target_2`,
        name: `${asset.name} Reports`,
        type: 'Report',
        level: 1,
        isCenter: false
      }
    ];

    const links = [
      {
        source: `${asset.name}_source_1`,
        target: asset._id || asset.name,
        type: 'data_flow',
        strength: 0.8
      },
      {
        source: `${asset.name}_source_2`,
        target: asset._id || asset.name,
        type: 'data_flow',
        strength: 0.6
      },
      {
        source: asset._id || asset.name,
        target: `${asset.name}_target_1`,
        type: 'data_flow',
        strength: 0.9
      },
      {
        source: asset._id || asset.name,
        target: `${asset.name}_target_2`,
        type: 'data_flow',
        strength: 0.7
      }
    ];

    return { nodes, links };
  };
  
  // Bulk operations functionality
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelectedAssets, setBulkSelectedAssets] = useState<string[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  
  // Export functionality
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Help section collapse state (collapsed by default)
  const [helpSectionExpanded, setHelpSectionExpanded] = useState(false);

  // Handle asset selection for comparison
  const handleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else if (prev.length < 3) { // Limit to 3 assets for comparison
        return [...prev, assetId];
      }
      return prev;
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedAssets([]);
  };

  // Get selected asset objects
  const getSelectedAssetObjects = () => {
    return dataAssets.filter(asset => asset._id && selectedAssets.includes(asset._id));
  };

  // Bulk operations handlers
  const handleBulkSelection = (assetId: string) => {
    setBulkSelectedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const handleSelectAll = () => {
    if (bulkSelectedAssets.length === dataAssets.length) {
      setBulkSelectedAssets([]);
    } else {
      setBulkSelectedAssets(dataAssets.map(asset => asset._id).filter(Boolean) as string[]);
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
      setSaveError('Permission denied. Only admins and data stewards can perform bulk operations.');
      return;
    }

    try {
      setIsSaving(true);
      
      for (const assetId of bulkSelectedAssets) {
        const asset = dataAssets.find(a => a._id === assetId);
        if (!asset) continue;

        let updatedAsset = { ...asset };
        
        switch (action) {
          case 'status':
            updatedAsset.status = value || 'Active';
            break;
          case 'certification':
            updatedAsset.certification = value as 'certified' | 'pending' | 'uncertified' || 'pending';
            break;
          case 'delete':
            // For delete, we'd call a delete API
            continue;
          default:
            continue;
        }

        await dataAssetService.updateDataAsset(assetId, updatedAsset);
      }

      // Refresh data
      const response = await dataAssetService.searchDataAssets(debouncedSearchText, { page, limit });
      setDataAssets(response.assets || []);
      
      setBulkSelectedAssets([]);
      setBulkActionDialogOpen(false);
      setSaveSuccess(true);
      
    } catch (error) {
      console.error('Bulk operation failed:', error);
      setSaveError('Bulk operation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export functionality handlers
  const handleExportCSV = () => {
    const csvData = dataAssets.map(asset => ({
      Name: asset.name,
      Type: asset.type,
      Domain: asset.domain,
      Status: asset.status,
      Owner: asset.owner,
      Certification: asset.certification,
      Description: asset.description || '',
      Tags: asset.tags?.join(', ') || '',
      'Last Modified': asset.lastModified ? new Date(asset.lastModified).toLocaleDateString() : '',
      'Compliance Status': asset.governance?.complianceStatus || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data-catalog-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportDialogOpen(false);
    setSaveSuccess(true);
  };

  const handleExportPDF = () => {
    // Create a printable HTML version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Unify Data Catalog Export</title>
        <style>
          body { font-family: 'Source Sans Pro', Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #003366; padding-bottom: 20px; }
          .header h1 { color: #003366; margin: 0; font-size: 28px; }
          .header p { color: #666; margin: 5px 0 0 0; }
          .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .asset { border: 1px solid #e0e0e0; margin-bottom: 15px; border-radius: 8px; overflow: hidden; }
          .asset-header { background: #003366; color: white; padding: 12px 15px; font-weight: 600; }
          .asset-body { padding: 15px; }
          .asset-row { display: flex; margin-bottom: 8px; }
          .asset-label { font-weight: 600; width: 150px; color: #003366; }
          .asset-value { flex: 1; }
          .status-active { color: #007B3E; font-weight: 600; }
          .status-deprecated { color: #B31B1B; font-weight: 600; }
          .cert-certified { color: #007B3E; font-weight: 600; }
          .cert-pending { color: #F1C21B; font-weight: 600; }
          @media print {
            body { margin: 0; }
            .asset { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>E-Unify Data Catalog Export</h1>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="summary">
          <strong>Export Summary:</strong> ${dataAssets.length} data assets
          ${searchText ? ` | Search: "${searchText}"` : ''}
          ${Object.values(filters).some(f => f.length > 0) ? ' | Filters applied' : ''}
        </div>

        ${dataAssets.map(asset => `
          <div class="asset">
            <div class="asset-header">${asset.name}</div>
            <div class="asset-body">
              <div class="asset-row">
                <div class="asset-label">Type:</div>
                <div class="asset-value">${asset.type}</div>
              </div>
              <div class="asset-row">
                <div class="asset-label">Domain:</div>
                <div class="asset-value">${asset.domain}</div>
              </div>
              <div class="asset-row">
                <div class="asset-label">Status:</div>
                <div class="asset-value">
                  <span class="${asset.status === 'Active' ? 'status-active' : asset.status === 'Deprecated' ? 'status-deprecated' : ''}">${asset.status}</span>
                </div>
              </div>
              <div class="asset-row">
                <div class="asset-label">Owner:</div>
                <div class="asset-value">${asset.owner}</div>
              </div>
              <div class="asset-row">
                <div class="asset-label">Certification:</div>
                <div class="asset-value">
                  <span class="${asset.certification === 'certified' ? 'cert-certified' : asset.certification === 'pending' ? 'cert-pending' : ''}">${asset.certification}</span>
                </div>
              </div>
              ${asset.description ? `
                <div class="asset-row">
                  <div class="asset-label">Description:</div>
                  <div class="asset-value">${asset.description}</div>
                </div>
              ` : ''}
              ${asset.tags && asset.tags.length > 0 ? `
                <div class="asset-row">
                  <div class="asset-label">Tags:</div>
                  <div class="asset-value">${asset.tags.join(', ')}</div>
                </div>
              ` : ''}
              ${asset.lastModified ? `
                <div class="asset-row">
                  <div class="asset-label">Last Modified:</div>
                  <div class="asset-value">${new Date(asset.lastModified).toLocaleDateString()}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    setExportDialogOpen(false);
    setSaveSuccess(true);
  };


  // Handle debounced search

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch data based on search and filters
  useEffect(() => {
    const fetchDataAssets = async (): Promise<void> => {
      // Always fetch data, even on initial load - removed conditional that prevented initial fetch

      setLoading(true);
      setError(null);

      try {
        // Build filter parameters
        const filterParams: Record<string, any> = {
          page,
          limit
        };

        // Add filter parameters
        if (filters.types.length > 0) {
          filterParams.type = filters.types;
        }
        if (filters.domains.length > 0) {
          filterParams.domains = filters.domains;
        }
        if (filters.statuses.length > 0) {
          filterParams.statuses = filters.statuses;
        }
        if (filters.certifications.length > 0) {
          filterParams.certifications = filters.certifications;
        }
        if (filters.owners.length > 0) {
          filterParams.owners = filters.owners;
        }
        if (filters.complianceStatuses.length > 0) {
          filterParams.complianceStatuses = filters.complianceStatuses;
        }
        if (filters.tags.length > 0) {
          filterParams.tags = filters.tags;
        }

        // Make API call with filters
        const response = await dataAssetService.searchDataAssets(debouncedSearchText, filterParams);

        // Update state with results
        setDataAssets(response.assets || []);
        setTotalAssets(response.total || 0);
        
        // Add to search history if it was a search
        if (debouncedSearchText && !searchHistory.includes(debouncedSearchText)) {
          setSearchHistory(prev => [...prev.slice(-4), debouncedSearchText]);
          
          // Persist search history to localStorage
          localStorage.setItem('searchHistory', JSON.stringify([...searchHistory, debouncedSearchText].slice(-5)));
        }
      } catch (err) {
        console.error('Failed to fetch data assets:', err);
        setError('Failed to load data. Please try again later.');
        setDataAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAssets();
  }, [debouncedSearchText, filters, page, limit, searchHistory]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    // Load search history
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch (e) {
        console.error('Error parsing search history from localStorage:', e);
      }
    }
    
    // Remove any existing editedAssets from localStorage to prevent using stale local data
    if (localStorage.getItem('editedAssets')) {
      console.log('Removing locally edited assets to ensure backend data consistency');
      localStorage.removeItem('editedAssets');
    }
  }, []);

  // Handle search clear
  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);
  
  // Handle filter dialog
  const handleOpenFilters = useCallback(() => {
    setFilterDialogOpen(true);
  }, []);
  
  // Handle closing filter dialog
  const handleCloseFilters = useCallback(() => {
    setFilterDialogOpen(false);
  }, []);

  // Handle opening edit dialog
  const handleEditAsset = useCallback((asset: DataAsset) => {
    setCurrentAsset(asset);
    setEditedAsset({...asset});
    setEditDialogOpen(true);
    setSaveError(null);
  }, []);

  // Handle closing edit dialog
  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setCurrentAsset(null);
    setEditedAsset(null);
    setSaveError(null);
  }, []);

  // Handle form field changes with proper nested object preservation
  const handleFormChange = useCallback((field: keyof DataAsset, value: any) => {
    if (!editedAsset) return;
    
    setEditedAsset(prev => {
      if (!prev) return null;
      
      // Special handling for nested fields to ensure we don't lose nested structure
      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [keyof DataAsset, string];
        const parentObj = {...(prev[parent] as object || {})};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      }
      
      // Regular field update
      return {
        ...prev,
        [field]: value
      };
    });
  }, [editedAsset]);
  
  // Access auth context for current user
  const { user, loading: authLoading, error: authError } = useAuth();

  // Asset types for filtering - matches database values
  const assetTypes = ['API', 'Business Term', 'Dashboard', 'Data Lake', 'Data Pipeline', 'Data Warehouse', 'Database', 'Dataset', 'Document', 'ETL Process', 'File', 'Index', 'Report', 'Schema', 'Table', 'View'];

  // Helper function to get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'API': return '🔌';
      case 'Business Term': return '📝';
      case 'Dashboard': return '📈';
      case 'Data Lake': return '🏞️';
      case 'Data Pipeline': return '🔄';
      case 'Data Warehouse': return '🏬';
      case 'Database': return '🗄️';
      case 'Dataset': return '📦';
      case 'Document': return '📄';
      case 'ETL Process': return '⚙️';
      case 'File': return '📁';
      case 'Index': return '📇';
      case 'Report': return '📊';
      case 'Schema': return '🏗️';
      case 'Table': return '📋';
      case 'View': return '👁️';
      default: return '📋';
    }
  };

  // Handle saving changes
  const handleSaveAsset = useCallback(async () => {
    if (!editedAsset || !editedAsset._id) {
      setSaveError('Missing asset data or ID');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    // Log the update attempt for debugging
    console.log('Attempting to update asset:', editedAsset);
    console.log('Authentication state:', { user: user?.name, role: user?.role });
    
    // Check if user has permission to update
    const hasPermission = user !== null && 
      (user?.role === 'admin' || user?.role === 'data-steward');
    
    try {
      // Make API request to update the asset if user has permission
      if (hasPermission) {
        console.log('User has permission, attempting backend update');
        
        // Prepare the asset for update - ensure we maintain proper structure
        // Only send the fields that were actually edited to avoid overwriting
        const assetToUpdate: Partial<DataAsset> = {};
        
        // Type-safe field updating with correct field types
        if (editedAsset.name) assetToUpdate.name = editedAsset.name;
        if (editedAsset.type) assetToUpdate.type = editedAsset.type;
        if (editedAsset.domain) assetToUpdate.domain = editedAsset.domain;
        if (editedAsset.owner) assetToUpdate.owner = editedAsset.owner;
        if (editedAsset.description) assetToUpdate.description = editedAsset.description;
        if (editedAsset.status) assetToUpdate.status = editedAsset.status;
        if (editedAsset.certification) assetToUpdate.certification = editedAsset.certification;
        if (editedAsset.tags) assetToUpdate.tags = editedAsset.tags;
        
        // Preserve nested objects with proper typing
        if (editedAsset.governance) assetToUpdate.governance = editedAsset.governance;
        if (editedAsset.qualityMetrics) assetToUpdate.qualityMetrics = editedAsset.qualityMetrics;
        if (editedAsset.relatedAssets) assetToUpdate.relatedAssets = editedAsset.relatedAssets;
        if (editedAsset.stewards) assetToUpdate.stewards = editedAsset.stewards;
        
        console.log('Sending prepared update data:', assetToUpdate);
        
        const updatedAsset = await dataAssetService.updateDataAsset(
          editedAsset._id as string,
          assetToUpdate
        );
        
        console.log('Backend update successful:', updatedAsset);
        
        // Update the asset in the local state
        setDataAssets(prevAssets => 
          prevAssets.map(asset => 
            asset._id === updatedAsset._id ? updatedAsset : asset
          )
        );
        
        setSaveSuccess(true);
        setEditDialogOpen(false);
        setCurrentAsset(null);
        setEditedAsset(null);
        
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // User doesn't have permission, show auth error but still save locally
        throw new Error('You need to be logged in as an admin or data steward to save changes to the backend');
      }
      
      // No longer storing in localStorage to ensure backend is the only source of truth
      console.log('Backend update successful - not using localStorage fallback');
    } catch (err) {
      console.error('Failed to update asset:', err);
      
      // No longer using optimistic updates to ensure UI matches backend state
      console.log('Backend update failed - showing error to user');
      
      // Refresh data from server to ensure UI reflects actual backend state
      const refreshData = async () => {
        try {
          const response = await dataAssetService.searchDataAssets(debouncedSearchText);
          setDataAssets(response.assets || []);
        } catch (refreshErr) {
          console.error('Error refreshing data after failed update:', refreshErr);
        }
      };
      
      refreshData();
      
      setSaveSuccess(true); // Still show success to user
      
      // Show accessible error messages with clear instructions
      if (!user) {
        setSaveError('Authentication required. Please log in as admin or data steward to update data assets.');
      } else if (user && (user.role !== 'admin' && user.role !== 'data-steward')) {
        setSaveError('Permission denied. Your account does not have the required role to update data assets. Contact an administrator for assistance.');
      } else {
        setSaveError('Update failed. The server could not be reached or returned an error. Please try again or contact support if the issue persists.');
      }
      
      setEditDialogOpen(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSaveSuccess(false), 5000);
    } finally {
      setIsSaving(false);
    }
  }, [editedAsset, user]);

  // Handle tag addition and removal
  const handleTagChange = useCallback((tags: string[]) => {
    if (!editedAsset) return;
    
    setEditedAsset(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tags
      };
    });
  }, [editedAsset]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalAssets / limit);

  // Filter data assets for display
  const displayedAssets = useMemo(() => {
    return dataAssets;
  }, [dataAssets]);

  return (
    <Container sx={{ py: 4 }} className="data-catalog-page" role="main" aria-labelledby="page-title">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1} id="page-title">
        E-Unify Data Catalog
      </Typography>
      <Typography variant="body1" paragraph>
        Browse, search, and manage data assets across the enterprise.
      </Typography>

      {/* How It Works Section - Collapsible */}
      <Box sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0, 51, 102, 0.04)' },
            borderRadius: 1,
            p: 1,
            ml: -1
          }}
          onClick={() => setHelpSectionExpanded(!helpSectionExpanded)}
          role="button"
          aria-expanded={helpSectionExpanded}
          aria-controls="help-section-content"
        >
          <Typography variant="h5" component="h2" sx={{ color: '#003366', fontWeight: 600, flexGrow: 1 }}>
            How It Works
          </Typography>
          <IconButton 
            size="small"
            sx={{ 
              transform: helpSectionExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        
        <Collapse in={helpSectionExpanded} timeout="auto" unmountOnExit>
          <Box id="help-section-content" sx={{ mt: 2 }}>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: '#003366', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                mx: 'auto', 
                mb: 2 
              }}>
                🔍
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Search & Discover
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the search bar to find data assets by name, type, domain, or description. 
                Use quotes for exact matches: "Finance Table 11"
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: '#003366', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                mx: 'auto', 
                mb: 2 
              }}>
                🎯
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Filter & Refine
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the "Filters" button to narrow results by asset type, domain, status, 
                certification level, and more criteria.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: '#003366', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                mx: 'auto', 
                mb: 2 
              }}>
                ✏️
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                View & Edit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on any data asset card to view details and edit metadata. 
                Admin and data steward roles can update asset information.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
            💡 Pro Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            • Use multiple search terms for precise results: "Customer Table Production"<br/>
            • Apply the "Trusted Data" filter preset for certified, production-ready assets<br/>
            • Browse by domain to explore assets within specific business areas<br/>
            • Check recent searches below the search bar for quick access
          </Typography>
        </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Advanced Search Section */}
      <AdvancedSearch
        onSearch={(query, advancedFilters) => {
          setSearchText(query);
          setFilters(prev => ({ ...prev, ...advancedFilters }));
        }}
        searchHistory={searchHistory}
        availableFilters={{
          types: assetTypes,
          domains: Array.from(new Set(dataAssets.map(asset => asset.domain))).filter(Boolean),
          owners: Array.from(new Set(dataAssets.map(asset => asset.owner))).filter(Boolean),
          tags: Array.from(new Set(dataAssets.flatMap(asset => asset.tags || []))).filter(Boolean),
          statuses: ['Active', 'Deprecated', 'Draft', 'Archived'],
          certifications: ['certified', 'pending', 'uncertified']
        }}
        totalResults={totalAssets}
        isLoading={loading}
      />
      
      {/* Legacy Search Section - Hidden but kept for compatibility */}
      <Box sx={{ mb: 4, display: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm>                
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search assets..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText ? (
                  <InputAdornment position="end">
                    <IconButton 
                      aria-label="Clear search" 
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              aria-label="Search data assets"
            />
          </Grid>
          
          <Grid item>
            <Button 
              startIcon={<FilterIcon />}
              variant="outlined"
              color="primary"
              aria-label="Filter data assets"
              size="small"
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </Button>
          </Grid>

          {/* Bulk Operations Controls - Admin Only */}
          {user && (user.role === 'admin' || user.role === 'data-steward') && (
            <Grid item>
              <Button
                variant={bulkMode ? "contained" : "outlined"}
                color="primary"
                size="small"
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setBulkSelectedAssets([]);
                }}
                aria-label="Toggle bulk operations mode"
              >
                {bulkMode ? 'Exit Bulk' : 'Bulk Operations'}
              </Button>
            </Grid>
          )}

          {/* Bulk Action Controls */}
          {bulkMode && bulkSelectedAssets.length > 0 && (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => setBulkActionDialogOpen(true)}
                  aria-label={`Bulk actions for ${bulkSelectedAssets.length} selected assets`}
                >
                  Actions ({bulkSelectedAssets.length})
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setBulkSelectedAssets([])}
                  aria-label="Clear bulk selections"
                >
                  Clear
                </Button>
              </Grid>
            </>
          )}

          {/* Export Controls */}
          <Grid item>
            <Button
              startIcon={<SaveIcon />}
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setExportDialogOpen(true)}
              aria-label="Export data catalog"
            >
              Export
            </Button>
          </Grid>

          {/* Comparison Controls */}
          {!bulkMode && selectedAssets.length > 0 && (
            <>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disabled={selectedAssets.length < 2}
                  onClick={() => setComparisonDialogOpen(true)}
                  aria-label={`Compare ${selectedAssets.length} selected assets`}
                >
                  Compare ({selectedAssets.length})
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearSelections}
                  aria-label="Clear asset selections"
                >
                  Clear
                </Button>
              </Grid>
            </>
          )}
      </Grid>
      
      {/* Search history */}
      {searchHistory.length > 0 && !searchText && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Recent searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {searchHistory.map((term, index) => (
              <Chip
                key={`${term}-${index}`}
                label={term}
                size="small"
                onClick={() => setSearchText(term)}
                onDelete={() => {
                  const newHistory = searchHistory.filter(h => h !== term);
                  setSearchHistory(newHistory);
                  localStorage.setItem('dataCatalogSearchHistory', JSON.stringify(newHistory));
                }}
                sx={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.04)' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
    
    {/* Loading state */}
    {loading && (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress aria-label="Loading data assets" />
      </Box>
    )}
    
    {/* Error state */}
    {error && (
      <Box sx={{ mt: 2, mb: 2 }} aria-live="assertive">
        <Alert severity="error">{error}</Alert>
      </Box>
    )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchText && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Recent searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {searchHistory.map((term, index) => (
              <Chip
                key={`${term}-${index}`}
                label={term}
                size="small"
                onClick={() => setSearchText(term)}
                onDelete={() => {
                  const newHistory = searchHistory.filter(h => h !== term);
                  setSearchHistory(newHistory);
                  localStorage.setItem('dataCatalogSearchHistory', JSON.stringify(newHistory));
                }}
                sx={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.04)' }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress aria-label="Loading data assets" />
        </Box>
      )}
      
      {/* Error state */}
      {error && (
        <Box sx={{ mt: 2, mb: 2 }} aria-live="assertive">
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Results Section */}
      {!loading && !error && (
        <>
            <Box sx={{ mb: 2 }} aria-live="polite">
              <Typography variant="subtitle1">
                {totalAssets > 0 
                  ? `Showing ${Math.min((page - 1) * limit + 1, totalAssets)}-${Math.min(page * limit, totalAssets)} of ${totalAssets} results` 
                  : 'No results found'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {displayedAssets.map((asset) => (
                <Grid item xs={12} sm={6} md={4} key={asset._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      borderLeft: `4px solid ${getDomainColorScheme(asset.domain).border}`,
                      border: (asset._id && selectedAssets.includes(asset._id)) ? '2px solid #003366' : '1px solid #e0e0e0',
                      '&:hover': { 
                        boxShadow: 3,
                        '& .edit-indicator': {
                          opacity: 1
                        }
                      },
                      '&:focus-within': { 
                        boxShadow: 3,
                        outline: '2px solid #003366',
                        outlineOffset: '2px'
                      }
                    }}
                    onClick={(e) => {
                      if (bulkMode) {
                        // In bulk mode, clicking selects/deselects
                        e.preventDefault();
                        if (asset._id) {
                          handleBulkSelection(asset._id);
                        }
                      } else if (e.ctrlKey || e.metaKey) {
                        // Ctrl/Cmd + click for comparison selection
                        e.preventDefault();
                        if (asset._id) {
                          handleAssetSelection(asset._id);
                        }
                      } else {
                        handleEditAsset(asset);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (e.ctrlKey || e.metaKey) {
                          if (asset._id) {
                            handleAssetSelection(asset._id);
                          }
                        } else {
                          handleEditAsset(asset);
                        }
                      }
                    }}
                    aria-label={`${(asset._id && selectedAssets.includes(asset._id)) ? 'Selected - ' : ''}Edit ${asset.name} - ${asset.type} in ${asset.domain} domain. Ctrl+click to select for comparison`}
                  >
                    {/* Selection indicators */}
                    {bulkMode && asset._id && bulkSelectedAssets.includes(asset._id) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: '#B31B1B',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2
                        }}
                        aria-hidden="true"
                      >
                        ✓
                      </Box>
                    )}
                    
                    {!bulkMode && (asset._id && selectedAssets.includes(asset._id)) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: '#003366',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2
                        }}
                        aria-hidden="true"
                      >
                        ✓
                      </Box>
                    )}

                    {/* Edit indicator that appears on hover/focus */}
                    <Box
                      className="edit-indicator"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        boxShadow: 1,
                        zIndex: 1
                      }}
                      aria-hidden="true"
                    >
                      <EditIcon fontSize="small" color="primary" />
                    </Box>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {asset.name}
                      </Typography>
                      
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          size="small"
                          label={asset.domain}
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                            height: '24px',
                            color: 'white',
                            backgroundColor: getDomainColorScheme(asset.domain).border
                          }} 
                        />
                        <Chip 
                          size="small"
                          label={asset.status || 'Draft'}
                          sx={{ 
                            mb: 1,
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                            height: '24px',
                            color: 'white',
                            backgroundColor: asset.status === 'Active' ? '#007B3E' : 
                                          asset.status === 'Pending' ? '#F1C21B' : '#8A8B8C'
                          }} 
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '4.5em'
                        }}
                      >
                        {asset.description || 'No description available'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                        {asset.type && (
                          <Chip 
                            label={asset.type} 
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              height: '24px',
                              color: 'white',
                              backgroundColor: '#003366'
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          aria-label={`View lineage for ${asset.name}`}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLineage(asset);
                          }}
                          sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                        >
                          🔗
                        </IconButton>
                        <IconButton 
                          aria-label={`Edit ${asset.name}`}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAsset(asset);
                          }}
                          sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Results count and bulk select all */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {dataAssets.length} of {totalAssets} assets
              </Typography>
              
              {bulkMode && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSelectAll}
                  aria-label={bulkSelectedAssets.length === dataAssets.length ? "Deselect all assets" : "Select all assets"}
                >
                  {bulkSelectedAssets.length === dataAssets.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  aria-label="Data catalog pagination"
                />
              </Box>
            )}
          </>
        )}
      
      {/* Enhanced Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Filter Data Assets</Typography>
            <IconButton
              aria-label="Close filters"
              onClick={() => setFilterDialogOpen(false)}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Quick Filters Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#003366', fontWeight: 600 }}>
                Quick Filters
              </Typography>
            </Grid>
            
            {/* Asset Type Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Asset Type</InputLabel>
                <Select
                  multiple
                  value={filters.types}
                  onChange={(e) => setFilters(prev => ({ ...prev, types: e.target.value as string[] }))}
                  label="Asset Type"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {assetTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={filters.types.includes(type)} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeIcon(type)}
                        <Typography>{type}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Domain Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  multiple
                  value={filters.domains}
                  onChange={(e) => setFilters(prev => ({ ...prev, domains: e.target.value as string[] }))}
                  label="Domain"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {['Analytics', 'Architecture', 'Audit', 'Batch', 'Business Intelligence', 'Cloud', 'Compliance', 'Customer', 'Customer Service', 'Data Science', 'Development', 'Engineering', 'Finance', 'Governance', 'HR', 'Historical', 'IT', 'Infrastructure', 'Integration', 'Inventory', 'Legal', 'Logistics', 'Manufacturing', 'Marketing', 'Mobile', 'Operations', 'Planning', 'Procurement', 'Product', 'Quality', 'R&D', 'Real-time', 'Reporting', 'Research', 'Risk Management', 'Sales', 'Security', 'Strategy', 'Streaming', 'Supply Chain', 'Web'].map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      <Checkbox checked={filters.domains.includes(domain)} />
                      <Typography>{domain}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.statuses}
                  onChange={(e) => setFilters(prev => ({ ...prev, statuses: e.target.value as string[] }))}
                  label="Status"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small"
                          color={value === 'Production' ? 'success' : value === 'Development' ? 'warning' : 'default'}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {['Active', 'Archived', 'Deprecated', 'Development', 'Inactive', 'Production', 'Testing'].map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={filters.statuses.includes(status)} />
                      <Typography>{status}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Certification Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Certification</InputLabel>
                <Select
                  multiple
                  value={filters.certifications}
                  onChange={(e) => setFilters(prev => ({ ...prev, certifications: e.target.value as CertificationType[] }))}
                  label="Certification"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" sx={{ textTransform: 'capitalize' }} />
                      ))}
                    </Box>
                  )}
                >
                  {['bronze', 'certified', 'gold', 'none', 'pending', 'platinum', 'silver'].map((cert) => (
                    <MenuItem key={cert} value={cert}>
                      <Checkbox checked={filters.certifications.includes(cert as CertificationType)} />
                      <Typography sx={{ textTransform: 'capitalize' }}>{cert}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setFilters({
              types: [],
              domains: [],
              statuses: [],
              certifications: [],
              owners: [],
              complianceStatuses: [],
              tags: []
            })}
            color="secondary"
          >
            Clear All
          </Button>
          <Button
            onClick={() => setFilters({
              types: [],
              domains: [],
              statuses: ['Production'],
              certifications: ['certified'],
              owners: [],
              complianceStatuses: [],
              tags: []
            })}
            variant="outlined"
          >
            Trusted Data
          </Button>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            variant="contained"
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Data Asset
        </DialogTitle>
        <DialogContent dividers>
          {editedAsset && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editedAsset.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  inputProps={{ 'aria-label': 'Asset name' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editedAsset.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  inputProps={{ 'aria-label': 'Asset description' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    value={editedAsset.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    label="Type"
                    inputProps={{ 'aria-label': 'Asset type' }}
                  >
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="Data Warehouse">Data Warehouse</MenuItem>
                    <MenuItem value="API">API</MenuItem>
                    <MenuItem value="Report">Report</MenuItem>
                    <MenuItem value="Dashboard">Dashboard</MenuItem>
                    <MenuItem value="Table">Table</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="domain-label">Domain</InputLabel>
                  <Select
                    labelId="domain-label"
                    value={editedAsset.domain}
                    onChange={(e) => handleFormChange('domain', e.target.value)}
                    label="Domain"
                    inputProps={{ 'aria-label': 'Asset domain' }}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={editedAsset.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    label="Status"
                    inputProps={{ 'aria-label': 'Asset status' }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                    <MenuItem value="Development">Development</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="certification-label">Certification</InputLabel>
                  <Select
                    labelId="certification-label"
                    value={editedAsset.certification || 'none'}
                    onChange={(e) => handleFormChange('certification', e.target.value)}
                    label="Certification"
                    inputProps={{ 'aria-label': 'Asset certification' }}
                  >
                    <MenuItem value="certified">Certified</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="owner-label">Owner</InputLabel>
                  <Select
                    labelId="owner-label"
                    value={editedAsset.owner}
                    onChange={(e) => handleFormChange('owner', e.target.value)}
                    label="Owner"
                    inputProps={{ 'aria-label': 'Asset owner' }}
                  >
                    <MenuItem value="John Doe">John Doe</MenuItem>
                    <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    <MenuItem value="Data Governance Team">Data Governance Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  value={editedAsset.tags ? editedAsset.tags.join(', ') : ''}
                  onChange={(e) => {
                    const tagArray = e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean);
                    handleTagChange(tagArray);
                  }}
                  margin="normal"
                  variant="outlined"
                  helperText="Enter tags separated by commas"
                  inputProps={{ 'aria-label': 'Asset tags' }}
                />
              </Grid>
            </Grid>
          )}
          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEditDialog}
            disabled={isSaving}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAsset}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSaving}
            aria-label="Save changes"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Asset Comparison Dialog */}
      <Dialog
        open={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="comparison-dialog-title"
      >
        <DialogTitle id="comparison-dialog-title">
          Asset Comparison ({getSelectedAssetObjects().length} assets)
        </DialogTitle>
        <DialogContent>
          {getSelectedAssetObjects().length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 600 }}>
                      Property
                    </th>
                    {getSelectedAssetObjects().map((asset, index) => (
                      <th key={asset._id} style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid #ddd',
                        borderLeft: index > 0 ? '1px solid #ddd' : 'none',
                        fontWeight: 600,
                        maxWidth: '200px'
                      }}>
                        {asset.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'type', label: 'Type' },
                    { key: 'domain', label: 'Domain' },
                    { key: 'status', label: 'Status' },
                    { key: 'certification', label: 'Certification' },
                    { key: 'owner', label: 'Owner' },
                    { key: 'complianceStatus', label: 'Compliance Status' },
                    { key: 'description', label: 'Description' },
                    { key: 'tags', label: 'Tags' }
                  ].map((property, rowIndex) => (
                    <tr key={property.key} style={{ backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : 'white' }}>
                      <td style={{ 
                        padding: '12px', 
                        borderBottom: '1px solid #ddd',
                        fontWeight: 600,
                        backgroundColor: '#f5f5f5'
                      }}>
                        {property.label}
                      </td>
                      {getSelectedAssetObjects().map((asset, colIndex) => (
                        <td key={asset._id} style={{ 
                          padding: '12px', 
                          borderBottom: '1px solid #ddd',
                          borderLeft: colIndex > 0 ? '1px solid #ddd' : 'none',
                          maxWidth: '200px',
                          wordWrap: 'break-word'
                        }}>
                          {property.key === 'tags' 
                            ? (asset[property.key] as string[])?.join(', ') || 'None'
                            : String(asset[property.key as keyof DataAsset] || 'Not specified')
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            <Typography>No assets selected for comparison.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonDialogOpen(false)}>
            Close
          </Button>
          <Button 
            onClick={() => {
              clearSelections();
              setComparisonDialogOpen(false);
            }}
            variant="outlined"
          >
            Clear Selections
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Lineage Dialog */}
      <Dialog
        open={lineageDialogOpen}
        onClose={() => setLineageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="lineage-dialog-title"
      >
        <DialogTitle id="lineage-dialog-title">
          Data Lineage: {lineageAsset?.name}
        </DialogTitle>
        <DialogContent>
          {lineageAsset && (
            <Box sx={{ p: 2 }}>
              {/* Lineage Visualization */}
              <Box sx={{ 
                minHeight: 400, 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                p: 3,
                bgcolor: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {(() => {
                  const lineageData = generateLineageData(lineageAsset);
                  const centerX = 400;
                  const centerY = 200;
                  const levelSpacing = 200;
                  const nodeSpacing = 100;
                  
                  return (
                    <svg width="100%" height="400" viewBox="0 0 800 400">
                      {/* Render edges first */}
                      {lineageData.links.map((edge, index) => {
                        const sourceNode = lineageData.nodes.find(n => n.id === edge.source);
                        const targetNode = lineageData.nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;
                        
                        const sourceX = centerX + (sourceNode.level * levelSpacing);
                        const sourceY = centerY + (lineageData.nodes.filter(n => n.level === sourceNode.level).indexOf(sourceNode) - 0.5) * nodeSpacing;
                        const targetX = centerX + (targetNode.level * levelSpacing);
                        const targetY = centerY + (lineageData.nodes.filter(n => n.level === targetNode.level).indexOf(targetNode) - 0.5) * nodeSpacing;
                        
                        return (
                          <g key={`edge-${index}`}>
                            <line
                              x1={sourceX}
                              y1={sourceY}
                              x2={targetX}
                              y2={targetY}
                              stroke="#003366"
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                            <text
                              x={(sourceX + targetX) / 2}
                              y={(sourceY + targetY) / 2 - 10}
                              textAnchor="middle"
                              fontSize="12"
                              fill="#666"
                            >
                              {edge.type}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Arrow marker definition */}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#003366"
                          />
                        </marker>
                      </defs>
                      
                      {/* Render nodes */}
                      {lineageData.nodes.map((node, index) => {
                        const x = centerX + (node.level * levelSpacing);
                        const y = centerY + (lineageData.nodes.filter(n => n.level === node.level).indexOf(node) - 0.5) * nodeSpacing;
                        const isCenter = node.isCenter;
                        
                        return (
                          <g key={`node-${index}`}>
                            <rect
                              x={x - 60}
                              y={y - 25}
                              width="120"
                              height="50"
                              rx="8"
                              fill={isCenter ? "#003366" : "#e3f2fd"}
                              stroke={isCenter ? "#001f3f" : "#003366"}
                              strokeWidth="2"
                            />
                            <text
                              x={x}
                              y={y - 5}
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="600"
                              fill={isCenter ? "white" : "#003366"}
                            >
                              {node.name}
                            </text>
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="middle"
                              fontSize="10"
                              fill={isCenter ? "#ccc" : "#666"}
                            >
                              {node.type}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </Box>
              
              {/* Lineage Legend */}
              <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                  Lineage Legend
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        bgcolor: '#003366', 
                        borderRadius: 1 
                      }} />
                      <Typography variant="body2">Current Asset</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        bgcolor: '#e3f2fd', 
                        border: '2px solid #003366',
                        borderRadius: 1 
                      }} />
                      <Typography variant="body2">Related Assets</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 2, 
                        bgcolor: '#003366'
                      }} />
                      <Typography variant="body2">Data Flow</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Asset Details */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                  Asset Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Type:</strong> {lineageAsset.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Domain:</strong> {lineageAsset.domain}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {lineageAsset.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Owner:</strong> {lineageAsset.owner || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong> {lineageAsset.description || 'No description available'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLineageDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog
        open={bulkActionDialogOpen}
        onClose={() => setBulkActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="bulk-actions-dialog-title"
      >
        <DialogTitle id="bulk-actions-dialog-title">
          Bulk Actions ({bulkSelectedAssets.length} assets selected)
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
              Available Actions
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleBulkAction('status', 'Active')}
                  disabled={isSaving}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>Set Status to Active</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mark all selected assets as active and available for use
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleBulkAction('status', 'Deprecated')}
                  disabled={isSaving}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>Set Status to Deprecated</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mark all selected assets as deprecated
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleBulkAction('certification', 'certified')}
                  disabled={isSaving}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>Set Certification to Certified</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mark all selected assets as certified for production use
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleBulkAction('certification', 'pending')}
                  disabled={isSaving}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>Set Certification to Pending</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mark all selected assets as pending certification review
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
            
            {saveError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {saveError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBulkActionDialogOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="export-dialog-title"
      >
        <DialogTitle id="export-dialog-title">
          Export Data Catalog
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Export the current data catalog view ({dataAssets.length} assets) in your preferred format.
            </Typography>
            
            {searchText && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current search: "{searchText}"
              </Typography>
            )}
            
            {Object.values(filters).some(f => f.length > 0) && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Active filters will be included in the export
              </Typography>
            )}
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleExportCSV}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>📊 Export as CSV</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Spreadsheet format for data analysis and reporting
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleExportPDF}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={600}>📄 Export as PDF</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Formatted document for sharing and documentation
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
                📋 Export Details:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Includes all visible asset properties<br/>
                • Respects current search and filter settings<br/>
                • Generated with timestamp for tracking<br/>
                • USCIS compliant formatting and branding
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        message="Changes saved successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default DataCatalog;

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccountTree,
  Refresh,
  Add,
  Search,
  Info,
  Settings,
  Download,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Timeline,
  Hub,
  Storage,
  Analytics,
  Security,
  DataObject,
  Policy,
  LocationOn,
  TrendingUp,
  Warning,
  Route,
  ShowChart
} from '@mui/icons-material';
import cytoscape from 'cytoscape';
import janusGraphService, { GraphData, GraphVertex, GraphEdge, ConnectionStatus } from '../services/janusGraphService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`graph-tabpanel-${index}`}
      aria-labelledby={`graph-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const JanusGraphVisualization: React.FC = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphVertex | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [addNodeDialog, setAddNodeDialog] = useState(false);
  const [addEdgeDialog, setAddEdgeDialog] = useState(false);
  const [queryDialog, setQueryDialog] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);

  // Cytoscape refs
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<any>(null);

  // Form states
  const [newNode, setNewNode] = useState({
    label: '',
    type: 'data_asset',
    properties: {}
  });

  const [newEdge, setNewEdge] = useState({
    fromVertexId: '',
    toVertexId: '',
    label: 'connected',
    properties: {}
  });

  // Load initial data
  useEffect(() => {
    loadConnectionStatus();
    loadGraphData();
    loadStatistics();
  }, []);

  // Initialize Cytoscape when graph data changes
  useEffect(() => {
    if (graphData.nodes.length > 0 && cyRef.current) {
      initializeCytoscape();
    }
  }, [graphData]);

  const loadConnectionStatus = async () => {
    try {
      const status = await janusGraphService.getStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error loading connection status:', error);
      setError('Failed to load connection status');
    }
  };

  const loadGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await janusGraphService.getGraphData(100);
      setGraphData(response.data);
    } catch (error) {
      console.error('Error loading graph data:', error);
      setError('Failed to load graph data');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await janusGraphService.getGraphStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const initializeCytoscape = () => {
    if (!cyRef.current) return;

    // Destroy existing instance
    if (cyInstance.current) {
      cyInstance.current.destroy();
    }

    // Get valid node IDs for edge validation
    const nodeIds = new Set(graphData.nodes.map(node => node.id));

    // Filter out edges that reference non-existent nodes
    const validEdges = graphData.edges.filter(edge => {
      const hasValidSource = nodeIds.has(edge.source);
      const hasValidTarget = nodeIds.has(edge.target);
      
      if (!hasValidSource || !hasValidTarget) {
        console.warn(`Skipping edge ${edge.id}: source=${edge.source} (${hasValidSource}), target=${edge.target} (${hasValidTarget})`);
        return false;
      }
      
      return true;
    });

    // Transform data for Cytoscape
    const elements = [
      ...graphData.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          ...node.properties
        }
      })),
      ...validEdges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type,
          ...edge.properties
        }
      }))
    ];

    // Initialize Cytoscape
    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'roundrectangle', // Changed from circle to rounded rectangle
            'background-color': '#4caf50', // Default color, will be overridden by getNodeColor logic
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'font-size': '14px', // Increased from 12px
            'font-weight': 'bold',
            'width': 120, // Increased from 60px
            'height': 80, // Increased from 60px
            'border-width': 3, // Increased from 2px
            'border-color': '#003366',
            'text-wrap': 'wrap',
            'text-max-width': '110px', // Increased to match new width
            'text-outline-width': 1,
            'text-outline-color': '#000000',
            'text-outline-opacity': 0.3
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 5, // Increased to match larger nodes
            'border-color': '#ff6b35',
            'background-color': '#ff6b35',
            'color': '#ffffff',
            'font-size': '14px',
            'font-weight': 'bold',
            'text-outline-width': 2,
            'text-outline-color': '#000000',
            'text-outline-opacity': 0.5
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#003366',
            'target-arrow-color': '#003366',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'color': '#003366',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#ff6b35',
            'target-arrow-color': '#ff6b35',
            'color': '#ff6b35'
          }
        }
      ],
      layout: {
        name: 'breadthfirst' as const,
        directed: true,
        padding: 80, // Increased padding for larger nodes
        spacingFactor: 2.0, // Increased spacing between nodes
        nodeDimensionsIncludeLabels: true
      }
    });

    // Apply node colors based on type
    cyInstance.current.nodes().forEach((node: any) => {
      const nodeType = node.data('type');
      const color = getNodeColor(nodeType);
      node.style('background-color', color);
    });

    // Event handlers
    cyInstance.current.on('tap', 'node', (event: any) => {
      const node = event.target;
      const nodeData = node.data();
      setSelectedNode({
        id: nodeData.id,
        label: nodeData.label,
        type: nodeData.type,
        properties: nodeData
      });
      setSelectedEdge(null);
    });

    cyInstance.current.on('tap', 'edge', (event: any) => {
      const edge = event.target;
      const edgeData = edge.data();
      setSelectedEdge({
        id: edgeData.id,
        source: edgeData.source,
        target: edgeData.target,
        label: edgeData.label,
        type: edgeData.type,
        properties: edgeData
      });
      setSelectedNode(null);
    });

    cyInstance.current.on('tap', (event: any) => {
      if (event.target === cyInstance.current) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });
  };

  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      // USCIS Immigration Case Network Types
      'immigration_case': '#003366',      // USCIS Blue - Primary cases
      'applicant': '#4caf50',            // Green - Applicants/Beneficiaries
      'petitioner': '#2196f3',           // Blue - Petitioners
      'beneficiary': '#8bc34a',          // Light Green - Beneficiaries
      'legal_representative': '#9c27b0', // Purple - Attorneys/Representatives
      'document': '#ff9800',             // Orange - Documents/Evidence
      'uscis_system': '#795548',         // Brown - USCIS Systems (CRIS, CLAIMS3)
      
      // USCIS Workflow & Case Management Types
      'workflow_step': '#e91e63',        // Pink - Workflow Steps
      'uscis_personnel': '#00bcd4',      // Cyan - USCIS Personnel/Officers
      
      // RNA Advanced Analytics Types
      'policy_rule': '#673ab7',          // Deep Purple - Policy Rules
      'analytics_model': '#3f51b5',      // Indigo - Analytics Models
      'trend_pattern': '#ff5722',        // Deep Orange - Trend Patterns
      'anomaly_detection': '#f44336',    // Red - Anomaly Detection
      
      // Document and Data Lineage Types
      'data_source': '#607d8b',          // Blue Grey - Data Sources
      'data_transformation': '#ffc107',  // Amber - Data Transformations
      'audit_trail': '#795548',          // Brown - Audit Trails
      'quality_control': '#4caf50',      // Green - Quality Control
      
      // Personnel Roles and Access Types
      'access_role': '#9c27b0',          // Purple - Access Roles
      'access_permission': '#e91e63',    // Pink - Access Permissions
      'access_session': '#ff5722',       // Deep Orange - Access Sessions
      'compliance_review': '#2196f3',    // Blue - Compliance Reviews
      
      // Master Data Management Types
      'master_entity': '#00bcd4',        // Cyan - Master Entities
      'reference_data': '#4caf50',       // Green - Reference Data
      'data_standard': '#ff9800',        // Orange - Data Standards
      'data_mapping': '#9e9e9e',         // Grey - Data Mappings
      
      // Automated Governance and Metadata Types
      'governance_policy': '#3f51b5',    // Indigo - Governance Policies
      'metadata_element': '#8bc34a',     // Light Green - Metadata Elements
      'impact_analysis': '#ff5722',      // Deep Orange - Impact Analysis
      'governance_automation': '#795548', // Brown - Governance Automation
      'policy_violation': '#f44336',     // Red - Policy Violations
      
      // Geospatial Data and Interconnectedness Types
      'geographic_location': '#2e7d32',  // Dark Green - Geographic Locations
      'spatial_analysis': '#1976d2',     // Blue - Spatial Analysis
      'geospatial_service': '#7b1fa2',   // Purple - Geospatial Services
      
      // Legacy Data Types (for backward compatibility)
      'data_asset': '#4caf50',
      'system': '#2196f3',
      'process': '#ff9800',
      'user': '#9c27b0',
      'database': '#795548',
      'table': '#607d8b',
      'application': '#e91e63',
      'service': '#00bcd4',
      'unknown': '#757575'
    };
    return colors[type] || colors.unknown;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    loadGraphData();
    loadStatistics();
  };

  const handleZoomIn = () => {
    if (cyInstance.current) {
      cyInstance.current.zoom(cyInstance.current.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (cyInstance.current) {
      cyInstance.current.zoom(cyInstance.current.zoom() * 0.8);
    }
  };

  const handleFitToScreen = () => {
    if (cyInstance.current) {
      cyInstance.current.fit();
    }
  };

  const handleAddNode = async () => {
    try {
      await janusGraphService.createVertex({
        label: newNode.label,
        properties: { type: newNode.type, ...newNode.properties }
      });
      
      setAddNodeDialog(false);
      setNewNode({ label: '', type: 'data_asset', properties: {} });
      handleRefresh();
    } catch (error) {
      setError('Failed to create node');
    }
  };

  const handleExecuteQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await janusGraphService.executeQuery({ query: customQuery });
      
      // Enhanced result display with metadata
      const enhancedResult = {
        data: response,
        metadata: {
          query: customQuery,
          resultCount: Array.isArray(response) ? response.length : (typeof response === 'object' ? Object.keys(response).length : 1),
          timestamp: new Date().toISOString(),
          queryType: customQuery.includes('groupCount') ? 'Aggregation' : 
                    customQuery.includes('path') ? 'Path Traversal' :
                    customQuery.includes('valueMap') ? 'Property Query' : 'General Query'
        }
      };
      
      setQueryResult(enhancedResult);
    } catch (error: any) {
      console.error('Query execution error:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to execute query';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`Query Error: ${errorMessage}`);
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAndVisualize = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await janusGraphService.executeQuery({ query: customQuery });
      
      // Enhanced result display with metadata
      const enhancedResult = {
        data: response,
        metadata: {
          query: customQuery,
          resultCount: Array.isArray(response) ? response.length : (typeof response === 'object' ? Object.keys(response).length : 1),
          timestamp: new Date().toISOString(),
          queryType: customQuery.includes('groupCount') ? 'Aggregation' : 
                    customQuery.includes('path') ? 'Path Traversal' :
                    customQuery.includes('valueMap') ? 'Property Query' : 'General Query'
        }
      };
      
      setQueryResult(enhancedResult);

      // Convert query results to graph format and visualize
      if (Array.isArray(response) && response.length > 0) {
        const nodes: GraphVertex[] = [];
        const edges: GraphEdge[] = [];

        response.forEach((item: any) => {
          if (item.id && item.label) {
            // Convert query result to graph node
            const node: GraphVertex = {
              id: item.id,
              label: item.label,
              type: item.label, // Use label as type for visualization
              properties: {}
            };

            // Add properties from valueMap result
            Object.keys(item).forEach(key => {
              if (key !== 'id' && key !== 'label') {
                // Handle array properties from valueMap(true)
                if (node.properties) {
                  node.properties[key] = Array.isArray(item[key]) ? item[key][0] : item[key];
                }
              }
            });

            nodes.push(node);
          }
        });

        if (nodes.length > 0) {
          // Set the graph data to show query results
          setGraphData({ nodes, edges });
          
          // Close the query dialog
          setQueryDialog(false);
          
          // Show success message
          setError(null);
        } else {
          setError('Query results cannot be visualized - no valid nodes found. Try queries that return vertices with id and label properties.');
        }
      } else {
        setError('Query results cannot be visualized - results must be an array of vertices. Try using .valueMap(true) to get vertex properties.');
      }
    } catch (error: any) {
      console.error('Query execution error:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to execute query';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`Query Error: ${errorMessage}`);
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDataLineage = async () => {
    try {
      setLoading(true);
      const lineageData = await janusGraphService.getDataLineageGraph();
      setGraphData(lineageData);
    } catch (error) {
      setError('Failed to load data lineage');
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkGraph = async () => {
    try {
      setLoading(true);
      const networkData = await janusGraphService.getNetworkGraph();
      setGraphData(networkData);
    } catch (error) {
      setError('Failed to load network graph');
    } finally {
      setLoading(false);
    }
  };

  const loadImmigrationCaseNetwork = async () => {
    try {
      setLoading(true);
      const immigrationData = await janusGraphService.getImmigrationCaseNetwork();
      setGraphData(immigrationData);
    } catch (error) {
      setError('Failed to load immigration case network');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowCaseManagement = async () => {
    try {
      setLoading(true);
      const workflowData = await janusGraphService.getWorkflowCaseManagement();
      setGraphData(workflowData);
    } catch (error) {
      setError('Failed to load workflow case management');
    } finally {
      setLoading(false);
    }
  };

  const loadRNAAdvancedAnalytics = async () => {
    try {
      setLoading(true);
      const rnaData = await janusGraphService.getRNAAdvancedAnalytics();
      setGraphData(rnaData);
    } catch (error) {
      setError('Failed to load RNA advanced analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentDataLineage = async () => {
    try {
      setLoading(true);
      const lineageData = await janusGraphService.getDocumentDataLineage();
      setGraphData(lineageData);
    } catch (error) {
      setError('Failed to load document data lineage');
    } finally {
      setLoading(false);
    }
  };

  const loadPersonnelRolesAccess = async () => {
    try {
      setLoading(true);
      const accessData = await janusGraphService.getPersonnelRolesAccess();
      setGraphData(accessData);
    } catch (error) {
      setError('Failed to load personnel roles access');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterDataManagement = async () => {
    try {
      setLoading(true);
      const masterData = await janusGraphService.getMasterDataManagement();
      setGraphData(masterData);
    } catch (error) {
      setError('Failed to load master data management');
    } finally {
      setLoading(false);
    }
  };

  const loadAutomatedGovernance = async () => {
    try {
      setLoading(true);
      const governanceData = await janusGraphService.getAutomatedGovernance();
      setGraphData(governanceData);
    } catch (error) {
      setError('Failed to load automated governance');
    } finally {
      setLoading(false);
    }
  };

  const loadGeospatialData = async () => {
    try {
      setLoading(true);
      const geospatialData = await janusGraphService.getGeospatialData();
      setGraphData(geospatialData);
    } catch (error) {
      setError('Failed to load geospatial data');
    } finally {
      setLoading(false);
    }
  };

  const loadImpactAnalysis = async () => {
    try {
      setLoading(true);
      const impactData = await janusGraphService.getImpactAnalysis('policy-rule-001', 3);
      setGraphData({ nodes: impactData.nodes, edges: impactData.edges });
    } catch (error) {
      setError('Failed to load impact analysis');
    } finally {
      setLoading(false);
    }
  };

  const loadFraudDetection = async () => {
    try {
      setLoading(true);
      const fraudData = await janusGraphService.getFraudDetection(70);
      setGraphData({ nodes: fraudData.nodes, edges: fraudData.edges });
    } catch (error) {
      setError('Failed to load fraud detection');
    } finally {
      setLoading(false);
    }
  };

  const loadIntelligentRouting = async () => {
    try {
      setLoading(true);
      const routingData = await janusGraphService.getIntelligentRouting();
      setGraphData({ nodes: routingData.nodes, edges: routingData.edges });
    } catch (error) {
      setError('Failed to load intelligent routing');
    } finally {
      setLoading(false);
    }
  };

  const loadPredictiveAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await janusGraphService.getPredictiveAnalytics('all');
      setGraphData({ nodes: analyticsData.nodes, edges: analyticsData.edges });
    } catch (error) {
      setError('Failed to load predictive analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccountTree sx={{ mr: 2, fontSize: 32, color: '#003366' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ color: '#003366', fontWeight: 'bold' }}>
            JanusGraph Visualization
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive graph database visualization and analysis
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Primary DSSS3 Use Cases - Row 1 */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AccountTree />}
              onClick={loadImmigrationCaseNetwork}
              disabled={loading}
              sx={{ 
                color: '#003366', 
                borderColor: '#003366',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#001a33', 
                  backgroundColor: 'rgba(0, 51, 102, 0.08)',
                  color: '#001a33'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Case Networks
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={loadWorkflowCaseManagement}
              disabled={loading}
              sx={{ 
                color: '#c2185b', 
                borderColor: '#c2185b',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#ad1457', 
                  backgroundColor: 'rgba(194, 24, 91, 0.08)',
                  color: '#ad1457'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Workflow
            </Button>
            <Button
              variant="outlined"
              startIcon={<Analytics />}
              onClick={loadRNAAdvancedAnalytics}
              disabled={loading}
              sx={{ 
                color: '#512da8', 
                borderColor: '#512da8',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#4527a0', 
                  backgroundColor: 'rgba(81, 45, 168, 0.08)',
                  color: '#4527a0'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              RNA Analytics
            </Button>
            <Button
              variant="outlined"
              startIcon={<Storage />}
              onClick={loadDocumentDataLineage}
              disabled={loading}
              sx={{ 
                color: '#455a64', 
                borderColor: '#455a64',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#37474f', 
                  backgroundColor: 'rgba(69, 90, 100, 0.08)',
                  color: '#37474f'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Data Lineage
            </Button>
          </Box>

          {/* Secondary DSSS3 Use Cases - Row 2 */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={loadPersonnelRolesAccess}
              disabled={loading}
              sx={{ 
                color: '#7b1fa2', 
                borderColor: '#7b1fa2',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#6a1b9a', 
                  backgroundColor: 'rgba(123, 31, 162, 0.08)',
                  color: '#6a1b9a'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Access Control
            </Button>
            <Button
              variant="outlined"
              startIcon={<DataObject />}
              onClick={loadMasterDataManagement}
              disabled={loading}
              sx={{ 
                color: '#0097a7', 
                borderColor: '#0097a7',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#00838f', 
                  backgroundColor: 'rgba(0, 151, 167, 0.08)',
                  color: '#00838f'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Master Data
            </Button>
            <Button
              variant="outlined"
              startIcon={<Policy />}
              onClick={loadAutomatedGovernance}
              disabled={loading}
              sx={{ 
                color: '#303f9f', 
                borderColor: '#303f9f',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#283593', 
                  backgroundColor: 'rgba(48, 63, 159, 0.08)',
                  color: '#283593'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Governance
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocationOn />}
              onClick={loadGeospatialData}
              disabled={loading}
              sx={{ 
                color: '#2e7d32', 
                borderColor: '#2e7d32',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#1b5e20', 
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  color: '#1b5e20'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Geospatial
            </Button>
          </Box>

          {/* Advanced DSSS3 Capabilities - Row 3 */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={loadImpactAnalysis}
              disabled={loading}
              sx={{
                color: '#d32f2f',
                borderColor: '#d32f2f',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#c62828',
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  color: '#c62828'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Impact Analysis
            </Button>
            <Button
              variant="outlined"
              startIcon={<Warning />}
              onClick={loadFraudDetection}
              disabled={loading}
              sx={{
                color: '#f57c00',
                borderColor: '#f57c00',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#ef6c00',
                  backgroundColor: 'rgba(245, 124, 0, 0.08)',
                  color: '#ef6c00'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Fraud Detection
            </Button>
            <Button
              variant="outlined"
              startIcon={<Route />}
              onClick={loadIntelligentRouting}
              disabled={loading}
              sx={{
                color: '#1976d2',
                borderColor: '#1976d2',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  color: '#1565c0'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Smart Routing
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShowChart />}
              onClick={loadPredictiveAnalytics}
              disabled={loading}
              sx={{
                color: '#9c27b0',
                borderColor: '#9c27b0',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#7b1fa2',
                  backgroundColor: 'rgba(156, 39, 176, 0.08)',
                  color: '#7b1fa2'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Predictions
            </Button>
            <Button
              variant="outlined"
              startIcon={<Timeline />}
              onClick={loadDataLineage}
              disabled={loading}
              sx={{
                color: '#424242',
                borderColor: '#424242',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#212121',
                  backgroundColor: 'rgba(66, 66, 66, 0.08)',
                  color: '#212121'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Legacy Lineage
            </Button>
            <Button
              variant="outlined"
              startIcon={<Hub />}
              onClick={loadNetworkGraph}
              disabled={loading}
              sx={{
                color: '#424242',
                borderColor: '#424242',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#212121',
                  backgroundColor: 'rgba(66, 66, 66, 0.08)',
                  color: '#212121'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                }
              }}
            >
              Network
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                backgroundColor: '#003366',
                color: '#ffffff',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#001a33'
                },
                '&:focus': {
                  outline: '3px solid #005fcc',
                  outlineOffset: '2px'
                },
                '&:disabled': {
                  backgroundColor: '#cccccc',
                  color: '#666666'
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Connection Status */}
      {connectionStatus && (
        <Alert 
          severity={connectionStatus.connected ? 'success' : 'warning'} 
          sx={{ mb: 2 }}
        >
          {connectionStatus.connected 
            ? `Connected to JanusGraph at ${connectionStatus.gremlinUrl}`
            : `Mock mode - JanusGraph not connected (${connectionStatus.gremlinUrl})`
          }
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Graph Visualization */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Graph Visualization</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Zoom In">
                    <IconButton onClick={handleZoomIn}>
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zoom Out">
                    <IconButton onClick={handleZoomOut}>
                      <ZoomOut />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Fit to Screen">
                    <IconButton onClick={handleFitToScreen}>
                      <CenterFocusStrong />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setAddNodeDialog(true)}
                    size="small"
                  >
                    Add Node
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Search />}
                    onClick={() => setQueryDialog(true)}
                    size="small"
                  >
                    Query
                  </Button>
                </Box>
              </Box>
              
              <Box
                ref={cyRef}
                sx={{
                  width: '100%',
                  height: '600px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  position: 'relative'
                }}
              >
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Details" />
              <Tab label="Statistics" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {selectedNode && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Node Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {selectedNode.id}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Label:</strong> {selectedNode.label}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> <Chip label={selectedNode.type} size="small" />
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Properties:
                  </Typography>
                  {selectedNode.properties && Object.entries(selectedNode.properties).map(([key, value]) => (
                    <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                      <strong>{key}:</strong> {String(value)}
                    </Typography>
                  ))}
                </Box>
              )}

              {selectedEdge && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Edge Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {selectedEdge.id}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Label:</strong> {selectedEdge.label}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> <Chip label={selectedEdge.type} size="small" />
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>From:</strong> {selectedEdge.source}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>To:</strong> {selectedEdge.target}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Properties:
                  </Typography>
                  {selectedEdge.properties && Object.entries(selectedEdge.properties).map(([key, value]) => (
                    <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                      <strong>{key}:</strong> {String(value)}
                    </Typography>
                  ))}
                </Box>
              )}

              {!selectedNode && !selectedEdge && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Click on a node or edge to view details
                  </Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {statistics && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Graph Statistics
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Vertices:</strong> {statistics.vertexCount}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Edges:</strong> {statistics.edgeCount}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Vertex Types:
                  </Typography>
                  {Object.entries(statistics.vertexTypes).map(([type, count]) => (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={type} size="small" />
                      <Typography variant="body2">{String(count)}</Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Edge Types:
                  </Typography>
                  {Object.entries(statistics.edgeTypes).map(([type, count]) => (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={type} size="small" />
                      <Typography variant="body2">{String(count)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Node Dialog */}
      <Dialog open={addNodeDialog} onClose={() => setAddNodeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Node</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Label"
            fullWidth
            variant="outlined"
            value={newNode.label}
            onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newNode.type}
              label="Type"
              onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
            >
              <MenuItem value="immigration_case">Immigration Case</MenuItem>
              <MenuItem value="applicant">Applicant</MenuItem>
              <MenuItem value="petitioner">Petitioner</MenuItem>
              <MenuItem value="beneficiary">Beneficiary</MenuItem>
              <MenuItem value="legal_representative">Legal Representative</MenuItem>
              <MenuItem value="document">Document</MenuItem>
              <MenuItem value="uscis_system">USCIS System</MenuItem>
              <MenuItem value="workflow_step">Workflow Step</MenuItem>
              <MenuItem value="uscis_personnel">USCIS Personnel</MenuItem>
              <MenuItem value="policy_rule">Policy Rule</MenuItem>
              <MenuItem value="analytics_model">Analytics Model</MenuItem>
              <MenuItem value="trend_pattern">Trend Pattern</MenuItem>
              <MenuItem value="anomaly_detection">Anomaly Detection</MenuItem>
              <MenuItem value="data_source">Data Source</MenuItem>
              <MenuItem value="data_transformation">Data Transformation</MenuItem>
              <MenuItem value="audit_trail">Audit Trail</MenuItem>
              <MenuItem value="quality_control">Quality Control</MenuItem>
              <MenuItem value="access_role">Access Role</MenuItem>
              <MenuItem value="access_permission">Access Permission</MenuItem>
              <MenuItem value="access_session">Access Session</MenuItem>
              <MenuItem value="compliance_review">Compliance Review</MenuItem>
              <MenuItem value="master_entity">Master Entity</MenuItem>
              <MenuItem value="reference_data">Reference Data</MenuItem>
              <MenuItem value="data_standard">Data Standard</MenuItem>
              <MenuItem value="data_mapping">Data Mapping</MenuItem>
              <MenuItem value="governance_policy">Governance Policy</MenuItem>
              <MenuItem value="metadata_element">Metadata Element</MenuItem>
              <MenuItem value="impact_analysis">Impact Analysis</MenuItem>
              <MenuItem value="governance_automation">Governance Automation</MenuItem>
              <MenuItem value="policy_violation">Policy Violation</MenuItem>
              <MenuItem value="geographic_location">Geographic Location</MenuItem>
              <MenuItem value="spatial_analysis">Spatial Analysis</MenuItem>
              <MenuItem value="geospatial_service">Geospatial Service</MenuItem>
              <MenuItem value="data_asset">Data Asset</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="process">Process</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="database">Database</MenuItem>
              <MenuItem value="table">Table</MenuItem>
              <MenuItem value="application">Application</MenuItem>
              <MenuItem value="service">Service</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddNodeDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNode} variant="contained">Add Node</Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Query Dialog */}
      <Dialog open={queryDialog} onClose={() => setQueryDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search />
          Gremlin Query Console
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sample USCIS DSSS3 Queries:
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              💡 Use "Execute & Visualize" to show query results in the graph visualization
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCustomQuery("g.V().hasLabel('immigration_case').limit(5).valueMap(true)")}
                title="Shows immigration cases in both console and graph (with Execute & Visualize)"
              >
                Immigration Cases
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCustomQuery("g.V().hasLabel('applicant').limit(5).valueMap(true)")}
                title="Shows applicants in both console and graph (with Execute & Visualize)"
              >
                Applicants
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCustomQuery("g.V().hasLabel('workflow_step').limit(5).valueMap(true)")}
                title="Shows workflow steps in both console and graph (with Execute & Visualize)"
              >
                Workflow Steps
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCustomQuery("g.V().hasLabel('geographic_location').has('location_type', 'USCIS Office').valueMap(true)")}
                title="Shows USCIS offices in both console and graph (with Execute & Visualize)"
              >
                USCIS Offices
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCustomQuery("g.V().hasLabel('policy_rule').out('affects').groupCount().by(label)")}
                title="Shows policy impact counts (console only - aggregation results)"
              >
                Policy Impact Count
              </Button>
            </Box>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="Gremlin Query"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="g.V().limit(10).valueMap(true)"
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input': {
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '14px'
              }
            }}
            helperText="Enter Gremlin traversal query. Use .valueMap(true) to get all properties."
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Common Patterns:</strong><br/>
              • <code>g.V().hasLabel('type')</code> - Find vertices by type<br/>
              • <code>g.V('id').out('relationship')</code> - Follow outgoing edges<br/>
              • <code>g.V().has('property', 'value')</code> - Filter by property<br/>
              • <code>g.V().groupCount().by(label)</code> - Count by vertex type
            </Typography>
          </Box>

          {queryResult && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info />
                Query Result ({queryResult.metadata?.resultCount || 'Unknown'} items) - {queryResult.metadata?.queryType}
              </Typography>
              
              {queryResult.metadata && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Executed:</strong> {new Date(queryResult.metadata.timestamp).toLocaleString()} | 
                    <strong> Type:</strong> {queryResult.metadata.queryType} | 
                    <strong> Results:</strong> {queryResult.metadata.resultCount}
                  </Typography>
                </Box>
              )}

              <Paper sx={{ 
                p: 2, 
                bgcolor: '#f8f9fa', 
                maxHeight: 400, 
                overflow: 'auto',
                border: '1px solid #e0e0e0'
              }}>
                <pre style={{ 
                  margin: 0, 
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {JSON.stringify(queryResult.data, null, 2)}
                </pre>
              </Paper>

              {queryResult.data && Array.isArray(queryResult.data) && queryResult.data.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #c3ddfd' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>💡 Tip:</strong> {queryResult.data.length > 10 ? 
                      'Large result set - consider using .limit() to reduce results' :
                      'Use .valueMap(true) to see all vertex properties, or .path() to see traversal paths'
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => {
              setCustomQuery('');
              setQueryResult(null);
            }}
            disabled={loading}
          >
            Clear
          </Button>
          <Button onClick={() => setQueryDialog(false)}>Close</Button>
          <Button 
            onClick={handleExecuteQuery} 
            variant="outlined" 
            disabled={loading || !customQuery.trim()}
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </Button>
          <Button 
            onClick={handleExecuteAndVisualize} 
            variant="contained" 
            disabled={loading || !customQuery.trim()}
            sx={{
              backgroundColor: '#003366',
              '&:hover': {
                backgroundColor: '#001a33'
              }
            }}
          >
            {loading ? 'Loading...' : 'Execute & Visualize'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JanusGraphVisualization;

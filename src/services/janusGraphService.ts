import api from './api';

// TypeScript interfaces for JanusGraph data structures
export interface GraphVertex {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphVertex[];
  edges: GraphEdge[];
}

export interface GraphResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface GraphMetadata {
  nodeCount: number;
  edgeCount: number;
  limit: number;
}

export interface ConnectionStatus {
  connected: boolean;
  mockMode: boolean;
  gremlinUrl: string;
  healthy?: boolean;
  timestamp: string;
  error?: string;
}

export interface QueryRequest {
  query: string;
  bindings?: Record<string, any>;
}

export interface VertexRequest {
  label: string;
  properties?: Record<string, any>;
}

export interface EdgeRequest {
  fromVertexId: string;
  toVertexId: string;
  label: string;
  properties?: Record<string, any>;
}

class JanusGraphService {
  private baseURL = '/janusgraph';

  /**
   * Get JanusGraph connection status
   */
  async getStatus(): Promise<ConnectionStatus> {
    try {
      const response = await api.get<GraphResponse<ConnectionStatus>>(`${this.baseURL}/status`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching JanusGraph status:', error);
      throw new Error('Failed to fetch JanusGraph status');
    }
  }

  /**
   * Get all vertices from the graph
   */
  async getVertices(): Promise<GraphVertex[]> {
    try {
      const response = await api.get<GraphResponse<GraphVertex[]>>(`${this.baseURL}/vertices`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching vertices:', error);
      throw new Error('Failed to fetch vertices');
    }
  }

  /**
   * Get all edges from the graph
   */
  async getEdges(): Promise<GraphEdge[]> {
    try {
      const response = await api.get<GraphResponse<GraphEdge[]>>(`${this.baseURL}/edges`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching edges:', error);
      throw new Error('Failed to fetch edges');
    }
  }

  /**
   * Get complete graph data for visualization
   */
  async getGraphData(limit: number = 50): Promise<{ data: GraphData; metadata: GraphMetadata }> {
    try {
      const response = await api.get<GraphResponse<GraphData> & { metadata: GraphMetadata }>(
        `${this.baseURL}/graph?limit=${limit}`
      );
      return {
        data: response.data.data,
        metadata: response.data.metadata
      };
    } catch (error) {
      console.error('Error fetching graph data:', error);
      throw new Error('Failed to fetch graph data');
    }
  }

  /**
   * Create a new vertex
   */
  async createVertex(vertexData: VertexRequest): Promise<GraphVertex> {
    try {
      const response = await api.post<GraphResponse<GraphVertex>>(`${this.baseURL}/vertex`, vertexData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating vertex:', error);
      throw new Error('Failed to create vertex');
    }
  }

  /**
   * Create a new edge
   */
  async createEdge(edgeData: EdgeRequest): Promise<GraphEdge> {
    try {
      const response = await api.post<GraphResponse<GraphEdge>>(`${this.baseURL}/edge`, edgeData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating edge:', error);
      throw new Error('Failed to create edge');
    }
  }

  /**
   * Execute a custom Gremlin query
   */
  async executeQuery(queryData: QueryRequest): Promise<any[]> {
    try {
      const response = await api.post<GraphResponse<any[]>>(`${this.baseURL}/query`, queryData);
      return response.data.data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Failed to execute query');
    }
  }

  /**
   * Get USCIS Immigration Case Relationship Network
   */
  async getImmigrationCaseNetwork(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for immigration case network specific nodes and edges
      const immigrationNodes = response.data.nodes.filter(node => 
        ['immigration_case', 'applicant', 'petitioner', 'beneficiary', 'legal_representative', 'document', 'uscis_system'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(immigrationNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const immigrationEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['filed_by', 'married_to', 'sibling_of', 'petitioned_by', 'benefits', 'represents', 'owns', 'holds', 'requires', 'processes', 'processed'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: immigrationNodes,
        edges: immigrationEdges
      };
    } catch (error) {
      console.error('Error fetching immigration case network:', error);
      throw new Error('Failed to fetch immigration case network');
    }
  }

  /**
   * Get USCIS Workflow and Case Management Network
   */
  async getWorkflowCaseManagement(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for workflow and case management specific nodes and edges
      const workflowNodes = response.data.nodes.filter(node => 
        ['immigration_case', 'workflow_step', 'uscis_personnel', 'uscis_system'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(workflowNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const workflowEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['precedes', 'currently_at', 'assigned_to', 'processes', 'processed'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: workflowNodes,
        edges: workflowEdges
      };
    } catch (error) {
      console.error('Error fetching workflow case management:', error);
      throw new Error('Failed to fetch workflow case management');
    }
  }

  /**
   * Get USCIS RNA Advanced Analytics Network
   */
  async getRNAAdvancedAnalytics(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for RNA analytics specific nodes and edges
      const rnaNodes = response.data.nodes.filter(node => 
        ['immigration_case', 'policy_rule', 'analytics_model', 'trend_pattern', 'anomaly_detection', 'legal_representative', 'workflow_step'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(rnaNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const rnaEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['affects', 'predicts', 'monitors', 'influences', 'impacts', 'detected_in', 'flagged', 'correlates_with', 'generated', 'filed_by', 'represents', 'precedes'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: rnaNodes,
        edges: rnaEdges
      };
    } catch (error) {
      console.error('Error fetching RNA advanced analytics:', error);
      throw new Error('Failed to fetch RNA advanced analytics');
    }
  }

  /**
   * Get USCIS Document and Data Lineage Network
   */
  async getDocumentDataLineage(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for document and data lineage specific nodes and edges
      const lineageNodes = response.data.nodes.filter(node => 
        ['document', 'data_source', 'data_transformation', 'audit_trail', 'quality_control', 'immigration_case', 'uscis_system', 'applicant'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(lineageNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const lineageEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['feeds_into', 'processed_by', 'flows_to', 'enriches', 'tracks', 'monitors', 'logs_activity', 'validates', 'supports_foia', 'background_check', 'owns', 'holds', 'requires'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: lineageNodes,
        edges: lineageEdges
      };
    } catch (error) {
      console.error('Error fetching document data lineage:', error);
      throw new Error('Failed to fetch document data lineage');
    }
  }

  /**
   * Get USCIS Personnel Roles and Access Network
   */
  async getPersonnelRolesAccess(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for personnel roles and access specific nodes and edges
      const accessNodes = response.data.nodes.filter(node => 
        ['uscis_personnel', 'access_role', 'access_permission', 'access_session', 'compliance_review', 'uscis_system', 'immigration_case'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(accessNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const accessEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['has_permission', 'assigned_role', 'performed_by', 'accessed_system', 'accessed_case', 'reviewed', 'reviewed_role', 'grants_access', 'assigned_to'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: accessNodes,
        edges: accessEdges
      };
    } catch (error) {
      console.error('Error fetching personnel roles access:', error);
      throw new Error('Failed to fetch personnel roles access');
    }
  }

  /**
   * Get USCIS Master Data Management Network
   */
  async getMasterDataManagement(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for master data management specific nodes and edges
      const masterNodes = response.data.nodes.filter(node => 
        ['master_entity', 'reference_data', 'data_standard', 'data_mapping', 'uscis_system', 'immigration_case', 'applicant'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(masterNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const masterEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['implemented_in', 'validates', 'categorizes', 'governs', 'maps_to', 'source_system', 'target_system', 'uses_reference'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: masterNodes,
        edges: masterEdges
      };
    } catch (error) {
      console.error('Error fetching master data management:', error);
      throw new Error('Failed to fetch master data management');
    }
  }

  /**
   * Get USCIS Automated Governance and Metadata Impact Analysis Network
   */
  async getAutomatedGovernance(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for automated governance and metadata specific nodes and edges
      const governanceNodes = response.data.nodes.filter(node => 
        ['governance_policy', 'metadata_element', 'impact_analysis', 'governance_automation', 'policy_violation', 'uscis_system', 'workflow_step', 'master_entity'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(governanceNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const governanceEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['enforced_in', 'describes', 'analyzes', 'triggered_by', 'classifies', 'enforces', 'violates', 'detected_in', 'governs', 'impacts'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: governanceNodes,
        edges: governanceEdges
      };
    } catch (error) {
      console.error('Error fetching automated governance:', error);
      throw new Error('Failed to fetch automated governance');
    }
  }

  /**
   * Get USCIS Geospatial Data and Interconnectedness Network
   */
  async getGeospatialData(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for geospatial specific nodes and edges
      const geospatialNodes = response.data.nodes.filter(node => 
        ['geographic_location', 'spatial_analysis', 'geospatial_service', 'immigration_case', 'applicant', 'uscis_personnel'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(geospatialNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const geospatialEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['processed_at', 'born_in', 'resides_in', 'analyzes', 'optimizes_routing_to', 'routed', 'migration_corridor', 'stationed_at'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: geospatialNodes,
        edges: geospatialEdges
      };
    } catch (error) {
      console.error('Error fetching geospatial data:', error);
      throw new Error('Failed to fetch geospatial data');
    }
  }

  /**
   * Get sample data lineage graph
   */
  async getDataLineageGraph(): Promise<GraphData> {
    try {
      // This could be a specific endpoint or a predefined query
      const response = await this.getGraphData(100);
      
      // Filter for data lineage specific nodes and edges
      const dataLineageNodes = response.data.nodes.filter(node => 
        ['data_asset', 'system', 'process', 'database', 'table'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(dataLineageNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const dataLineageEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['contains', 'processed_by', 'produces', 'flows_to', 'derived_from'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: dataLineageNodes,
        edges: dataLineageEdges
      };
    } catch (error) {
      console.error('Error fetching data lineage graph:', error);
      throw new Error('Failed to fetch data lineage graph');
    }
  }

  /**
   * Get network analysis graph
   */
  async getNetworkGraph(): Promise<GraphData> {
    try {
      const response = await this.getGraphData(100);
      
      // Filter for network/relationship specific nodes and edges
      const networkNodes = response.data.nodes.filter(node => 
        ['user', 'system', 'application', 'service'].includes(node.type)
      );
      
      // Get node IDs for validation
      const nodeIds = new Set(networkNodes.map(node => node.id));
      
      // Filter edges that have both source and target in the filtered nodes
      const networkEdges = response.data.edges.filter(edge => {
        const hasValidLabel = ['connects_to', 'uses', 'depends_on', 'communicates_with'].includes(edge.label);
        const hasValidNodes = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        return hasValidLabel && hasValidNodes;
      });

      return {
        nodes: networkNodes,
        edges: networkEdges
      };
    } catch (error) {
      console.error('Error fetching network graph:', error);
      throw new Error('Failed to fetch network graph');
    }
  }

  /**
   * Search vertices by property
   */
  async searchVertices(property: string, value: string): Promise<GraphVertex[]> {
    try {
      const query = `g.V().has('${property}', '${value}').valueMap(true)`;
      const results = await this.executeQuery({ query });
      
      return results.map(result => ({
        id: result.id,
        label: result.name?.[0] || result.title?.[0] || `Node ${result.id}`,
        type: result.type?.[0] || 'unknown',
        properties: result
      }));
    } catch (error) {
      console.error('Error searching vertices:', error);
      throw new Error('Failed to search vertices');
    }
  }

  /**
   * Get vertex neighbors
   */
  async getVertexNeighbors(vertexId: string): Promise<{ vertex: GraphVertex; neighbors: GraphVertex[]; edges: GraphEdge[] }> {
    try {
      // Get the vertex and its neighbors
      const vertexQuery = `g.V('${vertexId}').valueMap(true)`;
      const neighborsQuery = `g.V('${vertexId}').both().valueMap(true)`;
      const edgesQuery = `g.V('${vertexId}').bothE().valueMap(true)`;

      const [vertexResult, neighborsResult, edgesResult] = await Promise.all([
        this.executeQuery({ query: vertexQuery }),
        this.executeQuery({ query: neighborsQuery }),
        this.executeQuery({ query: edgesQuery })
      ]);

      const vertex = vertexResult[0] ? {
        id: vertexResult[0].id,
        label: vertexResult[0].name?.[0] || vertexResult[0].title?.[0] || `Node ${vertexResult[0].id}`,
        type: vertexResult[0].type?.[0] || 'unknown',
        properties: vertexResult[0]
      } : null;

      const neighbors = neighborsResult.map(result => ({
        id: result.id,
        label: result.name?.[0] || result.title?.[0] || `Node ${result.id}`,
        type: result.type?.[0] || 'unknown',
        properties: result
      }));

      const edges = edgesResult.map(result => ({
        id: result.id,
        source: result.outV,
        target: result.inV,
        label: result.label || 'connected',
        type: result.type?.[0] || 'relationship',
        properties: result
      }));

      return {
        vertex: vertex!,
        neighbors,
        edges
      };
    } catch (error) {
      console.error('Error fetching vertex neighbors:', error);
      throw new Error('Failed to fetch vertex neighbors');
    }
  }

  /**
   * Get graph statistics
   */
  async getGraphStatistics(): Promise<{
    vertexCount: number;
    edgeCount: number;
    vertexTypes: Record<string, number>;
    edgeTypes: Record<string, number>;
  }> {
    try {
      const [vertices, edges] = await Promise.all([
        this.getVertices(),
        this.getEdges()
      ]);

      const vertexTypes: Record<string, number> = {};
      const edgeTypes: Record<string, number> = {};

      vertices.forEach(vertex => {
        vertexTypes[vertex.type] = (vertexTypes[vertex.type] || 0) + 1;
      });

      edges.forEach(edge => {
        edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
      });

      return {
        vertexCount: vertices.length,
        edgeCount: edges.length,
        vertexTypes,
        edgeTypes
      };
    } catch (error) {
      console.error('Error fetching graph statistics:', error);
      throw new Error('Failed to fetch graph statistics');
    }
  }

  /**
   * Get Real-Time Impact Analysis for a specific entity
   */
  async getImpactAnalysis(entityId: string, depth: number = 3): Promise<any> {
    try {
      const response = await api.get<GraphResponse<any>>(
        `${this.baseURL}/impact-analysis/${entityId}?depth=${depth}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching impact analysis:', error);
      throw new Error('Failed to fetch impact analysis');
    }
  }

  /**
   * Get Advanced Fraud Detection analysis
   */
  async getFraudDetection(minRiskScore: number = 70): Promise<any> {
    try {
      const response = await api.get<GraphResponse<any>>(
        `${this.baseURL}/fraud-detection?minRiskScore=${minRiskScore}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching fraud detection:', error);
      throw new Error('Failed to fetch fraud detection');
    }
  }

  /**
   * Get Intelligent Case Routing analysis
   */
  async getIntelligentRouting(): Promise<any> {
    try {
      const response = await api.get<GraphResponse<any>>(
        `${this.baseURL}/intelligent-routing`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching intelligent routing:', error);
      throw new Error('Failed to fetch intelligent routing');
    }
  }

  /**
   * Get Predictive Analytics
   */
  async getPredictiveAnalytics(caseType: string = 'all'): Promise<any> {
    try {
      const response = await api.get<GraphResponse<any>>(
        `${this.baseURL}/predictive-analytics?caseType=${caseType}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching predictive analytics:', error);
      throw new Error('Failed to fetch predictive analytics');
    }
  }
}

export default new JanusGraphService();

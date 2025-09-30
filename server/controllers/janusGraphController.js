const gremlin = require('gremlin');

// JanusGraph/Gremlin connection configuration
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

class JanusGraphController {
  constructor() {
    // Initialize connection to JanusGraph/Gremlin server
    // Default configuration - can be overridden via environment variables
    this.gremlinUrl = process.env.GREMLIN_URL || 'ws://localhost:8182/gremlin';
    this.connection = null;
    this.graph = null;
    this.g = null;
    
    this.initializeConnection();
  }

  async initializeConnection() {
    try {
      // For development, always use mock mode since JanusGraph server is not running
      console.log('🔧 Using mock mode for JanusGraph (no server required)');
      this.createMockConnection();
    } catch (error) {
      console.error('❌ Failed to initialize JanusGraph connection:', error);
      // For development, we'll create a mock connection
      this.createMockConnection();
    }
  }

  createMockConnection() {
    console.log('🔧 Creating mock JanusGraph connection for development');
    this.mockMode = true;
  }

  // GET /api/v1/janusgraph/vertices - Get all vertices
  async getVertices(req, res) {
    try {
      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockVertices(),
          message: 'Mock data - JanusGraph not connected'
        });
      }

      const vertices = await this.g.V().limit(100).valueMap(true).toList();
      
      res.json({
        success: true,
        data: vertices,
        count: vertices.length
      });
    } catch (error) {
      console.error('Error fetching vertices:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch vertices',
        error: error.message
      });
    }
  }

  // GET /api/v1/janusgraph/edges - Get all edges
  async getEdges(req, res) {
    try {
      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockEdges(),
          message: 'Mock data - JanusGraph not connected'
        });
      }

      const edges = await this.g.E().limit(100).valueMap(true).toList();
      
      res.json({
        success: true,
        data: edges,
        count: edges.length
      });
    } catch (error) {
      console.error('Error fetching edges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch edges',
        error: error.message
      });
    }
  }

  // GET /api/v1/janusgraph/graph - Get complete graph data for visualization
  async getGraphData(req, res) {
    try {
      const { limit = 50 } = req.query;

      if (this.mockMode) {
        return res.json({
          success: true,
          data: {
            nodes: this.getMockVertices(),
            edges: this.getMockEdges()
          },
          message: 'Mock data - JanusGraph not connected'
        });
      }

      // Fetch vertices and edges in parallel
      const [vertices, edges] = await Promise.all([
        this.g.V().limit(parseInt(limit)).valueMap(true).toList(),
        this.g.E().limit(parseInt(limit)).valueMap(true).toList()
      ]);

      // Transform data for frontend visualization
      const nodes = vertices.map(vertex => ({
        id: vertex.id,
        label: vertex.name?.[0] || vertex.title?.[0] || `Node ${vertex.id}`,
        type: vertex.type?.[0] || 'unknown',
        properties: vertex
      }));

      const links = edges.map(edge => ({
        id: edge.id,
        source: edge.outV,
        target: edge.inV,
        label: edge.label || 'connected',
        type: edge.type?.[0] || 'relationship',
        properties: edge
      }));

      res.json({
        success: true,
        data: {
          nodes,
          edges: links
        },
        metadata: {
          nodeCount: nodes.length,
          edgeCount: links.length,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch graph data',
        error: error.message
      });
    }
  }

  // POST /api/v1/janusgraph/vertex - Create a new vertex
  async createVertex(req, res) {
    try {
      const { label, properties = {} } = req.body;

      if (!label) {
        return res.status(400).json({
          success: false,
          message: 'Vertex label is required'
        });
      }

      if (this.mockMode) {
        const mockVertex = {
          id: Date.now(),
          label,
          ...properties
        };
        
        return res.json({
          success: true,
          data: mockVertex,
          message: 'Mock vertex created - JanusGraph not connected'
        });
      }

      // Create vertex with properties
      let traversal = this.g.addV(label);
      
      // Add properties
      Object.entries(properties).forEach(([key, value]) => {
        traversal = traversal.property(key, value);
      });

      const vertex = await traversal.next();

      res.status(201).json({
        success: true,
        data: vertex.value,
        message: 'Vertex created successfully'
      });
    } catch (error) {
      console.error('Error creating vertex:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create vertex',
        error: error.message
      });
    }
  }

  // POST /api/v1/janusgraph/edge - Create a new edge
  async createEdge(req, res) {
    try {
      const { fromVertexId, toVertexId, label, properties = {} } = req.body;

      if (!fromVertexId || !toVertexId || !label) {
        return res.status(400).json({
          success: false,
          message: 'From vertex ID, to vertex ID, and edge label are required'
        });
      }

      if (this.mockMode) {
        const mockEdge = {
          id: Date.now(),
          source: fromVertexId,
          target: toVertexId,
          label,
          ...properties
        };
        
        return res.json({
          success: true,
          data: mockEdge,
          message: 'Mock edge created - JanusGraph not connected'
        });
      }

      // Create edge between vertices
      let traversal = this.g.V(fromVertexId).addE(label).to(this.g.V(toVertexId));
      
      // Add properties
      Object.entries(properties).forEach(([key, value]) => {
        traversal = traversal.property(key, value);
      });

      const edge = await traversal.next();

      res.status(201).json({
        success: true,
        data: edge.value,
        message: 'Edge created successfully'
      });
    } catch (error) {
      console.error('Error creating edge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create edge',
        error: error.message
      });
    }
  }

  // POST /api/v1/janusgraph/query - Execute custom Gremlin query
  async executeQuery(req, res) {
    try {
      const { query, bindings = {} } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Gremlin query is required'
        });
      }

      // Validate query for basic security
      const dangerousPatterns = [
        /drop\s*\(/i,
        /delete\s*\(/i,
        /system\s*\(/i,
        /exec\s*\(/i,
        /eval\s*\(/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(query)) {
          return res.status(400).json({
            success: false,
            message: 'Query contains potentially dangerous operations',
            query
          });
        }
      }

      if (this.mockMode) {
        // Enhanced mock responses based on query patterns
        let mockResult = [];
        
        if (query.includes("hasLabel('immigration_case')")) {
          mockResult = [
            { id: 'case-n400-001', label: 'immigration_case', form_type: ['N-400'], status: ['Under Review'] },
            { id: 'case-i485-002', label: 'immigration_case', form_type: ['I-485'], status: ['Interview Scheduled'] }
          ];
        } else if (query.includes("hasLabel('applicant')")) {
          mockResult = [
            { id: 'applicant-001', label: 'applicant', name: ['John Doe'], country_of_birth: ['Mexico'] },
            { id: 'applicant-002', label: 'applicant', name: ['Jane Smith'], country_of_birth: ['Canada'] }
          ];
        } else if (query.includes("hasLabel('workflow_step')")) {
          mockResult = [
            { id: 'workflow-step-1', label: 'workflow_step', step_name: ['Initial Review'], step_type: ['Review'] },
            { id: 'workflow-step-2', label: 'workflow_step', step_name: ['Document Verification'], step_type: ['Verification'] }
          ];
        } else if (query.includes("hasLabel('geographic_location')")) {
          mockResult = [
            { id: 'location-1', label: 'geographic_location', location_name: ['USCIS National Benefits Center'], location_type: ['USCIS Office'] },
            { id: 'location-2', label: 'geographic_location', location_name: ['USCIS Texas Service Center'], location_type: ['USCIS Office'] }
          ];
        } else if (query.includes("groupCount()")) {
          mockResult = {
            'immigration_case': 2,
            'applicant': 2,
            'workflow_step': 5,
            'geographic_location': 4,
            'policy_rule': 2
          };
        } else if (query.includes("path()")) {
          mockResult = [
            { objects: [{ id: 'applicant-001', label: 'applicant' }, { id: 'case-n400-001', label: 'immigration_case' }] },
            { objects: [{ id: 'applicant-002', label: 'applicant' }, { id: 'case-i485-002', label: 'immigration_case' }] }
          ];
        } else {
          // Default mock result for general queries
          mockResult = [
            { id: 'mock-vertex-1', label: 'sample', property: 'Mock data - JanusGraph not connected' },
            { id: 'mock-vertex-2', label: 'sample', property: 'Use sample queries for realistic results' }
          ];
        }

        return res.json({
          success: true,
          data: mockResult,
          message: 'Mock query result - JanusGraph not connected',
          query,
          resultCount: Array.isArray(mockResult) ? mockResult.length : Object.keys(mockResult).length,
          executionTime: '~5ms (mock)'
        });
      }

      // Execute custom Gremlin query with timing
      const startTime = Date.now();
      const result = await this.g.inject(query).toList();
      const executionTime = Date.now() - startTime;

      res.json({
        success: true,
        data: result,
        query,
        resultCount: result.length,
        executionTime: `${executionTime}ms`
      });
    } catch (error) {
      console.error('Error executing query:', error);
      
      // Enhanced error messages for common Gremlin issues
      let userFriendlyMessage = 'Failed to execute query';
      
      if (error.message.includes('syntax')) {
        userFriendlyMessage = 'Gremlin syntax error - check your query syntax';
      } else if (error.message.includes('property')) {
        userFriendlyMessage = 'Property not found - check property names and types';
      } else if (error.message.includes('label')) {
        userFriendlyMessage = 'Label not found - check vertex/edge labels';
      } else if (error.message.includes('timeout')) {
        userFriendlyMessage = 'Query timeout - try limiting results with .limit()';
      }

      res.status(500).json({
        success: false,
        message: userFriendlyMessage,
        error: error.message,
        query: req.body.query,
        suggestion: 'Try using .limit(10) to reduce result size, or check the sample queries for examples'
      });
    }
  }

  // GET /api/v1/janusgraph/status - Get connection status
  async getStatus(req, res) {
    try {
      const status = {
        connected: !this.mockMode,
        mockMode: this.mockMode,
        gremlinUrl: this.gremlinUrl,
        timestamp: new Date().toISOString()
      };

      if (!this.mockMode) {
        // Test connection with a simple query
        try {
          await this.g.V().limit(1).toList();
          status.healthy = true;
        } catch (error) {
          status.healthy = false;
          status.error = error.message;
        }
      }

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get status',
        error: error.message
      });
    }
  }

  // Mock data for development - USCIS Immigration Case Relationship Networks
  getMockVertices() {
    return [
      // Immigration Cases
      {
        id: 'case-n400-001',
        label: 'N-400 Naturalization Case',
        type: 'immigration_case',
        form_type: 'N-400',
        receipt_number: 'MSC2190012345',
        status: 'Under Review',
        priority: 'Standard',
        filing_date: '2024-01-15',
        service_center: 'NBC'
      },
      {
        id: 'case-i485-002',
        label: 'I-485 Adjustment of Status',
        type: 'immigration_case',
        form_type: 'I-485',
        receipt_number: 'MSC2190067890',
        status: 'Interview Scheduled',
        priority: 'Standard',
        filing_date: '2024-02-20',
        service_center: 'NBC'
      },
      {
        id: 'case-i130-003',
        label: 'I-130 Family Petition',
        type: 'immigration_case',
        form_type: 'I-130',
        receipt_number: 'MSC2190054321',
        status: 'Approved',
        priority: 'Standard',
        filing_date: '2023-11-10',
        service_center: 'NBC'
      },
      
      // Applicants/Petitioners
      {
        id: 'applicant-001',
        label: 'Maria Rodriguez',
        type: 'applicant',
        alien_number: 'A123456789',
        country_of_birth: 'Mexico',
        date_of_birth: '1985-03-15',
        current_status: 'Lawful Permanent Resident',
        address_state: 'CA'
      },
      {
        id: 'petitioner-001',
        label: 'John Smith',
        type: 'petitioner',
        citizenship_status: 'US Citizen',
        relationship_to_beneficiary: 'Spouse',
        date_of_birth: '1982-07-22',
        address_state: 'CA'
      },
      {
        id: 'beneficiary-001',
        label: 'Carlos Rodriguez',
        type: 'beneficiary',
        alien_number: 'A987654321',
        country_of_birth: 'Mexico',
        relationship_to_petitioner: 'Brother',
        current_location: 'Mexico'
      },
      
      // Legal Representatives
      {
        id: 'attorney-001',
        label: 'Immigration Law Firm LLC',
        type: 'legal_representative',
        bar_number: 'CA12345',
        attorney_name: 'Sarah Johnson, Esq.',
        firm_name: 'Immigration Law Firm LLC',
        state_licensed: 'CA',
        specialization: 'Family Immigration'
      },
      
      // Documents
      {
        id: 'doc-passport-001',
        label: 'Mexican Passport',
        type: 'document',
        document_type: 'Passport',
        issuing_country: 'Mexico',
        document_number: 'G12345678',
        expiration_date: '2026-05-15',
        status: 'Valid'
      },
      {
        id: 'doc-greencard-001',
        label: 'Permanent Resident Card',
        type: 'document',
        document_type: 'Green Card',
        card_number: 'MSC1234567890',
        expiration_date: '2025-12-31',
        status: 'Valid'
      },
      
      // USCIS Systems
      {
        id: 'system-cris',
        label: 'CRIS (Customer Relations Interface System)',
        type: 'uscis_system',
        system_type: 'Case Management',
        environment: 'Production',
        primary_function: 'Case Processing'
      },
      {
        id: 'system-claims3',
        label: 'CLAIMS 3',
        type: 'uscis_system',
        system_type: 'Benefits Processing',
        environment: 'Production',
        primary_function: 'Immigration Benefits'
      },
      
      // Workflow Steps
      {
        id: 'workflow-step-1',
        label: 'Initial Review',
        type: 'workflow_step',
        step_type: 'Review',
        estimated_duration: '2 hours',
        required_role: 'Immigration Officer',
        automation_level: 'Manual',
        sla_target: '24 hours'
      },
      {
        id: 'workflow-step-2',
        label: 'Document Verification',
        type: 'workflow_step',
        step_type: 'Verification',
        estimated_duration: '4 hours',
        required_role: 'Document Specialist',
        automation_level: 'Semi-Automated',
        sla_target: '48 hours'
      },
      {
        id: 'workflow-step-3',
        label: 'Background Check',
        type: 'workflow_step',
        step_type: 'Security',
        estimated_duration: '72 hours',
        required_role: 'Security Analyst',
        automation_level: 'Automated',
        sla_target: '5 business days'
      },
      {
        id: 'workflow-step-4',
        label: 'Adjudication Decision',
        type: 'workflow_step',
        step_type: 'Decision',
        estimated_duration: '1 hour',
        required_role: 'Adjudicating Officer',
        automation_level: 'Manual',
        sla_target: '2 hours'
      },
      {
        id: 'workflow-step-5',
        label: 'Quality Assurance',
        type: 'workflow_step',
        step_type: 'QA',
        estimated_duration: '30 minutes',
        required_role: 'QA Specialist',
        automation_level: 'Semi-Automated',
        sla_target: '4 hours'
      },
      
      // USCIS Personnel/Roles
      {
        id: 'officer-001',
        label: 'Sarah Johnson - Immigration Officer',
        type: 'uscis_personnel',
        role: 'Immigration Officer',
        experience_years: 8,
        current_caseload: 45,
        max_capacity: 60,
        office_location: 'NBC',
        specialization: 'Naturalization'
      },
      {
        id: 'specialist-001',
        label: 'Michael Chen - Document Specialist',
        type: 'uscis_personnel',
        role: 'Document Specialist',
        experience_years: 5,
        current_caseload: 32,
        max_capacity: 40,
        office_location: 'NBC',
        specialization: 'Document Authentication'
      },
      {
        id: 'analyst-001',
        label: 'David Rodriguez - Security Analyst',
        type: 'uscis_personnel',
        role: 'Security Analyst',
        experience_years: 12,
        current_caseload: 28,
        max_capacity: 35,
        office_location: 'NBC',
        specialization: 'Background Investigations'
      },
      
      // RNA Analytics Entities
      {
        id: 'policy-001',
        label: 'Public Charge Rule Update 2024',
        type: 'policy_rule',
        policy_type: 'Immigration Policy',
        effective_date: '2024-01-15',
        impact_level: 'High',
        affected_forms: ['I-485', 'I-129', 'I-539'],
        status: 'Active',
        compliance_rate: 87.5
      },
      {
        id: 'policy-002',
        label: 'H-1B Cap Processing Changes',
        type: 'policy_rule',
        policy_type: 'Employment Authorization',
        effective_date: '2024-04-01',
        impact_level: 'Medium',
        affected_forms: ['I-129', 'I-765'],
        status: 'Active',
        compliance_rate: 94.2
      },
      {
        id: 'analytics-model-1',
        label: 'Case Processing Time Predictor',
        type: 'analytics_model',
        model_type: 'Predictive Analytics',
        algorithm: 'Random Forest',
        accuracy: 92.3,
        last_trained: '2024-09-15',
        status: 'Production',
        prediction_horizon: '30 days'
      },
      {
        id: 'analytics-model-2',
        label: 'Fraud Detection Network',
        type: 'analytics_model',
        model_type: 'Anomaly Detection',
        algorithm: 'Graph Neural Network',
        accuracy: 89.7,
        last_trained: '2024-09-20',
        status: 'Production',
        detection_threshold: 0.75
      },
      {
        id: 'trend-001',
        label: 'Naturalization Application Surge',
        type: 'trend_pattern',
        pattern_type: 'Volume Increase',
        detection_date: '2024-09-01',
        confidence_score: 95.8,
        trend_direction: 'Increasing',
        impact_assessment: 'Capacity Planning Required',
        affected_offices: ['NBC', 'TSC', 'VSC']
      },
      {
        id: 'anomaly-001',
        label: 'Unusual Attorney Representation Pattern',
        type: 'anomaly_detection',
        anomaly_type: 'Relationship Pattern',
        detection_date: '2024-09-25',
        severity: 'Medium',
        confidence_score: 78.4,
        investigation_status: 'Under Review',
        affected_cases: 23
      },
      
      // Document and Data Lineage Entities
      {
        id: 'data-source-1',
        label: 'Department of State Visa Database',
        type: 'data_source',
        source_type: 'External System',
        agency: 'Department of State',
        data_classification: 'Sensitive',
        update_frequency: 'Real-time',
        reliability_score: 98.5,
        last_sync: '2024-09-29T10:30:00Z'
      },
      {
        id: 'data-source-2',
        label: 'FBI Background Check System',
        type: 'data_source',
        source_type: 'External System',
        agency: 'Federal Bureau of Investigation',
        data_classification: 'Classified',
        update_frequency: 'Daily',
        reliability_score: 99.2,
        last_sync: '2024-09-29T02:00:00Z'
      },
      {
        id: 'data-source-3',
        label: 'Social Security Administration',
        type: 'data_source',
        source_type: 'External System',
        agency: 'Social Security Administration',
        data_classification: 'Sensitive',
        update_frequency: 'Weekly',
        reliability_score: 97.8,
        last_sync: '2024-09-28T18:00:00Z'
      },
      {
        id: 'transformation-1',
        label: 'Document OCR Processing',
        type: 'data_transformation',
        transformation_type: 'OCR Extraction',
        input_format: 'PDF/Image',
        output_format: 'Structured JSON',
        accuracy_rate: 94.7,
        processing_time: '2.3 seconds avg',
        last_run: '2024-09-29T11:45:00Z'
      },
      {
        id: 'transformation-2',
        label: 'Name Standardization',
        type: 'data_transformation',
        transformation_type: 'Data Cleansing',
        input_format: 'Raw Text',
        output_format: 'Standardized Names',
        accuracy_rate: 98.1,
        processing_time: '0.5 seconds avg',
        last_run: '2024-09-29T11:50:00Z'
      },
      {
        id: 'audit-trail-1',
        label: 'Document Access Log - Case N400-001',
        type: 'audit_trail',
        trail_type: 'Document Access',
        event_count: 47,
        date_range: '2024-01-15 to 2024-09-29',
        compliance_status: 'Compliant',
        retention_period: '7 years',
        foia_ready: true
      },
      {
        id: 'quality-check-1',
        label: 'Document Completeness Validator',
        type: 'quality_control',
        check_type: 'Completeness Validation',
        pass_rate: 91.3,
        total_checks: 15847,
        failed_checks: 1379,
        last_execution: '2024-09-29T12:00:00Z',
        remediation_required: true
      },
      
      // Personnel Roles and Access Entities
      {
        id: 'role-001',
        label: 'Immigration Services Officer',
        type: 'access_role',
        role_level: 'GS-13',
        clearance_level: 'Secret',
        permissions_count: 47,
        active_users: 156,
        last_review: '2024-06-15',
        review_frequency: 'Annual'
      },
      {
        id: 'role-002',
        label: 'Supervisory Immigration Officer',
        type: 'access_role',
        role_level: 'GS-14',
        clearance_level: 'Secret',
        permissions_count: 73,
        active_users: 28,
        last_review: '2024-06-15',
        review_frequency: 'Annual'
      },
      {
        id: 'role-003',
        label: 'Administrative Assistant',
        type: 'access_role',
        role_level: 'GS-7',
        clearance_level: 'Public Trust',
        permissions_count: 12,
        active_users: 89,
        last_review: '2024-06-15',
        review_frequency: 'Annual'
      },
      {
        id: 'permission-001',
        label: 'Case File Access - Read',
        type: 'access_permission',
        permission_type: 'Data Access',
        risk_level: 'Medium',
        systems_granted: ['CRIS', 'CLAIMS3'],
        users_with_access: 184,
        compliance_required: true
      },
      {
        id: 'permission-002',
        label: 'Case Decision Authority',
        type: 'access_permission',
        permission_type: 'Functional Authority',
        risk_level: 'High',
        systems_granted: ['CRIS', 'CLAIMS3'],
        users_with_access: 28,
        compliance_required: true
      },
      {
        id: 'permission-003',
        label: 'Document Upload/Modify',
        type: 'access_permission',
        permission_type: 'Data Modification',
        risk_level: 'High',
        systems_granted: ['CRIS'],
        users_with_access: 156,
        compliance_required: true
      },
      {
        id: 'access-session-1',
        label: 'Officer Johnson Session - 2024-09-29',
        type: 'access_session',
        session_type: 'Interactive Login',
        start_time: '2024-09-29T08:30:00Z',
        end_time: '2024-09-29T17:15:00Z',
        systems_accessed: ['CRIS', 'CLAIMS3'],
        actions_performed: 47,
        anomaly_score: 0.12
      },
      {
        id: 'compliance-check-1',
        label: 'Q3 2024 Access Review',
        type: 'compliance_review',
        review_type: 'Quarterly Access Review',
        review_date: '2024-09-15',
        users_reviewed: 273,
        violations_found: 3,
        remediation_complete: true,
        next_review: '2024-12-15'
      },
      
      // Master Data Management Entities
      {
        id: 'master-entity-1',
        label: 'Person Master Data Model',
        type: 'master_entity',
        entity_type: 'Person',
        version: '2.1.0',
        attributes_count: 47,
        systems_using: ['CRIS', 'CLAIMS3', 'ELIS'],
        data_steward: 'Data Architecture Team',
        last_updated: '2024-08-15'
      },
      {
        id: 'master-entity-2',
        label: 'Case Master Data Model',
        type: 'master_entity',
        entity_type: 'Case',
        version: '3.0.2',
        attributes_count: 89,
        systems_using: ['CRIS', 'CLAIMS3'],
        data_steward: 'Business Analysis Team',
        last_updated: '2024-09-01'
      },
      {
        id: 'reference-data-1',
        label: 'Country Codes (ISO 3166)',
        type: 'reference_data',
        data_type: 'Country Codes',
        standard: 'ISO 3166-1 Alpha-3',
        record_count: 249,
        update_frequency: 'Quarterly',
        authoritative_source: 'ISO Organization',
        last_sync: '2024-07-01'
      },
      {
        id: 'reference-data-2',
        label: 'USCIS Form Types',
        type: 'reference_data',
        data_type: 'Form Codes',
        standard: 'USCIS Internal',
        record_count: 127,
        update_frequency: 'As Needed',
        authoritative_source: 'USCIS Policy Office',
        last_sync: '2024-09-15'
      },
      {
        id: 'data-standard-1',
        label: 'NIEM Justice Domain',
        type: 'data_standard',
        standard_type: 'Data Exchange',
        version: '5.2',
        compliance_level: 'Mandatory',
        adoption_rate: 87.3,
        systems_compliant: ['CRIS', 'CLAIMS3'],
        certification_date: '2024-06-01'
      },
      {
        id: 'data-standard-2',
        label: 'Federal Data Strategy',
        type: 'data_standard',
        standard_type: 'Data Governance',
        version: '2024.1',
        compliance_level: 'Required',
        adoption_rate: 94.1,
        systems_compliant: ['CRIS', 'CLAIMS3', 'ELIS'],
        certification_date: '2024-01-15'
      },
      {
        id: 'data-mapping-1',
        label: 'CRIS to CLAIMS3 Person Mapping',
        type: 'data_mapping',
        mapping_type: 'System Integration',
        source_system: 'CRIS',
        target_system: 'CLAIMS3',
        field_mappings: 47,
        transformation_rules: 12,
        accuracy_rate: 98.7,
        last_validated: '2024-09-20'
      },
      
      // Automated Governance and Metadata Impact Analysis Entities
      {
        id: 'governance-policy-1',
        label: 'Data Retention Policy - Immigration Records',
        type: 'governance_policy',
        policy_type: 'Data Retention',
        enforcement_level: 'Automated',
        compliance_rate: 96.8,
        affected_systems: ['CRIS', 'CLAIMS3', 'ELIS'],
        last_updated: '2024-07-01',
        next_review: '2025-07-01'
      },
      {
        id: 'governance-policy-2',
        label: 'PII Data Classification Policy',
        type: 'governance_policy',
        policy_type: 'Data Classification',
        enforcement_level: 'Semi-Automated',
        compliance_rate: 94.2,
        affected_systems: ['CRIS', 'CLAIMS3'],
        last_updated: '2024-06-15',
        next_review: '2025-06-15'
      },
      {
        id: 'metadata-element-1',
        label: 'Person.SSN Metadata',
        type: 'metadata_element',
        element_type: 'Data Field',
        classification: 'PII - Sensitive',
        usage_count: 47,
        dependent_processes: 23,
        last_modified: '2024-08-15',
        impact_score: 9.2
      },
      {
        id: 'metadata-element-2',
        label: 'Case.Status Metadata',
        type: 'metadata_element',
        element_type: 'Data Field',
        classification: 'Business Critical',
        usage_count: 156,
        dependent_processes: 89,
        last_modified: '2024-09-01',
        impact_score: 8.7
      },
      {
        id: 'impact-analysis-1',
        label: 'SSN Field Classification Change Impact',
        type: 'impact_analysis',
        analysis_type: 'Metadata Change',
        trigger_event: 'Classification Update',
        affected_systems: 3,
        affected_processes: 23,
        risk_level: 'High',
        analysis_date: '2024-08-15'
      },
      {
        id: 'governance-automation-1',
        label: 'Automated PII Detection Engine',
        type: 'governance_automation',
        automation_type: 'Data Classification',
        detection_accuracy: 97.3,
        false_positive_rate: 2.1,
        processing_volume: '50K records/day',
        last_execution: '2024-09-29T12:00:00Z'
      },
      {
        id: 'policy-violation-1',
        label: 'Retention Policy Violation - Case Files',
        type: 'policy_violation',
        violation_type: 'Data Retention',
        severity: 'Medium',
        affected_records: 1247,
        detection_date: '2024-09-25',
        remediation_status: 'In Progress',
        expected_resolution: '2024-10-05'
      },
      
      // Geospatial Data and Interconnectedness Entities
      {
        id: 'location-1',
        label: 'USCIS National Benefits Center',
        type: 'geographic_location',
        location_type: 'USCIS Office',
        address: '13247 Reed Road, Lee\'s Summit, MO 64064',
        coordinates: {
          latitude: 38.9108,
          longitude: -94.3822
        },
        service_area: 'National',
        capacity: 2500,
        current_caseload: 2247
      },
      {
        id: 'location-2',
        label: 'USCIS Texas Service Center',
        type: 'geographic_location',
        location_type: 'USCIS Office',
        address: '2501 S State Hwy 121 Business, Lewisville, TX 75067',
        coordinates: {
          latitude: 33.0463,
          longitude: -96.9942
        },
        service_area: 'South Central US',
        capacity: 1800,
        current_caseload: 1654
      },
      {
        id: 'location-3',
        label: 'Mexico City, Mexico',
        type: 'geographic_location',
        location_type: 'International City',
        address: 'Mexico City, Mexico',
        coordinates: {
          latitude: 19.4326,
          longitude: -99.1332
        },
        country_code: 'MEX',
        population: 9200000,
        immigration_volume: 'High'
      },
      {
        id: 'location-4',
        label: 'Los Angeles, CA',
        type: 'geographic_location',
        location_type: 'US City',
        address: 'Los Angeles, California, USA',
        coordinates: {
          latitude: 34.0522,
          longitude: -118.2437
        },
        state_code: 'CA',
        population: 3900000,
        immigration_volume: 'Very High'
      },
      {
        id: 'spatial-analysis-1',
        label: 'Southwest Border Immigration Patterns',
        type: 'spatial_analysis',
        analysis_type: 'Migration Pattern',
        geographic_scope: 'US-Mexico Border',
        time_period: 'FY 2024',
        case_volume: 45678,
        trend_direction: 'Increasing',
        confidence_level: 94.2
      },
      {
        id: 'geospatial-service-1',
        label: 'Distance-Based Case Routing',
        type: 'geospatial_service',
        service_type: 'Routing Optimization',
        coverage_area: 'Continental US',
        optimization_algorithm: 'Nearest Office',
        efficiency_gain: 23.7,
        implementation_date: '2024-06-01'
      }
    ];
  }

  getMockEdges() {
    return [
      // Case-Applicant Relationships
      {
        id: 'edge-case-applicant-1',
        source: 'case-n400-001',
        target: 'applicant-001',
        label: 'filed_by',
        type: 'case_relationship',
        relationship_type: 'Primary Applicant',
        date_established: '2024-01-15'
      },
      {
        id: 'edge-case-applicant-2',
        source: 'case-i485-002',
        target: 'applicant-001',
        label: 'filed_by',
        type: 'case_relationship',
        relationship_type: 'Primary Applicant',
        date_established: '2024-02-20'
      },
      
      // Family Relationships
      {
        id: 'edge-family-1',
        source: 'petitioner-001',
        target: 'applicant-001',
        label: 'married_to',
        type: 'family_relationship',
        relationship_type: 'Spouse',
        marriage_date: '2020-06-15',
        verified: true
      },
      {
        id: 'edge-family-2',
        source: 'applicant-001',
        target: 'beneficiary-001',
        label: 'sibling_of',
        type: 'family_relationship',
        relationship_type: 'Sister',
        verified: true
      },
      {
        id: 'edge-petition-1',
        source: 'case-i130-003',
        target: 'petitioner-001',
        label: 'petitioned_by',
        type: 'case_relationship',
        relationship_type: 'Petitioner',
        date_established: '2023-11-10'
      },
      {
        id: 'edge-petition-2',
        source: 'case-i130-003',
        target: 'beneficiary-001',
        label: 'benefits',
        type: 'case_relationship',
        relationship_type: 'Beneficiary',
        date_established: '2023-11-10'
      },
      
      // Legal Representation
      {
        id: 'edge-attorney-1',
        source: 'attorney-001',
        target: 'case-n400-001',
        label: 'represents',
        type: 'legal_representation',
        g28_filed: true,
        representation_start: '2024-01-10'
      },
      {
        id: 'edge-attorney-2',
        source: 'attorney-001',
        target: 'case-i485-002',
        label: 'represents',
        type: 'legal_representation',
        g28_filed: true,
        representation_start: '2024-02-15'
      },
      {
        id: 'edge-attorney-3',
        source: 'attorney-001',
        target: 'applicant-001',
        label: 'represents',
        type: 'legal_representation',
        active: true
      },
      
      // Document Relationships
      {
        id: 'edge-doc-1',
        source: 'applicant-001',
        target: 'doc-passport-001',
        label: 'owns',
        type: 'document_ownership',
        verified: true,
        verification_date: '2024-01-15'
      },
      {
        id: 'edge-doc-2',
        source: 'applicant-001',
        target: 'doc-greencard-001',
        label: 'holds',
        type: 'document_ownership',
        verified: true,
        verification_date: '2024-01-15'
      },
      {
        id: 'edge-doc-case-1',
        source: 'case-n400-001',
        target: 'doc-passport-001',
        label: 'requires',
        type: 'document_requirement',
        submitted: true,
        submission_date: '2024-01-15'
      },
      {
        id: 'edge-doc-case-2',
        source: 'case-i485-002',
        target: 'doc-greencard-001',
        label: 'requires',
        type: 'document_requirement',
        submitted: true,
        submission_date: '2024-02-20'
      },
      
      // System Processing Relationships
      {
        id: 'edge-system-1',
        source: 'system-cris',
        target: 'case-n400-001',
        label: 'processes',
        type: 'system_processing',
        processing_stage: 'Initial Review',
        last_updated: '2024-09-29'
      },
      {
        id: 'edge-system-2',
        source: 'system-claims3',
        target: 'case-i485-002',
        label: 'processes',
        type: 'system_processing',
        processing_stage: 'Interview Scheduling',
        last_updated: '2024-09-28'
      },
      {
        id: 'edge-system-3',
        source: 'system-claims3',
        target: 'case-i130-003',
        label: 'processed',
        type: 'system_processing',
        processing_stage: 'Approved',
        completion_date: '2024-08-15'
      },
      
      // Workflow Dependencies (Sequential Steps)
      {
        id: 'edge-workflow-1',
        source: 'workflow-step-1',
        target: 'workflow-step-2',
        label: 'precedes',
        type: 'workflow_dependency',
        dependency_type: 'Sequential',
        condition: 'Initial Review Complete'
      },
      {
        id: 'edge-workflow-2',
        source: 'workflow-step-2',
        target: 'workflow-step-3',
        label: 'precedes',
        type: 'workflow_dependency',
        dependency_type: 'Sequential',
        condition: 'Documents Verified'
      },
      {
        id: 'edge-workflow-3',
        source: 'workflow-step-3',
        target: 'workflow-step-4',
        label: 'precedes',
        type: 'workflow_dependency',
        dependency_type: 'Sequential',
        condition: 'Background Check Clear'
      },
      {
        id: 'edge-workflow-4',
        source: 'workflow-step-4',
        target: 'workflow-step-5',
        label: 'precedes',
        type: 'workflow_dependency',
        dependency_type: 'Sequential',
        condition: 'Decision Made'
      },
      
      // Case-Workflow Assignments
      {
        id: 'edge-case-workflow-1',
        source: 'case-n400-001',
        target: 'workflow-step-1',
        label: 'currently_at',
        type: 'case_workflow_status',
        status: 'In Progress',
        started_date: '2024-09-29',
        assigned_to: 'officer-001'
      },
      {
        id: 'edge-case-workflow-2',
        source: 'case-i485-002',
        target: 'workflow-step-3',
        label: 'currently_at',
        type: 'case_workflow_status',
        status: 'In Progress',
        started_date: '2024-09-27',
        assigned_to: 'analyst-001'
      },
      
      // Personnel-Workflow Assignments
      {
        id: 'edge-personnel-1',
        source: 'officer-001',
        target: 'workflow-step-1',
        label: 'assigned_to',
        type: 'personnel_assignment',
        assignment_type: 'Primary',
        workload_percentage: 75
      },
      {
        id: 'edge-personnel-2',
        source: 'specialist-001',
        target: 'workflow-step-2',
        label: 'assigned_to',
        type: 'personnel_assignment',
        assignment_type: 'Primary',
        workload_percentage: 80
      },
      {
        id: 'edge-personnel-3',
        source: 'analyst-001',
        target: 'workflow-step-3',
        label: 'assigned_to',
        type: 'personnel_assignment',
        assignment_type: 'Primary',
        workload_percentage: 85
      },
      
      // Case-Personnel Direct Assignments
      {
        id: 'edge-case-personnel-1',
        source: 'case-n400-001',
        target: 'officer-001',
        label: 'assigned_to',
        type: 'case_assignment',
        assignment_date: '2024-09-29',
        priority: 'Standard',
        estimated_completion: '2024-10-15'
      },
      {
        id: 'edge-case-personnel-2',
        source: 'case-i485-002',
        target: 'analyst-001',
        label: 'assigned_to',
        type: 'case_assignment',
        assignment_date: '2024-09-27',
        priority: 'Standard',
        estimated_completion: '2024-10-10'
      },
      
      // RNA Analytics Relationships
      
      // Policy Impact Relationships
      {
        id: 'edge-policy-impact-1',
        source: 'policy-001',
        target: 'case-i485-002',
        label: 'affects',
        type: 'policy_impact',
        impact_type: 'Processing Change',
        compliance_required: true,
        implementation_date: '2024-01-15'
      },
      {
        id: 'edge-policy-impact-2',
        source: 'policy-002',
        target: 'case-i485-002',
        label: 'affects',
        type: 'policy_impact',
        impact_type: 'Documentation Requirement',
        compliance_required: true,
        implementation_date: '2024-04-01'
      },
      
      // Analytics Model Relationships
      {
        id: 'edge-model-prediction-1',
        source: 'analytics-model-1',
        target: 'case-n400-001',
        label: 'predicts',
        type: 'analytics_prediction',
        prediction_type: 'Processing Time',
        predicted_value: '14 days',
        confidence_score: 92.3,
        prediction_date: '2024-09-29'
      },
      {
        id: 'edge-model-prediction-2',
        source: 'analytics-model-2',
        target: 'attorney-001',
        label: 'monitors',
        type: 'analytics_monitoring',
        monitoring_type: 'Fraud Detection',
        risk_score: 0.15,
        last_assessment: '2024-09-29'
      },
      
      // Trend Analysis Relationships
      {
        id: 'edge-trend-1',
        source: 'trend-001',
        target: 'case-n400-001',
        label: 'influences',
        type: 'trend_influence',
        influence_type: 'Volume Impact',
        trend_factor: 1.23,
        detection_confidence: 95.8
      },
      {
        id: 'edge-trend-2',
        source: 'trend-001',
        target: 'workflow-step-1',
        label: 'impacts',
        type: 'trend_impact',
        impact_type: 'Capacity Strain',
        severity: 'Medium',
        mitigation_required: true
      },
      
      // Anomaly Detection Relationships
      {
        id: 'edge-anomaly-1',
        source: 'anomaly-001',
        target: 'attorney-001',
        label: 'detected_in',
        type: 'anomaly_relationship',
        anomaly_type: 'Pattern Deviation',
        severity: 'Medium',
        investigation_priority: 'High'
      },
      {
        id: 'edge-anomaly-2',
        source: 'anomaly-001',
        target: 'case-n400-001',
        label: 'flagged',
        type: 'anomaly_flag',
        flag_type: 'Unusual Representation',
        review_required: true,
        flag_date: '2024-09-25'
      },
      
      // Cross-Analytics Relationships
      {
        id: 'edge-analytics-correlation-1',
        source: 'analytics-model-1',
        target: 'trend-001',
        label: 'correlates_with',
        type: 'analytics_correlation',
        correlation_strength: 0.87,
        statistical_significance: 0.001,
        analysis_type: 'Predictive Validation'
      },
      {
        id: 'edge-analytics-correlation-2',
        source: 'analytics-model-2',
        target: 'anomaly-001',
        label: 'generated',
        type: 'analytics_output',
        output_type: 'Anomaly Detection',
        generation_date: '2024-09-25',
        validation_status: 'Confirmed'
      },
      
      // Document and Data Lineage Relationships
      
      // Data Source to System Relationships
      {
        id: 'edge-data-source-1',
        source: 'data-source-1',
        target: 'system-cris',
        label: 'feeds_into',
        type: 'data_flow',
        flow_type: 'Real-time Integration',
        data_volume: '~50K records/day',
        last_transfer: '2024-09-29T10:30:00Z',
        transfer_status: 'Success'
      },
      {
        id: 'edge-data-source-2',
        source: 'data-source-2',
        target: 'system-claims3',
        label: 'feeds_into',
        type: 'data_flow',
        flow_type: 'Batch Integration',
        data_volume: '~15K records/day',
        last_transfer: '2024-09-29T02:00:00Z',
        transfer_status: 'Success'
      },
      {
        id: 'edge-data-source-3',
        source: 'data-source-3',
        target: 'system-cris',
        label: 'feeds_into',
        type: 'data_flow',
        flow_type: 'Weekly Batch',
        data_volume: '~200K records/week',
        last_transfer: '2024-09-28T18:00:00Z',
        transfer_status: 'Success'
      },
      
      // Document Transformation Relationships
      {
        id: 'edge-transform-1',
        source: 'doc-passport-001',
        target: 'transformation-1',
        label: 'processed_by',
        type: 'document_processing',
        processing_stage: 'OCR Extraction',
        processing_date: '2024-01-15T09:30:00Z',
        processing_status: 'Completed',
        confidence_score: 96.2
      },
      {
        id: 'edge-transform-2',
        source: 'transformation-1',
        target: 'transformation-2',
        label: 'flows_to',
        type: 'processing_pipeline',
        pipeline_stage: 'Data Cleansing',
        processing_order: 2,
        data_quality_score: 94.7
      },
      {
        id: 'edge-transform-3',
        source: 'transformation-2',
        target: 'case-n400-001',
        label: 'enriches',
        type: 'data_enrichment',
        enrichment_type: 'Standardized Data',
        enrichment_date: '2024-01-15T09:35:00Z',
        quality_improvement: 12.3
      },
      
      // Audit Trail Relationships
      {
        id: 'edge-audit-1',
        source: 'audit-trail-1',
        target: 'case-n400-001',
        label: 'tracks',
        type: 'audit_tracking',
        tracking_type: 'Document Access',
        event_count: 47,
        compliance_level: 'Full Compliance'
      },
      {
        id: 'edge-audit-2',
        source: 'audit-trail-1',
        target: 'doc-passport-001',
        label: 'monitors',
        type: 'audit_monitoring',
        monitoring_type: 'Access Control',
        access_events: 23,
        unauthorized_attempts: 0
      },
      {
        id: 'edge-audit-3',
        source: 'audit-trail-1',
        target: 'officer-001',
        label: 'logs_activity',
        type: 'activity_logging',
        activity_type: 'Document Review',
        session_count: 12,
        total_duration: '4.2 hours'
      },
      
      // Quality Control Relationships
      {
        id: 'edge-quality-1',
        source: 'quality-check-1',
        target: 'doc-passport-001',
        label: 'validates',
        type: 'quality_validation',
        validation_type: 'Completeness Check',
        validation_result: 'Pass',
        validation_date: '2024-01-15T10:00:00Z'
      },
      {
        id: 'edge-quality-2',
        source: 'quality-check-1',
        target: 'doc-greencard-001',
        label: 'validates',
        type: 'quality_validation',
        validation_type: 'Completeness Check',
        validation_result: 'Pass',
        validation_date: '2024-02-20T14:30:00Z'
      },
      
      // FOIA Support Relationships
      {
        id: 'edge-foia-1',
        source: 'case-n400-001',
        target: 'audit-trail-1',
        label: 'supports_foia',
        type: 'foia_support',
        foia_request_id: 'FOIA-2024-001234',
        request_date: '2024-09-15',
        response_due: '2024-10-15',
        status: 'In Progress'
      },
      
      // Data Lineage Cross-References
      {
        id: 'edge-lineage-1',
        source: 'data-source-1',
        target: 'applicant-001',
        label: 'validates',
        type: 'data_validation',
        validation_type: 'Identity Verification',
        validation_score: 98.5,
        validation_date: '2024-01-15T08:00:00Z'
      },
      {
        id: 'edge-lineage-2',
        source: 'data-source-2',
        target: 'applicant-001',
        label: 'background_check',
        type: 'security_validation',
        check_type: 'Criminal History',
        check_result: 'Clear',
        check_date: '2024-01-16T10:00:00Z'
      },
      
      // Personnel Roles and Access Relationships
      
      // Role-Permission Assignments
      {
        id: 'edge-role-perm-1',
        source: 'role-001',
        target: 'permission-001',
        label: 'has_permission',
        type: 'role_permission',
        assignment_type: 'Standard',
        granted_date: '2024-01-01',
        expiration_date: '2024-12-31',
        approval_required: false
      },
      {
        id: 'edge-role-perm-2',
        source: 'role-001',
        target: 'permission-003',
        label: 'has_permission',
        type: 'role_permission',
        assignment_type: 'Standard',
        granted_date: '2024-01-01',
        expiration_date: '2024-12-31',
        approval_required: false
      },
      {
        id: 'edge-role-perm-3',
        source: 'role-002',
        target: 'permission-002',
        label: 'has_permission',
        type: 'role_permission',
        assignment_type: 'Elevated',
        granted_date: '2024-01-01',
        expiration_date: '2024-12-31',
        approval_required: true
      },
      
      // Personnel-Role Assignments
      {
        id: 'edge-personnel-role-1',
        source: 'officer-001',
        target: 'role-001',
        label: 'assigned_role',
        type: 'personnel_role',
        assignment_date: '2024-01-15',
        assignment_status: 'Active',
        supervisor_approval: 'supervisor-001',
        clearance_verified: true
      },
      {
        id: 'edge-personnel-role-2',
        source: 'specialist-001',
        target: 'role-001',
        label: 'assigned_role',
        type: 'personnel_role',
        assignment_date: '2024-02-01',
        assignment_status: 'Active',
        supervisor_approval: 'supervisor-001',
        clearance_verified: true
      },
      {
        id: 'edge-personnel-role-3',
        source: 'analyst-001',
        target: 'role-002',
        label: 'assigned_role',
        type: 'personnel_role',
        assignment_date: '2024-01-01',
        assignment_status: 'Active',
        supervisor_approval: 'director-001',
        clearance_verified: true
      },
      
      // Access Session Relationships
      {
        id: 'edge-session-1',
        source: 'access-session-1',
        target: 'officer-001',
        label: 'performed_by',
        type: 'session_activity',
        session_duration: '8.75 hours',
        systems_used: 2,
        compliance_status: 'Compliant'
      },
      {
        id: 'edge-session-2',
        source: 'access-session-1',
        target: 'system-cris',
        label: 'accessed_system',
        type: 'system_access',
        access_duration: '6.2 hours',
        actions_count: 32,
        last_action: '2024-09-29T16:45:00Z'
      },
      {
        id: 'edge-session-3',
        source: 'access-session-1',
        target: 'case-n400-001',
        label: 'accessed_case',
        type: 'case_access',
        access_type: 'Review',
        access_duration: '45 minutes',
        actions_performed: ['View', 'Update Status']
      },
      
      // Compliance Review Relationships
      {
        id: 'edge-compliance-1',
        source: 'compliance-check-1',
        target: 'officer-001',
        label: 'reviewed',
        type: 'compliance_review',
        review_result: 'Compliant',
        violations_found: 0,
        recommendations: 'None'
      },
      {
        id: 'edge-compliance-2',
        source: 'compliance-check-1',
        target: 'role-001',
        label: 'reviewed_role',
        type: 'role_compliance',
        users_reviewed: 156,
        violations_found: 1,
        remediation_status: 'Complete'
      },
      
      // Permission-System Relationships
      {
        id: 'edge-perm-system-1',
        source: 'permission-001',
        target: 'system-cris',
        label: 'grants_access',
        type: 'permission_system',
        access_level: 'Read',
        scope: 'Case Files',
        restrictions: 'Own Cases Only'
      },
      {
        id: 'edge-perm-system-2',
        source: 'permission-002',
        target: 'system-claims3',
        label: 'grants_access',
        type: 'permission_system',
        access_level: 'Decision Authority',
        scope: 'All Cases',
        restrictions: 'Supervisor Override Required'
      },
      
      // Master Data Management Relationships
      
      // Master Entity-System Relationships
      {
        id: 'edge-master-system-1',
        source: 'master-entity-1',
        target: 'system-cris',
        label: 'implemented_in',
        type: 'master_implementation',
        implementation_version: '2.1.0',
        compliance_level: 'Full',
        last_sync: '2024-08-15',
        data_quality_score: 96.8
      },
      {
        id: 'edge-master-system-2',
        source: 'master-entity-1',
        target: 'system-claims3',
        label: 'implemented_in',
        type: 'master_implementation',
        implementation_version: '2.0.3',
        compliance_level: 'Partial',
        last_sync: '2024-08-10',
        data_quality_score: 94.2
      },
      {
        id: 'edge-master-system-3',
        source: 'master-entity-2',
        target: 'system-cris',
        label: 'implemented_in',
        type: 'master_implementation',
        implementation_version: '3.0.2',
        compliance_level: 'Full',
        last_sync: '2024-09-01',
        data_quality_score: 98.1
      },
      
      // Reference Data Relationships
      {
        id: 'edge-ref-data-1',
        source: 'reference-data-1',
        target: 'applicant-001',
        label: 'validates',
        type: 'reference_validation',
        validation_field: 'country_of_birth',
        validation_result: 'Valid',
        iso_code: 'MEX'
      },
      {
        id: 'edge-ref-data-2',
        source: 'reference-data-2',
        target: 'case-n400-001',
        label: 'categorizes',
        type: 'reference_categorization',
        category_field: 'form_type',
        category_value: 'N-400',
        validation_status: 'Validated'
      },
      
      // Data Standard Compliance
      {
        id: 'edge-standard-1',
        source: 'data-standard-1',
        target: 'system-cris',
        label: 'governs',
        type: 'standard_compliance',
        compliance_level: 'Mandatory',
        adoption_status: 'Implemented',
        certification_date: '2024-06-01',
        compliance_score: 87.3
      },
      {
        id: 'edge-standard-2',
        source: 'data-standard-2',
        target: 'system-claims3',
        label: 'governs',
        type: 'standard_compliance',
        compliance_level: 'Required',
        adoption_status: 'Certified',
        certification_date: '2024-01-15',
        compliance_score: 94.1
      },
      
      // Data Mapping Relationships
      {
        id: 'edge-mapping-1',
        source: 'data-mapping-1',
        target: 'master-entity-1',
        label: 'maps_to',
        type: 'data_transformation',
        mapping_accuracy: 98.7,
        field_coverage: 47,
        transformation_rules: 12,
        last_validated: '2024-09-20'
      },
      {
        id: 'edge-mapping-source',
        source: 'system-cris',
        target: 'data-mapping-1',
        label: 'source_system',
        type: 'mapping_source',
        data_extraction: 'Real-time',
        field_count: 47,
        extraction_frequency: 'Continuous'
      },
      {
        id: 'edge-mapping-target',
        source: 'data-mapping-1',
        target: 'system-claims3',
        label: 'target_system',
        type: 'mapping_target',
        data_loading: 'Batch',
        field_count: 47,
        loading_frequency: 'Hourly'
      },
      
      // Cross-System Data Harmonization
      {
        id: 'edge-harmonization-1',
        source: 'master-entity-1',
        target: 'reference-data-1',
        label: 'uses_reference',
        type: 'data_harmonization',
        reference_field: 'country_codes',
        usage_frequency: 'High',
        data_consistency: 99.2
      },
      {
        id: 'edge-harmonization-2',
        source: 'master-entity-2',
        target: 'reference-data-2',
        label: 'uses_reference',
        type: 'data_harmonization',
        reference_field: 'form_types',
        usage_frequency: 'Critical',
        data_consistency: 100.0
      },
      
      // Automated Governance and Metadata Impact Analysis Relationships
      
      // Governance Policy Enforcement
      {
        id: 'edge-governance-1',
        source: 'governance-policy-1',
        target: 'system-cris',
        label: 'enforced_in',
        type: 'policy_enforcement',
        enforcement_level: 'Automated',
        compliance_score: 96.8,
        last_check: '2024-09-29',
        violations_detected: 0
      },
      {
        id: 'edge-governance-2',
        source: 'governance-policy-2',
        target: 'system-claims3',
        label: 'enforced_in',
        type: 'policy_enforcement',
        enforcement_level: 'Semi-Automated',
        compliance_score: 94.2,
        last_check: '2024-09-28',
        violations_detected: 2
      },
      
      // Metadata Element Dependencies
      {
        id: 'edge-metadata-1',
        source: 'metadata-element-1',
        target: 'applicant-001',
        label: 'describes',
        type: 'metadata_relationship',
        field_name: 'ssn',
        classification: 'PII - Sensitive',
        usage_frequency: 'High'
      },
      {
        id: 'edge-metadata-2',
        source: 'metadata-element-2',
        target: 'case-n400-001',
        label: 'describes',
        type: 'metadata_relationship',
        field_name: 'status',
        classification: 'Business Critical',
        usage_frequency: 'Critical'
      },
      
      // Impact Analysis Relationships
      {
        id: 'edge-impact-1',
        source: 'impact-analysis-1',
        target: 'metadata-element-1',
        label: 'analyzes',
        type: 'impact_assessment',
        impact_type: 'Classification Change',
        risk_level: 'High',
        affected_systems: 3,
        mitigation_required: true
      },
      {
        id: 'edge-impact-2',
        source: 'impact-analysis-1',
        target: 'governance-policy-2',
        label: 'triggered_by',
        type: 'policy_trigger',
        trigger_event: 'Policy Update',
        analysis_scope: 'Enterprise',
        automation_level: 'Full'
      },
      
      // Governance Automation Relationships
      {
        id: 'edge-automation-1',
        source: 'governance-automation-1',
        target: 'metadata-element-1',
        label: 'classifies',
        type: 'automated_classification',
        detection_confidence: 97.3,
        classification_result: 'PII - Sensitive',
        validation_status: 'Confirmed'
      },
      {
        id: 'edge-automation-2',
        source: 'governance-automation-1',
        target: 'governance-policy-2',
        label: 'enforces',
        type: 'policy_automation',
        automation_type: 'Data Classification',
        execution_frequency: 'Real-time',
        success_rate: 97.3
      },
      
      // Policy Violation Relationships
      {
        id: 'edge-violation-1',
        source: 'policy-violation-1',
        target: 'governance-policy-1',
        label: 'violates',
        type: 'policy_violation',
        violation_type: 'Data Retention',
        severity: 'Medium',
        detection_method: 'Automated',
        remediation_priority: 'High'
      },
      {
        id: 'edge-violation-2',
        source: 'policy-violation-1',
        target: 'system-cris',
        label: 'detected_in',
        type: 'violation_source',
        affected_records: 1247,
        detection_date: '2024-09-25',
        remediation_status: 'In Progress'
      },
      
      // Cross-Entity Governance Impact
      {
        id: 'edge-governance-impact-1',
        source: 'governance-policy-1',
        target: 'master-entity-2',
        label: 'governs',
        type: 'governance_scope',
        policy_scope: 'Data Retention',
        compliance_requirement: 'Mandatory',
        audit_frequency: 'Quarterly'
      },
      {
        id: 'edge-governance-impact-2',
        source: 'metadata-element-1',
        target: 'workflow-step-2',
        label: 'impacts',
        type: 'metadata_impact',
        impact_type: 'Process Dependency',
        dependency_level: 'Critical',
        change_risk: 'High'
      },
      
      // Geospatial Data and Interconnectedness Relationships
      
      // Case-Location Relationships
      {
        id: 'edge-geo-case-1',
        source: 'case-n400-001',
        target: 'location-1',
        label: 'processed_at',
        type: 'geographic_processing',
        processing_stage: 'Initial Review',
        assignment_date: '2024-01-15',
        distance_from_applicant: '45.2 miles',
        routing_reason: 'Capacity Available'
      },
      {
        id: 'edge-geo-case-2',
        source: 'case-i485-002',
        target: 'location-2',
        label: 'processed_at',
        type: 'geographic_processing',
        processing_stage: 'Interview Scheduled',
        assignment_date: '2024-02-20',
        distance_from_applicant: '12.8 miles',
        routing_reason: 'Nearest Office'
      },
      
      // Applicant-Location Relationships
      {
        id: 'edge-geo-applicant-1',
        source: 'applicant-001',
        target: 'location-3',
        label: 'born_in',
        type: 'geographic_origin',
        relationship_type: 'Birth Location',
        verification_status: 'Verified',
        documentation: 'Birth Certificate'
      },
      {
        id: 'edge-geo-applicant-2',
        source: 'applicant-001',
        target: 'location-4',
        label: 'resides_in',
        type: 'geographic_residence',
        relationship_type: 'Current Address',
        residence_duration: '8 years',
        verification_status: 'Verified',
        documentation: 'Utility Bills'
      },
      
      // Spatial Analysis Relationships
      {
        id: 'edge-spatial-1',
        source: 'spatial-analysis-1',
        target: 'location-3',
        label: 'analyzes',
        type: 'spatial_pattern',
        pattern_type: 'Migration Origin',
        case_volume: 15234,
        trend_strength: 'Strong',
        statistical_significance: 0.001
      },
      {
        id: 'edge-spatial-2',
        source: 'spatial-analysis-1',
        target: 'location-4',
        label: 'analyzes',
        type: 'spatial_pattern',
        pattern_type: 'Migration Destination',
        case_volume: 18456,
        trend_strength: 'Very Strong',
        statistical_significance: 0.001
      },
      
      // Geospatial Service Relationships
      {
        id: 'edge-geo-service-1',
        source: 'geospatial-service-1',
        target: 'location-1',
        label: 'optimizes_routing_to',
        type: 'service_optimization',
        optimization_type: 'Distance-Based',
        efficiency_improvement: 23.7,
        implementation_status: 'Active'
      },
      {
        id: 'edge-geo-service-2',
        source: 'geospatial-service-1',
        target: 'case-n400-001',
        label: 'routed',
        type: 'geographic_routing',
        routing_algorithm: 'Nearest Office',
        distance_calculated: '45.2 miles',
        routing_date: '2024-01-15'
      },
      
      // Cross-Border Intelligence
      {
        id: 'edge-cross-border-1',
        source: 'location-3',
        target: 'location-4',
        label: 'migration_corridor',
        type: 'cross_border_pattern',
        migration_volume: 45678,
        primary_route: 'Mexico City → Los Angeles',
        travel_frequency: 'High',
        border_crossings: 'Multiple'
      },
      
      // Office Capacity and Geographic Distribution
      {
        id: 'edge-capacity-1',
        source: 'location-1',
        target: 'officer-001',
        label: 'stationed_at',
        type: 'geographic_assignment',
        assignment_type: 'Permanent',
        office_capacity_utilization: 89.9,
        service_radius: 'National'
      },
      {
        id: 'edge-capacity-2',
        source: 'location-2',
        target: 'specialist-001',
        label: 'stationed_at',
        type: 'geographic_assignment',
        assignment_type: 'Permanent',
        office_capacity_utilization: 91.9,
        service_radius: '500 miles'
      }
    ];
  }

  // GET /api/v1/janusgraph/impact-analysis/:entityId - Real-Time Impact Analysis
  async getImpactAnalysis(req, res) {
    try {
      const { entityId } = req.params;
      const { depth = 3 } = req.query;

      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockImpactAnalysis(entityId, depth),
          message: 'Mock impact analysis data'
        });
      }

      // Real JanusGraph query would traverse the graph to find all impacted entities
      res.json({
        success: true,
        data: this.getMockImpactAnalysis(entityId, depth)
      });
    } catch (error) {
      console.error('Error performing impact analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform impact analysis',
        error: error.message
      });
    }
  }

  // GET /api/v1/janusgraph/fraud-detection - Advanced Fraud Detection
  async getFraudDetection(req, res) {
    try {
      const { minRiskScore = 70 } = req.query;

      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockFraudDetection(minRiskScore),
          message: 'Mock fraud detection data'
        });
      }

      res.json({
        success: true,
        data: this.getMockFraudDetection(minRiskScore)
      });
    } catch (error) {
      console.error('Error performing fraud detection:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform fraud detection',
        error: error.message
      });
    }
  }

  // Mock data for Impact Analysis
  getMockImpactAnalysis(entityId, depth) {
    return {
      sourceEntity: {
        id: entityId || 'policy-rule-001',
        label: 'USCIS Policy Update - I-485 Processing',
        type: 'policy_rule',
        effectiveDate: '2024-02-01',
        policyNumber: 'PM-602-0185',
        description: 'Updated evidence requirements for employment-based adjustment of status'
      },
      impactSummary: {
        totalImpactedCases: 15847,
        criticalImpact: 2341,
        highImpact: 5678,
        mediumImpact: 6234,
        lowImpact: 1594,
        estimatedProcessingDelay: '14-21 days',
        affectedServiceCenters: ['NSC', 'TSC', 'CSC', 'PSC'],
        requiredActions: 8923
      },
      nodes: [
        // Source Policy
        {
          id: 'policy-rule-001',
          label: 'I-485 Evidence Policy Update',
          type: 'policy_rule',
          impactLevel: 'source',
          effectiveDate: '2024-02-01'
        },
        // Impacted Cases - Critical
        {
          id: 'case-i485-critical-1',
          label: 'I-485 Case #MSC2190012345',
          type: 'immigration_case',
          impactLevel: 'critical',
          currentStatus: 'Pending Evidence',
          daysInStatus: 45,
          requiresRFE: true,
          priority: 'High'
        },
        {
          id: 'case-i485-critical-2',
          label: 'I-485 Case #MSC2190012456',
          type: 'immigration_case',
          impactLevel: 'critical',
          currentStatus: 'Initial Review',
          daysInStatus: 12,
          requiresRFE: true,
          priority: 'High'
        },
        // Impacted Workflows
        {
          id: 'workflow-i485-review',
          label: 'I-485 Evidence Review Workflow',
          type: 'workflow_step',
          impactLevel: 'high',
          affectedSteps: 3,
          requiresUpdate: true,
          estimatedUpdateTime: '5 days'
        },
        {
          id: 'workflow-rfe-generation',
          label: 'RFE Generation Process',
          type: 'workflow_step',
          impactLevel: 'high',
          affectedSteps: 2,
          requiresUpdate: true,
          estimatedUpdateTime: '3 days'
        },
        // Impacted Personnel
        {
          id: 'officer-group-eb',
          label: 'Employment-Based Officers (234)',
          type: 'uscis_personnel',
          impactLevel: 'medium',
          requiresTraining: true,
          trainingDuration: '4 hours',
          affectedOfficers: 234
        },
        // Impacted Systems
        {
          id: 'system-elis',
          label: 'ELIS System',
          type: 'uscis_system',
          impactLevel: 'high',
          requiresUpdate: true,
          systemVersion: '3.2.1',
          updateComplexity: 'Medium'
        },
        {
          id: 'system-cris',
          label: 'CRIS System',
          type: 'uscis_system',
          impactLevel: 'medium',
          requiresUpdate: true,
          systemVersion: '8.5.3',
          updateComplexity: 'Low'
        },
        // Impacted Documents
        {
          id: 'doc-template-rfe',
          label: 'RFE Template - Employment Evidence',
          type: 'document',
          impactLevel: 'high',
          requiresRevision: true,
          currentVersion: '2.1',
          usageCount: 5678
        },
        // Downstream Analytics
        {
          id: 'analytics-processing-time',
          label: 'Processing Time Analytics',
          type: 'analytics_model',
          impactLevel: 'medium',
          requiresRecalibration: true,
          affectedMetrics: ['Average Processing Time', 'RFE Rate', 'Approval Rate']
        }
      ],
      edges: [
        // Policy to Cases
        {
          id: 'impact-edge-1',
          source: 'policy-rule-001',
          target: 'case-i485-critical-1',
          label: 'impacts',
          type: 'policy_impact',
          impactType: 'Requires Additional Evidence',
          severity: 'Critical',
          actionRequired: 'Issue RFE'
        },
        {
          id: 'impact-edge-2',
          source: 'policy-rule-001',
          target: 'case-i485-critical-2',
          label: 'impacts',
          type: 'policy_impact',
          impactType: 'Review Criteria Changed',
          severity: 'Critical',
          actionRequired: 'Re-evaluate Evidence'
        },
        // Policy to Workflows
        {
          id: 'impact-edge-3',
          source: 'policy-rule-001',
          target: 'workflow-i485-review',
          label: 'requires_update',
          type: 'workflow_impact',
          impactType: 'Process Change',
          severity: 'High',
          actionRequired: 'Update Workflow Steps'
        },
        {
          id: 'impact-edge-4',
          source: 'policy-rule-001',
          target: 'workflow-rfe-generation',
          label: 'requires_update',
          type: 'workflow_impact',
          impactType: 'Template Change',
          severity: 'High',
          actionRequired: 'Update RFE Templates'
        },
        // Policy to Personnel
        {
          id: 'impact-edge-5',
          source: 'policy-rule-001',
          target: 'officer-group-eb',
          label: 'requires_training',
          type: 'training_impact',
          impactType: 'Policy Training Required',
          severity: 'Medium',
          actionRequired: 'Schedule Training Sessions'
        },
        // Policy to Systems
        {
          id: 'impact-edge-6',
          source: 'policy-rule-001',
          target: 'system-elis',
          label: 'requires_system_update',
          type: 'system_impact',
          impactType: 'Business Rules Update',
          severity: 'High',
          actionRequired: 'Deploy System Changes'
        },
        {
          id: 'impact-edge-7',
          source: 'policy-rule-001',
          target: 'system-cris',
          label: 'requires_system_update',
          type: 'system_impact',
          impactType: 'Data Fields Update',
          severity: 'Medium',
          actionRequired: 'Update Data Schema'
        },
        // Workflow to Documents
        {
          id: 'impact-edge-8',
          source: 'workflow-rfe-generation',
          target: 'doc-template-rfe',
          label: 'uses',
          type: 'document_dependency',
          impactType: 'Template Dependency',
          severity: 'High',
          actionRequired: 'Revise Template'
        },
        // Cases to Analytics
        {
          id: 'impact-edge-9',
          source: 'case-i485-critical-1',
          target: 'analytics-processing-time',
          label: 'affects_metrics',
          type: 'analytics_impact',
          impactType: 'Processing Time Increase',
          severity: 'Medium',
          actionRequired: 'Recalibrate Models'
        }
      ],
      recommendations: [
        {
          priority: 'Critical',
          action: 'Issue RFEs for 2,341 critical cases within 7 days',
          estimatedEffort: '234 officer-hours',
          deadline: '2024-02-08'
        },
        {
          priority: 'High',
          action: 'Update ELIS and CRIS systems with new business rules',
          estimatedEffort: '120 developer-hours',
          deadline: '2024-02-05'
        },
        {
          priority: 'High',
          action: 'Conduct training for 234 employment-based officers',
          estimatedEffort: '936 training-hours',
          deadline: '2024-02-10'
        },
        {
          priority: 'Medium',
          action: 'Revise RFE templates and workflow documentation',
          estimatedEffort: '40 hours',
          deadline: '2024-02-07'
        }
      ]
    };
  }

  // Mock data for Fraud Detection
  getMockFraudDetection(minRiskScore) {
    return {
      detectionSummary: {
        totalSuspiciousPatterns: 47,
        highRiskCases: 12,
        mediumRiskCases: 23,
        lowRiskCases: 12,
        fraudRingsDetected: 3,
        anomaliesDetected: 28,
        recommendedInvestigations: 15
      },
      fraudRings: [
        {
          id: 'fraud-ring-001',
          name: 'Suspicious Attorney Network',
          riskScore: 94,
          confidence: 0.92,
          casesInvolved: 23,
          totalBeneficiaries: 45,
          commonPatterns: [
            'Same attorney on all cases',
            'Similar employment letters',
            'Shared business address',
            'Identical supporting documents'
          ],
          detectionDate: '2024-01-15',
          status: 'Under Investigation'
        },
        {
          id: 'fraud-ring-002',
          name: 'Document Mill Pattern',
          riskScore: 87,
          confidence: 0.88,
          casesInvolved: 34,
          totalBeneficiaries: 34,
          commonPatterns: [
            'Identical document formatting',
            'Same notary on multiple cases',
            'Sequential case filing dates',
            'Similar biographical information'
          ],
          detectionDate: '2024-01-18',
          status: 'Pending Review'
        },
        {
          id: 'fraud-ring-003',
          name: 'Shell Company Network',
          riskScore: 91,
          confidence: 0.90,
          casesInvolved: 18,
          totalBeneficiaries: 56,
          commonPatterns: [
            'Multiple petitioners at same address',
            'No online business presence',
            'Minimal tax records',
            'Rapid employee growth claims'
          ],
          detectionDate: '2024-01-20',
          status: 'Escalated to Fraud Detection Unit'
        }
      ],
      nodes: [
        // Fraud Ring 1 - Suspicious Attorney Network
        {
          id: 'attorney-suspicious-001',
          label: 'Attorney: John Smith',
          type: 'legal_representative',
          riskScore: 94,
          casesRepresented: 23,
          suspiciousIndicators: 4,
          barNumber: 'CA-12345',
          location: 'Los Angeles, CA'
        },
        {
          id: 'case-fraud-1-1',
          label: 'I-140 Case #MSC2190098765',
          type: 'immigration_case',
          riskScore: 89,
          caseType: 'I-140',
          filingDate: '2023-11-15',
          status: 'Pending'
        },
        {
          id: 'case-fraud-1-2',
          label: 'I-140 Case #MSC2190098766',
          type: 'immigration_case',
          riskScore: 91,
          caseType: 'I-140',
          filingDate: '2023-11-16',
          status: 'Pending'
        },
        {
          id: 'petitioner-fraud-1',
          label: 'Tech Solutions Inc.',
          type: 'petitioner',
          riskScore: 87,
          businessAddress: '123 Main St, Los Angeles, CA',
          employeeClaims: 45,
          taxRecords: 'Limited'
        },
        {
          id: 'document-fraud-1',
          label: 'Employment Letter Template',
          type: 'document',
          riskScore: 92,
          documentType: 'Employment Verification',
          similarityScore: 0.98,
          usageCount: 23
        },
        // Fraud Ring 2 - Document Mill
        {
          id: 'notary-suspicious-001',
          label: 'Notary: Maria Garcia',
          type: 'legal_representative',
          riskScore: 87,
          documentsNotarized: 156,
          suspiciousIndicators: 3,
          notaryId: 'CA-67890',
          location: 'San Francisco, CA'
        },
        {
          id: 'case-fraud-2-1',
          label: 'I-485 Case #MSC2190087654',
          type: 'immigration_case',
          riskScore: 85,
          caseType: 'I-485',
          filingDate: '2023-12-01',
          status: 'Under Review'
        },
        {
          id: 'case-fraud-2-2',
          label: 'I-485 Case #MSC2190087655',
          type: 'immigration_case',
          riskScore: 86,
          caseType: 'I-485',
          filingDate: '2023-12-02',
          status: 'Under Review'
        },
        {
          id: 'applicant-fraud-2-1',
          label: 'Applicant: Chen Wei',
          type: 'applicant',
          riskScore: 82,
          birthCountry: 'China',
          entryDate: '2018-06-15',
          currentStatus: 'H-1B'
        },
        // Fraud Ring 3 - Shell Company Network
        {
          id: 'petitioner-fraud-3-1',
          label: 'Global Consulting LLC',
          type: 'petitioner',
          riskScore: 91,
          businessAddress: '456 Office Park, Houston, TX',
          employeeClaims: 78,
          taxRecords: 'Minimal',
          onlinePresence: 'None'
        },
        {
          id: 'petitioner-fraud-3-2',
          label: 'International Services Corp',
          type: 'petitioner',
          riskScore: 89,
          businessAddress: '456 Office Park, Houston, TX',
          employeeClaims: 65,
          taxRecords: 'Minimal',
          onlinePresence: 'None'
        },
        {
          id: 'case-fraud-3-1',
          label: 'I-129 Case #MSC2190076543',
          type: 'immigration_case',
          riskScore: 88,
          caseType: 'I-129',
          filingDate: '2023-10-20',
          status: 'RFE Issued'
        },
        // Anomaly Detection
        {
          id: 'anomaly-001',
          label: 'Unusual Filing Pattern',
          type: 'anomaly_detection',
          riskScore: 78,
          anomalyType: 'Temporal Pattern',
          description: 'Spike in H-1B filings from single employer',
          detectionDate: '2024-01-22',
          casesAffected: 12
        },
        {
          id: 'anomaly-002',
          label: 'Geographic Anomaly',
          type: 'anomaly_detection',
          riskScore: 75,
          anomalyType: 'Location Pattern',
          description: 'Multiple beneficiaries claiming same address',
          detectionDate: '2024-01-23',
          casesAffected: 8
        }
      ],
      edges: [
        // Fraud Ring 1 Connections
        {
          id: 'fraud-edge-1-1',
          source: 'attorney-suspicious-001',
          target: 'case-fraud-1-1',
          label: 'represents',
          type: 'fraud_connection',
          suspicionLevel: 'High',
          pattern: 'Repeated Representation'
        },
        {
          id: 'fraud-edge-1-2',
          source: 'attorney-suspicious-001',
          target: 'case-fraud-1-2',
          label: 'represents',
          type: 'fraud_connection',
          suspicionLevel: 'High',
          pattern: 'Repeated Representation'
        },
        {
          id: 'fraud-edge-1-3',
          source: 'petitioner-fraud-1',
          target: 'case-fraud-1-1',
          label: 'filed',
          type: 'fraud_connection',
          suspicionLevel: 'High',
          pattern: 'Same Petitioner'
        },
        {
          id: 'fraud-edge-1-4',
          source: 'petitioner-fraud-1',
          target: 'case-fraud-1-2',
          label: 'filed',
          type: 'fraud_connection',
          suspicionLevel: 'High',
          pattern: 'Same Petitioner'
        },
        {
          id: 'fraud-edge-1-5',
          source: 'document-fraud-1',
          target: 'case-fraud-1-1',
          label: 'attached_to',
          type: 'fraud_connection',
          suspicionLevel: 'Critical',
          pattern: 'Identical Documents',
          similarityScore: 0.98
        },
        {
          id: 'fraud-edge-1-6',
          source: 'document-fraud-1',
          target: 'case-fraud-1-2',
          label: 'attached_to',
          type: 'fraud_connection',
          suspicionLevel: 'Critical',
          pattern: 'Identical Documents',
          similarityScore: 0.98
        },
        // Fraud Ring 2 Connections
        {
          id: 'fraud-edge-2-1',
          source: 'notary-suspicious-001',
          target: 'case-fraud-2-1',
          label: 'notarized_documents',
          type: 'fraud_connection',
          suspicionLevel: 'Medium',
          pattern: 'Same Notary',
          documentsNotarized: 5
        },
        {
          id: 'fraud-edge-2-2',
          source: 'notary-suspicious-001',
          target: 'case-fraud-2-2',
          label: 'notarized_documents',
          type: 'fraud_connection',
          suspicionLevel: 'Medium',
          pattern: 'Same Notary',
          documentsNotarized: 4
        },
        {
          id: 'fraud-edge-2-3',
          source: 'applicant-fraud-2-1',
          target: 'case-fraud-2-1',
          label: 'filed',
          type: 'fraud_connection',
          suspicionLevel: 'Low',
          pattern: 'Applicant Filing'
        },
        // Fraud Ring 3 Connections
        {
          id: 'fraud-edge-3-1',
          source: 'petitioner-fraud-3-1',
          target: 'petitioner-fraud-3-2',
          label: 'shares_address',
          type: 'fraud_connection',
          suspicionLevel: 'Critical',
          pattern: 'Same Physical Location',
          sharedAddress: '456 Office Park, Houston, TX'
        },
        {
          id: 'fraud-edge-3-2',
          source: 'petitioner-fraud-3-1',
          target: 'case-fraud-3-1',
          label: 'filed',
          type: 'fraud_connection',
          suspicionLevel: 'High',
          pattern: 'Shell Company Filing'
        },
        // Anomaly Connections
        {
          id: 'fraud-edge-anomaly-1',
          source: 'anomaly-001',
          target: 'petitioner-fraud-1',
          label: 'detected_in',
          type: 'anomaly_link',
          suspicionLevel: 'High',
          pattern: 'Filing Spike'
        },
        {
          id: 'fraud-edge-anomaly-2',
          source: 'anomaly-002',
          target: 'case-fraud-2-1',
          label: 'detected_in',
          type: 'anomaly_link',
          suspicionLevel: 'Medium',
          pattern: 'Geographic Clustering'
        }
      ],
      recommendations: [
        {
          priority: 'Critical',
          fraudRing: 'fraud-ring-001',
          action: 'Escalate 23 cases to Fraud Detection and National Security (FDNS) unit',
          estimatedImpact: 'Prevent potential fraud in $2.3M in fees',
          timeline: 'Immediate'
        },
        {
          priority: 'High',
          fraudRing: 'fraud-ring-003',
          action: 'Conduct site visits for shell company verification',
          estimatedImpact: 'Verify legitimacy of 18 petitioners',
          timeline: '7 days'
        },
        {
          priority: 'High',
          fraudRing: 'fraud-ring-002',
          action: 'Review all documents notarized by Maria Garcia',
          estimatedImpact: 'Identify document mill operations',
          timeline: '14 days'
        },
        {
          priority: 'Medium',
          action: 'Implement enhanced monitoring for detected patterns',
          estimatedImpact: 'Prevent future fraud attempts',
          timeline: '30 days'
        }
      ]
    };
  }

  // GET /api/v1/janusgraph/intelligent-routing - Intelligent Case Routing
  async getIntelligentRouting(req, res) {
    try {
      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockIntelligentRouting(),
          message: 'Mock intelligent routing data'
        });
      }

      res.json({
        success: true,
        data: this.getMockIntelligentRouting()
      });
    } catch (error) {
      console.error('Error performing intelligent routing:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform intelligent routing',
        error: error.message
      });
    }
  }

  // GET /api/v1/janusgraph/predictive-analytics - Predictive Analytics
  async getPredictiveAnalytics(req, res) {
    try {
      const { caseType = 'all' } = req.query;

      if (this.mockMode) {
        return res.json({
          success: true,
          data: this.getMockPredictiveAnalytics(caseType),
          message: 'Mock predictive analytics data'
        });
      }

      res.json({
        success: true,
        data: this.getMockPredictiveAnalytics(caseType)
      });
    } catch (error) {
      console.error('Error performing predictive analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform predictive analytics',
        error: error.message
      });
    }
  }

  // Mock data for Intelligent Case Routing
  getMockIntelligentRouting() {
    return {
      routingSummary: {
        totalCasesRouted: 847,
        routingAccuracy: 96.2,
        averageRoutingTime: 1.3,
        workloadBalance: 89.4,
        officerUtilization: 87.5,
        slaCompliance: 94.2
      },
      routingRules: [
        {
          id: 'rule-priority-001',
          name: 'Priority-Based Routing',
          enabled: true,
          priority: 1,
          description: 'Route high-priority cases to senior reviewers',
          conditions: {
            priority: ['High', 'Urgent'],
            caseTypes: ['I-485', 'N-400', 'I-140']
          },
          actions: {
            routeTo: 'Senior Officers',
            slaTarget: '2 hours',
            escalationPath: 'Supervisor Review'
          },
          performance: {
            casesRouted: 234,
            successRate: 98.3,
            averageProcessingTime: 1.8
          }
        },
        {
          id: 'rule-workload-001',
          name: 'Workload Balancing',
          enabled: true,
          priority: 2,
          description: 'Distribute cases based on current officer capacity',
          conditions: {
            officerCapacity: '< 80%',
            caseComplexity: ['Low', 'Medium']
          },
          actions: {
            routeTo: 'Available Officers',
            balanceMethod: 'Round Robin',
            maxCasesPerOfficer: 15
          },
          performance: {
            casesRouted: 456,
            successRate: 94.7,
            averageProcessingTime: 2.1
          }
        },
        {
          id: 'rule-skill-001',
          name: 'Skill-Based Assignment',
          enabled: true,
          priority: 3,
          description: 'Match cases to reviewer expertise and language skills',
          conditions: {
            requiredSkills: ['Spanish', 'Employment Law', 'Medical Review'],
            caseTypes: ['I-601', 'I-140', 'I-485']
          },
          actions: {
            routeTo: 'Specialized Officers',
            matchCriteria: 'Skills + Experience',
            minimumExperience: '2 years'
          },
          performance: {
            casesRouted: 123,
            successRate: 97.6,
            averageProcessingTime: 2.5
          }
        },
        {
          id: 'rule-geo-001',
          name: 'Geographic Routing',
          enabled: false,
          priority: 4,
          description: 'Route to nearest available service center',
          conditions: {
            applicantLocation: 'US States',
            serviceCenterAvailability: 'Available'
          },
          actions: {
            routeTo: 'Nearest Service Center',
            maxDistance: '500 miles',
            fallbackCenter: 'NSC'
          },
          performance: {
            casesRouted: 34,
            successRate: 92.1,
            averageProcessingTime: 3.2
          }
        }
      ],
      officers: [
        {
          id: 'officer-001',
          name: 'Sarah Johnson',
          role: 'Senior Immigration Officer',
          serviceCenter: 'NSC',
          currentWorkload: 12,
          capacity: 15,
          utilizationRate: 80.0,
          skills: ['Employment-Based', 'I-140', 'I-485', 'Spanish'],
          experience: '8 years',
          performanceMetrics: {
            averageProcessingTime: 1.6,
            approvalRate: 94.2,
            qualityScore: 96.5,
            casesCompleted: 1247
          },
          availability: 'Available',
          nextAvailableSlot: '2024-02-01 09:00'
        },
        {
          id: 'officer-002',
          name: 'Michael Chen',
          role: 'Immigration Services Officer',
          serviceCenter: 'TSC',
          currentWorkload: 14,
          capacity: 15,
          utilizationRate: 93.3,
          skills: ['Family-Based', 'N-400', 'I-130', 'Mandarin'],
          experience: '5 years',
          performanceMetrics: {
            averageProcessingTime: 2.1,
            approvalRate: 91.8,
            qualityScore: 93.2,
            casesCompleted: 892
          },
          availability: 'Busy',
          nextAvailableSlot: '2024-02-01 14:00'
        },
        {
          id: 'officer-003',
          name: 'Maria Rodriguez',
          role: 'Senior Immigration Officer',
          serviceCenter: 'CSC',
          currentWorkload: 9,
          capacity: 15,
          utilizationRate: 60.0,
          skills: ['Asylum', 'I-589', 'I-765', 'Spanish', 'Portuguese'],
          experience: '12 years',
          performanceMetrics: {
            averageProcessingTime: 3.2,
            approvalRate: 88.5,
            qualityScore: 97.8,
            casesCompleted: 2134
          },
          availability: 'Available',
          nextAvailableSlot: '2024-02-01 08:00'
        },
        {
          id: 'officer-004',
          name: 'David Kim',
          role: 'Immigration Services Officer',
          serviceCenter: 'PSC',
          currentWorkload: 15,
          capacity: 15,
          utilizationRate: 100.0,
          skills: ['Employment-Based', 'I-129', 'H-1B', 'Korean'],
          experience: '4 years',
          performanceMetrics: {
            averageProcessingTime: 1.9,
            approvalRate: 92.3,
            qualityScore: 94.1,
            casesCompleted: 678
          },
          availability: 'At Capacity',
          nextAvailableSlot: '2024-02-02 09:00'
        }
      ],
      nodes: [
        // Pending Cases
        {
          id: 'case-pending-001',
          label: 'I-485 Case #MSC2190045678',
          type: 'immigration_case',
          priority: 'High',
          complexity: 'Medium',
          requiredSkills: ['Employment-Based', 'I-485'],
          estimatedProcessingTime: 2.5,
          slaDeadline: '2024-02-03'
        },
        {
          id: 'case-pending-002',
          label: 'N-400 Case #MSC2190045679',
          type: 'immigration_case',
          priority: 'Medium',
          complexity: 'Low',
          requiredSkills: ['Naturalization', 'N-400'],
          estimatedProcessingTime: 1.8,
          slaDeadline: '2024-02-05'
        },
        {
          id: 'case-pending-003',
          label: 'I-589 Case #MSC2190045680',
          type: 'immigration_case',
          priority: 'Urgent',
          complexity: 'High',
          requiredSkills: ['Asylum', 'I-589', 'Spanish'],
          estimatedProcessingTime: 4.2,
          slaDeadline: '2024-02-02'
        },
        // Officers
        {
          id: 'officer-001',
          label: 'Sarah Johnson (NSC)',
          type: 'uscis_personnel',
          workload: 12,
          capacity: 15,
          utilization: 80.0,
          skills: ['Employment-Based', 'I-140', 'I-485', 'Spanish']
        },
        {
          id: 'officer-002',
          label: 'Michael Chen (TSC)',
          type: 'uscis_personnel',
          workload: 14,
          capacity: 15,
          utilization: 93.3,
          skills: ['Family-Based', 'N-400', 'I-130', 'Mandarin']
        },
        {
          id: 'officer-003',
          label: 'Maria Rodriguez (CSC)',
          type: 'uscis_personnel',
          workload: 9,
          capacity: 15,
          utilization: 60.0,
          skills: ['Asylum', 'I-589', 'I-765', 'Spanish']
        },
        // Routing Rules
        {
          id: 'rule-priority-001',
          label: 'Priority-Based Routing',
          type: 'governance_automation',
          enabled: true,
          successRate: 98.3
        },
        {
          id: 'rule-skill-001',
          label: 'Skill-Based Assignment',
          type: 'governance_automation',
          enabled: true,
          successRate: 97.6
        }
      ],
      edges: [
        // Optimal Routing Recommendations
        {
          id: 'route-001',
          source: 'case-pending-001',
          target: 'officer-001',
          label: 'optimal_route',
          type: 'routing_recommendation',
          routingScore: 96.5,
          matchReason: 'Skills Match + Available Capacity',
          estimatedCompletionTime: '2024-02-03 11:30',
          slaCompliance: true
        },
        {
          id: 'route-002',
          source: 'case-pending-002',
          target: 'officer-002',
          label: 'optimal_route',
          type: 'routing_recommendation',
          routingScore: 89.2,
          matchReason: 'Workload Balance',
          estimatedCompletionTime: '2024-02-04 15:00',
          slaCompliance: true
        },
        {
          id: 'route-003',
          source: 'case-pending-003',
          target: 'officer-003',
          label: 'optimal_route',
          type: 'routing_recommendation',
          routingScore: 98.7,
          matchReason: 'Skills Match + Language + Priority',
          estimatedCompletionTime: '2024-02-02 16:00',
          slaCompliance: true
        },
        // Rule Applications
        {
          id: 'rule-app-001',
          source: 'rule-priority-001',
          target: 'case-pending-003',
          label: 'applies_to',
          type: 'rule_application',
          priority: 'Urgent',
          ruleMatched: true
        },
        {
          id: 'rule-app-002',
          source: 'rule-skill-001',
          target: 'officer-003',
          label: 'matches_skills',
          type: 'skill_match',
          matchScore: 98.7,
          requiredSkills: ['Asylum', 'Spanish']
        }
      ],
      recommendations: [
        {
          priority: 'Urgent',
          case: 'I-589 Case #MSC2190045680',
          recommendedOfficer: 'Maria Rodriguez (CSC)',
          routingScore: 98.7,
          reason: 'Perfect skills match (Asylum + Spanish) with available capacity',
          estimatedCompletion: '2024-02-02 16:00',
          slaCompliance: true
        },
        {
          priority: 'High',
          case: 'I-485 Case #MSC2190045678',
          recommendedOfficer: 'Sarah Johnson (NSC)',
          routingScore: 96.5,
          reason: 'Employment-based expertise with 80% utilization',
          estimatedCompletion: '2024-02-03 11:30',
          slaCompliance: true
        },
        {
          priority: 'Medium',
          action: 'Redistribute workload from David Kim (100% capacity)',
          impact: 'Prevent bottleneck and maintain SLA compliance',
          timeline: 'Immediate'
        }
      ]
    };
  }

  // Mock data for Predictive Analytics
  getMockPredictiveAnalytics(caseType) {
    return {
      analyticsSummary: {
        totalCasesPredicted: 15847,
        predictionAccuracy: 94.3,
        averageConfidence: 87.5,
        modelsActive: 8,
        lastUpdated: '2024-01-30 08:00'
      },
      processingTimePredictions: [
        {
          caseType: 'I-485',
          currentAverageTime: 12.5,
          predictedAverageTime: 9.5,
          improvement: -24.0,
          confidence: 92.3,
          factors: [
            'Workflow automation deployment',
            'Additional officer training',
            'System performance improvements'
          ],
          timeline: 'Q2 2024'
        },
        {
          caseType: 'N-400',
          currentAverageTime: 8.2,
          predictedAverageTime: 7.1,
          improvement: -13.4,
          confidence: 88.7,
          factors: [
            'Interview scheduling optimization',
            'Background check streamlining'
          ],
          timeline: 'Q2 2024'
        },
        {
          caseType: 'I-140',
          currentAverageTime: 6.8,
          predictedAverageTime: 5.9,
          improvement: -13.2,
          confidence: 91.2,
          factors: [
            'Premium processing expansion',
            'Evidence review automation'
          ],
          timeline: 'Q3 2024'
        },
        {
          caseType: 'I-765',
          currentAverageTime: 4.5,
          predictedAverageTime: 3.2,
          improvement: -28.9,
          confidence: 95.1,
          factors: [
            'Automated eligibility verification',
            'Digital document processing'
          ],
          timeline: 'Q2 2024'
        }
      ],
      approvalProbabilities: [
        {
          id: 'case-i485-001',
          caseNumber: 'MSC2190045678',
          caseType: 'I-485',
          approvalProbability: 87.5,
          confidence: 89.2,
          riskFactors: [
            { factor: 'Employment verification pending', impact: -5.2 },
            { factor: 'Medical exam incomplete', impact: -7.3 }
          ],
          positiveFactors: [
            { factor: 'Clean background check', impact: +15.3 },
            { factor: 'Valid I-140 approval', impact: +12.8 },
            { factor: 'Continuous lawful status', impact: +8.4 }
          ],
          recommendation: 'Issue RFE for employment verification and medical exam',
          estimatedApprovalDate: '2024-03-15'
        },
        {
          id: 'case-n400-001',
          caseNumber: 'MSC2190045679',
          caseType: 'N-400',
          approvalProbability: 94.2,
          confidence: 92.8,
          riskFactors: [
            { factor: 'Minor traffic violations', impact: -2.1 }
          ],
          positiveFactors: [
            { factor: '5+ years continuous residence', impact: +18.5 },
            { factor: 'Good moral character', impact: +14.2 },
            { factor: 'English proficiency verified', impact: +9.8 }
          ],
          recommendation: 'Schedule interview - high approval probability',
          estimatedApprovalDate: '2024-02-28'
        }
      ],
      volumeForecasts: [
        {
          period: 'Q2 2024',
          caseType: 'I-485',
          predictedVolume: 45678,
          currentVolume: 38542,
          change: +18.5,
          confidence: 85.3,
          drivers: [
            'H-1B to green card conversions',
            'Family-based backlog processing',
            'Employment market trends'
          ]
        },
        {
          period: 'Q2 2024',
          caseType: 'N-400',
          predictedVolume: 67890,
          currentVolume: 65234,
          change: +4.1,
          confidence: 88.9,
          drivers: [
            'Seasonal application patterns',
            'Citizenship awareness campaigns'
          ]
        },
        {
          period: 'Q3 2024',
          caseType: 'I-765',
          predictedVolume: 89012,
          currentVolume: 76543,
          change: +16.3,
          confidence: 82.4,
          drivers: [
            'DACA renewals',
            'Asylum applicant work authorization',
            'F-1 OPT applications'
          ]
        }
      ],
      riskScores: [
        {
          caseId: 'case-i485-001',
          caseNumber: 'MSC2190045678',
          riskScore: 23.5,
          riskLevel: 'Low',
          riskCategories: {
            fraud: 12.3,
            eligibility: 18.7,
            documentation: 34.2,
            background: 8.9
          },
          recommendation: 'Standard processing - low risk',
          reviewPriority: 'Normal'
        },
        {
          caseId: 'case-i140-002',
          caseNumber: 'MSC2190045680',
          riskScore: 78.9,
          riskLevel: 'High',
          riskCategories: {
            fraud: 85.2,
            eligibility: 67.3,
            documentation: 82.1,
            background: 45.6
          },
          recommendation: 'Escalate to fraud detection unit',
          reviewPriority: 'Urgent'
        }
      ],
      nodes: [
        // Predictive Models
        {
          id: 'model-processing-time',
          label: 'Processing Time Predictor',
          type: 'analytics_model',
          accuracy: 94.3,
          status: 'Active',
          lastTrained: '2024-01-28'
        },
        {
          id: 'model-approval-prob',
          label: 'Approval Probability Model',
          type: 'analytics_model',
          accuracy: 91.7,
          status: 'Active',
          lastTrained: '2024-01-29'
        },
        {
          id: 'model-volume-forecast',
          label: 'Volume Forecasting Model',
          type: 'analytics_model',
          accuracy: 87.2,
          status: 'Active',
          lastTrained: '2024-01-30'
        },
        {
          id: 'model-risk-scoring',
          label: 'Risk Scoring Model',
          type: 'analytics_model',
          accuracy: 89.8,
          status: 'Active',
          lastTrained: '2024-01-27'
        },
        // Cases with Predictions
        {
          id: 'case-i485-001',
          label: 'I-485 #MSC2190045678',
          type: 'immigration_case',
          approvalProbability: 87.5,
          riskScore: 23.5,
          predictedProcessingTime: 9.5
        },
        {
          id: 'case-n400-001',
          label: 'N-400 #MSC2190045679',
          type: 'immigration_case',
          approvalProbability: 94.2,
          riskScore: 15.3,
          predictedProcessingTime: 7.1
        },
        // Trend Patterns
        {
          id: 'trend-i485-volume',
          label: 'I-485 Volume Increase',
          type: 'trend_pattern',
          trendType: 'Volume Forecast',
          prediction: '+18.5% Q2 2024',
          confidence: 85.3
        }
      ],
      edges: [
        // Model to Case Predictions
        {
          id: 'pred-edge-1',
          source: 'model-approval-prob',
          target: 'case-i485-001',
          label: 'predicts',
          type: 'prediction',
          probability: 87.5,
          confidence: 89.2
        },
        {
          id: 'pred-edge-2',
          source: 'model-risk-scoring',
          target: 'case-i485-001',
          label: 'scores',
          type: 'risk_assessment',
          riskScore: 23.5,
          riskLevel: 'Low'
        },
        {
          id: 'pred-edge-3',
          source: 'model-processing-time',
          target: 'case-i485-001',
          label: 'estimates',
          type: 'time_prediction',
          estimatedDays: 9.5,
          confidence: 92.3
        },
        {
          id: 'pred-edge-4',
          source: 'model-volume-forecast',
          target: 'trend-i485-volume',
          label: 'forecasts',
          type: 'trend_prediction',
          volumeChange: '+18.5%',
          confidence: 85.3
        }
      ],
      recommendations: [
        {
          priority: 'High',
          action: 'Increase I-485 officer capacity by 15% for Q2 2024',
          reason: 'Predicted 18.5% volume increase',
          estimatedImpact: 'Maintain current processing times',
          timeline: 'By March 1, 2024'
        },
        {
          priority: 'Medium',
          action: 'Deploy automated eligibility verification for I-765',
          reason: 'Predicted 28.9% processing time improvement',
          estimatedImpact: 'Reduce average processing from 4.5 to 3.2 months',
          timeline: 'Q2 2024'
        },
        {
          priority: 'Urgent',
          action: 'Escalate case MSC2190045680 to fraud detection',
          reason: 'Risk score 78.9 (High)',
          estimatedImpact: 'Prevent potential fraud',
          timeline: 'Immediate'
        }
      ]
    };
  }

  // Cleanup connection on shutdown
  async close() {
    if (this.connection) {
      await this.connection.close();
      console.log('JanusGraph connection closed');
    }
  }
}

module.exports = new JanusGraphController();

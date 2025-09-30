const express = require('express');
const router = express.Router();
const janusGraphController = require('../controllers/janusGraphController');

// GET /api/v1/janusgraph/status - Get connection status
router.get('/status', (req, res) => {
  janusGraphController.getStatus(req, res);
});

// GET /api/v1/janusgraph/vertices - Get all vertices
router.get('/vertices', (req, res) => {
  janusGraphController.getVertices(req, res);
});

// GET /api/v1/janusgraph/edges - Get all edges
router.get('/edges', (req, res) => {
  janusGraphController.getEdges(req, res);
});

// GET /api/v1/janusgraph/graph - Get complete graph data for visualization
router.get('/graph', (req, res) => {
  janusGraphController.getGraphData(req, res);
});

// POST /api/v1/janusgraph/vertex - Create a new vertex
router.post('/vertex', (req, res) => {
  janusGraphController.createVertex(req, res);
});

// POST /api/v1/janusgraph/edge - Create a new edge
router.post('/edge', (req, res) => {
  janusGraphController.createEdge(req, res);
});

// POST /api/v1/janusgraph/query - Execute custom Gremlin query
router.post('/query', (req, res) => {
  janusGraphController.executeQuery(req, res);
});

// GET /api/v1/janusgraph/impact-analysis/:entityId - Real-Time Impact Analysis
router.get('/impact-analysis/:entityId', (req, res) => {
  janusGraphController.getImpactAnalysis(req, res);
});

// GET /api/v1/janusgraph/fraud-detection - Advanced Fraud Detection
router.get('/fraud-detection', (req, res) => {
  janusGraphController.getFraudDetection(req, res);
});

// GET /api/v1/janusgraph/data-lineage - Get data lineage graph
router.get('/data-lineage', (req, res) => {
  janusGraphController.getDataLineageGraph(req, res);
});

// GET /api/v1/janusgraph/network - Get network graph
router.get('/network', (req, res) => {
  janusGraphController.getNetworkGraph(req, res);
});

// GET /api/v1/janusgraph/immigration-case-network - Get immigration case network
router.get('/immigration-case-network', (req, res) => {
  janusGraphController.getImmigrationCaseNetwork(req, res);
});

// GET /api/v1/janusgraph/workflow-case-management - Get workflow case management
router.get('/workflow-case-management', (req, res) => {
  janusGraphController.getWorkflowCaseManagement(req, res);
});

// GET /api/v1/janusgraph/rna-advanced-analytics - Get RNA advanced analytics
router.get('/rna-advanced-analytics', (req, res) => {
  janusGraphController.getRNAAdvancedAnalytics(req, res);
});

// GET /api/v1/janusgraph/document-data-lineage - Get document data lineage
router.get('/document-data-lineage', (req, res) => {
  janusGraphController.getDocumentDataLineage(req, res);
});

// GET /api/v1/janusgraph/personnel-roles-access - Get personnel roles access
router.get('/personnel-roles-access', (req, res) => {
  janusGraphController.getPersonnelRolesAccess(req, res);
});

// GET /api/v1/janusgraph/master-data-management - Get master data management
router.get('/master-data-management', (req, res) => {
  janusGraphController.getMasterDataManagement(req, res);
});

// GET /api/v1/janusgraph/automated-governance - Get automated governance
router.get('/automated-governance', (req, res) => {
  janusGraphController.getAutomatedGovernance(req, res);
});

// GET /api/v1/janusgraph/geospatial-data - Get geospatial data
router.get('/geospatial-data', (req, res) => {
  janusGraphController.getGeospatialData(req, res);
});

// GET /api/v1/janusgraph/intelligent-routing - Intelligent Case Routing
router.get('/intelligent-routing', (req, res) => {
  janusGraphController.getIntelligentRouting(req, res);
});

// GET /api/v1/janusgraph/predictive-analytics - Predictive Analytics
router.get('/predictive-analytics', (req, res) => {
  janusGraphController.getPredictiveAnalytics(req, res);
});

module.exports = router;

# JanusGraph Implementation Guide for USCIS DSSS3
## Technical Implementation Handbook

**Version**: 1.0  
**Date**: September 30, 2025  
**Audience**: Technical Teams, Data Architects, Developers  
**Classification**: For Official Use Only (FOUO)

---

## Table of Contents

1. [Installation and Setup](#installation-and-setup)
2. [Graph Schema Design](#graph-schema-design)
3. [Data Ingestion Pipelines](#data-ingestion-pipelines)
4. [Query Patterns and Examples](#query-patterns-and-examples)
5. [Performance Optimization](#performance-optimization)
6. [Security and Compliance](#security-and-compliance)
7. [Monitoring and Operations](#monitoring-and-operations)
8. [Integration with DSSS3 Platform](#integration-with-dsss3-platform)

---

## Installation and Setup

### Prerequisites

**Hardware Requirements** (Development):
- 3 servers with 16 CPU cores, 64GB RAM each
- 2TB SSD storage per server
- 10Gbps network connectivity

**Software Requirements**:
- Java 11 or higher
- Apache Cassandra 4.0+ (backend storage)
- Elasticsearch 7.x (indexing)
- Python 3.8+ (data ingestion scripts)
- Node.js 18+ (API integration)

### Step 1: Install JanusGraph

```bash
# Download JanusGraph 1.0.0
wget https://github.com/JanusGraph/janusgraph/releases/download/v1.0.0/janusgraph-1.0.0.zip
unzip janusgraph-1.0.0.zip
cd janusgraph-1.0.0

# Configure Cassandra backend
cp conf/janusgraph-cql.properties conf/janusgraph-uscis.properties

# Edit configuration
vi conf/janusgraph-uscis.properties
```

**Configuration** (`janusgraph-uscis.properties`):
```properties
# Storage Backend
storage.backend=cql
storage.hostname=cassandra-node1,cassandra-node2,cassandra-node3
storage.cql.keyspace=uscis_graph

# Index Backend
index.search.backend=elasticsearch
index.search.hostname=elasticsearch-node1,elasticsearch-node2
index.search.elasticsearch.client-only=true

# Cache Configuration
cache.db-cache=true
cache.db-cache-clean-wait=20
cache.db-cache-time=180000
cache.db-cache-size=0.5

# Performance Tuning
storage.batch-loading=false
storage.buffer-size=1024
query.batch=true
query.force-index=true
```

### Step 2: Start Gremlin Server

```bash
# Start JanusGraph server
./bin/janusgraph-server.sh start

# Verify server is running
curl http://localhost:8182/
```

### Step 3: Connect from Application

**Node.js Connection** (for DSSS3 backend):
```javascript
const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

// Initialize connection
const connection = new DriverRemoteConnection('ws://localhost:8182/gremlin');
const graph = new Graph();
const g = graph.traversal().withRemote(connection);

// Test connection
async function testConnection() {
  try {
    const count = await g.V().count().next();
    console.log(`Connected! Vertex count: ${count.value}`);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

---

## Graph Schema Design

### Entity Types (Vertex Labels)

#### 1. Immigration Cases
```javascript
// N-400 Naturalization Case
{
  label: 'immigration_case',
  properties: {
    receipt_number: 'MSC2190012345',
    form_type: 'N-400',
    status: 'Under Review',
    priority: 'Standard',
    filing_date: '2024-01-15',
    service_center: 'NBC',
    current_step: 'Background Check',
    estimated_completion: '2024-06-15'
  }
}

// I-485 Adjustment of Status
{
  label: 'immigration_case',
  properties: {
    receipt_number: 'MSC2190067890',
    form_type: 'I-485',
    status: 'Interview Scheduled',
    priority: 'Standard',
    filing_date: '2024-02-20',
    service_center: 'NBC',
    interview_date: '2024-05-10',
    category: 'Employment-Based'
  }
}
```

#### 2. People (Applicants, Attorneys, Officers)
```javascript
// Applicant
{
  label: 'applicant',
  properties: {
    alien_number: 'A123456789',
    name: 'Maria Rodriguez',
    date_of_birth: '1985-03-15',
    country_of_birth: 'Mexico',
    current_status: 'Lawful Permanent Resident',
    address_state: 'CA'
  }
}

// Attorney
{
  label: 'legal_representative',
  properties: {
    bar_number: 'CA12345',
    attorney_name: 'Sarah Johnson, Esq.',
    firm_name: 'Immigration Law Firm LLC',
    state_licensed: 'CA',
    specialization: 'Family Immigration',
    active_cases: 187
  }
}

// USCIS Officer
{
  label: 'uscis_personnel',
  properties: {
    employee_id: 'USCIS-001234',
    name: 'John Smith',
    role: 'Immigration Services Officer',
    grade: 'GS-13',
    office_location: 'NBC',
    specialization: 'Naturalization',
    current_caseload: 45,
    max_capacity: 60
  }
}
```

#### 3. Documents and Evidence
```javascript
{
  label: 'document',
  properties: {
    document_id: 'DOC-2024-001234',
    document_type: 'Passport',
    issuing_country: 'Mexico',
    document_number: 'G12345678',
    expiration_date: '2026-05-15',
    status: 'Valid',
    verification_status: 'Verified'
  }
}
```

#### 4. USCIS Systems
```javascript
{
  label: 'uscis_system',
  properties: {
    system_id: 'CRIS',
    system_name: 'Customer Relations Interface System',
    system_type: 'Case Management',
    environment: 'Production',
    version: '8.5.3',
    primary_function: 'Case Processing'
  }
}
```

#### 5. Policies and Regulations
```javascript
{
  label: 'policy_rule',
  properties: {
    policy_id: 'PM-602-0185',
    policy_name: 'I-485 Evidence Requirements Update',
    policy_type: 'Immigration Policy',
    effective_date: '2024-02-01',
    impact_level: 'High',
    affected_forms: ['I-485', 'I-140'],
    status: 'Active'
  }
}
```

#### 6. Workflow Steps
```javascript
{
  label: 'workflow_step',
  properties: {
    step_id: 'WF-001',
    step_name: 'Initial Review',
    step_type: 'Review',
    estimated_duration: '2 hours',
    required_role: 'Immigration Officer',
    automation_level: 'Manual',
    sla_target: '24 hours'
  }
}
```

### Relationship Types (Edge Labels)

#### Core Relationships
```javascript
// Case Relationships
FILED_BY:           applicant → immigration_case
REPRESENTED_BY:     immigration_case → legal_representative
ASSIGNED_TO:        immigration_case → uscis_personnel
REQUIRES:           immigration_case → document
PROCESSED_IN:       immigration_case → uscis_system
FOLLOWS:            immigration_case → workflow_step

// Policy Relationships
GOVERNED_BY:        immigration_case → policy_rule
IMPACTS:            policy_rule → immigration_case
IMPACTS:            policy_rule → workflow_step
IMPACTS:            policy_rule → uscis_system

// Data Lineage
SOURCED_FROM:       data_element → data_source
TRANSFORMED_BY:     data_element → transformation
FLOWS_TO:           data_source → uscis_system
ACCESSED_BY:        document → uscis_personnel

// Access Control
HAS_ROLE:           uscis_personnel → access_role
HAS_PERMISSION:     access_role → access_permission
GRANTS_ACCESS:      access_permission → uscis_system
```

### Schema Initialization Script

```javascript
// schema-init.js
const gremlin = require('gremlin');

async function initializeSchema(g) {
  const mgmt = g.getManagementSystem();
  
  // Define Vertex Labels
  const caseLabel = mgmt.makeVertexLabel('immigration_case').make();
  const applicantLabel = mgmt.makeVertexLabel('applicant').make();
  const attorneyLabel = mgmt.makeVertexLabel('legal_representative').make();
  const officerLabel = mgmt.makeVertexLabel('uscis_personnel').make();
  const documentLabel = mgmt.makeVertexLabel('document').make();
  const systemLabel = mgmt.makeVertexLabel('uscis_system').make();
  const policyLabel = mgmt.makeVertexLabel('policy_rule').make();
  const workflowLabel = mgmt.makeVertexLabel('workflow_step').make();
  
  // Define Property Keys
  const receiptNumber = mgmt.makePropertyKey('receipt_number').dataType(String.class).make();
  const formType = mgmt.makePropertyKey('form_type').dataType(String.class).make();
  const status = mgmt.makePropertyKey('status').dataType(String.class).make();
  const filingDate = mgmt.makePropertyKey('filing_date').dataType(Date.class).make();
  
  // Define Edge Labels
  mgmt.makeEdgeLabel('FILED_BY').make();
  mgmt.makeEdgeLabel('REPRESENTED_BY').make();
  mgmt.makeEdgeLabel('ASSIGNED_TO').make();
  mgmt.makeEdgeLabel('REQUIRES').make();
  mgmt.makeEdgeLabel('PROCESSED_IN').make();
  mgmt.makeEdgeLabel('FOLLOWS').make();
  mgmt.makeEdgeLabel('GOVERNED_BY').make();
  mgmt.makeEdgeLabel('IMPACTS').make();
  
  // Create Indexes
  mgmt.buildIndex('byReceiptNumber', Vertex.class)
    .addKey(receiptNumber)
    .unique()
    .buildCompositeIndex();
  
  mgmt.buildIndex('byFormType', Vertex.class)
    .addKey(formType)
    .buildCompositeIndex();
  
  mgmt.buildIndex('byStatus', Vertex.class)
    .addKey(status)
    .buildCompositeIndex();
  
  mgmt.buildIndex('byFilingDate', Vertex.class)
    .addKey(filingDate)
    .buildMixedIndex('search');
  
  // Commit schema
  mgmt.commit();
  
  console.log('✅ Schema initialized successfully');
}
```

---

## Data Ingestion Pipelines

### Pipeline 1: CRIS Case Data Ingestion

```javascript
// ingest-cris-cases.js
const axios = require('axios');
const gremlin = require('gremlin');

async function ingestCRISCases(g, batchSize = 1000) {
  console.log('🔄 Starting CRIS case ingestion...');
  
  // Fetch cases from CRIS API
  const response = await axios.get('http://cris-api.uscis.gov/api/v1/cases', {
    params: { limit: batchSize, status: 'active' }
  });
  
  const cases = response.data.cases;
  let imported = 0;
  
  for (const caseData of cases) {
    try {
      // Create case vertex
      const caseVertex = await g.addV('immigration_case')
        .property('receipt_number', caseData.receipt_number)
        .property('form_type', caseData.form_type)
        .property('status', caseData.status)
        .property('priority', caseData.priority)
        .property('filing_date', new Date(caseData.filing_date))
        .property('service_center', caseData.service_center)
        .next();
      
      // Create applicant vertex if not exists
      const applicant = await g.V()
        .has('applicant', 'alien_number', caseData.applicant.alien_number)
        .fold()
        .coalesce(
          g.unfold(),
          g.addV('applicant')
            .property('alien_number', caseData.applicant.alien_number)
            .property('name', caseData.applicant.name)
            .property('date_of_birth', new Date(caseData.applicant.dob))
            .property('country_of_birth', caseData.applicant.country)
        )
        .next();
      
      // Create FILED_BY relationship
      await g.V(applicant.value.id)
        .addE('FILED_BY')
        .to(g.V(caseVertex.value.id))
        .next();
      
      // Create officer assignment if exists
      if (caseData.assigned_officer) {
        const officer = await g.V()
          .has('uscis_personnel', 'employee_id', caseData.assigned_officer.id)
          .fold()
          .coalesce(
            g.unfold(),
            g.addV('uscis_personnel')
              .property('employee_id', caseData.assigned_officer.id)
              .property('name', caseData.assigned_officer.name)
              .property('role', caseData.assigned_officer.role)
          )
          .next();
        
        await g.V(caseVertex.value.id)
          .addE('ASSIGNED_TO')
          .to(g.V(officer.value.id))
          .property('assignment_date', new Date())
          .next();
      }
      
      imported++;
      if (imported % 100 === 0) {
        console.log(`✅ Imported ${imported} cases...`);
      }
      
    } catch (error) {
      console.error(`❌ Error importing case ${caseData.receipt_number}:`, error.message);
    }
  }
  
  console.log(`✅ CRIS ingestion complete: ${imported} cases imported`);
  return imported;
}
```

### Pipeline 2: Policy Impact Data Ingestion

```javascript
// ingest-policy-impacts.js

async function ingestPolicyImpacts(g, policyId) {
  console.log(`🔄 Analyzing impacts for policy ${policyId}...`);
  
  // Create policy vertex
  const policy = await g.addV('policy_rule')
    .property('policy_id', policyId)
    .property('policy_name', 'I-485 Evidence Requirements Update')
    .property('effective_date', new Date('2024-02-01'))
    .property('impact_level', 'High')
    .next();
  
  // Find all affected I-485 cases
  const affectedCases = await g.V()
    .hasLabel('immigration_case')
    .has('form_type', 'I-485')
    .has('status', within('Pending', 'Under Review', 'RFE Issued'))
    .toList();
  
  console.log(`📊 Found ${affectedCases.length} affected cases`);
  
  // Create IMPACTS relationships
  for (const caseVertex of affectedCases) {
    await g.V(policy.value.id)
      .addE('IMPACTS')
      .to(g.V(caseVertex.id))
      .property('impact_severity', calculateSeverity(caseVertex))
      .property('detected_date', new Date())
      .next();
  }
  
  // Find affected workflow steps
  const affectedWorkflows = await g.V()
    .hasLabel('workflow_step')
    .has('step_name', within('Evidence Review', 'RFE Generation'))
    .toList();
  
  for (const workflow of affectedWorkflows) {
    await g.V(policy.value.id)
      .addE('IMPACTS')
      .to(g.V(workflow.id))
      .property('impact_type', 'Process Change')
      .next();
  }
  
  console.log(`✅ Policy impact analysis complete`);
  return affectedCases.length;
}

function calculateSeverity(caseVertex) {
  const props = caseVertex.properties;
  const filingDate = new Date(props.filing_date);
  const daysPending = (Date.now() - filingDate) / (1000 * 60 * 60 * 24);
  
  if (daysPending > 180) return 'Critical';
  if (daysPending > 90) return 'High';
  if (daysPending > 30) return 'Medium';
  return 'Low';
}
```

### Pipeline 3: Real-Time Streaming Ingestion

```javascript
// stream-ingest.js
const kafka = require('kafka-node');

async function setupStreamIngestion(g) {
  const client = new kafka.KafkaClient({ kafkaHost: 'kafka-broker:9092' });
  const consumer = new kafka.Consumer(
    client,
    [{ topic: 'uscis-case-updates', partition: 0 }],
    { autoCommit: true }
  );
  
  consumer.on('message', async (message) => {
    try {
      const update = JSON.parse(message.value);
      
      // Update case status in graph
      await g.V()
        .has('immigration_case', 'receipt_number', update.receipt_number)
        .property('status', update.new_status)
        .property('last_updated', new Date())
        .next();
      
      console.log(`✅ Updated case ${update.receipt_number}: ${update.new_status}`);
      
    } catch (error) {
      console.error('❌ Stream processing error:', error);
    }
  });
  
  console.log('🔄 Real-time streaming ingestion active');
}
```

---

## Query Patterns and Examples

### Pattern 1: Policy Impact Analysis

**Find all cases affected by a policy change**:
```javascript
async function findPolicyImpacts(g, policyId) {
  const result = await g.V()
    .has('policy_rule', 'policy_id', policyId)
    .out('IMPACTS')
    .hasLabel('immigration_case')
    .group()
      .by('status')
      .by(count())
    .next();
  
  return result.value;
}

// Example output:
// {
//   'Pending': 5678,
//   'Under Review': 8234,
//   'RFE Issued': 1935
// }
```

**Multi-level impact traversal**:
```javascript
async function deepImpactAnalysis(g, policyId) {
  const impacts = await g.V()
    .has('policy_rule', 'policy_id', policyId)
    .repeat(out('IMPACTS'))
    .times(3)
    .path()
    .by(valueMap(true))
    .toList();
  
  return impacts;
}
```

### Pattern 2: Fraud Detection

**Detect suspicious attorney patterns**:
```javascript
async function detectFraudRings(g, minCases = 20, similarityThreshold = 0.95) {
  const suspiciousAttorneys = await g.V()
    .hasLabel('legal_representative')
    .where(
      g.in('REPRESENTED_BY')
        .hasLabel('immigration_case')
        .count()
        .is(gte(minCases))
    )
    .project('attorney', 'cases', 'risk_score')
      .by(valueMap(true))
      .by(g.in('REPRESENTED_BY').fold())
      .by(g.in('REPRESENTED_BY').values('similarity_score').mean())
    .toList();
  
  return suspiciousAttorneys.filter(a => a.risk_score > similarityThreshold);
}
```

**Find document mills (shared addresses)**:
```javascript
async function findDocumentMills(g) {
  const sharedAddresses = await g.V()
    .hasLabel('immigration_case')
    .has('form_type', 'I-140')
    .groupCount()
      .by('employer_address')
    .unfold()
    .where(select(values).is(gte(10)))
    .toList();
  
  return sharedAddresses;
}
```

### Pattern 3: Data Lineage Tracking

**Trace data from source to destination**:
```javascript
async function traceDataLineage(g, sourceSystem, targetField) {
  const lineage = await g.V()
    .has('data_source', 'source_name', sourceSystem)
    .repeat(out('FLOWS_TO', 'TRANSFORMED_BY'))
    .until(has('field_name', targetField))
    .path()
    .by(valueMap('source_name', 'transformation_type', 'field_name'))
    .toList();
  
  return lineage;
}

// Example: Trace SSN from SSA to CRIS
// traceDataLineage(g, 'Social Security Administration', 'applicant_ssn')
```

**Find all systems accessing sensitive data**:
```javascript
async function findDataAccess(g, dataClassification = 'PII - Sensitive') {
  const accessLog = await g.V()
    .hasLabel('metadata_element')
    .has('classification', dataClassification)
    .in('ACCESSED_BY')
    .hasLabel('uscis_personnel')
    .group()
      .by('name')
      .by(count())
    .toList();
  
  return accessLog;
}
```

### Pattern 4: Resource Optimization

**Find underutilized officers**:
```javascript
async function findUnderutilizedOfficers(g, threshold = 0.6) {
  const officers = await g.V()
    .hasLabel('uscis_personnel')
    .where(
      g.project('utilization')
        .by(g.in('ASSIGNED_TO').count())
        .by('max_capacity')
        .math('a / b')
        .is(lt(threshold))
    )
    .valueMap(true)
    .toList();
  
  return officers;
}
```

**Optimize case assignments**:
```javascript
async function optimizeCaseAssignments(g) {
  // Find cases without assignments
  const unassignedCases = await g.V()
    .hasLabel('immigration_case')
    .has('status', 'Pending')
    .not(out('ASSIGNED_TO'))
    .toList();
  
  // Find officers with capacity
  const availableOfficers = await g.V()
    .hasLabel('uscis_personnel')
    .where(
      g.project('current', 'max')
        .by(g.in('ASSIGNED_TO').count())
        .by('max_capacity')
        .math('a < b')
    )
    .toList();
  
  // Match cases to officers by specialization
  const assignments = [];
  for (const caseVertex of unassignedCases) {
    const formType = caseVertex.properties.form_type;
    const matchedOfficer = availableOfficers.find(o => 
      o.properties.specialization.includes(formType)
    );
    
    if (matchedOfficer) {
      assignments.push({ case: caseVertex, officer: matchedOfficer });
    }
  }
  
  return assignments;
}
```

---

## Performance Optimization

### Indexing Strategy

```javascript
// Create composite indexes for frequent queries
mgmt.buildIndex('caseByReceiptAndStatus', Vertex.class)
  .addKey(receiptNumber)
  .addKey(status)
  .buildCompositeIndex();

// Create mixed indexes for full-text search
mgmt.buildIndex('caseFullText', Vertex.class)
  .addKey(applicantName, Mapping.TEXT.asParameter())
  .addKey(attorneyName, Mapping.TEXT.asParameter())
  .buildMixedIndex('search');

// Create edge indexes for relationship queries
mgmt.buildEdgeIndex(assignedTo, 'assignmentByDate', Direction.BOTH, Order.desc, assignmentDate);
```

### Query Optimization Techniques

**1. Use `.limit()` for large result sets**:
```javascript
// Bad: Returns all vertices
const allCases = await g.V().hasLabel('immigration_case').toList();

// Good: Limit results
const recentCases = await g.V()
  .hasLabel('immigration_case')
  .order().by('filing_date', desc)
  .limit(100)
  .toList();
```

**2. Use `.has()` filters early**:
```javascript
// Bad: Filter after traversal
const cases = await g.V()
  .out('FILED_BY')
  .hasLabel('applicant')
  .has('country_of_birth', 'Mexico')
  .toList();

// Good: Filter before traversal
const cases = await g.V()
  .hasLabel('applicant')
  .has('country_of_birth', 'Mexico')
  .in('FILED_BY')
  .toList();
```

**3. Use batch operations**:
```javascript
// Bad: Individual inserts
for (const caseData of cases) {
  await g.addV('immigration_case').property('receipt_number', caseData.id).next();
}

// Good: Batch insert
const batch = g.inject(cases).unfold().as('case')
  .addV('immigration_case')
  .property('receipt_number', select('case').values('id'))
  .iterate();
```

### Caching Configuration

```properties
# Enable query cache
cache.db-cache=true
cache.db-cache-time=180000  # 3 minutes
cache.db-cache-size=0.5     # 50% of heap

# Enable transaction cache
cache.tx-cache-size=20000
cache.tx-dirty-size=2000
```

---

## Security and Compliance

### Access Control Implementation

```javascript
// Role-based access control
async function checkAccess(g, userId, caseId) {
  const hasAccess = await g.V()
    .has('uscis_personnel', 'employee_id', userId)
    .out('HAS_ROLE')
    .out('HAS_PERMISSION')
    .out('GRANTS_ACCESS')
    .has('immigration_case', 'receipt_number', caseId)
    .hasNext();
  
  return hasAccess;
}

// Audit trail logging
async function logAccess(g, userId, resourceId, action) {
  await g.addV('access_log')
    .property('user_id', userId)
    .property('resource_id', resourceId)
    .property('action', action)
    .property('timestamp', new Date())
    .property('ip_address', getClientIP())
    .next();
}
```

### Data Encryption

```properties
# Enable encryption at rest
storage.cql.ssl.enabled=true
storage.cql.ssl.truststore.location=/path/to/truststore.jks
storage.cql.ssl.truststore.password=changeit

# Enable encryption in transit
gremlin.remote.driver.ssl.enabled=true
gremlin.remote.driver.ssl.trustCertChainFile=/path/to/cert.pem
```

### FISMA Compliance

**Required Controls**:
- ✅ Encryption at rest and in transit
- ✅ Role-based access control (RBAC)
- ✅ Audit logging for all operations
- ✅ Data retention policies
- ✅ Backup and disaster recovery
- ✅ Vulnerability scanning
- ✅ Penetration testing

---

## Monitoring and Operations

### Health Check Endpoint

```javascript
// health-check.js
async function checkJanusGraphHealth(g) {
  try {
    const start = Date.now();
    const count = await g.V().limit(1).count().next();
    const latency = Date.now() - start;
    
    return {
      status: 'healthy',
      latency_ms: latency,
      vertex_count: count.value,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Performance Metrics

```javascript
// metrics.js
async function collectMetrics(g) {
  const metrics = {
    vertex_count: await g.V().count().next(),
    edge_count: await g.E().count().next(),
    case_count: await g.V().hasLabel('immigration_case').count().next(),
    avg_query_time: await getAverageQueryTime(),
    cache_hit_rate: await getCacheHitRate(),
    storage_size_gb: await getStorageSize()
  };
  
  return metrics;
}
```

### Backup and Recovery

```bash
# Backup JanusGraph data
nodetool snapshot uscis_graph

# Restore from backup
nodetool refresh uscis_graph
```

---

## Integration with DSSS3 Platform

### REST API Endpoints

```javascript
// routes/janusgraph.js
const express = require('express');
const router = express.Router();

// GET /api/v1/janusgraph/policy-impact/:policyId
router.get('/policy-impact/:policyId', async (req, res) => {
  try {
    const impacts = await findPolicyImpacts(g, req.params.policyId);
    res.json({ success: true, data: impacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/janusgraph/fraud-detection
router.get('/fraud-detection', async (req, res) => {
  try {
    const fraudRings = await detectFraudRings(g);
    res.json({ success: true, data: fraudRings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/janusgraph/data-lineage/:field
router.get('/data-lineage/:field', async (req, res) => {
  try {
    const lineage = await traceDataLineage(g, req.query.source, req.params.field);
    res.json({ success: true, data: lineage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### React Component Integration

```typescript
// src/services/janusGraphService.ts
import api from './api';

export interface PolicyImpact {
  policy_id: string;
  affected_cases: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

class JanusGraphService {
  async getPolicyImpact(policyId: string): Promise<PolicyImpact> {
    const response = await api.get(`/janusgraph/policy-impact/${policyId}`);
    return response.data.data;
  }
  
  async detectFraud(): Promise<FraudRing[]> {
    const response = await api.get('/janusgraph/fraud-detection');
    return response.data.data;
  }
  
  async getDataLineage(source: string, field: string): Promise<LineagePath[]> {
    const response = await api.get(`/janusgraph/data-lineage/${field}`, {
      params: { source }
    });
    return response.data.data;
  }
}

export default new JanusGraphService();
```

---

## Troubleshooting Guide

### Common Issues

**Issue 1: Slow Query Performance**
```
Symptom: Queries taking >10 seconds
Diagnosis: Missing indexes or inefficient traversal
Solution: Add composite indexes, use .has() filters early
```

**Issue 2: Connection Timeouts**
```
Symptom: WebSocket connection errors
Diagnosis: Network issues or server overload
Solution: Increase connection pool size, check network latency
```

**Issue 3: Out of Memory Errors**
```
Symptom: JVM heap space errors
Diagnosis: Large result sets or memory leaks
Solution: Use .limit(), increase heap size, enable pagination
```

### Debug Mode

```javascript
// Enable query logging
const g = graph.traversal().withRemote(connection).with('evaluationTimeout', 30000);

// Log query execution plan
g.V().hasLabel('immigration_case').explain();
```

---

## Conclusion

This implementation guide provides the technical foundation for deploying JanusGraph on the USCIS DSSS3 program. Follow the phased approach, monitor performance metrics, and iterate based on user feedback.

**Next Steps**:
1. Complete 30-day proof of concept
2. Deploy Phase 1 infrastructure
3. Implement priority use cases
4. Scale to production volumes

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: September 30, 2025  
**Next Review**: October 30, 2025  
**Classification**: For Official Use Only (FOUO)

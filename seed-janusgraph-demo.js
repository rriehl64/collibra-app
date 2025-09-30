#!/usr/bin/env node

/**
 * JanusGraph Demo Data Seeding Script
 * 
 * This script creates sample graph data for demonstration purposes.
 * It creates a realistic data lineage and network topology graph
 * showing relationships between data assets, systems, processes, and users.
 */

const gremlin = require('gremlin');

// JanusGraph/Gremlin connection configuration
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

class JanusGraphSeeder {
  constructor() {
    this.gremlinUrl = process.env.GREMLIN_URL || 'ws://localhost:8182/gremlin';
    this.connection = null;
    this.graph = null;
    this.g = null;
    this.mockMode = false;
  }

  async initialize() {
    try {
      console.log('🔗 Connecting to JanusGraph/Gremlin server...');
      this.connection = new DriverRemoteConnection(this.gremlinUrl);
      this.graph = new Graph();
      this.g = this.graph.traversal().withRemote(this.connection);
      
      // Test connection
      await this.g.V().limit(1).toList();
      console.log('✅ Connected to JanusGraph successfully');
      
    } catch (error) {
      console.log('⚠️  JanusGraph not available, running in mock mode');
      console.log('   To use real JanusGraph, ensure it\'s running on:', this.gremlinUrl);
      this.mockMode = true;
    }
  }

  async seedDemoData() {
    if (this.mockMode) {
      console.log('📝 Mock mode - would create the following graph structure:');
      this.printMockStructure();
      return;
    }

    try {
      console.log('🚀 Starting JanusGraph demo data seeding...');
      
      // Clear existing demo data (optional)
      console.log('🗑️  Clearing existing demo data...');
      await this.g.V().has('demo', true).drop().iterate();
      await this.g.E().has('demo', true).drop().iterate();
      
      // Create vertices
      console.log('📊 Creating vertices...');
      const vertices = await this.createVertices();
      
      // Create edges
      console.log('🔗 Creating edges...');
      await this.createEdges(vertices);
      
      console.log('✅ JanusGraph demo data seeding completed successfully!');
      console.log('🎯 Access the visualization at: http://localhost:3008/admin/janusgraph');
      
    } catch (error) {
      console.error('❌ Error seeding demo data:', error);
      throw error;
    }
  }

  async createVertices() {
    const vertices = {};
    
    // Data Assets
    vertices.customerDb = await this.g.addV('data_asset')
      .property('name', 'Customer Database')
      .property('type', 'data_asset')
      .property('domain', 'Customer')
      .property('owner', 'Data Team')
      .property('status', 'active')
      .property('demo', true)
      .next();

    vertices.salesAnalytics = await this.g.addV('data_asset')
      .property('name', 'Sales Analytics')
      .property('type', 'data_asset')
      .property('domain', 'Sales')
      .property('owner', 'Analytics Team')
      .property('status', 'active')
      .property('demo', true)
      .next();

    vertices.marketingData = await this.g.addV('data_asset')
      .property('name', 'Marketing Data Warehouse')
      .property('type', 'data_asset')
      .property('domain', 'Marketing')
      .property('owner', 'Marketing Team')
      .property('status', 'active')
      .property('demo', true)
      .next();

    vertices.complianceReports = await this.g.addV('data_asset')
      .property('name', 'Compliance Reports')
      .property('type', 'data_asset')
      .property('domain', 'Compliance')
      .property('owner', 'Compliance Team')
      .property('status', 'active')
      .property('demo', true)
      .next();

    // Systems
    vertices.crmSystem = await this.g.addV('system')
      .property('name', 'CRM System')
      .property('type', 'system')
      .property('vendor', 'Salesforce')
      .property('environment', 'production')
      .property('demo', true)
      .next();

    vertices.dataWarehouse = await this.g.addV('system')
      .property('name', 'Enterprise Data Warehouse')
      .property('type', 'system')
      .property('vendor', 'Snowflake')
      .property('environment', 'production')
      .property('demo', true)
      .next();

    vertices.analyticsEngine = await this.g.addV('system')
      .property('name', 'Analytics Engine')
      .property('type', 'system')
      .property('vendor', 'Apache Spark')
      .property('environment', 'production')
      .property('demo', true)
      .next();

    // Processes
    vertices.etlPipeline = await this.g.addV('process')
      .property('name', 'Daily ETL Pipeline')
      .property('type', 'process')
      .property('frequency', 'daily')
      .property('owner', 'Data Engineering')
      .property('demo', true)
      .next();

    vertices.analyticsProcess = await this.g.addV('process')
      .property('name', 'Sales Analytics Process')
      .property('type', 'process')
      .property('frequency', 'hourly')
      .property('owner', 'Analytics Team')
      .property('demo', true)
      .next();

    vertices.complianceProcess = await this.g.addV('process')
      .property('name', 'Compliance Reporting')
      .property('type', 'process')
      .property('frequency', 'monthly')
      .property('owner', 'Compliance Team')
      .property('demo', true)
      .next();

    // Users
    vertices.dataAnalyst = await this.g.addV('user')
      .property('name', 'Alice Johnson')
      .property('type', 'user')
      .property('role', 'Data Analyst')
      .property('department', 'Analytics')
      .property('demo', true)
      .next();

    vertices.dataEngineer = await this.g.addV('user')
      .property('name', 'Bob Smith')
      .property('type', 'user')
      .property('role', 'Data Engineer')
      .property('department', 'Engineering')
      .property('demo', true)
      .next();

    vertices.businessUser = await this.g.addV('user')
      .property('name', 'Carol Davis')
      .property('type', 'user')
      .property('role', 'Business Analyst')
      .property('department', 'Sales')
      .property('demo', true)
      .next();

    // Applications
    vertices.dashboardApp = await this.g.addV('application')
      .property('name', 'Executive Dashboard')
      .property('type', 'application')
      .property('platform', 'Web')
      .property('owner', 'BI Team')
      .property('demo', true)
      .next();

    vertices.reportingApp = await this.g.addV('application')
      .property('name', 'Compliance Reporting App')
      .property('type', 'application')
      .property('platform', 'Web')
      .property('owner', 'Compliance Team')
      .property('demo', true)
      .next();

    console.log(`   ✅ Created ${Object.keys(vertices).length} vertices`);
    return vertices;
  }

  async createEdges(vertices) {
    const edges = [];
    
    // Data Flow Relationships
    edges.push(await this.g.V(vertices.crmSystem.value.id).addE('contains')
      .to(this.g.V(vertices.customerDb.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.customerDb.value.id).addE('processed_by')
      .to(this.g.V(vertices.etlPipeline.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.etlPipeline.value.id).addE('loads_into')
      .to(this.g.V(vertices.dataWarehouse.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.dataWarehouse.value.id).addE('feeds')
      .to(this.g.V(vertices.analyticsEngine.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.analyticsProcess.value.id).addE('produces')
      .to(this.g.V(vertices.salesAnalytics.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.analyticsProcess.value.id).addE('produces')
      .to(this.g.V(vertices.marketingData.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.complianceProcess.value.id).addE('produces')
      .to(this.g.V(vertices.complianceReports.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    // User Access Relationships
    edges.push(await this.g.V(vertices.dataAnalyst.value.id).addE('uses')
      .to(this.g.V(vertices.salesAnalytics.value.id))
      .property('type', 'access')
      .property('permission', 'read')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.dataAnalyst.value.id).addE('uses')
      .to(this.g.V(vertices.dashboardApp.value.id))
      .property('type', 'access')
      .property('permission', 'read')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.dataEngineer.value.id).addE('maintains')
      .to(this.g.V(vertices.etlPipeline.value.id))
      .property('type', 'ownership')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.businessUser.value.id).addE('uses')
      .to(this.g.V(vertices.dashboardApp.value.id))
      .property('type', 'access')
      .property('permission', 'read')
      .property('demo', true)
      .next());

    // System Dependencies
    edges.push(await this.g.V(vertices.analyticsEngine.value.id).addE('depends_on')
      .to(this.g.V(vertices.dataWarehouse.value.id))
      .property('type', 'dependency')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.dashboardApp.value.id).addE('reads_from')
      .to(this.g.V(vertices.salesAnalytics.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.reportingApp.value.id).addE('reads_from')
      .to(this.g.V(vertices.complianceReports.value.id))
      .property('type', 'data_flow')
      .property('demo', true)
      .next());

    // Process Execution Relationships
    edges.push(await this.g.V(vertices.analyticsEngine.value.id).addE('executes')
      .to(this.g.V(vertices.analyticsProcess.value.id))
      .property('type', 'execution')
      .property('demo', true)
      .next());

    edges.push(await this.g.V(vertices.dataWarehouse.value.id).addE('executes')
      .to(this.g.V(vertices.complianceProcess.value.id))
      .property('type', 'execution')
      .property('demo', true)
      .next());

    console.log(`   ✅ Created ${edges.length} edges`);
    return edges;
  }

  printMockStructure() {
    console.log(`
📊 DEMO GRAPH STRUCTURE:

VERTICES (15 total):
🗃️  Data Assets (4):
   - Customer Database
   - Sales Analytics  
   - Marketing Data Warehouse
   - Compliance Reports

🖥️  Systems (3):
   - CRM System (Salesforce)
   - Enterprise Data Warehouse (Snowflake)
   - Analytics Engine (Apache Spark)

⚙️  Processes (3):
   - Daily ETL Pipeline
   - Sales Analytics Process
   - Compliance Reporting

👥 Users (3):
   - Alice Johnson (Data Analyst)
   - Bob Smith (Data Engineer)
   - Carol Davis (Business Analyst)

📱 Applications (2):
   - Executive Dashboard
   - Compliance Reporting App

EDGES (15 total):
🔄 Data Flow: contains, processed_by, loads_into, feeds, produces, reads_from
👤 Access: uses, maintains
🔗 Dependencies: depends_on, executes

This creates a realistic data lineage showing how data flows from source systems
through processing pipelines to analytics and reporting applications.
    `);
  }

  async close() {
    if (this.connection && !this.mockMode) {
      await this.connection.close();
      console.log('🔌 JanusGraph connection closed');
    }
  }
}

// Main execution
const main = async () => {
  const seeder = new JanusGraphSeeder();
  
  try {
    await seeder.initialize();
    await seeder.seedDemoData();
    console.log('\n✅ JanusGraph demo seeding completed successfully!');
    console.log('🎯 Next steps:');
    console.log('   1. Start the application: npm run dev');
    console.log('   2. Navigate to: http://localhost:3008/admin/janusgraph');
    console.log('   3. Explore the interactive graph visualization');
    
  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
  } finally {
    await seeder.close();
    process.exit(0);
  }
};

if (require.main === module) {
  main();
}

module.exports = { JanusGraphSeeder };

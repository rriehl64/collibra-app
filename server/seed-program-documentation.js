const mongoose = require('mongoose');
const ProgramDocumentation = require('./models/ProgramDocumentation');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Data Inventory Program Documentation (proj-dg-1)
const dataInventoryProgramDoc = {
  projectId: 'proj-dg-1',
  projectName: 'Data Inventory Program',
  portfolioId: 'portfolio-data-governance',
  sections: [
    {
      id: 'goals',
      title: 'Program Goals & Objectives',
      icon: 'GpsFixed',
      status: 'Complete',
      priority: 'High',
      content: [
        'Conduct comprehensive cataloging and inventory of all USCIS data assets and sources',
        'Establish complete visibility into data holdings across all business units and systems',
        'Create standardized data asset metadata and classification framework',
        'Develop automated discovery tools for identifying and cataloging new data sources',
        'Ensure compliance with federal data inventory requirements and OMB guidelines'
      ]
    },
    {
      id: 'targets',
      title: 'Key Performance Targets',
      icon: 'Analytics',
      status: 'Complete',
      priority: 'High',
      content: [
        'Catalog 100% of USCIS data assets across all systems and repositories by Q3 2025',
        'Achieve 95% metadata completeness for all identified data sources',
        'Establish data lineage mapping for 90% of critical business processes',
        'Implement automated discovery tools covering 85% of enterprise systems',
        'Complete data classification for all sensitive and mission-critical datasets'
      ]
    },
    {
      id: 'sops',
      title: 'Standard Operating Procedures',
      icon: 'Assignment',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Asset Discovery and Registration Procedures (SOP-DI-001)',
        'Metadata Collection and Standardization (SOP-DI-002)',
        'Data Classification and Sensitivity Tagging (SOP-DI-003)',
        'Data Lineage Mapping and Documentation (SOP-DI-004)',
        'Data Inventory Maintenance and Updates (SOP-DI-005)'
      ]
    },
    {
      id: 'jobAids',
      title: 'Job Aids & Training Materials',
      icon: 'Help',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Data Discovery Tools User Manual',
        'Metadata Collection Templates and Guidelines',
        'Data Classification Quick Reference Card',
        'Data Lineage Mapping Toolkit',
        'Data Inventory Dashboard Training Guide'
      ]
    },
    {
      id: 'deliverables',
      title: 'Program Deliverables',
      icon: 'LocalShipping',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Comprehensive USCIS Data Asset Catalog',
        'Data Inventory Management System',
        'Automated Data Discovery Platform',
        'Data Classification and Tagging Framework',
        'Data Lineage Visualization Dashboard'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Data Analytics',
      icon: 'Analytics',
      status: 'Not Started',
      priority: 'Medium',
      content: [
        'AI-powered data asset discovery and classification',
        'Automated metadata extraction and enrichment',
        'Data usage analytics and access pattern monitoring',
        'Predictive modeling for data growth and storage planning',
        'Advanced search and discovery capabilities across data catalog'
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance Framework',
      icon: 'HighQuality',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Inventory Completeness and Accuracy Standards',
        'Metadata Quality Assessment Framework',
        'Data Classification Accuracy Validation Processes',
        'Automated Data Profiling and Statistical Analysis',
        'Inventory Quality Metrics and Reporting Dashboard'
      ]
    },
    {
      id: 'dataManagement',
      title: 'Data Management Processes',
      icon: 'Storage',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Asset Registration and Onboarding Processes',
        'Metadata Management and Standardization Framework',
        'Data Catalog Maintenance and Update Procedures',
        'Data Source Integration and Discovery Workflows',
        'Data Asset Lifecycle Management and Retirement Processes'
      ]
    },
    {
      id: 'governance',
      title: 'Data Governance Structure',
      icon: 'Security',
      status: 'Complete',
      priority: 'High',
      content: [
        'Data Inventory Governance Council and Oversight Structure',
        'Data Custodian and Steward Roles for Asset Management',
        'Data Asset Registration and Approval Workflows',
        'Data Inventory Compliance and Audit Framework',
        'Data Asset Access Control and Security Governance'
      ]
    },
    {
      id: 'reports',
      title: 'Reporting & Dashboards',
      icon: 'Assessment',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Data Inventory Completeness Executive Dashboard',
        'Data Asset Discovery and Registration Metrics',
        'Data Classification and Metadata Quality Reports',
        'Data Lineage Coverage and Mapping Status',
        'Data Catalog Usage and Access Analytics'
      ]
    }
  ]
};

// Data Standards Program Documentation (proj-dg-2)
const dataStandardsProgramDoc = {
  projectId: 'proj-dg-2',
  projectName: 'Data Standards Program',
  portfolioId: 'portfolio-data-governance',
  sections: [
    {
      id: 'goals',
      title: 'Program Goals & Objectives',
      icon: 'GpsFixed',
      status: 'Complete',
      priority: 'High',
      content: [
        'Establish enterprise-wide data standards, definitions, and governance policies',
        'Create standardized data models and schemas across all USCIS systems',
        'Implement consistent data naming conventions and business glossary',
        'Develop data quality rules and validation standards',
        'Ensure alignment with federal data standards and NIEM compliance'
      ]
    },
    {
      id: 'targets',
      title: 'Key Performance Targets',
      icon: 'Analytics',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Standardize 100% of critical data elements across enterprise systems by Q4 2025',
        'Achieve 95% compliance with established data naming conventions',
        'Implement data quality rules for 90% of mission-critical datasets',
        'Complete business glossary with 1000+ standardized data definitions',
        'Establish data governance policies covering all business domains'
      ]
    },
    {
      id: 'sops',
      title: 'Standard Operating Procedures',
      icon: 'Assignment',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Standards Development and Approval Process (SOP-DS-001)',
        'Data Model Design and Review Procedures (SOP-DS-002)',
        'Business Glossary Management and Maintenance (SOP-DS-003)',
        'Data Quality Rule Definition and Implementation (SOP-DS-004)',
        'Standards Compliance Monitoring and Enforcement (SOP-DS-005)'
      ]
    },
    {
      id: 'jobAids',
      title: 'Job Aids & Training Materials',
      icon: 'Help',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Data Modeling Standards Quick Reference Guide',
        'Business Glossary Contributor Training Manual',
        'Data Quality Rules Development Toolkit',
        'NIEM Compliance Checklist and Guidelines',
        'Data Standards Review and Approval Workflow Guide'
      ]
    },
    {
      id: 'deliverables',
      title: 'Program Deliverables',
      icon: 'LocalShipping',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Enterprise Data Standards Framework',
        'Comprehensive Business Glossary and Data Dictionary',
        'Standardized Data Models and Schema Repository',
        'Data Quality Rules Engine and Validation Framework',
        'Data Governance Policy Library and Compliance Dashboard'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Data Analytics',
      icon: 'Analytics',
      status: 'Not Started',
      priority: 'Medium',
      content: [
        'Automated data standards compliance monitoring and reporting',
        'Data quality metrics and trend analysis across enterprise',
        'Standards adoption tracking and usage analytics',
        'Predictive modeling for data quality improvement opportunities',
        'Cross-system data consistency analysis and recommendations'
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance Framework',
      icon: 'HighQuality',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Standards Quality Assessment and Validation Framework',
        'Business Glossary Accuracy and Completeness Standards',
        'Data Model Review and Approval Quality Gates',
        'Automated Standards Compliance Testing and Validation',
        'Quality Metrics Dashboard for Standards Adoption and Usage'
      ]
    },
    {
      id: 'dataManagement',
      title: 'Data Management Processes',
      icon: 'Storage',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Data Standards Lifecycle Management and Version Control',
        'Business Glossary Maintenance and Update Procedures',
        'Data Model Repository Management and Access Control',
        'Standards Integration with System Development Lifecycle',
        'Data Quality Rule Deployment and Monitoring Processes'
      ]
    },
    {
      id: 'governance',
      title: 'Data Governance Structure',
      icon: 'Security',
      status: 'Complete',
      priority: 'High',
      content: [
        'Data Standards Council and Decision-Making Authority',
        'Business Domain Expert Roles and Responsibilities',
        'Standards Review Board and Approval Workflows',
        'Data Quality Stewardship and Accountability Framework',
        'Standards Compliance Monitoring and Enforcement Structure'
      ]
    },
    {
      id: 'reports',
      title: 'Reporting & Dashboards',
      icon: 'Assessment',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Data Standards Adoption and Compliance Executive Dashboard',
        'Business Glossary Usage and Contribution Metrics',
        'Data Quality Standards Performance and Trend Reports',
        'Standards Implementation Progress and Milestone Tracking',
        'Cross-System Data Consistency and Standardization Reports'
      ]
    }
  ]
};

// SMRT Program Documentation (proj-dg-5)
const smrtProgramDoc = {
  projectId: 'proj-dg-5',
  projectName: 'SMRT Program',
  portfolioId: 'portfolio-data-governance',
  sections: [
    {
      id: 'goals',
      title: 'Program Goals & Objectives',
      icon: 'GpsFixed',
      status: 'Complete',
      priority: 'High',
      content: [
        'Implement Strategic Management and Reporting Technology for enhanced data-driven decision making',
        'Develop comprehensive executive dashboards and analytics capabilities',
        'Create real-time performance monitoring and strategic reporting framework',
        'Establish predictive analytics for strategic planning and resource allocation',
        'Enable data-driven strategic decision making across all USCIS leadership levels'
      ]
    },
    {
      id: 'targets',
      title: 'Key Performance Targets',
      icon: 'Analytics',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Deploy executive dashboards to 100% of senior leadership by Q2 2025',
        'Achieve 95% real-time data accuracy across all strategic reporting metrics',
        'Reduce strategic report generation time from weeks to hours (90% improvement)',
        'Implement predictive analytics covering 85% of key strategic indicators',
        'Establish automated alerting for 100% of critical performance thresholds'
      ]
    },
    {
      id: 'sops',
      title: 'Standard Operating Procedures',
      icon: 'Assignment',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Strategic Dashboard Design and Development Standards (SOP-SMRT-001)',
        'Executive Reporting Data Validation and Quality Assurance (SOP-SMRT-002)',
        'Performance Metrics Definition and Calculation Procedures (SOP-SMRT-003)',
        'Strategic Alert Configuration and Escalation Protocols (SOP-SMRT-004)',
        'Executive User Training and Support Procedures (SOP-SMRT-005)'
      ]
    },
    {
      id: 'jobAids',
      title: 'Job Aids & Training Materials',
      icon: 'Help',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Executive Dashboard User Guide and Navigation Manual',
        'Strategic KPI Interpretation and Analysis Training',
        'Performance Metrics Drill-Down and Root Cause Analysis Guide',
        'Mobile Dashboard Access and Security Protocols',
        'Strategic Reporting Best Practices and Guidelines'
      ]
    },
    {
      id: 'deliverables',
      title: 'Program Deliverables',
      icon: 'LocalShipping',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Executive Strategic Management Dashboard Suite',
        'Real-Time Performance Monitoring Platform',
        'Predictive Analytics and Forecasting Engine',
        'Automated Strategic Reporting Framework',
        'Mobile Executive Dashboard Application'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Data Analytics',
      icon: 'Analytics',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Predictive modeling for strategic planning and resource forecasting',
        'Advanced statistical analysis for performance trend identification',
        'Machine learning algorithms for anomaly detection in strategic metrics',
        'Natural language processing for automated report generation',
        'Real-time data streaming and complex event processing'
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance Framework',
      icon: 'HighQuality',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Strategic Data Quality Standards and Validation Rules',
        'Executive Dashboard Performance and Reliability Testing',
        'Data Accuracy Verification and Audit Procedures',
        'User Acceptance Testing Protocols for Executive Users',
        'Continuous Quality Monitoring and Improvement Processes'
      ]
    },
    {
      id: 'dataManagement',
      title: 'Data Management Processes',
      icon: 'Storage',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Strategic Data Integration and ETL Pipeline Management',
        'Executive Reporting Data Warehouse Design and Optimization',
        'Real-Time Data Streaming and Processing Architecture',
        'Historical Data Retention and Archival Strategies',
        'Data Security and Access Control for Executive Information'
      ]
    },
    {
      id: 'governance',
      title: 'Data Governance Structure',
      icon: 'Security',
      status: 'Complete',
      priority: 'High',
      content: [
        'Strategic Reporting Governance Council and Executive Oversight',
        'Data Stewardship for Executive Information and Strategic Metrics',
        'Performance Metrics Approval and Change Management Workflows',
        'Executive Data Access Control and Security Governance',
        'Strategic Information Classification and Handling Procedures'
      ]
    },
    {
      id: 'reports',
      title: 'Reporting & Dashboards',
      icon: 'Assessment',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Executive Strategic Performance Scorecard',
        'Real-Time Operational Excellence Dashboard',
        'Predictive Analytics and Forecasting Reports',
        'Strategic Initiative Progress and Milestone Tracking',
        'Executive Mobile Dashboard and Alert System'
      ]
    }
  ]
};

// NEIMS Program Documentation (proj-dg-6)
const neimsProgramDoc = {
  projectId: 'proj-dg-6',
  projectName: 'NEIMS Program',
  portfolioId: 'portfolio-data-governance',
  sections: [
    {
      id: 'goals',
      title: 'Program Goals & Objectives',
      icon: 'GpsFixed',
      status: 'Complete',
      priority: 'High',
      content: [
        'Implement National Enterprise Information Management System for integrated data operations',
        'Create unified information architecture across all USCIS business units',
        'Establish enterprise-wide information sharing and collaboration platform',
        'Develop comprehensive information lifecycle management capabilities',
        'Enable seamless information access and retrieval across the enterprise'
      ]
    },
    {
      id: 'targets',
      title: 'Key Performance Targets',
      icon: 'Analytics',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Integrate 100% of USCIS information systems into unified NEIMS platform by Q3 2025',
        'Achieve 98% information availability and accessibility across all business units',
        'Reduce information retrieval time by 85% through automated search and discovery',
        'Implement enterprise-wide information sharing for 95% of business processes',
        'Establish comprehensive audit trail for 100% of information access and usage'
      ]
    },
    {
      id: 'sops',
      title: 'Standard Operating Procedures',
      icon: 'Assignment',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Enterprise Information Integration and Onboarding (SOP-NEIMS-001)',
        'Information Classification and Security Tagging (SOP-NEIMS-002)',
        'Cross-System Information Sharing Protocols (SOP-NEIMS-003)',
        'Information Lifecycle Management and Retention (SOP-NEIMS-004)',
        'Enterprise Search and Discovery Optimization (SOP-NEIMS-005)'
      ]
    },
    {
      id: 'jobAids',
      title: 'Job Aids & Training Materials',
      icon: 'Help',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'NEIMS Platform User Guide and Navigation Manual',
        'Enterprise Information Search and Discovery Training',
        'Cross-System Information Sharing Best Practices',
        'Information Security and Compliance Guidelines',
        'Advanced NEIMS Features and Collaboration Tools Training'
      ]
    },
    {
      id: 'deliverables',
      title: 'Program Deliverables',
      icon: 'LocalShipping',
      status: 'In Progress',
      priority: 'High',
      content: [
        'National Enterprise Information Management Platform',
        'Unified Information Architecture and Integration Framework',
        'Enterprise Information Search and Discovery Engine',
        'Cross-System Information Sharing and Collaboration Portal',
        'Comprehensive Information Lifecycle Management System'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Data Analytics',
      icon: 'Analytics',
      status: 'Not Started',
      priority: 'Medium',
      content: [
        'Information usage analytics and access pattern monitoring',
        'Predictive modeling for information demand and capacity planning',
        'Advanced search analytics and query optimization',
        'Information relationship mapping and network analysis',
        'Automated content categorization and intelligent tagging'
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance Framework',
      icon: 'HighQuality',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Enterprise Information Quality Standards and Validation',
        'Cross-System Integration Testing and Validation Procedures',
        'Information Accuracy and Completeness Verification',
        'User Experience Testing for Enterprise Information Access',
        'Performance and Scalability Testing for NEIMS Platform'
      ]
    },
    {
      id: 'dataManagement',
      title: 'Data Management Processes',
      icon: 'Storage',
      status: 'In Progress',
      priority: 'High',
      content: [
        'Enterprise Information Repository Design and Management',
        'Cross-System Data Integration and Synchronization',
        'Information Backup and Disaster Recovery Procedures',
        'Enterprise Information Security and Access Control',
        'Information Archival and Long-Term Preservation Strategies'
      ]
    },
    {
      id: 'governance',
      title: 'Data Governance Structure',
      icon: 'Security',
      status: 'Complete',
      priority: 'High',
      content: [
        'Enterprise Information Management Governance Council',
        'Cross-System Information Stewardship and Accountability',
        'Information Sharing Policy Development and Approval',
        'Enterprise Information Security and Compliance Framework',
        'Information Access Control and Authorization Management'
      ]
    },
    {
      id: 'reports',
      title: 'Reporting & Dashboards',
      icon: 'Assessment',
      status: 'In Progress',
      priority: 'Medium',
      content: [
        'Enterprise Information Usage and Access Analytics Dashboard',
        'Cross-System Integration Status and Performance Reports',
        'Information Quality and Completeness Metrics',
        'Enterprise Search Performance and Optimization Reports',
        'Information Lifecycle and Retention Compliance Tracking'
      ]
    }
  ]
};

const seedProgramDocumentation = async () => {
  try {
    await connectDB();

    // Clear existing documentation
    await ProgramDocumentation.deleteMany({});
    console.log('Cleared existing program documentation');

    // Insert Data Inventory Program documentation
    const doc1 = await ProgramDocumentation.create(dataInventoryProgramDoc);
    console.log('Created Data Inventory Program documentation:', doc1.projectName);

    // Insert Data Standards Program documentation
    const doc2 = await ProgramDocumentation.create(dataStandardsProgramDoc);
    console.log('Created Data Standards Program documentation:', doc2.projectName);

    // Insert SMRT Program documentation
    const doc3 = await ProgramDocumentation.create(smrtProgramDoc);
    console.log('Created SMRT Program documentation:', doc3.projectName);

    // Insert NEIMS Program documentation
    const doc4 = await ProgramDocumentation.create(neimsProgramDoc);
    console.log('Created NEIMS Program documentation:', doc4.projectName);

    console.log('Program documentation seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding program documentation:', error);
    process.exit(1);
  }
};

seedProgramDocumentation();

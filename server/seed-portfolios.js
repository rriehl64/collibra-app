const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Portfolio = require('./models/Portfolio');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// USCIS Portfolio Data
const portfolioData = [
  {
    id: 'portfolio-data-request',
    name: 'Data Request Management Portfolio',
    description: 'Structured processes for handling data requests, operational data sharing, and resolution of data-related issues across USCIS using specialized tools, policies, and frameworks to support efficient, compliant, and transparent data operations',
    manager: 'Jennifer Martinez',
    totalBudget: '$2.1M',
    status: 'Active',
    currentState: 'SRMT-based request tracking, NIEM data standards, manual routing processes with 5-day average turnaround',
    futureState: 'AI-enhanced SRMT workflows, automated NIEM compliance, real-time interagency data sharing with <24hr turnaround',
    aiReadiness: 68,
    kpis: [
      { name: 'Request Turnaround Time', current: 4.2, target: 1.0, unit: ' days', trend: 'down', status: 'warning' },
      { name: 'NIEM Compliance Rate', current: 89, target: 98, unit: '%', trend: 'up', status: 'good' },
      { name: 'SRMT Automation Rate', current: 42, target: 85, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Interagency Data Sharing', current: 76, target: 95, unit: '%', trend: 'up', status: 'good' },
      { name: 'Privacy Compliance Score', current: 94, target: 99, unit: '%', trend: 'stable', status: 'good' }
    ],
    okr: {
      objective: 'Transform USCIS data request management into a fully integrated, AI-enhanced, compliant operational framework that ensures efficient processing, maintains privacy standards, and supports interagency collaboration through automated SRMT workflows, standardized NIEM compliance, and real-time data sharing capabilities.',
      keyResults: [
        { description: 'Reduce average request turnaround time through AI-enhanced SRMT routing', current: 4.2, target: 1.0, unit: ' days' },
        { description: 'Achieve automated NIEM compliance validation across all data exchanges', current: 89, target: 98, unit: '%' },
        { description: 'Implement real-time interagency data sharing with privacy-by-design', current: 76, target: 95, unit: '%' },
        { description: 'Deploy expedite request intelligence for humanitarian cases', current: 0, target: 100, unit: '%' }
      ]
    },
    risks: [
      { id: 'dr-r1', title: 'SRMT Legacy Integration', level: 'High', category: 'Technical', mitigation: 'Phased migration approach with parallel systems', owner: 'Alex Thompson' },
      { id: 'dr-r2', title: 'NIEM Standard Compliance', level: 'Medium', category: 'Compliance', mitigation: 'Automated NIEM validation tools', owner: 'Maria Santos' },
      { id: 'dr-r3', title: 'Privacy Impact Assessment Delays', level: 'High', category: 'Compliance', mitigation: 'Streamlined PIA process with templates', owner: 'David Chen' },
      { id: 'dr-r4', title: 'Interagency Data Sharing Security', level: 'Critical', category: 'Security', mitigation: 'Enhanced encryption and access controls', owner: 'Sarah Johnson' },
      { id: 'dr-r5', title: 'CHAMPS Integration Complexity', level: 'Medium', category: 'Technical', mitigation: 'Dedicated integration team', owner: 'Michael Brown' }
    ],
    innovations: [
      { id: 'dr-i1', title: 'AI-Enhanced SRMT Routing', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'Machine learning algorithms to automatically route and prioritize data requests based on complexity, urgency, and resource availability' },
      { id: 'dr-i2', title: 'Predictive Request Volume Analytics', type: 'Analytics', impact: 'High', aiFirst: true, description: 'AI-powered forecasting for request volumes during high-impact events like Operation Allies Welcome' },
      { id: 'dr-i3', title: 'Automated NIEM Compliance Validation', type: 'Automation', impact: 'Medium', aiFirst: false, description: 'Automated validation tools ensuring all data exchanges meet NIEM standards before processing' },
      { id: 'dr-i4', title: 'Intelligent Expedite Request Processing', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'AI system to automatically identify and fast-track humanitarian and government error expedite requests' },
      { id: 'dr-i5', title: 'Cross-System Data Reconciliation', type: 'Automation', impact: 'Medium', aiFirst: false, description: 'Automated reconciliation between SRMT, CRIS, and CHAMPS systems to ensure data consistency' }
    ],
    milestones: [
      {
        id: 'dr-m1',
        title: 'SRMT AI Enhancement Deployment',
        description: 'Deploy AI-powered routing and prioritization system within existing SRMT infrastructure',
        dueDate: '2025-06-15',
        status: 'In Progress',
        priority: 'High',
        owner: 'Alex Thompson',
        portfolioId: 'portfolio-data-request',
        deliverables: ['AI Routing Engine', 'Priority Algorithm', 'Dashboard Integration', 'User Training'],
        riskLevel: 'Medium'
      },
      {
        id: 'dr-m2',
        title: 'NIEM Compliance Automation',
        description: 'Implement automated NIEM validation and compliance checking for all data exchanges',
        dueDate: '2025-08-30',
        status: 'Not Started',
        priority: 'High',
        owner: 'Maria Santos',
        portfolioId: 'portfolio-data-request',
        deliverables: ['NIEM Validator', 'Compliance Dashboard', 'Error Reporting', 'Documentation'],
        riskLevel: 'Low'
      },
      {
        id: 'dr-m3',
        title: 'CRIS-CHAMPS Integration Platform',
        description: 'Develop integrated platform connecting CRIS and CHAMPS systems for seamless data flow',
        dueDate: '2025-09-15',
        status: 'Not Started',
        priority: 'Medium',
        owner: 'Michael Brown',
        portfolioId: 'portfolio-data-request',
        deliverables: ['Integration API', 'Data Mapping', 'Security Framework', 'Testing Suite'],
        riskLevel: 'High'
      },
      {
        id: 'dr-m4',
        title: 'Privacy Impact Assessment Automation',
        description: 'Automate PIA processes to reduce delays and ensure compliance with privacy requirements',
        dueDate: '2025-07-31',
        status: 'Not Started',
        priority: 'High',
        owner: 'David Chen',
        portfolioId: 'portfolio-data-request',
        deliverables: ['PIA Template Engine', 'Automated Assessment', 'Compliance Tracker', 'Reporting Tool'],
        riskLevel: 'Medium'
      },
      {
        id: 'dr-m5',
        title: 'Expedite Request Intelligence System',
        description: 'Deploy AI system to automatically identify and process humanitarian and government error cases for expedited handling',
        dueDate: '2025-10-15',
        status: 'Not Started',
        priority: 'High',
        owner: 'Michael Brown',
        portfolioId: 'portfolio-data-request',
        deliverables: ['AI Classification Model', 'Expedite Workflow', 'Case Tracking System', 'Reporting Dashboard'],
        riskLevel: 'Medium'
      }
    ],
    projects: [
      {
        id: 'proj-dr-1',
        name: 'Service Request Management Tool (SRMT) Enhancement Program',
        status: 'In Progress',
        progress: 75,
        manager: 'Alex Thompson',
        startDate: '2025-01-15',
        endDate: '2025-08-30',
        budget: '$450K',
        description: 'Enhancing SRMT platform for logging, tracking, and routing unresolved requests to appropriate service centers with AI-powered workflow optimization and self-service capabilities'
      },
      {
        id: 'proj-dr-2',
        name: 'NIEM-Compliant Operational Data Sharing Program',
        status: 'In Progress',
        progress: 85,
        manager: 'Maria Santos',
        startDate: '2024-10-01',
        endDate: '2025-09-30',
        budget: '$380K',
        description: 'Implementing NIEM-compliant data sharing protocols for operational data exchange with federal, state, and local partners while maintaining privacy and security standards'
      },
      {
        id: 'proj-dr-3',
        name: 'CRIS-CHAMPS Integration & Issue Resolution Program',
        status: 'Planning',
        progress: 25,
        manager: 'Michael Brown',
        startDate: '2025-03-01',
        endDate: '2025-12-15',
        budget: '$520K',
        description: 'Integrating Customer Relationship Interface System (CRIS) with Correspondence Handling and Management Planning System (CHAMPS) to streamline issue resolution and improve customer service delivery'
      }
    ]
  },
  {
    id: 'portfolio-data-governance',
    name: 'Data Governance Portfolio',
    description: 'Comprehensive data governance framework ensuring data quality, compliance, and strategic alignment across USCIS operations',
    manager: 'Robert Chen',
    totalBudget: '$3.5M',
    status: 'Active',
    currentState: 'Manual governance processes, distributed data stewardship, compliance tracking through spreadsheets',
    futureState: 'Automated governance workflows, centralized data catalog, AI-driven compliance monitoring',
    aiReadiness: 72,
    kpis: [
      { name: 'Data Quality Score', current: 87, target: 95, unit: '%', trend: 'up', status: 'good' },
      { name: 'Compliance Rate', current: 92, target: 98, unit: '%', trend: 'up', status: 'good' },
      { name: 'Data Catalog Coverage', current: 65, target: 90, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Governance Automation', current: 35, target: 80, unit: '%', trend: 'up', status: 'warning' }
    ],
    okr: {
      objective: 'Establish a comprehensive, AI-enhanced data governance framework that ensures data quality, regulatory compliance, and strategic data utilization across all USCIS operations.',
      keyResults: [
        { description: 'Implement automated data quality monitoring across all systems', current: 87, target: 95, unit: '%' },
        { description: 'Achieve full regulatory compliance through automated monitoring', current: 92, target: 98, unit: '%' },
        { description: 'Complete enterprise data catalog with AI-powered discovery', current: 65, target: 90, unit: '%' },
        { description: 'Automate governance workflows and policy enforcement', current: 35, target: 80, unit: '%' }
      ]
    },
    risks: [
      { id: 'dg-r1', title: 'Legacy System Integration', level: 'High', category: 'Technical', mitigation: 'Phased integration approach', owner: 'Technical Team' },
      { id: 'dg-r2', title: 'Data Privacy Compliance', level: 'Critical', category: 'Compliance', mitigation: 'Enhanced privacy controls', owner: 'Compliance Team' },
      { id: 'dg-r3', title: 'Resource Constraints', level: 'Medium', category: 'Organizational', mitigation: 'Prioritized implementation', owner: 'Program Manager' }
    ],
    innovations: [
      { id: 'dg-i1', title: 'AI-Powered Data Discovery', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'Automated discovery and classification of data assets' },
      { id: 'dg-i2', title: 'Intelligent Data Lineage Tracking', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'AI-driven data lineage and impact analysis' },
      { id: 'dg-i3', title: 'Automated Compliance Monitoring', type: 'Automation', impact: 'Medium', aiFirst: false, description: 'Real-time compliance monitoring and alerting' }
    ],
    milestones: [
      {
        id: 'dg-m1',
        title: 'Data Catalog Implementation',
        description: 'Deploy enterprise data catalog with automated discovery',
        dueDate: '2025-08-15',
        status: 'In Progress',
        priority: 'High',
        owner: 'Robert Chen',
        portfolioId: 'portfolio-data-governance',
        deliverables: ['Data Catalog Platform', 'Discovery Engine', 'Metadata Management'],
        riskLevel: 'Medium'
      }
    ],
    projects: [
      {
        id: 'proj-dg-1',
        name: 'Enterprise Data Governance Platform',
        status: 'In Progress',
        progress: 60,
        manager: 'Robert Chen',
        startDate: '2024-09-01',
        endDate: '2025-12-31',
        budget: '$1.2M',
        description: 'Implementation of comprehensive data governance platform'
      },
      {
        id: 'proj-dg-2',
        name: 'Data Quality Management System',
        status: 'Planning',
        progress: 20,
        manager: 'Sarah Wilson',
        startDate: '2025-02-01',
        endDate: '2025-11-30',
        budget: '$800K',
        description: 'Automated data quality monitoring and remediation system'
      },
      {
        id: 'proj-dg-3',
        name: 'Privacy and Compliance Automation',
        status: 'In Progress',
        progress: 45,
        manager: 'David Miller',
        startDate: '2024-11-01',
        endDate: '2025-10-31',
        budget: '$950K',
        description: 'Automated privacy impact assessments and compliance monitoring'
      },
      {
        id: 'proj-dg-4',
        name: 'Data Stewardship Program',
        status: 'In Progress',
        progress: 70,
        manager: 'Lisa Garcia',
        startDate: '2024-08-01',
        endDate: '2025-07-31',
        budget: '$550K',
        description: 'Comprehensive data stewardship training and certification program'
      }
    ]
  }
];

// Seed function
const seedPortfolios = async () => {
  try {
    console.log('🌱 Starting portfolio seeding...');
    
    // Clear existing portfolios
    await Portfolio.deleteMany({});
    console.log('✅ Cleared existing portfolios');
    
    // Insert new portfolios
    const createdPortfolios = await Portfolio.insertMany(portfolioData);
    console.log(`✅ Created ${createdPortfolios.length} portfolios`);
    
    // Log created portfolios
    createdPortfolios.forEach(portfolio => {
      console.log(`   📁 ${portfolio.name} (${portfolio.id})`);
      console.log(`      - KPIs: ${portfolio.kpis?.length || 0}`);
      console.log(`      - Risks: ${portfolio.risks?.length || 0}`);
      console.log(`      - Innovations: ${portfolio.innovations?.length || 0}`);
      console.log(`      - Projects: ${portfolio.projects?.length || 0}`);
      console.log(`      - Milestones: ${portfolio.milestones?.length || 0}`);
    });
    
    console.log('🎉 Portfolio seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding portfolios:', error);
    process.exit(1);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedPortfolios();
};

// Check if this file is being run directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedPortfolios, portfolioData };

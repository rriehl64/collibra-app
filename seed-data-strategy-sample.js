const mongoose = require('mongoose');
const DataStrategyPriority = require('./server/models/DataStrategyPriority');
const TeamMember = require('./server/models/TeamMember');
const DataStrategyEpic = require('./server/models/DataStrategyEpic');
require('dotenv').config();

// Connect to MongoDB (use same connection as server)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleTeamMembers = [
  {
    employeeId: 'EMP001',
    name: { firstName: 'Sarah', lastName: 'Johnson' },
    email: 'sarah.johnson@uscis.gov',
    role: 'Data Architect',
    title: 'Senior Data Architect',
    branch: 'Data Management',
    division: 'Data Strategy Program',
    skills: [
      { skillName: 'SQL', proficiency: 'Expert', certified: true },
      { skillName: 'Data Modeling', proficiency: 'Expert', certified: true },
      { skillName: 'Python', proficiency: 'Advanced', certified: false },
      { skillName: 'ETL', proficiency: 'Advanced', certified: true }
    ],
    capacity: { fteAllocation: 1.0, hoursPerWeek: 40, availableHours: 40 },
    currentAssignments: [],
    isActive: true,
    startDate: new Date('2023-01-15')
  },
  {
    employeeId: 'EMP002',
    name: { firstName: 'Michael', lastName: 'Chen' },
    email: 'michael.chen@uscis.gov',
    role: 'Business Analyst',
    title: 'Senior Business Analyst',
    branch: 'Business Intelligence',
    division: 'Data Strategy Program',
    skills: [
      { skillName: 'Business Analysis', proficiency: 'Expert', certified: true },
      { skillName: 'Tableau', proficiency: 'Advanced', certified: true },
      { skillName: 'SQL', proficiency: 'Advanced', certified: false },
      { skillName: 'Agile/Scrum', proficiency: 'Advanced', certified: true }
    ],
    capacity: { fteAllocation: 1.0, hoursPerWeek: 40, availableHours: 32 },
    currentAssignments: [
      {
        priorityName: 'Dashboard Modernization',
        allocation: 20,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-31'),
        hoursAllocated: 8
      }
    ],
    isActive: true,
    startDate: new Date('2022-08-01')
  },
  {
    employeeId: 'EMP003',
    name: { firstName: 'Emily', lastName: 'Rodriguez' },
    email: 'emily.rodriguez@uscis.gov',
    role: 'Data Scientist',
    title: 'Data Scientist II',
    branch: 'Data Science',
    division: 'Data Strategy Program',
    skills: [
      { skillName: 'Python', proficiency: 'Expert', certified: true },
      { skillName: 'Machine Learning', proficiency: 'Advanced', certified: true },
      { skillName: 'R', proficiency: 'Advanced', certified: false },
      { skillName: 'Statistics', proficiency: 'Expert', certified: true }
    ],
    capacity: { fteAllocation: 1.0, hoursPerWeek: 40, availableHours: 24 },
    currentAssignments: [
      {
        priorityName: 'ML Model Development',
        allocation: 40,
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-11-30'),
        hoursAllocated: 16
      }
    ],
    isActive: true,
    startDate: new Date('2023-03-10')
  }
];

const sampleEpics = [
  {
    epicId: 'EPIC-DM-001',
    title: 'Master Data Management',
    description: 'Establish comprehensive master data management capabilities across USCIS data assets',
    area: 'Data Management',
    businessValue: 'Ensures consistent, trusted data for stakeholders, supporting regulatory and operational activities.',
    stories: [
      {
        storyId: 'DM-001-1',
        title: 'Define and catalog critical data elements',
        description: 'Identify and document critical data elements across all USCIS systems',
        businessValue: 'Provides foundation for data governance and quality initiatives',
        storyPoints: 8,
        priority: 'High',
        status: 'In Progress',
        assignee: 'Sarah Johnson',
        estimatedHours: 40,
        actualHours: 24
      },
      {
        storyId: 'DM-001-2',
        title: 'Develop and implement data quality business rules',
        description: 'Create automated data quality rules and validation processes',
        businessValue: 'Improves decision accuracy by reducing errors and enabling automated quality checks',
        storyPoints: 13,
        priority: 'High',
        status: 'Backlog',
        estimatedHours: 80,
        actualHours: 0
      }
    ],
    status: 'In Progress',
    priority: 'High',
    targetQuarter: 'Q4 2025',
    createdBy: 'Data Strategy Program Manager',
    lastModifiedBy: 'Sarah Johnson'
  },
  {
    epicId: 'EPIC-BI-001',
    title: 'USCIS BI Platform Enhancement',
    description: 'Modernize and enhance the USCIS Business Intelligence platform with improved accessibility and functionality',
    area: 'Business Intelligence',
    businessValue: 'Guarantees accessibility and inclusivity, mitigating legal and mission risk while improving user experience.',
    stories: [
      {
        storyId: 'BI-001-1',
        title: 'Develop WCAG-compliant dashboard templates',
        description: 'Create accessible dashboard templates meeting Section 508 requirements',
        businessValue: 'Ensures compliance and accessibility for all users',
        storyPoints: 5,
        priority: 'Critical',
        status: 'Done',
        assignee: 'Michael Chen',
        estimatedHours: 32,
        actualHours: 28
      },
      {
        storyId: 'BI-001-2',
        title: 'Launch multi-role dashboard interfaces',
        description: 'Implement role-based dashboard views for different user types',
        businessValue: 'Aligns visualizations with user needs, increasing adoption and value realization',
        storyPoints: 8,
        priority: 'High',
        status: 'In Progress',
        assignee: 'Michael Chen',
        estimatedHours: 48,
        actualHours: 16
      }
    ],
    status: 'In Progress',
    priority: 'Critical',
    targetQuarter: 'Q1 2026',
    createdBy: 'Data Strategy Program Manager',
    lastModifiedBy: 'Michael Chen'
  }
];

const samplePriorities = [
  {
    priorityName: 'Enterprise Data Quality Framework Implementation',
    description: 'Implement a comprehensive data quality framework across all USCIS data systems to ensure data accuracy, completeness, and consistency for mission-critical operations.',
    strategicGoal: 'Data Management',
    owner: 'Sarah Johnson',
    branch: 'Data Management',
    dueDate: new Date('2025-12-31'),
    urgency: 'High',
    status: 'In Progress',
    loeEstimate: { hours: 320, size: 'XL' },
    requiredSkills: ['Data Quality Management', 'SQL', 'ETL', 'Data Governance', 'Business Analysis'],
    complexity: 'High',
    riskFactors: ['Integration complexity with legacy systems', 'Resource availability', 'Stakeholder alignment'],
    estimatedValue: 'High',
    businessValue: 'Ensures consistent, trusted data for stakeholders, supporting regulatory compliance and operational efficiency. Reduces manual data validation effort by 60% and improves decision-making accuracy.',
    deliverables: [
      'Data Quality Assessment Report',
      'Quality Rules Documentation',
      'Automated Quality Monitoring Dashboard',
      'Data Steward Training Materials'
    ],
    dependencies: ['Master Data Management initiative', 'Data Governance Council approval'],
    stakeholders: ['Data Governance Council', 'IT Operations', 'Business Units', 'Compliance Team'],
    assignedTeam: [
      { memberName: 'Sarah Johnson', allocation: 60 },
      { memberName: 'Michael Chen', allocation: 30 }
    ],
    epic: 'Master Data Management',
    stories: [
      {
        storyId: 'DQF-001',
        title: 'Conduct data quality assessment',
        description: 'Assess current state of data quality across key systems',
        status: 'Completed',
        assignee: 'Sarah Johnson',
        estimatedHours: 80
      },
      {
        storyId: 'DQF-002',
        title: 'Design quality monitoring framework',
        description: 'Design automated quality monitoring and alerting system',
        status: 'In Progress',
        assignee: 'Sarah Johnson',
        estimatedHours: 120
      }
    ],
    progressNotes: [
      {
        date: new Date('2025-09-15'),
        note: 'Completed initial data quality assessment. Identified 15 critical data quality issues across 8 systems.',
        author: 'Sarah Johnson'
      },
      {
        date: new Date('2025-09-10'),
        note: 'Stakeholder interviews completed. Requirements gathering phase finished.',
        author: 'Michael Chen'
      }
    ],
    createdBy: 'Data Strategy Program Manager',
    lastModifiedBy: 'Sarah Johnson'
  },
  {
    priorityName: 'AI-Powered Case Processing Automation',
    description: 'Develop and implement machine learning models to automate routine case processing tasks, reducing manual effort and improving processing times.',
    strategicGoal: 'Streamline Case Processing',
    owner: 'Emily Rodriguez',
    branch: 'Data Science',
    dueDate: new Date('2026-03-31'),
    urgency: 'Medium',
    status: 'Pending',
    loeEstimate: { hours: 480, size: 'XL' },
    requiredSkills: ['Machine Learning', 'Python', 'Natural Language Processing', 'Model Deployment', 'Data Engineering'],
    complexity: 'High',
    riskFactors: ['Model accuracy requirements', 'Regulatory approval process', 'Data privacy concerns'],
    estimatedValue: 'High',
    businessValue: 'Speeds adjudication and directs high-skill staff to cases with the most impact. Projected to reduce processing time by 40% for routine cases and improve resource allocation efficiency.',
    deliverables: [
      'ML Model Development Framework',
      'Automated Case Triage System',
      'Model Performance Monitoring Dashboard',
      'Deployment and Maintenance Documentation'
    ],
    dependencies: ['Data pipeline modernization', 'Security clearance for ML platform'],
    stakeholders: ['Case Processing Teams', 'IT Security', 'Legal Affairs', 'Field Operations'],
    assignedTeam: [
      { memberName: 'Emily Rodriguez', allocation: 80 }
    ],
    epic: 'Case Automation',
    stories: [],
    progressNotes: [
      {
        date: new Date('2025-09-12'),
        note: 'Initial project scoping completed. Identified 3 high-value use cases for automation.',
        author: 'Emily Rodriguez'
      }
    ],
    createdBy: 'Data Strategy Program Manager',
    lastModifiedBy: 'Emily Rodriguez'
  },
  {
    priorityName: 'Real-time Performance Analytics Dashboard',
    description: 'Create executive-level dashboard providing real-time insights into USCIS operational performance metrics and KPIs.',
    strategicGoal: 'Business Intelligence',
    owner: 'Michael Chen',
    branch: 'Business Intelligence',
    dueDate: new Date('2025-11-30'),
    urgency: 'Medium',
    status: 'In Progress',
    loeEstimate: { hours: 160, size: 'L' },
    requiredSkills: ['Tableau', 'SQL', 'Data Visualization', 'Business Analysis', 'Dashboard Design'],
    complexity: 'Medium',
    riskFactors: ['Data source integration challenges', 'Performance requirements'],
    estimatedValue: 'Medium',
    businessValue: 'Provides stakeholders with the best, most up-to-date operational intelligence. Enables data-driven decision making and improves transparency for leadership.',
    deliverables: [
      'Executive Performance Dashboard',
      'Mobile-responsive Interface',
      'Automated Report Generation',
      'User Training Materials'
    ],
    dependencies: ['Data warehouse updates', 'Executive requirements finalization'],
    stakeholders: ['Executive Leadership', 'Operations Management', 'Field Directors'],
    assignedTeam: [
      { memberName: 'Michael Chen', allocation: 50 }
    ],
    epic: 'USCIS BI Platform Enhancement',
    stories: [
      {
        storyId: 'RTD-001',
        title: 'Design dashboard wireframes',
        description: 'Create wireframes and mockups for executive dashboard',
        status: 'Completed',
        assignee: 'Michael Chen',
        estimatedHours: 24
      },
      {
        storyId: 'RTD-002',
        title: 'Implement core metrics visualization',
        description: 'Build visualizations for key performance indicators',
        status: 'In Progress',
        assignee: 'Michael Chen',
        estimatedHours: 80
      }
    ],
    progressNotes: [
      {
        date: new Date('2025-09-14'),
        note: 'Dashboard wireframes approved by executive stakeholders. Moving to development phase.',
        author: 'Michael Chen'
      }
    ],
    createdBy: 'Data Strategy Program Manager',
    lastModifiedBy: 'Michael Chen'
  }
];

async function seedDataStrategyData() {
  try {
    console.log('🌱 Seeding Data Strategy Planning sample data...');
    
    // Clear existing data
    await TeamMember.deleteMany({});
    await DataStrategyEpic.deleteMany({});
    await DataStrategyPriority.deleteMany({});
    
    // Insert team members
    console.log('👥 Creating team members...');
    const createdMembers = await TeamMember.insertMany(sampleTeamMembers);
    console.log(`✅ Created ${createdMembers.length} team members`);
    
    // Insert epics
    console.log('📋 Creating epics...');
    const createdEpics = await DataStrategyEpic.insertMany(sampleEpics);
    console.log(`✅ Created ${createdEpics.length} epics`);
    
    // Insert priorities
    console.log('🎯 Creating priorities...');
    const createdPriorities = await DataStrategyPriority.insertMany(samplePriorities);
    console.log(`✅ Created ${createdPriorities.length} priorities`);
    
    console.log('\n🎉 Data Strategy Planning sample data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Team Members: ${createdMembers.length}`);
    console.log(`  - Epics: ${createdEpics.length}`);
    console.log(`  - Priorities: ${createdPriorities.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDataStrategyData();

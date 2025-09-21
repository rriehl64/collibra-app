const mongoose = require('mongoose');
const DataStrategyPriority = require('./server/models/DataStrategyPriority');
const TeamMember = require('./server/models/TeamMember');
const DataStrategyEpic = require('./server/models/DataStrategyEpic');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data-literacy-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data arrays
const branches = ['Front Office', 'Data Management', 'Data Analytics', 'Data Engineering', 'Data Science', 'Business Intelligence', 'Data Governance', 'Product & Design'];
const divisions = ['Data Management', 'IT Operations', 'Business Intelligence', 'Analytics', 'Data Governance'];
const roles = ['Data Engineer', 'Data Analyst', 'Data Scientist', 'Business Analyst', 'Data Steward', 'Solution Architect', 'Product Manager', 'Technical Lead'];

const skillSets = [
  { skillName: 'Python', proficiency: 'Advanced', certified: true },
  { skillName: 'SQL', proficiency: 'Expert', certified: true },
  { skillName: 'JavaScript', proficiency: 'Intermediate', certified: false },
  { skillName: 'React', proficiency: 'Advanced', certified: true },
  { skillName: 'Node.js', proficiency: 'Intermediate', certified: false },
  { skillName: 'MongoDB', proficiency: 'Advanced', certified: true },
  { skillName: 'PostgreSQL', proficiency: 'Expert', certified: true },
  { skillName: 'Tableau', proficiency: 'Advanced', certified: true },
  { skillName: 'Power BI', proficiency: 'Intermediate', certified: false },
  { skillName: 'Apache Spark', proficiency: 'Advanced', certified: true },
  { skillName: 'Kafka', proficiency: 'Intermediate', certified: false },
  { skillName: 'Docker', proficiency: 'Advanced', certified: true },
  { skillName: 'Kubernetes', proficiency: 'Intermediate', certified: false },
  { skillName: 'AWS', proficiency: 'Advanced', certified: true },
  { skillName: 'Azure', proficiency: 'Intermediate', certified: false },
  { skillName: 'Machine Learning', proficiency: 'Advanced', certified: true },
  { skillName: 'Data Modeling', proficiency: 'Expert', certified: true },
  { skillName: 'ETL/ELT', proficiency: 'Advanced', certified: true },
  { skillName: 'API Development', proficiency: 'Advanced', certified: true },
  { skillName: 'Data Visualization', proficiency: 'Advanced', certified: true }
];

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Patricia', 'Charles', 'Linda', 'Joseph', 'Barbara', 'Thomas', 'Elizabeth', 'Christopher', 'Susan', 'Daniel', 'Jessica', 'Matthew', 'Karen', 'Anthony', 'Nancy', 'Mark', 'Betty'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

// Generate team members
function generateTeamMembers() {
  const teamMembers = [];
  
  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const employeeId = `EMP${String(i + 1).padStart(4, '0')}`;
    
    // Randomly assign skills (3-7 skills per person)
    const numSkills = Math.floor(Math.random() * 5) + 3;
    const memberSkills = [];
    const usedSkills = new Set();
    
    while (memberSkills.length < numSkills) {
      const skill = skillSets[Math.floor(Math.random() * skillSets.length)];
      if (!usedSkills.has(skill.skillName)) {
        memberSkills.push({ ...skill });
        usedSkills.add(skill.skillName);
      }
    }
    
    // Generate realistic capacity and utilization
    const fteAllocation = Math.random() > 0.8 ? 0.5 : 1.0; // 20% part-time
    const hoursPerWeek = fteAllocation * 40;
    const availableHours = hoursPerWeek * 0.8; // 80% available for project work
    const currentUtilization = Math.floor(Math.random() * 90) + 10; // 10-99%
    
    // Generate current assignments
    const numAssignments = Math.floor(Math.random() * 3) + 1;
    const currentAssignments = [];
    
    for (let j = 0; j < numAssignments; j++) {
      currentAssignments.push({
        priorityName: `Priority ${j + 1}`,
        allocation: Math.floor(Math.random() * 30) + 10,
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        hoursAllocated: Math.floor(Math.random() * 20) + 5
      });
    }
    
    teamMembers.push({
      employeeId,
      name: {
        firstName,
        lastName
      },
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@uscis.dhs.gov`,
      role: roles[Math.floor(Math.random() * roles.length)],
      title: roles[Math.floor(Math.random() * roles.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      division: divisions[Math.floor(Math.random() * divisions.length)],
      skills: memberSkills,
      capacity: {
        fteAllocation,
        hoursPerWeek,
        availableHours
      },
      currentAssignments,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random start date within last year
      isActive: true
    });
  }
  
  return teamMembers;
}

// Generate epics with stories
function generateEpics() {
  const epicTitles = [
    'Enterprise Data Quality Framework',
    'AI-Powered Case Processing Automation',
    'Real-time Performance Analytics Dashboard',
    'Master Data Management Platform',
    'USCIS BI Platform Enhancement',
    'Data Governance and Compliance System',
    'Customer Experience Analytics Portal',
    'Predictive Analytics for Case Processing',
    'Data Lake Modernization Initiative',
    'Self-Service Analytics Platform',
    'Data Privacy and Security Enhancement',
    'Immigration Trends Analysis System'
  ];
  
  const areas = ['Data Management', 'Data Engineering', 'Business Intelligence', 'Data Science', 'Analytics', 'Data Governance'];
  const statuses = ['Planning', 'In Progress', 'Completed'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  
  const epics = [];
  
  for (let i = 0; i < 10; i++) {
    const title = epicTitles[i];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Generate stories for this epic
    const numStories = Math.floor(Math.random() * 6) + 5; // 5-10 stories per epic
    const stories = [];
    
    for (let j = 0; j < numStories; j++) {
      const storyTitles = [
        'Design user interface mockups',
        'Implement data validation logic',
        'Create API endpoints',
        'Set up database schema',
        'Develop authentication system',
        'Build reporting dashboard',
        'Implement data pipeline',
        'Create unit tests',
        'Perform security audit',
        'Deploy to production environment'
      ];
      
      stories.push({
        storyId: `${title.replace(/\s+/g, '').toUpperCase()}-${j + 1}`,
        title: storyTitles[j % storyTitles.length],
        description: `Detailed implementation of ${storyTitles[j % storyTitles.length].toLowerCase()} for the ${title} epic.`,
        businessValue: `This story contributes to the overall business value of ${title} by improving system functionality and user experience.`,
        storyPoints: Math.floor(Math.random() * 8) + 1, // 1-8 story points
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: ['Backlog', 'Ready', 'In Progress', 'Review', 'Done'][Math.floor(Math.random() * 5)],
        assignee: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        estimatedHours: Math.floor(Math.random() * 40) + 8, // 8-48 hours
        actualHours: Math.floor(Math.random() * 20) + 5 // 5-25 hours
      });
    }
    
    const targetQuarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'];
    
    epics.push({
      epicId: `EPIC-${Date.now()}-${i}`,
      title,
      description: `Comprehensive ${title.toLowerCase()} to enhance USCIS data capabilities and improve operational efficiency.`,
      area,
      businessValue: `This epic will deliver significant business value by modernizing our ${area.toLowerCase()} capabilities and supporting strategic USCIS objectives.`,
      stories,
      status,
      priority,
      targetQuarter: targetQuarters[Math.floor(Math.random() * targetQuarters.length)],
      createdBy: 'System',
      lastModifiedBy: 'System'
    });
  }
  
  return epics;
}

// Generate priorities
function generatePriorities() {
  const priorityNames = [
    'Enterprise Data Quality Framework Implementation',
    'AI-Powered Case Processing Automation',
    'Real-time Performance Analytics Dashboard',
    'Master Data Management Platform Development',
    'USCIS BI Platform Enhancement',
    'Data Governance and Compliance System',
    'Customer Experience Analytics Portal'
  ];
  
  const strategicGoals = ['Data Management', 'Data Engineering', 'Business Intelligence', 'Data Science', 'Analytics'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Pending', 'In Progress', 'Completed', 'On Hold'];
  const branches = ['Headquarters', 'Field Operations', 'Service Centers'];
  
  const priorities = [];
  
  for (let i = 0; i < 7; i++) {
    const loeHours = [40, 80, 160, 320, 480][Math.floor(Math.random() * 5)];
    const loeSize = ['XS', 'S', 'M', 'L', 'XL'][Math.floor(Math.random() * 5)];
    
    priorities.push({
      priorityName: priorityNames[i],
      description: `Comprehensive implementation of ${priorityNames[i].toLowerCase()} to enhance USCIS operational capabilities.`,
      strategicGoal: strategicGoals[Math.floor(Math.random() * strategicGoals.length)],
      owner: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      branch: branches[Math.floor(Math.random() * branches.length)],
      dueDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      loeEstimate: {
        hours: loeHours,
        size: loeSize
      },
      requiredSkills: ['Python', 'SQL', 'React', 'Data Modeling'].slice(0, Math.floor(Math.random() * 4) + 1),
      complexity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      riskFactors: ['Technical complexity', 'Resource availability', 'Timeline constraints'].slice(0, Math.floor(Math.random() * 3) + 1),
      estimatedValue: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      businessValue: `This priority delivers significant business value by improving USCIS data capabilities and operational efficiency.`,
      deliverables: ['Technical documentation', 'Implementation plan', 'Testing results'],
      dependencies: ['Infrastructure setup', 'Security approval', 'Stakeholder alignment'].slice(0, Math.floor(Math.random() * 3) + 1),
      stakeholders: ['IT Leadership', 'Business Users', 'Security Team'].slice(0, Math.floor(Math.random() * 3) + 1),
      assignedTeam: [],
      stories: [],
      progressNotes: [],
      createdBy: 'System',
      lastModifiedBy: 'System'
    });
  }
  
  return priorities;
}

// Main seeding function
async function seedData() {
  try {
    console.log('🗑️  Clearing existing data...');
    await TeamMember.deleteMany({});
    await DataStrategyEpic.deleteMany({});
    await DataStrategyPriority.deleteMany({});
    
    console.log('👥 Creating 30 team members...');
    const teamMembers = generateTeamMembers();
    await TeamMember.insertMany(teamMembers);
    console.log(`✅ Created ${teamMembers.length} team members`);
    
    console.log('📋 Creating 10 epics with stories...');
    const epics = generateEpics();
    await DataStrategyEpic.insertMany(epics);
    console.log(`✅ Created ${epics.length} epics with ${epics.reduce((total, epic) => total + epic.stories.length, 0)} total stories`);
    
    console.log('🎯 Creating 7 priorities...');
    const priorities = generatePriorities();
    await DataStrategyPriority.insertMany(priorities);
    console.log(`✅ Created ${priorities.length} priorities`);
    
    console.log('🎉 Data seeding completed successfully!');
    console.log(`
📊 Summary:
- Team Members: ${teamMembers.length}
- Epics: ${epics.length}
- Stories: ${epics.reduce((total, epic) => total + epic.stories.length, 0)}
- Priorities: ${priorities.length}
    `);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding
seedData();

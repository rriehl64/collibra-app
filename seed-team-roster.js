const mongoose = require('mongoose');
const TeamMember = require('./server/models/TeamMember');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Team roster data from the spreadsheet
const teamRosterData = [
  {
    employeeId: 'EMP-001',
    name: { firstName: 'Eduardo', lastName: 'Alban' },
    email: 'eduardo.alban@uscis.dhs.gov',
    role: 'Analytics SME',
    title: 'Analytics SME',
    branch: 'Data Analytics',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'AtlanX',
    personalEmail: 'eduardo.alban@gmail.com',
    skills: [
      { skillName: 'Data Analytics', proficiency: 'Expert', certified: true },
      { skillName: 'Business Intelligence', proficiency: 'Advanced', certified: false },
      { skillName: 'SQL', proficiency: 'Advanced', certified: true }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 32
    },
    currentAssignments: [
      {
        priorityName: 'Data Quality Initiative',
        allocation: 20,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        hoursAllocated: 8
      }
    ]
  },
  {
    employeeId: 'EMP-002',
    name: { firstName: 'Allison', lastName: 'Tillotson' },
    email: 'allison.tillotson@uscis.dhs.gov',
    role: 'Business Intelligence Consultant',
    title: 'Business Intelligence Consultant',
    branch: 'Business Intelligence',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Central',
    startDate: new Date('2024-01-01'),
    timeZone: 'Central',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'AtlanX',
    personalEmail: 'allison.tillotson@gmail.com',
    skills: [
      { skillName: 'Business Intelligence', proficiency: 'Expert', certified: true },
      { skillName: 'Tableau', proficiency: 'Advanced', certified: true },
      { skillName: 'Power BI', proficiency: 'Intermediate', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 28
    },
    currentAssignments: [
      {
        priorityName: 'Executive Dashboard Development',
        allocation: 30,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-11-30'),
        hoursAllocated: 12
      }
    ]
  },
  {
    employeeId: 'EMP-003',
    name: { firstName: 'Andelo', lastName: 'Marylenko' },
    email: 'andelo.marylenko@uscis.dhs.gov',
    role: 'Data Engineer',
    title: 'Data Engineer',
    branch: 'Data Engineering',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'andelo.marylenko@gmail.com',
    skills: [
      { skillName: 'Data Engineering', proficiency: 'Expert', certified: true },
      { skillName: 'Python', proficiency: 'Advanced', certified: true },
      { skillName: 'ETL/ELT', proficiency: 'Advanced', certified: false },
      { skillName: 'MongoDB', proficiency: 'Intermediate', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 24
    },
    currentAssignments: [
      {
        priorityName: 'Data Pipeline Modernization',
        allocation: 40,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-10-31'),
        hoursAllocated: 16
      }
    ]
  },
  {
    employeeId: 'EMP-004',
    name: { firstName: 'Arun', lastName: 'Sapkota' },
    email: 'arun.sapkota@uscis.dhs.gov',
    role: 'Data Science SME',
    title: 'Data Science SME',
    branch: 'Data Science',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'arun.sapkota@arkasystems.com',
    skills: [
      { skillName: 'Data Science', proficiency: 'Expert', certified: true },
      { skillName: 'Machine Learning', proficiency: 'Expert', certified: true },
      { skillName: 'Python', proficiency: 'Advanced', certified: true },
      { skillName: 'R', proficiency: 'Advanced', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 20
    },
    currentAssignments: [
      {
        priorityName: 'Predictive Analytics Platform',
        allocation: 50,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-15'),
        hoursAllocated: 20
      }
    ]
  },
  {
    employeeId: 'EMP-005',
    name: { firstName: 'Ayele', lastName: 'Ayele' },
    email: 'ayele.ayele@uscis.dhs.gov',
    role: 'Business Intelligence Consultant',
    title: 'Business Intelligence Consultant',
    branch: 'Business Intelligence',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'ayele.ayele@gmail.com',
    skills: [
      { skillName: 'Business Intelligence', proficiency: 'Advanced', certified: true },
      { skillName: 'Data Visualization', proficiency: 'Advanced', certified: false },
      { skillName: 'SQL Server', proficiency: 'Intermediate', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 32
    },
    currentAssignments: [
      {
        priorityName: 'Compliance Reporting Automation',
        allocation: 20,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-09-30'),
        hoursAllocated: 8
      }
    ]
  },
  {
    employeeId: 'EMP-006',
    name: { firstName: 'Anna', lastName: 'Talibzjanowa' },
    email: 'anna.talibzjanowa@uscis.dhs.gov',
    role: 'Project Manager',
    title: 'Project Manager',
    branch: 'Front Office',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'CC',
    contractorCompany: 'Aska',
    personalEmail: 'anna.talibzjanowa@gmail.com',
    skills: [
      { skillName: 'Project Management', proficiency: 'Expert', certified: true },
      { skillName: 'Agile Methodology', proficiency: 'Advanced', certified: true },
      { skillName: 'Risk Management', proficiency: 'Advanced', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 16
    },
    currentAssignments: [
      {
        priorityName: 'Data Governance Implementation',
        allocation: 60,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        hoursAllocated: 24
      }
    ]
  },
  {
    employeeId: 'EMP-007',
    name: { firstName: 'Balu', lastName: 'Balu' },
    email: 'balu.balu@uscis.dhs.gov',
    role: 'Data Scientist',
    title: 'Data Scientist',
    branch: 'Data Science',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Pacific',
    startDate: new Date('2024-01-01'),
    timeZone: 'Pacific',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'balu.balu@gmail.com',
    skills: [
      { skillName: 'Data Science', proficiency: 'Advanced', certified: true },
      { skillName: 'Statistical Analysis', proficiency: 'Advanced', certified: false },
      { skillName: 'Python', proficiency: 'Intermediate', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 28
    },
    currentAssignments: [
      {
        priorityName: 'Customer Analytics Initiative',
        allocation: 30,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-11-15'),
        hoursAllocated: 12
      }
    ]
  },
  {
    employeeId: 'EMP-008',
    name: { firstName: 'Brandon', lastName: 'Brandon' },
    email: 'brandon.brandon@uscis.dhs.gov',
    role: 'Business Intelligence Consultant',
    title: 'Business Intelligence Consultant',
    branch: 'Business Intelligence',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Eastern',
    startDate: new Date('2024-01-01'),
    timeZone: 'Eastern',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'brandon.brandon@gmail.com',
    skills: [
      { skillName: 'Business Intelligence', proficiency: 'Advanced', certified: true },
      { skillName: 'Data Warehousing', proficiency: 'Intermediate', certified: false },
      { skillName: 'SSRS', proficiency: 'Intermediate', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 24
    },
    currentAssignments: [
      {
        priorityName: 'Data Warehouse Optimization',
        allocation: 40,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-10-31'),
        hoursAllocated: 16
      }
    ]
  },
  {
    employeeId: 'EMP-009',
    name: { firstName: 'Bryan', lastName: 'Brooks' },
    email: 'bryan.brooks@uscis.dhs.gov',
    role: 'Project Management Team Leader',
    title: 'Project Management Team Leader',
    branch: 'Front Office',
    division: 'USCIS',
    org: 'AtlanX',
    sme: 'Pacific',
    startDate: new Date('2024-01-01'),
    timeZone: 'Pacific',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'AtlanX',
    personalEmail: 'bryan.brooks@gmail.com',
    skills: [
      { skillName: 'Project Management', proficiency: 'Expert', certified: true },
      { skillName: 'Team Leadership', proficiency: 'Expert', certified: true },
      { skillName: 'Strategic Planning', proficiency: 'Advanced', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 12
    },
    currentAssignments: [
      {
        priorityName: 'Enterprise Data Strategy',
        allocation: 70,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        hoursAllocated: 28
      }
    ]
  },
  {
    employeeId: 'EMP-010',
    name: { firstName: 'Bruce', lastName: 'Buxton' },
    email: 'bruce.buxton@uscis.dhs.gov',
    role: 'Data Management SME',
    title: 'Data Management SME',
    branch: 'Data Management',
    division: 'USCIS',
    org: 'Aska',
    sme: 'Central',
    startDate: new Date('2024-01-01'),
    timeZone: 'Central',
    preferredHours: '8:00 am to 5:00 pm',
    workLocation: 'W2',
    contractorCompany: 'Aska',
    personalEmail: 'bruce.buxton@gmail.com',
    skills: [
      { skillName: 'Data Management', proficiency: 'Expert', certified: true },
      { skillName: 'Data Governance', proficiency: 'Advanced', certified: true },
      { skillName: 'Metadata Management', proficiency: 'Advanced', certified: false }
    ],
    capacity: {
      fteAllocation: 1.0,
      hoursPerWeek: 40,
      availableHours: 20
    },
    currentAssignments: [
      {
        priorityName: 'Master Data Management',
        allocation: 50,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-11-30'),
        hoursAllocated: 20
      }
    ]
  }
];

// Function to seed team roster data
const seedTeamRoster = async () => {
  try {
    console.log('🚀 Starting Team Roster data seeding...');
    
    // Clear existing team members
    await TeamMember.deleteMany({});
    console.log('🗑️  Cleared existing team roster data');
    
    // Calculate utilization for each team member
    const processedData = teamRosterData.map(member => {
      const totalAllocation = member.currentAssignments.reduce((sum, assignment) => sum + assignment.allocation, 0);
      return {
        ...member,
        currentUtilization: totalAllocation,
        availableCapacity: 100 - totalAllocation,
        capacity: {
          ...member.capacity,
          availableHours: Math.max(0, 40 - Math.round((totalAllocation / 100) * 40))
        }
      };
    });
    
    // Insert team roster data
    const insertedMembers = await TeamMember.insertMany(processedData);
    console.log(`✅ Successfully seeded ${insertedMembers.length} team members`);
    
    // Display summary
    console.log('\n📊 Team Roster Summary:');
    console.log(`Total Members: ${insertedMembers.length}`);
    
    const utilizationStats = {
      available: insertedMembers.filter(m => m.currentUtilization < 80).length,
      atCapacity: insertedMembers.filter(m => m.currentUtilization >= 80 && m.currentUtilization < 100).length,
      overallocated: insertedMembers.filter(m => m.currentUtilization >= 100).length
    };
    
    console.log(`Available (< 80%): ${utilizationStats.available}`);
    console.log(`At Capacity (80-99%): ${utilizationStats.atCapacity}`);
    console.log(`Overallocated (≥ 100%): ${utilizationStats.overallocated}`);
    
    // Display by branch
    const branchCounts = {};
    insertedMembers.forEach(member => {
      branchCounts[member.branch] = (branchCounts[member.branch] || 0) + 1;
    });
    
    console.log('\n🏢 By Branch:');
    Object.entries(branchCounts).forEach(([branch, count]) => {
      console.log(`${branch}: ${count} members`);
    });
    
    console.log('\n🎯 Team Roster seeding completed successfully!');
    console.log('📍 Access at: http://localhost:3008/admin/team-roster');
    
  } catch (error) {
    console.error('❌ Error seeding team roster data:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await seedTeamRoster();
    console.log('\n✅ All operations completed successfully!');
  } catch (error) {
    console.error('❌ Script execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { seedTeamRoster, teamRosterData };

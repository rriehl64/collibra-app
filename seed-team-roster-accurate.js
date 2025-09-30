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

// Current accurate team roster data (generated from live database)
const teamRosterData = [
  {
    "employeeId": "EMP-001",
    "name": {
      "firstName": "Adam",
      "lastName": "Fajardo"
    },
    "email": "adam.fajardo@uscis.dhs.gov",
    "role": "Analytics SME",
    "title": "Analytics SME",
    "branch": "Data Analytics",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Analytics",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Statistical Analysis",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 32
    },
    "currentAssignments": [
      {
        "priorityName": "Analytics Platform",
        "allocation": 20,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 8
      }
    ]
  },
  {
    "employeeId": "EMP-002",
    "name": {
      "firstName": "Allison",
      "lastName": "Tillowitz"
    },
    "email": "allison.tillowitz@uscis.dhs.gov",
    "role": "Business Intelligence Consultant",
    "title": "Business Intelligence Consultant",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Intelligence",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Tableau",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 28
    },
    "currentAssignments": [
      {
        "priorityName": "BI Dashboard Development",
        "allocation": 30,
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-11-30T00:00:00.000Z",
        "hoursAllocated": 12
      }
    ]
  },
  {
    "employeeId": "EMP-003",
    "name": {
      "firstName": "Andriy",
      "lastName": "Vasylenko"
    },
    "email": "andriy.vasylenko@uscis.dhs.gov",
    "role": "Data Engineer",
    "title": "Data Engineer",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Engineering",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Python",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 24
    },
    "currentAssignments": [
      {
        "priorityName": "Data Pipeline Modernization",
        "allocation": 40,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 16
      }
    ]
  },
  {
    "employeeId": "EMP-004",
    "name": {
      "firstName": "Arun",
      "lastName": "Sapkota"
    },
    "email": "arun.sapkota@uscis.dhs.gov",
    "role": "Data Science SME",
    "title": "Data Science SME",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Machine Learning",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 20
    },
    "currentAssignments": [
      {
        "priorityName": "Predictive Analytics Platform",
        "allocation": 50,
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-12-15T00:00:00.000Z",
        "hoursAllocated": 20
      }
    ]
  },
  {
    "employeeId": "EMP-005",
    "name": {
      "firstName": "Ayda",
      "lastName": "Abebe"
    },
    "email": "ayda.abebe@uscis.dhs.gov",
    "role": "Business Intelligence Consultant",
    "title": "Business Intelligence Consultant",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Intelligence",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Data Visualization",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 32
    },
    "currentAssignments": [
      {
        "priorityName": "Compliance Reporting",
        "allocation": 20,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-09-30T00:00:00.000Z",
        "hoursAllocated": 8
      }
    ]
  },
  {
    "employeeId": "EMP-006",
    "name": {
      "firstName": "Aziza",
      "lastName": "Talibdjanova"
    },
    "email": "aziza.talibdjanova@uscis.dhs.gov",
    "role": "Project Manager",
    "title": "Project Manager",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Project Management",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Agile Methodology",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 16
    },
    "currentAssignments": [
      {
        "priorityName": "Data Governance Implementation",
        "allocation": 60,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 24
      }
    ]
  },
  {
    "employeeId": "EMP-007",
    "name": {
      "firstName": "Rasazin",
      "lastName": "Belhu"
    },
    "email": "rasazin.belhu@uscis.dhs.gov",
    "role": "Data Scientist",
    "title": "Data Scientist",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Statistical Analysis",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 28
    },
    "currentAssignments": [
      {
        "priorityName": "Customer Analytics Initiative",
        "allocation": 30,
        "startDate": "2024-02-15T00:00:00.000Z",
        "endDate": "2024-11-15T00:00:00.000Z",
        "hoursAllocated": 12
      }
    ]
  },
  {
    "employeeId": "EMP-008",
    "name": {
      "firstName": "Brandon",
      "lastName": "Bell"
    },
    "email": "brandon.bell@uscis.dhs.gov",
    "role": "Business Analysis Consultant",
    "title": "Business Analysis Consultant",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Analysis",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Requirements Analysis",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 24
    },
    "currentAssignments": [
      {
        "priorityName": "Business Process Analysis",
        "allocation": 40,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 16
      }
    ]
  },
  {
    "employeeId": "EMP-009",
    "name": {
      "firstName": "Eryn",
      "lastName": "Brooks"
    },
    "email": "eryn.brooks@uscis.dhs.gov",
    "role": "Project Management Team Leader",
    "title": "Project Management Team Leader",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Project Management",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Team Leadership",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 12
    },
    "currentAssignments": [
      {
        "priorityName": "Enterprise Data Strategy",
        "allocation": 70,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 28
      }
    ]
  },
  {
    "employeeId": "EMP-010",
    "name": {
      "firstName": "Bruce",
      "lastName": "Benson"
    },
    "email": "bruce.benson@uscis.dhs.gov",
    "role": "Data Management Consultant",
    "title": "Data Management Consultant",
    "branch": "Data Management",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Management",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Data Governance",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 20
    },
    "currentAssignments": [
      {
        "priorityName": "Master Data Management",
        "allocation": 50,
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-11-30T00:00:00.000Z",
        "hoursAllocated": 20
      }
    ]
  },
  {
    "employeeId": "EMP-011",
    "name": {
      "firstName": "Danielle",
      "lastName": "Hanson"
    },
    "email": "danielle.hanson@uscis.dhs.gov",
    "role": "Analytics Consultant",
    "title": "Analytics Consultant",
    "branch": "Data Analytics",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Analytics",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Statistical Analysis",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 28
    },
    "currentAssignments": [
      {
        "priorityName": "Analytics Dashboard",
        "allocation": 30,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 12
      }
    ]
  },
  {
    "employeeId": "EMP-012",
    "name": {
      "firstName": "Devan",
      "lastName": "Visvalingam"
    },
    "email": "devan.visvalingam@uscis.dhs.gov",
    "role": "Data Engineer",
    "title": "Data Engineer",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Engineering",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "ETL/ELT",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 24
    },
    "currentAssignments": [
      {
        "priorityName": "Data Pipeline Enhancement",
        "allocation": 40,
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-11-15T00:00:00.000Z",
        "hoursAllocated": 16
      }
    ]
  },
  {
    "employeeId": "EMP-013",
    "name": {
      "firstName": "Doug",
      "lastName": "Amlin"
    },
    "email": "doug.amlin@uscis.dhs.gov",
    "role": "Business Intelligence Consultant",
    "title": "Business Intelligence Consultant",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Intelligence",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Data Visualization",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 32
    },
    "currentAssignments": [
      {
        "priorityName": "BI Reporting Enhancement",
        "allocation": 20,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-09-30T00:00:00.000Z",
        "hoursAllocated": 8
      }
    ]
  },
  {
    "employeeId": "EMP-014",
    "name": {
      "firstName": "Elsa",
      "lastName": "Negash"
    },
    "email": "elsa.negash@uscis.dhs.gov",
    "role": "Project Manager",
    "title": "Project Manager",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Project Management",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Agile Methodology",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 16
    },
    "currentAssignments": [
      {
        "priorityName": "Digital Transformation Initiative",
        "allocation": 60,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 24
      }
    ]
  },
  {
    "employeeId": "EMP-015",
    "name": {
      "firstName": "Emmanuel",
      "lastName": "(Manny) Dhara Charles"
    },
    "email": "emmanuel.dharacharles@uscis.dhs.gov",
    "role": "Data Scientist",
    "title": "Data Scientist",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Machine Learning",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-016",
    "name": {
      "firstName": "Gregg",
      "lastName": "Hirshberg"
    },
    "email": "gregg.hirshberg@uscis.dhs.gov",
    "role": "Business Intelligence Consultant",
    "title": "Business Intelligence Consultant",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Intelligence",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Data Warehousing",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 24
    },
    "currentAssignments": [
      {
        "priorityName": "Data Warehouse Optimization",
        "allocation": 40,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 16
      }
    ]
  },
  {
    "employeeId": "EMP-017",
    "name": {
      "firstName": "Hubert",
      "lastName": "Shang"
    },
    "email": "hubert.shang@uscis.dhs.gov",
    "role": "Data Scientist/Engineer",
    "title": "Data Scientist/Engineer",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Data Engineering",
        "proficiency": "Advanced",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 20
    },
    "currentAssignments": [
      {
        "priorityName": "Advanced Analytics Platform",
        "allocation": 50,
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-12-15T00:00:00.000Z",
        "hoursAllocated": 20
      }
    ]
  },
  {
    "employeeId": "EMP-018",
    "name": {
      "firstName": "Hunter (Graham)",
      "lastName": "Hamblin"
    },
    "email": "hunter.hamblin@uscis.dhs.gov",
    "role": "Data Scientist",
    "title": "Data Scientist",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Statistical Modeling",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 28
    },
    "currentAssignments": [
      {
        "priorityName": "Statistical Analysis Project",
        "allocation": 30,
        "startDate": "2024-02-15T00:00:00.000Z",
        "endDate": "2024-11-15T00:00:00.000Z",
        "hoursAllocated": 12
      }
    ]
  },
  {
    "employeeId": "EMP-019",
    "name": {
      "firstName": "Pulkit",
      "lastName": "Jain"
    },
    "email": "pulkit.jain@uscis.dhs.gov",
    "role": "Data Governance & Compliance SME",
    "title": "Data Governance & Compliance SME",
    "branch": "Data Governance",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Governance",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Compliance Management",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 16
    },
    "currentAssignments": [
      {
        "priorityName": "Governance Framework Implementation",
        "allocation": 60,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 24
      }
    ]
  },
  {
    "employeeId": "EMP-020",
    "name": {
      "firstName": "Michael",
      "lastName": "Szymanski"
    },
    "email": "michael.szymanski@uscis.dhs.gov",
    "role": "Business Intelligence SME",
    "title": "Business Intelligence SME",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Intelligence",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Advanced Analytics",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 12
    },
    "currentAssignments": [
      {
        "priorityName": "Enterprise BI Strategy",
        "allocation": 70,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 28
      }
    ]
  },
  {
    "employeeId": "EMP-021",
    "name": {
      "firstName": "Nicole",
      "lastName": "Staples"
    },
    "email": "nicole.staples@uscis.dhs.gov",
    "role": "Graphic Designer",
    "title": "Graphic Designer",
    "branch": "Product & Design",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Graphic Design",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "UI/UX Design",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-022",
    "name": {
      "firstName": "Russell",
      "lastName": "Riehl"
    },
    "email": "russell.riehl@uscis.dhs.gov",
    "role": "Program Manager / Team Leader",
    "title": "Program Manager / Team Leader",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Program Management",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Strategic Planning",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 8
    },
    "currentAssignments": [
      {
        "priorityName": "Data Strategy Program Leadership",
        "allocation": 80,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 32
      }
    ]
  },
  {
    "employeeId": "EMP-023",
    "name": {
      "firstName": "Steve",
      "lastName": "Byun"
    },
    "email": "steve.byun@uscis.dhs.gov",
    "role": "Team Leader",
    "title": "Team Leader",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Team Leadership",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Operations Management",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-024",
    "name": {
      "firstName": "Sue",
      "lastName": "Dawson"
    },
    "email": "susan.dawson@uscis.dhs.gov",
    "role": "Data Engineer",
    "title": "Data Engineer",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Engineering",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Cloud Architecture",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-025",
    "name": {
      "firstName": "Terry",
      "lastName": "Wadhra"
    },
    "email": "terry.wadhra@uscis.dhs.gov",
    "role": "Data Consultant",
    "title": "Data Consultant",
    "branch": "Data Management",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Consulting",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Business Analysis",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 24
    },
    "currentAssignments": [
      {
        "priorityName": "Data Strategy Consulting",
        "allocation": 40,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 16
      }
    ]
  },
  {
    "employeeId": "EMP-026",
    "name": {
      "firstName": "Tommy",
      "lastName": "Cheung"
    },
    "email": "tommy.cheung@uscis.dhs.gov",
    "role": "Product & Design SME",
    "title": "Product & Design SME",
    "branch": "Product & Design",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Product Design",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "User Experience",
        "proficiency": "Expert",
        "certified": true
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 20
    },
    "currentAssignments": [
      {
        "priorityName": "Product Design Strategy",
        "allocation": 50,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "hoursAllocated": 20
      }
    ]
  },
  {
    "employeeId": "EMP-027",
    "name": {
      "firstName": "Tyler",
      "lastName": "Tyler"
    },
    "email": "tyler.tyler@uscis.dhs.gov",
    "role": "Data Scientist",
    "title": "Data Scientist",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Data Science",
        "proficiency": "Advanced",
        "certified": true
      },
      {
        "skillName": "Predictive Modeling",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 32
    },
    "currentAssignments": [
      {
        "priorityName": "Predictive Analytics Development",
        "allocation": 20,
        "startDate": "2024-02-15T00:00:00.000Z",
        "endDate": "2024-11-15T00:00:00.000Z",
        "hoursAllocated": 8
      }
    ]
  },
  {
    "employeeId": "EMP-028",
    "name": {
      "firstName": "William",
      "lastName": "(Jake) Hobbs"
    },
    "email": "william.hobbs@uscis.dhs.gov",
    "role": "Cloud Solutions Architect",
    "title": "Cloud Solutions Architect",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Cloud Architecture",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "AWS",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Azure",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Kubernetes",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-029",
    "name": {
      "firstName": "Anurag",
      "lastName": "Singh"
    },
    "email": "anurag.singh@uscis.dhs.gov",
    "role": "Cybersecurity Analyst",
    "title": "Cybersecurity Analyst",
    "branch": "Data Governance",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Cybersecurity",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Risk Assessment",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Compliance Auditing",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "FISMA",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-030",
    "name": {
      "firstName": "Srinivas",
      "lastName": "Dhulipalas"
    },
    "email": "srinivas.dhulapalas@uscis.dhs.gov",
    "role": "Machine Learning Engineer",
    "title": "Machine Learning Engineer",
    "branch": "Data Science",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Machine Learning",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Deep Learning",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "TensorFlow",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "PyTorch",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-031",
    "name": {
      "firstName": "Megan",
      "lastName": "Thompson"
    },
    "email": "megan.thompson@uscis.dhs.gov",
    "role": "Database Administrator",
    "title": "Database Administrator",
    "branch": "Data Management",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Database Administration",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "SQL Server",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Oracle",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "MongoDB",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-032",
    "name": {
      "firstName": "Amit",
      "lastName": "Ghosh"
    },
    "email": "amit.ghosh@uscis.dhs.gov",
    "role": "DevOps Engineer",
    "title": "DevOps Engineer",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "DevOps",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "CI/CD",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Docker",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Jenkins",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-033",
    "name": {
      "firstName": "David",
      "lastName": "Ocampo"
    },
    "email": "david.ocampo@uscis.dhs.gov",
    "role": "UX/UI Designer",
    "title": "UX/UI Designer",
    "branch": "Product & Design",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "UX Design",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "UI Design",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Figma",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Adobe Creative Suite",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-034",
    "name": {
      "firstName": "Stacey",
      "lastName": "Jesuraj"
    },
    "email": "stacey.jesuraj@uscis.dhs.gov",
    "role": "Quality Assurance Analyst",
    "title": "Quality Assurance Analyst",
    "branch": "Data Management",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Quality Assurance",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Test Automation",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Selenium",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Data Validation",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-035",
    "name": {
      "firstName": "Stacey",
      "lastName": "Belova"
    },
    "email": "stacey.belova@uscis.dhs.gov",
    "role": "Technical Writer",
    "title": "Technical Writer",
    "branch": "Front Office",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Technical Writing",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Documentation",
        "proficiency": "Expert",
        "certified": true
      },
      {
        "skillName": "Process Documentation",
        "proficiency": "Advanced",
        "certified": false
      },
      {
        "skillName": "Training Materials",
        "proficiency": "Advanced",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 28
    },
    "currentAssignments": [
      {
        "priorityName": "Documentation Standardization",
        "allocation": 30,
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-10-31T00:00:00.000Z",
        "hoursAllocated": 12
      }
    ]
  },
  {
    "employeeId": "EMP-036",
    "name": {
      "firstName": "Anthony",
      "lastName": "(Tony) Jagga"
    },
    "email": "anthony.jagga@uscis.dhs.gov",
    "role": "Systems Administrator",
    "title": "Systems Administrator",
    "branch": "Data Engineering",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Systems Administration",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Linux",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Windows Server",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Network Administration",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
  },
  {
    "employeeId": "EMP-037",
    "name": {
      "firstName": "Behera",
      "lastName": "Rasesh"
    },
    "email": "behera.rasesh@uscis.dhs.gov",
    "role": "Business Process Analyst",
    "title": "Business Process Analyst",
    "branch": "Business Intelligence",
    "division": "USCIS",
    "personalPhone": "555-000-0000",
    "startDate": "2024-01-01T00:00:00.000Z",
    "skills": [
      {
        "skillName": "Business Process Analysis",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Process Improvement",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Workflow Design",
        "proficiency": "Intermediate",
        "certified": false
      },
      {
        "skillName": "Change Management",
        "proficiency": "Intermediate",
        "certified": false
      }
    ],
    "capacity": {
      "fteAllocation": 1,
      "hoursPerWeek": 40,
      "availableHours": 40
    },
    "currentAssignments": []
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

if (require.main === module) {
  main();
}

module.exports = { seedTeamRoster, teamRosterData };

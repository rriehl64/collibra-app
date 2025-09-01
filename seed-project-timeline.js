const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ProjectTimeline = require('./server/models/ProjectTimeline');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedProjectTimeline = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await ProjectTimeline.deleteMany({});
    console.log('Cleared existing project timeline data');
    
    const timelineData = [
      // Phase 1: Assessment (Months 1-2)
      {
        taskName: "Data Governance Assessment",
        phase: "Assessment",
        owner: "Data Governance Team",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-15"),
        status: "Completed",
        progress: 100,
        priority: "High",
        description: "Comprehensive assessment of current data governance practices and gaps",
        estimatedHours: 120,
        actualHours: 115,
        budget: 25000,
        tags: ["governance", "assessment", "baseline"]
      },
      {
        taskName: "Zero Trust Architecture Planning",
        phase: "Assessment",
        owner: "Security Team",
        startDate: new Date("2024-01-08"),
        endDate: new Date("2024-01-22"),
        status: "Completed",
        progress: 100,
        priority: "High",
        description: "Design Zero Trust security framework aligned with NIST SP 800-207",
        estimatedHours: 80,
        actualHours: 85,
        budget: 20000,
        tags: ["security", "zero-trust", "nist"]
      },
      {
        taskName: "Stakeholder Engagement & Requirements",
        phase: "Assessment",
        owner: "Project Management",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-02-05"),
        status: "Completed",
        progress: 100,
        priority: "Medium",
        description: "Gather requirements from all stakeholders and define success criteria",
        estimatedHours: 60,
        actualHours: 70,
        budget: 15000,
        tags: ["stakeholders", "requirements", "planning"]
      },
      {
        taskName: "Technology Stack Evaluation",
        phase: "Assessment",
        owner: "Architecture Team",
        startDate: new Date("2024-01-22"),
        endDate: new Date("2024-02-12"),
        status: "In Progress",
        progress: 85,
        priority: "High",
        description: "Evaluate Databricks, security tools, and integration platforms",
        estimatedHours: 100,
        actualHours: 75,
        budget: 30000,
        tags: ["technology", "databricks", "evaluation"]
      },
      
      // Phase 2: Implementation (Months 3-6)
      {
        taskName: "Databricks Data Quality Framework Setup",
        phase: "Implementation",
        owner: "Data Engineering",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-31"),
        status: "Active",
        progress: 45,
        priority: "High",
        description: "Configure Databricks data quality monitoring and automated checks",
        estimatedHours: 200,
        actualHours: 90,
        budget: 50000,
        tags: ["databricks", "quality", "automation"]
      },
      {
        taskName: "Identity & Access Management Implementation",
        phase: "Implementation",
        owner: "Security Team",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-04-30"),
        status: "Active",
        progress: 30,
        priority: "High",
        description: "Deploy MFA, RBAC, and JIT access controls",
        estimatedHours: 150,
        actualHours: 45,
        budget: 40000,
        tags: ["iam", "mfa", "rbac", "security"]
      },
      {
        taskName: "Data Catalog Integration",
        phase: "Implementation",
        owner: "Data Stewards",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-05-15"),
        status: "Planned",
        progress: 15,
        priority: "Medium",
        description: "Integrate data assets with governance framework and quality metrics",
        estimatedHours: 120,
        actualHours: 18,
        budget: 35000,
        tags: ["catalog", "integration", "stewardship"]
      },
      {
        taskName: "Micro-Segmentation & Network Security",
        phase: "Implementation",
        owner: "Network Security",
        startDate: new Date("2024-04-15"),
        endDate: new Date("2024-06-01"),
        status: "Planned",
        progress: 10,
        priority: "High",
        description: "Implement network micro-segmentation and encryption protocols",
        estimatedHours: 180,
        actualHours: 20,
        budget: 60000,
        tags: ["network", "segmentation", "encryption"]
      },
      {
        taskName: "Policy Engine Development",
        phase: "Implementation",
        owner: "DevOps Team",
        startDate: new Date("2024-05-01"),
        endDate: new Date("2024-06-30"),
        status: "Future",
        progress: 5,
        priority: "High",
        description: "Build dynamic policy engine for access control decisions",
        estimatedHours: 250,
        actualHours: 12,
        budget: 75000,
        tags: ["policy", "engine", "automation"]
      },
      
      // Phase 3: Optimization (Months 7-12)
      {
        taskName: "Continuous Monitoring Setup",
        phase: "Optimization",
        owner: "Operations Team",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-08-15"),
        status: "Future",
        progress: 0,
        priority: "Medium",
        description: "Deploy comprehensive monitoring and alerting systems",
        estimatedHours: 160,
        actualHours: 0,
        budget: 45000,
        tags: ["monitoring", "alerting", "operations"]
      },
      {
        taskName: "Performance Optimization",
        phase: "Optimization",
        owner: "Performance Team",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-09-30"),
        status: "Future",
        progress: 0,
        priority: "Medium",
        description: "Optimize system performance and resource utilization",
        estimatedHours: 140,
        actualHours: 0,
        budget: 40000,
        tags: ["performance", "optimization", "resources"]
      },
      {
        taskName: "Compliance Validation & Reporting",
        phase: "Optimization",
        owner: "Compliance Team",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-10-31"),
        status: "Future",
        progress: 0,
        priority: "High",
        description: "Validate federal compliance and establish reporting mechanisms",
        estimatedHours: 100,
        actualHours: 0,
        budget: 30000,
        tags: ["compliance", "reporting", "validation"]
      },
      {
        taskName: "Training & Knowledge Transfer",
        phase: "Optimization",
        owner: "Training Team",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2024-11-30"),
        status: "Future",
        progress: 0,
        priority: "Medium",
        description: "Conduct comprehensive training for all stakeholders",
        estimatedHours: 80,
        actualHours: 0,
        budget: 25000,
        tags: ["training", "knowledge-transfer", "documentation"]
      },
      {
        taskName: "Final Security Assessment",
        phase: "Optimization",
        owner: "Security Audit Team",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-12-15"),
        status: "Future",
        progress: 0,
        priority: "High",
        description: "Comprehensive security audit and penetration testing",
        estimatedHours: 120,
        actualHours: 0,
        budget: 50000,
        tags: ["security", "audit", "penetration-testing"]
      }
    ];
    
    await ProjectTimeline.insertMany(timelineData);
    console.log(`Successfully seeded ${timelineData.length} project timeline records`);
    
    // Display summary
    const stats = await ProjectTimeline.aggregate([
      {
        $group: {
          _id: '$phase',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress' },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);
    
    console.log('\nProject Timeline Summary:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} tasks, ${stat.avgProgress.toFixed(1)}% avg progress, $${stat.totalBudget.toLocaleString()} budget`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedProjectTimeline();

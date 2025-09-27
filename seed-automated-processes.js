const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Import the AutomatedProcess model
const AutomatedProcess = require('./server/models/AutomatedProcess');
const User = require('./server/models/User');

// Sample automated processes data
const sampleProcesses = [
  {
    name: 'Daily Data Quality Check',
    description: 'Automated daily validation of data quality metrics across all data assets',
    category: 'Data Quality',
    processType: 'Scheduled',
    schedule: {
      enabled: true,
      cronExpression: '0 6 * * *', // Daily at 6 AM
      timezone: 'America/New_York'
    },
    steps: [
      {
        stepId: uuidv4(),
        name: 'Connect to Data Sources',
        description: 'Establish connections to all monitored data sources',
        stepType: 'Database_Query',
        configuration: {
          timeout: 30000,
          retryOnFailure: true
        },
        order: 1,
        isActive: true,
        retryConfig: {
          maxRetries: 3,
          retryDelay: 5000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Run Quality Checks',
        description: 'Execute data quality validation rules',
        stepType: 'Data_Validation',
        configuration: {
          rules: ['completeness', 'accuracy', 'consistency'],
          threshold: 85
        },
        order: 2,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 3000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Generate Report',
        description: 'Create data quality summary report',
        stepType: 'File_Operation',
        configuration: {
          outputFormat: 'PDF',
          includeCharts: true
        },
        order: 3,
        isActive: true,
        retryConfig: {
          maxRetries: 1,
          retryDelay: 2000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Send Notifications',
        description: 'Email report to stakeholders',
        stepType: 'Email_Notification',
        configuration: {
          recipients: ['data-steward@uscis.gov', 'data-team@uscis.gov'],
          template: 'daily-quality-report'
        },
        order: 4,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 1000
        }
      }
    ],
    status: 'Active',
    team: 'Data Governance',
    complianceLevel: 'High',
    auditRequired: true,
    dataClassification: 'Internal',
    tags: ['daily', 'quality', 'automated', 'reporting'],
    notifications: {
      onSuccess: {
        enabled: true,
        recipients: ['data-steward@uscis.gov'],
        template: 'success-notification'
      },
      onFailure: {
        enabled: true,
        recipients: ['data-steward@uscis.gov', 'admin@uscis.gov'],
        template: 'failure-alert'
      },
      onStart: {
        enabled: false,
        recipients: [],
        template: ''
      }
    },
    version: '1.2.0'
  },
  {
    name: 'Weekly Compliance Report',
    description: 'Generate weekly compliance status report for FISMA and Section 508 requirements',
    category: 'Compliance',
    processType: 'Scheduled',
    schedule: {
      enabled: true,
      cronExpression: '0 9 * * 1', // Monday at 9 AM
      timezone: 'America/New_York'
    },
    steps: [
      {
        stepId: uuidv4(),
        name: 'Collect Compliance Data',
        description: 'Gather compliance metrics from all systems',
        stepType: 'API_Call',
        configuration: {
          endpoints: ['/api/v1/compliance', '/api/v1/data-quality'],
          timeout: 60000
        },
        order: 1,
        isActive: true,
        retryConfig: {
          maxRetries: 3,
          retryDelay: 10000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Calculate Compliance Scores',
        description: 'Process and calculate compliance percentages',
        stepType: 'Data_Transform',
        configuration: {
          calculations: ['fisma_score', 'section508_score', 'overall_score'],
          weightings: { 'fisma': 0.6, 'section508': 0.4 }
        },
        order: 2,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 5000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Generate Executive Summary',
        description: 'Create executive-level compliance report',
        stepType: 'File_Operation',
        configuration: {
          template: 'executive-compliance-report',
          outputFormat: 'PDF',
          includeCharts: true,
          includeTrends: true
        },
        order: 3,
        isActive: true,
        retryConfig: {
          maxRetries: 1,
          retryDelay: 3000
        }
      }
    ],
    status: 'Active',
    team: 'Compliance',
    complianceLevel: 'Critical',
    auditRequired: true,
    dataClassification: 'Confidential',
    tags: ['weekly', 'compliance', 'executive', 'fisma', 'section508'],
    notifications: {
      onSuccess: {
        enabled: true,
        recipients: ['compliance@uscis.gov', 'executive@uscis.gov'],
        template: 'compliance-report-ready'
      },
      onFailure: {
        enabled: true,
        recipients: ['compliance@uscis.gov', 'admin@uscis.gov'],
        template: 'compliance-failure-alert'
      },
      onStart: {
        enabled: true,
        recipients: ['compliance@uscis.gov'],
        template: 'compliance-processing-started'
      }
    },
    version: '2.1.0'
  },
  {
    name: 'Data Backup Verification',
    description: 'Verify integrity and completeness of daily data backups',
    category: 'Backup/Recovery',
    processType: 'Scheduled',
    schedule: {
      enabled: true,
      cronExpression: '0 2 * * *', // Daily at 2 AM
      timezone: 'America/New_York'
    },
    steps: [
      {
        stepId: uuidv4(),
        name: 'Check Backup Status',
        description: 'Verify all scheduled backups completed successfully',
        stepType: 'Script_Execution',
        configuration: {
          script: 'backup-verification.sh',
          timeout: 300000
        },
        order: 1,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 30000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Validate Backup Integrity',
        description: 'Run integrity checks on backup files',
        stepType: 'Data_Validation',
        configuration: {
          checksums: true,
          sampleValidation: true,
          compressionCheck: true
        },
        order: 2,
        isActive: true,
        retryConfig: {
          maxRetries: 1,
          retryDelay: 60000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Update Backup Log',
        description: 'Record backup verification results',
        stepType: 'Database_Query',
        configuration: {
          table: 'backup_logs',
          operation: 'insert'
        },
        order: 3,
        isActive: true,
        retryConfig: {
          maxRetries: 3,
          retryDelay: 5000
        }
      }
    ],
    status: 'Active',
    team: 'Infrastructure',
    complianceLevel: 'High',
    auditRequired: true,
    dataClassification: 'Internal',
    tags: ['backup', 'verification', 'daily', 'infrastructure'],
    notifications: {
      onSuccess: {
        enabled: false,
        recipients: [],
        template: ''
      },
      onFailure: {
        enabled: true,
        recipients: ['infrastructure@uscis.gov', 'admin@uscis.gov'],
        template: 'backup-failure-critical'
      },
      onStart: {
        enabled: false,
        recipients: [],
        template: ''
      }
    },
    version: '1.0.0'
  },
  {
    name: 'Application Processing Metrics',
    description: 'Collect and process USCIS application metrics for executive dashboard',
    category: 'Analytics',
    processType: 'Scheduled',
    schedule: {
      enabled: true,
      cronExpression: '0 */4 * * *', // Every 4 hours
      timezone: 'America/New_York'
    },
    steps: [
      {
        stepId: uuidv4(),
        name: 'Extract Application Data',
        description: 'Pull latest application processing data',
        stepType: 'Database_Query',
        configuration: {
          queries: ['active_applications', 'processing_times', 'approval_rates'],
          timeout: 120000
        },
        order: 1,
        isActive: true,
        retryConfig: {
          maxRetries: 3,
          retryDelay: 15000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Calculate KPIs',
        description: 'Process data and calculate key performance indicators',
        stepType: 'Data_Transform',
        configuration: {
          metrics: ['backlog_size', 'processing_velocity', 'approval_rate'],
          aggregations: ['daily', 'weekly', 'monthly']
        },
        order: 2,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 10000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Update Dashboard',
        description: 'Refresh executive dashboard with latest metrics',
        stepType: 'API_Call',
        configuration: {
          endpoint: '/api/v1/uscis-tracking/refresh-metrics',
          method: 'POST'
        },
        order: 3,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 5000
        }
      }
    ],
    status: 'Active',
    team: 'Analytics',
    complianceLevel: 'Medium',
    auditRequired: false,
    dataClassification: 'Internal',
    tags: ['analytics', 'uscis', 'applications', 'kpi', 'dashboard'],
    notifications: {
      onSuccess: {
        enabled: false,
        recipients: [],
        template: ''
      },
      onFailure: {
        enabled: true,
        recipients: ['analytics@uscis.gov'],
        template: 'metrics-processing-failed'
      },
      onStart: {
        enabled: false,
        recipients: [],
        template: ''
      }
    },
    version: '1.1.0'
  },
  {
    name: 'Security Audit Log Processing',
    description: 'Process and analyze security audit logs for anomaly detection',
    category: 'Security',
    processType: 'Event-Driven',
    schedule: {
      enabled: false,
      cronExpression: '',
      timezone: 'America/New_York'
    },
    steps: [
      {
        stepId: uuidv4(),
        name: 'Collect Audit Logs',
        description: 'Gather security logs from all systems',
        stepType: 'File_Operation',
        configuration: {
          sources: ['/var/log/security', '/var/log/auth'],
          format: 'json'
        },
        order: 1,
        isActive: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 10000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Anomaly Detection',
        description: 'Run ML models to detect security anomalies',
        stepType: 'Script_Execution',
        configuration: {
          script: 'security-anomaly-detection.py',
          timeout: 600000
        },
        order: 2,
        isActive: true,
        retryConfig: {
          maxRetries: 1,
          retryDelay: 30000
        }
      },
      {
        stepId: uuidv4(),
        name: 'Alert on Threats',
        description: 'Send immediate alerts for detected threats',
        stepType: 'Email_Notification',
        configuration: {
          recipients: ['security@uscis.gov', 'soc@uscis.gov'],
          template: 'security-threat-alert',
          priority: 'high'
        },
        order: 3,
        isActive: true,
        retryConfig: {
          maxRetries: 3,
          retryDelay: 2000
        }
      }
    ],
    status: 'Active',
    team: 'Security',
    complianceLevel: 'Critical',
    auditRequired: true,
    dataClassification: 'Restricted',
    tags: ['security', 'audit', 'anomaly', 'ml', 'threat-detection'],
    triggers: [
      {
        triggerType: 'File_Created',
        configuration: {
          watchPath: '/var/log/security',
          filePattern: '*.log'
        },
        isActive: true
      }
    ],
    notifications: {
      onSuccess: {
        enabled: false,
        recipients: [],
        template: ''
      },
      onFailure: {
        enabled: true,
        recipients: ['security@uscis.gov', 'admin@uscis.gov'],
        template: 'security-processing-failed'
      },
      onStart: {
        enabled: false,
        recipients: [],
        template: ''
      }
    },
    version: '1.0.0'
  }
];

// Seed automated processes
const seedAutomatedProcesses = async () => {
  try {
    await connectDB();
    
    // Find a user to assign as owner (preferably admin)
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    console.log(`📝 Using admin user: ${adminUser.name} (${adminUser.email}) as process owner`);
    
    // Clear existing automated processes
    await AutomatedProcess.deleteMany({});
    console.log('🗑️  Cleared existing automated processes');
    
    // Add owner and creator to each process
    const processesWithOwner = sampleProcesses.map(process => ({
      ...process,
      owner: adminUser._id,
      createdBy: adminUser._id,
      permissions: {
        canView: ['admin', 'data-steward'],
        canEdit: ['admin', 'data-steward'],
        canExecute: ['admin', 'data-steward'],
        canDelete: ['admin']
      },
      // Add some sample execution history
      executionHistory: [
        {
          executionId: uuidv4(),
          startTime: new Date(Date.now() - 86400000), // 24 hours ago
          endTime: new Date(Date.now() - 86400000 + 120000), // 2 minutes duration
          status: 'Completed',
          result: {
            message: 'Process completed successfully',
            stepsCompleted: process.steps.length,
            duration: 120000
          },
          executedBy: 'System',
          stepResults: process.steps.map(step => ({
            stepId: step.stepId,
            status: 'Completed',
            duration: Math.floor(Math.random() * 30000) + 5000,
            result: { message: `Step ${step.name} completed successfully` }
          }))
        },
        {
          executionId: uuidv4(),
          startTime: new Date(Date.now() - 43200000), // 12 hours ago
          endTime: new Date(Date.now() - 43200000 + 95000), // 95 seconds duration
          status: 'Completed',
          result: {
            message: 'Process completed successfully',
            stepsCompleted: process.steps.length,
            duration: 95000
          },
          executedBy: 'System',
          stepResults: process.steps.map(step => ({
            stepId: step.stepId,
            status: 'Completed',
            duration: Math.floor(Math.random() * 25000) + 3000,
            result: { message: `Step ${step.name} completed successfully` }
          }))
        }
      ],
      // Initialize metrics
      metrics: {
        totalExecutions: 2,
        successfulExecutions: 2,
        failedExecutions: 0,
        averageExecutionTime: 107500, // Average of 120000 and 95000
        lastExecutionTime: new Date(Date.now() - 43200000),
        lastSuccessTime: new Date(Date.now() - 43200000 + 95000)
      }
    }));
    
    // Insert sample processes
    const createdProcesses = await AutomatedProcess.insertMany(processesWithOwner);
    console.log(`✅ Created ${createdProcesses.length} automated processes`);
    
    // Display summary
    console.log('\n📊 Created Automated Processes:');
    createdProcesses.forEach((process, index) => {
      console.log(`   ${index + 1}. ${process.name}`);
      console.log(`      Category: ${process.category}`);
      console.log(`      Type: ${process.processType}`);
      console.log(`      Status: ${process.status}`);
      console.log(`      Steps: ${process.steps.length}`);
      console.log(`      Scheduled: ${process.schedule.enabled ? 'Yes' : 'No'}`);
      console.log(`      Success Rate: ${process.successRate}%`);
      console.log('');
    });
    
    console.log('🎉 Automated Processes seeding completed successfully!');
    console.log('📍 Access URL: http://localhost:3008/admin/automated-processes');
    console.log('🔐 Login as admin to view and manage processes');
    
  } catch (error) {
    console.error('❌ Error seeding automated processes:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
if (require.main === module) {
  seedAutomatedProcesses();
}

module.exports = seedAutomatedProcesses;

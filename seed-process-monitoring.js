const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Import models
const ProcessMonitor = require('./server/models/ProcessMonitor');
const AutomatedProcess = require('./server/models/AutomatedProcess');
const User = require('./server/models/User');

// Sample process monitoring data
const sampleProcessMonitors = [
  {
    processName: 'Daily Data Quality Check',
    monitoringEnabled: true,
    monitoringLevel: 'Advanced',
    thresholds: {
      maxExecutionTime: 300000, // 5 minutes
      maxMemoryUsage: 512, // MB
      maxCpuUsage: 80, // %
      minSuccessRate: 95, // %
      maxConsecutiveFailures: 2
    },
    alertSettings: {
      enabled: true,
      channels: [
        {
          type: 'Email',
          configuration: {
            recipients: ['admin@uscis.gov', 'datasteward@uscis.gov']
          },
          isActive: true
        },
        {
          type: 'Dashboard',
          configuration: {
            priority: 'High'
          },
          isActive: true
        }
      ],
      escalationRules: [
        {
          level: 'Warning',
          delayMinutes: 15,
          recipients: ['datasteward@uscis.gov'],
          actions: ['Send_Email', 'Dashboard_Alert']
        },
        {
          level: 'Critical',
          delayMinutes: 5,
          recipients: ['admin@uscis.gov', 'datasteward@uscis.gov'],
          actions: ['Send_Email', 'Dashboard_Alert', 'SMS_Alert']
        }
      ]
    },
    currentMetrics: {
      status: 'Healthy',
      lastCheckTime: new Date(),
      responseTime: 2500,
      memoryUsage: 256,
      cpuUsage: 45,
      activeConnections: 12,
      queueSize: 0,
      errorRate: 2.1
    },
    performanceHistory: generatePerformanceHistory('Healthy', 48), // Last 48 hours
    activeAlerts: [],
    alertHistory: [
      {
        alertId: uuidv4(),
        alertType: 'Performance_Degradation',
        severity: 'Medium',
        message: 'Response time increased by 20% over baseline',
        triggeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        acknowledgedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 min later
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        duration: 2 * 60 * 60 * 1000, // 2 hours
        escalationLevel: 0,
        actions: ['Email_Sent', 'Dashboard_Updated']
      }
    ],
    healthChecks: [
      {
        checkType: 'HTTP_Endpoint',
        configuration: {
          url: 'http://localhost:3002/api/v1/data-quality/health',
          method: 'GET',
          expectedStatus: 200
        },
        interval: 60000, // 1 minute
        timeout: 10000, // 10 seconds
        isActive: true,
        lastCheck: {
          timestamp: new Date(),
          status: 'Success',
          responseTime: 150,
          result: { status: 'OK', message: 'Service healthy' }
        }
      },
      {
        checkType: 'Database_Connection',
        configuration: {
          connectionString: 'mongodb://localhost:27017/data-literacy-support',
          testQuery: 'db.dataassets.countDocuments()'
        },
        interval: 300000, // 5 minutes
        timeout: 30000, // 30 seconds
        isActive: true,
        lastCheck: {
          timestamp: new Date(),
          status: 'Success',
          responseTime: 45,
          result: { connected: true, count: 60167 }
        }
      }
    ],
    slaTargets: {
      availability: 99.5,
      responseTime: 5000,
      throughput: 100,
      errorRate: 5
    },
    slaStatus: {
      currentAvailability: 99.8,
      currentResponseTime: 2500,
      currentThroughput: 120,
      currentErrorRate: 2.1,
      lastCalculated: new Date()
    },
    maintenanceWindows: [
      {
        name: 'Weekly Maintenance',
        description: 'Routine system maintenance and updates',
        startTime: getNextSunday(2), // Next Sunday at 2 AM
        endTime: getNextSunday(4), // Next Sunday at 4 AM
        recurring: true,
        recurrencePattern: '0 2 * * 0', // Every Sunday at 2 AM
        suppressAlerts: true,
        createdBy: 'system'
      }
    ],
    dependencies: [
      {
        dependencyType: 'Database',
        name: 'MongoDB Primary',
        configuration: {
          host: 'localhost',
          port: 27017,
          database: 'data-literacy-support'
        },
        status: 'Healthy',
        lastCheck: new Date(),
        responseTime: 45
      },
      {
        dependencyType: 'API',
        name: 'Data Quality Service',
        configuration: {
          baseUrl: 'http://localhost:3002/api/v1/data-quality',
          timeout: 10000
        },
        status: 'Healthy',
        lastCheck: new Date(),
        responseTime: 150
      }
    ],
    customMetrics: [
      {
        name: 'Data Assets Processed',
        description: 'Number of data assets processed per hour',
        metricType: 'Counter',
        unit: 'assets/hour',
        threshold: {
          warning: 50,
          critical: 25
        },
        currentValue: 85,
        lastUpdated: new Date()
      },
      {
        name: 'Quality Score Average',
        description: 'Average data quality score across all assets',
        metricType: 'Gauge',
        unit: 'percentage',
        threshold: {
          warning: 70,
          critical: 50
        },
        currentValue: 78.5,
        lastUpdated: new Date()
      }
    ]
  },
  {
    processName: 'Weekly Compliance Report',
    monitoringEnabled: true,
    monitoringLevel: 'Standard',
    thresholds: {
      maxExecutionTime: 600000, // 10 minutes
      maxMemoryUsage: 1024, // MB
      maxCpuUsage: 70, // %
      minSuccessRate: 98, // %
      maxConsecutiveFailures: 1
    },
    alertSettings: {
      enabled: true,
      channels: [
        {
          type: 'Email',
          configuration: {
            recipients: ['compliance@uscis.gov']
          },
          isActive: true
        }
      ],
      escalationRules: [
        {
          level: 'Critical',
          delayMinutes: 10,
          recipients: ['compliance@uscis.gov', 'admin@uscis.gov'],
          actions: ['Send_Email']
        }
      ]
    },
    currentMetrics: {
      status: 'Warning',
      lastCheckTime: new Date(),
      responseTime: 8500,
      memoryUsage: 768,
      cpuUsage: 65,
      activeConnections: 5,
      queueSize: 2,
      errorRate: 0.5
    },
    performanceHistory: generatePerformanceHistory('Warning', 24), // Last 24 hours
    activeAlerts: [
      {
        alertId: uuidv4(),
        alertType: 'High_Error_Rate',
        severity: 'Medium',
        message: 'Compliance report generation showing increased processing time',
        triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        escalationLevel: 0,
        metadata: {
          currentResponseTime: 8500,
          thresholdResponseTime: 5000,
          trend: 'increasing'
        }
      }
    ],
    alertHistory: [],
    healthChecks: [
      {
        checkType: 'HTTP_Endpoint',
        configuration: {
          url: 'http://localhost:3002/api/v1/compliance/health',
          method: 'GET',
          expectedStatus: 200
        },
        interval: 300000, // 5 minutes
        timeout: 15000, // 15 seconds
        isActive: true,
        lastCheck: {
          timestamp: new Date(),
          status: 'Warning',
          responseTime: 8500,
          result: { status: 'SLOW', message: 'Response time elevated' }
        }
      }
    ],
    slaTargets: {
      availability: 99.0,
      responseTime: 10000,
      throughput: 50,
      errorRate: 2
    },
    slaStatus: {
      currentAvailability: 98.5,
      currentResponseTime: 8500,
      currentThroughput: 45,
      currentErrorRate: 0.5,
      lastCalculated: new Date()
    },
    maintenanceWindows: [],
    dependencies: [
      {
        dependencyType: 'Database',
        name: 'Compliance Database',
        configuration: {
          host: 'localhost',
          port: 27017,
          database: 'data-literacy-support'
        },
        status: 'Healthy',
        lastCheck: new Date(),
        responseTime: 65
      }
    ],
    customMetrics: [
      {
        name: 'Compliance Policies Checked',
        description: 'Number of compliance policies validated',
        metricType: 'Counter',
        unit: 'policies',
        threshold: {
          warning: 10,
          critical: 5
        },
        currentValue: 15,
        lastUpdated: new Date()
      }
    ]
  },
  {
    processName: 'Security Audit Log Processing',
    monitoringEnabled: true,
    monitoringLevel: 'Critical',
    thresholds: {
      maxExecutionTime: 180000, // 3 minutes
      maxMemoryUsage: 2048, // MB
      maxCpuUsage: 90, // %
      minSuccessRate: 99, // %
      maxConsecutiveFailures: 1
    },
    alertSettings: {
      enabled: true,
      channels: [
        {
          type: 'Email',
          configuration: {
            recipients: ['security@uscis.gov', 'admin@uscis.gov']
          },
          isActive: true
        },
        {
          type: 'SMS',
          configuration: {
            recipients: ['+1234567890']
          },
          isActive: true
        }
      ],
      escalationRules: [
        {
          level: 'Critical',
          delayMinutes: 1,
          recipients: ['security@uscis.gov', 'admin@uscis.gov'],
          actions: ['Send_Email', 'SMS_Alert', 'Dashboard_Alert']
        }
      ]
    },
    currentMetrics: {
      status: 'Critical',
      lastCheckTime: new Date(),
      responseTime: 15000,
      memoryUsage: 1800,
      cpuUsage: 85,
      activeConnections: 25,
      queueSize: 15,
      errorRate: 8.2
    },
    performanceHistory: generatePerformanceHistory('Critical', 12), // Last 12 hours
    activeAlerts: [
      {
        alertId: uuidv4(),
        alertType: 'Performance_Degradation',
        severity: 'Critical',
        message: 'Security audit log processing experiencing severe performance degradation',
        triggeredAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        escalationLevel: 1,
        metadata: {
          currentResponseTime: 15000,
          thresholdResponseTime: 3000,
          queueSize: 15,
          errorRate: 8.2
        }
      },
      {
        alertId: uuidv4(),
        alertType: 'Queue_Backup',
        severity: 'High',
        message: 'Processing queue backup detected - 15 items pending',
        triggeredAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        escalationLevel: 0,
        metadata: {
          queueSize: 15,
          threshold: 10
        }
      }
    ],
    alertHistory: [
      {
        alertId: uuidv4(),
        alertType: 'Memory_Threshold',
        severity: 'High',
        message: 'Memory usage exceeded 1.5GB threshold',
        triggeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        acknowledgedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5 min later
        resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 min later
        duration: 45 * 60 * 1000, // 45 minutes
        escalationLevel: 1,
        actions: ['Email_Sent', 'SMS_Sent', 'Process_Restarted']
      }
    ],
    healthChecks: [
      {
        checkType: 'HTTP_Endpoint',
        configuration: {
          url: 'http://localhost:3002/api/v1/security/health',
          method: 'GET',
          expectedStatus: 200
        },
        interval: 30000, // 30 seconds
        timeout: 5000, // 5 seconds
        isActive: true,
        lastCheck: {
          timestamp: new Date(),
          status: 'Critical',
          responseTime: 15000,
          result: { status: 'CRITICAL', message: 'Service degraded' }
        }
      }
    ],
    slaTargets: {
      availability: 99.9,
      responseTime: 3000,
      throughput: 200,
      errorRate: 1
    },
    slaStatus: {
      currentAvailability: 97.2,
      currentResponseTime: 15000,
      currentThroughput: 85,
      currentErrorRate: 8.2,
      lastCalculated: new Date()
    },
    maintenanceWindows: [],
    dependencies: [
      {
        dependencyType: 'Database',
        name: 'Security Logs Database',
        configuration: {
          host: 'localhost',
          port: 27017,
          database: 'security-logs'
        },
        status: 'Critical',
        lastCheck: new Date(),
        responseTime: 2500
      },
      {
        dependencyType: 'External_Service',
        name: 'SIEM Integration',
        configuration: {
          endpoint: 'https://siem.uscis.gov/api/logs',
          apiKey: 'encrypted'
        },
        status: 'Warning',
        lastCheck: new Date(),
        responseTime: 8500
      }
    ],
    customMetrics: [
      {
        name: 'Security Events Processed',
        description: 'Number of security events processed per minute',
        metricType: 'Counter',
        unit: 'events/min',
        threshold: {
          warning: 100,
          critical: 50
        },
        currentValue: 45,
        lastUpdated: new Date()
      },
      {
        name: 'Threat Detection Rate',
        description: 'Percentage of threats successfully detected',
        metricType: 'Gauge',
        unit: 'percentage',
        threshold: {
          warning: 95,
          critical: 90
        },
        currentValue: 92.5,
        lastUpdated: new Date()
      }
    ]
  }
];

// Helper function to generate performance history
function generatePerformanceHistory(baseStatus, hours) {
  const history = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    
    // Generate realistic metrics based on status
    let metrics = {};
    let status = baseStatus;
    
    switch (baseStatus) {
      case 'Healthy':
        metrics = {
          executionTime: Math.floor(Math.random() * 2000) + 1000, // 1-3 seconds
          memoryUsage: Math.floor(Math.random() * 200) + 200, // 200-400 MB
          cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
          responseTime: Math.floor(Math.random() * 1000) + 500, // 0.5-1.5 seconds
          throughput: Math.floor(Math.random() * 50) + 100, // 100-150 ops/min
          errorCount: Math.floor(Math.random() * 3), // 0-2 errors
          successCount: Math.floor(Math.random() * 20) + 80 // 80-100 successes
        };
        break;
        
      case 'Warning':
        metrics = {
          executionTime: Math.floor(Math.random() * 5000) + 3000, // 3-8 seconds
          memoryUsage: Math.floor(Math.random() * 400) + 400, // 400-800 MB
          cpuUsage: Math.floor(Math.random() * 30) + 50, // 50-80%
          responseTime: Math.floor(Math.random() * 3000) + 2000, // 2-5 seconds
          throughput: Math.floor(Math.random() * 30) + 70, // 70-100 ops/min
          errorCount: Math.floor(Math.random() * 8) + 2, // 2-10 errors
          successCount: Math.floor(Math.random() * 30) + 60 // 60-90 successes
        };
        break;
        
      case 'Critical':
        metrics = {
          executionTime: Math.floor(Math.random() * 10000) + 8000, // 8-18 seconds
          memoryUsage: Math.floor(Math.random() * 800) + 800, // 800-1600 MB
          cpuUsage: Math.floor(Math.random() * 20) + 70, // 70-90%
          responseTime: Math.floor(Math.random() * 8000) + 5000, // 5-13 seconds
          throughput: Math.floor(Math.random() * 30) + 30, // 30-60 ops/min
          errorCount: Math.floor(Math.random() * 15) + 10, // 10-25 errors
          successCount: Math.floor(Math.random() * 40) + 30 // 30-70 successes
        };
        break;
    }
    
    // Add some randomness to status
    if (Math.random() < 0.1) {
      const statuses = ['Healthy', 'Warning', 'Critical'];
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    history.push({
      timestamp,
      metrics,
      status
    });
  }
  
  return history;
}

// Helper function to get next Sunday at specified hour
function getNextSunday(hour = 0) {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
  nextSunday.setHours(hour, 0, 0, 0);
  return nextSunday;
}

// Seed function
const seedProcessMonitoring = async () => {
  try {
    console.log('🌱 Starting Process Monitoring data seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing process monitors
    console.log('🗑️  Clearing existing process monitors...');
    await ProcessMonitor.deleteMany({});
    
    // Get existing automated processes to link monitors
    const automatedProcesses = await AutomatedProcess.find({ isActive: true }).limit(3);
    
    if (automatedProcesses.length === 0) {
      console.log('⚠️  No automated processes found. Please seed automated processes first.');
      process.exit(1);
    }
    
    // Get a sample user for createdBy field
    let sampleUser = await User.findOne({ role: 'admin' });
    if (!sampleUser) {
      sampleUser = await User.findOne();
    }
    
    if (!sampleUser) {
      console.log('⚠️  No users found. Creating sample admin user...');
      sampleUser = await User.create({
        name: 'System Administrator',
        email: 'admin@uscis.gov',
        role: 'admin',
        password: 'hashedpassword123',
        isActive: true
      });
    }
    
    // Create process monitors linked to automated processes
    const processMonitors = [];
    
    for (let i = 0; i < Math.min(sampleProcessMonitors.length, automatedProcesses.length); i++) {
      const monitorData = {
        ...sampleProcessMonitors[i],
        processId: automatedProcesses[i]._id,
        processName: automatedProcesses[i].name,
        createdBy: sampleUser._id
      };
      
      // Fix maintenance windows createdBy to use actual user ID
      if (monitorData.maintenanceWindows && monitorData.maintenanceWindows.length > 0) {
        monitorData.maintenanceWindows = monitorData.maintenanceWindows.map(window => ({
          ...window,
          createdBy: sampleUser._id
        }));
      }
      
      const monitor = await ProcessMonitor.create(monitorData);
      processMonitors.push(monitor);
      
      console.log(`✅ Created monitor for process: ${monitor.processName}`);
    }
    
    console.log(`🎉 Successfully seeded ${processMonitors.length} process monitors!`);
    
    // Display summary
    console.log('\n📊 Process Monitoring Summary:');
    console.log('================================');
    
    const healthyCount = processMonitors.filter(m => m.currentMetrics.status === 'Healthy').length;
    const warningCount = processMonitors.filter(m => m.currentMetrics.status === 'Warning').length;
    const criticalCount = processMonitors.filter(m => m.currentMetrics.status === 'Critical').length;
    
    console.log(`Healthy Processes: ${healthyCount}`);
    console.log(`Warning Processes: ${warningCount}`);
    console.log(`Critical Processes: ${criticalCount}`);
    
    const totalActiveAlerts = processMonitors.reduce((sum, m) => sum + m.activeAlerts.length, 0);
    console.log(`Total Active Alerts: ${totalActiveAlerts}`);
    
    console.log('\n🔗 Access Process Monitoring at:');
    console.log('http://localhost:3008/admin/process-monitoring');
    
    console.log('\n🚀 Process Monitoring data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding process monitoring data:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
if (require.main === module) {
  seedProcessMonitoring();
}

module.exports = { seedProcessMonitoring };

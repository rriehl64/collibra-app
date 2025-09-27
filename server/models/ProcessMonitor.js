const mongoose = require('mongoose');

// Process Monitor Schema for real-time monitoring, alerts, and performance metrics
const ProcessMonitorSchema = new mongoose.Schema({
  // Process Reference
  processId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AutomatedProcess',
    required: [true, 'Process ID is required']
  },
  processName: {
    type: String,
    required: [true, 'Process name is required']
  },
  
  // Monitoring Configuration
  monitoringEnabled: {
    type: Boolean,
    default: true
  },
  monitoringLevel: {
    type: String,
    enum: ['Basic', 'Standard', 'Advanced', 'Critical'],
    default: 'Standard'
  },
  
  // Performance Thresholds
  thresholds: {
    maxExecutionTime: {
      type: Number,
      default: 300000, // 5 minutes in milliseconds
      min: [1000, 'Minimum execution time threshold is 1 second']
    },
    maxMemoryUsage: {
      type: Number,
      default: 512, // MB
      min: [1, 'Minimum memory threshold is 1 MB']
    },
    maxCpuUsage: {
      type: Number,
      default: 80, // Percentage
      min: [1, 'Minimum CPU threshold is 1%'],
      max: [100, 'Maximum CPU threshold is 100%']
    },
    minSuccessRate: {
      type: Number,
      default: 95, // Percentage
      min: [0, 'Minimum success rate is 0%'],
      max: [100, 'Maximum success rate is 100%']
    },
    maxConsecutiveFailures: {
      type: Number,
      default: 3,
      min: [1, 'Minimum consecutive failures is 1']
    }
  },
  
  // Alert Configuration
  alertSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    channels: [{
      type: {
        type: String,
        enum: ['Email', 'SMS', 'Slack', 'Teams', 'Webhook', 'Dashboard'],
        required: true
      },
      configuration: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    escalationRules: [{
      level: {
        type: String,
        enum: ['Warning', 'Critical', 'Emergency'],
        required: true
      },
      delayMinutes: {
        type: Number,
        default: 15,
        min: [1, 'Minimum delay is 1 minute']
      },
      recipients: [String], // Email addresses or user IDs
      actions: [String] // Automated actions to take
    }]
  },
  
  // Real-time Metrics
  currentMetrics: {
    status: {
      type: String,
      enum: ['Healthy', 'Warning', 'Critical', 'Down', 'Unknown'],
      default: 'Unknown'
    },
    lastCheckTime: {
      type: Date,
      default: Date.now
    },
    responseTime: {
      type: Number,
      default: 0 // milliseconds
    },
    memoryUsage: {
      type: Number,
      default: 0 // MB
    },
    cpuUsage: {
      type: Number,
      default: 0 // Percentage
    },
    activeConnections: {
      type: Number,
      default: 0
    },
    queueSize: {
      type: Number,
      default: 0
    },
    errorRate: {
      type: Number,
      default: 0 // Percentage
    }
  },
  
  // Historical Performance Data
  performanceHistory: [{
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    metrics: {
      executionTime: Number,
      memoryUsage: Number,
      cpuUsage: Number,
      responseTime: Number,
      throughput: Number, // Operations per minute
      errorCount: Number,
      successCount: Number
    },
    status: {
      type: String,
      enum: ['Healthy', 'Warning', 'Critical', 'Down'],
      required: true
    }
  }],
  
  // Active Alerts
  activeAlerts: [{
    alertId: {
      type: String,
      required: true
    },
    alertType: {
      type: String,
      enum: [
        'Performance_Degradation',
        'High_Error_Rate',
        'Execution_Timeout',
        'Memory_Threshold',
        'CPU_Threshold',
        'Consecutive_Failures',
        'Process_Down',
        'Queue_Backup',
        'Custom_Metric'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    triggeredAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    acknowledgedAt: Date,
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalationLevel: {
      type: Number,
      default: 0
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  
  // Alert History
  alertHistory: [{
    alertId: String,
    alertType: String,
    severity: String,
    message: String,
    triggeredAt: Date,
    acknowledgedAt: Date,
    resolvedAt: Date,
    duration: Number, // milliseconds
    escalationLevel: Number,
    actions: [String] // Actions taken
  }],
  
  // Health Checks
  healthChecks: [{
    checkType: {
      type: String,
      enum: [
        'Ping',
        'HTTP_Endpoint',
        'Database_Connection',
        'File_System',
        'API_Response',
        'Custom_Script'
      ],
      required: true
    },
    configuration: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    interval: {
      type: Number,
      default: 60000, // 1 minute in milliseconds
      min: [5000, 'Minimum interval is 5 seconds']
    },
    timeout: {
      type: Number,
      default: 30000, // 30 seconds
      min: [1000, 'Minimum timeout is 1 second']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastCheck: {
      timestamp: Date,
      status: String,
      responseTime: Number,
      result: mongoose.Schema.Types.Mixed
    }
  }],
  
  // SLA Configuration
  slaTargets: {
    availability: {
      type: Number,
      default: 99.9, // Percentage
      min: [0, 'Minimum availability is 0%'],
      max: [100, 'Maximum availability is 100%']
    },
    responseTime: {
      type: Number,
      default: 5000, // milliseconds
      min: [100, 'Minimum response time is 100ms']
    },
    throughput: {
      type: Number,
      default: 100, // Operations per minute
      min: [1, 'Minimum throughput is 1 operation per minute']
    },
    errorRate: {
      type: Number,
      default: 1, // Percentage
      min: [0, 'Minimum error rate is 0%'],
      max: [100, 'Maximum error rate is 100%']
    }
  },
  
  // Current SLA Status
  slaStatus: {
    currentAvailability: {
      type: Number,
      default: 0
    },
    currentResponseTime: {
      type: Number,
      default: 0
    },
    currentThroughput: {
      type: Number,
      default: 0
    },
    currentErrorRate: {
      type: Number,
      default: 0
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Maintenance Windows
  maintenanceWindows: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    recurring: {
      type: Boolean,
      default: false
    },
    recurrencePattern: String, // Cron expression for recurring maintenance
    suppressAlerts: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Dependencies Monitoring
  dependencies: [{
    dependencyType: {
      type: String,
      enum: ['Database', 'API', 'Service', 'File_System', 'Network', 'External_Service'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    configuration: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['Healthy', 'Warning', 'Critical', 'Down'],
      default: 'Unknown'
    },
    lastCheck: Date,
    responseTime: Number
  }],
  
  // Custom Metrics
  customMetrics: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    metricType: {
      type: String,
      enum: ['Counter', 'Gauge', 'Histogram', 'Timer'],
      required: true
    },
    unit: String,
    threshold: {
      warning: Number,
      critical: Number
    },
    currentValue: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
ProcessMonitorSchema.index({ processId: 1 });
ProcessMonitorSchema.index({ 'currentMetrics.status': 1 });
ProcessMonitorSchema.index({ 'activeAlerts.severity': 1 });
ProcessMonitorSchema.index({ 'activeAlerts.triggeredAt': -1 });
ProcessMonitorSchema.index({ 'performanceHistory.timestamp': -1 });
ProcessMonitorSchema.index({ createdAt: -1 });
ProcessMonitorSchema.index({ updatedAt: -1 });

// Virtual for overall health score
ProcessMonitorSchema.virtual('healthScore').get(function() {
  const metrics = this.currentMetrics;
  let score = 100;
  
  // Deduct points based on current status
  switch (metrics.status) {
    case 'Critical':
      score -= 50;
      break;
    case 'Warning':
      score -= 25;
      break;
    case 'Down':
      score = 0;
      break;
  }
  
  // Deduct points for active alerts
  const criticalAlerts = this.activeAlerts.filter(alert => alert.severity === 'Critical').length;
  const highAlerts = this.activeAlerts.filter(alert => alert.severity === 'High').length;
  
  score -= (criticalAlerts * 20) + (highAlerts * 10);
  
  return Math.max(0, score);
});

// Virtual for SLA compliance
ProcessMonitorSchema.virtual('slaCompliance').get(function() {
  const status = this.slaStatus;
  const targets = this.slaTargets;
  
  let compliance = 0;
  let checks = 0;
  
  if (targets.availability && status.currentAvailability !== undefined) {
    compliance += status.currentAvailability >= targets.availability ? 25 : 0;
    checks++;
  }
  
  if (targets.responseTime && status.currentResponseTime !== undefined) {
    compliance += status.currentResponseTime <= targets.responseTime ? 25 : 0;
    checks++;
  }
  
  if (targets.throughput && status.currentThroughput !== undefined) {
    compliance += status.currentThroughput >= targets.throughput ? 25 : 0;
    checks++;
  }
  
  if (targets.errorRate && status.currentErrorRate !== undefined) {
    compliance += status.currentErrorRate <= targets.errorRate ? 25 : 0;
    checks++;
  }
  
  return checks > 0 ? (compliance / checks) * 4 : 0; // Scale to 100
});

// Virtual for active alert count by severity
ProcessMonitorSchema.virtual('alertCounts').get(function() {
  const alerts = this.activeAlerts;
  return {
    critical: alerts.filter(alert => alert.severity === 'Critical').length,
    high: alerts.filter(alert => alert.severity === 'High').length,
    medium: alerts.filter(alert => alert.severity === 'Medium').length,
    low: alerts.filter(alert => alert.severity === 'Low').length,
    total: alerts.length
  };
});

// Pre-save middleware to clean up old performance history
ProcessMonitorSchema.pre('save', function(next) {
  // Keep only last 1000 performance history records
  if (this.performanceHistory && this.performanceHistory.length > 1000) {
    this.performanceHistory = this.performanceHistory.slice(-1000);
  }
  
  // Keep only last 500 alert history records
  if (this.alertHistory && this.alertHistory.length > 500) {
    this.alertHistory = this.alertHistory.slice(-500);
  }
  
  next();
});

// Static method to find monitors with active alerts
ProcessMonitorSchema.statics.findWithActiveAlerts = function(severity = null) {
  const filter = { 
    isActive: true,
    'activeAlerts.0': { $exists: true } // Has at least one active alert
  };
  
  if (severity) {
    filter['activeAlerts.severity'] = severity;
  }
  
  return this.find(filter).populate('processId', 'name category status');
};

// Static method to find monitors by health status
ProcessMonitorSchema.statics.findByHealthStatus = function(status) {
  return this.find({
    isActive: true,
    'currentMetrics.status': status
  }).populate('processId', 'name category status');
};

// Instance method to add performance data
ProcessMonitorSchema.methods.addPerformanceData = function(metrics, status = 'Healthy') {
  this.performanceHistory.push({
    timestamp: new Date(),
    metrics,
    status
  });
  
  // Update current metrics
  Object.assign(this.currentMetrics, metrics);
  this.currentMetrics.status = status;
  this.currentMetrics.lastCheckTime = new Date();
  
  return this.save();
};

// Instance method to trigger alert
ProcessMonitorSchema.methods.triggerAlert = function(alertType, severity, message, metadata = {}) {
  const alertId = require('uuid').v4();
  
  const alert = {
    alertId,
    alertType,
    severity,
    message,
    triggeredAt: new Date(),
    metadata
  };
  
  this.activeAlerts.push(alert);
  
  return this.save().then(() => alert);
};

// Instance method to acknowledge alert
ProcessMonitorSchema.methods.acknowledgeAlert = function(alertId, userId) {
  const alert = this.activeAlerts.find(a => a.alertId === alertId);
  if (alert) {
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = userId;
    return this.save();
  }
  return Promise.reject(new Error('Alert not found'));
};

// Instance method to resolve alert
ProcessMonitorSchema.methods.resolveAlert = function(alertId, userId) {
  const alertIndex = this.activeAlerts.findIndex(a => a.alertId === alertId);
  if (alertIndex !== -1) {
    const alert = this.activeAlerts[alertIndex];
    alert.resolvedAt = new Date();
    alert.resolvedBy = userId;
    
    // Move to history
    const historyEntry = {
      alertId: alert.alertId,
      alertType: alert.alertType,
      severity: alert.severity,
      message: alert.message,
      triggeredAt: alert.triggeredAt,
      acknowledgedAt: alert.acknowledgedAt,
      resolvedAt: alert.resolvedAt,
      duration: alert.resolvedAt.getTime() - alert.triggeredAt.getTime(),
      escalationLevel: alert.escalationLevel,
      actions: []
    };
    
    this.alertHistory.push(historyEntry);
    this.activeAlerts.splice(alertIndex, 1);
    
    return this.save();
  }
  return Promise.reject(new Error('Alert not found'));
};

// Instance method to calculate SLA status
ProcessMonitorSchema.methods.calculateSLAStatus = function(timeframe = 24) {
  const now = new Date();
  const startTime = new Date(now.getTime() - (timeframe * 60 * 60 * 1000));
  
  const recentHistory = this.performanceHistory.filter(
    entry => entry.timestamp >= startTime
  );
  
  if (recentHistory.length === 0) {
    return this.slaStatus;
  }
  
  // Calculate availability (percentage of time not in 'Down' status)
  const downTime = recentHistory.filter(entry => entry.status === 'Down').length;
  const availability = ((recentHistory.length - downTime) / recentHistory.length) * 100;
  
  // Calculate average response time
  const responseTimes = recentHistory
    .filter(entry => entry.metrics && entry.metrics.responseTime)
    .map(entry => entry.metrics.responseTime);
  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : 0;
  
  // Calculate throughput (operations per minute)
  const throughputData = recentHistory
    .filter(entry => entry.metrics && entry.metrics.throughput)
    .map(entry => entry.metrics.throughput);
  const avgThroughput = throughputData.length > 0
    ? throughputData.reduce((sum, tp) => sum + tp, 0) / throughputData.length
    : 0;
  
  // Calculate error rate
  const errorData = recentHistory.filter(entry => 
    entry.metrics && (entry.metrics.errorCount !== undefined || entry.metrics.successCount !== undefined)
  );
  let errorRate = 0;
  if (errorData.length > 0) {
    const totalErrors = errorData.reduce((sum, entry) => sum + (entry.metrics.errorCount || 0), 0);
    const totalSuccess = errorData.reduce((sum, entry) => sum + (entry.metrics.successCount || 0), 0);
    const totalOperations = totalErrors + totalSuccess;
    errorRate = totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;
  }
  
  // Update SLA status
  this.slaStatus = {
    currentAvailability: availability,
    currentResponseTime: avgResponseTime,
    currentThroughput: avgThroughput,
    currentErrorRate: errorRate,
    lastCalculated: new Date()
  };
  
  return this.slaStatus;
};

module.exports = mongoose.model('ProcessMonitor', ProcessMonitorSchema);

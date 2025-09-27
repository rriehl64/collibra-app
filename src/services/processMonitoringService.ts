import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Process Monitor interfaces
export interface ProcessMonitor {
  _id: string;
  processId: string;
  processName: string;
  monitoringEnabled: boolean;
  monitoringLevel: 'Basic' | 'Standard' | 'Advanced' | 'Critical';
  thresholds: {
    maxExecutionTime: number;
    maxMemoryUsage: number;
    maxCpuUsage: number;
    minSuccessRate: number;
    maxConsecutiveFailures: number;
  };
  alertSettings: {
    enabled: boolean;
    channels: AlertChannel[];
    escalationRules: EscalationRule[];
  };
  currentMetrics: {
    status: 'Healthy' | 'Warning' | 'Critical' | 'Down' | 'Unknown';
    lastCheckTime: string;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
    queueSize: number;
    errorRate: number;
  };
  performanceHistory: PerformanceEntry[];
  activeAlerts: Alert[];
  alertHistory: AlertHistoryEntry[];
  healthChecks: HealthCheck[];
  slaTargets: {
    availability: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
  };
  slaStatus: {
    currentAvailability: number;
    currentResponseTime: number;
    currentThroughput: number;
    currentErrorRate: number;
    lastCalculated: string;
  };
  maintenanceWindows: MaintenanceWindow[];
  dependencies: Dependency[];
  customMetrics: CustomMetric[];
  healthScore?: number;
  slaCompliance?: number;
  alertCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface AlertChannel {
  type: 'Email' | 'SMS' | 'Slack' | 'Teams' | 'Webhook' | 'Dashboard';
  configuration: Record<string, any>;
  isActive: boolean;
}

export interface EscalationRule {
  level: 'Warning' | 'Critical' | 'Emergency';
  delayMinutes: number;
  recipients: string[];
  actions: string[];
}

export interface PerformanceEntry {
  timestamp: string;
  metrics: {
    executionTime?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    responseTime?: number;
    throughput?: number;
    errorCount?: number;
    successCount?: number;
  };
  status: 'Healthy' | 'Warning' | 'Critical' | 'Down';
}

export interface Alert {
  alertId: string;
  alertType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  resolvedAt?: string;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  escalationLevel: number;
  metadata: Record<string, any>;
}

export interface AlertHistoryEntry {
  alertId: string;
  alertType: string;
  severity: string;
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  duration?: number;
  escalationLevel: number;
  actions: string[];
}

export interface HealthCheck {
  checkType: 'Ping' | 'HTTP_Endpoint' | 'Database_Connection' | 'File_System' | 'API_Response' | 'Custom_Script';
  configuration: Record<string, any>;
  interval: number;
  timeout: number;
  isActive: boolean;
  lastCheck?: {
    timestamp: string;
    status: string;
    responseTime: number;
    result: any;
  };
}

export interface MaintenanceWindow {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurrencePattern?: string;
  suppressAlerts: boolean;
  createdBy: string;
}

export interface Dependency {
  dependencyType: 'Database' | 'API' | 'Service' | 'File_System' | 'Network' | 'External_Service';
  name: string;
  configuration: Record<string, any>;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Down';
  lastCheck?: string;
  responseTime?: number;
}

export interface CustomMetric {
  name: string;
  description?: string;
  metricType: 'Counter' | 'Gauge' | 'Histogram' | 'Timer';
  unit?: string;
  threshold?: {
    warning?: number;
    critical?: number;
  };
  currentValue: number;
  lastUpdated: string;
}

export interface MonitoringDashboard {
  summary: {
    totalMonitors: number;
    healthyProcesses: number;
    warningProcesses: number;
    criticalProcesses: number;
    downProcesses: number;
    totalActiveAlerts: number;
    avgResponseTime: number;
    avgMemoryUsage: number;
    avgCpuUsage: number;
    healthPercentage: number;
  };
  alertBreakdown: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  performanceTrends: Array<{
    _id: {
      hour: number;
      date: string;
    };
    avgResponseTime: number;
    avgMemoryUsage: number;
    avgCpuUsage: number;
    errorCount: number;
    successCount: number;
  }>;
  topAlertProcesses: Array<{
    processName: string;
    processId: string;
    alertCount: number;
    currentStatus: string;
  }>;
  slaCompliance: {
    avgAvailability: number;
    avgResponseTime: number;
    avgThroughput: number;
    avgErrorRate: number;
  };
  recentAlerts: Array<{
    processName: string;
    processId: string;
    alert: Alert;
  }>;
  timeframe: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  summary?: any;
  error?: string;
  message?: string;
}

class ProcessMonitoringService {
  private baseURL = `${API_BASE_URL}/process-monitoring`;

  // Get all process monitors
  async getProcessMonitors(params?: {
    status?: string;
    severity?: string;
    processId?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<ProcessMonitor[]>> {
    try {
      const response = await axios.get(this.baseURL, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching process monitors:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch process monitors');
    }
  }

  // Get single process monitor
  async getProcessMonitor(id: string): Promise<ApiResponse<ProcessMonitor>> {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching process monitor:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch process monitor');
    }
  }

  // Create new process monitor
  async createProcessMonitor(monitorData: Partial<ProcessMonitor>): Promise<ApiResponse<ProcessMonitor>> {
    try {
      const response = await axios.post(this.baseURL, monitorData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating process monitor:', error);
      throw new Error(error.response?.data?.error || 'Failed to create process monitor');
    }
  }

  // Update process monitor
  async updateProcessMonitor(id: string, monitorData: Partial<ProcessMonitor>): Promise<ApiResponse<ProcessMonitor>> {
    try {
      const response = await axios.put(`${this.baseURL}/${id}`, monitorData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating process monitor:', error);
      throw new Error(error.response?.data?.error || 'Failed to update process monitor');
    }
  }

  // Delete process monitor
  async deleteProcessMonitor(id: string): Promise<ApiResponse<{}>> {
    try {
      const response = await axios.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting process monitor:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete process monitor');
    }
  }

  // Get monitoring dashboard analytics
  async getMonitoringDashboard(timeframe: string = '24h'): Promise<ApiResponse<MonitoringDashboard>> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/dashboard`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching monitoring dashboard:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch monitoring dashboard');
    }
  }

  // Add performance data
  async addPerformanceData(
    id: string, 
    metrics: Record<string, number>, 
    status: string = 'Healthy'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${this.baseURL}/${id}/performance`, {
        metrics,
        status
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding performance data:', error);
      throw new Error(error.response?.data?.error || 'Failed to add performance data');
    }
  }

  // Trigger alert
  async triggerAlert(
    id: string,
    alertType: string,
    severity: string,
    message: string,
    metadata: Record<string, any> = {}
  ): Promise<ApiResponse<Alert>> {
    try {
      const response = await axios.post(`${this.baseURL}/${id}/alerts`, {
        alertType,
        severity,
        message,
        metadata
      });
      return response.data;
    } catch (error: any) {
      console.error('Error triggering alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to trigger alert');
    }
  }

  // Acknowledge alert
  async acknowledgeAlert(id: string, alertId: string): Promise<ApiResponse<{}>> {
    try {
      const response = await axios.patch(`${this.baseURL}/${id}/alerts/${alertId}/acknowledge`);
      return response.data;
    } catch (error: any) {
      console.error('Error acknowledging alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to acknowledge alert');
    }
  }

  // Resolve alert
  async resolveAlert(id: string, alertId: string): Promise<ApiResponse<{}>> {
    try {
      const response = await axios.patch(`${this.baseURL}/${id}/alerts/${alertId}/resolve`);
      return response.data;
    } catch (error: any) {
      console.error('Error resolving alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to resolve alert');
    }
  }

  // Get alert history
  async getAlertHistory(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      severity?: string;
      alertType?: string;
    }
  ): Promise<ApiResponse<AlertHistoryEntry[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/${id}/alerts/history`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching alert history:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch alert history');
    }
  }

  // Update SLA targets
  async updateSLATargets(
    id: string,
    slaTargets: Partial<ProcessMonitor['slaTargets']>
  ): Promise<ApiResponse<any>> {
    try {
      const response = await axios.patch(`${this.baseURL}/${id}/sla`, { slaTargets });
      return response.data;
    } catch (error: any) {
      console.error('Error updating SLA targets:', error);
      throw new Error(error.response?.data?.error || 'Failed to update SLA targets');
    }
  }

  // Get monitors by health status
  async getMonitorsByStatus(status: string): Promise<ApiResponse<ProcessMonitor[]>> {
    return this.getProcessMonitors({ status });
  }

  // Get monitors with active alerts
  async getMonitorsWithAlerts(severity?: string): Promise<ApiResponse<ProcessMonitor[]>> {
    return this.getProcessMonitors({ severity });
  }

  // Bulk acknowledge alerts
  async bulkAcknowledgeAlerts(alerts: Array<{ monitorId: string; alertId: string }>): Promise<void> {
    const promises = alerts.map(({ monitorId, alertId }) => 
      this.acknowledgeAlert(monitorId, alertId)
    );
    await Promise.all(promises);
  }

  // Bulk resolve alerts
  async bulkResolveAlerts(alerts: Array<{ monitorId: string; alertId: string }>): Promise<void> {
    const promises = alerts.map(({ monitorId, alertId }) => 
      this.resolveAlert(monitorId, alertId)
    );
    await Promise.all(promises);
  }

  // Get health score color
  getHealthScoreColor(score: number): string {
    if (score >= 90) return '#4caf50'; // Green
    if (score >= 70) return '#ff9800'; // Orange
    if (score >= 50) return '#f44336'; // Red
    return '#9e9e9e'; // Gray
  }

  // Get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'Healthy':
        return '#4caf50'; // Green
      case 'Warning':
        return '#ff9800'; // Orange
      case 'Critical':
        return '#f44336'; // Red
      case 'Down':
        return '#9e9e9e'; // Gray
      default:
        return '#2196f3'; // Blue
    }
  }

  // Get severity color
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'Critical':
        return '#d32f2f'; // Dark Red
      case 'High':
        return '#f44336'; // Red
      case 'Medium':
        return '#ff9800'; // Orange
      case 'Low':
        return '#2196f3'; // Blue
      default:
        return '#9e9e9e'; // Gray
    }
  }

  // Format duration
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // Format bytes
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Format percentage
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}

export default new ProcessMonitoringService();

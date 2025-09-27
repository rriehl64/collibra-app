import api from './api';

// TypeScript interfaces for Automated Processes
export interface ProcessStep {
  stepId: string;
  name: string;
  description?: string;
  stepType: 'API_Call' | 'Database_Query' | 'File_Operation' | 'Email_Notification' | 
           'Data_Validation' | 'Data_Transform' | 'Conditional_Logic' | 'Wait_Delay' | 
           'Script_Execution' | 'Human_Approval';
  configuration: Record<string, any>;
  order: number;
  isActive: boolean;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface ProcessSchedule {
  enabled: boolean;
  cronExpression?: string;
  timezone: string;
  nextRun?: string;
  lastRun?: string;
}

export interface ProcessNotifications {
  onSuccess: {
    enabled: boolean;
    recipients: string[];
    template?: string;
  };
  onFailure: {
    enabled: boolean;
    recipients: string[];
    template?: string;
  };
  onStart: {
    enabled: boolean;
    recipients: string[];
    template?: string;
  };
}

export interface ProcessMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime?: string;
  lastSuccessTime?: string;
  lastFailureTime?: string;
}

export interface ExecutionRecord {
  executionId: string;
  startTime: string;
  endTime?: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Cancelled' | 'Timeout';
  result?: Record<string, any>;
  errorMessage?: string;
  executedBy: string;
  stepResults: Array<{
    stepId: string;
    status: string;
    duration: number;
    result?: Record<string, any>;
    errorMessage?: string;
  }>;
}

export interface AutomatedProcess {
  _id: string;
  name: string;
  description: string;
  category: 'Data Quality' | 'Data Governance' | 'Compliance' | 'Reporting' | 
           'ETL/Integration' | 'Monitoring' | 'Backup/Recovery' | 'Security' | 
           'Workflow' | 'Notification' | 'Analytics' | 'Other';
  processType: 'Scheduled' | 'Event-Driven' | 'Manual' | 'Continuous' | 'On-Demand';
  schedule: ProcessSchedule;
  steps: ProcessStep[];
  status: 'Active' | 'Inactive' | 'Draft' | 'Paused' | 'Error' | 'Archived';
  executionHistory: ExecutionRecord[];
  metrics: ProcessMetrics;
  notifications: ProcessNotifications;
  dependencies: Array<{
    processId: string;
    dependencyType: 'Success' | 'Completion' | 'Failure';
  }>;
  triggers: Array<{
    triggerType: 'File_Created' | 'File_Modified' | 'Database_Change' | 
                'API_Webhook' | 'Time_Based' | 'Manual' | 'Process_Completion';
    configuration: Record<string, any>;
    isActive: boolean;
  }>;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  team: string;
  permissions: {
    canView: string[];
    canEdit: string[];
    canExecute: string[];
    canDelete: string[];
  };
  complianceLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  auditRequired: boolean;
  dataClassification: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  tags: string[];
  metadata: Record<string, any>;
  version: string;
  changeLog: Array<{
    version: string;
    changes: string;
    changedBy: {
      _id: string;
      name: string;
    };
    changeDate: string;
  }>;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  successRate?: string;
  failureRate?: string;
  nextRunFormatted?: string;
  lastExecutionStatus?: string;
}

export interface ProcessesResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  summary: {
    totalProcesses: number;
    activeProcesses: number;
    scheduledProcesses: number;
    totalExecutions: number;
    totalSuccessful: number;
    totalFailed: number;
    overallSuccessRate: string;
  };
  data: AutomatedProcess[];
}

export interface DashboardAnalytics {
  summary: {
    totalProcesses: number;
    activeProcesses: number;
    scheduledProcesses: number;
    totalExecutions: number;
    totalSuccessful: number;
    totalFailed: number;
    avgExecutionTime: number;
    successRate: string;
  };
  categoryBreakdown: Array<{
    _id: string;
    count: number;
    activeCount: number;
  }>;
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  recentExecutions: Array<{
    _id: string;
    name: string;
    category: string;
    execution: ExecutionRecord;
  }>;
  timeframe: string;
}

export interface CreateProcessData {
  name: string;
  description: string;
  category: string;
  processType: string;
  schedule?: Partial<ProcessSchedule>;
  steps?: Partial<ProcessStep>[];
  notifications?: Partial<ProcessNotifications>;
  team: string;
  complianceLevel?: string;
  dataClassification?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateProcessData extends Partial<CreateProcessData> {
  status?: string;
  changeDescription?: string;
}

class AutomatedProcessesService {
  private baseURL = '/automated-processes';

  // Get all automated processes with filtering and pagination
  async getProcesses(params?: {
    category?: string;
    status?: string;
    processType?: string;
    team?: string;
    owner?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProcessesResponse> {
    try {
      console.log('🤖 Attempting to fetch automated processes from:', this.baseURL);
      console.log('🤖 Request params:', params);
      
      const response = await api.get(this.baseURL, { params });
      
      console.log('🤖 Automated processes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching automated processes:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  // Get single automated process by ID
  async getProcess(id: string): Promise<{ success: boolean; data: AutomatedProcess }> {
    try {
      const response = await api.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching automated process:', error);
      throw error;
    }
  }

  // Create new automated process
  async createProcess(data: CreateProcessData): Promise<{ success: boolean; data: AutomatedProcess }> {
    try {
      const response = await api.post(this.baseURL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating automated process:', error);
      throw error;
    }
  }

  // Update automated process
  async updateProcess(id: string, data: UpdateProcessData): Promise<{ success: boolean; data: AutomatedProcess }> {
    try {
      const response = await api.put(`${this.baseURL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating automated process:', error);
      throw error;
    }
  }

  // Delete automated process (soft delete)
  async deleteProcess(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting automated process:', error);
      throw error;
    }
  }

  // Execute automated process
  async executeProcess(id: string): Promise<{
    success: boolean;
    message: string;
    data: {
      executionId: string;
      status: string;
      startTime: string;
    };
  }> {
    try {
      const response = await api.post(`${this.baseURL}/${id}/execute`);
      return response.data;
    } catch (error) {
      console.error('Error executing automated process:', error);
      throw error;
    }
  }

  // Get execution history for a process
  async getExecutionHistory(id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: ExecutionRecord[];
  }> {
    try {
      const response = await api.get(`${this.baseURL}/${id}/executions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching execution history:', error);
      throw error;
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<{
    success: boolean;
    data: DashboardAnalytics;
  }> {
    try {
      console.log('📊 Attempting to fetch dashboard analytics from:', `${this.baseURL}/analytics/dashboard`);
      
      const response = await api.get(`${this.baseURL}/analytics/dashboard`, {
        params: { timeframe }
      });
      
      console.log('📊 Dashboard analytics response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching dashboard analytics:', error);
      console.error('❌ Analytics error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  // Get automated processes count for dashboard
  async getProcessesCount(): Promise<{
    success: boolean;
    data: {
      totalProcesses: number;
      activeProcesses: number;
    };
  }> {
    try {
      console.log('🤖 Attempting to fetch automated processes count from:', this.baseURL);
      
      const response = await api.get(this.baseURL, { 
        params: { limit: 1 } // Just get summary data
      });
      
      console.log('🤖 Automated processes count response:', response.data);
      return {
        success: true,
        data: {
          totalProcesses: response.data.summary?.totalProcesses || 0,
          activeProcesses: response.data.summary?.activeProcesses || 0
        }
      };
    } catch (error: any) {
      console.error('❌ Error fetching automated processes count:', error);
      console.error('❌ Count error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  // Toggle process status (activate/deactivate)
  async toggleProcessStatus(id: string): Promise<{
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      status: string;
    };
  }> {
    try {
      const response = await api.patch(`${this.baseURL}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling process status:', error);
      throw error;
    }
  }

  // Update process schedule
  async updateProcessSchedule(id: string, scheduleData: {
    enabled: boolean;
    cronExpression: string;
    timezone: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: AutomatedProcess;
  }> {
    try {
      console.log('📅 Updating process schedule:', { id, scheduleData });
      const response = await api.patch(`${this.baseURL}/${id}/schedule`, { schedule: scheduleData });
      console.log('📅 Schedule update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating process schedule:', error);
      console.error('❌ Schedule update error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  // Get scheduled processes (processes with scheduling enabled)
  async getScheduledProcesses(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProcessesResponse> {
    try {
      console.log('📅 Fetching scheduled processes');
      const response = await api.get(`${this.baseURL}/scheduled`, { params });
      console.log('📅 Scheduled processes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching scheduled processes:', error);
      throw error;
    }
  }

  // Get next scheduled runs for all processes
  async getScheduleCalendar(params?: {
    days?: number;
    timezone?: string;
  }): Promise<{
    success: boolean;
    data: Array<{
      processId: string;
      processName: string;
      category: string;
      nextRun: string;
      cronExpression: string;
      timezone: string;
      status: string;
    }>;
  }> {
    try {
      console.log('📅 Fetching schedule calendar');
      const response = await api.get(`${this.baseURL}/schedule/calendar`, { params });
      console.log('📅 Schedule calendar response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching schedule calendar:', error);
      throw error;
    }
  }

  // Validate cron expression
  async validateCronExpression(cronExpression: string, timezone?: string): Promise<{
    success: boolean;
    valid: boolean;
    nextRuns?: string[];
    description?: string;
    error?: string;
  }> {
    try {
      console.log('📅 Validating cron expression:', cronExpression);
      const response = await api.post(`${this.baseURL}/schedule/validate-cron`, {
        cronExpression,
        timezone: timezone || 'America/New_York'
      });
      console.log('📅 Cron validation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error validating cron expression:', error);
      throw error;
    }
  }

  // Utility methods for frontend
  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return '#4CAF50'; // Green
      case 'Inactive':
        return '#FFC107'; // Yellow
      case 'Draft':
        return '#2196F3'; // Blue
      case 'Paused':
        return '#FF9800'; // Orange
      case 'Error':
        return '#F44336'; // Red
      case 'Archived':
        return '#9E9E9E'; // Gray
      default:
        return '#9E9E9E';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Data Quality':
        return '#1976D2'; // Blue
      case 'Data Governance':
        return '#388E3C'; // Green
      case 'Compliance':
        return '#7B1FA2'; // Purple
      case 'Reporting':
        return '#F57C00'; // Orange
      case 'ETL/Integration':
        return '#5D4037'; // Brown
      case 'Monitoring':
        return '#0097A7'; // Cyan
      case 'Backup/Recovery':
        return '#455A64'; // Blue Gray
      case 'Security':
        return '#D32F2F'; // Red
      case 'Workflow':
        return '#303F9F'; // Indigo
      case 'Notification':
        return '#689F38'; // Light Green
      case 'Analytics':
        return '#E64A19'; // Deep Orange
      default:
        return '#616161'; // Gray
    }
  }

  getExecutionStatusColor(status: string): string {
    switch (status) {
      case 'Running':
        return '#2196F3'; // Blue
      case 'Completed':
        return '#4CAF50'; // Green
      case 'Failed':
        return '#F44336'; // Red
      case 'Cancelled':
        return '#FF9800'; // Orange
      case 'Timeout':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Gray
    }
  }

  formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else if (milliseconds < 3600000) {
      return `${(milliseconds / 60000).toFixed(1)}m`;
    } else {
      return `${(milliseconds / 3600000).toFixed(1)}h`;
    }
  }

  formatExecutionTime(startTime: string, endTime?: string): string {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = end.getTime() - start.getTime();
    return this.formatDuration(duration);
  }

  getComplianceLevelColor(level: string): string {
    switch (level) {
      case 'Low':
        return '#4CAF50'; // Green
      case 'Medium':
        return '#FF9800'; // Orange
      case 'High':
        return '#F44336'; // Red
      case 'Critical':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Gray
    }
  }
}

export default new AutomatedProcessesService();

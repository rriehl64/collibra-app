import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

// Enums for application types and statuses
export enum ApplicationType {
  NATURALIZATION = 'N-400',
  GREEN_CARD = 'I-485',
  GREEN_CARD_RENEWAL = 'I-90',
  WORK_AUTHORIZATION = 'I-765',
  TRAVEL_DOCUMENT = 'I-131',
  FAMILY_PETITION = 'I-130',
  EMPLOYMENT_PETITION = 'I-140',
  ASYLUM = 'I-589',
  REFUGEE_TRAVEL = 'I-327',
  CONDITIONAL_RESIDENCE = 'I-751'
}

export enum ApplicationStatus {
  RECEIVED = 'Case Was Received',
  UNDER_REVIEW = 'Case Is Being Actively Reviewed',
  RFE_SENT = 'Request for Additional Evidence Was Sent',
  RFE_RECEIVED = 'Response To USCIS Request Received',
  INTERVIEW_SCHEDULED = 'Interview Was Scheduled',
  INTERVIEW_COMPLETED = 'Interview Was Completed',
  DECISION_PENDING = 'Case Is Ready to Be Scheduled for An Interview',
  APPROVED = 'Case Was Approved',
  DENIED = 'Case Was Denied',
  WITHDRAWN = 'Case Was Withdrawn',
  TERMINATED = 'Case Was Terminated',
  TRANSFERRED = 'Case Was Transferred'
}

export enum ProcessingCenter {
  NBC = 'National Benefits Center',
  TSC = 'Texas Service Center',
  NSC = 'Nebraska Service Center',
  VSC = 'Vermont Service Center',
  CSC = 'California Service Center',
  POTOMAC = 'Potomac Service Center',
  LOCKBOX = 'USCIS Lockbox Facility'
}

export enum Priority {
  STANDARD = 'Standard',
  EXPEDITED = 'Expedited',
  PREMIUM = 'Premium Processing',
  EMERGENCY = 'Emergency'
}

// Core interfaces
export interface BenefitApplication {
  _id?: string;
  receiptNumber: string;
  applicationType: ApplicationType;
  currentStatus: ApplicationStatus;
  priority: Priority;
  processingCenter: ProcessingCenter;
  
  // Dates
  receivedDate: string;
  lastUpdatedDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  
  // Applicant information (anonymized for privacy)
  applicantId: string;
  countryOfBirth?: string;
  applicationChannel: 'Online' | 'Mail' | 'In-Person';
  
  // Processing metrics
  processingTimeBusinessDays?: number;
  currentStepDuration?: number;
  totalStepsCompleted: number;
  totalStepsRequired: number;
  
  // Flags and indicators
  hasRFE: boolean;
  hasInterview: boolean;
  isExpedited: boolean;
  hasComplications: boolean;
  
  // AI/ML fields for analytics
  riskScore?: number; // 0-1 scale
  predictedProcessingDays?: number;
  anomalyFlags?: string[];
  confidenceScore?: number;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationMetrics {
  totalApplications: number;
  applicationsByType: { [key in ApplicationType]?: number };
  applicationsByStatus: { [key in ApplicationStatus]?: number };
  applicationsByCenter: { [key in ProcessingCenter]?: number };
  averageProcessingTime: number;
  backlogCount: number;
  completionRate: number;
  expeditedCount: number;
  rfeRate: number;
  approvalRate: number;
  denialRate: number;
}

export interface ProcessingTrends {
  period: string;
  received: number;
  approved: number;
  denied: number;
  pending: number;
  averageProcessingDays: number;
  backlogSize: number;
}

export interface BacklogAnalysis {
  currentBacklog: number;
  backlogByType: { [key in ApplicationType]?: number };
  backlogByCenter: { [key in ProcessingCenter]?: number };
  oldestCase: {
    receiptNumber: string;
    daysInSystem: number;
    applicationType: ApplicationType;
  };
  projectedClearanceDate: string;
  bottlenecks: Array<{
    step: string;
    averageDuration: number;
    casesAffected: number;
  }>;
}

export interface MLInsights {
  forecastedBacklog: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
  };
  processingTimeEstimate: {
    applicationType: ApplicationType;
    estimatedDays: number;
    confidence: number;
    factors: string[];
  }[];
  anomalies: Array<{
    type: 'delay' | 'volume_spike' | 'approval_rate_drop';
    description: string;
    severity: 'low' | 'medium' | 'high';
    affectedCases: number;
    recommendedAction: string;
  }>;
  riskFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface BusinessQuestion {
  id: string;
  question: string;
  category: 'volume' | 'processing_time' | 'backlog' | 'approval_rate' | 'trends';
  priority: 'high' | 'medium' | 'low';
  sqlQuery?: string;
  lastExecuted?: string;
  result?: any;
}

export interface DashboardConfig {
  refreshInterval: number;
  defaultDateRange: string;
  enabledMetrics: string[];
  alertThresholds: {
    backlogSize: number;
    processingTimeIncrease: number;
    approvalRateDecrease: number;
  };
}

class USCISApplicationTrackingService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/uscis-tracking`;
  }

  // Application CRUD operations
  async getApplications(filters?: {
    type?: ApplicationType;
    status?: ApplicationStatus;
    center?: ProcessingCenter;
    dateRange?: { start: string; end: string };
    limit?: number;
    offset?: number;
  }): Promise<{ applications: BenefitApplication[]; total: number }> {
    try {
      const response = await axios.get(`${this.baseURL}/applications`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplication(receiptNumber: string): Promise<BenefitApplication> {
    try {
      const response = await axios.get(`${this.baseURL}/applications/${receiptNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  async updateApplicationStatus(
    receiptNumber: string, 
    status: ApplicationStatus,
    notes?: string
  ): Promise<BenefitApplication> {
    try {
      const response = await axios.put(`${this.baseURL}/applications/${receiptNumber}/status`, {
        status,
        notes,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Metrics and Analytics
  async getApplicationMetrics(dateRange?: { start: string; end: string }): Promise<ApplicationMetrics> {
    try {
      const response = await axios.get(`${this.baseURL}/metrics`, { params: dateRange });
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  async getProcessingTrends(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<ProcessingTrends[]> {
    try {
      const response = await axios.get(`${this.baseURL}/trends`, { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching processing trends:', error);
      throw error;
    }
  }

  async getBacklogAnalysis(): Promise<BacklogAnalysis> {
    try {
      const response = await axios.get(`${this.baseURL}/backlog-analysis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching backlog analysis:', error);
      throw error;
    }
  }

  // AI/ML Insights
  async getMLInsights(): Promise<MLInsights> {
    try {
      const response = await axios.get(`${this.baseURL}/ml-insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ML insights:', error);
      throw error;
    }
  }

  async forecastBacklog(months: number = 3): Promise<{ forecast: number[]; confidence: number }> {
    try {
      const response = await axios.post(`${this.baseURL}/forecast-backlog`, { months });
      return response.data;
    } catch (error) {
      console.error('Error forecasting backlog:', error);
      throw error;
    }
  }

  async estimateProcessingTime(applicationType: ApplicationType): Promise<{
    estimatedDays: number;
    confidence: number;
    factors: string[];
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/estimate-processing-time`, { applicationType });
      return response.data;
    } catch (error) {
      console.error('Error estimating processing time:', error);
      throw error;
    }
  }

  // Business Questions
  async getBusinessQuestions(): Promise<BusinessQuestion[]> {
    try {
      const response = await axios.get(`${this.baseURL}/business-questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business questions:', error);
      throw error;
    }
  }

  async executeBusinessQuestion(questionId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/business-questions/${questionId}/execute`);
      return response.data;
    } catch (error) {
      console.error('Error executing business question:', error);
      throw error;
    }
  }

  // Natural Language Query (DHS Chat)
  async askNaturalLanguageQuery(question: string): Promise<{
    answer: string;
    confidence?: number;
    sources?: string[];
    data?: any;
    suggestions?: string[];
    timestamp?: string;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/natural-language-query`, { question });
      return response.data;
    } catch (error) {
      console.error('Error asking natural language query:', error);
      throw error;
    }
  }

  // Dashboard Configuration
  async getDashboardConfig(): Promise<DashboardConfig> {
    try {
      const response = await axios.get(`${this.baseURL}/dashboard-config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard config:', error);
      throw error;
    }
  }

  async updateDashboardConfig(config: Partial<DashboardConfig>): Promise<DashboardConfig> {
    try {
      const response = await axios.put(`${this.baseURL}/dashboard-config`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating dashboard config:', error);
      throw error;
    }
  }

  // Data Export and Reporting
  async exportApplicationData(filters?: any): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseURL}/export`, {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting application data:', error);
      throw error;
    }
  }

  async generateReport(reportType: 'monthly' | 'quarterly' | 'annual', options?: any): Promise<{
    reportUrl: string;
    generatedAt: string;
    expiresAt: string;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/generate-report`, {
        reportType,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

const uscisApplicationTrackingService = new USCISApplicationTrackingService();
export default uscisApplicationTrackingService;

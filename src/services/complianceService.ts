import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface ComplianceMetrics {
  overallComplianceScore: number;
  totalPolicies: number;
  compliantPolicies: number;
  nonCompliantPolicies: number;
  pendingReviewPolicies: number;
  complianceByFramework: Array<{
    framework: string;
    score: number;
    compliantCount: number;
    totalCount: number;
    status: 'compliant' | 'non-compliant' | 'partial';
  }>;
  complianceByDomain: Array<{
    domain: string;
    score: number;
    compliantPolicies: number;
    totalPolicies: number;
  }>;
  recentAudits: Array<{
    auditId: string;
    framework: string;
    score: number;
    status: string;
    auditDate: string;
    findings: number;
  }>;
  upcomingDeadlines: Array<{
    policyId: string;
    policyName: string;
    deadline: string;
    daysRemaining: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  riskAssessment: {
    highRiskItems: number;
    mediumRiskItems: number;
    lowRiskItems: number;
    totalRiskScore: number;
  };
  lastUpdated: string;
}

export interface PolicyDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  complianceFramework: string[];
  status: 'active' | 'draft' | 'archived';
  complianceStatus: 'compliant' | 'non-compliant' | 'pending-review';
  lastReviewDate: string;
  nextReviewDate: string;
  owner: string;
  affectedDomains: string[];
  riskLevel: 'high' | 'medium' | 'low';
  implementationStatus: string;
  controls: Array<{
    name: string;
    description: string;
    implementationStatus: string;
  }>;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: Array<{
    id: string;
    title: string;
    description: string;
    status: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    lastAssessment: string;
  }>;
  overallScore: number;
  lastAuditDate: string;
  nextAuditDate: string;
}

export interface ComplianceResponse {
  success: boolean;
  data: ComplianceMetrics;
}

export interface PolicyResponse {
  success: boolean;
  data: PolicyDetail[];
}

export interface FrameworkResponse {
  success: boolean;
  data: ComplianceFramework[];
}

class ComplianceService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getComplianceMetrics(): Promise<ComplianceMetrics> {
    try {
      const response = await axios.get<ComplianceResponse>(
        `${API_URL}/compliance/metrics`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compliance metrics:', error);
      throw error;
    }
  }

  async getPolicyDetails(): Promise<PolicyDetail[]> {
    try {
      const response = await axios.get<PolicyResponse>(
        `${API_URL}/compliance/policies`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching policy details:', error);
      throw error;
    }
  }

  async getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    try {
      const response = await axios.get<FrameworkResponse>(
        `${API_URL}/compliance/frameworks`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compliance frameworks:', error);
      throw error;
    }
  }

  async getAuditHistory(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/compliance/audit-history`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching audit history:', error);
      throw error;
    }
  }

  async getRiskAssessment(): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/compliance/risk-assessment`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
      throw error;
    }
  }
}

export default new ComplianceService();

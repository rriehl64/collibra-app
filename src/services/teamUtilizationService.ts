import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface TeamUtilizationMetrics {
  overallUtilization: number;
  totalTeamMembers: number;
  activeMembers: number;
  averageCapacity: number;
  totalAllocatedHours: number;
  totalAvailableHours: number;
  utilizationByBranch: Array<{
    branch: string;
    utilization: number;
    memberCount: number;
    allocatedHours: number;
    availableHours: number;
  }>;
  utilizationByRole: Array<{
    role: string;
    utilization: number;
    memberCount: number;
    allocatedHours: number;
    availableHours: number;
  }>;
  topUtilizedMembers: Array<{
    name: string;
    role: string;
    branch: string;
    utilization: number;
    allocatedHours: number;
    availableHours: number;
  }>;
  underUtilizedMembers: Array<{
    name: string;
    role: string;
    branch: string;
    utilization: number;
    allocatedHours: number;
    availableHours: number;
  }>;
  lastUpdated: string;
}

export interface TeamMemberDetail {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  role: string;
  title: string;
  branch: string;
  division: string;
  capacity: {
    fteAllocation: number;
    hoursPerWeek: number;
    availableHours: number;
  };
  currentAssignments: Array<{
    priorityName: string;
    allocation: number;
    hoursAllocated: number;
    startDate: string;
    endDate: string;
  }>;
  utilization: number;
  status: 'over-utilized' | 'optimal' | 'under-utilized';
}

export interface TeamUtilizationResponse {
  success: boolean;
  data: TeamUtilizationMetrics;
}

export interface TeamDetailsResponse {
  success: boolean;
  data: TeamMemberDetail[];
}

class TeamUtilizationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getTeamUtilizationMetrics(): Promise<TeamUtilizationMetrics> {
    try {
      const response = await axios.get<TeamUtilizationResponse>(
        `${API_URL}/team-utilization/metrics`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team utilization metrics:', error);
      throw error;
    }
  }

  async getTeamMemberDetails(): Promise<TeamMemberDetail[]> {
    try {
      const response = await axios.get<TeamDetailsResponse>(
        `${API_URL}/team-utilization/members`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team member details:', error);
      throw error;
    }
  }

  async getUtilizationByBranch(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/team-utilization/by-branch`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching utilization by branch:', error);
      throw error;
    }
  }

  async getCapacityForecast(): Promise<any> {
    try {
      const response = await axios.get(
        `${API_URL}/team-utilization/capacity-forecast`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching capacity forecast:', error);
      throw error;
    }
  }
}

export default new TeamUtilizationService();

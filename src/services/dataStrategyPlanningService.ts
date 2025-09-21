import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface DataStrategyPriority {
  _id: string;
  priorityName: string;
  description: string;
  strategicGoal: string;
  owner: string;
  branch: string;
  dueDate: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  loeEstimate: {
    hours: number;
    size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  };
  requiredSkills: string[];
  complexity: 'Low' | 'Medium' | 'High';
  riskFactors: string[];
  estimatedValue: 'Low' | 'Medium' | 'High';
  businessValue: string;
  deliverables: string[];
  dependencies: string[];
  stakeholders: string[];
  assignedTeam: Array<{
    memberId?: string;
    memberName: string;
    allocation: number;
  }>;
  epic?: string;
  stories: Array<{
    storyId: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignee: string;
    estimatedHours: number;
  }>;
  progressNotes: Array<{
    date: string;
    note: string;
    author: string;
  }>;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  employeeId: string;
  name: {
    firstName: string;
    lastName: string;
  };
  fullName: string;
  email: string;
  role: string;
  title: string;
  branch: string;
  division: string;
  skills: Array<{
    skillName: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    certified: boolean;
  }>;
  capacity: {
    fteAllocation: number;
    hoursPerWeek: number;
    availableHours: number;
  };
  currentAssignments: Array<{
    priorityId?: string;
    priorityName: string;
    allocation: number;
    startDate: string;
    endDate: string;
    hoursAllocated: number;
  }>;
  currentUtilization: number;
  isActive: boolean;
}

export interface DataStrategyEpic {
  _id: string;
  epicId: string;
  title: string;
  description: string;
  area: string;
  businessValue: string;
  stories: Array<{
    storyId: string;
    title: string;
    description: string;
    businessValue: string;
    storyPoints?: number;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Backlog' | 'Ready' | 'In Progress' | 'Review' | 'Done';
    assignee?: string;
    estimatedHours?: number;
    actualHours: number;
  }>;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  targetQuarter: string;
  completionPercentage: number;
}

export interface TeamCapacityData {
  teamMembers: Array<TeamMember & {
    availableCapacity: number;
    assignments: TeamMember['currentAssignments'];
  }>;
  branchSummary: Record<string, {
    totalMembers: number;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
  }>;
  totalTeamSize: number;
}

export interface DashboardAnalytics {
  priorities: {
    byStatus: Array<{ _id: string; count: number; avgLoeHours: number }>;
    byGoal: Array<{ _id: string; count: number; totalHours: number }>;
    urgent: number;
    overdue: number;
    total: number;
  };
  team: {
    totalMembers: number;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
    utilizationPercentage: number;
  };
}

class DataStrategyPlanningService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Priority methods
  async getPriorities(filters?: {
    status?: string;
    strategicGoal?: string;
    owner?: string;
    urgency?: string;
  }): Promise<DataStrategyPriority[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/priorities?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching priorities:', error);
      throw error;
    }
  }

  async getPriority(id: string): Promise<DataStrategyPriority> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/priorities/${id}`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching priority:', error);
      throw error;
    }
  }

  async createPriority(priority: Partial<DataStrategyPriority>): Promise<DataStrategyPriority> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/data-strategy/priorities`,
        priority,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating priority:', error);
      throw error;
    }
  }

  async updatePriority(id: string, priority: Partial<DataStrategyPriority>): Promise<DataStrategyPriority> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/data-strategy/priorities/${id}`,
        priority,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating priority:', error);
      throw error;
    }
  }

  async deletePriority(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/data-strategy/priorities/${id}`,
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error('Error deleting priority:', error);
      throw error;
    }
  }

  async bulkUpdatePriorities(priorityIds: string[], updates: Partial<DataStrategyPriority>): Promise<void> {
    try {
      await axios.put(
        `${API_BASE_URL}/data-strategy/priorities/bulk`,
        { priorityIds, updates },
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error('Error bulk updating priorities:', error);
      throw error;
    }
  }

  // Team methods
  async getTeamCapacity(): Promise<TeamCapacityData> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/team/capacity`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team capacity:', error);
      throw error;
    }
  }

  async getTeamMembers(filters?: {
    branch?: string;
    skills?: string;
    available?: boolean;
  }): Promise<TeamMember[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/team/members?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/data-strategy/team/members`,
        member,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/data-strategy/team/members/${id}`,
        member,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  // Epic methods
  async getEpics(filters?: {
    area?: string;
    status?: string;
    targetQuarter?: string;
  }): Promise<DataStrategyEpic[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/epics?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching epics:', error);
      throw error;
    }
  }

  async createEpic(epic: Partial<DataStrategyEpic>): Promise<DataStrategyEpic> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/data-strategy/epics`,
        epic,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating epic:', error);
      throw error;
    }
  }

  async updateEpic(id: string, epic: Partial<DataStrategyEpic>): Promise<DataStrategyEpic> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/data-strategy/epics/${id}`,
        epic,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating epic:', error);
      throw error;
    }
  }

  async deleteEpic(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/data-strategy/epics/${id}`,
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error('Error deleting epic:', error);
      throw error;
    }
  }


  // Utility methods
  async getIntakeTemplate(): Promise<{
    template: Partial<DataStrategyPriority>;
    strategicGoals: string[];
    commonSkills: string[];
  }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/intake-template`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching intake template:', error);
      throw error;
    }
  }

  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/data-strategy/analytics`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }
}

export default new DataStrategyPlanningService();

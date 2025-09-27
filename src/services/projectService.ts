import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface ProjectMetrics {
  totalActiveProjects: number;
  taskProjects: number;
  strategicEpics: number;
  strategicPriorities: number;
  projectCharters: number;
  projectsByStatus: {
    active: number;
    inProgress: number;
    pending: number;
    completed: number;
  };
  projectsByDomain: Array<{
    domain: string;
    count: number;
  }>;
  lastUpdated: string;
}

export interface ProjectResponse {
  success: boolean;
  data: ProjectMetrics;
}

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getActiveProjects(): Promise<ProjectMetrics> {
    try {
      const response = await axios.get<ProjectResponse>(
        `${API_URL}/projects/active-metrics`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active project metrics:', error);
      throw error;
    }
  }

  async getProjectBreakdown(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/projects/breakdown`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching project breakdown:', error);
      throw error;
    }
  }

  async getProjectsByDomain(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/projects/by-domain`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching projects by domain:', error);
      throw error;
    }
  }
}

export default new ProjectService();

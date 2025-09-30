/**
 * Portfolio Service
 * Handles portfolio operations including CRUD operations for portfolios and their components
 */
import api from './api';

// Portfolio interfaces matching the backend models
export interface KPI {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export interface KeyResult {
  description: string;
  current: number;
  target: number;
  unit: string;
}

export interface OKR {
  objective: string;
  keyResults: KeyResult[];
}

export interface Risk {
  id: string;
  title: string;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Technical' | 'Organizational' | 'Compliance' | 'Financial' | 'Security';
  mitigation: string;
  owner: string;
}

export interface Innovation {
  id: string;
  title: string;
  type: 'AI/ML' | 'Automation' | 'Analytics' | 'Process';
  impact: 'High' | 'Medium' | 'Low';
  aiFirst: boolean;
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'At Risk' | 'Completed' | 'Overdue';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  portfolioId: string;
  dependencies?: string[];
  deliverables: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Project {
  id: string;
  name: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  progress: number;
  manager: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
}

export interface Portfolio {
  _id?: string;
  id: string;
  name: string;
  description: string;
  manager: string;
  totalBudget: string;
  status: 'Active' | 'Planning' | 'On Hold';
  currentState?: string;
  futureState?: string;
  aiReadiness?: number;
  kpis?: KPI[];
  okr?: OKR;
  risks?: Risk[];
  innovations?: Innovation[];
  milestones?: Milestone[];
  projects: Project[];
  createdAt?: string;
  updatedAt?: string;
}

// Response type from API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

// Search parameters for portfolios
interface PortfolioSearchParams {
  search?: string;
  status?: string;
  manager?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all portfolios with optional filtering
 */
export const getPortfolios = async (params: PortfolioSearchParams = {}): Promise<Portfolio[]> => {
  try {
    const response = await api.get<ApiResponse<Portfolio[]>>('/portfolios', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw new Error('Failed to fetch portfolios');
  }
};

/**
 * Get a single portfolio by ID
 */
export const getPortfolio = async (id: string): Promise<Portfolio> => {
  try {
    const response = await api.get<ApiResponse<Portfolio>>(`/portfolios/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw new Error('Failed to fetch portfolio');
  }
};

/**
 * Create a new portfolio
 */
export const createPortfolio = async (portfolio: Omit<Portfolio, '_id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> => {
  try {
    const response = await api.post<ApiResponse<Portfolio>>('/portfolios', portfolio);
    return response.data.data;
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw new Error('Failed to create portfolio');
  }
};

/**
 * Update a portfolio
 */
export const updatePortfolio = async (id: string, portfolio: Partial<Portfolio>): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}`, portfolio);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating portfolio:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('You do not have permission to update this portfolio.');
      } else if (error.response.status === 404) {
        throw new Error('Portfolio not found.');
      } else if (error.response.status === 400) {
        throw new Error(`Validation error: ${error.response.data?.error || 'Invalid data provided.'}`);
      }
    }
    
    throw new Error('Failed to update portfolio');
  }
};

/**
 * Delete a portfolio
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/portfolios/${id}`);
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw new Error('Failed to delete portfolio');
  }
};

/**
 * Update portfolio KPIs
 */
export const updatePortfolioKPIs = async (id: string, kpis: KPI[]): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/kpis`, { kpis });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio KPIs:', error);
    throw new Error('Failed to update portfolio KPIs');
  }
};

/**
 * Update portfolio OKR
 */
export const updatePortfolioOKR = async (id: string, okr: OKR): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/okr`, { okr });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio OKR:', error);
    throw new Error('Failed to update portfolio OKR');
  }
};

/**
 * Update portfolio risks
 */
export const updatePortfolioRisks = async (id: string, risks: Risk[]): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/risks`, { risks });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio risks:', error);
    throw new Error('Failed to update portfolio risks');
  }
};

/**
 * Update portfolio innovations
 */
export const updatePortfolioInnovations = async (id: string, innovations: Innovation[]): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/innovations`, { innovations });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio innovations:', error);
    throw new Error('Failed to update portfolio innovations');
  }
};

/**
 * Update portfolio projects
 */
export const updatePortfolioProjects = async (id: string, projects: Project[]): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/projects`, { projects });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio projects:', error);
    throw new Error('Failed to update portfolio projects');
  }
};

/**
 * Update portfolio milestones
 */
export const updatePortfolioMilestones = async (id: string, milestones: Milestone[]): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${id}/milestones`, { milestones });
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio milestones:', error);
    throw new Error('Failed to update portfolio milestones');
  }
};

/**
 * Add a project to a portfolio
 */
export const addPortfolioProject = async (portfolioId: string, project: Project): Promise<Portfolio> => {
  try {
    const response = await api.post<ApiResponse<Portfolio>>(`/portfolios/${portfolioId}/projects`, project);
    return response.data.data;
  } catch (error) {
    console.error('Error adding portfolio project:', error);
    throw new Error('Failed to add portfolio project');
  }
};

/**
 * Update a single project in a portfolio
 */
export const updatePortfolioProject = async (portfolioId: string, projectId: string, project: Partial<Project>): Promise<Portfolio> => {
  try {
    const response = await api.put<ApiResponse<Portfolio>>(`/portfolios/${portfolioId}/projects/${projectId}`, project);
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    throw new Error('Failed to update portfolio project');
  }
};

/**
 * Delete a project from a portfolio
 */
export const deletePortfolioProject = async (portfolioId: string, projectId: string): Promise<Portfolio> => {
  try {
    const response = await api.delete<ApiResponse<Portfolio>>(`/portfolios/${portfolioId}/projects/${projectId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    throw new Error('Failed to delete portfolio project');
  }
};

export default {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioKPIs,
  updatePortfolioOKR,
  updatePortfolioRisks,
  updatePortfolioInnovations,
  updatePortfolioProjects,
  updatePortfolioMilestones,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject
};

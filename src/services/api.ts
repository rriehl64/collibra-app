/**
 * API Service
 * Handles all API communication with the backend
 */
import axios, { AxiosError, AxiosResponse } from 'axios';
import { DataAsset } from '../types/DataAsset';

// Set API base URL from env variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

// For consistency, ensure all API calls use port 3002
axios.defaults.baseURL = 'http://localhost:3002/api/v1';
export { API_BASE_URL };

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for CORS with credentials
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add token to headers if it exists
    if (token) {
      // Ensure we're using Bearer authentication format
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${config.method?.toUpperCase()} Request to: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      // Clear token if it exists
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Interface for API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  token?: string; // For auth responses
  error?: string | string[];
  count?: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  total?: number;
}

// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  department?: string;
  jobTitle?: string;
  role: 'user' | 'data-steward' | 'admin';
  assignedDomains?: string[];
  permissions?: string[]; // Added permissions array
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface User {
  _id: string;
  id?: string; // Alias for _id for compatibility
  name: string;
  email: string;
  role: 'user' | 'data-steward' | 'admin';
  department?: string;
  jobTitle?: string;
  assignedDomains?: string[];
  permissions?: string[]; // Added permissions array
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
  lastActive?: Date;
  createdAt?: Date;
}

// Weekly Status interfaces
export interface WeeklyStatusItem {
  _id?: string;
  userId: string;
  name: string;
  team: string;
  contractNumber: string;
  periodOfPerformance: string;
  supervisor: string;
  weekStart: string | Date;
  status: 'green' | 'yellow' | 'red';
  summary?: string;
  accomplishments?: string;
  tasksStatus?: string;
  issuesNeeds?: string;
  nextSteps?: string;
  hoursWorked?: number;
  communications?: string;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklyStatusListResponse {
  items: WeeklyStatusItem[];
  total: number;
}

export interface WeeklySlaReport {
  weekStart: string;
  submittedCount: number;
  totalUsers: number;
  missing: { userId: string; name: string; email: string }[];
}

// Data Asset interfaces - using imported type
// export { DataAsset }; // Commented out to avoid conflicts

// Policy interfaces
export interface Policy {
  _id?: string;
  name: string;
  description: string;
  category: string;
  status: string;
  version: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  owner: string | User;
  approvers?: string[] | User[];
  relatedRegulations?: {
    name: string;
    description: string;
    url?: string;
  }[];
  controls?: {
    name: string;
    description: string;
    implementationStatus: string;
  }[];
  affectedDomains?: string[];
  affectedAssetTypes?: string[];
  documents?: {
    title: string;
    fileUrl: string;
    description?: string;
    uploadDate?: Date;
  }[];
  revisionHistory?: {
    version: string;
    date: Date;
    changedBy: string | User;
    changeDescription: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Authentication services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log(`Attempting login for: ${credentials.email}`);
    
    // Format credentials for API
    const formattedCredentials = {
      email: credentials.email.trim(),
      password: credentials.password
    };
    
    let lastError: Error | AxiosError | unknown = new Error('Unknown error');
    
    try {
      let retries = 2; // Number of retries if initial attempt fails
      
      while (retries >= 0) {
        try {
          const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', formattedCredentials);
          
          // Handle successful login - check both possible response formats
          // Backend may return token either in response.data.token or response.data.data.token
          if (response.data.success) {
            let token = null;
            
            // Check direct token in response.data (from sendTokenResponse format)
            if (response.data.token) {
              token = response.data.token;
            }
            // Check nested token in response.data.data (from standard API response format)
            else if (response.data.data?.token) {
              token = response.data.data.token;
            }
            
            if (token) {
              localStorage.setItem('token', token);
              console.log('Login successful with token:', token);
              return {
                success: true,
                token: token
              };
            }
          }
          
          // If we get here, we couldn't find the token
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response format: Token not found in server response');
        } catch (err) {
          lastError = err;
          if (retries > 0) {
            console.log(`Login attempt failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
          retries--;
        }
      }
      
      // If we've exhausted all retries
      if (axios.isAxiosError(lastError) && lastError.response) {
        if (lastError.response.status === 400) {
          throw new Error(
            lastError.response.data.error || 'Invalid credentials. Please check your email and password.'
          );
        } else {
          throw new Error(
            lastError.response.data.error || `Login failed with status ${lastError.response.status}`
          );
        }
      }
      
      throw new Error('Network error during login. Please try again.');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Unable to reach the server. Please check your internet connection.');
        }
        throw new Error(
          error.response.data.error || `An error occurred (${error.response.status})`
        );
      }
      throw error;
    }
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
      
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      if (!response.data.data) {
        throw new Error('Registration response not found');
      }
      return response.data.data as AuthResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred during registration'
        );
      }
      throw new Error('Network error during registration');
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token even if API call fails
      localStorage.removeItem('token');
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      if (!response.data.data) {
        throw new Error('User data not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while fetching user data'
        );
      }
      throw new Error('Network error while fetching user data');
    }
  },
  
  updateUserDetails: async (details: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>('/auth/updatedetails', details);
      if (!response.data.data) {
        throw new Error('User data not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while updating user details'
        );
      }
      throw new Error('Network error while updating user details');
    }
  },
  
  updatePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    try {
      const response = await api.put<ApiResponse<AuthResponse>>('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      if (!response.data.data) {
        throw new Error('Authentication response not found');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while updating password'
        );
      }
      throw new Error('Network error while updating password');
    }
  },
};

// Weekly Status services
// Monthly Status interfaces
export interface MonthlyStatusItem {
  _id?: string;
  userId: string;
  name: string;
  team: string;
  contractNumber?: string;
  periodOfPerformance?: string;
  supervisor?: string;
  month: number;
  year: number;
  monthName: string;
  overallStatus: 'green' | 'yellow' | 'red';
  weeklyStatuses: Array<{
    weekStart: string;
    status: 'green' | 'yellow' | 'red';
  }>;
  totalHoursWorked: number;
  averageHoursPerWeek: number;
  weeksReported: number;
  monthlyAccomplishments?: string;
  monthlyTasksStatus?: string;
  monthlyIssuesNeeds?: string;
  monthlyNextSteps?: string;
  monthlyCommunications?: string;
  executiveSummary?: string;
  weeklyReportIds: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MonthlyStatusListResponse {
  items: MonthlyStatusItem[];
  total: number;
}

export const weeklyStatusService = {
  list: async (params?: Record<string, any>): Promise<WeeklyStatusListResponse> => {
    const response = await api.get<ApiResponse<WeeklyStatusItem[]>>('/weekly-status', { params });
    return {
      items: response.data.data || [],
      total: response.data.total || 0,
    };
  },
  get: async (id: string): Promise<WeeklyStatusItem> => {
    const response = await api.get<ApiResponse<WeeklyStatusItem>>(`/weekly-status/${id}`);
    if (!response.data.data) throw new Error('Not found');
    return response.data.data;
  },
  create: async (payload: WeeklyStatusItem): Promise<WeeklyStatusItem> => {
    const response = await api.post<ApiResponse<WeeklyStatusItem>>('/weekly-status', payload);
    if (!response.data.data) throw new Error('Create failed');
    return response.data.data;
  },
  update: async (id: string, payload: Partial<WeeklyStatusItem>): Promise<WeeklyStatusItem> => {
    const response = await api.put<ApiResponse<WeeklyStatusItem>>(`/weekly-status/${id}`, payload);
    if (!response.data.data) throw new Error('Update failed');
    return response.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/weekly-status/${id}`);
  },
  sla: async (week?: string): Promise<WeeklySlaReport> => {
    const response = await api.get<ApiResponse<{ weekStart: string; submittedCount: number; totalUsers: number; missing: any[] }>>('/weekly-status/sla', {
      params: week ? { week } : undefined,
    });
    if (!response.data.data) throw new Error('SLA not available');
    return response.data.data as WeeklySlaReport;
  },
};

export const monthlyStatusService = {
  list: async (params?: Record<string, any>): Promise<MonthlyStatusListResponse> => {
    const response = await api.get<ApiResponse<MonthlyStatusItem[]>>('/monthly-status', { params });
    return {
      items: response.data.data || [],
      total: response.data.total || 0,
    };
  },
  get: async (id: string): Promise<MonthlyStatusItem> => {
    const response = await api.get<ApiResponse<MonthlyStatusItem>>(`/monthly-status/${id}`);
    if (!response.data.data) throw new Error('Not found');
    return response.data.data;
  },
  create: async (payload: MonthlyStatusItem): Promise<MonthlyStatusItem> => {
    const response = await api.post<ApiResponse<MonthlyStatusItem>>('/monthly-status', payload);
    if (!response.data.data) throw new Error('Create failed');
    return response.data.data;
  },
  update: async (id: string, payload: Partial<MonthlyStatusItem>): Promise<MonthlyStatusItem> => {
    const response = await api.put<ApiResponse<MonthlyStatusItem>>(`/monthly-status/${id}`, payload);
    if (!response.data.data) throw new Error('Update failed');
    return response.data.data;
  },
};

// Data Asset services
export const dataAssetService = {
  getRecentDataAssets: async (limit: number = 5): Promise<DataAsset[]> => {
    try {
      const response = await api.get<ApiResponse<DataAsset[]>>('/data-assets', {
        params: { limit, sort: '-createdAt' }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching recent data assets:', error);
      return [];
    }
  },
  getDataAssets: async (params?: Record<string, any>): Promise<{ assets: DataAsset[], pagination: any, total: number }> => {
    try {
      const response = await api.get<ApiResponse<DataAsset[]>>('/data-assets', { params });
      return {
        assets: response.data.data || [],
        pagination: response.data.pagination,
        total: response.data.total || 0
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while fetching data assets'
        );
      }
      throw new Error('Network error while fetching data assets');
    }
  },
  
  getDataAsset: async (id: string): Promise<DataAsset> => {
    try {
      const response = await api.get<ApiResponse<DataAsset>>(`/data-assets/${id}`);
      if (!response.data.data) {
        throw new Error('Data asset not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while fetching the data asset'
        );
      }
      throw new Error('Network error while fetching the data asset');
    }
  },
  
  createDataAsset: async (asset: DataAsset): Promise<DataAsset> => {
    try {
      const response = await api.post<ApiResponse<DataAsset>>('/data-assets', asset);
      if (!response.data.data) {
        throw new Error('Created data asset not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while creating the data asset'
        );
      }
      throw new Error('Network error while creating the data asset');
    }
  },
  
  updateDataAsset: async (id: string, asset: Partial<DataAsset>): Promise<DataAsset> => {
    try {
      const response = await api.put<ApiResponse<DataAsset>>(`/data-assets/${id}`, asset);
      if (!response.data.data) {
        throw new Error('Updated data asset not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while updating the data asset'
        );
      }
      throw new Error('Network error while updating the data asset');
    }
  },
  
  deleteDataAsset: async (id: string): Promise<void> => {
    try {
      await api.delete(`/data-assets/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while deleting the data asset'
        );
      }
      throw new Error('Network error while deleting the data asset');
    }
  },
  
  searchDataAssets: async (query: string, params?: Record<string, any>): Promise<{ assets: DataAsset[], pagination: any, total: number }> => {
    try {
      // Add search query to params
      const searchParams = {
        ...params,
        q: query
      };
      
      const response = await api.get<ApiResponse<DataAsset[]>>('/data-assets', { params: searchParams });
      return {
        assets: response.data.data || [],
        pagination: response.data.pagination,
        total: response.data.total || 0
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while searching data assets'
        );
      }
      throw new Error('Network error while searching data assets');
    }
  },
  
  /**
   * Get suggestions for search autocomplete
   */
  getSuggestions: async (query: string): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/data-assets/suggestions', { 
        params: { q: query } 
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  },
};

// Policy services
export const policyService = {
  getPolicies: async (params?: Record<string, any>): Promise<{ policies: Policy[], pagination: any, total: number }> => {
    try {
      const response = await api.get<ApiResponse<Policy[]>>('/policies', { params });
      return {
        policies: response.data.data || [],
        pagination: response.data.pagination,
        total: response.data.total || 0
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while fetching policies'
        );
      }
      throw new Error('Network error while fetching policies');
    }
  },
  
  getPolicy: async (id: string): Promise<Policy> => {
    try {
      const response = await api.get<ApiResponse<Policy>>(`/policies/${id}`);
      if (!response.data.data) {
        throw new Error('Policy not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while fetching the policy'
        );
      }
      throw new Error('Network error while fetching the policy');
    }
  },
  
  createPolicy: async (policy: Policy): Promise<Policy> => {
    try {
      const response = await api.post<ApiResponse<Policy>>('/policies', policy);
      if (!response.data.data) {
        throw new Error('Created policy not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while creating the policy'
        );
      }
      throw new Error('Network error while creating the policy');
    }
  },
  
  updatePolicy: async (id: string, policy: Partial<Policy>): Promise<Policy> => {
    try {
      const response = await api.put<ApiResponse<Policy>>(`/policies/${id}`, policy);
      if (!response.data.data) {
        throw new Error('Updated policy not found in response');
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while updating the policy'
        );
      }
      throw new Error('Network error while updating the policy');
    }
  },
  
  deletePolicy: async (id: string): Promise<void> => {
    try {
      await api.delete(`/policies/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || 'An error occurred while deleting the policy'
        );
      }
      throw new Error('Network error while deleting the policy');
    }
  },
};

// Data Lineage APIs
export const getAssetLineage = (assetId: string, direction = 'both', depth = 3) => 
  api.get(`/data-assets/${assetId}/lineage?direction=${direction}&depth=${depth}`);

export const getAllLineageRelationships = (params?: any) => 
  api.get('/lineage', { params });

export const createLineageRelationship = (relationshipData: any) => 
  api.post('/lineage', relationshipData);

export const updateLineageRelationship = (id: string, relationshipData: any) => 
  api.put(`/lineage/${id}`, relationshipData);

export const deleteLineageRelationship = (id: string) => 
  api.delete(`/lineage/${id}`);

export const getLineageStats = () => 
  api.get('/lineage/stats');

// User Management APIs
export const getUserManagement = () => api.get('/users');
export const createUser = (userData: any) => api.post('/users', userData);
export const updateUser = (id: string, userData: any) => api.put(`/users/${id}`, userData);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

export default api;

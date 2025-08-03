import axios from 'axios';
import { API_URL } from 'config';

// Force correct API URL regardless of what's in config or env variables
const DASHBOARD_API_URL = 'http://localhost:3002/api/v1';

// Define interfaces for dashboard data
interface DashboardMetrics {
  dataAssets: {
    total: number;
    newThisMonth: number;
  };
  dataDomains: {
    total: number;
    active: number;
  };
  compliance: {
    percentage: number;
    changeFromLastMonth: number;
  };
  tasks: {
    open: number;
    urgent: number;
  };
  charts: {
    domainDistribution: Array<{
      domain: string;
      count: number;
      percentage: number;
    }>;
    complianceStatus: Array<{
      status: string;
      count: number;
    }>;
  };
}

interface Activity {
  id: number;
  type: string;
  user: string;
  timestamp: Date;
  details: Record<string, any>;
}

interface SystemHealth {
  status: string;
  uptime: number;
  lastChecked: string;
  components: Array<{
    name: string;
    status: string;
    message?: string;
  }>;
}

/**
 * Service for fetching dashboard related data
 */
const DashboardService = {
  /**
   * Get dashboard metrics including data assets, domains, compliance, and tasks
   * @returns Dashboard metrics data
   */
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await axios.get(`${DASHBOARD_API_URL}/dashboard/metrics`, {
        withCredentials: true
      });
      
      // The API response structure already matches our DashboardMetrics interface
      // The server sends the data in the exact format we need
      return response.data.data as DashboardMetrics;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  /**
   * Get recent activities for the dashboard
   * @returns Recent activities data
   */
  getRecentActivities: async (): Promise<Activity[]> => {
    try {
      const response = await axios.get(`${DASHBOARD_API_URL}/dashboard/activities`, {
        withCredentials: true
      });
      
      // The response data is already in the format we need
      // Each activity has id, type, user, timestamp, and details fields
      return response.data.data as Activity[];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  /**
   * Get system health status
   * @returns System health data
   */
  getSystemHealth: async (): Promise<SystemHealth> => {
    try {
      const response = await axios.get(`${DASHBOARD_API_URL}/dashboard/health`, {
        withCredentials: true
      });
      
      // Transform the API response to match our SystemHealth interface
      const rawData = response.data.data;
      
      const healthData: SystemHealth = {
        status: Object.values(rawData).every(comp => 
          typeof comp === 'object' && comp !== null && 
          (comp as any).status === 'healthy'
        ) ? 'healthy' : 'degraded',
        uptime: rawData.api?.uptime || '0%',
        lastChecked: new Date().toISOString(),
        components: [
          // Database
          {
            name: 'Database',
            status: rawData.database?.status || 'unknown',
            message: rawData.database?.latency ? `Latency: ${rawData.database.latency}` : undefined
          },
          // API
          {
            name: 'API Services',
            status: rawData.api?.status || 'unknown',
            message: rawData.api?.requests ? 
              `Requests: ${rawData.api.requests.total}, Errors: ${rawData.api.requests.errors}` : 
              undefined
          },
          // Services
          ...(rawData.services || []).map((svc: any) => ({
            name: svc.name,
            status: svc.status,
            message: svc.message
          }))
        ]
      };
      
      return healthData;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }
};

export default DashboardService;
export type { DashboardMetrics, Activity, SystemHealth };

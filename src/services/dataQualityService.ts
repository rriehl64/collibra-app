import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface DataQualityMetrics {
  overallScore: number;
  totalAssets: number;
  assetsWithQualityIssues: number;
  completenessScore: number;
  accuracyScore: number;
  consistencyScore: number;
  validityScore: number;
  lastUpdated: string;
}

export interface DataQualityResponse {
  success: boolean;
  data: DataQualityMetrics;
}

class DataQualityService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getOverallQualityScore(): Promise<DataQualityMetrics> {
    try {
      const response = await axios.get<DataQualityResponse>(
        `${API_URL}/data-quality/metrics`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching data quality metrics:', error);
      throw error;
    }
  }

  async getAssetQualityBreakdown(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/data-quality/assets-breakdown`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching asset quality breakdown:', error);
      throw error;
    }
  }

  async getDomainQualityScores(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/data-quality/domain-scores`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching domain quality scores:', error);
      throw error;
    }
  }
}

export default new DataQualityService();

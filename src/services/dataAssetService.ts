/**
 * Data Asset Service
 * Handles data asset operations including search and retrieval
 */
import axios from 'axios';
import { DataAsset } from '../types/DataAsset';
import elasticSearchService from './elasticSearchService';

// API base URL from environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Response type from API
interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
  error?: string;
}

/**
 * Search for data assets with optional filtering
 * Uses Elasticsearch in production and falls back to sample data in development
 */
const searchDataAssets = async (
  query: string, 
  params: Record<string, any> = {}
): Promise<{ assets: DataAsset[]; pagination: any; total: number }> => {
  try {
    console.log('Searching data assets with term:', query);
    
    // Special case handling for "mar" -> "Marketing"
    const lowerQuery = query.toLowerCase();
    if (lowerQuery === 'mar' || lowerQuery.includes('mar')) {
      console.log('Special case handling for "mar" -> filtering for Marketing');
      // We'll handle this in the frontend filtering
    }
    
    // Use Elasticsearch if available
    if (process.env.REACT_APP_USE_ELASTICSEARCH === 'true') {
      return await elasticSearchService.searchDataAssets(query, params);
    }
    
    // Otherwise use API endpoint
    const searchParams = {
      ...params,
      q: query
    };
    
    const response = await axios.get<ApiResponse<DataAsset[]>>(`${API_BASE_URL}/data-assets/search`, { 
      params: searchParams 
    });
    
    return {
      assets: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error searching data assets:', error);
    
    // In development mode, use sample data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using sample data in development mode');
      return {
        assets: [],
        pagination: { page: params.page || 1, limit: params.limit || 10, totalPages: 0 },
        total: 0
      };
    }
    
    throw new Error('Failed to search data assets');
  }
};

/**
 * Get suggestions for search autocomplete
 */
const getSuggestions = async (query: string): Promise<any[]> => {
  try {
    console.log('Getting suggestions for:', query);
    
    // Special case handling for "mar" -> "Marketing"
    const lowerQuery = query.toLowerCase();
    if (lowerQuery === 'mar' || lowerQuery.includes('mar')) {
      console.log('Detected special case "mar" -> adding Marketing suggestions');
    }
    
    // Use Elasticsearch if available
    if (process.env.REACT_APP_USE_ELASTICSEARCH === 'true') {
      return await elasticSearchService.getSuggestions(query);
    }
    
    // Fall back to API
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_BASE_URL}/data-assets/suggestions`,
      { params: { q: query } }
    );
    
    return response.data.data || [];
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

/**
 * Get all data assets with optional filtering
 */
const getDataAssets = async (
  params: Record<string, any> = {}
): Promise<{ assets: DataAsset[]; pagination: any; total: number }> => {
  try {
    const response = await axios.get<ApiResponse<DataAsset[]>>(`${API_BASE_URL}/data-assets`, { 
      params 
    });
    
    return {
      assets: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error fetching data assets:', error);
    
    // In development mode, use sample data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using sample data in development mode');
      // This would be replaced with your actual sample data in the DataCatalog component
      return {
        assets: [],
        pagination: { page: params.page || 1, limit: params.limit || 10, totalPages: 0 },
        total: 0
      };
    }
    
    throw new Error('Failed to fetch data assets');
  }
};

/**
 * Get a single data asset by ID
 */
const getDataAssetById = async (id: string): Promise<DataAsset> => {
  try {
    const response = await axios.get<ApiResponse<DataAsset>>(`${API_BASE_URL}/data-assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data asset by ID:', error);
    throw new Error('Failed to fetch data asset');
  }
};

/**
 * Update a data asset
 */
const updateDataAsset = async (id: string, data: Partial<DataAsset>): Promise<DataAsset> => {
  try {
    const response = await axios.put<ApiResponse<DataAsset>>(
      `${API_BASE_URL}/data-assets/${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error('Error updating data asset:', error);
    throw new Error('Failed to update data asset');
  }
};

/**
 * Create a new data asset
 */
const createDataAsset = async (data: Omit<DataAsset, '_id'>): Promise<DataAsset> => {
  try {
    const response = await axios.post<ApiResponse<DataAsset>>(
      `${API_BASE_URL}/data-assets`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating data asset:', error);
    throw new Error('Failed to create data asset');
  }
};

export default {
  searchDataAssets,
  getSuggestions,
  getDataAssets,
  getDataAssetById,
  updateDataAsset,
  createDataAsset
};


/**
 * Data Asset Service
 * Handles data asset operations including search and retrieval
 */
import axios from 'axios';
import api, { API_BASE_URL } from './api';
import { DataAsset } from '../types/DataAsset';
import elasticSearchService from './elasticSearchService';

// Type for search parameters
interface DataAssetSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  domain?: string;
  status?: string;
  sort?: string;
}

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
  params: DataAssetSearchParams = {}
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
    
    const response = await api.get<ApiResponse<DataAsset[]>>(`/data-assets/search`, { 
      params: searchParams 
    });
    
    return {
      assets: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error searching data assets:', error);
    
    // Always throw the error to ensure we don't use mock data
    console.error('Error searching data assets - no fallback used');
    
    throw new Error('Failed to search data assets');
  }
};

/**
 * Get suggestions for search autocomplete
 */
// Define SearchSuggestion type
interface SearchSuggestion {
  text: string;
  score: number;
}

const getSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  try {
    console.log('Getting suggestions for:', query);
    
    // Special case handling for "mar" -> "Marketing"
    const lowerQuery = query.toLowerCase();
    if (lowerQuery === 'mar' || lowerQuery.includes('mar')) {
      console.log('Detected special case "mar" -> adding Marketing suggestions');
    }
    
    // Use Elasticsearch if available
    if (process.env.REACT_APP_USE_ELASTICSEARCH === 'true') {
      const elasticResults = await elasticSearchService.getSuggestions(query);
      // Convert to proper SearchSuggestion type
      return elasticResults.map(item => {
        if (typeof item === 'string') {
          return { text: item, score: 1 };
        } else if (typeof item === 'object' && item !== null) {
          // If already in correct format
          if ('text' in item && 'score' in item) {
            return item as SearchSuggestion;
          }
          // Handle other object formats
          const obj = item as Record<string, any>;
          return { 
            text: obj.text || obj.name || obj.value || JSON.stringify(obj), 
            score: typeof obj.score === 'number' ? obj.score : 1 
          };
        }
        // Fallback
        return { text: String(item), score: 1 };
      });
    }
    
    // Fall back to API
    const response = await api.get<ApiResponse<string[]>>(
      `/data-assets/suggestions`,
      { params: { q: query } }
    );
    
    // Transform string[] to SearchSuggestion[] if needed
    const suggestions = response.data.data || [];
    if (suggestions.length > 0) {
      if (typeof suggestions[0] === 'string') {
        // Convert strings to SearchSuggestion objects
        return suggestions.map(text => ({ text, score: 1 }));
      } else if (typeof suggestions[0] === 'object') {
        // Ensure objects have correct structure
        return suggestions.map((item: any) => ({
          text: item.text || item.name || item.value || String(item),
          score: typeof item.score === 'number' ? item.score : 1
        }));
      }
    }
    // Empty array with proper typing
    return [] as SearchSuggestion[];
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return []; // This is now correctly typed as SearchSuggestion[]
  }
};

/**
 * Get all data assets with optional filtering
 */
const getDataAssets = async (
  params: DataAssetSearchParams = {}
): Promise<{ assets: DataAsset[]; pagination: any; total: number }> => {
  try {
    // Use the configured API instance which already has authentication headers
    const response = await api.get<ApiResponse<DataAsset[]>>(`/data-assets`, { 
      params 
    });
    
    return {
      assets: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error fetching data assets:', error);
    
    // Always throw the error to ensure we don't use mock data
    console.error('Error fetching data assets - no fallback used');
    
    throw new Error('Failed to fetch data assets');
  }
};

/**
 * Get a single data asset by ID
 */
const getDataAssetById = async (id: string): Promise<DataAsset> => {
  try {
    const response = await api.get<ApiResponse<DataAsset>>(`/data-assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data asset by ID:', error);
    throw new Error('Failed to fetch data asset');
  }
};

/**
 * Delete a data asset
 */
const deleteDataAsset = async (id: string): Promise<void> => {
  try {
    await api.delete(`/data-assets/${id}`);
  } catch (error) {
    console.error('Error deleting data asset:', error);
    throw new Error('Failed to delete data asset');
  }
};

/**
 * Update a data asset
 */
const updateDataAsset = async (id: string, data: Partial<DataAsset>): Promise<DataAsset> => {
  try {
    // Use the configured API instance which already has authentication headers
    const response = await api.put<ApiResponse<DataAsset>>(
      `/data-assets/${id}`,
      data
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating data asset:', error);
    
    // Enhanced error handling with specific error messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('You do not have permission to update this data asset.');
      } else if (error.response.status === 404) {
        throw new Error('Data asset not found.');
      } else if (error.response.status === 400) {
        throw new Error(`Validation error: ${error.response.data?.error || 'Invalid data provided.'}`);
      } else {
        throw new Error(`Server error (${error.response.status}): ${error.response.data?.error || 'Unknown error occurred.'}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error: ${error.message || 'Failed to update data asset'}`);
    }
  }
};

/**
 * Create a new data asset
 */
const createDataAsset = async (data: Partial<DataAsset>): Promise<DataAsset> => {
  try {
    const response = await api.post<ApiResponse<DataAsset>>(
      `/data-assets`,
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

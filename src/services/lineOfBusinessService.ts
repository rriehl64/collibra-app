/**
 * Line of Business Service
 * Handles line of business operations including search and retrieval
 */
import api from './api';
import { LineOfBusiness, LineOfBusinessSearchParams } from '../types/LineOfBusiness';

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
 * Search for lines of business with optional filtering
 */
const searchLineOfBusiness = async (
  query: string, 
  params: LineOfBusinessSearchParams = {}
): Promise<{ businesses: LineOfBusiness[]; pagination: any; total: number }> => {
  try {
    console.log('Searching lines of business with term:', query);
    
    const searchParams = {
      ...params,
      q: query
    };
    
    const response = await api.get<ApiResponse<LineOfBusiness[]>>(`/lines-of-business/search`, { 
      params: searchParams 
    });
    
    return {
      businesses: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error searching lines of business:', error);
    throw new Error('Failed to search lines of business');
  }
};

/**
 * Get all lines of business with optional filtering
 */
const getLinesOfBusiness = async (
  params: LineOfBusinessSearchParams = {}
): Promise<{ businesses: LineOfBusiness[]; pagination: any; total: number }> => {
  try {
    const response = await api.get<ApiResponse<LineOfBusiness[]>>(`/lines-of-business`, { 
      params 
    });
    
    return {
      businesses: response.data.data || [],
      pagination: response.data.pagination || {},
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error fetching lines of business:', error);
    throw new Error('Failed to fetch lines of business');
  }
};

/**
 * Get a single line of business by ID
 */
const getLineOfBusinessById = async (id: string): Promise<LineOfBusiness> => {
  try {
    const response = await api.get<ApiResponse<LineOfBusiness>>(`/lines-of-business/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching line of business by ID:', error);
    throw new Error('Failed to fetch line of business');
  }
};

/**
 * Update a line of business
 */
const updateLineOfBusiness = async (id: string, data: Partial<LineOfBusiness>): Promise<LineOfBusiness> => {
  try {
    const response = await api.put<ApiResponse<LineOfBusiness>>(
      `/lines-of-business/${id}`,
      data
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating line of business:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('You do not have permission to update this line of business.');
      } else if (error.response.status === 404) {
        throw new Error('Line of business not found.');
      } else if (error.response.status === 400) {
        throw new Error(`Validation error: ${error.response.data?.error || 'Invalid data provided.'}`);
      } else {
        throw new Error(`Server error (${error.response.status}): ${error.response.data?.error || 'Unknown error occurred.'}`);
      }
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(`Error: ${error.message || 'Failed to update line of business'}`);
    }
  }
};

/**
 * Create a new line of business
 */
const createLineOfBusiness = async (data: Partial<LineOfBusiness>): Promise<LineOfBusiness> => {
  try {
    const response = await api.post<ApiResponse<LineOfBusiness>>(
      `/lines-of-business`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating line of business:', error);
    throw new Error('Failed to create line of business');
  }
};

/**
 * Delete a line of business
 */
const deleteLineOfBusiness = async (id: string): Promise<void> => {
  try {
    await api.delete(`/lines-of-business/${id}`);
  } catch (error) {
    console.error('Error deleting line of business:', error);
    throw new Error('Failed to delete line of business');
  }
};

export default {
  searchLineOfBusiness,
  getLinesOfBusiness,
  getLineOfBusinessById,
  updateLineOfBusiness,
  createLineOfBusiness,
  deleteLineOfBusiness
};

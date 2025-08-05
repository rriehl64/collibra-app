/**
 * LineOfBusiness type definitions
 */

/**
 * Line of Business interface representing business domains
 */
export interface LineOfBusiness {
  id: string;
  name: string;
  description: string;
  owner: string;
  sector: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  lastUpdated: string;
  relatedAssets?: string[];
  tags?: string[];
  kpis?: { name: string; value: string }[];
}

/**
 * Line of Business filters interface
 */
export interface LineOfBusinessFilters {
  sectors: string[];
  statuses: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Line of Business search params
 */
export interface LineOfBusinessSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sector?: string;
  status?: string;
  sort?: string;
}

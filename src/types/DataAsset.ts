/**
 * DataAsset type definitions
 */

/**
 * Data asset interface representing items in the data catalog
 */
export interface DataAsset {
  _id: string;
  name: string;
  type: string;
  domain: string;
  owner: string;
  description: string;
  status: string;
  tags: string[];
  certification: 'certified' | 'pending' | 'uncertified';
  stewards: string[];
  governance?: {
    policies?: string[];
    owner?: string;
    complianceStatus?: string;
  };
  qualityMetrics?: {
    completeness?: number;
    accuracy?: number;
    consistency?: number;
  };
  lastModified?: string;
  createdAt?: string;
  updatedAt?: string;
  relatedAssets?: string[];
  relationships?: Array<{
    assetId: string;
    relationshipType: string;
  }>;
  _score?: number; // Added for Elasticsearch scoring
}

/**
 * Search filters interface
 */
export interface DataAssetFilters {
  types: string[];
  domains: string[];
  statuses: string[];
  certifications: string[];
  owners: string[];
  complianceStatuses: string[];
  tags: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  qualityScore?: {
    min: number;
    max: number;
  };
}

/**
 * Search suggestion interface
 */
export interface SearchSuggestion {
  text: string;
  type: 'name' | 'domain' | 'tag';
  score?: number;
}

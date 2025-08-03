/**
 * Elasticsearch Browser Client Polyfill
 * A simplified implementation of the Elasticsearch client that works in browser environments
 */

class Client {
  constructor(config) {
    this.config = config;
    this.baseUrl = (config?.node || 'http://localhost:9200').replace(/\/$/, '');
    this.auth = config?.auth || {};
    console.log('Elasticsearch Browser Client initialized with node:', this.baseUrl);
  }

  /**
   * Search implementation that supports basic query features
   */
  async search(params) {
    try {
      const { index, body } = params;
      const endpoint = `${this.baseUrl}/${index}/_search`;
      
      // For development, mock the search response if we're not connected to a real ES instance
      if (!this.baseUrl.includes('localhost') || !window.location.hostname.includes('localhost')) {
        // Make actual API call to Elasticsearch
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // Add basic auth if provided
        if (this.auth.username && this.auth.password) {
          const base64Auth = btoa(`${this.auth.username}:${this.auth.password}`);
          headers['Authorization'] = `Basic ${base64Auth}`;
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error(`Elasticsearch error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } else {
        // For development: return mock data that matches the expected structure
        console.log('Using mock Elasticsearch data (development mode)');
        
        // Extract search text from query if available
        const searchText = body?.query?.bool?.must?.find(q => q.match || q.multi_match)?.match?.name || '';
        
        // Generate mock hits based on search text
        const mockHits = generateMockHits(searchText);
        
        return {
          took: 5,
          timed_out: false,
          _shards: {
            total: 1,
            successful: 1,
            skipped: 0,
            failed: 0
          },
          hits: {
            total: {
              value: mockHits.length,
              relation: 'eq'
            },
            max_score: 1.0,
            hits: mockHits
          }
        };
      }
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      // Return an empty result set on error
      return {
        hits: {
          total: { value: 0, relation: 'eq' },
          hits: []
        }
      };
    }
  }

  /**
   * Check if index exists
   */
  async indices() {
    return {
      exists: async () => true,
      create: async () => ({ acknowledged: true })
    };
  }

  /**
   * Index a document
   */
  async index(params) {
    console.log('Mock indexing document:', params);
    return { result: 'created', _id: `mock-id-${Date.now()}` };
  }

  /**
   * Bulk operations
   */
  async bulk(params) {
    console.log('Mock bulk operation with', (params.body?.length || 0) / 2, 'items');
    return {
      took: 10,
      errors: false,
      items: []
    };
  }
}

/**
 * Generate mock search results based on a search query
 */
function generateMockHits(searchText = '') {
  const allMockData = [
    {
      id: '1',
      name: 'Customer Data Warehouse 567',
      description: 'Enterprise data warehouse for customer data analysis',
      owner: 'Marketing Department',
      domain: 'Customer',
      tags: ['PII', 'Customer', 'Marketing'],
      created_at: '2024-05-15',
      updated_at: '2025-07-30',
      classification: 'Confidential'
    },
    {
      id: '2',
      name: 'Financial Reporting Database',
      description: 'Financial data repository for quarterly reports',
      owner: 'Finance Department',
      domain: 'Finance',
      tags: ['Financial', 'Reporting', 'Quarterly'],
      created_at: '2024-04-10',
      updated_at: '2025-08-01',
      classification: 'Internal'
    },
    {
      id: '3',
      name: 'Product Inventory System',
      description: 'Real-time inventory tracking across warehouses',
      owner: 'Operations',
      domain: 'Product',
      tags: ['Inventory', 'Product', 'Warehouse'],
      created_at: '2024-03-22',
      updated_at: '2025-07-28',
      classification: 'Internal'
    },
    {
      id: '4',
      name: 'Marketing Campaign Analytics',
      description: 'Performance metrics for marketing campaigns',
      owner: 'Marketing Department',
      domain: 'Marketing',
      tags: ['Campaign', 'Analytics', 'Marketing'],
      created_at: '2024-06-05',
      updated_at: '2025-07-25',
      classification: 'Internal'
    },
    {
      id: '5',
      name: 'Employee HR Records',
      description: 'Human resources employee database',
      owner: 'HR Department',
      domain: 'HR',
      tags: ['Employee', 'HR', 'PII'],
      created_at: '2024-02-15',
      updated_at: '2025-07-20',
      classification: 'Restricted'
    },
  ];
  
  // If no search text, return all mock data
  if (!searchText) {
    return allMockData.map(item => ({
      _id: item.id,
      _source: item,
      _score: 1.0
    }));
  }
  
  // Simple search implementation that checks if the search text is in any of the fields
  const lowerSearchText = searchText.toLowerCase();
  
  return allMockData
    .filter(item => {
      // Check name, description, domain, and tags
      return (
        item.name.toLowerCase().includes(lowerSearchText) ||
        item.description.toLowerCase().includes(lowerSearchText) ||
        item.domain.toLowerCase().includes(lowerSearchText) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerSearchText))
      );
    })
    .map(item => ({
      _id: item.id,
      _source: item,
      _score: 1.0
    }));
}

// Export the Client class as named export and default export to match the Elasticsearch package
exports.Client = Client;
module.exports = { Client };
module.exports.default = { Client };

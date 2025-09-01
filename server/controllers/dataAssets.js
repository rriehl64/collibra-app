/**
 * Data Assets Controller
 * Handles all operations related to data assets
 */
const DataAsset = require('../models/DataAsset');

/**
 * @desc    Get all data assets
 * @route   GET /api/v1/data-assets
 * @access  Public
 */
exports.getDataAssets = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'q', 'debug', 'type', 'domains', 'statuses', 'certifications', 'owners', 'complianceStatuses', 'tags'];
    
    // Remove excluded fields from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Handle type filter specifically
    if (req.query.type) {
      const types = Array.isArray(req.query.type) ? req.query.type : [req.query.type];
      query.type = { $in: types };
      console.log(`Filtering by types: ${types.join(', ')}`);
    }
    
    // Handle domain filter - support both 'domain' and 'domains' parameters
    if (req.query.domains || req.query.domain) {
      const domainParam = req.query.domains || req.query.domain;
      const domains = Array.isArray(domainParam) ? domainParam : domainParam.split(',');
      query.domain = { $in: domains };
      console.log(`Filtering by domains: ${domains.join(', ')}`);
    }
    
    // Handle status filter
    if (req.query.statuses) {
      const statuses = Array.isArray(req.query.statuses) ? req.query.statuses : req.query.statuses.split(',');
      query.status = { $in: statuses };
      console.log(`Filtering by statuses: ${statuses.join(', ')}`);
    }
    
    // Handle certification filter
    if (req.query.certifications) {
      const certifications = Array.isArray(req.query.certifications) ? req.query.certifications : req.query.certifications.split(',');
      query.certification = { $in: certifications };
      console.log(`Filtering by certifications: ${certifications.join(', ')}`);
    }
    
    // Handle owner filter
    if (req.query.owners) {
      const owners = Array.isArray(req.query.owners) ? req.query.owners : req.query.owners.split(',');
      query.owner = { $in: owners };
      console.log(`Filtering by owners: ${owners.join(', ')}`);
    }
    
    // Handle compliance status filter
    if (req.query.complianceStatuses) {
      const complianceStatuses = Array.isArray(req.query.complianceStatuses) ? req.query.complianceStatuses : req.query.complianceStatuses.split(',');
      query.complianceStatus = { $in: complianceStatuses };
      console.log(`Filtering by compliance statuses: ${complianceStatuses.join(', ')}`);
    }
    
    // Handle tags filter
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags) ? req.query.tags : req.query.tags.split(',');
      query.tags = { $in: tags };
      console.log(`Filtering by tags: ${tags.join(', ')}`);
    }
    
    // Filter by other fields
    if (Object.keys(reqQuery).length > 0) {
      query = { ...query, ...reqQuery };
    }
    
    // Debug logging
    const debug = req.query.debug === 'true';
    if (debug) {
      console.log('Debug mode enabled for search request');
    }
    
    // Enhanced search functionality for all search terms including multi-word searches
    if (req.query.q && req.query.q.trim() !== '') {
      const searchTerm = req.query.q;
      console.log(`Processing search for term: "${searchTerm}"`);
      
      // Check if search term is wrapped in quotes for exact match
      const isExactMatch = (searchTerm.startsWith('"') && searchTerm.endsWith('"')) || 
                          (searchTerm.startsWith("'") && searchTerm.endsWith("'"));
      
      if (isExactMatch) {
        // Remove quotes and search for exact phrase
        const exactPhrase = searchTerm.slice(1, -1);
        console.log(`Exact phrase search for: "${exactPhrase}"`);
        
        // Escape special regex characters and create exact match query
        const escapedPhrase = exactPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query = {
          $or: [
            { name: { $regex: `^${escapedPhrase}$`, $options: 'i' } }, // Exact match
            { name: { $regex: escapedPhrase, $options: 'i' } }, // Contains phrase
            { description: { $regex: escapedPhrase, $options: 'i' } }
          ]
        };
        
        if (debug) {
          console.log('Exact match query:', JSON.stringify(query));
        }
      } else {
        // Regular search processing for non-quoted searches
        const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);
        console.log(`Search terms after splitting: ${JSON.stringify(searchTerms)}`);

        if (searchTerms.length > 0) {
          // For multi-word searches, require ALL terms to match (AND logic)
          const searchConditions = searchTerms.map(term => ({
            $or: [
              { name: { $regex: term, $options: 'i' } },
              { type: { $regex: term, $options: 'i' } },
              { domain: { $regex: term, $options: 'i' } },
              { owner: { $regex: term, $options: 'i' } },
              { description: { $regex: term, $options: 'i' } },
              { tags: { $regex: term, $options: 'i' } }
            ]
          }));
          
          // Use $and to ensure all search terms must be found
          query = { $and: searchConditions };
          
          console.log(`Created search query with ${searchConditions.length} conditions`);
          if (debug) {
            console.log('Search query:', JSON.stringify(query));
          }
        }
      }
    } else {
      console.log('No search term provided, returning all records');
    }
    
    // Legacy search parameter support
    if (req.query.search && !req.query.q) {
      query.$text = { $search: req.query.search };
    }
    
    // Find data assets
    let assets = DataAsset.find(query);
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      assets = assets.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      assets = assets.sort(sortBy);
    } else {
      assets = assets.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await DataAsset.countDocuments(query);
    
    assets = assets.skip(startIndex).limit(limit);
    
    // Executing query
    const results = await assets;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      try {
        const {
          search = '',
          type = '',
          domains = '',
          statuses = '',
          certifications = '',
          owners = '',
          complianceStatuses = '',
          tags = '',
          page = 1,
          limit = 15,
          sortBy = 'name',
          sortOrder = 'asc'
        } = req.query;
        pagination.next = {
          page: page + 1,
          limit
        };
      } catch (err) {
        console.error(err);
      }
    }
    
    if (startIndex > 0) {
      try {
        const {
          search = '',
          type = '',
          domains = '',
          statuses = '',
          certifications = '',
          owners = '',
          complianceStatuses = '',
          tags = '',
          page = 1,
          limit = 15,
          sortBy = 'name',
          sortOrder = 'asc'
        } = req.query;
        pagination.prev = {
          page: page - 1,
          limit
        };
      } catch (err) {
        console.error(err);
      }
    }
    
    res.status(200).json({
      success: true,
      count: results.length,
      total: total,
      pagination,
      data: results
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get single data asset
 * @route   GET /api/v1/data-assets/:id
 * @access  Public
 */
exports.getDataAsset = async (req, res) => {
  try {
    const asset = await DataAsset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: asset
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Create new data asset
 * @route   POST /api/v1/data-assets
 * @access  Public
 */
exports.createDataAsset = async (req, res) => {
  try {
    const asset = await DataAsset.create(req.body);
    
    res.status(201).json({
      success: true,
      data: asset
    });
    
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Update data asset
 * @route   PUT /api/v1/data-assets/:id
 * @access  Public
 */
exports.updateDataAsset = async (req, res) => {
  try {
    const asset = await DataAsset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: asset
    });
    
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Delete data asset
 * @route   DELETE /api/v1/data-assets/:id
 * @access  Public
 */
exports.deleteDataAsset = async (req, res) => {
  try {
    const asset = await DataAsset.findByIdAndDelete(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/v1/data-assets/suggestions
// @access  Public
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Get suggestions from asset names and descriptions
    const suggestions = await DataAsset.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name type domain')
    .limit(10)
    .lean();
    
    // Format suggestions
    const formattedSuggestions = suggestions.map(asset => ({
      text: asset.name,
      type: asset.type,
      domain: asset.domain
    }));
    
    res.status(200).json({
      success: true,
      data: formattedSuggestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

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
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    
    // Remove excluded fields from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Filter by fields
    if (Object.keys(reqQuery).length > 0) {
      query = reqQuery;
    }
    
    // Search functionality
    if (req.query.search) {
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
      assets = assets.sort('-lastModified');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await DataAsset.countDocuments(query);
    
    assets = assets.skip(startIndex).limit(limit);
    
    // Execute query
    const results = await assets;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: results.length,
      pagination,
      total,
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
    
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Create new data asset
 * @route   POST /api/v1/data-assets
 * @access  Private
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
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Update data asset
 * @route   PUT /api/v1/data-assets/:id
 * @access  Private
 */
exports.updateDataAsset = async (req, res) => {
  try {
    let asset = await DataAsset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    // Perform update
    asset = await DataAsset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Delete data asset
 * @route   DELETE /api/v1/data-assets/:id
 * @access  Private
 */
exports.deleteDataAsset = async (req, res) => {
  try {
    const asset = await DataAsset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    await asset.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Data asset not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

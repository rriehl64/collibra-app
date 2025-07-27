/**
 * Policy Controller
 * Handles all operations related to governance policies
 */
const Policy = require('../models/Policy');

/**
 * @desc    Get all policies
 * @route   GET /api/v1/policies
 * @access  Private
 */
exports.getPolicies = async (req, res) => {
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
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    // Find policies
    let policies = Policy.find(query);
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      policies = policies.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      policies = policies.sort(sortBy);
    } else {
      policies = policies.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Policy.countDocuments(query);
    
    policies = policies.skip(startIndex).limit(limit);
    
    // Populate references
    policies = policies.populate([
      { path: 'owner', select: 'name email' },
      { path: 'approvers', select: 'name email' }
    ]);
    
    // Execute query
    const results = await policies;
    
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
 * @desc    Get single policy
 * @route   GET /api/v1/policies/:id
 * @access  Private
 */
exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate([
      { path: 'owner', select: 'name email' },
      { path: 'approvers', select: 'name email' },
      { path: 'revisionHistory.changedBy', select: 'name email' }
    ]);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (err) {
    console.error(err);
    
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Policy not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Create new policy
 * @route   POST /api/v1/policies
 * @access  Private (Admin and Data Steward only)
 */
exports.createPolicy = async (req, res) => {
  try {
    // Set the owner to the current user if not provided
    if (!req.body.owner) {
      req.body.owner = req.user.id;
    }
    
    const policy = await Policy.create(req.body);
    
    res.status(201).json({
      success: true,
      data: policy
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
 * @desc    Update policy
 * @route   PUT /api/v1/policies/:id
 * @access  Private (Admin and Data Steward only)
 */
exports.updatePolicy = async (req, res) => {
  try {
    let policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found'
      });
    }
    
    // Append revision history if version is being updated
    if (req.body.version && req.body.version !== policy.version) {
      if (!req.body.revisionHistory) {
        req.body.revisionHistory = policy.revisionHistory || [];
      }
      
      req.body.revisionHistory.push({
        version: req.body.version,
        date: Date.now(),
        changedBy: req.user.id,
        changeDescription: req.body.changeDescription || `Updated to version ${req.body.version}`
      });
      
      // Remove the changeDescription from the main body as it's not part of the schema
      delete req.body.changeDescription;
    }
    
    // Perform update
    policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: policy
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
        error: 'Policy not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Delete policy
 * @route   DELETE /api/v1/policies/:id
 * @access  Private (Admin only)
 */
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found'
      });
    }
    
    await policy.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Policy not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

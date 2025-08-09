/**
 * Data Concept Controller
 * Handles API requests for data concepts
 */

const DataConcept = require('../models/DataConcept');
const mongoose = require('mongoose');

// Get all data concepts with optional search and filters
exports.getAllDataConcepts = async (req, res) => {
  try {
    const { search, status, domain } = req.query;
    const query = {};
    
    // Apply search filter if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Apply status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Apply domain filter if provided
    if (domain) {
      query.domain = domain;
    }
    
    const concepts = await DataConcept.find(query)
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single data concept by ID
exports.getDataConcept = async (req, res) => {
  try {
    const concept = await DataConcept.findById(req.params.id);
    
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Data concept not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: concept
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new data concept
exports.createDataConcept = async (req, res) => {
  try {
    // Add user ID to request body if authenticated
    if (req.user && req.user.id) {
      req.body.createdBy = req.user.id;
      req.body.updatedBy = req.user.id;
    }
    
    const concept = await DataConcept.create(req.body);
    
    res.status(201).json({
      success: true,
      data: concept
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
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

// Update an existing data concept
exports.updateDataConcept = async (req, res) => {
  try {
    // Add user ID to updated fields if authenticated
    if (req.user && req.user.id) {
      req.body.updatedBy = req.user.id;
    }
    
    // Convert lastUpdated to current date
    req.body.lastUpdated = Date.now();
    
    const concept = await DataConcept.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run validation on update
      }
    );
    
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Data concept not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: concept
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a data concept
exports.deleteDataConcept = async (req, res) => {
  try {
    const concept = await DataConcept.findByIdAndDelete(req.params.id);
    
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Data concept not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all available statuses
exports.getDataConceptStatuses = async (req, res) => {
  try {
    const statuses = await DataConcept.distinct('status');
    
    res.status(200).json({
      success: true,
      data: statuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all available domains
exports.getDataConceptDomains = async (req, res) => {
  try {
    const domains = await DataConcept.distinct('domain');
    
    res.status(200).json({
      success: true,
      data: domains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

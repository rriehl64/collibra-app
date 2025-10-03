const TeamRosterPicklist = require('../models/TeamRosterPicklist');

// @desc    Get all picklists
// @route   GET /api/v1/team-roster-picklists
// @access  Private (admin/data-steward)
exports.getPicklists = async (req, res) => {
  try {
    const picklists = await TeamRosterPicklist.find();
    
    res.status(200).json({
      success: true,
      count: picklists.length,
      data: picklists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get picklist by type
// @route   GET /api/v1/team-roster-picklists/:type
// @access  Private (admin/data-steward)
exports.getPicklistByType = async (req, res) => {
  try {
    const picklist = await TeamRosterPicklist.findOne({ type: req.params.type });
    
    if (!picklist) {
      return res.status(404).json({
        success: false,
        error: 'Picklist not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: picklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update picklist
// @route   PUT /api/v1/team-roster-picklists/:type
// @access  Private (admin)
exports.updatePicklist = async (req, res) => {
  try {
    const { values, modifiedBy } = req.body;
    
    let picklist = await TeamRosterPicklist.findOne({ type: req.params.type });
    
    if (!picklist) {
      // Create new picklist if it doesn't exist
      picklist = await TeamRosterPicklist.create({
        type: req.params.type,
        values,
        modifiedBy: modifiedBy || req.user?.name || 'admin'
      });
    } else {
      // Update existing picklist
      picklist.values = values;
      picklist.modifiedBy = modifiedBy || req.user?.name || 'admin';
      await picklist.save();
    }
    
    res.status(200).json({
      success: true,
      data: picklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add value to picklist
// @route   POST /api/v1/team-roster-picklists/:type/values
// @access  Private (admin)
exports.addPicklistValue = async (req, res) => {
  try {
    const { value, displayOrder } = req.body;
    
    let picklist = await TeamRosterPicklist.findOne({ type: req.params.type });
    
    if (!picklist) {
      // Create new picklist if it doesn't exist
      picklist = await TeamRosterPicklist.create({
        type: req.params.type,
        values: [{ value, displayOrder: displayOrder || 0 }],
        modifiedBy: req.user?.name || 'admin'
      });
    } else {
      // Check if value already exists
      const existingValue = picklist.values.find(v => v.value === value);
      if (existingValue) {
        return res.status(400).json({
          success: false,
          error: 'Value already exists in picklist'
        });
      }
      
      picklist.values.push({ value, displayOrder: displayOrder || picklist.values.length });
      picklist.modifiedBy = req.user?.name || 'admin';
      await picklist.save();
    }
    
    res.status(201).json({
      success: true,
      data: picklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete value from picklist
// @route   DELETE /api/v1/team-roster-picklists/:type/values/:valueId
// @access  Private (admin)
exports.deletePicklistValue = async (req, res) => {
  try {
    const picklist = await TeamRosterPicklist.findOne({ type: req.params.type });
    
    if (!picklist) {
      return res.status(404).json({
        success: false,
        error: 'Picklist not found'
      });
    }
    
    picklist.values = picklist.values.filter(v => v._id.toString() !== req.params.valueId);
    picklist.modifiedBy = req.user?.name || 'admin';
    await picklist.save();
    
    res.status(200).json({
      success: true,
      data: picklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Initialize default picklists
// @route   POST /api/v1/team-roster-picklists/initialize
// @access  Private (admin)
exports.initializePicklists = async (req, res) => {
  try {
    const defaultPicklists = [
      {
        type: 'role',
        values: [
          { value: 'Data Engineer', displayOrder: 1, isActive: true },
          { value: 'Data Analyst', displayOrder: 2, isActive: true },
          { value: 'Data Scientist', displayOrder: 3, isActive: true },
          { value: 'Business Analyst', displayOrder: 4, isActive: true },
          { value: 'Data Architect', displayOrder: 5, isActive: true },
          { value: 'Product Manager', displayOrder: 6, isActive: true },
          { value: 'UX Designer', displayOrder: 7, isActive: true },
          { value: 'Software Engineer', displayOrder: 8, isActive: true },
          { value: 'DevOps Engineer', displayOrder: 9, isActive: true },
          { value: 'Data Steward', displayOrder: 10, isActive: true },
          { value: 'Program Manager', displayOrder: 11, isActive: true },
          { value: 'Quality Assurance Engineer', displayOrder: 12, isActive: true }
        ],
        modifiedBy: 'system'
      },
      {
        type: 'branch',
        values: [
          { value: 'Front Office', displayOrder: 1, isActive: true },
          { value: 'Data Management', displayOrder: 2, isActive: true },
          { value: 'Data Analytics', displayOrder: 3, isActive: true },
          { value: 'Data Engineering', displayOrder: 4, isActive: true },
          { value: 'Data Science', displayOrder: 5, isActive: true },
          { value: 'Business Intelligence', displayOrder: 6, isActive: true },
          { value: 'Data Governance', displayOrder: 7, isActive: true },
          { value: 'Product & Design', displayOrder: 8, isActive: true }
        ],
        modifiedBy: 'system'
      },
      {
        type: 'positionTitle',
        values: [
          { value: 'Senior Data Engineer', displayOrder: 1, isActive: true },
          { value: 'Lead Data Analyst', displayOrder: 2, isActive: true },
          { value: 'Principal Data Scientist', displayOrder: 3, isActive: true },
          { value: 'Senior Business Analyst', displayOrder: 4, isActive: true },
          { value: 'Chief Data Architect', displayOrder: 5, isActive: true },
          { value: 'Senior Product Manager', displayOrder: 6, isActive: true },
          { value: 'Lead UX Designer', displayOrder: 7, isActive: true },
          { value: 'Staff Software Engineer', displayOrder: 8, isActive: true },
          { value: 'Senior DevOps Engineer', displayOrder: 9, isActive: true },
          { value: 'Data Governance Manager', displayOrder: 10, isActive: true },
          { value: 'Senior Program Manager', displayOrder: 11, isActive: true },
          { value: 'QA Lead', displayOrder: 12, isActive: true }
        ],
        modifiedBy: 'system'
      }
    ];
    
    const results = [];
    for (const picklistData of defaultPicklists) {
      const existing = await TeamRosterPicklist.findOne({ type: picklistData.type });
      if (!existing) {
        const picklist = await TeamRosterPicklist.create(picklistData);
        results.push(picklist);
      } else {
        results.push(existing);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Picklists initialized successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

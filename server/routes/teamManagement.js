const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// GET /api/v1/team-management/members - Get all team members with status filter
router.get('/members', async (req, res) => {
  try {
    const { status = 'all', branch, role } = req.query;
    
    let filter = {};
    
    // Filter by status
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'archived') {
      filter.isActive = false;
    }
    
    // Filter by branch
    if (branch && branch !== 'all') {
      filter.branch = branch;
    }
    
    // Filter by role
    if (role && role !== 'all') {
      filter.role = { $regex: role, $options: 'i' };
    }
    
    const members = await TeamMember.find(filter)
      .sort({ 'name.lastName': 1, 'name.firstName': 1 });
    
    // Calculate utilization for each member since virtuals aren't included by default
    const membersWithUtilization = members.map(member => {
      const memberObj = member.toObject({ virtuals: true });
      const totalAllocation = (member.currentAssignments || []).reduce((sum, assignment) => {
        return sum + (assignment.allocation || 0);
      }, 0);
      
      return {
        ...memberObj,
        currentUtilization: Math.min(totalAllocation, 100),
        availableCapacity: Math.max(0, 100 - totalAllocation)
      };
    });
    
    const summary = {
      total: membersWithUtilization.length,
      active: membersWithUtilization.filter(m => m.isActive).length,
      archived: membersWithUtilization.filter(m => !m.isActive).length
    };
    
    res.json({
      success: true,
      data: membersWithUtilization,
      summary
    });
    
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
});

// POST /api/v1/team-management/members - Add new team member
router.post('/members', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      personalPhone,
      role,
      branch,
      skills = [],
      capacity = { fteAllocation: 1.0, hoursPerWeek: 40, availableHours: 40 }
    } = req.body;
    
    // Generate employee ID
    const existingMembers = await TeamMember.find({}).sort({ employeeId: -1 }).limit(1);
    let nextId = 1;
    if (existingMembers.length > 0) {
      const lastId = existingMembers[0].employeeId;
      const numPart = parseInt(lastId.replace('EMP-', ''));
      nextId = numPart + 1;
    }
    const employeeId = `EMP-${nextId.toString().padStart(3, '0')}`;
    
    const newMember = new TeamMember({
      employeeId,
      name: { firstName, lastName },
      email,
      personalPhone,
      role,
      title: role,
      branch,
      division: 'USCIS',
      startDate: new Date(),
      skills,
      capacity,
      currentAssignments: [],
      isActive: true
    });
    
    const savedMember = await newMember.save();
    
    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: savedMember
    });
    
  } catch (error) {
    console.error('Error adding team member:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        error: 'Duplicate email address'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add team member',
      error: error.message
    });
  }
});

// PUT /api/v1/team-management/members/:id/archive - Archive team member
router.put('/members/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const member = await TeamMember.findById(id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    
    if (!member.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Team member is already archived'
      });
    }
    
    member.isActive = false;
    member.endDate = new Date();
    
    if (reason) {
      member.notes.push({
        note: `Archived: ${reason}`,
        author: 'System',
        type: 'General'
      });
    }
    
    await member.save();
    
    res.json({
      success: true,
      message: 'Team member archived successfully',
      data: member
    });
    
  } catch (error) {
    console.error('Error archiving team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive team member',
      error: error.message
    });
  }
});

// PUT /api/v1/team-management/members/:id/reactivate - Reactivate team member
router.put('/members/:id/reactivate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const member = await TeamMember.findById(id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    
    if (member.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Team member is already active'
      });
    }
    
    member.isActive = true;
    member.endDate = null;
    member.notes.push({
      note: 'Reactivated from archive',
      author: 'System',
      type: 'General'
    });
    
    await member.save();
    
    res.json({
      success: true,
      message: 'Team member reactivated successfully',
      data: member
    });
    
  } catch (error) {
    console.error('Error reactivating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate team member',
      error: error.message
    });
  }
});

// PUT /api/v1/team-management/members/:id - Update team member
router.put('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'email', 'personalPhone', 'role', 'title', 'branch',
      'division', 'skills', 'currentAssignments', 'capacity'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        member[field] = updateData[field];
      }
    });

    // Recalculate utilization and capacity if assignments changed
    if (updateData.currentAssignments !== undefined) {
      const totalAllocation = updateData.currentAssignments.reduce((sum, assignment) => {
        return sum + (assignment.allocation || 0);
      }, 0);

      member.currentUtilization = Math.min(totalAllocation, 100);
      member.availableCapacity = Math.max(0, 100 - totalAllocation);

      // Update capacity.availableHours if capacity is provided
      if (member.capacity && member.capacity.hoursPerWeek) {
        member.capacity.availableHours = Math.max(0, member.capacity.hoursPerWeek - Math.round((totalAllocation / 100) * member.capacity.hoursPerWeek));
      }
    }

    const updatedMember = await member.save();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember
    });

  } catch (error) {
    console.error('Error updating team member:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        error: 'Duplicate email address'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
});
// DELETE /api/v1/team-management/members/:id - Permanently delete team member
router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE_PERMANENTLY') {
      return res.status(400).json({
        success: false,
        message: 'Confirmation required for permanent deletion'
      });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await TeamMember.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Team member deleted permanently',
      data: {
        employeeId: member.employeeId,
        name: `${member.name.firstName} ${member.name.lastName}`
      }
    });

  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
      error: error.message
    });
  }
});

// GET /api/v1/team-management/branches - Get available branches
router.get('/branches', async (req, res) => {
  try {
    const branches = [
      'Front Office',
      'Data Management', 
      'Data Analytics',
      'Data Engineering',
      'Data Science',
      'Business Intelligence',
      'Data Governance',
      'Product & Design'
    ];
    
    res.json({
      success: true,
      data: branches
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
      error: error.message
    });
  }
});

module.exports = router;

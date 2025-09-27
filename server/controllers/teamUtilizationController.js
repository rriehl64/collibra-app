const TeamMember = require('../models/TeamMember');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get overall team utilization metrics
// @route   GET /api/v1/team-utilization/metrics
// @access  Admin/Data Steward
exports.getTeamUtilizationMetrics = asyncHandler(async (req, res, next) => {
  console.log('🚀 Team utilization metrics API called');
  try {
    // Get all active team members
    const teamMembers = await TeamMember.find({}, {
      name: 1,
      role: 1,
      title: 1,
      branch: 1,
      division: 1,
      capacity: 1,
      currentAssignments: 1
    });

    if (teamMembers.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          overallUtilization: 0,
          totalTeamMembers: 0,
          activeMembers: 0,
          averageCapacity: 0,
          totalAllocatedHours: 0,
          totalAvailableHours: 0,
          utilizationByBranch: [],
          utilizationByRole: [],
          topUtilizedMembers: [],
          underUtilizedMembers: [],
          lastUpdated: new Date().toISOString()
        }
      });
    }

    let totalAllocatedHours = 0;
    let totalAvailableHours = 0;
    let activeMembers = 0;
    const branchUtilization = {};
    const roleUtilization = {};
    const memberUtilizations = [];

    // Calculate utilization for each team member
    teamMembers.forEach(member => {
      const availableHours = member.capacity?.availableHours || member.capacity?.hoursPerWeek || 40;
      let allocatedHours = 0;

      // Calculate total allocated hours from current assignments
      if (member.currentAssignments && member.currentAssignments.length > 0) {
        allocatedHours = member.currentAssignments.reduce((total, assignment) => {
          return total + (assignment.hoursAllocated || 0);
        }, 0);
      }

      // If no assignments, estimate based on FTE allocation
      if (allocatedHours === 0 && member.capacity?.fteAllocation) {
        allocatedHours = availableHours * member.capacity.fteAllocation;
      }

      const utilization = availableHours > 0 ? (allocatedHours / availableHours) * 100 : 0;
      
      totalAllocatedHours += allocatedHours;
      totalAvailableHours += availableHours;
      
      if (utilization > 0) {
        activeMembers++;
      }

      // Track member utilization
      memberUtilizations.push({
        name: `${member.name.firstName} ${member.name.lastName}`,
        role: member.role,
        branch: member.branch,
        utilization: Math.round(utilization),
        allocatedHours: Math.round(allocatedHours),
        availableHours: availableHours
      });

      // Aggregate by branch
      if (!branchUtilization[member.branch]) {
        branchUtilization[member.branch] = {
          branch: member.branch,
          totalAllocated: 0,
          totalAvailable: 0,
          memberCount: 0
        };
      }
      branchUtilization[member.branch].totalAllocated += allocatedHours;
      branchUtilization[member.branch].totalAvailable += availableHours;
      branchUtilization[member.branch].memberCount++;

      // Aggregate by role
      if (!roleUtilization[member.role]) {
        roleUtilization[member.role] = {
          role: member.role,
          totalAllocated: 0,
          totalAvailable: 0,
          memberCount: 0
        };
      }
      roleUtilization[member.role].totalAllocated += allocatedHours;
      roleUtilization[member.role].totalAvailable += availableHours;
      roleUtilization[member.role].memberCount++;
    });

    // Calculate overall utilization
    const overallUtilization = totalAvailableHours > 0 ? 
      Math.round((totalAllocatedHours / totalAvailableHours) * 100) : 0;

    // Calculate average capacity
    const averageCapacity = teamMembers.length > 0 ? 
      Math.round(totalAvailableHours / teamMembers.length) : 0;

    // Process branch utilization
    const utilizationByBranch = Object.values(branchUtilization).map(branch => ({
      branch: branch.branch,
      utilization: branch.totalAvailable > 0 ? 
        Math.round((branch.totalAllocated / branch.totalAvailable) * 100) : 0,
      memberCount: branch.memberCount,
      allocatedHours: Math.round(branch.totalAllocated),
      availableHours: Math.round(branch.totalAvailable)
    }));

    // Process role utilization
    const utilizationByRole = Object.values(roleUtilization).map(role => ({
      role: role.role,
      utilization: role.totalAvailable > 0 ? 
        Math.round((role.totalAllocated / role.totalAvailable) * 100) : 0,
      memberCount: role.memberCount,
      allocatedHours: Math.round(role.totalAllocated),
      availableHours: Math.round(role.totalAvailable)
    }));

    // Sort members by utilization
    memberUtilizations.sort((a, b) => b.utilization - a.utilization);

    // Get top utilized (>= 95%) and under-utilized (<= 40%) members
    const topUtilizedMembers = memberUtilizations.filter(m => m.utilization >= 95).slice(0, 10);
    const underUtilizedMembers = memberUtilizations.filter(m => m.utilization <= 40).slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        overallUtilization,
        totalTeamMembers: teamMembers.length,
        activeMembers,
        averageCapacity,
        totalAllocatedHours: Math.round(totalAllocatedHours),
        totalAvailableHours: Math.round(totalAvailableHours),
        utilizationByBranch: utilizationByBranch.sort((a, b) => b.utilization - a.utilization),
        utilizationByRole: utilizationByRole.sort((a, b) => b.utilization - a.utilization),
        topUtilizedMembers,
        underUtilizedMembers,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error calculating team utilization metrics:', error);
    return next(new AppError('Error calculating team utilization metrics', 500));
  }
});

// @desc    Get detailed team member information with utilization
// @route   GET /api/v1/team-utilization/members
// @access  Admin/Data Steward
exports.getTeamMemberDetails = asyncHandler(async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find({}).populate('currentAssignments.priorityId', 'title');

    const memberDetails = teamMembers.map(member => {
      const availableHours = member.capacity?.availableHours || member.capacity?.hoursPerWeek || 40;
      let allocatedHours = 0;

      // Calculate total allocated hours
      if (member.currentAssignments && member.currentAssignments.length > 0) {
        allocatedHours = member.currentAssignments.reduce((total, assignment) => {
          return total + (assignment.hoursAllocated || 0);
        }, 0);
      }

      // If no assignments, estimate based on FTE allocation
      if (allocatedHours === 0 && member.capacity?.fteAllocation) {
        allocatedHours = availableHours * member.capacity.fteAllocation;
      }

      const utilization = availableHours > 0 ? (allocatedHours / availableHours) * 100 : 0;
      
      let status = 'optimal';
      if (utilization >= 95) status = 'over-utilized';
      else if (utilization <= 40) status = 'under-utilized';

      return {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        title: member.title,
        branch: member.branch,
        division: member.division,
        capacity: member.capacity,
        currentAssignments: member.currentAssignments.map(assignment => ({
          priorityName: assignment.priorityName,
          allocation: assignment.allocation,
          hoursAllocated: assignment.hoursAllocated,
          startDate: assignment.startDate,
          endDate: assignment.endDate
        })),
        utilization: Math.round(utilization),
        status
      };
    });

    res.status(200).json({
      success: true,
      data: memberDetails.sort((a, b) => b.utilization - a.utilization)
    });

  } catch (error) {
    console.error('Error getting team member details:', error);
    return next(new AppError('Error getting team member details', 500));
  }
});

// @desc    Get utilization breakdown by branch
// @route   GET /api/v1/team-utilization/by-branch
// @access  Admin/Data Steward
exports.getUtilizationByBranch = asyncHandler(async (req, res, next) => {
  try {
    const branchAggregation = await TeamMember.aggregate([
      {
        $group: {
          _id: '$branch',
          memberCount: { $sum: 1 },
          totalAvailableHours: { $sum: '$capacity.availableHours' },
          members: {
            $push: {
              name: { $concat: ['$name.firstName', ' ', '$name.lastName'] },
              role: '$role',
              availableHours: '$capacity.availableHours',
              fteAllocation: '$capacity.fteAllocation',
              assignments: '$currentAssignments'
            }
          }
        }
      },
      {
        $project: {
          branch: '$_id',
          memberCount: 1,
          totalAvailableHours: 1,
          members: 1,
          _id: 0
        }
      },
      { $sort: { memberCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: branchAggregation
    });

  } catch (error) {
    console.error('Error getting utilization by branch:', error);
    return next(new AppError('Error getting utilization by branch', 500));
  }
});

// @desc    Get capacity forecast and recommendations
// @route   GET /api/v1/team-utilization/capacity-forecast
// @access  Admin/Data Steward
exports.getCapacityForecast = asyncHandler(async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find({});
    
    // Calculate current capacity metrics
    let totalCapacity = 0;
    let totalUtilized = 0;
    let overUtilizedCount = 0;
    let underUtilizedCount = 0;

    teamMembers.forEach(member => {
      const availableHours = member.capacity?.availableHours || 40;
      let allocatedHours = 0;

      if (member.currentAssignments && member.currentAssignments.length > 0) {
        allocatedHours = member.currentAssignments.reduce((total, assignment) => {
          return total + (assignment.hoursAllocated || 0);
        }, 0);
      }

      const utilization = availableHours > 0 ? (allocatedHours / availableHours) * 100 : 0;
      
      totalCapacity += availableHours;
      totalUtilized += allocatedHours;
      
      if (utilization >= 95) overUtilizedCount++;
      if (utilization <= 40) underUtilizedCount++;
    });

    const overallUtilization = totalCapacity > 0 ? (totalUtilized / totalCapacity) * 100 : 0;
    const availableCapacity = totalCapacity - totalUtilized;

    // Generate recommendations
    const recommendations = [];
    
    if (overallUtilization > 90) {
      recommendations.push({
        type: 'warning',
        title: 'High Team Utilization',
        message: 'Team is operating at high capacity. Consider hiring or redistributing workload.',
        priority: 'high'
      });
    }
    
    if (overUtilizedCount > 0) {
      recommendations.push({
        type: 'alert',
        title: 'Over-utilized Team Members',
        message: `${overUtilizedCount} team members are over-utilized (>95%). Risk of burnout.`,
        priority: 'high'
      });
    }
    
    if (underUtilizedCount > 0) {
      recommendations.push({
        type: 'info',
        title: 'Under-utilized Capacity',
        message: `${underUtilizedCount} team members have available capacity for additional work.`,
        priority: 'medium'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentUtilization: Math.round(overallUtilization),
        totalCapacity: Math.round(totalCapacity),
        totalUtilized: Math.round(totalUtilized),
        availableCapacity: Math.round(availableCapacity),
        overUtilizedCount,
        underUtilizedCount,
        optimalRange: { min: 60, max: 85 },
        recommendations,
        forecastDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting capacity forecast:', error);
    return next(new AppError('Error getting capacity forecast', 500));
  }
});

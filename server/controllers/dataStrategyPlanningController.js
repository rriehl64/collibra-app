const DataStrategyPriority = require('../models/DataStrategyPriority');
const TeamMember = require('../models/TeamMember');
const DataStrategyEpic = require('../models/DataStrategyEpic');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get all data strategy priorities
// @route   GET /api/v1/data-strategy/priorities
// @access  Private
exports.getPriorities = asyncHandler(async (req, res, next) => {
  const { status, strategicGoal, owner, urgency } = req.query;
  
  let filter = {};
  if (status) filter.status = status;
  if (strategicGoal) filter.strategicGoal = strategicGoal;
  if (owner) filter.owner = owner;
  if (urgency) filter.urgency = urgency;

  const priorities = await DataStrategyPriority.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: priorities.length,
    data: priorities
  });
});

// @desc    Get single data strategy priority
// @route   GET /api/v1/data-strategy/priorities/:id
// @access  Private
exports.getPriority = asyncHandler(async (req, res, next) => {
  const priority = await DataStrategyPriority.findById(req.params.id)
    .populate('assignedTeam.memberId', 'name email role branch skills');

  if (!priority) {
    return next(new AppError('Priority not found', 404));
  }

  res.status(200).json({
    success: true,
    data: priority
  });
});

// @desc    Create new data strategy priority
// @route   POST /api/v1/data-strategy/priorities
// @access  Private (Admin/Data Steward)
exports.createPriority = asyncHandler(async (req, res, next) => {
  // Add user info to req.body
  req.body.createdBy = req.user?.name || 'System';
  req.body.lastModifiedBy = req.user?.name || 'System';

  const priority = await DataStrategyPriority.create(req.body);

  res.status(201).json({
    success: true,
    data: priority
  });
});

// @desc    Update data strategy priority
// @route   PUT /api/v1/data-strategy/priorities/:id
// @access  Private (Admin/Data Steward)
exports.updatePriority = asyncHandler(async (req, res, next) => {
  let priority = await DataStrategyPriority.findById(req.params.id);

  if (!priority) {
    return next(new AppError('Priority not found', 404));
  }

  // Add user info to req.body
  req.body.lastModifiedBy = req.user?.name || 'System';

  priority = await DataStrategyPriority.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: priority
  });
});

// @desc    Delete data strategy priority
// @route   DELETE /api/v1/data-strategy/priorities/:id
// @access  Private (Admin)
exports.deletePriority = asyncHandler(async (req, res, next) => {
  const priority = await DataStrategyPriority.findById(req.params.id);

  if (!priority) {
    return next(new AppError('Priority not found', 404));
  }

  await priority.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get team capacity dashboard
// @route   GET /api/v1/data-strategy/team/capacity
// @access  Private
exports.getTeamCapacity = asyncHandler(async (req, res, next) => {
  const teamMembers = await TeamMember.find({ isActive: true })
    .populate('currentAssignments.priorityId', 'priorityName status dueDate');

  const capacityData = teamMembers.map(member => {
    const totalAllocation = member.currentAssignments.reduce((sum, assignment) => {
      return sum + (assignment.allocation || 0);
    }, 0);

    return {
      _id: member._id,
      name: member.fullName,
      email: member.email,
      role: member.role,
      branch: member.branch,
      capacity: member.capacity,
      currentUtilization: Math.min(totalAllocation, 100),
      availableCapacity: Math.max(0, 100 - totalAllocation),
      assignments: member.currentAssignments,
      skills: member.skills
    };
  });

  // Calculate branch-level capacity
  const branchCapacity = {};
  capacityData.forEach(member => {
    if (!branchCapacity[member.branch]) {
      branchCapacity[member.branch] = {
        totalMembers: 0,
        totalCapacity: 0,
        usedCapacity: 0,
        availableCapacity: 0
      };
    }
    
    branchCapacity[member.branch].totalMembers += 1;
    branchCapacity[member.branch].totalCapacity += 100;
    branchCapacity[member.branch].usedCapacity += member.currentUtilization;
    branchCapacity[member.branch].availableCapacity += member.availableCapacity;
  });

  res.status(200).json({
    success: true,
    data: {
      teamMembers: capacityData,
      branchSummary: branchCapacity,
      totalTeamSize: teamMembers.length
    }
  });
});

// @desc    Get all team members
// @route   GET /api/v1/data-strategy/team/members
// @access  Private
exports.getTeamMembers = asyncHandler(async (req, res, next) => {
  const { branch, skills, available } = req.query;
  
  let filter = { isActive: true };
  if (branch) filter.branch = branch;
  if (available === 'true') {
    // Find members with less than 100% utilization
    filter['currentAssignments.allocation'] = { $lt: 100 };
  }

  const teamMembers = await TeamMember.find(filter);

  // Filter by skills if provided
  let filteredMembers = teamMembers;
  if (skills) {
    const skillsArray = skills.split(',');
    filteredMembers = teamMembers.filter(member => 
      skillsArray.some(skill => 
        member.skills.some(memberSkill => 
          memberSkill.skillName.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }

  res.status(200).json({
    success: true,
    count: filteredMembers.length,
    data: filteredMembers
  });
});

// @desc    Create new team member
// @route   POST /api/v1/data-strategy/team/members
// @access  Private (Admin)
exports.createTeamMember = asyncHandler(async (req, res, next) => {
  const teamMember = await TeamMember.create(req.body);

  res.status(201).json({
    success: true,
    data: teamMember
  });
});

// @desc    Update team member
// @route   PUT /api/v1/data-strategy/team/members/:id
// @access  Private (Admin)
exports.updateTeamMember = asyncHandler(async (req, res, next) => {
  let teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return next(new AppError('Team member not found', 404));
  }

  teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: teamMember
  });
});

// @desc    Get all epics
// @route   GET /api/v1/data-strategy/epics
// @access  Private
exports.getEpics = asyncHandler(async (req, res, next) => {
  const { area, status, targetQuarter } = req.query;
  
  let filter = {};
  if (area) filter.area = area;
  if (status) filter.status = status;
  if (targetQuarter) filter.targetQuarter = targetQuarter;

  const epics = await DataStrategyEpic.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: epics.length,
    data: epics
  });
});

// @desc    Create new epic
// @route   POST /api/v1/data-strategy/epics
// @access  Private (Admin/Data Steward)
exports.createEpic = asyncHandler(async (req, res, next) => {
  // Generate epicId if not provided
  if (!req.body.epicId) {
    req.body.epicId = `EPIC-${Date.now()}`;
  }
  
  req.body.createdBy = req.user?.name || 'System';
  req.body.lastModifiedBy = req.user?.name || 'System';

  const epic = await DataStrategyEpic.create(req.body);

  res.status(201).json({
    success: true,
    data: epic
  });
});

// @desc    Update epic
// @route   PUT /api/v1/data-strategy/epics/:id
// @access  Private (Admin/Data Steward)
exports.updateEpic = asyncHandler(async (req, res, next) => {
  let epic = await DataStrategyEpic.findById(req.params.id);

  if (!epic) {
    return next(new AppError('Epic not found', 404));
  }

  req.body.lastModifiedBy = req.user?.name || 'System';

  epic = await DataStrategyEpic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: epic
  });
});

// @desc    Delete epic
// @route   DELETE /api/v1/data-strategy/epics/:id
// @access  Private (Admin)
exports.deleteEpic = asyncHandler(async (req, res, next) => {
  const epic = await DataStrategyEpic.findById(req.params.id);

  if (!epic) {
    return next(new AppError('Epic not found', 404));
  }

  await DataStrategyEpic.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get priority intake template
// @route   GET /api/v1/data-strategy/intake-template
// @access  Private
exports.getIntakeTemplate = asyncHandler(async (req, res, next) => {
  const template = {
    priorityName: '',
    description: '',
    strategicGoal: '',
    owner: '',
    branch: '',
    dueDate: '',
    urgency: 'Medium',
    loeEstimate: {
      hours: 0,
      size: 'M'
    },
    requiredSkills: [],
    complexity: 'Medium',
    riskFactors: [],
    estimatedValue: 'Medium',
    businessValue: '',
    deliverables: [],
    dependencies: [],
    stakeholders: []
  };

  const strategicGoals = [
    'Data Management',
    'Data Engineering', 
    'Data Science',
    'Streamline Case Processing',
    'Product & Design',
    'Data Governance',
    'NPD (Reference Data)',
    'Business Intelligence',
    'Analytics'
  ];

  const commonSkills = [
    'SQL', 'Python', 'R', 'JavaScript', 'ETL', 'Data Modeling',
    'Business Analysis', 'Project Management', 'Agile/Scrum',
    'Data Visualization', 'Machine Learning', 'Statistics',
    'Database Administration', 'Cloud Platforms', 'API Development'
  ];

  res.status(200).json({
    success: true,
    data: {
      template,
      strategicGoals,
      commonSkills
    }
  });
});

// @desc    Bulk update priorities
// @route   PUT /api/v1/data-strategy/priorities/bulk
// @access  Private (Admin/Data Steward)
exports.bulkUpdatePriorities = asyncHandler(async (req, res, next) => {
  const { priorityIds, updates } = req.body;

  if (!priorityIds || !Array.isArray(priorityIds) || priorityIds.length === 0) {
    return next(new AppError('Priority IDs array is required', 400));
  }

  updates.lastModifiedBy = req.user?.name || 'System';

  const result = await DataStrategyPriority.updateMany(
    { _id: { $in: priorityIds } },
    updates
  );

  res.status(200).json({
    success: true,
    data: {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    }
  });
});

// @desc    Get dashboard analytics
// @route   GET /api/v1/data-strategy/analytics
// @access  Private
exports.getDashboardAnalytics = asyncHandler(async (req, res, next) => {
  // Priority statistics
  const priorityStats = await DataStrategyPriority.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgLoeHours: { $avg: '$loeEstimate.hours' }
      }
    }
  ]);

  const priorityByGoal = await DataStrategyPriority.aggregate([
    {
      $group: {
        _id: '$strategicGoal',
        count: { $sum: 1 },
        totalHours: { $sum: '$loeEstimate.hours' }
      }
    }
  ]);

  const urgentPriorities = await DataStrategyPriority.countDocuments({
    urgency: { $in: ['High', 'Critical'] },
    status: { $ne: 'Completed' }
  });

  const overduePriorities = await DataStrategyPriority.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: 'Completed' }
  });

  // Team utilization
  const teamMembers = await TeamMember.find({ isActive: true });
  const totalTeamCapacity = 100; // Total team capacity is always 100%
  
  // Calculate average utilization across all team members
  const totalUtilization = teamMembers.reduce((sum, member) => {
    const utilization = member.currentAssignments.reduce((assignmentSum, assignment) => {
      return assignmentSum + (assignment.allocation || 0);
    }, 0);
    return sum + Math.min(utilization, 100);
  }, 0);
  
  const usedCapacity = teamMembers.length > 0 ? Math.round(totalUtilization / teamMembers.length) : 0;

  res.status(200).json({
    success: true,
    data: {
      priorities: {
        byStatus: priorityStats,
        byGoal: priorityByGoal,
        urgent: urgentPriorities,
        overdue: overduePriorities,
        total: await DataStrategyPriority.countDocuments()
      },
      team: {
        totalMembers: teamMembers.length,
        totalCapacity: totalTeamCapacity,
        usedCapacity: usedCapacity,
        availableCapacity: totalTeamCapacity - usedCapacity,
        utilizationPercentage: usedCapacity
      }
    }
  });
});

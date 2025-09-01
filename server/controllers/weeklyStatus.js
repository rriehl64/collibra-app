const WeeklyStatus = require('../models/WeeklyStatus');
const User = require('../models/User');

// Helper: normalize a date to Monday 00:00:00 UTC
function normalizeToIsoMonday(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);
  return monday;
}

// GET /api/v1/weekly-status
exports.listWeeklyStatus = async (req, res) => {
  try {
    const {
      team,
      userId,
      from,
      to,
      page = 1,
      limit = 25,
      sort = '-weekStart',
      q
    } = req.query;

    const query = {};
    if (team) query.team = team;
    if (userId) query.userId = userId;
    if (from || to) {
      query.weekStart = {};
      if (from) query.weekStart.$gte = new Date(from);
      if (to) query.weekStart.$lte = new Date(to);
    }

    if (q) {
      // For multi-word queries, use $and to ensure all terms match
      const searchTerms = q.trim().split(/\s+/);
      
      if (searchTerms.length === 1) {
        // Single term search
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { team: { $regex: q, $options: 'i' } },
          { $text: { $search: q } }
        ];
      } else {
        // Multi-word search - all terms must match in name field
        query.$and = searchTerms.map(term => ({
          name: { $regex: term, $options: 'i' }
        }));
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      WeeklyStatus.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      WeeklyStatus.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      total,
      pagination: {
        next: (skip + Number(limit)) < total ? { page: Number(page) + 1, limit: Number(limit) } : undefined,
        prev: skip > 0 ? { page: Number(page) - 1, limit: Number(limit) } : undefined,
      }
    });
  } catch (err) {
    console.error('[WeeklyStatus] list error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// GET /api/v1/weekly-status/:id
exports.getWeeklyStatus = async (req, res) => {
  try {
    const item = await WeeklyStatus.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('[WeeklyStatus] get error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// POST /api/v1/weekly-status
exports.createWeeklyStatus = async (req, res) => {
  try {
    const body = req.body || {};

    // Ensure identity from auth context
    if (!body.userId && req.user?._id) body.userId = req.user._id;
    if (!body.name && req.user?.name) body.name = req.user.name;

    // Required field checks (MVP)
    const required = ['userId', 'name', 'team', 'contractNumber', 'periodOfPerformance', 'supervisor', 'weekStart', 'status'];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(', ')}` });

    // Normalize weekStart to Monday
    body.weekStart = normalizeToIsoMonday(body.weekStart);

    // Audit
    body.createdBy = req.user?.email || req.user?.name || 'api';
    body.updatedBy = body.createdBy;

    const created = await WeeklyStatus.create(body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('[WeeklyStatus] create error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Status for this user and week already exists' });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// PUT /api/v1/weekly-status/:id
exports.updateWeeklyStatus = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.weekStart) {
      updates.weekStart = normalizeToIsoMonday(updates.weekStart);
    }

    updates.updatedBy = req.user?.email || req.user?.name || 'api';

    const updated = await WeeklyStatus.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[WeeklyStatus] update error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// DELETE /api/v1/weekly-status/:id
exports.deleteWeeklyStatus = async (req, res) => {
  try {
    const deleted = await WeeklyStatus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('[WeeklyStatus] delete error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// GET /api/v1/weekly-status/sla
// Returns users missing a status for the current (or specified) week
exports.getSlaReport = async (req, res) => {
  try {
    const { week } = req.query;
    const targetWeekStart = normalizeToIsoMonday(week);

    // Find all statuses for the target week
    const statuses = await WeeklyStatus.find({ weekStart: targetWeekStart }).select('userId name team');
    const submittedUserIds = new Set(statuses.map((s) => String(s.userId)));

    // Get users (limit to a reasonable number)
    const users = await User.find().select('name email role').limit(1000);

    const missing = users
      .filter((u) => !submittedUserIds.has(String(u._id)))
      .map((u) => ({ userId: u._id, name: u.name, email: u.email }));

    return res.status(200).json({
      success: true,
      data: {
        weekStart: targetWeekStart,
        submittedCount: statuses.length,
        totalUsers: users.length,
        missing
      }
    });
  } catch (err) {
    console.error('[WeeklyStatus] SLA error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

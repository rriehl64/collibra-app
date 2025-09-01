const MonthlyStatus = require('../models/MonthlyStatus');

// GET /api/v1/monthly-status
exports.listMonthlyStatus = async (req, res) => {
  try {
    const {
      team,
      userId,
      month,
      year,
      page = 1,
      limit = 25,
      sort = '-year -month',
      q
    } = req.query;

    const query = {};
    if (team) query.team = team;
    if (userId) query.userId = userId;
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);

    if (q) {
      // Search in name field and text fields
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { team: { $regex: q, $options: 'i' } },
        { monthName: { $regex: q, $options: 'i' } },
        { $text: { $search: q } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      MonthlyStatus.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      MonthlyStatus.countDocuments(query)
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
    console.error('[MonthlyStatus] list error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// GET /api/v1/monthly-status/:id
exports.getMonthlyStatus = async (req, res) => {
  try {
    const item = await MonthlyStatus.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('[MonthlyStatus] get error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// POST /api/v1/monthly-status
exports.createMonthlyStatus = async (req, res) => {
  try {
    const body = req.body || {};

    // Ensure identity from auth context
    if (!body.userId && req.user?._id) body.userId = req.user._id;
    if (!body.name && req.user?.name) body.name = req.user.name;

    // Required field checks
    const required = ['userId', 'name', 'team', 'month', 'year'];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(', ')}` });

    // Audit
    body.createdBy = req.user?.email || req.user?.name || 'api';
    body.updatedBy = body.createdBy;

    const created = await MonthlyStatus.create(body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('[MonthlyStatus] create error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Monthly status for this user and month already exists' });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// PUT /api/v1/monthly-status/:id
exports.updateMonthlyStatus = async (req, res) => {
  try {
    const updates = { ...req.body };
    updates.updatedBy = req.user?.email || req.user?.name || 'api';

    const updated = await MonthlyStatus.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[MonthlyStatus] update error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// DELETE /api/v1/monthly-status/:id
exports.deleteMonthlyStatus = async (req, res) => {
  try {
    const deleted = await MonthlyStatus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('[MonthlyStatus] delete error:', err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

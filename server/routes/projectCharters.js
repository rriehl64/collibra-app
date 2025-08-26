const express = require('express');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('../controllers/projectCharterController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAll)
  .post(protect, authorize('admin', 'data-steward'), createOne);

router.route('/:id')
  .get(getOne)
  .put(protect, authorize('admin', 'data-steward'), updateOne)
  .delete(protect, authorize('admin'), deleteOne);

module.exports = router;

const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus
} = require('../controllers/taskController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes except for development testing
if (process.env.NODE_ENV === 'production') {
  router.use(protect);
}

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/my-tasks')
  .get(getMyTasks);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router
  .route('/:id/status')
  .patch(updateTaskStatus);

module.exports = router;

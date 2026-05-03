const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
    });
  }
  next();
};

// @route   POST /api/projects/:id/tasks
router.post('/projects/:projectId/tasks', [
  verifyToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('assigneeId').notEmpty().withMessage('Assignee is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  validate
], async (req, res, next) => {
  try {
    const { title, description, assigneeId, dueDate, status } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      assignee: assigneeId,
      project: projectId,
      dueDate,
      status: status || 'todo'
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id/tasks
router.get('/projects/:projectId/tasks', verifyToken, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    let query = { project: projectId };

    if (req.user.role !== 'admin') {
      query.assignee = req.user._id;
    }

    const tasks = await Task.find(query).populate('assignee', 'name email').populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/tasks/:id
router.patch('/tasks/:id', [
  verifyToken,
  body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  validate
], async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions: Admin or Assignee
    if (req.user.role !== 'admin' && task.assignee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tasks/:id
router.delete('/tasks/:id', [verifyToken, requireAdmin], async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

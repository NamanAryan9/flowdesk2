const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
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

// @route   POST /api/projects
router.post('/', [
  verifyToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Project name is required'),
  validate
], async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      members: [req.user._id] // Admin is a member by default
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects
router.get('/', verifyToken, async (req, res, next) => {
  try {
    let query = {};
    // If not admin, only show projects where the user is a member
    if (req.user.role !== 'admin') {
      query.members = req.user._id;
    }
    const projects = await Project.find(query).populate('members', 'name email role');
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects/:id/members
router.post('/:id/members', [
  verifyToken,
  requireAdmin,
  body('email').isEmail().withMessage('Valid email is required'),
  validate
], async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ errors: [{ field: 'email', message: 'User not found' }] });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({ errors: [{ field: 'email', message: 'User already a member' }] });
    }

    project.members.push(user._id);
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/projects/:id
router.delete('/:id', [verifyToken, requireAdmin], async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project and all associated tasks deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

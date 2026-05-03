const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.assignee = req.user._id;
    }

    const tasks = await Task.find(query);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const stats = {
      total: tasks.length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now).length,
      dueThisWeek: tasks.filter(t => {
        if (!t.dueDate || t.status === 'done') return false;
        const d = new Date(t.dueDate);
        return d >= startOfWeek && d <= endOfWeek;
      }).length
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

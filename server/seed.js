const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();

    // Clear collections
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log('Collections cleared');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    console.log('Admin password hash generated');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: adminPassword,
      role: 'admin'
    });

    // Create Member
    const memberPassword = await bcrypt.hash('member123', salt);
    const member = await User.create({
      name: 'Member User',
      email: 'member@demo.com',
      passwordHash: memberPassword,
      role: 'member'
    });

    console.log('Users created');

    // Create Project
    const project = await Project.create({
      name: 'E-commerce Redesign',
      description: 'Revamping the frontend and backend of the e-commerce platform.',
      members: [admin._id, member._id]
    });

    console.log('Project created');

    // Create Tasks
    const now = new Date();
    
    // 1. Done
    await Task.create({
      title: 'Setup initial repository',
      description: 'Initialize git and basic project structure.',
      status: 'done',
      project: project._id,
      assignee: member._id,
      dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    // 2. Overdue
    await Task.create({
      title: 'Design Database Schema',
      description: 'Create ER diagram and define mongoose models.',
      status: 'todo',
      project: project._id,
      assignee: member._id,
      dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    });

    // 3. Upcoming
    await Task.create({
      title: 'Implement Auth API',
      description: 'Develop signup, login and logout endpoints.',
      status: 'todo',
      project: project._id,
      assignee: member._id,
      dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000)
    });

    console.log('Tasks created');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seed();

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log('Users in DB:', users.map(u => ({ email: u.email, role: u.role })));
  process.exit();
};

check();

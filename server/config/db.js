const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Priority: environment variable, then hardcoded fallback for immediate fix
    const uri = process.env.MONGO_URI || 
                process.env.MONGODB_URI || 
                "mongodb+srv://walkerrider068_db_user:Eu8sZZWL6aFMkajC@cluster0.lrhyk0c.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0";
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

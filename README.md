# Team Task Manager (MERN)

A functional Team Task Manager built with React, Node.js, Express, and MongoDB.

## Features
- **Auth**: Secure JWT-based authentication using httpOnly cookies.
- **Role-Based Access**: Admins can create projects and tasks; Members can view and update task statuses.
- **Dashboard**: Real-time stats for tasks (Total, Done, Overdue, Due This Week).
- **Projects**: Project-based task organization and team management.

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or a URI)

## Getting Started

### 1. Clone & Install
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory (see `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Seed Database
Run the seed script to create initial data (Admin: admin@demo.com / admin123, Member: member@demo.com / member123):
```bash
cd server
npm run seed
```

### 4. Run Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## Testing Roles
- **Admin**: Login with `admin@demo.com` / `admin123`. You can create projects, add members, and assign tasks.
- **Member**: Login with `member@demo.com` / `member123`. You can see tasks assigned to you across projects and update their status.

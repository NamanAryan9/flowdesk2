# Team Task Manager (Full-Stack MERN)

A high-performance, responsive Team Task Management application designed for efficient project coordination and task tracking. Built with the MERN stack (MongoDB, Express, React, Node.js), featuring a modern UI and secure role-based access control.

---

## Key Features

- **Secure Authentication**: JWT-based auth with httpOnly cookies for maximum security and CSRF protection.
- **Role-Based Access Control (RBAC)**: 
  - **Admins**: Can create projects, invite members, and manage all tasks.
  - **Members**: Can view projects they belong to and update statuses of assigned tasks.
- **Real-time Dashboard**: Visual metrics for total tasks, completion rate, overdue alerts, and tasks due within the current week.
- **Project Management**: Organize tasks by project, assign specific team members, and track progress globally.
- **Modern UI/UX**: Built with Tailwind CSS and Lucide Icons for a clean, responsive experience.

---

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios, Lucide-React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas Cloud).
- **Security**: JWT (JSON Web Tokens), Bcrypt.js, Cookie-Parser.
- **Deployment**: Railway (Production Ready).

---

## Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/azure1716/-Team-Task-Manager.git
cd -Team-Task-Manager

# Install root, server, and client dependencies
npm run install-all
```

### 2. Environment Setup
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_signing_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Database Initialization
Seed the database with professional demo data:
```bash
node server/seed.js
```

### 4. Running Locally
```bash
# Run both frontend and backend concurrently
npm run dev
```

---

## Production Deployment (Railway)

This project is configured for deployment on Railway as a Single Service.

1. **Static Serving**: The Express server automatically serves the React production build (client/dist) when NODE_ENV=production.
2. **Environment Variables**: Ensure CLIENT_URL is set to your live Railway domain to enable secure cookie handling.
3. **Build Script**: The root package.json contains a unified build script for CI/CD.

---

## Admin Credentials (Demo)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@demo.com | admin123 |
| **Member** | member@demo.com | member123 |

---

## Project Structure

```text
├── client/          # React frontend (Vite)
├── server/          # Node.js Express backend
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # API Endpoints
│   ├── middleware/  # Auth & Role validation
│   └── seed.js      # Database seeding script
├── package.json     # Root monorepo configuration
└── README.md        # This file
```

---

*Developed as part of the Full-Stack MERN Assignment.*

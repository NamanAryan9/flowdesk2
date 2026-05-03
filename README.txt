TEAM TASK MANAGER (FULL-STACK MERN)
=====================================

PROJECT OVERVIEW
----------------
A high-performance Team Task Management application designed for efficient project coordination. Built with the MERN stack (MongoDB, Express, React, Node.js).


KEY FEATURES
------------
- Secure Authentication: JWT-based auth with httpOnly cookies.
- Role-Based Access Control (RBAC): Admin and Member roles.
- Real-time Dashboard: Visual metrics for total, done, and overdue tasks.
- Project Management: Organize tasks by project and manage team members.


TECHNOLOGY STACK
----------------
- Frontend: React 19, Vite, Tailwind CSS, Lucide-React.
- Backend: Node.js, Express.js.
- Database: MongoDB Atlas (Cloud).
- Deployment: Railway.


GETTING STARTED
---------------
1. Installation:
   Run 'npm install' in both /client and /server directories.

2. Environment Setup:
   Create a .env file in /server with:
   PORT=5000
   MONGO_URI=your_uri
   JWT_SECRET=your_secret
   CLIENT_URL=your_client_url
   NODE_ENV=production

3. Database Seeding:
   Run 'node server/seed.js' to initialize data.

4. Running:
   Run 'npm run dev' from the root directory.


ADMIN CREDENTIALS (DEMO)
------------------------
Admin Email: admin@demo.com
Admin Password: admin123

Member Email: member@demo.com
Member Password: member123


LIVE DEPLOYMENT
---------------
The application is live on Railway at the following URL:
https://team-task-manager-production-c8d9.up.railway.app


PROJECT STRUCTURE
-----------------
/client: Frontend React code
/server: Backend Node.js code
/server/models: Database schemas
/server/routes: API endpoints
/server/middleware: Security logic
/server/seed.js: Data initialization script


Developed as part of the Full-Stack MERN Assignment.

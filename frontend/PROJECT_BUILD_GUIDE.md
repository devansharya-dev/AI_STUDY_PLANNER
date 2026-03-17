# AI Study Planner — Development Guide

This document explains the correct development order for building the **AI Study Planner SaaS application**.

The project uses a **separated frontend and backend architecture**.

---

# 1. Project Architecture

Frontend
- React.js (Vite)
- GSAP
- Framer Motion
- Axios
- Tailwind CSS

Backend
- Node.js
- Express.js

Database
- Supabase (PostgreSQL)

Automation
- Email reminders
- node-cron or n8n

---

# 2. Project Folder Structure

Root structure:

ai-study-planner/
│
├── frontend/
├── backend/
├── database/
├── docs/
└── README.md

---

# 3. Frontend Structure

frontend/
│
├── public/
│
├── src/
│
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── ProgressCard.jsx
│   │   └── UploadBox.jsx
│
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UploadSyllabus.jsx
│   │   ├── StudyPlan.jsx
│   │   └── Tasks.jsx
│
│   ├── animations/
│   │   ├── heroAnimation.js
│   │   ├── dashboardAnimation.js
│   │   └── cardAnimation.js
│
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useStudyPlan.js
│
│   ├── services/
│   │   ├── api.js
│   │   ├── syllabusService.js
│   │   ├── planService.js
│   │   └── taskService.js
│
│   ├── context/
│   │   └── AuthContext.js
│
│   ├── utils/
│   │   ├── date.js
│   │   └── validation.js
│
│   ├── styles/
│   │   └── globals.css
│
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js

---

# 4. Backend Structure

backend/
│
├── controllers/
│   ├── authController.js
│   ├── syllabusController.js
│   ├── planController.js
│   └── taskController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── syllabusRoutes.js
│   ├── planRoutes.js
│   └── taskRoutes.js
│
├── services/
│   ├── aiService.js
│   ├── schedulerService.js
│   └── emailService.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── config/
│   └── supabaseClient.js
│
├── jobs/
│   └── reminderJob.js
│
├── utils/
│   └── logger.js
│
├── app.js
├── server.js
│
├── .env
└── package.json

---

# 5. Development Order (IMPORTANT)

Follow this exact order when building the application.

Step 1
Design the database schema.

Step 2
Build backend APIs.

Step 3
Build frontend pages.

Step 4
Connect frontend with backend APIs.

Step 5
Add automation (email reminders).

---

# 6. Database Tables

The database will contain the following tables:

users  
syllabus  
topics  
study_plans  
tasks  

These tables will be stored in Supabase.

---

# 7. Backend API Endpoints

Authentication

POST /api/auth/signup  
POST /api/auth/login  

Syllabus

POST /api/syllabus/upload  

Study Plan

POST /api/plan/generate  

Tasks

GET /api/tasks  
PATCH /api/tasks/:id  

---

# 8. Application Workflow

User registers or logs in.

User uploads syllabus.

Backend extracts topics from syllabus.

System generates study plan.

Study plan is saved in the database.

User views daily tasks in the dashboard.

User marks tasks as completed.

Automation sends daily reminder emails.

---

# 9. Frontend Libraries

Required libraries:

react-router-dom  
axios  
gsap  
framer-motion  
@supabase/supabase-js  
lucide-react  
react-dropzone  
dayjs  
react-hot-toast  

---

# 10. Backend Libraries

Required backend libraries:

express  
cors  
dotenv  
axios  
multer  
nodemailer  
node-cron  
helmet  
morgan  
@supabase/supabase-js  

---

# 11. Automation

Daily reminder system will run using:

node-cron

Trigger time:

8:00 AM daily

The system will check tasks due today and send email reminders.

---

# 12. Development Commands

Frontend

cd frontend  
npm run dev

Backend

cd backend  
npm run dev

---

# End of Development Guide
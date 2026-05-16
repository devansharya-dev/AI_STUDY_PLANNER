# 🚀 AI Study Planner

An intelligent SaaS-based study planning system that converts raw syllabus input into a structured, optimized daily study plan.

---

## 🧠 Overview

AI Study Planner allows users to input raw text (syllabus, goals, or learning plan) and automatically:

* Extracts topics
* Generates a study plan
* Distributes tasks across days
* Tracks progress in real-time

This system is designed to simulate real-world productivity planning using backend-driven logic and AI-assisted parsing.

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* Supabase (PostgreSQL)
* Supabase JS Client

### Frontend

* React.js (Vite)
* Tailwind CSS

### Tools & Integrations

* Zod (validation)
* NodeMailer (email service)
* n8n (automation workflows)
* Cron Jobs (task scheduling)

---

## 🏗️ Architecture

The backend follows a modular architecture:

```
controllers → handle request/response  
services → business logic  
routes → API endpoints  
```

---

## 🗄️ Database Design

### Key Tables

#### `syllabus`

Stores user input

* id (UUID)
* user_id (UUID)
* title (TEXT)
* content (TEXT)

#### `topics`

Extracted from syllabus

* id (UUID)
* syllabus_id (UUID)
* topic (TEXT)
* difficulty (INT)
* estimated_time (INT)
* priority (INT)

#### `study_plans`

Generated plans

* id (UUID)
* user_id (UUID)
* syllabus_id (UUID)
* exam_date (DATE)
* total_days (INT)

#### `tasks`

Daily scheduled tasks

* id (UUID)
* plan_id (UUID)
* topic_id (UUID)
* due_date (TIMESTAMP)
* status (pending | completed | skipped)
* completed_at (TIMESTAMP)

---

## 🔐 Data Integrity & Constraints

* UNIQUE(user_id, title) → prevents duplicate syllabus
* UNIQUE(plan_id, topic_id, due_date) → prevents duplicate tasks
* Foreign key relationships enforced
* Row Level Security (RLS) supported

---

## 🔄 Core Features

### 1. Raw Text Input → Structured Plan

Users can input plain text (no strict format required), and the system extracts topics automatically.

---

### 2. Smart Task Distribution

Tasks are distributed based on:

* Estimated time per topic
* Daily workload limits
* Balanced scheduling

---

### 3. Task Management

* Mark tasks as completed
* Auto-update `completed_at`
* Filter pending/completed tasks

---

### 4. Supabase Integration

* Relational queries using `.select()`
* Secure data handling
* Real-time ready architecture

---

## 📡 API Endpoints

### GET `/tasks`

Fetch tasks with filtering & pagination

```
/tasks?status=pending&page=1&limit=10
```

---

### PATCH `/tasks/:id`

Update task status

```json
{
  "status": "completed"
}
```

---

### POST `/plans`

Generate a study plan from syllabus

---

## 🧪 Testing

Tested for:

* Task filtering
* Status updates
* Duplicate prevention
* Edge cases (invalid input, empty data)

---

## 🚧 Challenges Solved

* Schema inconsistency between backend & DB
* Supabase RLS policy errors
* Duplicate constraint handling using UPSERT
* Relational data fetching using Supabase joins

---

## 📈 Improvements Implemented

* Replaced boolean `completed` with flexible `status` system
* Introduced `completed_at` tracking
* Added composite unique constraints
* Normalized database relationships

---

## 🚀 Future Enhancements

* Redis caching
* Queue system (BullMQ)
* AI-based difficulty adjustment
* Personalized scheduling

---

## 🧠 Key Learnings

* Real-world database design & constraints
* Supabase RLS and security handling
* Backend architecture design
* Debugging schema mismatches

---

## 📌 Status

✅ Backend stable
✅ Database optimized
✅ Core features working

🚧 Improving scheduling intelligence

---

## 👨‍💻 Author

Devansh Arya
Full Stack Developer

---

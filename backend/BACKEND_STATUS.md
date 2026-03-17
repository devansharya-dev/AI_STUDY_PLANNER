# 🚀 Backend Status Report & Roadmap

## 📊 Project Overview: AI Study Planner
**Goal:** Convert syllabi into daily study plans with automated tracking and reminders.

---

## 📂 Current Project Structure
The backend follows a **Clean Architecture (MVC-Service Pattern)**:
- `config/`: Supabase client initialization.
- `middleware/`: JWT authentication & security.
- `services/`: Core business logic (Plan distribution, AI extraction logic).
- `controllers/`: Request handling and response formatting.
- `routes/`: API endpoint definitions.
- `app.js` & `server.js`: Express application setup and server entry point.

---

## ✅ Implemented Features (Completed)

### 1. 🔐 Security & Auth
- **Supabase Integration:** Client configured to interact with your database.
- **Auth Middleware:** Secure `Bearer` token validation for all protected routes.
- **RLS Ready:** All queries are scoped by `user_id` to respect Row Level Security.

### 2. 📝 Syllabus & Plan Generation
- **`POST /api/syllabus`**: Create a syllabus and store associated topics.
- **`POST /api/plan/generate`**: Logic to take a syllabus and distribute topics into daily tasks across a set duration.

### 3. ✅ Task Tracking
- **`GET /api/tasks`**: Fetch all study tasks for the logged-in student.
- **`PATCH /api/tasks/:id`**: Toggle task completion status (`is_completed`).

### 4. 📈 Dashboard Analytics (PRD Phase 3)
- **`GET /api/dashboard/stats`**: Returns:
  - Total Tasks
  - Completed Tasks
  - Remaining Tasks
  - **Progress Percentage** (e.g., 40%)

---

## 🛠️ Next Steps (Pending PRD Requirements)

### 1. 📄 PDF & File Upload (PRD Option 1)
- **Task:** Implement `multer` middleware to handle file uploads.
- **Goal:** Allow users to upload PDF/DOCX syllabi.
- **New File Needed:** `utils/fileParser.js` to extract text from PDFs.

### 2. 🤖 Real AI Extraction (PRD Phase 2)
- **Task:** Connect `services/aiService.js` to OpenAI/Gemini.
- **Goal:** Move from simple line-splitting to intelligent topic extraction from messy syllabus text.

### 3. 📧 Email Reminder System (PRD Phase 4)
- **Task:** Implement `services/emailService.js`.
- **Goal:** Send daily reminders.
- **Integration:** Prepare endpoints for **n8n** to trigger the daily email workflow at 8:00 AM.

### 4. 🛡️ Global Error Middleware
- **Task:** Move error handling from `app.js` to `middleware/errorMiddleware.js`.
- **Goal:** Cleaner code and consistent JSON error formats.

---

## 🚀 How to Run
1. `npm install`
2. Configure `.env` (SUPABASE_URL, SUPABASE_KEY, PORT)
3. `npm run dev`

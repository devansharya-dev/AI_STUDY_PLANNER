# 🔐 Authentication & Authorization Implementation

This document outlines the authentication and authorization system implemented in the backend using **Supabase Auth**.

## 🚀 Overview
The authentication system handles user registration, login, profile retrieval, and session management. It uses JWT tokens (provided by Supabase) for secure communication between the frontend and backend.

---

## 🛠️ Components

### 1. Controllers (`controllers/authController.js`)
- **`signup`**: Handles new user registration. Users receive a verification email from Supabase.
- **`login`**: Authenticates users with email/password and returns a session token.
- **`getMe`**: Returns the currently authenticated user's profile information.
- **`logout`**: Ends the user session.

### 2. Routes (`routes/authRoutes.js`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user profile | **Yes** |
| POST | `/api/auth/logout` | Logout user | **Yes** |

### 3. Middleware (`middleware/authMiddleware.js`)
- Validates the `Authorization: Bearer <token>` header in incoming requests.
- Uses `supabase.auth.getUser(token)` to verify the JWT.
- Populates `req.user` with user details for subsequent handlers.
- Returns `401 Unauthorized` if the token is missing, invalid, or expired.

---

## 🔒 Protected Routes
The following modules now strictly enforce authentication:
- `Syllabus Management`: `POST /api/syllabus`
- `Plan Generation`: `POST /api/plan/generate`
- `Task Tracking`: `GET /api/tasks`, `PATCH /api/tasks/:id`
- `Dashboard Stats`: `GET /api/dashboard/stats`
- `Rescheduling`: `POST /api/reschedule/reschedule`

---

## 📝 Usage Example (Frontend)

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
});
const data = await response.json();
const token = data.token; // Store this securely
```

### Accessing Protected Data
```javascript
const response = await fetch('/api/tasks', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## ✅ Changes Made
1.  **Refactored `authController.js`**: Added `getMe` and `logout` functions and standardized JSON responses.
2.  **Updated `authRoutes.js`**: Exposed new endpoints and integrated `authMiddleware`.
3.  **Fixed `syllabusRoutes.js`**: Removed `mockAuthMiddleware` and enabled real authentication.
4.  **Security Audit**: Ensured `req.user` is consistently used across all controllers to scope data by `user_id`.

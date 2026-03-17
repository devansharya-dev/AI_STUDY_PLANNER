# SaaS Frontend Project Overview

This document outlines the project setup, the directory structure, and the planned roadmap for the development of this SaaS application.

## 🚀 What We Have Done So Far
1.  **Project Initialization**: Set up a modern React project using **Vite**.
2.  **Architecture Design**: Created a scalable and modular folder structure to handle growth and maintainability.
3.  **Global Styling**: Configured a global CSS system in `src/styles/globals.css`.
4.  **Component Scaffolding**: Pre-created placeholder files for all major components, pages, and services.

## 📂 Folder Structure & Use Cases

| Directory | Purpose | Use Case |
| :--- | :--- | :--- |
| **`src/animations`** | Animation logic | Storing GSAP or Framer Motion configurations for smooth UI transitions (Hero, Dashboard). |
| **`src/assets`** | Static files | Storing images, SVG icons, and brand assets. |
| **`src/components`** | Reusable UI | Building small, modular components like `Navbar`, `Sidebar`, and `TaskCards`. |
| **`src/context`** | State Management | Handling global state like User Authentication (`AuthContext`). |
| **`src/hooks`** | Custom React Hooks | Encapsulating reusable logic like fetching tasks or managing study plans. |
| **`src/pages`** | Route Components | Main views of the application (Dashboard, Home, Tasks). |
| **`src/services`** | API Integration | All backend communication logic (Axios/Fetch calls) centralized here. |
| **`src/styles`** | Styling | Global CSS variables, themes, and layout rules. |
| **`src/utils`** | Helper Functions | Common utilities like date formatting and form validation. |

## 🛠️ What We Are Building
The goal is to build a **SaaS Study Planner** that helps students:
*   **Upload Syllabus**: Extract tasks from uploaded documents using the `UploadBox` component.
*   **Dashboard**: A central hub to track overall progress using `ProgressCard`.
*   **Study Plan**: An AI-generated or manual plan to manage learning schedules.
*   **Task Management**: A robust system to mark tasks as complete and track deadlines.

## 📈 Next Steps
- [ ] Implement the **Authentication** flow in `AuthContext` and `useAuth`.
- [ ] Design the **Navbar** and **Sidebar** for navigation.
- [ ] Create the **Syllabus Upload** logic in `syllabusService.js`.
- [ ] Build the interactive **Dashboard** with animations.

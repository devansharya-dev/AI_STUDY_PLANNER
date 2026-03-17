# AI Study Planner — Database Schema

This document defines the **database structure for the AI Study Planner application**.

The database will be hosted on **Supabase (PostgreSQL)**.

All tables, fields, and relationships must follow this schema exactly.

---

# 1. Tables Overview

The application will use the following tables:

users  
syllabus  
topics  
study_plans  
tasks  

---

# 2. Users Table

Table name:

users

Purpose:

Stores application users.

Columns:

id  
uuid  
primary key  

email  
text  
unique  

name  
text  

created_at  
timestamp  
default current_timestamp

Example:

id | email | name | created_at

---

# 3. Syllabus Table

Table name:

syllabus

Purpose:

Stores syllabus uploaded by the user.

Columns:

id  
uuid  
primary key  

user_id  
uuid  
foreign key → users.id  

title  
text  

content  
text  

created_at  
timestamp  
default current_timestamp

Example:

id | user_id | title | content | created_at

---

# 4. Topics Table

Table name:

topics

Purpose:

Stores topics extracted from the syllabus.

Columns:

id  
uuid  
primary key  

syllabus_id  
uuid  
foreign key → syllabus.id  

topic_name  
text  

created_at  
timestamp  
default current_timestamp

Example:

id | syllabus_id | topic_name

---

# 5. Study Plans Table

Table name:

study_plans

Purpose:

Stores generated study plans.

Columns:

id  
uuid  
primary key  

user_id  
uuid  
foreign key → users.id  

syllabus_id  
uuid  
foreign key → syllabus.id  

exam_date  
date  

total_days  
integer  

created_at  
timestamp  
default current_timestamp

Example:

id | user_id | syllabus_id | exam_date | total_days

---

# 6. Tasks Table

Table name:

tasks

Purpose:

Stores daily study tasks.

Columns:

id  
uuid  
primary key  

plan_id  
uuid  
foreign key → study_plans.id  

topic_id  
uuid  
foreign key → topics.id  

task_date  
date  

completed  
boolean  
default false  

created_at  
timestamp  
default current_timestamp

Example:

id | plan_id | topic_id | task_date | completed

---

# 7. Table Relationships

users
  ↓
syllabus
  ↓
topics
  ↓
study_plans
  ↓
tasks

Relationship details:

users.id → syllabus.user_id  

syllabus.id → topics.syllabus_id  

syllabus.id → study_plans.syllabus_id  

study_plans.id → tasks.plan_id  

topics.id → tasks.topic_id

---

# 8. Example Workflow

User signs up.

A record is created in users.

User uploads syllabus.

A record is stored in syllabus.

AI extracts topics.

Topics are stored in topics table.

User generates study plan.

A record is created in study_plans.

Daily tasks are generated.

Tasks are stored in tasks table.

User marks tasks as completed.

tasks.completed becomes true.

---

# 9. Supabase Row Level Security (RLS)

Enable RLS for all tables.

Policies:

Users can only access their own data.

Example rule:

user_id = auth.uid()

Apply this rule for:

syllabus  
study_plans  
tasks  

---

# 10. Indexes

Create indexes for faster queries.

Index fields:

user_id  
syllabus_id  
plan_id

Example:

CREATE INDEX idx_user_id ON syllabus(user_id);

CREATE INDEX idx_plan_id ON tasks(plan_id);

---

# End of Database Schema
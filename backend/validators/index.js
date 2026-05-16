const { z } = require('zod');

const taskStatusEnum = z.enum(['pending', 'completed', 'skipped']);

const getTasksSchema = z.object({
  query: z.object({
    status: taskStatusEnum.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
  }),
});

const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid Task UUID" }),
  }),
  body: z.object({
    status: taskStatusEnum,
  }),
});

const createPlanSchema = z.object({
  body: z.object({
    syllabus_id: z.string().uuid({ message: "Invalid Syllabus UUID" }),
    start_date: z.coerce.date(),
    duration_days: z.number().int().positive(),
  }),
});

const createSyllabusSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
});

module.exports = {
  getTasksSchema,
  updateTaskStatusSchema,
  createPlanSchema,
  createSyllabusSchema,
};

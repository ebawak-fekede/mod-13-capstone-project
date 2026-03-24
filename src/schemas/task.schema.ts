import { z } from 'zod';

const statusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        dueDate: z.iso.datetime().optional(),
        categoryId: z.int().positive().optional(),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        dueDate: z.union([z.iso.datetime(), z.null()]).optional(),
        categoryId: z.union([z.int().positive(), z.null()]).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Task id must be a number'),
    }),
});

export const taskQuerySchema = z.object({
    query: z.object({
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        search: z.string().optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        startDate: z.iso.datetime().optional(),
        endDate: z.iso.datetime().optional(),
        categoryId: z.string().regex(/^\d+$/).optional(),
    }),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name is required'),
    }),
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name is required'),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Category id must be a number'),
    }),
});

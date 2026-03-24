import { HttpError } from '../lib/http-error.js';
import {
    countTasks,
    createTask as createTaskRepo,
    deleteTaskById,
    findTaskByIdForUser,
    listTasks,
    updateTaskById,
} from '../repositories/task.repository.js';

function buildTaskWhere(userId: number, query: any) {
    const { status, priority, search, startDate, endDate, categoryId } = query;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = Number(categoryId);

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (startDate || endDate) {
        where.dueDate = {};
        if (startDate) where.dueDate.gte = new Date(startDate);
        if (endDate) where.dueDate.lte = new Date(endDate);
    }

    return where;
}

export async function getTasks(userId: number, query: any) {
    const pageNum = Number(query.page ?? 1);
    const limitNum = Number(query.limit ?? 10);
    const skip = (pageNum - 1) * limitNum;

    const where = buildTaskWhere(userId, query);

    const [tasks, total] = await Promise.all([
        listTasks({ where, skip, take: limitNum }),
        countTasks(where),
    ]);

    return {
        data: tasks,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
}

export async function getTask(userId: number, id: number) {
    const task = await findTaskByIdForUser(id, userId);
    if (!task) throw new HttpError(404, 'Task not found');
    return task;
}

export async function createTask(userId: number, input: any) {
    const { title, description, status, priority, dueDate, categoryId } = input;
    return createTaskRepo({
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        categoryId,
    });
}

export async function updateTask(userId: number, id: number, input: any) {
    const existing = await findTaskByIdForUser(id, userId);
    if (!existing) throw new HttpError(404, 'Task not found');

    const { title, description, status, priority, dueDate, categoryId } = input;
    return updateTaskById(id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate
            ? new Date(dueDate)
            : dueDate === null
              ? null
              : undefined,
        categoryId,
    });
}

export async function deleteTask(userId: number, id: number) {
    const existing = await findTaskByIdForUser(id, userId);
    if (!existing) throw new HttpError(404, 'Task not found');
    await deleteTaskById(id);
}

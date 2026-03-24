import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../lib/prisma.js';

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { status, priority, search, page = '1', limit = '10', startDate, endDate, categoryId } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = parseInt(categoryId as string);

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate as string);
      if (endDate) where.dueDate.lte = new Date(endDate as string);
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!task) {
      return res.status(404).json({
        error: { message: 'Task not found' },
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate, categoryId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        categoryId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: { message: 'Task not found' },
      });
    }

    const { title, description, status, priority, dueDate, categoryId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : dueDate === null ? null : undefined,
        categoryId,
      },
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: { message: 'Task not found' },
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

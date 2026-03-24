import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTask as getTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from '../services/task.service.js';

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await getTasksService(userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    const task = await getTaskService(userId, id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const task = await createTaskService(userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    const task = await updateTaskService(userId, id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    await deleteTaskService(userId, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

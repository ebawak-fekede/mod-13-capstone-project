import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getCategories as getCategoriesService,
  getProfile as getProfileService,
  updateCategory as updateCategoryService,
} from '../services/user.service.js';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await getProfileService(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const categories = await getCategoriesService(userId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name } = req.body;
    const category = await createCategoryService(userId, name);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await updateCategoryService(userId, id, name);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);
    await deleteCategoryService(userId, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

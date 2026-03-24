import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../lib/prisma.js';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' },
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const categories = await prisma.category.findMany({
      where: { userId },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        userId,
      },
    });

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

    const existingCategory = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: { message: 'Category not found' },
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = Number(req.params.id);

    const existingCategory = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: { message: 'Category not found' },
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

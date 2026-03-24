import prisma from '../lib/prisma.js';

export function listCategoriesForUser(userId: number) {
  return prisma.category.findMany({ where: { userId } });
}

export function createCategoryForUser(userId: number, name: string) {
  return prisma.category.create({ data: { userId, name } });
}

export function findCategoryByIdForUser(id: number, userId: number) {
  return prisma.category.findFirst({ where: { id, userId } });
}

export function updateCategoryById(id: number, name: string) {
  return prisma.category.update({ where: { id }, data: { name } });
}

export function deleteCategoryById(id: number) {
  return prisma.category.delete({ where: { id } });
}


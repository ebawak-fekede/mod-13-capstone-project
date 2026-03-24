import prisma from '../lib/prisma.js';

export type TaskListWhere = Record<string, unknown>;

export function listTasks(args: {
  where: TaskListWhere;
  skip: number;
  take: number;
}) {
  return prisma.task.findMany({
    where: args.where as any,
    skip: args.skip,
    take: args.take,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
}

export function countTasks(where: TaskListWhere) {
  return prisma.task.count({ where: where as any });
}

export function findTaskByIdForUser(id: number, userId: number) {
  return prisma.task.findFirst({
    where: { id, userId },
    include: { category: true },
  });
}

export function createTask(data: {
  title: string;
  description?: string;
  status?: any;
  priority?: any;
  dueDate?: Date | null;
  userId: number;
  categoryId?: number | null;
}) {
  return prisma.task.create({ data: data as any });
}

export function updateTaskById(id: number, data: Record<string, unknown>) {
  return prisma.task.update({ where: { id }, data: data as any });
}

export function deleteTaskById(id: number) {
  return prisma.task.delete({ where: { id } });
}


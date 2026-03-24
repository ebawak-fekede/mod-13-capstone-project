import { describe, expect, it, vi } from 'vitest';

import { HttpError } from '../../src/lib/http-error.js';
import { deleteTask, getTasks } from '../../src/services/task.service.js';

vi.mock('../../src/repositories/task.repository.js', () => {
  return {
    listTasks: vi.fn(),
    countTasks: vi.fn(),
    findTaskByIdForUser: vi.fn(),
    deleteTaskById: vi.fn(),
  };
});

const taskRepo = await import('../../src/repositories/task.repository.js');

describe('task.service', () => {
  it('builds filters and returns pagination', async () => {
    vi.mocked(taskRepo.listTasks).mockResolvedValueOnce([] as any);
    vi.mocked(taskRepo.countTasks).mockResolvedValueOnce(0 as any);

    const result = await getTasks(7, {
      status: 'OPEN',
      priority: 'HIGH',
      search: 'capstone',
      page: '2',
      limit: '5',
      categoryId: '3',
    });

    expect(result.pagination.page).toBe(2);
    expect(result.pagination.limit).toBe(5);
    expect(taskRepo.listTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
        where: expect.objectContaining({
          userId: 7,
          status: 'OPEN',
          priority: 'HIGH',
          categoryId: 3,
          OR: expect.any(Array),
        }),
      }),
    );
  });

  it('throws 404 when deleting missing task', async () => {
    vi.mocked(taskRepo.findTaskByIdForUser).mockResolvedValueOnce(null as any);
    await expect(deleteTask(1, 123)).rejects.toBeInstanceOf(HttpError);
    await expect(deleteTask(1, 123)).rejects.toMatchObject({ status: 404 });
  });
});


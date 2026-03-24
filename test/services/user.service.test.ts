import { describe, expect, it, vi } from 'vitest';

import { HttpError } from '../../src/lib/http-error.js';
import {
    deleteCategory,
    getProfile,
    updateCategory,
} from '../../src/services/user.service.js';

vi.mock('../../src/repositories/user.repository.js', () => {
    return {
        findUserProfileById: vi.fn(),
    };
});

vi.mock('../../src/repositories/category.repository.js', () => {
    return {
        findCategoryByIdForUser: vi.fn(),
        updateCategoryById: vi.fn(),
        deleteCategoryById: vi.fn(),
    };
});

const userRepo = await import('../../src/repositories/user.repository.js');
const categoryRepo =
    await import('../../src/repositories/category.repository.js');

describe('user.service', () => {
    it('throws 404 when profile missing', async () => {
        vi.mocked(userRepo.findUserProfileById).mockResolvedValueOnce(
            null as any,
        );
        await expect(getProfile(1)).rejects.toBeInstanceOf(HttpError);
        await expect(getProfile(1)).rejects.toMatchObject({ status: 404 });
    });

    it('throws 404 when updating missing category', async () => {
        vi.mocked(categoryRepo.findCategoryByIdForUser).mockResolvedValueOnce(
            null as any,
        );
        await expect(updateCategory(1, 2, 'x')).rejects.toMatchObject({
            status: 404,
        });
    });

    it('throws 404 when deleting missing category', async () => {
        vi.mocked(categoryRepo.findCategoryByIdForUser).mockResolvedValueOnce(
            null as any,
        );
        await expect(deleteCategory(1, 2)).rejects.toMatchObject({
            status: 404,
        });
    });
});

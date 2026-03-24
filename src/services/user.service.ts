import { HttpError } from '../lib/http-error.js';
import {
    createCategoryForUser,
    deleteCategoryById,
    findCategoryByIdForUser,
    listCategoriesForUser,
    updateCategoryById,
} from '../repositories/category.repository.js';
import { findUserProfileById } from '../repositories/user.repository.js';

export async function getProfile(userId: number) {
    const user = await findUserProfileById(userId);
    if (!user) throw new HttpError(404, 'User not found');
    return user;
}

export function getCategories(userId: number) {
    return listCategoriesForUser(userId);
}

export function createCategory(userId: number, name: string) {
    return createCategoryForUser(userId, name);
}

export async function updateCategory(userId: number, id: number, name: string) {
    const existing = await findCategoryByIdForUser(id, userId);
    if (!existing) throw new HttpError(404, 'Category not found');
    return updateCategoryById(id, name);
}

export async function deleteCategory(userId: number, id: number) {
    const existing = await findCategoryByIdForUser(id, userId);
    if (!existing) throw new HttpError(404, 'Category not found');
    await deleteCategoryById(id);
}

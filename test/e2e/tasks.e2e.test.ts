import request from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';

import app from '../../src/app.js';
import prisma from '../../src/lib/prisma.js';

describe('Tasks Endpoints E2E', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
        // Register a user to get a token
        const res = await request(app).post('/auth/register').send({
            email: 'tasks_user@example.com',
            password: 'password123',
            name: 'Tasks User',
        });
        token = res.body.token;
        userId = res.body.user.id;
    });

    describe('GET /tasks (Auth Guard)', () => {
        it('returns 401 if no token provided', async () => {
            const res = await request(app).get('/tasks');
            expect(res.status).toBe(401);
            expect(res.body.error.message).toMatch(/No token provided/);
        });
    });

    describe('POST /tasks', () => {
        it('creates a new task', async () => {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Buy groceries',
                    description: 'Milk, bread, eggs',
                    priority: 'HIGH',
                });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                title: 'Buy groceries',
                description: 'Milk, bread, eggs',
                priority: 'HIGH',
                status: 'OPEN',
                userId,
            });
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('createdAt');
        });

        it('returns 400 if title is missing', async () => {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'No title provided',
                });

            expect(res.status).toBe(400);
            expect(res.body.error.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ path: 'body.title' }),
                ]),
            );
        });
    });

    describe('GET /tasks', () => {
        it('returns an empty paginated list initially', async () => {
            // Use a different user for isolated list test
            const userRes = await request(app).post('/auth/register').send({
                email: 'empty@example.com',
                password: 'password123',
            });
            const emptyToken = userRes.body.token;

            const res = await request(app)
                .get('/tasks')
                .set('Authorization', `Bearer ${emptyToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 10,
                },
            });
        });

        it('lists tasks with pagination and filters', async () => {
            // Create a few tasks
            await prisma.task.createMany({
                data: [
                    { title: 'Task 1', status: 'OPEN', userId },
                    { title: 'Task 2', status: 'IN_PROGRESS', userId },
                    { title: 'Task 3', status: 'COMPLETED', userId },
                ],
            });

            // 1. Pagination check
            const resPage = await request(app)
                .get('/tasks?page=1&limit=2')
                .set('Authorization', `Bearer ${token}`);
            
            expect(resPage.status).toBe(200);
            expect(resPage.body.data).toHaveLength(2);
            expect(resPage.body.pagination.total).toBeGreaterThanOrEqual(3);
            expect(resPage.body.pagination.totalPages).toBeGreaterThanOrEqual(2);

            // 2. Status filter check
            const resFilter = await request(app)
                .get('/tasks?status=IN_PROGRESS')
                .set('Authorization', `Bearer ${token}`);
            
            expect(resFilter.status).toBe(200);
            expect(resFilter.body.data.every((t: any) => t.status === 'IN_PROGRESS')).toBe(true);
            expect(resFilter.body.data.length).toBeGreaterThanOrEqual(1);

            // 3. Search check
            const resSearch = await request(app)
                .get('/tasks?search=Task 3')
                .set('Authorization', `Bearer ${token}`);
                
            expect(resSearch.status).toBe(200);
            expect(resSearch.body.data[0].title).toBe('Task 3');
        });
    });

    describe('GET /tasks/:id', () => {
        it('returns a task by id', async () => {
            const task = await prisma.task.create({
                data: { title: 'Specific task', userId },
            });

            const res = await request(app)
                .get(`/tasks/${task.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(task.id);
            expect(res.body.title).toBe('Specific task');
        });

        it('returns 404 if task not found or belongs to another user', async () => {
            const res = await request(app)
                .get('/tasks/999999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.error.message).toMatch(/not found/i);
        });
    });

    describe('PUT /tasks/:id', () => {
        it('updates an existing task', async () => {
            const task = await prisma.task.create({
                data: { title: 'Old title', userId },
            });

            const res = await request(app)
                .put(`/tasks/${task.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'New title',
                    status: 'COMPLETED',
                });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('New title');
            expect(res.body.status).toBe('COMPLETED');

            // Verify DB implicitly updated
            const dbTask = await prisma.task.findUnique({ where: { id: task.id } });
            expect(dbTask?.status).toBe('COMPLETED');
        });

        it('returns 404 if task to update is not found', async () => {
            const res = await request(app)
                .put('/tasks/999999')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'New title' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('deletes an existing task', async () => {
            const task = await prisma.task.create({
                data: { title: 'To be deleted', userId },
            });

            const res = await request(app)
                .delete(`/tasks/${task.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(204);
            
            // Verify deleted from DB
            const dbTask = await prisma.task.findUnique({ where: { id: task.id } });
            expect(dbTask).toBeNull();
        });

        it('returns 404 if task to delete is not found', async () => {
            const res = await request(app)
                .delete('/tasks/999999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
        });
    });
});

import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import app from '../../src/app.js';
import prisma from '../../src/lib/prisma.js';

describe('Users & Categories Endpoints E2E', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
        // Register a user to get a token and set up session
        const res = await request(app).post('/auth/register').send({
            email: 'user_e2e@example.com',
            password: 'password123',
            name: 'User E2E',
        });
        token = res.body.token;
        userId = res.body.user.id;
    });

    describe('GET /users/profile', () => {
        it('returns 401 if no token provided', async () => {
            const res = await request(app).get('/users/profile');
            expect(res.status).toBe(401);
        });

        it('returns the authenticated users profile', async () => {
            const res = await request(app)
                .get('/users/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                id: userId,
                email: 'user_e2e@example.com',
                name: 'User E2E',
            });
            // Should exclude password
            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toHaveProperty('createdAt');
        });
    });

    describe('GET /users/categories', () => {
        it('returns an empty list initially', async () => {
            const res = await request(app)
                .get('/users/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('POST /users/categories', () => {
        it('creates a new category', async () => {
            const res = await request(app)
                .post('/users/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Work',
                });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                name: 'Work',
                userId,
            });
            expect(res.body).toHaveProperty('id');
        });

        it('fails validation without name', async () => {
            const res = await request(app)
                .post('/users/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error.message).toBe('Validation failed');
            expect(res.body.error.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ path: 'body.name' }),
                ]),
            );
        });
    });

    describe('PUT /users/categories/:id', () => {
        it('updates an existing category', async () => {
            const category = await prisma.category.create({
                data: { name: 'Personal', userId },
            });

            const res = await request(app)
                .put(`/users/categories/${category.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Hobbies' });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Hobbies');

            // Verify in DB
            const dbCat = await prisma.category.findUnique({
                where: { id: category.id },
            });
            expect(dbCat?.name).toBe('Hobbies');
        });

        it('returns 404 if category not found', async () => {
            const res = await request(app)
                .put('/users/categories/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Hobbies' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /users/categories/:id', () => {
        it('deletes an existing category', async () => {
            const category = await prisma.category.create({
                data: { name: 'To be deleted', userId },
            });

            const res = await request(app)
                .delete(`/users/categories/${category.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(204);

            // DB check
            const dbCat = await prisma.category.findUnique({
                where: { id: category.id },
            });
            expect(dbCat).toBeNull();
        });

        it('returns 404 if category to delete not found', async () => {
            const res = await request(app)
                .delete('/users/categories/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
        });
    });
});

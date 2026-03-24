import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app.js';
import prisma from '../../src/lib/prisma.js';

describe('Auth Endpoints E2E', () => {
    describe('POST /auth/register', () => {
        it('registers a new user successfully', async () => {
            const res = await request(app).post('/auth/register').send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toMatchObject({
                email: 'test@example.com',
                name: 'Test User',
            });
            expect(res.body.user).not.toHaveProperty('password');

            // Verify in database
            const dbUser = await prisma.user.findUnique({
                where: { email: 'test@example.com' },
            });
            expect(dbUser).toBeDefined();
            expect(dbUser?.name).toBe('Test User');
        });

        it('returns 409 if email already exists', async () => {
            await request(app).post('/auth/register').send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

            const res = await request(app).post('/auth/register').send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(409);
            expect(res.body.error.message).toMatch(/already exists/i);
        });

        it('returns 400 for bad validation (missing password)', async () => {
            const res = await request(app).post('/auth/register').send({
                email: 'bad@example.com',
            });

            expect(res.status).toBe(400);
            expect(res.body.error.message).toBe('Validation failed');
            expect(res.body.error.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ path: 'body.password' }),
                ]),
            );
        });
    });

    describe('POST /auth/login', () => {
        it('logs in an existing user and returns token', async () => {
            // Register first
            await request(app).post('/auth/register').send({
                email: 'login@example.com',
                password: 'password123',
            });

            const res = await request(app).post('/auth/login').send({
                email: 'login@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('login@example.com');
        });

        it('returns 401 for wrong password', async () => {
            await request(app).post('/auth/register').send({
                email: 'wrong@example.com',
                password: 'password123',
            });

            const res = await request(app).post('/auth/login').send({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });

            expect(res.status).toBe(401);
            expect(res.body.error.message).toBe('Invalid credentials');
        });

        it('returns 401 for non-existent user', async () => {
            const res = await request(app).post('/auth/login').send({
                email: 'doesnotexist@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(401);
            expect(res.body.error.message).toBe('Invalid credentials');
        });
    });
});

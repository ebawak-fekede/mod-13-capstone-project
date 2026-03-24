# Task Management API

Production-style REST API built with Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT, bcrypt, and Zod.

Node version: 24 LTS.

## Features

- Auth: register and login with hashed passwords and JWT.
- User: authenticated profile endpoint.
- Tasks: full CRUD, filtering, search, date-range filter, pagination.
- Categories: create/read/update/delete categories per user.
- Middleware: request logging, centralized error handling, request validation.
- Testing: Vitest unit and integration tests.

## Endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /users/profile`
- `GET /users/categories`
- `POST /users/categories`
- `PUT /users/categories/:id`
- `DELETE /users/categories/:id`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Environment Variables

Create `.env` with:

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_api
JWT_SECRET=secure-secret
LOG_LEVEL=info
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0
```

## Local Setup

```bash
npm install
npm run build
npm run dev
```

## Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Test

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_api npm test
```

## Docker

```bash
docker compose up --build
```

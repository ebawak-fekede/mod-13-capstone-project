import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';
import { afterAll, afterEach, beforeAll } from 'vitest';

import prisma from '../src/lib/prisma.js';

const MAIN_SCHEMA = resolve('prisma/schema.prisma');
const TMP_SCHEMA = resolve(`prisma/.schema.test.${process.pid}.prisma`);
const TEST_DB = resolve(`test/test.${process.pid}.db`);

beforeAll(async () => {
    // Remove stale test DB if it exists
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);

    // Derive a SQLite-provider schema from the main Prisma schema
    const schema = readFileSync(MAIN_SCHEMA, 'utf-8');
    const sqliteSchema = schema.replace(
        'provider = "postgresql"',
        'provider = "sqlite"',
    );
    writeFileSync(TMP_SCHEMA, sqliteSchema);

    // Use Prisma CLI to generate SQLite DDL from the schema and execute it
    const ddl = execSync(
        `npx prisma migrate diff --from-empty --to-schema ${TMP_SCHEMA} --script`,
        { encoding: 'utf-8' },
    );

    unlinkSync(TMP_SCHEMA);

    // Apply DDL using prisma db execute
    const ddlFile = resolve(`test/.migrate.${process.pid}.sql`);
    writeFileSync(ddlFile, ddl);
    execSync(
        `env DATABASE_URL="file:${TEST_DB}" npx prisma db execute --file ${ddlFile}`,
        { encoding: 'utf-8' },
    );
    unlinkSync(ddlFile);
});

// Clean all data after the entire test suite finishes
afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
    // Clean up test database file
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
});

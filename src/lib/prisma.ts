import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}

let prisma: PrismaClient;

// In test mode, use SQLite with better-sqlite3 adapter
if (process.env.NODE_ENV === 'test') {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

    const adapter = new PrismaBetterSqlite3({ url: connectionString });

    prisma = new PrismaClient({
        adapter,
        log: [],
    });
} else {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
    });
}

export default prisma;

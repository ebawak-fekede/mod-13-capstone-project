import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const MAIN_SCHEMA = resolve('prisma/schema.prisma');
const TMP_SCHEMA = resolve('prisma/.schema.test.prisma');

// 1. Read main schema
let schema = readFileSync(MAIN_SCHEMA, 'utf-8');

// 2. Change provider to sqlite
schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');

// 3. Change output path to a dedicated test client directory
schema = schema.replace(
    'provider = "prisma-client-js"',
    'provider = "prisma-client-js"\n  output   = "../node_modules/@prisma/client-test"',
);

// 4. Write it to testing schema file
writeFileSync(TMP_SCHEMA, schema);

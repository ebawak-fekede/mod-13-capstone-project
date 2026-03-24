import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./test/setup.ts', './test/db-setup.ts'],
        globals: true,
        environment: 'node',
        hookTimeout: 30000,
    },
    resolve: {
        alias: {
            '@prisma/client': path.resolve(
                __dirname,
                './node_modules/@prisma/client-test',
            ),
        },
    },
});

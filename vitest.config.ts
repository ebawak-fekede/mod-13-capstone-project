import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./test/setup.ts', './test/db-setup.ts'],
        globals: true,
        environment: 'node',
    },
});

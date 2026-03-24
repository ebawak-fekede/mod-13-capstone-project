// Set test environment variables FIRST before any imports
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = `file:./test/test.${process.pid}.db`;
process.env.JWT_SECRET ??= 'test-secret';
process.env.SENTRY_DSN ??= '';
process.env.SENTRY_TRACES_SAMPLE_RATE ??= '0';

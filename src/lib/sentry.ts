import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN;

Sentry.init({
    dsn,
    enabled: Boolean(dsn),
    environment:
        process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    sendDefaultPii: true,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
});

export { Sentry };

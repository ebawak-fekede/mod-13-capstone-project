import express from 'express';
import swaggerUi from 'swagger-ui-express';

import openApiSpec from './docs/openapi.js';
import { Sentry } from './lib/sentry.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { requestLogger } from './middlewares/request-logger.middleware.js';
import authRoutes from './routes/auth.route.js';
import taskRoutes from './routes/task.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get('/debug-sentry', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: { message: 'Not found' } });
    }
    throw new Error('Sentry debug endpoint error');
});

// Must be after all routes, but before other error-handling middleware.
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

export default app;

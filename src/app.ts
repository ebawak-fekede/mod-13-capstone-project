import express from 'express';
import { requestLogger } from './middlewares/request-logger.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import authRoutes from './routes/auth.route.js';
import taskRoutes from './routes/task.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

export default app;

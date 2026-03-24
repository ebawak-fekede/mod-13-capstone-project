import express from 'express';
import { requestLogger } from './middlewares/request-logger.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use(errorHandler);

export default app;
